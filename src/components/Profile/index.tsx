import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useClickAway } from 'react-use';
import Image from 'next/image';
import Popup from './popup';

import styles from './style.module.scss';

const Profile = () => {
  const { data: session } = useSession() as any;
  const [userInfos, setUserInfos] = useState<{ name: string, email: string, image: string } | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const popupref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    setUserInfos({ name: session.user?.name, email: session.user?.email, image: session.user?.image });
  }, [session]);

  useClickAway(popupref, () => {
    setShowPopup(false);
  });

  return (
    <>
    <div role='button' className={styles.Profile_container} onClick={() => setShowPopup(!showPopup)}>
      <div className={styles.icon}>
        {userInfos?.image ? (
          <Image src={userInfos?.image} alt="profile" fill  />
        ) : (
          <FontAwesomeIcon icon={faUser} size='sm' />
        )}
      </div>
    </div>

    {showPopup && (
      <Popup ref={popupref} />
    )}
    </>
  );
};

export default Profile;
