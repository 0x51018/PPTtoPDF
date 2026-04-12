const LOCALE = (process.env.NEXT_PUBLIC_LOCALE ?? "en") as "en" | "ko";

const translations = {
  en: {
    // layout
    htmlLang: "en",

    // page.tsx
    heroTag: "PPTX to PDF",
    heroHeading: "Convert PPTX to PDF Easily",
    heroDescription: "Upload a .pptx file to convert it to PDF and download it instantly.",
    heroPoint1: ".pptx Upload",
    heroPoint2: "Fast Conversion",
    heroPoint3: "PDF Download",
    noticeLabel: "Notice",
    notice1: "Only .pptx files are supported.",
    notice2: "Files are converted one at a time.",
    notice3: "Download is available immediately after conversion.",

    // UploadForm.tsx
    invalidFileType: "Only .pptx files are allowed.",
    labelSelectFile: "Select a file",
    labelUploading: (pct: number) => `Uploading ${pct}%`,
    labelConverting: "Converting to PDF…",
    labelSuccess: "Conversion Complete",
    labelConvert: "Start Conversion",
    uploadEyebrow: "File Upload",
    uploadHeading: "Convert PPTX files to PDF",
    btnSelectFile: "Select File",
    selectedEyebrow: "Selected File",
    noFileSelected: "No file selected",
    noFileHint: "Please select a PPTX file.",
    badgeReady: "Ready",
    badgeWaiting: "Waiting",
    btnClear: "Clear",
    btnDownload: "Download PDF",
    hintReady: "Ready to convert.",
    hintNoFile: "Please select a PPTX file.",

    // Dropzone.tsx
    dropzoneHeading: "Drag & drop or click to select",
    dropzoneHint: "Upload one .pptx file.",

    // StatusPanel.tsx
    stepLabels: ["Select File", "Upload", "Generate PDF"] as [string, string, string],
    statusKicker: "Status",
    errorTitle: "Conversion Failed",
    successTitle: "Conversion Complete",
    successDetail: (name: string) => `${name} has been converted to PDF.`,
    successDetailGeneric: "Your PDF file is ready.",
    convertingTitle: "Converting to PDF",
    convertingDetail: "Please wait a moment.",
    uploadingTitle: "Uploading File",
    uploadingDetail: "Conversion will start automatically after upload.",
    readyTitle: "File Ready",
    readyDetail: (name: string) => name,
    readyDetailGeneric: "Ready to convert.",
    idleTitle: "Please select a file",
    idleDetail: "Upload a PPTX file to start conversion.",
    footerUploading: (pct: number) => `Uploading ${pct}%`,

    // errors.ts
    errInvalidFileType: "Only .pptx files can be uploaded.",
    errFileTooLarge: "Maximum file size is 50 MB.",
    errTooManyConcurrent: "Too many conversion requests. Please try again shortly.",
    errTimeout: "Conversion timed out.",
    errConversionFailed: "Failed to convert the PPTX to PDF.",
    errLibreOfficeNotFound: "LibreOffice is not available on the server.",
    errNetwork: "Could not reach the server. Please check your network.",
    errAborted: "Request was cancelled. Please try again.",
    errUnknown: "An unexpected error occurred."
  },

  ko: {
    htmlLang: "ko",

    heroTag: "PPTX to PDF",
    heroHeading: "PPTX를 PDF로 간편하게 변환하세요",
    heroDescription: ".pptx 파일을 업로드하면 PDF로 변환해 바로 다운로드할 수 있습니다.",
    heroPoint1: ".pptx 업로드",
    heroPoint2: "빠른 변환",
    heroPoint3: "PDF 다운로드",
    noticeLabel: "안내",
    notice1: ".pptx 파일만 업로드할 수 있습니다.",
    notice2: "파일은 한 번에 1개씩 변환됩니다.",
    notice3: "변환이 끝나면 바로 다운로드할 수 있습니다.",

    invalidFileType: ".pptx 파일만 업로드할 수 있습니다.",
    labelSelectFile: "파일을 선택하세요",
    labelUploading: (pct: number) => `업로드 중 ${pct}%`,
    labelConverting: "PDF 변환 중...",
    labelSuccess: "변환 완료",
    labelConvert: "변환 시작",
    uploadEyebrow: "파일 업로드",
    uploadHeading: "PPTX 파일을 PDF로 변환합니다",
    btnSelectFile: "파일 선택",
    selectedEyebrow: "선택한 파일",
    noFileSelected: "선택된 파일이 없습니다",
    noFileHint: "PPTX 파일을 선택해주세요.",
    badgeReady: "준비됨",
    badgeWaiting: "대기 중",
    btnClear: "선택 해제",
    btnDownload: "PDF 다운로드",
    hintReady: "변환을 시작할 수 있습니다.",
    hintNoFile: "PPTX 파일을 선택해주세요.",

    dropzoneHeading: "파일을 끌어다 놓거나 선택하세요",
    dropzoneHint: ".pptx 파일 1개를 업로드할 수 있습니다.",

    stepLabels: ["파일 선택", "업로드", "PDF 생성"] as [string, string, string],
    statusKicker: "진행 상태",
    errorTitle: "변환을 진행하지 못했습니다",
    successTitle: "변환이 완료되었습니다",
    successDetail: (name: string) => `${name} 파일을 PDF로 변환했습니다.`,
    successDetailGeneric: "PDF 파일이 준비되었습니다.",
    convertingTitle: "PDF로 변환 중입니다",
    convertingDetail: "잠시만 기다려주세요.",
    uploadingTitle: "파일을 업로드하는 중입니다",
    uploadingDetail: "업로드가 완료되면 자동으로 변환을 시작합니다.",
    readyTitle: "파일이 준비되었습니다",
    readyDetail: (name: string) => name,
    readyDetailGeneric: "변환을 시작할 수 있습니다.",
    idleTitle: "파일을 선택해주세요",
    idleDetail: "PPTX 파일을 업로드해 변환을 시작할 수 있습니다.",
    footerUploading: (pct: number) => `업로드 ${pct}%`,

    errInvalidFileType: "pptx 파일만 업로드할 수 있어요.",
    errFileTooLarge: "파일 크기는 최대 50MB입니다.",
    errTooManyConcurrent: "현재 변환 요청이 많아요. 잠시 후 다시 시도해주세요.",
    errTimeout: "변환 시간이 초과되었습니다.",
    errConversionFailed: "PPTX를 PDF로 변환하지 못했습니다.",
    errLibreOfficeNotFound: "서버에 LibreOffice가 없어 지금은 변환할 수 없습니다.",
    errNetwork: "서버에 연결하지 못했습니다. 네트워크 상태를 확인해주세요.",
    errAborted: "요청이 중단되었습니다. 다시 시도해주세요.",
    errUnknown: "요청 처리 중 오류가 발생했습니다."
  }
};

export const i18n = translations[LOCALE] ?? translations.en;
