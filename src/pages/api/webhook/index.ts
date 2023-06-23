import type {NextApiRequest, NextApiResponse} from "next";
import {Client, Databases} from "node-appwrite";
import type {Prediction} from "~/utils/types";
import {env} from "~/env.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new Client()
        .setEndpoint(env.APPWRITE_ENDPOINT)
        .setProject(env.PROJECT_ID)
        .setKey(env.APPWRITE_KEY);

    const db = new Databases(client);
    const response = req.body as Prediction;
    const params = req.query;
    const promise = await db.createDocument(env.ROOMS_DATABASE_ID, env.AI_ROOMS_COLLECTION_ID, "unique()", {
        generated_image_url: response.output[1],
        user_image_url: response.input.image,
        user_id: params.user_id,
        createdAt: response.created_at,
        input_prompt: response.input.prompt,
    });
    return res.status(200).json(promise);
}