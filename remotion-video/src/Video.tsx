import React from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TOTAL_FRAMES = 1380; // 46s @ 30fps

const GREEN_DARK = "#123524";
const GREEN = "#1f5c3d";
const BLUE = "#2563eb";
const BG = "#eef0ec";
const INK = "#16281e";
const GRAY = "#4a5a51";
const RED = "#dc2626";
const ORANGE = "#ea580c";

const FONT = "'Noto Sans KR', sans-serif";

/* ---------- shared helpers ---------- */

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
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const SceneShell: React.FC<{
  label?: string;
  title: string;
  children: React.ReactNode;
}> = ({ label, title, children }) => {
  const frame = useCurrentFrame();
  const titleP = useIn(0);
  const ruleW = interpolate(frame, [8, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT, padding: "70px 110px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: GREEN_DARK }} />
      {label ? (
        <div style={{ fontSize: 30, fontWeight: 700, color: GREEN, opacity: titleP, marginBottom: 6 }}>
          {label}
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <h1
          style={{
            fontSize: 66,
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  icon: string;
  title: string;
  desc: string;
  delay: number;
  accent?: string;
  width?: number | string;
}> = ({ icon, title, desc, delay, accent = GREEN_DARK, width }) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #dfe3dd",
        borderRadius: 24,
        padding: "44px 40px",
        flex: width ? undefined : 1,
        width,
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + p * 0.06})`,
        boxShadow: "0 12px 30px rgba(18,53,36,0.08)",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "#e7efe7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
          marginBottom: 26,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, color: accent, marginBottom: 14 }}>{title}</div>
      <div style={{ fontSize: 28, color: GRAY, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
};

const Banner: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        marginTop: 50,
        background: GREEN_DARK,
        borderRadius: 20,
        padding: "28px 48px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <span style={{ fontSize: 42 }}>🎯</span>
      <span style={{ fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{text}</span>
    </div>
  );
};

/* ---------- Scene 1: Title ---------- */

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
      <div style={{ fontSize: 100, transform: `scale(${icons})`, marginBottom: 30 }}>🎥 🚗</div>
      <h1
        style={{
          fontSize: 110,
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
          fontSize: 42,
          fontWeight: 500,
          color: "#b9d4c3",
          marginTop: 34,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 40}px)`,
        }}
      >
        통계 선별 → AI 판정 → 담당자 확인, 매일 자동으로
      </p>
    </AbsoluteFill>
  );
};

/* ---------- Scene 2: Why ---------- */

const WhyScene: React.FC = () => (
  <SceneShell title="왜 필요한가">
    <div style={{ display: "flex", gap: 40 }}>
      <Card icon="📋" title="기존 한계" desc="수만 대 주차 데이터에서 수작업으로 부정주차 식별이 어려움" delay={10} />
      <Card icon="🎯" title="운영 목표" desc="확실한 의심 차량만 선별해 담당자 확인 부담 최소화" delay={22} />
      <Card icon="📈" title="핵심 변화" desc="월 단위 사후 점검에서 선제 탐지 체계로 전환" delay={34} />
    </div>
  </SceneShell>
);

/* ---------- Scene 3: Two types ---------- */

const TypeCard: React.FC<{
  title: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  items: string[];
  delay: number;
}> = ({ title, icon, color, bg, border, items, delay }) => {
  const p = useIn(delay);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 28,
        padding: "48px 52px",
        opacity: p,
        transform: `translateX(${(1 - p) * (color === BLUE ? 80 : -80)}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
        <span style={{ fontSize: 56, fontWeight: 900, color }}>{title}</span>
        <span
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
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
              fontSize: 32,
              color: INK,
              padding: "12px 0",
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
  <SceneShell title="탐지 대상 2유형">
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
        items={["단기 행사 기간 집중 발생", "차량 1대에 주차권 다량 발행", "특정 브랜드에 발행 집중", "최근 며칠간 POS 발행 급증"]}
      />
    </div>
  </SceneShell>
);

/* ---------- Scene 4: Pipeline ---------- */

const StepBox: React.FC<{ tag: string; icon: string; lines: string[]; delay: number }> = ({
  tag,
  icon,
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
        padding: "44px 30px",
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
          fontSize: 32,
          fontWeight: 800,
          padding: "12px 30px",
          borderRadius: 14,
          marginBottom: 34,
        }}
      >
        {tag}
      </div>
      <div style={{ fontSize: 90, marginBottom: 30 }}>{icon}</div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 32, fontWeight: 600, color: INK, lineHeight: 1.5 }}>
          {l}
        </div>
      ))}
    </div>
  );
};

const PipelineScene: React.FC = () => {
  const a1 = useIn(28);
  const a2 = useIn(52);
  return (
    <SceneShell title="한눈에 보는 운영 구조">
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <StepBox tag="1. 통계 선별" icon="🔍" lines={["z점수 기반", "후보 추출"]} delay={8} />
        <div style={{ fontSize: 60, color: "#9aa79e", fontWeight: 900, opacity: a1 }}>➜</div>
        <StepBox tag="2. AI 판정" icon="🧠" lines={["의심 · 보류 · 정상", "신뢰도 상 · 중 · 하"]} delay={32} />
        <div style={{ fontSize: 60, color: "#9aa79e", fontWeight: 900, opacity: a2 }}>➜</div>
        <StepBox tag="3. 담당자 확정" icon="✅" lines={["Teams 알림 → CCTV 확인", "→ 징수"]} delay={56} />
      </div>
      <Banner text="고정 임계값이 아닌 상대 비교와 AI 맥락 판단으로, 통근형과 팝업형을 모두 놓치지 않도록 설계" delay={95} />
    </SceneShell>
  );
};

/* ---------- Scene 5: z-scores + AI verdicts ---------- */

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
        padding: "28px 30px",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, color: GRAY, lineHeight: 1.45 }}>{desc}</div>
    </div>
  );
};

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
        padding: "26px 28px",
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${0.8 + p * 0.2})`,
        boxShadow: "0 10px 24px rgba(18,53,36,0.08)",
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 900, color, marginBottom: 10 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 24, color: GRAY, lineHeight: 1.45 }}>{desc}</div>
    </div>
  );
};

