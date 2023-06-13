import {initTRPC, TRPCError} from "@trpc/server";
import {type CreateNextContextOptions} from "@trpc/server/adapters/next";
import superjson from "superjson";
import {ZodError} from "zod";
import {Account, Client, Databases, Graphql, Storage, Users} from "node-appwrite";


type CreateContextOptions = Record<string, never>;


export const createInnerTRPCContext = () => {
    const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("6482fe1170f8613388e3")
        .setKey(
            "7edcaffa21c91393619b415dfedc6eb8f0b307e93c209854b180e8cb59c374524861404fe06d74e45d5d04e04147272f858ec2710c1f1a31f7c52fdfcfdfb211e3d1111382679af65c1732d0e9d6f2cb949e6853c6c2d6b9648150f48b47c15b6f83fc168c64fc360d42b889d55cfe6d38d7567ba524fb3d891a79d65cdad918"
        );

    const account = new Account(client);
    const database = new Databases(client);
    const users = new Users(client);
    const storage = new Storage(client);
    const graphql = new Graphql(client);

    return {
        sdk: {
            account,
            database,
            users,
            storage,
            graphql,
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
