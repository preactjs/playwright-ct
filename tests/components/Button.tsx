type ButtonProps = {
  title: string;
  onClick?(props: string): void;
  className?: string;
};

export function Button({ onClick, title, ...attributes }: ButtonProps) {
  return <button {...attributes} onClick={() => onClick?.('hello')}>
    {title}
  </button>
}
