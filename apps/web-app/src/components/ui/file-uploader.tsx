import React, { type FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from 'tss-react/mui';
import { Typography } from '@mui/material';

const useStyles = makeStyles()((theme) => ({
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
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  error: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
  },
}));

interface UploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  file?: File;
  error?: string;
}

export const FileUploader: FC<UploaderProps> = ({ onDrop, file, error }) => {
  const { classes, cx } = useStyles();

  const { getRootProps, getInputProps } = useDropzone({ maxFiles: 1, onDrop });

  return (
    <section>
      <div {...getRootProps({ className: cx(classes.dropzone, { [classes.error]: !!error }) })}>
        <input {...getInputProps()} />
        {file ? (
          <p>
            {file.name} - {file.size} bytes
          </p>
        ) : (
          <p>Drag n drop a file here, or click to select a file</p>
        )}
      </div>
      {error && <Typography color='error'>{error}</Typography>}
    </section>
  );
};
