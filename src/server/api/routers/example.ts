import { ID } from "node-appwrite";
import { z } from "zod";
import { appWriteProcedure, createTRPCRouter } from "~/server/api/trpc";

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
});
