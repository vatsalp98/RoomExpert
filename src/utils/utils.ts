import type {RcFile} from "antd/es/upload";
import {Client} from "appwrite";

export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT as string).setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);