"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Dropzone from "./Dropzone";
import StatusPanel from "./StatusPanel";
import { uploadAndConvert } from "../lib/api";
import { mapApiError } from "../lib/errors";
import { i18n } from "../lib/i18n";

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
      setErrorMessage(i18n.invalidFileType);
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
    if (!file) return i18n.labelSelectFile;
    if (status === "uploading") return i18n.labelUploading(uploadProgress);
    if (status === "converting") return i18n.labelConverting;
    if (status === "success") return i18n.labelSuccess;
    return i18n.labelConvert;
  })();

  return (
    <section className="upload-shell">
      <div className="upload-card">
        <div className="upload-card-head">
          <div>
            <p className="eyebrow">{i18n.uploadEyebrow}</p>
            <h2>{i18n.uploadHeading}</h2>
          </div>
          <button className="ghost-button" onClick={() => fileInputRef.current?.click()} type="button">
            {i18n.btnSelectFile}
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
            <p className="eyebrow">{i18n.selectedEyebrow}</p>
            {file ? (
              <>
                <strong>{file.name}</strong>
                <span>{formatBytes(file.size)}</span>
              </>
            ) : (
              <>
                <strong>{i18n.noFileSelected}</strong>
                <span>{i18n.noFileHint}</span>
              </>
            )}
          </div>
          <div className="selection-badges">
            <span className={`badge ${file ? "is-ready" : ""}`}>{file ? i18n.badgeReady : i18n.badgeWaiting}</span>
            {file ? (
              <button className="text-button" disabled={isBusy} onClick={onClearFile} type="button">
                {i18n.btnClear}
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
              {i18n.btnDownload}
            </a>
          ) : (
            <span className="action-hint">{file ? i18n.hintReady : i18n.hintNoFile}</span>
          )}
        </div>
      </div>

      <StatusPanel errorMessage={errorMessage} fileName={file?.name} progress={uploadProgress} status={status} />
    </section>
  );
}
