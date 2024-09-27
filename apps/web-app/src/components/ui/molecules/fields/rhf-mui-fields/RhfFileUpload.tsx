import { type FC } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FileUploader } from "~/components/modules/FileUploader";
import { Label } from "~/components/ui/label";

interface RhfFileUploadProps {
  name: string;
  label: string;
}

export const RhfFileUpload: FC<RhfFileUploadProps> = ({ name, label }) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <FileUploader
        onDrop={(acceptedFiles: File[]) => onChange(acceptedFiles[0])}
        file={value}
        error={error?.message}
      />
    </div>
  );
};
