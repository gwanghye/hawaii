import React from 'react';
import {Composition} from 'remotion';
import {HawaiiVideo, TOTAL_DURATION} from './HawaiiVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HawaiiHoneymoon"
      component={HawaiiVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
