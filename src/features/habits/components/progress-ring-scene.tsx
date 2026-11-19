import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/theme/colors";
import { PineScene } from "./pine-scene";

const STROKE_WIDTH = 8;
const SCENE_GAP = 4;
const PERCENT = 100;

type ProgressRingSceneProps = {
  progress: number; // 0..1
  size: number;
};

export function ProgressRingScene({ progress: rawProgress, size }: ProgressRingSceneProps) {
  const progress = Math.min(1, Math.max(0, rawProgress));
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const inner = size - 2 * STROKE_WIDTH - 2 * SCENE_GAP;
  const percent = Math.round(progress * PERCENT);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Günlük ilerleme"
      accessibilityValue={{ min: 0, max: PERCENT, now: percent }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={STROKE_WIDTH}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.deep}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${circumference * progress} ${circumference}`}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View
        style={[
          styles.sceneClip,
          {
            left: STROKE_WIDTH + SCENE_GAP,
            top: STROKE_WIDTH + SCENE_GAP,
            width: inner,
            height: inner,
          },
        ]}
      >
        <PineScene size={inner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sceneClip: { position: "absolute", borderRadius: 999, overflow: "hidden" },
});
