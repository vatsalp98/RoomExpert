import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

export const LoadingSpinner = (props: {
    size?: number,
}) => {
    const antIcon = <LoadingOutlined style={{fontSize: props.size ?? 64, color: "white"}} spin/>;
    return (
        <div className={"status"}>
            <Spin indicator={antIcon}/>
        </div>
    );
};

export const LoadingPage = () => {
    return (
        <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center align-middle">
            <LoadingSpinner/>
        </div>
    );
};