import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        BUCKET_ID: z.string().min(1),
        PROJECT_ID: z.string().min(1),
        AI_ROOMS_COLLECTION_ID: z.string().min(1),
        ROOMS_DATABASE_ID: z.string().min(1),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
        NEXT_PUBLIC_BUCKET_ID: z.string().min(1),
        NEXT_PUBLIC_PROJECT_ID: z.string().min(1),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_BUCKET_ID: process.env.BUCKET_ID,
        NEXT_PUBLIC_PROJECT_ID: process.env.PROJECT_ID,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
        BUCKET_ID: process.env.BUCKET_ID,
        PROJECT_ID: process.env.PROJECT_ID,
        AI_ROOMS_COLLECTION_ID: process.env.AI_ROOMS_COLLECTION_ID,
        ROOMS_DATABASE_ID: process.env.ROOMS_DATABASE_ID,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
