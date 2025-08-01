'use client';

import { useEffect, useState } from 'react';

const fullText =
  'Digital pharmacy frameworks engineered to optimize healthcare access and delivery';
const finalChar = '.'; // Yellow period

export function TypingBanner() {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinalChar, setShowFinalChar] = useState(false);
  const [doneTyping, setDoneTyping] = useState(false);

  // Start typing after initial 2s blink
  useEffect(() => {
    const delay = setTimeout(() => setStartTyping(true), 2000);
    return () => clearTimeout(delay);
  }, []);

  // Typing effect
  useEffect(() => {
    if (startTyping && currentIndex < fullText.length) {
      const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 60);
      return () => clearInterval(typingInterval);
    }

    if (currentIndex === fullText.length && !showFinalChar) {
      const finalTimer = setTimeout(() => {
        setShowFinalChar(true);
        setDoneTyping(true);
      }, 2000);
      return () => clearTimeout(finalTimer);
    }
  }, [startTyping, currentIndex, showFinalChar]);

  return (
    <div
      style={{
        minWidth: 1020,
        height: 550,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        background: 'rgba(0, 0, 0, 1)',
        borderRadius: 28,
        boxShadow: '0 10px 20px 0 #000000a9, 0 2px 8px #0002',
        border: '1.5px solid #30364d33',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <span
        style={{
          fontSize: 80,
          fontWeight: 400,
          letterSpacing: '0.02em',
          fontFamily: 'system-ui, sans-serif',
          display: 'inline-block',
          // whiteSpace: 'pre-wrap',
          color: '#53a7d7ff',
          background: 'transparent',
          padding: '56px 64px 0 64px', // plenty of space from the edges
          minWidth: 0,
        }}
      >
        {displayedText}
        {showFinalChar && (
          <span style={{ color: '#ffd500', fontSize: 80 }}>{finalChar}</span>
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
