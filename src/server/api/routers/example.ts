import {ID} from "node-appwrite";
import {z} from "zod";
import {appWriteProcedure, createTRPCRouter} from "~/server/api/trpc";
import {NextResponse} from "next/server";
import {env} from "~/env.mjs";
import {TRPCError} from "@trpc/server";
import {RcFile} from "antd/es/upload";

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
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.users.create(
        ID.unique(),
        input.email,
        input.phone,
        input.password,
        input.name
      );

      return response;
    }),

    listFiles: appWriteProcedure.query(async ({ctx }) => {
        try {
            return await ctx.sdk.storage.listFiles(env.BUCKET_ID );
        } catch (error){
            throw new TRPCError({code:  "INTERNAL_SERVER_ERROR", message: `something went Wrong`})
        }
    }),

    getPreview: appWriteProcedure.input(
        z.object({
            file_id: z.string(),
        })
    ).query(({ctx, input}) => {
        const promise = ctx.sdk.storage.getFilePreview(env.BUCKET_ID, input.file_id);
        promise.then(function (response) {
            return response;
        }, function (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            if(error) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: error.message})
        });
    }),

    createFile: appWriteProcedure.input(
        z.object({
            file: z.any(),
        })
    ).mutation(async ({ctx, input}) => {
        try {
            return await ctx.sdk.storage.createFile(env.BUCKET_ID, ID.unique(), input.file as RcFile);
        } catch(e) {
            console.log(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went Wrong",
            })
        }
    }),

    generate: appWriteProcedure.input(
        z.object({
            user_id: z.string(),
            image_url: z.string(),
            theme:  z.string(),
            room: z.string(),
        })
    ).mutation(async ({ctx, input}) => {
        const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.REPLICATE_API_KEY ?? ""}`,
            },
            body: JSON.stringify({
                version:
                    "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
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
            console.log("polling for result...");
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
