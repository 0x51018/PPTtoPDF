"use client";

import { DragEvent } from "react";
import { i18n } from "../lib/i18n";

type Props = {
  disabled?: boolean;
  isDragging: boolean;
  onFile: (file: File) => void;
  onBrowse: () => void;
  onDraggingChange: (isDragging: boolean) => void;
};

export default function Dropzone({ disabled = false, isDragging, onFile, onBrowse, onDraggingChange }: Props) {
  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      onDraggingChange(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    onDraggingChange(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDraggingChange(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`dropzone${isDragging ? " is-dragging" : ""}${disabled ? " is-disabled" : ""}`}
      onClick={() => !disabled && onBrowse()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) {
          onDraggingChange(true);
        }
      }}
      onDrop={handleDrop}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onBrowse();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <span className="dropzone-badge">PPTX</span>
      <strong>{i18n.dropzoneHeading}</strong>
      <p>{i18n.dropzoneHint}</p>
    </div>
  );
}
