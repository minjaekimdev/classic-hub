import React from "react";
// import styles from "./AuthButton.module.scss";

interface AuthButtonProps {
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({ children }) => {
  return <button className="rounded-button w-full">{children}</button>;
};

export default AuthButton;
