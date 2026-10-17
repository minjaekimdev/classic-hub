interface IconProps {
  /** Material Symbols 아이콘 이름 (예: "search", "close") */
  name: string;
  /** px 단위 아이콘 크기 */
  size?: number;
  fill?: boolean;
  className?: string;
}

export default function Icon({ name, size, fill = false, className }: IconProps) {
  const classes = ["material-symbols-outlined", className].filter(Boolean).join(" ");
  return (
    <span
      aria-hidden="true"
      className={classes}
      data-weight={fill ? "fill" : undefined}
      style={size ? { fontSize: size } : undefined}
    >
      {name}
    </span>
  );
}
