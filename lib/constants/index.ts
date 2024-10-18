export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DYNAMIC_SELECT = "dynamicSelect",
  OTP_INPUT = "otpInput",
  SELECT = "select",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SWITCH = "switch",
  SLIDER = "slider",
  DATE_PICKER = "datePicker",
  DROP_ZONE = "dropZone",
  SKELETON = "skeleton",
  HIDDEN = "hidden",
  HONEY_POT = "honeyPot",
}

export const MAX_UPLOAD_FILE_SIZE = 5242880; // 5MB
export const DEFAULT_MAX_FILES = 5;
export const DEFAULT_MIN_FILE = 1;
export const OPT_LENGTH = 6;

export enum UploaderType {
  MULTIPLE_ANY = "multiple_any",
  SINGLE_ANY = "single_any",
  SINGLE_DOCUMENT = "single_document",
  MULTIPLE_DOCUMENT = "multiple_documents",
  SINGLE_IMAGE = "single_image",
  MULTIPLE_IMAGE = "multiple_images",
}

export const AcceptedFileTypes = {
  document: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc", ".docx"],
    "application/vnd.ms-excel": [".xls", ".xlsx"],
    "text/csv": [".csv"],
  },
  image: { "image/*": [".jpg", ".jpeg", ".png", ".heic", ".heif"] },
  default: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc", ".docx"],
    "application/vnd.ms-excel": [".xls", ".xlsx"],
    "text/csv": [".csv"],
    "text/plain": [".txt"],
    "image/*": [".jpg", ".jpeg", ".png", ".heic", ".heif"],
  },
};

export const YEAR_LEVEL = [
  {
    id: "1",
    label: "1",
  },
  {
    id: "2",
    label: "2",
  },
  {
    id: "3",
    label: "3",
  },
  {
    id: "4",
    label: "4",
  },
] as const;

export const SECTIONS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);
export const COURSES = [
  "Bachelor of Science in Criminology",
  "Bachelor of Elementary Education",
  "Bachelor of Secondary Education",
  "Bachelor of Technology and Livelihood Education",
  "Bachelor of Science in Agroforestry",
  "Bachelor of Science in Environmental Science",
  "Bachelor of Science in Industrial Technology",
  "Bachelor of Science in Information Technology",
  "Bachelor of Engineering Technology",
];

export const DEPARTMENTS = [
  "College of Criminology",
  "College of Education",
  "College of Industrial Technology",
  "College of Information Technology",
  "College of BSES and BSAF Program",
];

export const OFFICES = [
  "UMIS",
  "Registrar",
  "Admission",
  "Library",
  "Accounting",
  "OSAS",
  "Custodian",
  "HR Office",
];

export const DATE_YEAR_MIN = 1970;
export const DATE_DEFAULT_FORMAT = "yyyy-MM-dd"; // 2022-08-11
export const DATETIME_DEFAULT_FORMAT = "yyyy-MM-dd h:mm a"; // 2022-08-11 1:00 PM
export const DATE_DISPLAY_FORMAT = "dd/MM/yyyy";
