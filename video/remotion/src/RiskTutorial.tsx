import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FONT = `'Noto Sans CJK KR', 'Noto Sans KR', sans-serif`;

const INDIGO = '#4f46e5';
const NAVY = '#0f172a';

const INTRO = 130;
const CHAPTER = 65;
const OUTRO = 170;

type Chapter = {
  clip: string;
  frames: number;
  no: string;
  title: string;
  desc: string;
  caption: string;
};

const CHAPTERS: Chapter[] = [
  {
    clip: 'a',
    frames: 330,
    no: '01',
    title: '지점 로그인',
    desc: '소속 지점을 선택하고 패스코드로 접속합니다.',
    caption: '소속 지점 선택 → 접속 패스코드 입력 → 지점 접속하기',
  },
  {
    clip: 'b',
    frames: 180,
    no: '02',
    title: '부서 선택',
    desc: '지점 관제 화면에서 관리할 부서를 선택합니다.',
    caption: '부서 카드에서 등록 건수·진척도 확인 후 클릭해 입장',
  },
  {
    clip: 'c',
    frames: 615,
    no: '03',
    title: '위험성평가 작성',
    desc: '기본 정보를 확인하고 위험요인을 관리합니다.',
    caption: '사진 한 장이면 AI가 위험요인·개선대책·위험도까지 자동 작성 (검수 후 승인)',
  },
  {
    clip: 'd',
    frames: 300,
    no: '04',
    title: '보고서 미리보기',
    desc: '작성된 평가를 인쇄용 양식으로 바로 확인합니다.',
    caption: '① 위험성 추정 표 (A4 가로) · ② 개선대책 카드 (A4 세로)',
  },
  {
    clip: 'e',
    frames: 720,
    no: '05',
    title: '지점 관리자 기능',
    desc: '관리자 비밀번호로 지점 통합 관제에 들어갑니다.',
    caption: '부서별 참여율·개선율 현황 확인, 새로운 부서 개설도 즉시 가능',
  },
  {
    clip: 'f',
    frames: 345,
    no: '06',
    title: '총괄 관제실',
    desc: '전 지점의 위험성평가 현황을 한눈에 모니터링합니다.',
    caption: '전사 통합 대시보드 · 지점별 AI 보고서 · 전체 엑셀(XLSX) 내보내기',
  },
];

export const RISK_TUTORIAL_DURATION =
  INTRO + CHAPTERS.reduce((a, c) => a + CHAPTER + c.frames, 0) + OUTRO;

