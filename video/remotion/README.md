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
