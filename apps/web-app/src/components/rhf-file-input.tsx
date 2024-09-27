import { type FC } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FileUploader } from "~/components/ui/file-uploader";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface RhfFileUploadProps {
  name: string;
  label: string;
  fullWidth?: boolean;
}

export const RhfFileUpload: FC<RhfFileUploadProps> = ({
  name,
  label,
  fullWidth = true,
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div
      className={cn(
        "grid w-full items-center gap-1.5",
        !fullWidth ? "max-w-sm" : "",
      )}
    >
      <Label htmlFor={name}>{label}</Label>
      <FileUploader
        onDrop={(acceptedFiles: File[]) => onChange(acceptedFiles[0])}
        file={value}
        error={!!error?.message}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  );
};
