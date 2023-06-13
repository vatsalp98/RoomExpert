import {ArrowLeftOutlined} from "@ant-design/icons";
import {Button, Form, Input, message} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import {api} from "~/utils/api";
import Header from "~/components/header";
import Footer from "~/components/footer";
import {LoadingSpinner} from "~/components/loadingPage";

export default function SignupPage() {
    const {
        mutate: createAccount,
        error,
        isSuccess,
        isLoading,
    } = api.example.createAccount.useMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();


    const handleSignup = (values: {
        email: string;
        name: string;
        password: string;
        phone: string;
    }) => {


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
        void messageApi.success("Account successfully created, You can now Login!");
        void router.push("/signin");
    }

    if (error) {
        void messageApi.error(error.message);
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
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div
                className={"flex max-w-screen flex-col items-center justify-center py-2 min-h-screen bg-[#17181C] text-white"}>
                <Header/>
                <main className="flex w-[550px] min-h-screen bg-[#17181C] items-center justify-center font-poppins">
                    <div
                        className="p-10 bg-white backdrop-blur-md bg-opacity-20 rounded-lg shadow-lg max-w-xl w-full text-white space-y-8">
                        <div className="flex justify-start">
                            <Link href={"/"}><ArrowLeftOutlined/></Link>
                        </div>
                        <h2 className="text-5xl py-5 font-extrabold tracking-tight text-white text-center">
                            <span className="text-blue-600">Signup </span>Form
                        </h2>
                        {
                            !isLoading && <div className="text-white pt-5">
                                <Form
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 16}}
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
                                        hasFeedback={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your Email!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder={"Email Address"}/>
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
                                        <Input placeholder={"Full Name"}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="text-[#ffffff] font-poppins">Phone</span>}
                                        name={"phone"}
                                        hasFeedback={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your Phone Number!",
                                            },
                                            () => ({
                                                validator(_, value: string) {
                                                    if (value.startsWith("+")) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Please Input your phone number in International Format.'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input placeholder={"+14375225525"}/>
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
                                        <Input.Password placeholder={"Password"}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="text-[#ffffff] font-poppins">Confirm</span>}
                                        name="confirm_password"
                                        hasFeedback={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please confirm your password!",
                                            },
                                            ({getFieldValue}) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder={"Password"}/>
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 10,
                                            span: 14,
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className={`my-8 rounded text-lg font-bold ${isLoading ? 'opacity-50' : ''}`}
                                            disabled={isLoading as boolean}
                                            loading={isLoading as boolean}
                                        >
                                            Signup
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        }
                        {
                            isLoading &&
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
