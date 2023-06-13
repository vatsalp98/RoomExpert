import { Button, Form, Input, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { Account } from "appwrite";
import { useRouter } from "next/router";
import { useState } from "react";
import {client} from "~/utils/utils";
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import "@fontsource/poppins";
export default function SigninPage() {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const account = new Account(client);

    const handleLogin = (values: { email: string; password: string }) => {
        setLoading(true);
        const result = account.createEmailSession(values.email, values.password);

        result.then(
            function (response) {
                if (response.userId) {
                    void router.push("/dashboard");
                }
            },
            function (error: { message: string; type: string; code: number }) {
                if (error) void messageApi.error(error?.message);
            }
        );
        setLoading(false);
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
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <main className="flex min-h-screen flex-col items-center justify-center bg-[#17181C] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 rounded-lg bg-white/20 px-4 py-16">
          <div>
            <Link href={"/"}>Home</Link>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Login Form</span>
          </h1>
          <div className="text-white ">
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
              onFinish={handleLogin}
              style={{
                color: "white",
              }}
            >
              <Form.Item
                label="Email"
                name={"email"}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 10,
                  span: 16,
                }}
              >
                <Button
                  type="text"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </main> */}
            <main className="flex min-h-screen bg-[#17181C] items-center justify-center font-poppins">
                <div className="p-10 bg-white backdrop-blur-md bg-white bg-opacity-20 rounded-lg shadow-lg max-w-md w-full text-white space-y-8">
                    <div className="flex justify-start">
                        <Link href="/"><ArrowLeftOutlined/> </Link>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-center">
                        <span className="text-white">Login Form</span>
                    </h1>
                    <Form
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        autoComplete="off"
                        onFinish={handleLogin}
                        className="space-y-4"
                    >
                        <Form.Item
                            label={<span className="text-[#ffffff]">Email</span>}
                            name="email"
                            style={{
                                // add style to label

                            }}
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input className="rounded pt-2 pb-2"  />
                        </Form.Item>
                        <Form.Item
                            label={<span className="text-[#ffffff]">Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password className="rounded pt-2 pb-2"

                            />
                        </Form.Item>
                        <Form.Item className="flex justify-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={`px-8 pb-8 rounded text-lg font-bold ${loading ? 'opacity-50' : ''}`}
                                disabled={loading}
                            >
                                {loading ? <LoadingOutlined spin /> : 'Login'}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </main>
        </>
    );
}
