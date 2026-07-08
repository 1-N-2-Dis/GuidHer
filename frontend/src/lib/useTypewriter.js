// Types out `text` one character at a time, then clears and repeats every `cycleMs`.
// Respects prefers-reduced-motion by rendering the full text immediately, statically.
import { useEffect, useState } from 'react';

export default function useTypewriter(text, { typeSpeed = 45, cycleMs = 10000 } = {}) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }

    let typeInterval;
    const startTyping = () => {
      let i = 0;
      setDisplay('');
      typeInterval = setInterval(() => {
        i += 1;
        setDisplay(text.slice(0, i));
        if (i >= text.length) clearInterval(typeInterval);
      }, typeSpeed);
    };

    startTyping();
    const cycleInterval = setInterval(startTyping, cycleMs);
    return () => {
      clearInterval(typeInterval);
      clearInterval(cycleInterval);
    };
  }, [text, typeSpeed, cycleMs]);

  return display;
}
