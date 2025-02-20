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
    name: string
  }
  setParams: (params: {
    id: string
    x: number
    y: number
    name: string
  } | null) => void
  token: string
  getConversations: () => void
  ref: any
  setEditNameConv: (editNameConv: {
    id: string
    name: string
  } | null) => void
}

const Params = ({
  params,
  setParams,
  token,
  getConversations,
  ref,
  setEditNameConv,
}: ParamsProps) => {
  const list = [
    { name: "Edit", value: "edit", icon: faPen },
    { name: "Delete", value: "delete", icon: faTrash, red: true },
  ];

  const handleClick = (value: string) => {
    switch (value) {
      case "edit":
        setEditNameConv({ id: params.id, name: params.name });
        setParams(null);
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
