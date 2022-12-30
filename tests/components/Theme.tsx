import { createContext } from 'preact';

export const ThemeContext = createContext('light');

export function Theme() {
  return <ThemeContext.Consumer>{theme => theme}</ThemeContext.Consumer>;
}
