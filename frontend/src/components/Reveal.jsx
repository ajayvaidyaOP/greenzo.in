import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal — scroll-triggered entrance animation.
 * Variants: up (default) | left | right | scale | mask | none
 * Honours prefers-reduced-motion via CSS.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  dir = 'up',
  delay = 0,
  duration,
  className = '',
  once = true,
  threshold = 0.15,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      ref={ref}
      data-dir={dir}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...(duration ? { transitionDuration: `${duration}ms` } : null),
        ...style
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
