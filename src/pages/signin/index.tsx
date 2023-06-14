import {Button, Form, Input, message} from "antd";
import Head from "next/head";
import Link from "next/link";
import {Account} from "appwrite";
import {useRouter} from "next/router";
import {client} from "~/utils/utils";
import {ArrowLeftOutlined} from '@ant-design/icons';
import "@fontsource/poppins";
import {LoadingSpinner} from "~/components/loadingPage";
import Header from "~/components/header";
import Footer from "~/components/footer";
import {useState} from "react";

export default function SigninPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const account = new Account(client);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment


    const handleLogin = (values: { email: string; password: string }) => {
        setLoading(true);
        const result = account.createEmailSession(values.email, values.password);
        result.then(
            function (response) {
                form.resetFields();
                setLoading(false);
                if (response.userId) {
                    void router.push({pathname: "/dashboard", query: {user_id: response.$id}});
                }
            },
            function (error: { message: string; type: string; code: number }) {
                form.resetFields();
                setLoading(false);
                if (error) void messageApi.error(error?.message);
            }
        );
    };

    return (
        <>
            {contextHolder}
            <Head>
                <title>RoomExpert | Login</title>
                <meta
                    name="description"
                    content="Welcome to the best room decorator ever."
                />
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div
                className={"flex max-w-screen flex-col items-center justify-center py-2 min-h-screen bg-[#17181C] text-white font-poppins"}>
                <Header/>
                <main className="flex min-h-screen w-[450px] bg-[#17181C] items-center justify-center font-poppins">
                    <div
                        className="p-10 bg-white backdrop-blur-md bg-opacity-20 rounded-lg shadow-lg w-full text-white space-y-8">
                        <div className="flex justify-start">
                            <Link href="/"><ArrowLeftOutlined/> </Link>
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tight text-center">
                            <span className="text-blue-600">Login </span>Form
                        </h2>
                        <div className={"text-white pt-1"}>
                            {
                                !(loading) && <Form
                                    form={form}
                                    labelCol={{span: 24}}
                                    wrapperCol={{span: 24}}
                                    autoComplete="off"
                                    onFinish={handleLogin}
                                    className="space-y-4"
                                >
                                    <Form.Item
                                        label={<span className="text-[#ffffff]">Email</span>}
                                        name="email"

                                        rules={[{required: true, message: 'Please input your username!'}]}
                                    >
                                        <Input className="rounded pt-2 pb-2" placeholder={"Email Address"}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="text-[#ffffff]">Password</span>}
                                        name="password"
                                        rules={[{required: true, message: 'Please input your password!'}]}
                                    >
                                        <Input.Password className="rounded pt-2 pb-2"
                                                        placeholder={"Password"}
                                        />
                                    </Form.Item>
                                    <Form.Item className="flex justify-center">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className={`px-8 pb-8 rounded text-lg font-bold ${loading ? 'opacity-50' : ''}`}
                                            loading={loading}
                                        >
                                            Login
                                        </Button>
                                    </Form.Item>
                                </Form>
                            }
                        </div>
                        {
                            loading &&
                            <div className={"w-full h-full flex justify-center items-center"}><LoadingSpinner
                                size={80}/></div>
                        }
                    </div>
                </main>
                <Footer/>
            </div>
        </>
    );
}
