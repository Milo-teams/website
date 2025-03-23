import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useClickAway } from 'react-use';

import styles from './style.module.scss';

interface ParamsProps {

}

const Params = ({ }: ParamsProps) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    router.push(router.asPath.replace('#params', ''));
  });

  useEffect(() => {
    setIsVisible(router.asPath.includes('#params'));
  }, [router]);

  if (!isVisible) return null

  return (
    <div className={styles.Params_container}>
      <div ref={ref} className={styles.content}>
        <div className={styles.header}>
          <h1>Parameters</h1>
          <button
            className={styles.close}
            onClick={() => {
              router.push(router.asPath.replace('#params', ''));
              setIsVisible(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Params;
