import { InboxOutlined } from "@ant-design/icons";
import {
  Upload,
  message,
  type UploadFile,
  type UploadProps,
  Button,
} from "antd";
import type { RcFile } from "antd/es/upload";
import { Client, ID, Storage } from "appwrite";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { appwrite_config } from "../config";
import Image from "next/image";

const { Dragger } = Upload;

export default function DashboardPage() {
  const client = new Client()
    .setEndpoint(appwrite_config.endpoint)
    .setProject(appwrite_config.projectId);
  const storage = new Storage(client);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const props: UploadProps = {
    name: "file",
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file as RcFile);
    });

    const promise = storage.createFile(
      appwrite_config.bucked_id,
      ID.unique(),
      fileList[0] as RcFile
    );

    promise.then(
      function (response) {
        if (response.name) {
          void messageApi.success("File uploaded succesfully");
        }
      },
      function (error: { message: string; type: string; code: number }) {
        if (error) void messageApi.error(error.message);
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Head>
        <title>RoomExpert | Dashboard</title>
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
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Dashboard</span>
          </h1>
          <div className="text-white ">
            <Dragger {...props}>
              <div className="p-1">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </div>
            </Dragger>
          </div>
          <div>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
          <div>
            <h2>Result</h2>
          </div>
        </div>
      </main>
    </>
  );
}
