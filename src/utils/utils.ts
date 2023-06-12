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

function forceDownload(blobUrl: string, filename: string) {
    const a  = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export default function downloadPhoto(url: string, filename: string) {
    fetch(url, {
        headers: new Headers({
            Origin: location.origin,
        }),
        mode: "cors",
    })
        .then((response) => response.blob())
        .then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            forceDownload(blobUrl, filename);
        })
        .catch((e) => console.error(e));
}

export function appendNewToName(name: string) {
    const insertPos = name.indexOf(".");
    return name
        .substring(0, insertPos)
        .concat("-new", name.substring(insertPos));
}