import { AbsoluteFill, Img, Video } from "remotion";

interface Props {
  mediaSrc?: string;
  backgroundColor?: string;
}

export const MediaBackdropScene: React.FC<Props> = ({
  mediaSrc,
  backgroundColor = "#0a0a0a",
}) => {
  const isVideo = mediaSrc?.match(/\.(mp4|webm|mov)$/i);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {mediaSrc &&
        (isVideo ? (
          <Video src={mediaSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={mediaSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ))}
    </AbsoluteFill>
  );
};
