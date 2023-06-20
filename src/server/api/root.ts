import {exampleRouter} from "~/server/api/routers/example";
import {createTRPCRouter} from "~/server/api/trpc";
import {webhookRouter} from "~/server/api/routers/webhook";

export const appRouter = createTRPCRouter({
    example: exampleRouter,
    webhooks: webhookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
