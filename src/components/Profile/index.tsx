import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

interface ProfileProps {

}

const Profile = ({ }: ProfileProps) => {
  return (
    <div className={styles.Profile_container}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={faUser} size='sm' />
      </div>
    </div>
  );
};

export default Profile;
