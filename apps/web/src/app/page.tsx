import UploadForm from "../components/UploadForm";
import { i18n } from "../lib/i18n";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="hero-tag">{i18n.heroTag}</p>
          <h1>{i18n.heroHeading}</h1>
          <p className="hero-description">{i18n.heroDescription}</p>
          <div className="hero-points">
            <span>{i18n.heroPoint1}</span>
            <span>{i18n.heroPoint2}</span>
            <span>{i18n.heroPoint3}</span>
          </div>
        </div>

        <div className="hero-note">
          <p className="eyebrow">{i18n.noticeLabel}</p>
          <ul>
            <li>{i18n.notice1}</li>
            <li>{i18n.notice2}</li>
            <li>{i18n.notice3}</li>
          </ul>
        </div>
      </section>

      <UploadForm />
    </main>
  );
}
