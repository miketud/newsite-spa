'use client';
import { useEffect, useState } from 'react';
import '@/styles/cursor.css'; // plain CSS file
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [overTextField, setOverTextField] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 4000, damping: 100 });
  const springY = useSpring(mouseY, { stiffness: 4000, damping: 100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, [contenteditable="true"]')) {
        setOverTextField(true);
        document.body.style.cursor = 'text';
      } else {
        setOverTextField(false);
        document.body.style.cursor = 'none';
      }
      if (
        el.closest('.menu-hover, [role="button"], button, a, .cursor-clickable')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleOver);
    document.body.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleOver);
      document.body.style.cursor = '';
    };
  }, [mouseX, mouseY]);

  // Hide the custom cursor over inputs/textareas/contenteditable
  if (overTextField) return null;

  return (
    <motion.div
      className={`cursorStyle ${hovering ? 'cursorOutline' : ''}`}
      animate={
        hovering
          ? {
              width: 30,
              height: 30,
              borderRadius: 30,
              background: 'transparent',
              border: '5px solid #53a7d7ff',
            }
          : {
              width: 20,
              height: 20,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.84)',
              border: '4px solid rgba(238, 43, 21, 0.73)',
            }
      }
      style={{
        left: springX,
        top: springY,
      }}
    />
  );
}
