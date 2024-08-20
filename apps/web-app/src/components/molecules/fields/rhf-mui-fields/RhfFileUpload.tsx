import { type FC } from 'react';

import { useWatch, useFormContext } from 'react-hook-form-mui';
import { FileUploader } from '~/components/organisms/FileUploader';

interface RhfFileUploadProps {
  name: string;
}

export const RhfFileUpload: FC<RhfFileUploadProps> = ({ name }) => {
  const value = useWatch({ name });
  const formContext = useFormContext();

  return <FileUploader onDrop={(acceptedFiles: File[]) => formContext.setValue(name, acceptedFiles[0])} />;
};
