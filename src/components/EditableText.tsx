import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";

interface EditableTextProps {
  value: string;
  onChange: (text: string) => void;
  as?: "div" | "span" | "h1" | "p";
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
  ariaLabel?: string;
  multiline?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
}

export function EditableText({
  value,
  onChange,
  as: Tag = "div",
  className,
  style,
  placeholder,
  ariaLabel,
  multiline = false,
  autoFocus = false,
  readOnly = false,
}: EditableTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  useEffect(() => {
    if (!autoFocus || !ref.current) return;
    ref.current.focus();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = () => {
    const text = ref.current?.textContent?.trim() ?? "";
    if (text !== value) onChange(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      if (ref.current) ref.current.textContent = value;
      ref.current?.blur();
    }
  };

  if (readOnly) {
    return (
      <Tag className={className} style={style} aria-label={ariaLabel}>
        {value || placeholder}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={`editable-text${className ? ` ${className}` : ""}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={ariaLabel}
      data-placeholder={placeholder}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}
