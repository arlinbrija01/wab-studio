'use client';

import SplitText from '@/components/reactbits/SplitText';

/**
 * Titolo di sezione che entra parola per parola da dietro una maschera.
 * Usa il componente SplitText di React Bits (GSAP SplitText + ScrollTrigger).
 */
export default function Heading({
  text,
  tag = 'h2',
  className = 'display-lg',
  delay = 28,
  duration = 1.1,
}: {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <SplitText
      text={text}
      tag={tag}
      className={className}
      splitType="words"
      effect="rise"
      mask
      textAlign="left"
      delay={delay}
      duration={duration}
      ease="power4.out"
      threshold={0.15}
      rootMargin="-60px"
    />
  );
}
