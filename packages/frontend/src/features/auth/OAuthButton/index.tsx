import React from "react";
import styles from "./OAuthButton.module.scss";

interface OAuthButtonProps {
  iconSrc: string;
  children: React.ReactNode;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ iconSrc, children }) => {
  return (
    <button className={styles.oAuthButton}>
      <div className={styles.oAuthButton__wrapper}>
        <img src={iconSrc} alt="" />
        {children}
      </div>
    </button>
  );
};

export default OAuthButton;
