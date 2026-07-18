# Remotion 영상 프로젝트

두 개의 컴포지션이 있습니다.

1. `HawaiiHoneymoon` — 하와이 신혼여행 하이라이트 (아래 참고)
2. `RiskAssessmentTutorial` — 위험성평가 시스템(risk-assessment 앱) 사용 가이드.
   Firebase 에뮬레이터에서 앱을 구동하고 Playwright로 실사용 흐름을 녹화한
   클립(`public/rat/*.mp4`)에 인트로·챕터 카드·자막을 입힌 영상.
   렌더: `npx remotion render src/index.ts RiskAssessmentTutorial out/risk-tutorial.mp4`

# Hawaii Honeymoon 2026 — Remotion 영상

여행 계획(`../../index.html`) 기반으로 React 코드로 만든 하이라이트 영상.
결과물: `out/hawaii-honeymoon.mp4` (1920×1080 · 30fps · 43초 · 8개 씬)

## 렌더링 방법

```bash
npm install
npx remotion render src/index.ts HawaiiHoneymoon out/hawaii-honeymoon.mp4
```

미리보기 스튜디오: `npx remotion studio`

## 수정 포인트

- 씬 내용/문구: `src/HawaiiVideo.tsx`의 `<SceneLayout>` props
- 씬 길이: `SCENE`(5초) / `SCENE_LONG`(6초) 상수
- 해상도/fps: `src/Root.tsx`의 `<Composition>`
- 한글 폰트: Noto Sans CJK KR 필요 (`apt-get install fonts-noto-cjk fonts-noto-color-emoji`)
