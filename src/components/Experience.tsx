'use client';

import React, { useEffect, useState, useRef } from 'react';

// 1. RainbowText component for animated gradient
const RainbowText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      background: 'linear-gradient(90deg, #ff5e62, #ff9966, #ffea00, #39ff14, #1e90ff, #9b30ff, #ff5e62 110%)',
      backgroundSize: '200% auto',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
      animation: 'rainbow-move 3s linear infinite',
      fontWeight: 700,
      letterSpacing: '0.01em',
      ...style,
    }}
  >
    {children}
    <style jsx>{`
      @keyframes rainbow-move {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
    `}</style>
  </span>
);

// 2. Array of segments (add or tweak segments as you like)
type Segment = {
  text: string;
  style?: React.CSSProperties;
  rainbow?: boolean;
};
const fullTextArr: Segment[] = [
  { text: 'Increased healthcare consumption increases ' },
  { text: 'COSTS', style: { color: '#f25415', fontWeight: 700 } },
  { text: '. Simple. ' },
  { text: 'FRAMEWORx', rainbow: true },
  { text: ' seeks to leverage design and technology to ' },
  { text: 'IMPROVE', style: { color: '#39d353', fontWeight: 700, letterSpacing: '0.01em' } },
  { text: ', not simply increase healthcare' },
];
const finalChar = '.';

// 3. Helper to render styled characters as they're revealed
function getStyledText(upto: number): React.ReactNode[] {
  let count = 0;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < fullTextArr.length && count < upto; i++) {
    const { text, style, rainbow } = fullTextArr[i];
    const nextCount = count + text.length;
    let content = text;
    if (nextCount > upto) {
      content = text.slice(0, upto - count);
    }
    if (rainbow) {
      elements.push(
        <RainbowText key={i} style={style}>
          {content}
        </RainbowText>
      );
    } else {
      elements.push(
        <span key={i} style={style}>
          {content}
        </span>
      );
    }
    if (nextCount > upto) break;
    count = nextCount;
  }
  return elements;
}

// 4. Experience component (the banner)
export function Experience() {
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const [showFinalChar, setShowFinalChar] = useState<boolean>(false);
  const [doneTyping, setDoneTyping] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const totalLength = fullTextArr.map((seg) => seg.text).join('').length;

  useEffect(() => {
    // Intersection observer to start typing when component is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTyping(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (startTyping && displayedCount < totalLength) {
      const typingInterval = setInterval(() => {
        setDisplayedCount((prev) => prev + 1);
      }, 60);
      return () => clearInterval(typingInterval);
    }
    if (displayedCount === totalLength && !showFinalChar) {
      const finalTimer = setTimeout(() => {
        setShowFinalChar(true);
        setDoneTyping(true);
      }, 1100);
      return () => clearTimeout(finalTimer);
    }
  }, [startTyping, displayedCount, showFinalChar, totalLength]);

  return (
    <div
      ref={ref}
      style={{
        width: 1020,
        height: 500,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        background: '#333',
        borderRadius: 28,
        boxShadow: '0 10px 20px 0 #0a0a0ace, 0 2px 8px #0000000d',
        border: '1.5px solid #637fec33',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        position: 'relative',
        margin: '0 auto',
        padding: '46px 64px 0 64px',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontSize: 60,
          fontWeight: 400,
          letterSpacing: '0.02em',
          fontFamily: 'system-ui, sans-serif',
          color: '#fff',
          background: 'transparent',
          minWidth: 0,
          lineHeight: 1.1,
          textAlign: 'left',
          display: 'inline-block',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {getStyledText(displayedCount)}
        {showFinalChar && (
          <span style={{ color: '#fff', fontSize: 60 }}>{finalChar}</span>
        )}
        <span
          style={{
            display: 'inline-block',
            width: '0.6em',
            height: '1.1em',
            backgroundColor: '#ccc',
            marginLeft: doneTyping ? '0.1em' : '0',
            animation: 'blink 1s step-end infinite',
            verticalAlign: 'middle',
          }}
        />
        <style jsx>{`
          @keyframes blink {
            from,
            to {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
      </span>
    </div>
  );
}
