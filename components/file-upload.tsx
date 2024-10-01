"use client";

import { uploadToS3 } from "@/lib/s3";
import { FileText, Inbox } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const FileUpload = ({
  onFileUpload,
  defaultValue,
}: {
  onFileUpload: (url: string) => void;
  defaultValue: string;
}) => {
  const [fileName, setFileName] = useState(
    defaultValue ? defaultValue.split("/").pop() : ""
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"], "image/dng": [".dng"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please upload a smaller file.");
        return;
      }

      setFileName(file.name);

      try {
        const { url } = await uploadToS3(file, (progress) => {
          setUploadProgress(progress);
        });

        setUploadProgress(100);
        toast.success("File uploaded successfully!");
        console.log(url);
        onFileUpload(url);
      } catch (error) {
        setUploadProgress(0);
        toast.error("File upload failed.");
        console.log(error);
      }
    },
  });

  return (
    <div className="rounded-xl max-w-lg mx-auto">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer dark:bg-neutral-800 bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileText className="w-5 h-5" />
            <p className="text-sm">{fileName}</p>
          </div>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-emerald-500" />
            <p className="mt-2 text-sm text-slate-400">
              Drop your file here.
            </p>
          </>
        )}
      </div>

      {uploadProgress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-emerald-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-emerald-500">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
