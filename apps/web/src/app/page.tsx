import UploadForm from "../components/UploadForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="hero-tag">PPTX to PDF studio</p>
          <h1>업로드 상태부터 PDF 완료까지, 지금 어디까지 됐는지 바로 보이는 변환 화면</h1>
          <p className="hero-description">
            파일을 고르면 버튼이 즉시 활성화되고, 업로드 진행률과 서버 변환 상태를 단계별로 확인할 수 있습니다.
          </p>
          <div className="hero-points">
            <span>1 file at a time</span>
            <span>Upload progress</span>
            <span>PDF ready download</span>
          </div>
        </div>

        <div className="hero-note">
          <p className="eyebrow">What changed</p>
          <ul>
            <li>선택 상태가 카드로 즉시 보입니다.</li>
            <li>업로드와 변환이 서로 다른 단계로 표시됩니다.</li>
            <li>다운로드 버튼은 성공 시점에만 나타납니다.</li>
          </ul>
        </div>
      </section>

      <UploadForm />
    </main>
  );
}
