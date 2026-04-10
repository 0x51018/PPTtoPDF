"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Dropzone from "./Dropzone";
import StatusPanel from "./StatusPanel";
import { uploadAndConvert } from "../lib/api";
import { mapApiError } from "../lib/errors";

type UIStatus = "idle" | "ready" | "uploading" | "converting" | "success" | "error";

const isValidPptx = (file: File) => file.name.toLowerCase().endsWith(".pptx");
const formatBytes = (size: number) => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UIStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const isBusy = status === "uploading" || status === "converting";
  const canConvert = Boolean(file) && !isBusy;

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const onSelectFile = (selected: File) => {
    if (!isValidPptx(selected)) {
      setFile(null);
      setStatus("error");
      setUploadProgress(0);
      setErrorMessage(".pptx 파일만 업로드할 수 있습니다.");
      return;
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    setFile(selected);
    setStatus("ready");
    setUploadProgress(0);
    setErrorMessage("");
    setDownloadUrl(null);
    setIsDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      onSelectFile(selected);
    }
  };

  const onClearFile = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    setFile(null);
    setStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");
    setDownloadUrl(null);
    setIsDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onConvert = async () => {
    if (!file) return;

    try {
      setStatus("uploading");
      setUploadProgress(0);
      setErrorMessage("");
      const blob = await uploadAndConvert(file, {
        onPhaseChange: (phase) => setStatus(phase),
        onUploadProgress: (progress) => setUploadProgress(progress)
      });
      const url = URL.createObjectURL(blob);
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      setDownloadUrl(url);
      setUploadProgress(100);
      setStatus("success");
    } catch (error) {
      const code = error instanceof Error ? error.message : "UNKNOWN";
      setUploadProgress(0);
      setErrorMessage(mapApiError(code));
      setStatus("error");
    }
  };

  const primaryLabel = (() => {
    if (!file) return "파일을 선택하세요";
    if (status === "uploading") return `업로드 중 ${uploadProgress}%`;
    if (status === "converting") return "PDF 변환 중...";
    if (status === "success") return "변환 완료";
    return "변환 시작";
  })();

  return (
    <section className="upload-shell">
      <div className="upload-card">
        <div className="upload-card-head">
          <div>
            <p className="eyebrow">파일 업로드</p>
            <h2>PPTX 파일을 PDF로 변환합니다</h2>
          </div>
          <button className="ghost-button" onClick={() => fileInputRef.current?.click()} type="button">
            파일 선택
          </button>
        </div>

        <Dropzone
          disabled={isBusy}
          isDragging={isDragging}
          onBrowse={() => fileInputRef.current?.click()}
          onDraggingChange={setIsDragging}
          onFile={onSelectFile}
        />

        <input
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="visually-hidden"
          onChange={onFileChange}
          ref={fileInputRef}
          type="file"
        />

        <div className="selection-card">
          <div className="selection-copy">
            <p className="eyebrow">선택한 파일</p>
            {file ? (
              <>
                <strong>{file.name}</strong>
                <span>{formatBytes(file.size)}</span>
              </>
            ) : (
              <>
                <strong>선택된 파일이 없습니다</strong>
                <span>PPTX 파일을 선택해주세요.</span>
              </>
            )}
          </div>
          <div className="selection-badges">
            <span className={`badge ${file ? "is-ready" : ""}`}>{file ? "준비됨" : "대기 중"}</span>
            {file ? (
              <button className="text-button" disabled={isBusy} onClick={onClearFile} type="button">
                선택 해제
              </button>
            ) : null}
          </div>
        </div>

        <div className="action-row">
          <button className="primary-button" disabled={!canConvert} onClick={onConvert} type="button">
            {primaryLabel}
          </button>
          {downloadUrl ? (
            <a
              className="secondary-button"
              download={`${file?.name?.replace(/\.pptx$/i, "") ?? "converted"}.pdf`}
              href={downloadUrl}
            >
              PDF 다운로드
            </a>
          ) : (
            <span className="action-hint">{file ? "변환을 시작할 수 있습니다." : "PPTX 파일을 선택해주세요."}</span>
          )}
        </div>
      </div>

      <StatusPanel errorMessage={errorMessage} fileName={file?.name} progress={uploadProgress} status={status} />
    </section>
  );
}
