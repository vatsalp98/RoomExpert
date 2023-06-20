import {appWriteProcedure, createTRPCRouter} from "~/server/api/trpc";
import {z} from "zod";


export const webhookRouter = createTRPCRouter({
    replicate: appWriteProcedure.input(
        z.any(),
    ).mutation(({ctx, input}) => {
        console.log(input);
    }),
});