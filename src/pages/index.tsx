import {type NextPage} from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "~/components/header";
import Footer from "~/components/footer";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>RoomExpert | Home</title>
                <meta
                    name="description"
                    content="Welcome to the best room decorator ever."
                />
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div
                className={"flex max-w-screen mx-auto flex-col items-center justify-center py-2 min-h-screen bg-[#17181C] text-white"}>
                <Header/>
                <main className="flex min-h-screen flex-col items-center justify-center bg-[#17181C] text-white">
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            Welcome to{" "}
                            <span className="text-blue-600">RoomExpert</span>
                        </h1>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                            <Link
                                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                href="/signin"
                            >
                                <h3 className="text-2xl font-bold">Login →</h3>
                                <div className="text-lg">
                                    Log into your account and start decorating your own room.
                                </div>
                            </Link>
                            <Link
                                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                href="/signup"
                            >
                                <h3 className="text-2xl font-bold">Signup →</h3>
                                <div className="text-lg">
                                    Create your account to access your personalized room expert.
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer/>
            </div>
        </>
    );
};

export default Home;
