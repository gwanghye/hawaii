import React from 'react';
import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
} from 'remotion';

const FONT = `'Noto Sans CJK KR', 'Noto Sans KR', sans-serif`;
const EMOJI_FONT = `${FONT}, 'Noto Color Emoji'`;

const SCENE = 150; // 5s
const SCENE_LONG = 180; // 6s
export const TOTAL_DURATION =
  SCENE + SCENE + SCENE + SCENE_LONG + SCENE + SCENE + SCENE_LONG + SCENE_LONG;

// ---------- building blocks ----------

const FadeInOut: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({duration, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 15, duration - 15, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Waves: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const shift = (frame * 4) % width;
  const wave = (offset: number, amp: number, opacity: number) => (
    <svg
      key={offset}
      width={width * 2}
      height={220}
      viewBox={`0 0 ${width * 2} 220`}
      style={{
        position: 'absolute',
        bottom: 0,
        left: -shift - offset,
        opacity,
      }}
    >
      <path
        d={`M0 ${110 + amp} ${Array.from({length: 17}, (_, i) => {
          const x = (i + 1) * (width / 8);
          const y = 110 + (i % 2 === 0 ? -amp : amp);
          return `Q ${x - width / 16} ${y} ${x} 110`;
        }).join(' ')} L ${width * 2} 220 L 0 220 Z`}
        fill={color}
      />
    </svg>
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {wave(0, 26, 0.35)}
      {wave(420, 38, 0.55)}
    </AbsoluteFill>
  );
};

const Stars: React.FC<{count?: number}> = ({count = 120}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({length: count}, (_, i) => {
        const x = random(`x-${i}`) * width;
        const y = random(`y-${i}`) * height * 0.75;
        const size = 2 + random(`s-${i}`) * 4;
        const twinkle =
          0.4 + 0.6 * Math.abs(Math.sin(frame / 12 + random(`p-${i}`) * 10));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'white',
              opacity: twinkle,
              boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 34,
      letterSpacing: 14,
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.85)',
      marginBottom: 28,
      fontWeight: 500,
    }}
  >
    {children}
  </div>
);

const SceneLayout: React.FC<{
  background: string;
  emoji: string;
  kicker: string;
  title: string;
  bullets: string[];
  night?: boolean;
  waveColor?: string;
}> = ({background, emoji, kicker, title, bullets, night, waveColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleSpring = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background}}>
      {night ? <Stars /> : null}
      {waveColor ? <Waves color={waveColor} /> : null}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 160px',
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontFamily: EMOJI_FONT,
            marginBottom: 10,
            transform: `scale(${titleSpring})`,
          }}
        >
          {emoji}
        </div>
        <Kicker>{kicker}</Kicker>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 88,
            fontWeight: 900,
            color: 'white',
            textShadow: '0 8px 40px rgba(0,0,0,0.35)',
            transform: `translateY(${(1 - titleSpring) * 40}px)`,
            marginBottom: 56,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {bullets.map((b, i) => {
          const delay = 25 + i * 12;
          const s = spring({frame: frame - delay, fps, config: {damping: 200}});
          return (
            <div
              key={b}
              style={{
                fontFamily: EMOJI_FONT,
                fontSize: 44,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.95)',
                opacity: s,
                transform: `translateY(${(1 - s) * 24}px)`,
                marginBottom: 18,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {b}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- scenes ----------

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const sub = spring({frame: frame - 20, fps, config: {damping: 200}});
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #ff9a56 0%, #ff6a88 45%, #5f27cd 100%)',
      }}
    >
      <Waves color="#1e3799" />
      <AbsoluteFill
        style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}
      >
        <div style={{fontSize: 120, fontFamily: EMOJI_FONT, transform: `scale(${s})`}}>
          🌺
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 150,
            fontWeight: 900,
            color: 'white',
            letterSpacing: 4,
            textShadow: '0 10px 50px rgba(0,0,0,0.35)',
            transform: `translateY(${(1 - s) * 60}px)`,
            opacity: s,
          }}
        >
          Hawaii Honeymoon
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 48,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 10,
            marginTop: 30,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
          }}
        >
          2026. 6. 7 — 6. 15 · 빅아일랜드 & 오아후 · 8박 10일
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const sub = spring({frame: frame - 30, fps, config: {damping: 200}});
  const sun = interpolate(frame, [0, SCENE_LONG], [280, 420], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #2c2c54 0%, #b33771 45%, #fd7272 75%, #f8a5c2 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: sun,
          transform: 'translateX(-50%)',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffeaa7 0%, #fdcb6e 60%, rgba(253,203,110,0) 100%)',
          boxShadow: '0 0 120px 60px rgba(253,203,110,0.5)',
        }}
      />
      <Waves color="#40407a" />
      <AbsoluteFill
        style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 140,
            fontWeight: 900,
            color: 'white',
            textShadow: '0 10px 50px rgba(0,0,0,0.4)',
            opacity: s,
            transform: `translateY(${(1 - s) * 50}px)`,
          }}
        >
          Mahalo, Hawaii
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.92)',
            marginTop: 34,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
            lineHeight: 1.7,
          }}
        >
          하와이에서의 열흘 —<br />
          우리의 첫 페이지는 이렇게 완성되었습니다.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- main ----------

