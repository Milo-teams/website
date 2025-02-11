import { useEffect, useState } from "react";

const useMicrophone = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getMicrophoneAccess = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(audioStream);
      } catch (err) {
        console.error("Error while accessing microphone:", err);
      }
    };

    getMicrophoneAccess();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return stream;
};

export default useMicrophone;
