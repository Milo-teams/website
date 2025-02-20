import React, { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import emitEvent from '@/tools/webSocketHandler';

import styles from './style.module.scss';

interface EditPopupProps {
  conv: {
    id: string;
    name: string;
  }
  setEditNameConv: (editNameConv: {
    id: string;
    name: string;
  } | null) => void;
  token: string;
  setConversations: (conversations: { _id: string, name: string, updatedAt: string }[]) => void;
  convs: any;
}

const EditPopup = ({
  conv,
  setEditNameConv,
  token,
  setConversations,
  convs,
}: EditPopupProps) => {
  const [newName, setNewName] = useState<string>(conv.name);
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    setEditNameConv(null);
  });

  const handleSave = () => {
    emitEvent("renameConversation", { id: conv.id, name: newName, token }, () => {
      setEditNameConv(null);
      setConversations(
        convs.map((c: any) => {
          if (c._id === conv.id) {
            c.name = newName;
          }
          return c;
        })
      );
    });
  }


  return (
    <div className={styles.EditPopup_container}>
      <div ref={ref} className={styles.content}>
        <div className={styles.title}>
          <h2>Edit conversation name</h2>
        </div>

        <div className={styles.input}>
          <input
            type="text"
            defaultValue={conv.name}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={() => setEditNameConv(null)}>Cancel</button>
          <button className={styles.save} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
