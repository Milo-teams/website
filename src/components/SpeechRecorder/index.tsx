import React, { useEffect, useRef, useState } from "react";
import Hark from "hark";
import emitEvent from "@/tools/webSocketHandler";
import router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "./style.module.scss";

interface VoiceRecorderProps {
  token: string;
  isSpeaking: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setChats: (chats: any) => void;
  groqKey: string;
}

const VoiceRecorder = ({
  token,
  isSpeaking,
  setIsSpeaking,
  setChats,
  groqKey,
}: VoiceRecorderProps) => {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const transcribeAudio = async (audioBlob: Blob): Promise<void> => {
    try {
      if (!audioBlob || !isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const apiKey = groqKey;

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", "whisper-large-v3");
      formData.append("temperature", "0.0");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Error while fetching Whisper API:", response.statusText);
        return;
      }

      const data = await response.json();

      emitEvent("createConversation", { token }, (datas) => {
        router.push(`/c/${datas.data._id}`)
        setChats([{ id: Date.now().toString(), content: data.text, type: "user" }]);
        audioStreamRef.current?.getTracks().forEach((track) => track.stop());
        setIsSpeaking(false);
        navigator.vibrate(200);
        emitEvent("ask", { message: data.text, id: datas.data._id, token })
      });
    } catch (err) {
      console.error("Error while transcribing audio:", err);
      setIsSpeaking(false);
    }
  };

  const startRecording = () => {
    if (!audioStreamRef.current) return;

    const mediaRecorder = new MediaRecorder(audioStreamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      await transcribeAudio(audioBlob);
    };

    mediaRecorder.start();
  };

  const initializeHark = (stream: MediaStream) => {
    const harkInstance = Hark(stream, {
      interval: 25,
      threshold: -65,
      play: false,
    });

    harkInstance.on("speaking", () => {
    });

    harkInstance.on("stopped_speaking", () => {
      stopRecording();
      harkInstance.stop();
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    const initializeMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        initializeHark(stream);
        startRecording();
      } catch (err) {
        console.error("Error while initializing microphone:", err);
      }
    };

    initializeMicrophone();

    return () => {
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      stopRecording();
    };
  }, []);

  return (
    <div className={styles.Speech_container}>
      <div className={styles.animation}>
        {
          Array.from({ length: 5 }).map((_, index) => (
            <span key={index} style={{ ['--i' as string]: index - 1 }} />
          ))
        }
      </div>

      <div className={styles.Speech_bubble}>
        <p></p>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            audioStreamRef.current?.getAudioTracks().forEach((track) => {
              track.enabled = !isMuted;
            });
          }}
          style={{ backgroundColor: "var(--light-grey)" }}
        >
          <FontAwesomeIcon icon={
            !isMuted ? faMicrophone : faMicrophoneSlash
          } size="2x" />
        </button>

        <button
          onClick={() => {
            router.reload();
          }}
          style={{ backgroundColor: "var(--red)" }}
        >
          <FontAwesomeIcon icon={faXmark} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
