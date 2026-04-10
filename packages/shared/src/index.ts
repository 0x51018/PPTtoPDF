export const ALLOWED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/octet-stream"
] as const;

export const ALLOWED_EXTENSION = ".pptx";

export const ERROR_CODES = {
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  LIBREOFFICE_NOT_FOUND: "LIBREOFFICE_NOT_FOUND",
  CONVERSION_TIMEOUT: "CONVERSION_TIMEOUT",
  CONVERSION_FAILED: "CONVERSION_FAILED",
  OUTPUT_NOT_FOUND: "OUTPUT_NOT_FOUND",
  TOO_MANY_CONCURRENT_JOBS: "TOO_MANY_CONCURRENT_JOBS",
  NO_FILE: "NO_FILE",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ApiError = {
  error: {
    code: ErrorCode;
    message: string;
  };
};
