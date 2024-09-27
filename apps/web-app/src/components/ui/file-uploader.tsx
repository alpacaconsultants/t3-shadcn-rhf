import React, { type FC } from "react";
import { useDropzone } from "react-dropzone";

interface UploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  file?: File;
  error?: string;
}

export const FileUploader: FC<UploaderProps> = ({ onDrop, file, error }) => {
  const { getRootProps, getInputProps } = useDropzone({ maxFiles: 1, onDrop });

  return (
    <section>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center rounded-lg border-2 border-dashed bg-gray-50 p-5 text-gray-400 outline-none transition-colors duration-300 ease-in-out ${error ? "border-red-500 text-red-500" : "border-gray-300 hover:border-blue-500"} `}
      >
        <input {...getInputProps()} />
        {file ? (
          <p>
            {file.name} - {file.size} bytes
          </p>
        ) : (
          <p>Drag n drop a file here, or click to select a file</p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </section>
  );
};
