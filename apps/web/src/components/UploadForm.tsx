"use client";

import { useEffect, useMemo, useState } from "react";
import Dropzone from "./Dropzone";
import StatusPanel from "./StatusPanel";
import { uploadAndConvert } from "../lib/api";
import { mapApiError } from "../lib/errors";

type UIStatus = "idle" | "file-selected" | "uploading" | "converting" | "success" | "error";

const isValidPptx = (file: File) => file.name.toLowerCase().endsWith(".pptx");

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UIStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const disabledConvert = useMemo(() => !file || status === "uploading" || status === "converting", [file, status]);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const onSelectFile = (selected: File) => {
    if (!isValidPptx(selected)) {
      setStatus("error");
      setErrorMessage(".pptx 파일만 업로드할 수 있습니다.");
      return;
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setFile(selected);
    setStatus("file-selected");
    setErrorMessage("");
    setDownloadUrl(null);
  };

  const onConvert = async () => {
    if (!file) return;

    try {
      setStatus("uploading");
      setErrorMessage("");
      const blob = await uploadAndConvert(file);
      const url = URL.createObjectURL(blob);
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      setDownloadUrl(url);
      setStatus("success");
    } catch (error) {
      const code = error instanceof Error ? error.message : "UNKNOWN";
      setErrorMessage(mapApiError(code));
      setStatus("error");
    }
  };

  return (
    <section>
      <Dropzone onFile={onSelectFile} />
      <input type="file" accept=".pptx" onChange={(e) => e.target.files?.[0] && onSelectFile(e.target.files[0])} />
      {file ? <p>선택한 파일: {file.name}</p> : null}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="primary" disabled={disabledConvert} onClick={onConvert}>변환 시작</button>
        {downloadUrl && (
          <a href={downloadUrl} download={`${file?.name?.replace(/\.pptx$/i, "") ?? "converted"}.pdf`}>
            <button>PDF 다운로드</button>
          </a>
        )}
      </div>
      <StatusPanel status={status} errorMessage={errorMessage} />
    </section>
  );
}
