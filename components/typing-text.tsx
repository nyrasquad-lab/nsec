'use client';

import { useEffect, useState } from 'react';

/**
 * Realistic terminal typing animation that loops forever.
 * Types the full text, pauses, deletes character-by-character, repeats.
 */
export default function TypingText({
  text,
  typeSpeed = 100,
  deleteSpeed = 50,
  pause = 2000,
  className,
  cursorClassName,
}: {
  text: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
  cursorClassName?: string;
}) {
  const [display, setDisplay] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;

    const run = () => {
      if (!mounted) return;
      if (!deleting) {
        if (display.length < text.length) {
          setDisplay(text.slice(0, display.length + 1));
          timeout = setTimeout(run, typeSpeed);
        } else {
          timeout = setTimeout(() => {
            if (mounted) setDeleting(true);
            run();
          }, pause);
        }
      } else {
        if (display.length > 0) {
          setDisplay(text.slice(0, display.length - 1));
          timeout = setTimeout(run, deleteSpeed);
        } else {
          setDeleting(false);
          timeout = setTimeout(run, typeSpeed);
        }
      }
    };

    timeout = setTimeout(run, typeSpeed);
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, deleting]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
      <span
        className={
          cursorClassName ??
          'ml-0.5 inline-block w-[3px] h-[0.9em] -mb-1 bg-cyber-accent animate-pulse'
        }
        aria-hidden
      />
    </span>
  );
}
