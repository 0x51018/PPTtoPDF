"use client";

type Props = {
  fileName?: string;
  progress: number;
  status: "idle" | "ready" | "uploading" | "converting" | "success" | "error";
  errorMessage: string;
};

const STEP_LABELS = ["파일 선택", "업로드", "PDF 생성"];

const getStepIndex = (status: Props["status"]) => {
  if (status === "uploading") return 1;
  if (status === "converting" || status === "success") return 2;
  return 0;
};

const getSummary = ({ status, fileName, errorMessage }: Props) => {
  if (status === "error") {
    return {
      tone: "error",
      title: "변환을 진행하지 못했습니다",
      detail: errorMessage
    };
  }

  if (status === "success") {
    return {
      tone: "success",
      title: "변환이 완료되었습니다",
      detail: fileName ? `${fileName} 파일을 PDF로 변환했습니다.` : "PDF 파일이 준비되었습니다."
    };
  }

  if (status === "converting") {
    return {
      tone: "neutral",
      title: "PDF로 변환 중입니다",
      detail: "잠시만 기다려주세요."
    };
  }

  if (status === "uploading") {
    return {
      tone: "neutral",
      title: "파일을 업로드하는 중입니다",
      detail: "업로드가 완료되면 자동으로 변환을 시작합니다."
    };
  }

  if (status === "ready") {
    return {
      tone: "ready",
      title: "파일이 준비되었습니다",
      detail: fileName ? `${fileName}` : "변환을 시작할 수 있습니다."
    };
  }

  return {
    tone: "neutral",
    title: "파일을 선택해주세요",
    detail: "PPTX 파일을 업로드해 변환을 시작할 수 있습니다."
  };
};

export default function StatusPanel(props: Props) {
  const summary = getSummary(props);
  const stepIndex = getStepIndex(props.status);
  const showProgress = props.status === "uploading" || props.status === "converting" || props.status === "success";

  return (
    <div className={`status-panel tone-${summary.tone}`}>
      <div className="status-copy">
        <p className="status-kicker">진행 상태</p>
        <h3>{summary.title}</h3>
        <p>{summary.detail}</p>
      </div>

      <div className="status-steps" aria-label="conversion steps">
        {STEP_LABELS.map((label, index) => {
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

      {props.status === "uploading" ? <p className="status-footnote">업로드 {props.progress}%</p> : null}
      {props.status === "error" ? <p className="status-footnote error">{props.errorMessage}</p> : null}
    </div>
  );
}
