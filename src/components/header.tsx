import Link from "next/link";
import {LoginOutlined, LogoutOutlined, ThunderboltOutlined} from "@ant-design/icons";
import {useGetUser} from "~/utils/hooks/useGetUser";
import {Button, message} from "antd";
import {Account} from "appwrite";
import {client} from "~/utils/utils";
import {useRouter} from "next/router";

export default function Header() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [{user, isLoading, isError}, dispatch] = useGetUser();
    const account = new Account(client);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    return (
        <>
            {contextHolder}
            <header
                className="flex flex-row xs:flex-row justify-between items-center w-full mt-3 border-b pb-7 sm:px-4 px-2 border-gray-500 gap-2">
                <Link href="/" className="flex space-x-2">
                    <ThunderboltOutlined className={"text-3xl mt-2 text-blue-600"}/>
                    <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
                        RoomExpert
                    </h1>
                </Link>
                <div>
                    {
                        user && <Button type={"primary"} danger icon={<LogoutOutlined/>} onClick={() => {
                            const promise = account.deleteSessions();
                            promise.then(function (response) {
                                void router.push('/');
                            }, function (error) {
                                void messageApi.error("Something went wrong try again!");
                            });
                        }}>
                            Logout
                        </Button>
                    }
                    {
                        !user && <Link href={"/signin"}><Button type={"primary"} icon={<LoginOutlined/>}>
                            Signin
                        </Button></Link>
                    }

                </div>
            </header>
        </>);

}