"use client";

import { DragEvent } from "react";

type Props = {
  onFile: (file: File) => void;
};

export default function Dropzone({ onFile }: Props) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      여기에 .pptx 파일을 드래그하세요
    </div>
  );
}
