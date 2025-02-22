import React, { RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import Cookies from "universal-cookie";

import styles from './style.module.scss';

interface PopupProps {
  ref: RefObject<HTMLDivElement | null>;
}

const Popup = ({
  ref,
}: PopupProps) => {
  const cookies = new Cookies();
  const handleSignOut = async () => {
    signOut().then(() => {
      cookies.remove("token");
    }).then(() => {
      window.location.href = "/login";
    });
  }

  const options = [
    { name: 'Settings', icon: faCog, action: () => console.log('Settings') },
    { name: 'Logout', icon: faSignOutAlt, action: handleSignOut },
  ];

  return (
    <div ref={ref} className={styles.Popup_container}>
      {options.map((option, index) => (
        <>
          {options.length === index + 1 && <div className={styles.divider} />}
          <div role='button' key={option.name + index} className={styles.option} onClick={option.action}>
            <FontAwesomeIcon icon={option.icon} size='1x' color='var(--light-grey)' />
            <h2>{option.name}</h2>
          </div>
        </>
      ))}
    </div>
  );
};

export default Popup;
