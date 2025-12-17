import React from "react";

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
    <div className="flex flex-col gap-[0.44rem]">
      <label className="text-[#0a0a0a] text-[0.77rem] font-medium" htmlFor={id}>
        {label}
      </label>
      <div
        className="px-[0.66rem] rounded-[0.42rem] bg-[#f3f3f5]"
        style={{
          paddingTop: `${verticalPadding}`,
          paddingBottom: `${verticalPadding}`,
        }}
      >
        {isSingleLine ? (
          <input
            className="text-[#717182] text-[0.77rem] w-full"
            type={type}
            id={id}
            placeholder={placeHolder}
            style={{ height: inputAreaHeight }}
            required={required}
          />
        ) : (
          <textarea
            className="text-[#717182] text-[0.77rem] w-full"
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
