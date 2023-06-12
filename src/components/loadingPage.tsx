import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const LoadingSpinner = () => {
  return (
    <div role="status">
        <Spin indicator={antIcon} size={"large"}/>
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center align-middle">
      <LoadingSpinner />
    </div>
  );
};