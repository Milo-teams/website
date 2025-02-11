import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp, faCircleCheck, faHourglassHalf, faPaperclip, faPodcast, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface InputBarProps {
  placeholder?: string;
  onSend: (message: string) => void;
  onSpeak: () => void;
  isHome: boolean;
  status: {
    name: string
    status: "pending" | "success" | "error"
  } | null;
}

const InputBar = ({
  placeholder = 'Type a message...',
  onSend,
  onSpeak,
  isHome = false,
  status,
}: InputBarProps) => {
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const adjustInputHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustInputHeight();
    setInputValue(e.target.value);
  }

  useEffect(() => {
    adjustInputHeight();
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (inputValue.trim().length === 0) {
      onSpeak();
      return;
    }
    setInputValue('');
    adjustInputHeight();
    if (!inputValue.trim()) return;
    if (onSend) onSend(inputValue);

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
    inputRef.current?.focus();
  }

  return (
    <div className={styles.InputBar_container} style={{
      boxShadow: !isHome ? '0 -10px 10px rgba(0, 0, 0, 0.1)' : '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    }}>
        <textarea
          name="input"
          id="input"
          ref={inputRef}
          className={styles.InputBar_input}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className={styles.tools}>
          <button className={styles.tools_button}>
            <FontAwesomeIcon icon={faPaperclip} size='2x' />
          </button>

          {status && <div className={styles.status}>
            <FontAwesomeIcon icon={
              status.status === 'pending' ? faHourglassHalf :
              status.status === 'success' ? faCircleCheck :
              faTriangleExclamation
            } color={
              status.status === 'pending' ? '#5bc0de' :
              status.status === 'success' ? '#00a86b' :
              '#f0ad4e'
            } />
            <span>{status.name}</span>
          </div>}

          <button
            className={styles.tools_button}
            tabIndex={0}
            onClick={handleSend}
          >
            <FontAwesomeIcon icon={
              inputValue.trim().length > 0 ?
              faArrowAltCircleUp :
              faPodcast
            } size='2x' />
          </button>
        </div>
    </div>
  );
};

export default InputBar;
