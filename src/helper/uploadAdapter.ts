import { Editor } from "@ckeditor/ckeditor5-core";
import {
  UploadAdapter,
  FileLoader,
} from "@ckeditor/ckeditor5-upload/src/filerepository";
import { REACT_APP_IMAGE_PATH } from "../config";
import axios from "axios";
export function uploadAdapter(loader: FileLoader): UploadAdapter {
  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        const body = new FormData();
        try {
          loader.file.then((file: any) => {
            body.append("BlogImage", file);
            axios
              .post(`${process.env.REACT_APP_API_URL}/blog/image`, body, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                resolve({
                  default: `${REACT_APP_IMAGE_PATH}${res.data.data}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        } catch (error) {
          reject("Your image has not been uploaded");
        }
      });
    },
    abort: () => {},
  };
}
export function uploadPlugin(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}