const Fade: React.FC<{duration: number; children: React.ReactNode}> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 12, duration - 12, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Badge: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      display: 'inline-block',
      padding: '10px 28px',
      borderRadius: 999,
      background: 'rgba(79,70,229,0.18)',
      border: `2px solid rgba(99,102,241,0.6)`,
      color: '#c7d2fe',
      fontFamily: FONT,
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: 6,
    }}
  >
    {children}
  </div>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const sub = spring({frame: frame - 22, fps, config: {damping: 200}});
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, ${NAVY} 65%)`,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 40,
          background: 'rgba(99,102,241,0.15)',
          border: '2px solid rgba(99,102,241,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 76,
          marginBottom: 44,
          transform: `scale(${s})`,
          fontFamily: `${FONT}, 'Noto Color Emoji'`,
        }}
      >
        🛡️
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 108,
          fontWeight: 900,
          color: 'white',
          letterSpacing: 2,
          opacity: s,
          transform: `translateY(${(1 - s) * 40}px)`,
        }}
      >
        위험성평가 시스템
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 600,
          color: '#a5b4fc',
          marginTop: 26,
          marginBottom: 40,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 24}px)`,
        }}
      >
        AI 스마트 위험성평가 · 사용 가이드
      </div>
      <div style={{opacity: sub}}>
        <Badge>로그인부터 총괄 관제까지 6단계</Badge>
      </div>
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{ch: Chapter}> = ({ch}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1e1b4b 0%, ${NAVY} 70%)`,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 800,
          color: INDIGO,
          background: 'white',
          width: 108,
          height: 108,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
          transform: `scale(${s})`,
          boxShadow: '0 12px 50px rgba(79,70,229,0.45)',
        }}
      >
        {ch.no}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 92,
          fontWeight: 900,
          color: 'white',
          opacity: s,
          transform: `translateY(${(1 - s) * 30}px)`,
        }}
      >
        {ch.title}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 500,
          color: '#c7d2fe',
          marginTop: 24,
          opacity: s,
        }}
      >
        {ch.desc}
      </div>
    </AbsoluteFill>
  );
};

const ClipScene: React.FC<{ch: Chapter}> = ({ch}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cap = spring({frame: frame - 8, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: NAVY}}>
      <OffthreadVideo
        src={staticFile(`rat/${ch.clip}.mp4`)}
        style={{width: '100%', height: '100%'}}
        muted
      />
      {/* step badge */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'rgba(15,23,42,0.82)',
          borderRadius: 999,
          padding: '12px 30px 12px 14px',
          border: '1px solid rgba(99,102,241,0.5)',
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: INDIGO,
            color: 'white',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {ch.no}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 800,
            color: 'white',
          }}
        >
          {ch.title}
        </div>
      </div>
      {/* caption bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: cap,
          transform: `translateY(${(1 - cap) * 24}px)`,
        }}
      >
        <div
          style={{
            background: 'rgba(15,23,42,0.88)',
            border: '1px solid rgba(99,102,241,0.45)',
            borderRadius: 20,
            padding: '20px 44px',
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 600,
            color: 'white',
            maxWidth: 1500,
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }}
        >
          {ch.caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const rows = [
    '📸 사진 한 장으로 AI 위험성평가 초안 자동 작성',
    '🖨 A4 인쇄용 평가표·개선대책 카드 즉시 출력',
    '🏢 지점 → 총괄까지 실시간 통합 관제',
  ];
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, ${NAVY} 65%)`,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 84,
          fontWeight: 900,
          color: 'white',
          marginBottom: 50,
          opacity: s,
          transform: `translateY(${(1 - s) * 30}px)`,
        }}
      >
        안전한 현장, 지금 시작하세요
      </div>
      {rows.map((r, i) => {
        const rs = spring({frame: frame - 20 - i * 12, fps, config: {damping: 200}});
        return (
          <div
            key={r}
            style={{
              fontFamily: `${FONT}, 'Noto Color Emoji'`,
              fontSize: 42,
              fontWeight: 600,
              color: '#e0e7ff',
              marginBottom: 22,
              opacity: rs,
              transform: `translateY(${(1 - rs) * 18}px)`,
            }}
          >
            {r}
          </div>
        );
      })}
      <div style={{marginTop: 36, opacity: spring({frame: frame - 60, fps, config: {damping: 200}})}}>
        <Badge>위험성평가 시스템</Badge>
      </div>
    </AbsoluteFill>
  );
};

export const RiskTutorial: React.FC = () => {
  return (
    <AbsoluteFill style={{background: NAVY}}>
      <Series>
        <Series.Sequence durationInFrames={INTRO}>
          <Fade duration={INTRO}>
            <IntroScene />
          </Fade>
        </Series.Sequence>
        {CHAPTERS.map((ch) => (
          <React.Fragment key={ch.no}>
            <Series.Sequence durationInFrames={CHAPTER}>
              <Fade duration={CHAPTER}>
                <ChapterCard ch={ch} />
              </Fade>
            </Series.Sequence>
            <Series.Sequence durationInFrames={ch.frames}>
              <Fade duration={ch.frames}>
                <ClipScene ch={ch} />
              </Fade>
            </Series.Sequence>
          </React.Fragment>
        ))}
        <Series.Sequence durationInFrames={OUTRO}>
          <Fade duration={OUTRO}>
            <OutroScene />
          </Fade>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
