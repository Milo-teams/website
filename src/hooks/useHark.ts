import { useEffect, useState } from "react";
import hark from "hark";

const useHark = (stream: MediaStream | null) => {
  const [isSpeaking, setIsSpeaking] = useState(true);

  useEffect(() => {
    if (!stream) return;

    const speechEvents = hark(stream, { threshold: -65, interval: 25 });

    speechEvents.on("speaking", () => setIsSpeaking(true));
    speechEvents.on("stopped_speaking", () => setIsSpeaking(false));

    return () => {
      speechEvents.stop();
    };
  }, [stream]);

  return { isSpeaking };
};

export default useHark;
