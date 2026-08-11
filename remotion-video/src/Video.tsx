import React from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TOTAL_FRAMES = 1890; // 63s @ 30fps

const GREEN_DARK = "#123524";
const GREEN = "#1f5c3d";
const BLUE = "#2563eb";
const BG = "#eef0ec";
const INK = "#16281e";
const GRAY = "#4a5a51";
const RED = "#dc2626";
const ORANGE = "#ea580c";
const OK = "#16a34a";

const FONT = "'Noto Sans KR', sans-serif";

/* ================= shared helpers ================= */

const useIn = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping }, durationInFrames: 30 });
};

const FadeUp: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const p = useIn(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style }}>
      {children}
    </div>
  );
};

/* Step breadcrumb: shows where we are in the 3-step flow */
const StepCrumb: React.FC<{ active: number }> = ({ active }) => {
  const p = useIn(4);
  const steps = ["1. 통계 선별", "2. AI 판정", "3. 담당자 확정"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, marginTop: 10 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div
            style={{
              padding: "10px 26px",
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 800,
              background: i === active ? GREEN_DARK : "#dde3dc",
              color: i === active ? "#fff" : "#7c8a80",
              transform: i === active ? "scale(1.08)" : "scale(1)",
            }}
          >
            {s}
          </div>
          {i < 2 ? <span style={{ color: "#9aa79e", fontSize: 26, fontWeight: 900 }}>→</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

const SceneShell: React.FC<{
  title: string;
  step?: number;
  children: React.ReactNode;
}> = ({ title, step, children }) => {
  const frame = useCurrentFrame();
  const titleP = useIn(0);
  const ruleW = interpolate(frame, [8, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT, padding: "64px 100px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: GREEN_DARK }} />
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <h1
          style={{
            fontSize: 62,
            fontWeight: 900,
            color: GREEN_DARK,
            margin: 0,
            opacity: titleP,
            transform: `translateY(${(1 - titleP) * 30}px)`,
            letterSpacing: -1,
          }}
        >
          {title}
        </h1>
        <div style={{ flex: 1, height: 4, background: "#b9c2bb", width: `${ruleW}%`, opacity: ruleW / 100 }} />
      </div>
      {step !== undefined ? <StepCrumb active={step} /> : null}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Banner: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        marginTop: 44,
        background: GREEN_DARK,
        borderRadius: 20,
        padding: "26px 46px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <span style={{ fontSize: 40 }}>🎯</span>
      <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{text}</span>
    </div>
  );
};

const Card: React.FC<{
  icon: string;
  title: string;
  desc: string;
  delay: number;
  accent?: string;
}> = ({ icon, title, desc, delay, accent = GREEN_DARK }) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #dfe3dd",
        borderRadius: 24,
        padding: "42px 38px",
        flex: 1,
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + p * 0.06})`,
        boxShadow: "0 12px 30px rgba(18,53,36,0.08)",
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: "50%",
          background: "#e7efe7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          marginBottom: 24,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: accent, marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 27, color: GRAY, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
};

/* ================= Scene 1: Title ================= */

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const sub = spring({ frame: frame - 25, fps, config: { damping: 200 }, durationInFrames: 30 });
  const icons = spring({ frame: frame - 45, fps, config: { damping: 14 }, durationInFrames: 40 });
  const out = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 20%, #1d5438 0%, ${GREEN_DARK} 60%, #0b2418 100%)`,
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div style={{ fontSize: 96, transform: `scale(${icons})`, marginBottom: 30 }}>🎥 🚗</div>
      <h1
        style={{
          fontSize: 106,
          fontWeight: 900,
          color: "#fff",
          margin: 0,
          letterSpacing: -2,
          opacity: p,
          transform: `translateY(${(1 - p) * 60}px)`,
        }}
      >
        AI 부정주차 적발 시스템
      </h1>
      <p
        style={{
          fontSize: 40,
          fontWeight: 500,
          color: "#b9d4c3",
          marginTop: 32,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 40}px)`,
        }}
      >
        통계 선별 → AI 판정 → 담당자 확인 · 매일 자동으로
      </p>
    </AbsoluteFill>
  );
};

/* ================= Scene 2: Problem & goal ================= */

const ProblemScene: React.FC = () => (
  <SceneShell title="왜 필요한가">
    <div style={{ display: "flex", gap: 38 }}>
      <Card icon="📋" title="기존 한계" desc="수만 대 주차 데이터에서 수작업으로 부정주차 식별이 어려움" delay={10} />
      <Card icon="🎯" title="운영 목표" desc="확실한 의심 차량만 선별해 담당자 확인 부담 최소화" delay={22} />
      <Card icon="📈" title="핵심 변화" desc="월 단위 사후 점검에서 일 단위 선제 탐지로 전환" delay={34} />
    </div>
    <Banner text="사람이 다 볼 수 없으니, 통계와 AI가 먼저 거르고 사람은 확인만 한다" delay={70} />
  </SceneShell>
);

/* ================= Scene 3: Two types ================= */

const TypeCard: React.FC<{
  title: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  items: string[];
  delay: number;
  fromRight?: boolean;
}> = ({ title, icon, color, bg, border, items, delay, fromRight }) => {
  const p = useIn(delay);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 28,
        padding: "46px 50px",
        opacity: p,
        transform: `translateX(${(1 - p) * (fromRight ? 80 : -80)}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <span style={{ fontSize: 54, fontWeight: 900, color }}>{title}</span>
        <span
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          {icon}
        </span>
      </div>
      {items.map((t, i) => {
        const ip = spring({
          frame: frame - delay - 14 - i * 9,
          fps: 30,
          config: { damping: 200 },
          durationInFrames: 24,
        });
        return (
          <div
            key={t}
            style={{
              fontSize: 31,
              color: INK,
              padding: "11px 0",
              opacity: ip,
              transform: `translateX(${(1 - ip) * 30}px)`,
              display: "flex",
              gap: 16,
            }}
          >
            <span style={{ color, fontWeight: 900 }}>•</span> {t}
          </div>
        );
      })}
    </div>
  );
};

const TypesScene: React.FC = () => (
  <SceneShell title="무엇을 잡나 — 탐지 대상 2유형">
    <div style={{ display: "flex", gap: 44 }}>
      <TypeCard
        title="통근형"
        icon="💼"
        color={GREEN}
        bg="#f2f3f0"
        border="#dcdfd9"
        delay={8}
        items={["평일 거의 매일 방문", "입차 시각이 규칙적", "반나절 이상 장시간 체류", "실구매·정산 활동은 거의 없음"]}
      />
      <TypeCard
        title="팝업형"
        icon="🎁"
        color={BLUE}
        bg="#eef3fb"
        border="#c9d8f0"
        delay={20}
        fromRight
        items={["단기 행사 기간 집중 발생", "차량 1대에 주차권 다량 발행", "특정 브랜드에 발행 집중", "최근 며칠간 POS 발행 급증"]}
      />
    </div>
  </SceneShell>
);

/* ================= Scene 4: Flow overview ================= */

const FlowBox: React.FC<{ tag: string; icon: string; tool: string; lines: string[]; delay: number }> = ({
  tag,
  icon,
  tool,
  lines,
  delay,
}) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: "2px solid #dfe3dd",
        borderRadius: 26,
        padding: "40px 28px",
        textAlign: "center",
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${0.7 + p * 0.3})`,
        boxShadow: "0 12px 30px rgba(18,53,36,0.08)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: GREEN_DARK,
          color: "#fff",
          fontSize: 31,
          fontWeight: 800,
          padding: "12px 30px",
          borderRadius: 14,
          marginBottom: 26,
        }}
      >
        {tag}
      </div>
      <div style={{ fontSize: 84, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 25, fontWeight: 700, color: "#7c8a80", marginBottom: 22 }}>{tool}</div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 30, fontWeight: 600, color: INK, lineHeight: 1.5 }}>
          {l}
        </div>
      ))}
    </div>
  );
};

const FlowScene: React.FC = () => {
  const a1 = useIn(28);
  const a2 = useIn(52);
  return (
    <SceneShell title="한눈에 보는 운영 구조 — 매일 3단계">
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <FlowBox tag="1. 통계 선별" icon="🔍" tool="Power BI" lines={["주차 raw 데이터", "z점수로 후보 추출"]} delay={8} />
        <div style={{ fontSize: 60, color: "#9aa79e", fontWeight: 900, opacity: a1 }}>➜</div>
        <FlowBox tag="2. AI 판정" icon="🧠" tool="AI 분석" lines={["의심 · 보류 · 정상", "신뢰도 상 · 중 · 하"]} delay={32} />
        <div style={{ fontSize: 60, color: "#9aa79e", fontWeight: 900, opacity: a2 }}>➜</div>
        <FlowBox tag="3. 담당자 확정" icon="✅" tool="Teams" lines={["Teams 알림 → CCTV 확인", "→ 징수"]} delay={56} />
      </div>
      <Banner text="고정 임계값이 아닌 상대 비교와 AI 맥락 판단으로, 통근형과 팝업형을 모두 놓치지 않도록 설계" delay={95} />
    </SceneShell>
  );
};

/* ================= Scene 5: STEP 1 — statistics ================= */

const ZCard: React.FC<{ icon: string; title: string; desc: string; delay: number; accent?: string }> = ({
  icon,
  title,
  desc,
  delay,
  accent = INK,
}) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #dfe3dd",
        borderRadius: 20,
        padding: "30px 32px",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 33, fontWeight: 800, color: accent, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 25, color: GRAY, lineHeight: 1.45 }}>{desc}</div>
    </div>
  );
};

const Step1Scene: React.FC = () => (
  <SceneShell title="통계 선별 — z점수로 이상치를 찾는다" step={0}>
    <div style={{ display: "flex", gap: 46, alignItems: "center" }}>
      <div style={{ flex: 1.25 }}>
        <FadeUp delay={10}>
          <div
            style={{
              background: "#e3e9e2",
              border: "2px solid #cdd6cc",
              borderRadius: 16,
              padding: "24px 30px",
              marginBottom: 26,
              fontSize: 27,
              color: INK,
              lineHeight: 1.55,
            }}
          >
            ℹ️ <b>z점수</b> = 전체 평균 대비 얼마나 벗어났는지를 표준편차로 환산한 값.
            고정 기준이 아니라 <b>당일 전체 차량과의 상대 비교</b>로 이상치를 탐지합니다.
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          <ZCard icon="🚗" title="통근형 z" desc="방문수 + 체류시간 + 입차 편차 + POS 수" delay={22} />
          <ZCard icon="👜" title="팝업형 z" desc="체류시간 대비 POS 건수" delay={30} accent={BLUE} />
          <ZCard icon="🏷️" title="브랜드 집중 z" desc="특정 브랜드 발행 집중 여부" delay={38} />
          <ZCard icon="📈" title="급증 z" desc="최근 3일 POS 발행 급증" delay={46} accent={BLUE} />
        </div>
      </div>
      <FadeUp delay={62} style={{ flex: 0.9 }}>
        <div
          style={{
            background: GREEN_DARK,
            borderRadius: 26,
            padding: "50px 46px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 22 }}>🎯</div>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.55 }}>
            네 점수 중 <span style={{ color: "#ffd166" }}>최고값</span>을 종합 점수로 사용
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.25)", margin: "26px 0" }} />
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.55 }}>
            상위 <span style={{ color: "#ffd166" }}>1%</span> 차량만
            <br />
            AI 분석 후보로 추출
          </div>
        </div>
      </FadeUp>
    </div>
  </SceneShell>
);

/* ================= Scene 6: STEP 2 — AI verdicts + log table ================= */

const Verdict: React.FC<{ label: string; icon: string; color: string; desc: string; delay: number }> = ({
  label,
  icon,
  color,
  desc,
  delay,
}) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        borderTop: `10px solid ${color}`,
        borderRadius: 18,
        padding: "24px 26px",
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${0.8 + p * 0.2})`,
        boxShadow: "0 10px 24px rgba(18,53,36,0.08)",
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 900, color, marginBottom: 8 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 23, color: GRAY, lineHeight: 1.45 }}>{desc}</div>
    </div>
  );
};

