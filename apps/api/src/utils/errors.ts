import { ERROR_CODES, type ErrorCode } from "@pptx-to-pdf/shared";

export class AppError extends Error {
  status: number;
  code: ErrorCode;

  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const errorResponse = (code: ErrorCode, message: string) => ({
  error: { code, message }
});

export const mapMulterError = (errorCode: string) => {
  if (errorCode === "LIMIT_FILE_SIZE") {
    return new AppError(413, ERROR_CODES.FILE_TOO_LARGE, "파일 크기가 제한을 초과했습니다.");
  }

  return new AppError(400, ERROR_CODES.INVALID_FILE_TYPE, "잘못된 업로드 요청입니다.");
};
