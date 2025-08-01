'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

type WorkflowProps = {
  paused?: boolean;
  onTogglePause?: () => void;
};

const colorLabelPairs = [
  { color: "#39d353", label: "PATIENT MSG" },
  { color: "#9c27b0", label: "CLINICAL NOTE" },
  { color: "#2683FF", label: "NEW RX" },
  { color: "#ffbe2f", label: "ADJUSTMENT" },
  { color: "#ff8800", label: "REFILL" },
  { color: "#ff0033", label: "CANCEL" },
];

const STOP_X = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
const BOX_START_X = -300;

type BoxInfo = { id: number; color: string; label: string };
type SlotInfo = { stopX: number; box: BoxInfo | null; animKey: number };

function AnimatedBox({
  stopX,
  color,
  label,
  isSelected,
  onClick,
  animKey,
}: {
  stopX: number;
  color: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  animKey: number;
}) {
  const controls = useAnimation();
  const startX = BOX_START_X;
  const velocity = 150; // px/sec
  const duration = (stopX - startX) / velocity;

  useEffect(() => {
    controls.set({ x: startX, opacity: 0 });
    controls.start({
      x: stopX,
      opacity: 1,
      transition: { duration, ease: 'linear' },
    });
    // Only want this effect to run on animKey, stopX changes
  }, [animKey, stopX, duration, controls]);

  return (
    <motion.div
      animate={controls}
      initial={false}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 230,
        width: 50,
        height: 50,
        background: color,
        border: '2px solid #000',
        borderRadius: 4,
        zIndex: isSelected ? 2 : 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        y: isSelected ? -16 : 0,
        boxShadow: isSelected
          ? '0 12px 32px 0 #00000046, 0 0 0 0 #fff0'
          : '0 2px 8px 0 #23232310',
        transition: 'box-shadow 0.18s, y 0.22s cubic-bezier(.4,0,.2,1)',
      }}
      title={label}
    />
  );
}

export default function Workflow({
  paused: pausedProp = false,
  onTogglePause,
}: WorkflowProps) {
  // Each slot holds its own box (or null) and a key to trigger reanimation
  const [slots, setSlots] = useState<SlotInfo[]>(
    STOP_X.map((stopX) => ({ stopX, box: null, animKey: 0 }))
  );
  const [queue, setQueue] = useState<BoxInfo[]>([]);
  const [selected, setSelected] = useState<number | null>(null); // slot index
  const nextId = useRef(1);
  const paused = pausedProp;

  // Add new boxes to queue when automation is on
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setQueue((q) => [
        ...q,
        {
          id: nextId.current++,
          ...colorLabelPairs[Math.floor(Math.random() * colorLabelPairs.length)],
        },
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, [paused]);

  // Fills open slots from queue, animating each arrival (NO SLOTS dependency!)
  useEffect(() => {
    if (paused || queue.length === 0) return;
    // Only fill as many open slots as there are boxes in the queue
    setSlots((prevSlots) => {
      // Get open indexes
      const openIndexes = prevSlots
        .map((slot, i) => (!slot.box ? i : null))
        .filter((i) => i !== null) as number[];
      if (openIndexes.length === 0) return prevSlots;
      let q = [...queue];
      const newSlots = prevSlots.map((slot, idx) => {
        if (!slot.box && q.length > 0) {
          const newBox = q.shift()!;
          return {
            ...slot,
            box: newBox,
            animKey: Date.now() + Math.random(),
          };
        }
        return slot;
      });
      if (q.length !== queue.length) setQueue(q); // remove used boxes
      return newSlots;
    });
    // only run when queue/paused changes
    // eslint-disable-next-line
  }, [queue, paused]);

  // Clicking a square toggles selection for frame
  function handleBoxClick(idx: number) {
    setSelected((cur) => (cur === idx ? null : idx));
  }

  // Double-click frame: clear slot, slot will re-fill from queue with animation
  function handleFrameDoubleClick() {
    if (selected === null) return;
    setSlots((prev) =>
      prev.map((s, i) => (i === selected ? { ...s, box: null } : s))
    );
    setSelected(null);
  }

  // Frame position, center below selected slot
  const selectedSlot = selected !== null ? slots[selected] : null;
  const frameLeft =
    selectedSlot != null
      ? selectedSlot.stopX + 230 + 25 - 200 // box's left + width/2 - frame/2
      : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        left: -300,
        maxWidth: 1200,
        height: 200 + 320,
        margin: '60px auto 0 auto',
      }}
    >
      {/* Animated Boxes (1 per slot) */}
      {slots.map(
        (slot, idx) =>
          slot.box && (
            <AnimatedBox
              key={slot.box.id + '-' + slot.animKey}
              stopX={slot.stopX}
              color={slot.box.color}
              label={slot.box.label}
              isSelected={selected === idx}
              onClick={() => handleBoxClick(idx)}
              animKey={slot.animKey}
            />
          )
      )}

      {/* Frame below (shows when a box is selected) */}
      {selectedSlot && selectedSlot.box && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            top: 100 + 20,
            left: frameLeft,
            width: 400,
            height: 300,
            border: '2.5px solid #222',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 12px 64px #0003',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0',
            userSelect: 'none',
          }}
          onDoubleClick={handleFrameDoubleClick}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#181818',
              padding: '26px 0 12px 0',
              width: '100%',
              textAlign: 'center',
              borderBottom: '1px solid #e6e6e6',
              letterSpacing: 0.5,
            }}
          >
            {selectedSlot.box.label}
          </div>
          <div
            style={{
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontSize: 16,
              fontStyle: 'italic',
            }}
          >
            Double-click to clear this slot.
          </div>
        </motion.div>
      )}

      {/* Catcher with status circle */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: 200,
          width: 75,
          height: 75,
          background: '#fff',
          border: '6px solid #333',
          borderRadius: 6,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status Circle */}
        <div
          role="button"
          tabIndex={0}
          aria-label={paused ? "Start Animation" : "Pause Animation"}
          onClick={onTogglePause}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onTogglePause && onTogglePause();
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            background: paused ? "#ff2222" : "#21d353",
            border: '5px solid #232323',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'background 0.25s, box-shadow 0.18s',
            zIndex: 11,
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
    </div>
  );
}
