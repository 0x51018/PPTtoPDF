import "./globals.css";
import UploadForm from "../components/UploadForm";

export default function HomePage() {
  return (
    <main>
      <h1>PPTX to PDF Converter</h1>
      <p>업로드 → 변환 → 다운로드를 한 번에 처리하는 개인용 서비스</p>
      <UploadForm />
    </main>
  );
}
