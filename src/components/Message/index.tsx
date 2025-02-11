import React from 'react';
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeMerge } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface MessageProps {
  chat: {
    id: string
    content: string
    type: string
    skill?: string[]
  },
}

const Message = ({
  chat,
}: MessageProps) => {
  const oneDarkProMixColors = {
    'code[class*="language-"]': {
      background: 'none',
    },
    'pre[class*="language-"]': {
      background: '#282c34',
      color: '#abb2bf',
      borderRadius: '1em',
      padding: '1em',
    },
  };

  return (
    <div className={styles.Message_container} style={{
      justifyContent: chat.type === "user" ? "flex-end" : "flex-start",
    }}>
      <div className={styles.Message} style={{
        backgroundColor: chat.type === "user" ? "#464646" : "",
        color: chat.type === "user" ? "#fff" : "",
        maxWidth: chat.type === "user" ? "65%" : "100%",
      }}>
        {
          chat.type === "milo" ? (
            <div>
              <Markdown
              urlTransform={url => {
                if (url.startsWith("http")) {
                  return url;
                }
              }}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match && (
                    <pre className={styles.code}>
                      <code className={styles.codeBlock} {...props}>
                        <SyntaxHighlighter
                          language={match[1]}
                          wrapLines
                          wrapLongLines
                          style={{ ...vscDarkPlus, ...oneDarkProMixColors }}
                        >
                          {String(children)}
                        </SyntaxHighlighter>
                      </code>
                    </pre>
                  );
                },
              }}
              >{chat.content}</Markdown>
              {chat.skill && <div className={styles.skills}>
                {
                  chat.skill.map((skill) => (
                    <div
                      key={skill}
                      className={styles.skill}
                    >
                      <FontAwesomeIcon icon={faCodeMerge} />
                      {skill}
                    </div>
                ))
                }
              </div>
              }
            </div>
          ) : (
            <div>{chat.content}</div>
          )
        }
      </div>
    </div>
  );
};

export default Message;
