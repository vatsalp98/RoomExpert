import {DownloadOutlined, InboxOutlined, PictureOutlined, RedoOutlined, StarTwoTone} from "@ant-design/icons";
import {
  Upload,
  message,
  type UploadFile,
  type UploadProps,
  Button, type  SelectProps, Select, Divider,
} from "antd";
import type { RcFile } from "antd/es/upload";
import { ID, Storage } from "appwrite";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import {api} from "~/utils/api";
import { LoadingSpinner } from "~/components/loadingPage";
import downloadFile, {appendNewToName, client} from "~/utils/utils";
import {useRouter} from "next/router";
import downloadPhoto from "~/utils/utils";
import Empty from "antd/es/empty/empty";
import Header from "~/components/header";
import Footer from "~/components/footer";


const { Dragger } = Upload;

const optionsRoomType: SelectProps['options'] = [
  {
    label: "Gaming Room",
    value: "Gaming Room",
  },
  {
    label: "Living Room",
    value: "Living Room",
  },
  {
    label: "Dining Room",
    value: "Dining Room",
  },
  {
    label: "Bedroom",
    value: "Bedroom",
  },
  {
    label: "Bathroom",
    value: "Bathroom",
  },
  {
    label:  "Office",
    value: "Office",
  }
];

const optionsRoomThemes: SelectProps['options'] = [
  {
    label: "Modern",
    value: "modern",
  },
  {
    label: "Vintage",
    value: "vintage",
  },
  {
    label: "Minimalist",
    value: "minimalist",
  },
  {
    label: "Professional",
    value: "professional",
  },
  {
    label: "Tropical",
    value: "tropical",
  },
];


