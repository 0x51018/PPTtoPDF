"use client";

type Props = {
  status: "idle" | "file-selected" | "uploading" | "converting" | "success" | "error";
  errorMessage: string;
};

export default function StatusPanel({ status, errorMessage }: Props) {
  if (status === "error") return <p className="error">{errorMessage}</p>;
  if (status === "success") return <p className="success">변환이 완료되었습니다.</p>;
  if (status === "uploading" || status === "converting") return <p>변환 중입니다...</p>;
  return <p>pptx 파일을 선택하고 변환을 시작하세요.</p>;
}
