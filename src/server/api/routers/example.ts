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
        console.log(json_payload);
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

        // let products = [];
        console.log(response_objects['clarifai']['items'][0]);
        // while (products.length == 0) {
        //     const url2 = 'https://appwrite-hackathon.gottacatchemall.repl.co/get_product';
        //     const json_payload2 = {
        //         "detected_object": response_objects['clarifai']['items'][0],
        //         "image_url": input.image_url,
        //     };
        //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //     const result = await fetch(url2, {
        //         method: 'POST',
        //         body: JSON.stringify(json_payload2),
        //     });
        //     const body = await result.text();
        //     console.log(body);
        // }

        return response_objects['clarifai']['items'];
    }),

    generate: appWriteProcedure.input(
        z.object({
            user_id: z.string(),
            image_url: z.string(),
            theme: z.string(),
            room: z.string(),
        })
    ).mutation(async ({ctx, input}) => {
        const result = await ctx.sdk.replicate.predictions.create({
            version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
            webhook_events_filter: ['completed'],
            webhook: "https://ca69-142-58-216-147.ngrok.io/api/webhook?user_id=" + input.user_id,
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
        });
        if (result.status == "starting") {
            return result.id;
        }

        // const result = await ctx.sdk.functions.createExecution("648a4c57583f5861837e", JSON.stringify({
        //     user_id: input.user_id as string,
        //     image_url: input.image_url,
        //     theme: input.theme,
        //     room: input.room,
        // }));
        // const status = result.response;
        // console.log(result);
        // return status;
        // const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Token ${process.env.REPLICATE_API_KEY ?? ""}`,
        //     },
        //     body: JSON.stringify({
        //         version: process.env.REPLICATE_MODEL_VERSION,
        //         input: {
        //             image: input.image_url,
        //             prompt:
        //                 input.room === "Gaming Room"
        //                     ? "a room for gaming with gaming computers, gaming consoles, and gaming chairs"
        //                     : `a ${input.theme.toLowerCase()} ${input.room.toLowerCase()}`,
        //             a_prompt:
        //                 "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
        //             n_prompt:
        //                 "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
        //         },
        //     }),
        // });
        //
        // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // const jsonStartResponse = await startResponse.json();
        // console.log(jsonStartResponse);
        // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        // const endpointUrl = jsonStartResponse.urls.get;
        // let restoredImage: string | null = null;
        // while (!restoredImage) {
        //     // Loop in 1s intervals until the alt text is ready
        //     console.log("waiting for result...");
        //     const finalResponse = await fetch(endpointUrl as string, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Token ${process.env.REPLICATE_API_KEY ?? ""}`,
        //         },
        //     });
        //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //     const jsonFinalResponse = await finalResponse.json();
        //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //     if (jsonFinalResponse.status === "succeeded") {
        //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        //         restoredImage = jsonFinalResponse.output[1];
        //         await ctx.sdk.database.createDocument(
        //             process.env.ROOMS_DATABASE_ID as string,
        //             process.env.AI_ROOMS_COLLECTION_ID as string,
        //             ID.unique(),
        //             {
        //                 user_id: input.user_id as string,
        //                 user_image_url: input.image_url,
        //                 createdAt: new Date().toISOString(),
        //                 input_prompt: `A ${input.theme} ${input.room}`,
        //                 generated_image_url: restoredImage,
        //             }
        //         );
        //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //     } else if (jsonFinalResponse.status === "failed") {
        //         break;
        //     } else {
        //         await new Promise((resolve) => setTimeout(resolve, 1000));
        //     }
        // }
        // return restoredImage;
    }),
});
