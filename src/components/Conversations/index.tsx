import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import router from 'next/router';

import styles from './style.module.scss';

type Conversation = {
  _id: string;
  name: string;
  updatedAt: string;
};

interface ConversationsProps {
  onConversationChange: () => void;
  isConversation: boolean;
  setIsConversation: (isConversation: boolean) => void;
  conversations: Conversation[];
  id: string;
  onChange: (id: string) => void;
  setCanScroll: (canScroll: boolean) => void;
  setParams: (id: {
    id: string;
    x: number;
    y: number;
  } | null) => void;
}

const Conversations = ({
  onConversationChange,
  isConversation,
  setIsConversation,
  conversations,
  id,
  onChange,
  setCanScroll,
  setParams,
}: ConversationsProps) => {
  const groupConversations = useMemo(() => {
    const today = {
      name: 'Today',
      convs: [],
    } as { name: string; convs: Conversation[] };
    const yesterday = {
      name: 'Yesterday',
      convs: [],
    } as { name: string; convs: Conversation[] };
    const last7Days = {
      name: 'Last 7 days',
      convs: [],
    } as { name: string; convs: Conversation[] };
    const older = {
      name: 'Older',
      convs: [],
    } as { name: string; convs: Conversation[] };

    conversations.forEach((conv) => {
      const updatedAt = new Date(conv.updatedAt);
      const now = new Date();

      if (
        updatedAt.getDate() === now.getDate() &&
        updatedAt.getMonth() === now.getMonth() &&
        updatedAt.getFullYear() === now.getFullYear()
      ) {
        today.convs.push(conv);
      } else if (
        updatedAt.getDate() === now.getDate() - 1 &&
        updatedAt.getMonth() === now.getMonth() &&
        updatedAt.getFullYear() === now.getFullYear()
      ) {
        yesterday.convs.push(conv);
      } else if (updatedAt.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000) {
        last7Days.convs.push(conv);
      } else {
        older.convs.push(conv);
      }
    });

    return {
      today,
      yesterday,
      last7Days,
      older,
    };
  }, [conversations]);

  const handleNewConversation = () => {
    router.push('/');
    setCanScroll(false);
  };

  Object.keys(groupConversations).forEach((key) => {
    groupConversations[key as keyof typeof groupConversations].convs.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  });

  useEffect(() => {
    Object.keys(groupConversations).forEach((key) => {
      groupConversations[key as keyof typeof groupConversations].convs.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    });
  }, [onConversationChange]);

  const showParams = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    setParams({
      id,
      x: e.clientX,
      y: e.clientY - 2
    });
  };

  return (
    <div
      className={styles.Conversations_container}
      style={{
        width: isConversation ? '17%' : '0',
      }}
    >
      <div className={styles.header}>
        <div
          className={styles.icon}
          onClick={() => setIsConversation(!isConversation)}
        >
          <Image
            src="/sidebar.svg"
            alt="sidebar"
            width={30}
            height={30}
            style={{
              transform: isConversation ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>

          {isConversation && <>
            <div className={styles.title}>Conversations</div>
            <div className={styles.icon} onClick={handleNewConversation}>
              <FontAwesomeIcon icon={faPenToSquare} size='sm' color="var(--grey)" />
            </div>
          </>}
      </div>

      <div className={styles.list}>
        {Object.keys(groupConversations).map((key) => {
          if (groupConversations[key as keyof typeof groupConversations].convs.length > 0) {
            return (
              <div key={key} style={{
                display: isConversation ? 'flex' : 'none',
                flexDirection: 'column',
                gap: '.2em',
              }}>
                <h2>{groupConversations[key as keyof typeof groupConversations].name}</h2>

                {groupConversations[key as keyof typeof groupConversations].convs.map((conv) => (
                  <div
                    key={conv._id}
                    className={styles.conversation}
                    style={{
                      backgroundColor: conv._id === id ? 'rgba(100, 100, 100, 0.1)' : '',
                    }}
                  >
                    <span title={conv.name} onClick={() => onChange(conv._id)}>{conv.name.slice(0, 1).toUpperCase() + conv.name.slice(1)}</span>
                    <div className={styles.icon} onClick={(e) => showParams(e, conv._id)}>
                      <FontAwesomeIcon icon={faEllipsis} size='1x' />
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Conversations;
