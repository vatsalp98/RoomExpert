import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const {
    mutate: createAccount,
    error,
    isSuccess,
  } = api.example.createAccount.useMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const handleSignup = (values: {
    email: string;
    name: string;
    password: string;
    phone: string;
  }) => {
    console.log(values);
    return createAccount({
      email: values.email,
      name: values.name,
      password: values.password,
      phone: values.phone,
    });
  };

  const handleCancel = () => {
    if (error) void messageApi.error(error.message);
  };

  if (isSuccess) {
    void router.push("/dashboard");
  }

  return (
      <>
        {contextHolder}
        <Head>
          <title>RoomExpert | Signup</title>
          <meta
              name="description"
              content="Welcome to the best room decorator ever."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen bg-[#17181C] items-center justify-center font-poppins">
          <div className="p-10 bg-white backdrop-blur-md bg-white bg-opacity-20 rounded-lg shadow-lg max-w-xl w-full text-white space-y-8">
            <div className="flex justify-start">
              <Link href={"/"}><ArrowLeftOutlined/></Link>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              <span className="text-[h#ffffff]">Signup Form</span>
            </h1>
            <div className="text-white ">
              <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  autoComplete="off"
                  onFinish={handleSignup}
                  onFinishFailed={handleCancel}
                  style={{
                    color: "white",
                  }}
              >
                <Form.Item
                    label={<span className="text-[#ffffff] font-poppins">Email</span>}
                    name={"email"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                    ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                    label={<span className="text-[#ffffff] font-poppins">Name</span>}
                    name={"name"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your name!",
                      },
                    ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                    label={<span className="text-[#ffffff] font-poppins">Phone</span>}
                    name={"phone"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Phone Number!",
                      },
                    ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                    label={<span className="text-[#ffffff] font-poppins">Password</span>}
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
                      type="primary"
                      htmlType="submit"
                      className={`px-8 pb-8 rounded text-lg font-bold ${loading ? 'opacity-50' : ''}`}
                      disabled={loading}
                  >
                    {loading ? <LoadingOutlined spin /> : 'Sign up'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </main>
      </>
  );
}
