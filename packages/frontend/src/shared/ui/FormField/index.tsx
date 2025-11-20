import React from "react";
import "@app/styles/main.scss";
import styles from "./FormField.module.scss";

interface FormFieldProps {
  isSingleLine: boolean;
  type?: string; // 1줄 입력(input 태그)인 경우에만 작성
  id: string;
  label: string;
  placeHolder: string;
  verticalPadding: string;
  inputAreaHeight: string;
  required: boolean;
}

/* input의 id와 type을 동일하게 하여 props개수 줄이기*/
/* ex) type=email, id=email */
const FormField: React.FC<FormFieldProps> = ({
  isSingleLine,
  type,
  id,
  label,
  placeHolder,
  verticalPadding,
  inputAreaHeight,
  required,
}) => {
  return (
    <div className={styles.formField}>
      <label className={styles.formField__label} htmlFor={id}>
        {label}
      </label>
      <div
        className={styles.formField__content}
        style={{
          paddingTop: `${verticalPadding}`,
          paddingBottom: `${verticalPadding}`,
        }}
      >
        {isSingleLine ? (
          <input
            className={styles.inputArea}
            type={type}
            id={id}
            placeholder={placeHolder}
            style={{ height: inputAreaHeight }}
            required={required}
          />
        ) : (
          <textarea
            className={styles.inputArea}
            id={id}
            name={id}
            placeholder={placeHolder}
            style={{ height: inputAreaHeight }}
            required={required}
          ></textarea>
        )}
      </div>
    </div>
  );
};

export default FormField;
