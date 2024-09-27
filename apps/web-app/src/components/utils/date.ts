import { format } from "date-fns";

export const DATE_FORMAT = "dd-MMM-yyyy";

export const formatDateString = (value: string, fallback = "-") => {
  if (!value) return fallback;
  return formatDate(new Date(value));
};

export const formatDate = (value: Date, fallback = "-") => {
  if (!value) return fallback;
  return format(value, DATE_FORMAT);
};
