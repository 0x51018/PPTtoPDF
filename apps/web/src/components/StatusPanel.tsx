"use client";

import { i18n } from "../lib/i18n";

type Props = {
  fileName?: string;
  progress: number;
  status: "idle" | "ready" | "uploading" | "converting" | "success" | "error";
  errorMessage: string;
};

const getStepIndex = (status: Props["status"]) => {
  if (status === "uploading") return 1;
  if (status === "converting" || status === "success") return 2;
  return 0;
};

const getSummary = ({ status, fileName, errorMessage }: Props) => {
  if (status === "error") {
    return {
      tone: "error",
      title: i18n.errorTitle,
      detail: errorMessage
    };
  }

  if (status === "success") {
    return {
      tone: "success",
      title: i18n.successTitle,
      detail: fileName ? i18n.successDetail(fileName) : i18n.successDetailGeneric
    };
  }

  if (status === "converting") {
    return {
      tone: "neutral",
      title: i18n.convertingTitle,
      detail: i18n.convertingDetail
    };
  }

  if (status === "uploading") {
    return {
      tone: "neutral",
      title: i18n.uploadingTitle,
      detail: i18n.uploadingDetail
    };
  }

  if (status === "ready") {
    return {
      tone: "ready",
      title: i18n.readyTitle,
      detail: fileName ? i18n.readyDetail(fileName) : i18n.readyDetailGeneric
    };
  }

  return {
    tone: "neutral",
    title: i18n.idleTitle,
    detail: i18n.idleDetail
  };
};

export default function StatusPanel(props: Props) {
  const summary = getSummary(props);
  const stepIndex = getStepIndex(props.status);
  const showProgress = props.status === "uploading" || props.status === "converting" || props.status === "success";

  return (
    <div className={`status-panel tone-${summary.tone}`}>
      <div className="status-copy">
        <p className="status-kicker">{i18n.statusKicker}</p>
        <h3>{summary.title}</h3>
        <p>{summary.detail}</p>
      </div>

      <div className="status-steps" aria-label="conversion steps">
        {i18n.stepLabels.map((label, index) => {
          const isComplete = props.status === "success" ? true : index < stepIndex;
          const isCurrent = props.status !== "success" && index === stepIndex;

          return (
            <div
              className={`status-step${isComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
              key={label}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
            </div>
          );
        })}
      </div>

      {showProgress ? (
        <div className="status-meter" aria-hidden="true">
          <div
            className={`status-meter-fill${props.status === "converting" ? " is-indeterminate" : ""}`}
            style={props.status === "uploading" || props.status === "success" ? { width: `${props.progress}%` } : undefined}
          />
        </div>
      ) : null}

      {props.status === "uploading" ? <p className="status-footnote">{i18n.footerUploading(props.progress)}</p> : null}
      {props.status === "error" ? <p className="status-footnote error">{props.errorMessage}</p> : null}
    </div>
  );
}