export default function DashboardPage() {
  const storage = new Storage(client);
  const [previewImage, setPreviewImage] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [roomType, setRoomType] = useState('bedroom');
  const [roomTheme, setRoomTheme] = useState('modern');


  const { mutate: generateImage, isLoading: generateLoading, data: generatedImage} = api.example.generate.useMutation();

  const props: UploadProps = {
    name: "file",
    listType: "picture",
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
    setLoading(true);
    const promise = storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID as string,
      ID.unique(),
      fileList[0] as RcFile
    );

    promise.then( function (response) {
      const filePromise = storage.getFilePreview(process.env.NEXT_PUBLIC_BUCKET_ID as string, response.$id);
      setPreviewImage(filePromise.toString());
      setLoading(false);
    }, function (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      void messageApi.error(error.message);
      setLoading(false);
    })
  };

  const handleGenerate = () => {
    // console.log(roomType, roomTheme);
    generateImage({
      image_url: previewImage,
      room: roomType,
      theme: roomTheme,
      user_id: "user_uid",
    });
  }

  const uploadButton = (
      <div className="p-1 text-white">
        <p className="text-[45px] text-white">
          <InboxOutlined />
        </p>
        <p className="font-bold text-md text-white">
          Click or drag file to this area to upload
        </p>
        <p className="font-sm text-white pt-2">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </div>
  );


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
      <div className={"flex max-w-screen mx-auto flex-col items-center justify-center py-2 min-h-screen bg-[#17181C] text-white"}>
        <Header />
        <main className={"flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8"}>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
            Generate your <span className="text-blue-600">dream</span> room
          </h1>
          <div className={"relative w-full overflow-hidden inset-x-0 flex flex-row"}>
            <div className={"flex justify-between items-center w-full flex-col mt-4"}>
              <div className={"justify-center pl-20"}>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex flex-col mt-3 items-center space-x-3">
                      <p className="text-center mb-6 font-medium ">
                        Choose your room theme.
                      </p>
                      <Select
                          allowClear
                          style={{ width: '100%', color: "black" }}
                          placeholder="Please select"
                          defaultValue={'modern'}
                          className={"text-black"}
                          options={optionsRoomThemes}
                          onChange={(value: string) => {
                            setRoomTheme(value);
                          }}
                      />
                    </div>

                  </div>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex flex-col mt-10 items-center space-x-3">
                      <p className="text-center mb-6 font-medium">
                        Choose your room type.
                      </p>
                      <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Please select"
                          defaultValue={'bedroom'}
                          options={optionsRoomType}
                          onChange={(value: string) => {
                            setRoomType(value);
                          }}
                      />
                    </div>

                  </div>
                  {
                    !previewImage ? <div className="mt-4 w-full max-w-sm">
                      <div className="flex flex-col mt-6 w-96 items-center space-x-3">
                        <p className="text-center mb-6 font-medium">
                          Upload your room photo.
                        </p>
                        <Dragger {...props}>
                          {fileList.length >= 1 ? null : uploadButton}
                        </Dragger>
                      </div>
                    </div> : <div className={"border flex rounded-lg p-5 mt-6 justify-center"}>
                      <Image src={previewImage} alt={"Uploaded Photo"} width={300} height={300}/>
                    </div>
                  }
                  {
                      !previewImage && <div className={"mt-4 w-full max-w-sm"}>
                        <div className="flex flex-col mt-6 w-96 items-center space-x-3">
                          <Button type={"default"} className={"text-white"} onClick={handleUpload} loading={loading}>
                            Upload
                          </Button>
                        </div>
                      </div>
                  }
                  {
                      !!previewImage && <div className={"mt-4 w-full max-w-sm"}>
                        <div className="flex flex-col mt-6 w-96 items-center space-x-3">
                          <Button type={"default"} className={"text-white"} onClick={handleGenerate}>
                            Generate
                          </Button>
                        </div>
                      </div>
                  }

                </div>
            </div>
            <div className={"flex justify-between items-center w-full flex-col mt-4"}>
              <div className="space-y-4 w-full max-w-sm">
                <div className="flex flex-col mt-3 items-center space-x-3">
                  <p className="text-center mb-6 font-medium ">
                    Generated Image
                  </p>
                  {
                    generateLoading && <div className={"border rounded-lg p-10"}>
                        <LoadingSpinner />
                      </div>
                  }
                  {!generateLoading && !generatedImage && <div className={"border rounded-lg p-10"}>
                          <PictureOutlined className={"text-5xl"}/>
                          <p className={"pt-2 font-semibold "}>
                            Generate your dream room design!
                          </p>
                      </div>
                  }
                  {
                    generatedImage && <div className={"border rounded-lg p-10"}><Image alt={"generated Image"} src={generatedImage} width={500} height={500} /></div>
                  }
                </div>
              </div>
              {
                  !!generatedImage && <div className={"flex justify-between items-center w-full flex-col mt-4"}>
                    <div className="space-y-4 w-full max-w-sm">
                      <div className="flex flex-row mt-3 items-center space-x-3 justify-center">
                        <Button type={"primary"} icon={<DownloadOutlined/>} onClick={() => {
                          downloadPhoto(generatedImage, appendNewToName("generated_room.png"));
                        }}>
                          Download
                        </Button>
                        <Button type={"primary"} icon={<RedoOutlined />} onClick={() => {
                          setPreviewImage("");
                          setFileList([]);
                        }}>
                          Restart
                        </Button>
                      </div>
                    </div>
                  </div>
              }

            </div>
          </div>
        </main>
      <Footer />
      </div>
    </>
  );
}


//<main className="flex min-h-screen flex-col items-center justify-center bg-[#17181C] text-white">
//         <div className="container flex flex-col items-center justify-center gap-12 rounded-lg bg-white/20 px-4 py-16">
//           <div>
//             <Link href={"/"}>Home</Link>
//           </div>
//           <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[5rem]">
//             <span className="text-[hsl(280,100%,70%)]">Dashboard</span>
//           </h1>
//           <div className={"flex flex-col"}>
//             <div className="text-white ">
//               <Dragger {...props}>
//                 <div className="p-1">
//                   <p className="ant-upload-drag-icon">
//                     <InboxOutlined />
//                   </p>
//                   <p className="ant-upload-text">
//                     Click or drag file to this area to upload
//                   </p>
//                   <p className="ant-upload-hint">
//                     Support for a single or bulk upload. Strictly prohibited from
//                     uploading company data or other banned files.
//                   </p>
//                 </div>
//               </Dragger>
//             </div>
//             <div>
//               <Button onClick={handleUpload}>Upload</Button>
//             </div>
//           </div>
//           <div>
//             <Table >
//
//             </Table>
//           </div>
//           <div>
//             <h2>Result</h2>
//           </div>
//         </div>
//       </main>