const LOG_ROWS: [string, string, string, string, string][] = [
  ["46머7935", "24.34", "의심", "통근형", "상"],
  ["69저2183", "12.56", "의심", "팝업형", "상"],
  ["369고9592", "25.81", "의심", "통근형", "상"],
  ["247라8517", "15.88", "의심", "통근형", "상"],
  ["52서7206", "11.47", "의심", "팝업형", "상"],
];

const Step2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell title="AI 판정 — 종합 점수 + 신뢰도로 등급화" step={1}>
      <div style={{ display: "flex", gap: 44 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 18, marginBottom: 26 }}>
            <Verdict label="의심" icon="⚠️" color={RED} desc="부정주차 특징이 여러 수치에서 뚜렷" delay={10} />
            <Verdict label="보류" icon="❓" color={ORANGE} desc="의심은 있으나 정상 가능성도 남음" delay={20} />
            <Verdict label="정상" icon="✅" color={OK} desc="업무 차량·정상 고객 가능성이 높음" delay={30} />
          </div>
          <FadeUp delay={44}>
            <div style={{ background: "#fff", border: "2px solid #dfe3dd", borderRadius: 18, padding: "24px 30px" }}>
              {[
                ["신뢰도 상", RED, "정상 설명이 어려운 경우"],
                ["신뢰도 중", ORANGE, "추가 확인이 필요한 경우"],
                ["신뢰도 하", BLUE, "방문 이력이 적어 판단이 어려운 경우"],
              ].map(([t, c, d]) => (
                <div key={t as string} style={{ fontSize: 27, padding: "9px 0", color: INK }}>
                  🛡️ <b style={{ color: c as string }}>{t}</b> : {d}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* alert-log table mockup */}
        <FadeUp delay={56} style={{ flex: 1.05 }}>
          <div
            style={{
              background: "#fff",
              border: "2px solid #d6dad3",
              borderRadius: 18,
              padding: "26px 30px",
              boxShadow: "0 14px 34px rgba(18,53,36,0.10)",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: INK, marginBottom: 18 }}>
              🗂️ 부정주차_알림로그 <span style={{ fontWeight: 500, color: "#8a968d", fontSize: 22 }}>— 매일 자동 기록</span>
            </div>
            <div style={{ display: "flex", fontSize: 21, fontWeight: 700, color: "#7c8a80", padding: "8px 6px", borderBottom: "2px solid #e2e5df" }}>
              <span style={{ width: 170 }}>토큰ID</span>
              <span style={{ width: 130 }}>이상점수</span>
              <span style={{ width: 110 }}>AI판정</span>
              <span style={{ width: 120 }}>AI유형</span>
              <span style={{ width: 90 }}>신뢰도</span>
              <span style={{ flex: 1 }}>알림발송</span>
            </div>
            {LOG_ROWS.map((r, i) => {
              const p = spring({
                frame: frame - 66 - i * 8,
                fps: 30,
                config: { damping: 200 },
                durationInFrames: 20,
              });
              return (
                <div
                  key={r[0] + i}
                  style={{
                    display: "flex",
                    fontSize: 23,
                    color: INK,
                    padding: "12px 6px",
                    borderBottom: "1px solid #eef0ec",
                    opacity: p,
                    transform: `translateX(${(1 - p) * 40}px)`,
                    alignItems: "center",
                  }}
                >
                  <span style={{ width: 170, fontWeight: 700 }}>{r[0]}</span>
                  <span style={{ width: 130 }}>{r[1]}</span>
                  <span style={{ width: 110 }}>
                    <span style={{ background: RED, color: "#fff", fontSize: 19, fontWeight: 800, borderRadius: 6, padding: "3px 10px" }}>
                      {r[2]}
                    </span>
                  </span>
                  <span style={{ width: 120 }}>{r[3]}</span>
                  <span style={{ width: 90 }}>{r[4]}</span>
                  <span style={{ flex: 1, color: "#7b2d8e", fontWeight: 700 }}>● 예</span>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </div>
    </SceneShell>
  );
};

/* ================= Scene 7: STEP 3 — daily timeline + Teams card ================= */

const Step3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    ["08:00", "Power BI 데이터 갱신", "📊"],
    ["08:30", "데이터 가공 및 AI 판정", "🗄️"],
    ["09:00", "Teams 알림 발송", "💬"],
    ["담당자", "CCTV 확인", "🎥"],
    ["완료", "확정 / 정상 처리", "✅"],
  ];
  const cardP = useIn(60);
  return (
    <SceneShell title="담당자 확정 — 하루 운영 흐름" step={2}>
      <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
        {/* timeline */}
        <div style={{ flex: 0.95, display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map(([time, desc, icon], i) => {
            const p = spring({
              frame: frame - 8 - i * 13,
              fps: 30,
              config: { damping: 200 },
              durationInFrames: 24,
            });
            return (
              <div
                key={time}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 60}px)`,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: i === 4 ? GREEN_DARK : "#e7efe7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    background: "#fff",
                    border: "2px solid #dfe3dd",
                    borderRadius: 16,
                    padding: "16px 28px",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                  }}
                >
                  <span style={{ fontSize: 29, fontWeight: 900, color: GREEN_DARK, width: 130 }}>{time}</span>
                  <span style={{ fontSize: 26, color: INK, fontWeight: 500 }}>{desc}</span>
                </div>
              </div>
            );
          })}
          <FadeUp delay={78}>
            <div
              style={{
                background: "#fff7ed",
                border: "2px solid #fdba74",
                borderRadius: 16,
                padding: "18px 28px",
                fontSize: 26,
                fontWeight: 700,
                color: "#9a3412",
                marginTop: 6,
              }}
            >
              🔁 의심 + 신뢰도 상 차량만 자동 전송 · 담당자 미처리 시 3일 후 재알림
            </div>
          </FadeUp>
        </div>

        {/* Teams card mockup */}
        <div
          style={{
            flex: 1.05,
            background: "#fff",
            border: "2px solid #d6dad3",
            borderRadius: 20,
            padding: "30px 36px",
            boxShadow: "0 16px 40px rgba(18,53,36,0.12)",
            opacity: cardP,
            transform: `translateY(${(1 - cardP) * 60}px)`,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 900, color: RED, marginBottom: 6 }}>🚨 부정주차 의심 차량</div>
          <div style={{ fontSize: 23, color: GRAY, marginBottom: 20 }}>🔵 CCTV 확인 후 버튼을 눌러주세요</div>
          <div style={{ border: `3px solid ${RED}`, borderRadius: 12, padding: "16px 22px", marginBottom: 20 }}>
            {[
              ["차량번호", "247라8517"],
              ["유형", "통근형 (신뢰도 상)"],
              ["주력브랜드", "앤헤이븐"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", fontSize: 26, padding: "5px 0" }}>
                <span style={{ width: 180, color: "#7c8a80", fontWeight: 600 }}>{k}</span>
                <span style={{ color: INK, fontWeight: 800 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: INK, marginBottom: 8 }}>📍 최근 입차 (CCTV 대조용)</div>
          <div style={{ fontSize: 24, color: GRAY, display: "flex", gap: 26, marginBottom: 20 }}>
            <span>08/05 11:22</span>
            <span>08/08 10:38</span>
            <span>08/06 11:18</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: INK, marginBottom: 8 }}>💡 판단 근거</div>
          <div style={{ fontSize: 23, color: GRAY, lineHeight: 1.55, marginBottom: 22 }}>
            방문 8일 중 평일 6일, 평균 체류 470분으로 근무시간대에 준하는 장시간 체류 반복.
            주차권 발행은 5건에 불과해 구매 없는 통근형 부정주차 양상에 해당.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, background: RED, color: "#fff", borderRadius: 10, textAlign: "center", fontSize: 26, fontWeight: 800, padding: "16px 0" }}>
              확정 (부정주차)
            </div>
            <div style={{ flex: 1, background: "#ece6f5", color: "#4c3575", borderRadius: 10, textAlign: "center", fontSize: 26, fontWeight: 800, padding: "16px 0" }}>
              정상 (고객·정기등록 등)
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

/* ================= Scene 8: Effects funnel ================= */

const CountUp: React.FC<{ to: number; delay: number }> = ({ to, delay }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + 36], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <>{Math.round(v).toLocaleString()}</>;
};

const FunnelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows: { w: number; color: string; label: string; value: React.ReactNode; sub: string }[] = [
    { w: 100, color: "#3a6b52", label: "월 분석", value: <><CountUp to={4} delay={20} />만대 수준</>, sub: "대규모 주차 데이터 자동 처리 (월 3~4만대)" },
    { w: 62, color: "#2d5a43", label: "통계 선별", value: "상위 1%", sub: "z점수 이상치만 AI 분석 후보로" },
    { w: 38, color: "#1f4a36", label: "AI 판정", value: "의심 + 신뢰도 상", sub: "확실한 건만 남김" },
    { w: 20, color: GREEN_DARK, label: "일 알림", value: "1~2건", sub: "담당자가 확인 가능한 수준으로 압축" },
  ];
  return (
    <SceneShell title="운영 효과 — 수만 대에서 하루 1~2건으로">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        {rows.map((r, i) => {
          const p = spring({
            frame: frame - 10 - i * 15,
            fps: 30,
            config: { damping: 200 },
            durationInFrames: 26,
          });
          return (
            <div
              key={r.label}
              style={{
                width: `${r.w}%`,
                background: r.color,
                borderRadius: 16,
                padding: "20px 40px",
                display: "flex",
                alignItems: "center",
                gap: 30,
                opacity: p,
                transform: `scaleX(${0.3 + p * 0.7})`,
                color: "#fff",
                minWidth: 560,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 700, opacity: 0.85, width: 150 }}>{r.label}</span>
              <span style={{ fontSize: 36, fontWeight: 900, whiteSpace: "nowrap" }}>{r.value}</span>
              <span style={{ fontSize: 23, opacity: 0.85 }}>{r.sub}</span>
            </div>
          );
        })}
        <FadeUp delay={78}>
          <div style={{ fontSize: 32, fontWeight: 800, color: INK, marginTop: 14 }}>
            ⬇ 확정 시 실제 요금 <span style={{ color: GREEN }}>징수로 연결</span>
          </div>
        </FadeUp>
      </div>
      <div style={{ display: "flex", gap: 50, marginTop: 40, justifyContent: "center" }}>
        {["담당자 수작업 부담 감소", "정상 고객 오탐 최소화", "부정주차 억제 효과 기대"].map((t, i) => {
          const p = spring({
            frame: frame - 92 - i * 10,
            fps: 30,
            config: { damping: 200 },
            durationInFrames: 22,
          });
          return (
            <div key={t} style={{ fontSize: 30, fontWeight: 700, color: INK, opacity: p }}>
              <span style={{ color: OK, fontWeight: 900, marginRight: 12 }}>✔</span>
              {t}
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

/* ================= Scene 9: RMD comparison ================= */

const COMPARE: [string, string, string][] = [
  ["분석 주기", "월 평균", "매일"],
  ["판단 기준", "고정 숫자 기준", "z점수 + AI 맥락"],
  ["통근형 탐지", "POS 없으면 놓침", "체류·규칙성 패턴으로 탐지"],
  ["팝업 대응", "행사 후 발견", "행사 중 조기 적발"],
  ["처리 방식", "수작업 점검", "자동 알림·처리"],
];

const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const headP = useIn(6);
  return (
    <SceneShell title="기존 RMD 대비 무엇이 달라졌나">
      <div style={{ maxWidth: 1500, width: "100%", alignSelf: "center" }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 14, opacity: headP }}>
          <div style={{ width: 320, fontSize: 29, fontWeight: 800, color: INK, background: "#e3e9e2", borderRadius: 12, padding: "18px 26px", textAlign: "center" }}>
            비교 항목
          </div>
          <div style={{ flex: 1, fontSize: 29, fontWeight: 800, color: GRAY, background: "#e3e9e2", borderRadius: 12, padding: "18px 26px", textAlign: "center" }}>
            기존 RMD
          </div>
          <div style={{ flex: 1.3, fontSize: 29, fontWeight: 800, color: "#fff", background: BLUE, borderRadius: 12, padding: "18px 26px", textAlign: "center" }}>
            AI 부정주차 적발 시스템
          </div>
        </div>
        {COMPARE.map(([item, old, neu], i) => {
          const p = spring({
            frame: frame - 18 - i * 11,
            fps: 30,
            config: { damping: 200 },
            durationInFrames: 22,
          });
          return (
            <div key={item} style={{ display: "flex", gap: 14, marginBottom: 12, opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
              <div style={{ width: 320, fontSize: 28, fontWeight: 800, color: INK, background: "#fff", border: "2px solid #dfe3dd", borderRadius: 12, padding: "18px 26px", textAlign: "center" }}>
                {item}
              </div>
              <div style={{ flex: 1, fontSize: 28, color: GRAY, background: "#fff", border: "2px solid #dfe3dd", borderRadius: 12, padding: "18px 26px", textAlign: "center" }}>
                {old}
              </div>
              <div style={{ flex: 1.3, fontSize: 28, fontWeight: 800, color: BLUE, background: "#eef3fb", border: "2px solid #93b4e8", borderRadius: 12, padding: "18px 26px", textAlign: "center" }}>
                {neu}
              </div>
            </div>
          );
        })}
        <Banner text="RMD 사각지대인 통근형과 실시간 팝업형을 보완" delay={80} />
      </div>
    </SceneShell>
  );
};

/* ================= Scene 10: Expansion + outro ================= */

const ExpandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const outroP = spring({ frame: frame - 110, fps, config: { damping: 200 }, durationInFrames: 35 });
  const dim = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <SceneShell title="사후 관리와 전사 확대">
        <div style={{ display: "flex", gap: 30, marginBottom: 36 }}>
          <FadeUp delay={8} style={{ flex: 1 }}>
            <div style={{ background: "#fff", border: "2px solid #dfe3dd", borderRadius: 20, padding: "30px 36px", display: "flex", gap: 22, alignItems: "center" }}>
              <span style={{ fontSize: 44 }}>📅</span>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: GREEN_DARK }}>확정 차량</div>
                <div style={{ fontSize: 25, color: GRAY, marginTop: 6 }}>4주(28일) 미알림 → 이후 패턴 재발 시 재알림</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={18} style={{ flex: 1 }}>
            <div style={{ background: "#eef3fb", border: "2px solid #93b4e8", borderRadius: 20, padding: "30px 36px", display: "flex", gap: 22, alignItems: "center" }}>
              <span style={{ fontSize: 44 }}>📅</span>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: BLUE }}>정상 차량</div>
                <div style={{ fontSize: 25, color: GRAY, marginTop: 6 }}>6개월 미알림 → 이후 재등록 필요</div>
              </div>
            </div>
          </FadeUp>
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          <Card icon="🔗" title="확장성" desc="지점별 규모가 달라도 동일 로직 적용 가능" delay={34} />
          <Card icon="🗄️" title="데이터 축적" desc="확정 이력을 활용해 AI 판정 정확도 지속 개선" delay={44} />
          <Card icon="🔒" title="협업·보안" desc="AX기획팀 협업 및 내부 보안 검토 기반 운영" delay={54} />
        </div>
      </SceneShell>
      <AbsoluteFill
        style={{
          background: `rgba(11,36,24,${dim * 0.96})`,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
        }}
      >
        <div style={{ opacity: outroP, transform: `translateY(${(1 - outroP) * 50}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 76, marginBottom: 32 }}>🎯</div>
          <div style={{ fontSize: 70, fontWeight: 900, color: "#fff", lineHeight: 1.35 }}>
            전 지점 부정주차 관리 체계로
            <br />
            확장 가능
          </div>
          <div style={{ fontSize: 34, color: "#b9d4c3", marginTop: 38 }}>AI 부정주차 적발 시스템</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================= main ================= */

export const ParkingVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Series>
        <Series.Sequence durationInFrames={120}>
          <TitleScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={165}>
          <ProblemScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={195}>
          <TypesScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={165}>
          <FlowScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={195}>
          <Step1Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={225}>
          <Step2Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={255}>
          <Step3Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={195}>
          <FunnelScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={165}>
          <CompareScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <ExpandScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
