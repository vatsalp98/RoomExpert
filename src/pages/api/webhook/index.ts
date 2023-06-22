import type {NextApiRequest, NextApiResponse} from "next";
import {Client, Databases} from "node-appwrite";
import type {Prediction} from "~/utils/types";
import {env} from "~/env.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("6482fe1170f8613388e3")
        .setKey(
            "7edcaffa21c91393619b415dfedc6eb8f0b307e93c209854b180e8cb59c374524861404fe06d74e45d5d04e04147272f858ec2710c1f1a31f7c52fdfcfdfb211e3d1111382679af65c1732d0e9d6f2cb949e6853c6c2d6b9648150f48b47c15b6f83fc168c64fc360d42b889d55cfe6d38d7567ba524fb3d891a79d65cdad918"
        );

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