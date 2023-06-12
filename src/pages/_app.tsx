import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ConfigProvider } from "antd";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
            colorPrimary: "#003BA1",
            colorText: "#000000",
        },
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
};

export default api.withTRPC(MyApp);