export const HawaiiVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Series>
        <Series.Sequence durationInFrames={SCENE}>
          <FadeInOut duration={SCENE}>
            <TitleScene />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE}>
          <FadeInOut duration={SCENE}>
            <SceneLayout
              background="linear-gradient(180deg, #0abde3 0%, #48dbfb 55%, #feca57 100%)"
              waveColor="#01579b"
              emoji="🌋"
              kicker="Chapter 1 · Big Island"
              title="코나에서의 3일"
              bullets={[
                '🌅 알리이 드라이브 선셋 산책',
                "🦞 Huggo's 씨푸드 디너로 여행 시작",
                '🏨 킹 카메하메하 코나 비치 호텔 3박',
              ]}
            />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE}>
          <FadeInOut duration={SCENE}>
            <SceneLayout
              background="linear-gradient(180deg, #341f97 0%, #b33939 55%, #2c2c54 100%)"
              emoji="🐢"
              kicker="Volcano Day"
              title="검은 모래와 살아있는 화산"
              bullets={[
                '🖤 푸나루우 블랙샌드 비치 · 그린 바다거북',
                '🌋 킬라우에아 칼데라 · 써스턴 용암 터널',
                '🚗 Chain of Craters Road 드라이브 250km',
              ]}
            />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_LONG}>
          <FadeInOut duration={SCENE_LONG}>
            <SceneLayout
              background="linear-gradient(180deg, #050b2e 0%, #1b1464 60%, #40407a 100%)"
              night
              emoji="⭐"
              kicker="Mauna Kea · 4,205m"
              title="구름 위의 일몰, 쏟아지는 은하수"
              bullets={[
                '💧 아카카 폭포 137m · 와이피오 계곡',
                '🌄 마우나케아 정상에서 맞는 선셋',
                '🌌 북반구 최고의 별하늘, 육안 은하수',
              ]}
            />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE}>
          <FadeInOut duration={SCENE}>
            <SceneLayout
              background="linear-gradient(180deg, #ff9ff3 0%, #f368e0 45%, #341f97 100%)"
              waveColor="#6D214F"
              emoji="🌺"
              kicker="Chapter 2 · O'ahu"
              title="와이키키에 도착하다"
              bullets={[
                '✈️ 코나 → 호놀룰루 45분 비행',
                '🏝 알로힐라니 리조트 오션뷰 체크인',
                '🥂 Azure 파인다이닝 로맨틱 디너',
              ]}
            />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE}>
          <FadeInOut duration={SCENE}>
            <SceneLayout
              background="linear-gradient(180deg, #1dd1a1 0%, #10ac84 50%, #01579b 100%)"
              waveColor="#004d40"
              emoji="🚣"
              kicker="Adventure Days"
              title="에메랄드 바다와 정글"
              bullets={[
                '🏖 라니카이 비치 · 모쿠 섬 카약',
                '🦕 쿠알로아 랜치 무비투어 & UTV',
                '⛰ 다이아몬드헤드 · 루아우 불쇼 🔥',
              ]}
            />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_LONG}>
          <FadeInOut duration={SCENE_LONG}>
            <SceneLayout
              background="linear-gradient(180deg, #0652DD 0%, #0abde3 55%, #ff9a56 100%)"
              waveColor="#130f40"
              emoji="🐬"
              kicker="Highlight · 6/14"
              title="바다 3연타"
              bullets={[
                '🤿 야생 돌고래와 스노클링',
                '🪂 하늘로 날아오르는 패러세일링',
                '⛵ 샴페인과 함께하는 선셋 크루즈',
              ]}
            />
          </FadeInOut>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_LONG}>
          <FadeInOut duration={SCENE_LONG}>
            <ClosingScene />
          </FadeInOut>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
