import React, { type FC } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { makeStyles } from 'tss-react/mui';

const styles = makeStyles()({
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  },
});

interface UploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export const FileUploader: FC<UploaderProps> = ({ onDrop }) => {
  const { classes } = styles();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ maxFiles: 1, onDrop });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className={classes.dropzone}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag n drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>File</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};
