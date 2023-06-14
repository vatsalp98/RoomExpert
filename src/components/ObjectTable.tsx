import type {ColumnsType} from 'antd/es/table';
import {Button, Space, Table} from "antd";

interface DetectedObject {
    label: string,
    confidence: number,
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
}

type Props = {
    image_url: string,
    data: DetectedObject[],
    loading: boolean,
    handleCallback: any,
}
export default function ObjectTable(props: Props) {

    const columns: ColumnsType<DetectedObject> = [
        {
            title: "Label",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "Confidence",
            key: "confidence",
            render: (_, record) => (
                <Space size={"small"}>
                    {(record.confidence * 100).toPrecision(2)}
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size={"middle"}>
                    <Button type={"text"} onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        props.handleCallback(record);

                    }}>
                        View Products
                    </Button>
                </Space>
            ),
        }
    ]
    return (<div className={"shadow-lg p-3 border border-white/50 rounded-lg bg-white/75"}>
        <Table
            columns={columns}
            dataSource={props.data}
            loading={props.loading}
        />
    </div>);
}