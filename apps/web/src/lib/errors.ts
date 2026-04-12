import { i18n } from "./i18n";

export const mapApiError = (code?: string) => {
  switch (code) {
    case "INVALID_FILE_TYPE":
      return i18n.errInvalidFileType;
    case "FILE_TOO_LARGE":
      return i18n.errFileTooLarge;
    case "TOO_MANY_CONCURRENT_JOBS":
      return i18n.errTooManyConcurrent;
    case "CONVERSION_TIMEOUT":
      return i18n.errTimeout;
    case "CONVERSION_FAILED":
    case "OUTPUT_NOT_FOUND":
      return i18n.errConversionFailed;
    case "LIBREOFFICE_NOT_FOUND":
      return i18n.errLibreOfficeNotFound;
    case "NETWORK_ERROR":
      return i18n.errNetwork;
    case "REQUEST_ABORTED":
      return i18n.errAborted;
    default:
      return i18n.errUnknown;
  }
};
