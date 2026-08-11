import React from "react";
import { Composition } from "remotion";
import { ParkingVideo, TOTAL_FRAMES } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ParkingSystem"
        component={ParkingVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ vertical: false }}
      />
      <Composition
        id="ParkingSystemVertical"
        component={ParkingVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ vertical: true }}
      />
    </>
  );
};
