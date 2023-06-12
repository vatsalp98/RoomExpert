import { Button, Form, Input, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function SignupPage() {
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#17181C] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 rounded-lg bg-white/20 px-4 py-16">
          <div>
            <Link href={"/"}>Home</Link>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Signup Form</span>
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
                label="Email"
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
                label="Name"
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
                label="Phone Number"
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
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Signup
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </main>
    </>
  );
}
