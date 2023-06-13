import {ID} from "node-appwrite";
import {z} from "zod";
import {appWriteProcedure, createTRPCRouter} from "~/server/api/trpc";
import {env} from "~/env.mjs";
import {TRPCError} from "@trpc/server";
import type {RcFile} from "antd/es/upload";
import {Query} from "appwrite";

export const exampleRouter = createTRPCRouter({
    createAccount: appWriteProcedure
        .input(
            z.object({
                email: z.string(),
                name: z.string(),
                password: z.string(),
                phone: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const response = await ctx.users.create(
                ID.unique(),
                input.email,
                input.phone,
                input.password,
                input.name
            );

            return response;
        }),

    listFiles: appWriteProcedure.query(async ({ctx}) => {
        try {
            return await ctx.sdk.storage.listFiles(process.env.NEXT_PUBLIC_BUCKET_ID as string);
        } catch (error) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: `something went Wrong`})
        }
    }),

    getPreview: appWriteProcedure.input(
        z.object({
            file_id: z.string(),
        })
    ).query(async ({ctx, input}) => {
        return await ctx.sdk.storage.getFilePreview(env.BUCKET_ID, input.file_id);
    }),

    createFile: appWriteProcedure.input(
        z.object({
            file: z.any(),
        })
    ).mutation(async ({ctx, input}) => {
        try {
            return await ctx.sdk.storage.createFile(env.BUCKET_ID, ID.unique(), input.file as RcFile);
        } catch (e) {
            console.log(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went Wrong",
            })
        }
    }),

    getAccount: appWriteProcedure.query(async ({ctx}) => {
        return await ctx.sdk.account.get();
    }),

    listUsers: appWriteProcedure.input(z.object({
        email: z.string().min(1),
    })).mutation(async ({ctx, input}) => {
        const result = await ctx.sdk.users.list([
            Query.equal('email', [input.email]),
        ]);

        return result.total;
    }),

    generate: appWriteProcedure.input(
        z.object({
            user_id: z.string(),
            image_url: z.string(),
            theme: z.string(),
            room: z.string(),
        })
    ).mutation(async ({input}) => {
        const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.REPLICATE_API_KEY ?? ""}`,
            },
            body: JSON.stringify({
                version: process.env.REPLICATE_MODEL_VERSION,
                input: {
                    image: input.image_url,
                    prompt:
                        input.room === "Gaming Room"
                            ? "a room for gaming with gaming computers, gaming consoles, and gaming chairs"
                            : `a ${input.theme.toLowerCase()} ${input.room.toLowerCase()}`,
                    a_prompt:
                        "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
                    n_prompt:
                        "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
                },
            }),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jsonStartResponse = await startResponse.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const endpointUrl = jsonStartResponse.urls.get;
        let restoredImage: string | null = null;
        while (!restoredImage) {
            // Loop in 1s intervals until the alt text is ready
            console.log("waiting for result...");
            const finalResponse = await fetch(endpointUrl as string, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${process.env.REPLICATE_API_KEY ?? ""}`,
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const jsonFinalResponse = await finalResponse.json();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (jsonFinalResponse.status === "succeeded") {
                console.log(jsonFinalResponse);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                restoredImage = jsonFinalResponse.output[1];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            } else if (jsonFinalResponse.status === "failed") {
                break;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        return restoredImage;
    }),
});
