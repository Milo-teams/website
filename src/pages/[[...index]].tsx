import { useEffect, useRef, useState } from "react"
import { Conversations, EditPopup, InputBar, Params, Profile, SpeechRecorder } from "@/components"
import Message from "@/components/Message"
import emitEvent from "@/tools/webSocketHandler"
import { socket } from "./_app"
import router from "next/router"
import Cookies from "universal-cookie"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { useClickAway } from "react-use"

interface ChannelProps {
  id: string
  token: string
  groqKey: string
}

const Channel = ({
  id,
  token,
  groqKey,
}: ChannelProps) => {
  const [chats, setChats] = useState<{
    id: string
    content: string
    type: string
    skill?: string[]
  }[]>([]);
  const [conversations, setConversations] = useState<{ _id: string, name: string, updatedAt: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    name: string
    status: "pending" | "success" | "error"
  } | null>(null);
  const [canScroll, setCanScroll] = useState<boolean>(false);
  const [isConversation, setIsConversation] = useState<boolean>(true);
  const [params, setParams] = useState<{ id: string, x: number, y: number, name: string } | null>(null);
  const [editNameConv, setEditNameConv] = useState<{ id: string, name: string } | null>(null);

  const messageBufferRef = useRef<{ [id: string]: string }>({});
  const messageRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef<HTMLDivElement>(null);

  const handleSend = (message: string) => {
    if (id) {
      setChats((prev) => [...prev, { id: Date.now().toString(), content: message, type: "user" }])
      emitEvent("ask", { message, ...(id && { id }), token });

    } else {
      emitEvent("createConversation", { message, token }, (data) => {
        setChats([{ id: Date.now().toString(), content: message, type: "user" }]);
        router.push(`/c/${data.data._id}`)
        emitEvent("ask", { message, id: data.data._id, token })
        setTimeout(() => emitEvent("getAllConversation", { token }, (data) => setConversations(data.data)), 500);
      });
    }
  }

  const handleConversationChange = () => {
    setIsConversation((prev) => !prev);
    setCanScroll(false);
  }

  useEffect(() => {
    socket.on("message_received", (data: { id: string; content: string; type: "milo", skill: string[] }) => {
      const { id, content, type } = data;

      messageBufferRef.current[id] = (messageBufferRef.current[id] || "") + content;

      setChats((prev) => {
        const existingMessage = prev.find((msg) => msg.id === id);

        if (existingMessage) {
          return prev.map((msg) =>
            msg.id === id
              ? { ...msg, content: messageBufferRef.current[id], skill: data.skill }
              : msg
          );
        } else {
          return [...prev, { id, content: messageBufferRef.current[id], type, skill: data.skill }];
        }
      });
    });

    socket.on("name_received", (data: { id: string; name: string }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === data.id ? { ...conv, name: data.name } : conv
        ));
    });

    socket.on("chat_status", (data) => {
      if (data.status === "success") {
        emitEvent("getAllConversation", { token }, (data) => setConversations(data.data));
        setStatus({ name: data.name, status: "success" });
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      } else {
        setStatus({ name: data.name, status: data.status });
      }
    });

    return () => {
      socket.off("message_received");
      socket.off("name_received");
      socket.off("chat_status");
    };
  }, [socket]);

  const handleGetMessages = (id: string) => {
    emitEvent("getMessages", { id, token }, (data, error) => {
      if (error === "Error getting messages.")
        return router.push("/")

      const allMessages: { id: string, content: string, type: string, skill?: string[] }[] = [];
      data.data.forEach((message: { content: string, userInput: string, _id: string, skill: string[] }) => {
        const { content, userInput, _id, skill } = message;
        allMessages.push({ id: _id, content: userInput, type: "user" });
        allMessages.push({ id: _id, content, type: "milo", skill });
      });

      setChats(allMessages);
    });
  }

  useEffect(() => {
    emitEvent("getAllConversation", { token }, (data) => setConversations(data.data));

    if (!id || id === "") return;
    handleGetMessages(id);
  }, [])

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "instant"
      });
    }

  }, [chats, messageRef]);

  const handleScroll = () => {
    if (messageRef.current) {
      if (messageRef.current.scrollTop < messageRef.current.scrollHeight - messageRef.current.clientHeight - 10) setCanScroll(true);
      else setCanScroll(false);
    }
  }

  useClickAway(paramsRef, () => {
    setParams(null);
  });

  return (
    <main className="background">
      {isSpeaking ?
        <SpeechRecorder
          token={token}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          setChats={setChats}
          groqKey={groqKey}
        />
      :
        <>
          <Profile />

          {params &&
            <Params
              params={params}
              setParams={setParams}
              token={token}
              getConversations={() => emitEvent("getAllConversation", { token }, (data) => setConversations(data.data))}
              ref={paramsRef}
              setEditNameConv={setEditNameConv}
            />
          }
          {editNameConv && <EditPopup conv={editNameConv} setEditNameConv={setEditNameConv} token={token} setConversations={setConversations} convs={conversations} />}

          <Conversations
            onConversationChange={handleConversationChange}
            isConversation={isConversation}
            setIsConversation={setIsConversation}
            conversations={conversations}
            id={id}
            onChange={(newId) => {
              if (newId === id) return;
              router.push(`/c/${newId}`);
              handleGetMessages(newId);
              setCanScroll(false);
              setChats([]);
            }}
            setCanScroll={setCanScroll}
            setParams={setParams}
          />

          {id &&
            <div
              className="container_chat"
              ref={messageRef}
              onScroll={handleScroll}
              style={{
                marginLeft: isConversation ? "17%" : "0",
                padding: isConversation ? "1em 18%" : "1em 26.5%"
              }}
            >
              {chats.map(chat => (
                  <Message key={chat.id + chat.type} chat={chat} />
              ))}
            </div>
          }

          {canScroll &&
            <div
              className="arrowDown"
              onClick={scrollToBottom}
              style={{
                left: isConversation ? "83%" : "75%",
              }}
            >
              <FontAwesomeIcon icon={faArrowDown} size="xs" />
            </div>
          }

          <div
            className={id ? "bottom" : "container"}
            style={{
              marginLeft: isConversation ? "17%" : "0",
              width: isConversation ? "83%" : "100%"
            }}
          >
            {!id && <h1>What do we do today?</h1>}
            <InputBar
              placeholder="Message Milo"
              onSend={(message) => handleSend(message)}
              onSpeak={() => setIsSpeaking(true)}
              isHome={!id}
              status={status}
            />

            <div className="advertisement">
              Milo can make mistakes. Consider to double-check the information.
            </div>
          </div>
        </>
      }
    </main>
  )
}

export default Channel

export const getServerSideProps = async (ctx: any) => {
  const { index } = ctx.query;

  const cookies = new Cookies(ctx.req.headers.cookie);
  const token = cookies.get("token");

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  if (index?.length === 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const groqKey = process.env.GROQ_API_KEY;

  return {
    props: {
      id: index?.[1] || null,
      token,
      groqKey
    }
  }
}