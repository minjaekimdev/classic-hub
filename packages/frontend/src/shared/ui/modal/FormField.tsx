import React, { forwardRef } from "react";

interface BaseProps {
  id: string;
  label: string;
  placeHolder: string;
  verticalPadding: string;
  inputAreaHeight: string;
  required: boolean;
}

interface InputProps extends BaseProps {
  isSingleLine: true;
  type: string;
}

interface TextAreaProps extends BaseProps {
  isSingleLine: false;
}

type FormFieldProps = InputProps | TextAreaProps;

interface FormFieldLayout {
  id: string; // label과 input, textarea를 이어주기 위함
  label: string;
  verticalPadding: string;
  children: React.ReactNode;
}
export const FormFieldLayout = ({
  id,
  label,
  verticalPadding,
  children,
}: FormFieldLayout) => {
  return (
    <div className="flex flex-col gap-[0.44rem]">
      <label className="text-dark text-[0.77rem] font-medium" htmlFor={id}>
        {label}
      </label>
      <div
        className="px-066 rounded-main bg-[#f3f3f5]"
        style={{
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 첫 번째 제네릭: Ref의 타입 (두 요소를 모두 포함)
// 두 번째 제네릭: Props의 타입
const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>((props, ref) => {
  return (
    <div className="flex flex-col gap-[0.44rem]">
      <label
        className="text-dark text-[0.77rem] font-medium"
        htmlFor={props.id}
      >
        {props.label}
      </label>
      <div
        className="px-066 rounded-main bg-[#f3f3f5]"
        style={{
          paddingTop: props.verticalPadding,
          paddingBottom: props.verticalPadding,
        }}
      >
        {props.isSingleLine ? (
          <input
            // 이 부분이 핵심입니다!
            // 상위에서 넘어온 범용 ref를 input 전용으로 단언해줍니다.
            ref={ref as React.Ref<HTMLInputElement>}
            className="w-full bg-transparent text-[0.77rem] text-[#717182] outline-none"
            type={props.type}
            id={props.id}
            placeholder={props.placeHolder}
            style={{ height: props.inputAreaHeight }}
            required={props.required}
          />
        ) : (
          <textarea
            // 여기서는 textarea 전용으로 단언해줍니다.
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className="w-full resize-none bg-transparent text-[0.77rem] text-[#717182] outline-none"
            id={props.id}
            name={props.id}
            placeholder={props.placeHolder}
            style={{ height: props.inputAreaHeight }}
            required={props.required}
          ></textarea>
        )}
      </div>
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;
