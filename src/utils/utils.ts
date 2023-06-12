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

const downloadFile = (url: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = <string>url.split('/').pop();
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();

    // Clean up the dynamically created anchor element
    anchor.remove();
};

export default downloadFile;