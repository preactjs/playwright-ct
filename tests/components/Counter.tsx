import { useRef } from "preact/hooks"

type CounterProps = {
  count?: number;
  onClick?(props: string): void;
  children?: any;
}

let _remountCount = 1;

export function Counter(props: CounterProps) {
  const remountCount = useRef(_remountCount++);
  return <div onClick={() => props.onClick?.('hello')}>
    <div id="props">{ props.count }</div>
    <div id="remount-count">{ remountCount.current }</div>
    { props.children }
  </div>
}
