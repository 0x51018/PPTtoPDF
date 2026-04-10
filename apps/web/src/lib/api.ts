const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type UploadPhase = "uploading" | "converting";

type UploadAndConvertOptions = {
  onPhaseChange?: (phase: UploadPhase) => void;
  onUploadProgress?: (progress: number) => void;
};

export const uploadAndConvert = async (file: File, options: UploadAndConvertOptions = {}) => {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/convert`);
    xhr.responseType = "blob";

    xhr.upload.addEventListener("loadstart", () => {
      options.onPhaseChange?.("uploading");
      options.onUploadProgress?.(0);
    });

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable || event.total === 0) return;
      const progress = Math.max(1, Math.min(99, Math.round((event.loaded / event.total) * 100)));
      options.onUploadProgress?.(progress);
    });

    xhr.upload.addEventListener("load", () => {
      options.onUploadProgress?.(100);
      options.onPhaseChange?.("converting");
    });

    xhr.addEventListener("error", () => {
      reject(new Error("NETWORK_ERROR"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("REQUEST_ABORTED"));
    });

    xhr.addEventListener("load", async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
        return;
      }

      const errorBlob = xhr.response instanceof Blob ? xhr.response : new Blob();
      const payload = (await errorBlob.text().then((text) => JSON.parse(text)).catch(() => ({}))) as {
        error?: { code?: string };
      };
      reject(new Error(payload.error?.code ?? "UNKNOWN"));
    });

    xhr.send(formData);
  });
};
