import { type FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FileUploader } from '~/components/organisms/FileUploader';

interface RhfFileUploadProps {
  name: string;
}

export const RhfFileUpload: FC<RhfFileUploadProps> = ({ name }) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return <FileUploader onDrop={(acceptedFiles: File[]) => onChange(acceptedFiles[0])} file={value} error={error?.message} />;
};
