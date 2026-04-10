export const mapApiError = (code?: string) => {
  switch (code) {
    case "INVALID_FILE_TYPE":
      return "pptx 파일만 업로드할 수 있어요.";
    case "FILE_TOO_LARGE":
      return "파일 크기는 최대 50MB입니다.";
    case "TOO_MANY_CONCURRENT_JOBS":
      return "현재 변환 요청이 많아요. 잠시 후 다시 시도해주세요.";
    case "CONVERSION_TIMEOUT":
      return "변환 시간이 초과되었습니다.";
    case "CONVERSION_FAILED":
    case "OUTPUT_NOT_FOUND":
      return "PPTX를 PDF로 변환하지 못했습니다.";
    case "LIBREOFFICE_NOT_FOUND":
      return "서버에 LibreOffice가 없어 지금은 변환할 수 없습니다.";
    default:
      return "요청 처리 중 오류가 발생했습니다.";
  }
};
