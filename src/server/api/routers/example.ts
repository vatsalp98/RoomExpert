import {ID} from "node-appwrite";
import {z} from "zod";
import {appWriteProcedure, createTRPCRouter} from "~/server/api/trpc";
import {env} from "~/env.mjs";
import {TRPCError} from "@trpc/server";
import type {RcFile} from "antd/es/upload";
import {Query} from "appwrite";
import {type detectedObject, type Product} from "~/utils/types";


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
            const response = await ctx.sdk.users.create(
                ID.unique(),
                input.email,
                input.phone,
                input.password,
                input.name
            );

            return response;
        }),

    listRoomsRecords: appWriteProcedure.input(
        z.object({
            user_id: z.string(),
        })
    ).query(async ({ctx, input}) => {
        return await ctx.sdk.database.listDocuments(
            env.ROOMS_DATABASE_ID,
            env.AI_ROOMS_COLLECTION_ID,
            [
                Query.equal('user_id', input.user_id),
            ]
        );
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

    getRelatedProducts: appWriteProcedure.input(
        z.object({
            object: z.any(),
            image_url: z.string(),
        })
    ).mutation(async ({input}) => {
        const url = 'https://appwrite-hackathon.gottacatchemall.repl.co/get_product';
        const json_payload = {
            "image_url": input.image_url,
            "detected_object": input.object as detectedObject,
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(json_payload),
        });
        const response = await result.text();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
        const jsonResponse: {
            "dominant_color": string,
            "products": Product[],
        } = JSON.parse(response);
        console.log(jsonResponse);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return jsonResponse;
    }),

    getObjects: appWriteProcedure.input(z.object({
        image_url: z.string(),
    })).mutation(async ({input}) => {
        const url = "https://api.edenai.run/v2/image/object_detection"
        const json_payload = {"providers": "clarifai", "file_url": input.image_url};
        const headers = {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmNlODAwNDQtMmZmMS00Y2E5LTljMjQtN2MwNDQ3MjM5NmM3IiwidHlwZSI6ImFwaV90b2tlbiJ9.bVY2wCx8_-ee-iRos77yHHi8lFNwwQJEX7GoZhdoiD0`,
            "content-type": "application/json"
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response_objects: {
            clarifai: {
                status: string,
                items: detectedObject[],
            }
        } = await fetch(url, {
            headers: {...headers},
            method: "POST",
            body: JSON.stringify(json_payload),
        }).then(r => r.json());

        return response_objects['clarifai']['items'];
    }),

    generate: appWriteProcedure.input(
        z.object({
            user_id: z.string(),
            image_url: z.string(),
            theme: z.string(),
            room: z.string(),
        })
    ).mutation(({ctx, input}) => {
        console.log(`${env.VERCEL_URL}?user_id=` + input.user_id)
        void ctx.sdk.replicate.predictions.create({
            version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
            webhook_events_filter: ['completed'],
            webhook: `https://room-expert.vercel.app/?user_id=` + input.user_id,
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
        }).then(response => {
            return response.id;
        });
    }),
});