const JudgeScene: React.FC = () => (
  <SceneShell title="탐지 · 판정 운영 방식">
    <div style={{ display: "flex", gap: 50 }}>
      <div style={{ flex: 1.15 }}>
        <FadeUp delay={6}>
          <div style={{ fontSize: 34, fontWeight: 800, color: GREEN, marginBottom: 22 }}>
            1. 통계 선별 — 네 가지 z점수 중 최고값, 상위 1%만 AI로
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          <ZCard icon="🚗" title="통근형 z" desc="평일 방문수 + 체류시간 + 입차 편차 + POS 건수" delay={14} />
          <ZCard icon="👜" title="팝업형 z" desc="체류시간 대비 POS 건수" delay={22} accent={BLUE} />
          <ZCard icon="🏷️" title="브랜드 집중 z" desc="특정 브랜드 발행 집중 여부" delay={30} />
          <ZCard icon="📈" title="급증 z" desc="최근 3일 POS 발행 급증" delay={38} accent={BLUE} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <FadeUp delay={46}>
          <div style={{ fontSize: 34, fontWeight: 800, color: GREEN, marginBottom: 22 }}>
            2. AI 판정 — 종합 점수 + 신뢰도 기반
          </div>
        </FadeUp>
        <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
          <Verdict label="의심" icon="⚠️" color={RED} desc="부정주차 특징이 여러 수치에서 뚜렷" delay={54} />
          <Verdict label="보류" icon="❓" color={ORANGE} desc="의심은 있으나 정상 가능성도 남음" delay={64} />
          <Verdict label="정상" icon="✅" color="#16a34a" desc="업무 차량·정상 고객 가능성이 높음" delay={74} />
        </div>
        <FadeUp delay={86}>
          <div style={{ background: "#fff", border: "2px solid #dfe3dd", borderRadius: 18, padding: "26px 30px" }}>
            {[
              ["신뢰도 상", RED, "정상 설명이 어려운 경우"],
              ["신뢰도 중", ORANGE, "추가 확인이 필요한 경우"],
              ["신뢰도 하", BLUE, "방문 이력이 적어 판단이 어려운 경우"],
            ].map(([t, c, d]) => (
              <div key={t as string} style={{ fontSize: 27, padding: "8px 0", color: INK }}>
                🛡️ <b style={{ color: c as string }}>{t}</b> : {d}
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  </SceneShell>
);

/* ---------- Scene 6: Daily timeline ---------- */

const TimeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    ["07:00", "Power BI 데이터 갱신", "📊"],
    ["08:00", "데이터 가공 및 AI 판정", "🗄️"],
    ["08:30", "Teams 알림 발송 — 의심 + 신뢰도 상 차량만", "💬"],
    ["담당자", "CCTV 확인 후 버튼 클릭", "🎥"],
    ["완료", "확정(부정주차) / 정상 처리", "✅"],
  ];
  return (
    <SceneShell title="매일 자동으로 도는 알림 · 확정 프로세스">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1350, alignSelf: "center", width: "100%" }}>
        {steps.map(([time, desc, icon], i) => {
          const p = spring({
            frame: frame - 10 - i * 16,
            fps: 30,
            config: { damping: 200 },
            durationInFrames: 26,
          });
          return (
            <div
              key={time}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                opacity: p,
                transform: `translateX(${(1 - p) * 70}px)`,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: i === 4 ? GREEN_DARK : "#e7efe7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div
                style={{
                  background: "#fff",
                  border: "2px solid #dfe3dd",
                  borderRadius: 18,
                  padding: "20px 36px",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  boxShadow: "0 8px 20px rgba(18,53,36,0.06)",
                }}
              >
                <span style={{ fontSize: 34, fontWeight: 900, color: GREEN_DARK, width: 170 }}>{time}</span>
                <span style={{ fontSize: 30, color: INK, fontWeight: 500 }}>{desc}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Banner text="판정·알림·응답을 분리한 구조 — 담당자 응답이 늦어도 분석은 매일 안정적으로 계속 진행" delay={100} />
    </SceneShell>
  );
};

/* ---------- Scene 7: Effects ---------- */

const CountUp: React.FC<{ to: number; delay: number; suffix?: string; prefix?: string }> = ({
  to,
  delay,
  suffix = "",
  prefix = "",
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + 40], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {prefix}
      {Math.round(v).toLocaleString()}
      {suffix}
    </>
  );
};

const StatCard: React.FC<{
  icon: string;
  value: React.ReactNode;
  label: string;
  delay: number;
}> = ({ icon, value, label, delay }) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: "2px solid #dfe3dd",
        borderRadius: 24,
        padding: "40px 36px",
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px)`,
        boxShadow: "0 12px 30px rgba(18,53,36,0.08)",
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 54, fontWeight: 900, color: GREEN_DARK, marginBottom: 10 }}>{value}</div>
      <div style={{ fontSize: 28, color: GRAY, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
};

const EffectScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell title="운영 효과">
      <div style={{ display: "flex", gap: 34 }}>
        <StatCard icon="📊" value={<><CountUp to={4} delay={14} prefix="월 3~" suffix="만대" /></>} label="대규모 주차 데이터 자동 분석" delay={10} />
        <StatCard icon="👥" value="상위 1%" label="이상차량만 추려 AI가 정밀 판정" delay={22} />
        <StatCard icon="🔔" value="일 1~3건" label="담당자 확인 가능한 수준으로 압축" delay={34} />
        <StatCard icon="💰" value="징수 연결" label="확정 시 실제 요금 징수로 연결" delay={46} />
      </div>
      <div style={{ display: "flex", gap: 60, marginTop: 56, justifyContent: "center" }}>
        {["담당자 수작업 부담 감소", "정상 고객 오탐 최소화", "부정주차 억제 효과 기대"].map((t, i) => {
          const p = spring({
            frame: frame - 66 - i * 12,
            fps: 30,
            config: { damping: 200 },
            durationInFrames: 24,
          });
          return (
            <div
              key={t}
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: INK,
                opacity: p,
                transform: `scale(${0.9 + p * 0.1})`,
              }}
            >
              <span style={{ color: "#16a34a", fontWeight: 900, marginRight: 14 }}>✔</span>
              {t}
            </div>
          );
        })}
      </div>
      <Banner text="기존 RMD가 놓치던 통근형과 실시간 팝업형을 보완 — 월 단위 점검에서 매일 자동 운영으로" delay={104} />
    </SceneShell>
  );
};

/* ---------- Scene 8: Expansion + outro ---------- */

const ExpandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const outroP = spring({ frame: frame - 105, fps, config: { damping: 200 }, durationInFrames: 35 });
  const dim = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <SceneShell title="전사 확대 방향">
        <div style={{ display: "flex", gap: 40 }}>
          <Card icon="🔗" title="확장성" desc="지점별 환경이 달라도 z점수 기반으로 동일 로직 적용 가능" delay={10} />
          <Card icon="🗄️" title="데이터 축적" desc="확정 이력을 활용해 AI 판정 정확도 지속 개선" delay={22} />
          <Card icon="🔒" title="협업·보안" desc="AX기획팀 협업 및 내부 보안 검토 기반 운영" delay={34} />
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
        <div
          style={{
            opacity: outroP,
            transform: `translateY(${(1 - outroP) * 50}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 34 }}>🎯</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", lineHeight: 1.35 }}>
            전 지점 부정주차 관리 체계로
            <br />
            확장 가능
          </div>
          <div style={{ fontSize: 36, color: "#b9d4c3", marginTop: 40 }}>AI 부정주차 적발 시스템</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- main ---------- */

export const ParkingVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Series>
        <Series.Sequence durationInFrames={120}>
          <TitleScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <WhyScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <TypesScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <PipelineScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <JudgeScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <TimeScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <EffectScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <ExpandScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
