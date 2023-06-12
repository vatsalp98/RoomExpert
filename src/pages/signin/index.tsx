import { Button, Form, Input, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { Client, Account } from "appwrite";
import { appwrite_config } from "../config";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SigninPage() {
  const client = new Client()
    .setEndpoint(appwrite_config.endpoint)
    .setProject(appwrite_config.projectId);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const account = new Account(client);

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    const result = account.createEmailSession(values.email, values.password);

    result.then(
      function (response) {
        if (response.userId) void router.push("/dashboard");
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
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
      </main>
    </>
  );
}
