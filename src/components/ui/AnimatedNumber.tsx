import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedNumber({
  value,
  duration = 1500,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  style,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimestamp = useRef<number | null>(null);
  const startValue = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    startValue.current = displayValue;
    startTimestamp.current = null;

    const animate = (timestamp: number) => {
      if (startTimestamp.current === null) {
        startTimestamp.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue.current + (value - startValue.current) * easeProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString('zh-CN');

  return (
    <span className={`font-orbitron ${className}`} style={style}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
