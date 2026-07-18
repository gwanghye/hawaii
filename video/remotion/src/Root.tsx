import React from 'react';
import {Composition} from 'remotion';
import {HawaiiVideo, TOTAL_DURATION} from './HawaiiVideo';
import {RiskTutorial, RISK_TUTORIAL_DURATION} from './RiskTutorial';

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="HawaiiHoneymoon"
      component={HawaiiVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="RiskAssessmentTutorial"
      component={RiskTutorial}
      durationInFrames={RISK_TUTORIAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    </>
  );
};
