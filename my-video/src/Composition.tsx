import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  name: string;
};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{ name: "Anurag" }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const LETTER_STAGGER = 5;

const Letter: React.FC<{ char: string; index: number; total: number }> = ({
  char,
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 10 - index * LETTER_STAGGER,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  const translateY = interpolate(enter, [0, 1], [120, 0]);
  const rotate = interpolate(enter, [0, 1], [-40, 0]);
  const scale = interpolate(enter, [0, 1], [0.3, 1]);

  // A gentle wave that travels across the letters once they have landed.
  const wave = Math.sin((frame - index * 6) / 8) * 8;
  const waveStrength = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hue = (index / total) * 120 + 260 + frame * 1.5;

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${translateY + wave * waveStrength}px) rotate(${rotate}deg) scale(${scale})`,
        opacity: enter,
        color: `hsl(${hue % 360}, 90%, 65%)`,
        textShadow: `0 0 30px hsla(${hue % 360}, 90%, 60%, 0.7)`,
      }}
    >
      {char}
    </span>
  );
};

export const MyComponent: React.FC<Props> = ({ name }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const letters = name.toUpperCase().split("");

  const lettersDone = 10 + letters.length * LETTER_STAGGER + 15;

  const underline = spring({
    frame: frame - lettersDone,
    fps,
    config: { damping: 200 },
  });

  const subtitle = spring({
    frame: frame - lettersDone - 10,
    fps,
    config: { damping: 200 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const bgShift = interpolate(frame, [0, durationInFrames], [0, 60]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${30 + bgShift}% 40%, #2a1b5c 0%, #0b0b1a 70%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "'Helvetica Neue', Helvetica, Arial, 'Segoe UI', sans-serif",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            letterSpacing: 12,
            lineHeight: 1,
          }}
        >
          {letters.map((char, i) => (
            <Letter key={i} char={char} index={i} total={letters.length} />
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            height: 8,
            width: 700 * underline,
            borderRadius: 4,
            background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)",
            boxShadow: "0 0 24px rgba(236, 72, 153, 0.6)",
          }}
        />
        <div
          style={{
            marginTop: 32,
            fontSize: 36,
            fontWeight: 300,
            letterSpacing: 16,
            color: "#e5e7eb",
            opacity: subtitle,
            transform: `translateY(${interpolate(subtitle, [0, 1], [20, 0])}px)`,
          }}
        >
          WELCOME
        </div>
      </div>
    </AbsoluteFill>
  );
};
