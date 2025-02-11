import { useEffect, useState } from "react";

const useRecorder = (stream: MediaStream | null, isSpeaking: boolean) => {
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prev) => [...prev, event.data]);
      }
    };

    return () => {
      recorder.stop();
    };
  }, [stream]);

  useEffect(() => {
    if (mediaRecorder) {
      if (isSpeaking && mediaRecorder.state === "inactive") {
        mediaRecorder.start();
      } else if (!isSpeaking && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    }
  }, [isSpeaking, mediaRecorder]);

  return { audioChunks };
};

export default useRecorder;
