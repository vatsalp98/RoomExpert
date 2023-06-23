import {initTRPC, TRPCError} from "@trpc/server";
import {type CreateNextContextOptions} from "@trpc/server/adapters/next";
import superjson from "superjson";
import {ZodError} from "zod";
import {Account, Client, Databases, Functions, Graphql, Storage, Users} from "node-appwrite";
import Replicate from "replicate";
import {env} from "~/env.mjs";

const createInnerTRPCContext = () => {
    const client = new Client()
        .setEndpoint(env.APPWRITE_ENDPOINT)
        .setProject(env.PROJECT_ID)
        .setKey(env.APPWRITE_KEY);

    const replicate = new Replicate({
        auth: env.REPLICATE_API_KEY,
    });

    const account = new Account(client);
    const database = new Databases(client);
    const users = new Users(client);
    const storage = new Storage(client);
    const graphql = new Graphql(client);
    const functions = new Functions(client);

    return {
        sdk: {
            account,
            database,
            users,
            storage,
            graphql,
            functions,
            replicate,
        },
    };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
    return createInnerTRPCContext();
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({shape, error}) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

const isAuthed = t.middleware(async ({next, ctx}) => {
    if (!ctx.sdk.account) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not connected to APPWRITE",
        });
    }
    return next({
        ctx: {
            sdk: ctx.sdk,
        }
    });
});

export const createTRPCRouter = t.router;
export const appWriteProcedure = t.procedure.use(isAuthed);
