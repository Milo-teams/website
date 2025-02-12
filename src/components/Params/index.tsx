import React from 'react';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import emitEvent from '@/tools/webSocketHandler';
import router from 'next/router';

import styles from './style.module.scss';

interface ParamsProps {
  params: {
    id: string
    x: number
    y: number
  }
  setParams: (params: {
    id: string
    x: number
    y: number
  } | null) => void
  token: string
  getConversations: () => void
  ref: any
}

const Params = ({
  params,
  setParams,
  token,
  getConversations,
  ref,
}: ParamsProps) => {
  const list = [
    { name: "Edit", value: "edit", icon: faPen },
    { name: "Delete", value: "delete", icon: faTrash, red: true },
  ];

  const handleClick = (value: string) => {
    switch (value) {
      case "edit":
        break;
      case "delete":
        emitEvent("deleteConversation", { id: params.id, token }, () => {
          setParams(null);
          getConversations();
          router.push("/");
        });
    }
  }

  return (
    <div
      className={styles.Params_container}
      style={{
        top: params.y - 18,
      }}
      ref={ref}
    >
      {list.map((item, index) => (
        <div
          key={index + item.name}
          className={styles.Params_item}
          {...item.red && { style: { color: "var(--red)" } }}
          onClick={() => handleClick(item.value)}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Params;
