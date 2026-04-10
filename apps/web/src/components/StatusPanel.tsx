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
      title: "PDF가 준비되었습니다",
      detail: fileName ? `${fileName} 변환이 완료됐습니다. 바로 다운로드할 수 있어요.` : "변환이 완료됐습니다."
    };
  }

  if (status === "converting") {
    return {
      tone: "neutral",
      title: "PDF를 생성하고 있습니다",
      detail: "업로드는 끝났고, 서버에서 슬라이드를 PDF로 정리하는 중입니다."
    };
  }

  if (status === "uploading") {
    return {
      tone: "neutral",
      title: "파일을 업로드하는 중입니다",
      detail: "업로드가 끝나면 바로 PDF 변환 단계로 넘어갑니다."
    };
  }

  if (status === "ready") {
    return {
      tone: "ready",
      title: "파일 선택이 완료되었습니다",
      detail: fileName ? `${fileName} 준비 완료. 이제 변환 시작 버튼이 활성화됩니다.` : "이제 변환을 시작할 수 있습니다."
    };
  }

  return {
    tone: "neutral",
    title: "PPTX를 먼저 골라주세요",
    detail: "파일을 선택하면 버튼이 바로 활성화되고, 진행 상태가 아래에 표시됩니다."
  };
};

export default function StatusPanel(props: Props) {
  const summary = getSummary(props);
  const stepIndex = getStepIndex(props.status);
  const showProgress = props.status === "uploading" || props.status === "converting" || props.status === "success";

  return (
    <div className={`status-panel tone-${summary.tone}`}>
      <div className="status-copy">
        <p className="status-kicker">Progress</p>
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
