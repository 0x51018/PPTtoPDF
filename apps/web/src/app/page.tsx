import UploadForm from "../components/UploadForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="hero-tag">PPTX to PDF</p>
          <h1>PPTX를 PDF로 간편하게 변환하세요</h1>
          <p className="hero-description">.pptx 파일을 업로드하면 PDF로 변환해 바로 다운로드할 수 있습니다.</p>
          <div className="hero-points">
            <span>.pptx 업로드</span>
            <span>빠른 변환</span>
            <span>PDF 다운로드</span>
          </div>
        </div>

        <div className="hero-note">
          <p className="eyebrow">안내</p>
          <ul>
            <li>.pptx 파일만 업로드할 수 있습니다.</li>
            <li>파일은 한 번에 1개씩 변환됩니다.</li>
            <li>변환이 끝나면 바로 다운로드할 수 있습니다.</li>
          </ul>
        </div>
      </section>

      <UploadForm />
    </main>
  );
}
