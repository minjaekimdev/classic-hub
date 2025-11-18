import React from "react";
import "@app/styles/main.scss";
import styles from "./FormField.module.scss";

interface FormFieldProps {
  isSingleLine: boolean;
  id: string;
  label: string;
  placeHolder: string;
  verticalPadding: string;
  inputAreaHeight: string;
}

/* input의 id와 type을 동일하게 하여 props개수 줄이기*/
/* ex) type=email, id=email */
const FormField: React.FC<FormFieldProps> = ({
  isSingleLine,
  id,
  label,
  placeHolder,
  verticalPadding,
  inputAreaHeight,
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
            type={id}
            id={id}
            placeholder={placeHolder}
            style={{ height: inputAreaHeight }}
            required
          />
        ) : (
          <textarea
            className={styles.inputArea}
            id={id}
            name={id}
            placeholder={placeHolder}
            style={{ height: inputAreaHeight }}
          ></textarea>
        )}
      </div>
    </div>
  );
};

export default FormField;
