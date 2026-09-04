import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'up' | 'fade' | 'scale' | 'left' | 'right';
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
}

export function ScrollReveal({
  children,
  animation = 'up',
  delay = 0,
  duration,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animClass = `reveal-${animation}`;
  const customStyle: React.CSSProperties = {};
  if (delay > 0) customStyle.transitionDelay = `${delay}ms`;
  if (duration && duration > 0) customStyle.transitionDuration = `${duration}ms`;

  return (
    <div
      ref={ref}
      className={`reveal ${animClass} ${isVisible ? 'revealed' : ''} ${className}`}
      style={customStyle}
    >
      {children}
    </div>
  );
}
