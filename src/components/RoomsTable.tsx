import type {ColumnsType} from 'antd/es/table';
import {Button, Popover, Space, Table} from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type {Models} from "appwrite";
import {EyeOutlined} from "@ant-design/icons";

dayjs.extend(relativeTime);

export interface GeneratedRoom {
    user_id: string,
    createdAt: string,
    input_prompt: string,
    generated_image_url: string,
    user_image_url: string,
}

const PopoverContent = (record: Models.Document, isUser: boolean) => (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    isUser ? <Image src={record.user_image_url} alt={"Image"} width={250} height={250}/> :
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <Image src={record.generated_image_url} alt={"Image"} width={250} height={250}/>
);


type Props = {
    data: Models.Document[],
    loading: boolean,
    showModalCallback: any,
    setPredictionCallback: any,
    getObjectCall: any,
}

export default function RoomTable(props: Props) {
    const columns: ColumnsType<Models.Document> = [
        {
            title: "Input Prompt",
            dataIndex: "input_prompt",
            key: "input_prompt"
        },
        {
            title: "Generated Image",
            key: "generated_image",
            render: (_, record) => (
                <Space key={record.$id}>
                    <Popover title={"Generated Image"}
                             content={PopoverContent(record, false)}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                        <a href={record.generated_image_url} target={"_blank"} className={"underline text-blue-500"}>
                            Generated Image
                        </a>
                    </Popover>
                </Space>
            ),
        },
        {
            title: "User Image",
            key: "user_image",
            render: (_, record) => (
                <Space>
                    <Popover title={"User Image"}
                             content={PopoverContent(record, true)}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                        <a href={record.user_image_url} target={"_blank"} className={"underline text-blue-500"}>
                            User Image
                        </a>
                    </Popover>
                </Space>
            ),
        },
        {
            title: "Created At",
            key: "createdAt",
            render: (_, record) => (
                <Space size={"small"}>
                    {dayjs(record.$createdAt).fromNow()}
                </Space>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined/>} onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        props.showModalCallback(true);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        props.getObjectCall({
                            image_url: record.generated_image_url as string,
                        });
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        props.setPredictionCallback({
                            user_id: record.user_id as string,
                            createdAt: record.$createdAt,
                            input_prompt: record.input_prompt as string,
                            generated_image_url: record.generated_image_url as string,
                            user_image_url: record.user_image_url as string,
                            id: record.$id,
                        });
                    }}/>
                </Space>
            ),
        }
    ];


    return (<div>
        <Table
            columns={columns}
            dataSource={props.data}
            loading={props.loading}
        />
    </div>);
}