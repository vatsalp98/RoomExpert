import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ConfigProvider } from "antd";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2e026d",
        },
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
};

export default api.withTRPC(MyApp);
