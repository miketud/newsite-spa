'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_BOXES = 8;
const BOX_SIZE = 35;
const GAP = 28; // Space between squares
const CONVEYOR_WIDTH = MAX_BOXES * BOX_SIZE + (MAX_BOXES - 1) * GAP;
const PAUSE_SIZE = 54;
const FLOATING_FRAME_HEIGHT = 220;
const FLOATING_AREA_HEIGHT = FLOATING_FRAME_HEIGHT + 100; // padding for floating frame

const colorLabelPairs = [
  { color: "#39d353", label: "PATIENT MSG" },
  { color: "#9c27b0", label: "CLINICAL NOTE" },
  { color: "#2683FF", label: "NEW RX" },
  { color: "#ffbe2f", label: "ADJUSTMENT" },
  { color: "#ff8800", label: "REFILL" },
  { color: "#ff0033", label: "CANCEL" },
];

type BoxInfo = { id: number; color: string; label: string };

export default function Workflow({
  paused: pausedProp = false,
  onTogglePause,
}: {
  paused?: boolean;
  onTogglePause?: () => void;
}) {
  const [boxes, setBoxes] = useState<BoxInfo[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showClearedFrame, setShowClearedFrame] = useState(false);
  const nextId = useRef(1);
  const paused = pausedProp;

  useEffect(() => {
    if (paused) return;
    if (boxes.length >= MAX_BOXES) return;
    const interval = setInterval(() => {
      setBoxes(prev =>
        prev.length < MAX_BOXES
          ? [
            ...prev,
            {
              id: nextId.current++,
              ...colorLabelPairs[Math.floor(Math.random() * colorLabelPairs.length)],
            },
          ]
          : prev
      );
    }, 800);
    return () => clearInterval(interval);
  }, [paused, boxes.length]);

  function handleBoxClick(idx: number) {
    setSelected(cur => (cur === idx ? null : idx));
    setShowClearedFrame(false);
  }

  function handleFrameDoubleClick() {
    if (selected === null) return;
    setBoxes(prev => prev.filter((_, idx) => idx !== selected));
    setSelected(null);
    setShowClearedFrame(true);
    setTimeout(() => {
      setShowClearedFrame(false);
      setSelected(boxes.length > 1 ? 0 : null);
    }, 1200);
  }

  return (
    <>
      <div
        style={{
          fontWeight: 700,
          fontSize: 40,
          marginTop: 0,
          marginBottom: 0,
          color: "#333",
          textAlign: "center",
          maxWidth: 1050,
        }}
      >
        THE PHARMACY WORKFLOW REIMAGINED
      </div>
      <div style={{
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 6px 36px #0001',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '10px 0 42px 0',
        position: 'relative'
      }}>
        {/* SECTION 1: Filler Text */}
        <div
          style={{
            width: '100%',
            minHeight: 90,
            margin: '0 auto 0px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            color: '#555',
            textAlign: 'center',
            fontWeight: 700,
            letterSpacing: 0.01,
          }}
        >
          <span>
            Streamline the intake process.
          </span>
        </div>
        <div
          style={{
            width: '90%',
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#555',
            textAlign: 'center',
            fontWeight: 500,
            letterSpacing: 0.01,
          }}
        >
          A powerful operations engine translates and converts electronic communication (ex. an eRx, a patient message).
          <br/>
          Review messages all in one place, then easily connect them to other components.
          <br/>
          
        </div>

        {/* SECTION 2: Pause + Conveyor Row, both centered in main container */}
        <div style={{
          width: CONVEYOR_WIDTH + PAUSE_SIZE + 24,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 44,
        }}>
          {/* Pause Button */}
          <div style={{
            width: PAUSE_SIZE,
            height: PAUSE_SIZE,
            background: '#fff',
            border: '4px solid #333',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 24,
            boxSizing: 'border-box',
          }}>
            <div
              role="button"
              tabIndex={0}
              aria-label={paused ? "Start Animation" : "Pause Animation"}
              onClick={onTogglePause}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") onTogglePause && onTogglePause();
              }}
              style={{
                width: 20,
                height: 20,
                background: paused ? "#ff2222" : "#21d353",
                border: '4px solid #232323',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'background 0.25s, box-shadow 0.18s',
                animation: paused
                  ? 'none'
                  : 'flash-green 1s infinite cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            <style>
              {`
                @keyframes flash-green {
                  0%, 100% { box-shadow: 0 0 0 0 #21d35366, 0 2px 8px rgba(0,0,0,0.08);}
                  50%      { box-shadow: 0 0 0 10px #21d35344, 0 2px 8px rgba(0,0,0,0.12);}
                }
              `}
            </style>
          </div>
          {/* Conveyor Row */}
          <div style={{
            width: CONVEYOR_WIDTH,
            display: 'flex',
            alignItems: 'center',
            gap: GAP,
            justifyContent: 'flex-start',
          }}>
            <AnimatePresence initial={false}>
              {boxes.map((box, idx) => (
                <motion.div
                  layout
                  key={box.id}
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    boxShadow: selected === idx
                      ? '0 12px 32px 0 #00000046, 0 0 0 0 #fff0'
                      : '0 2px 8px 0 #23232310',
                  }}
                  exit={{ scale: 0.6, opacity: 0, y: 40, transition: { duration: 0.3 } }}
                  transition={{ type: "spring", stiffness: 430, damping: 32 }}
                  style={{
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    background: box.color,
                    border: '2px solid #000',
                    borderRadius: 4,
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: selected === idx ? 2 : 1,
                    marginBottom: selected === idx ? 16 : 0,
                    outline: selected === idx ? '2px solid #222' : 'none',
                    flex: "0 0 auto"
                  }}
                  title={box.label}
                  onClick={() => handleBoxClick(idx)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Frame Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: 300,
          margin: '0 auto',
          marginBottom: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          <AnimatePresence>
            {selected !== null && boxes[selected] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `calc(50% + ${((PAUSE_SIZE + 24) / 2) - (CONVEYOR_WIDTH / 2)}px)`,
                  transform: 'translateX(-50%)',
                  width: 410,
                  height: FLOATING_FRAME_HEIGHT,
                  border: '3px solid #222',
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 12px 64px #0003',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0',
                  userSelect: 'none'
                }}
                onDoubleClick={handleFrameDoubleClick}
              >
                <div style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#181818',
                  padding: '22px 0 12px 0',
                  borderBottom: '1px solid #e6e6e6',
                  letterSpacing: 0.5
                }}>
                  {boxes[selected].label}
                </div>
                <div style={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#aaa',
                  fontSize: 16,
                  fontStyle: 'italic'
                }}>
                  Double-click to clear this slot.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Cleared Frame with the same calculation for left */}
          <AnimatePresence>
            {showClearedFrame && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 30 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  top: FLOATING_FRAME_HEIGHT + 0,
                  left: `calc(50% + ${((PAUSE_SIZE + 24) / 2) - (CONVEYOR_WIDTH / 2)}px)`,
                  transform: 'translateX(-50%)',
                  width: 410,
                  height: 48,
                  border: '3px solid #222',
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 8px 40px #0003',
                  zIndex: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#888',
                  fontStyle: 'italic',
                  userSelect: 'none'
                }}
              >
                Transmitting... ... ... saved!
              </motion.div>
              
            )}
          </AnimatePresence>
          
        </div>
      </div>
{/* Filler text below automation belt/frames */}
<div
  style={{
    width: '100%',
    margin: '22px auto 0 auto',
    textAlign: 'center',
    color: '#555',
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: 0.1,
  }}
>
DATABASE INTEGRATION with RxNorm, SNOMED-CT, UMLS
</div>
    </>
  );
}
