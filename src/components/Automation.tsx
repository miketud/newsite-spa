'use client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

// ===== Styles =====
const frameStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '4px solid #333',
  borderRadius: 12,
  boxShadow: '0 2px 8px #0001',
};

const bezel: React.CSSProperties = {
  borderRadius: 12,
  border: '4px solid #333',
  background: '#0c0c0c',
  boxShadow: 'inset 0 0 0 2px #111',
};

// ===== Colors =====
const PALETTE = ['#39d353', '#2683FF', '#ff0033', '#9c27b0', '#ffbe2f', '#ff8800'];
const pickColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

// ===== Types =====
type Square = { id: number; color: string };
type TerminalVariant = 'xml' | 'json' | 'python' | 'javascript' | 'mixed';

// ===== Helpers for organic code lines =====
const choice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

type Tok = { t: string; c: string };

function buildOrganicLine(variant: TerminalVariant, C: Record<string, string>, cols: number): Tok[] {
  // palettes by role
  const KW = C.kw, STR = C.str, KEY = C.key, NUM = C.num, COM = C.com, TAG = C.tag;

  const jsId = ['patientId', 'payload', 'token', 'status', 'items', 'rx', 'dose', 'route', 'user', 'orderId'];
  const http = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const paths = [
    '/api/v1/patients',
    '/api/v1/patients/:id',
    '/api/v1/orders',
    '/api/v1/orders/:id',
    '/api/v1/rx',
    '/webhook/ncpdp',
  ];

  // a few templates; we’ll pick one each time
  const templates: Tok[][] = [
    // JS var
    [{ t: 'const', c: KW }, { t: ` ${choice(jsId)}`, c: KEY }, { t: ' = ', c: KEY }, { t: `"${randInt(1000, 9999)}";`, c: STR }],
    // JS function
    [{ t: 'function', c: KW }, { t: ` ${choice(['transform', 'normalize', 'parse', 'map'])}`, c: KEY }, { t: '(m){', c: KEY }, { t: ' return m?.trim?.(); }', c: KEY }],
    // JS if
    [{ t: 'if', c: KW }, { t: ' (status === ', c: KEY }, { t: '"OK"', c: STR }, { t: ') {', c: KEY }, { t: ' queue.push(payload); }', c: KEY }],
    // fetch line
    [{ t: 'fetch', c: KEY }, { t: `("${choice(paths)}"`, c: STR }, { t: ', { method: ', c: KEY }, { t: `"${choice(http)}"`, c: STR }, { t: ' })', c: KEY }],
    // JSON-ish data
    [{ t: '{ "type": ', c: KEY }, { t: '"order"', c: STR }, { t: ', "valid": ', c: KEY }, { t: 'true', c: KW }, { t: ', "dose": ', c: KEY }, { t: String(randInt(1, 10)), c: NUM }, { t: ' }', c: KEY }],
    // Python def
    [{ t: 'def', c: KW }, { t: ` ${choice(['parse', 'validate', 'convert'])}`, c: KEY }, { t: '(msg):', c: KEY }],
    // Python return
    [{ t: 'return', c: KW }, { t: ` {'patient':'A${randInt(10000,99999)}','route':'oral'}`, c: STR }],
    // XML-ish
    [{ t: '<message', c: TAG }, { t: ' type=', c: KW }, { t: '"order"', c: STR }, { t: ' />', c: TAG }],
    // comment / log
    [{ t: '//', c: COM }, { t: ` ${choice(['TODO', 'NOTE'])}:`, c: COM }, { t: ' map NCPDP -> FHIR', c: COM }],
    // endpoint line
    [{ t: choice(http), c: KW }, { t: ` ${choice(paths)}`, c: STR }, { t: ' 200', c: NUM }, { t: ' OK', c: KEY }],
  ];

  // Narrow pool if specific variant chosen
const byVariant: Record<Exclude<TerminalVariant, 'mixed'>, Tok[][]> = {
  javascript: templates.slice(0, 5),      // Tok[][]
  json: Array.of(templates[4]),           // ✅ mutable Tok[][]
  python: templates.slice(5, 7),          // Tok[][]
  xml: Array.of(templates[7]),            // ✅ mutable Tok[][]
};

  const base = variant === 'mixed' ? templates : byVariant[variant] ?? templates;
  let toks = choice(base);

  // Clip to cols, preserving token colors
  let remaining = cols;
  const clipped: Tok[] = [];
  toks.forEach((tok, idx) => {
    const seg = (idx === 0 ? tok.t : ' ' + tok.t);
    if (remaining <= 0) return;
    const take = Math.min(seg.length, remaining);
    clipped.push({ t: seg.slice(0, take), c: tok.c });
    remaining -= take;
  });
  return clipped;
}

// ===== Terminal (single list, last is active; no duplicates) =====
function Terminal({
  enabled,
  variant = 'mixed',
  rows,
  cols = 36,
  fontSize = 8,
  lineHeight = 12,
  padding = '4px 6px',
  typingSpeed = 45,
}: {
  enabled: boolean;
  variant?: TerminalVariant;
  rows: number;
  cols?: number;
  fontSize?: number;
  lineHeight?: number;
  padding?: string;
  typingSpeed?: number;
}) {
  const C = {
    prompt: '#8aa1ff',
    tag: '#ffbe2f',
    attr: '#39d353',
    str: '#ff8800',
    key: '#9c27b0',
    num: '#2683FF',
    kw: '#39d353',
    com: '#7a7a7a',
  };

  const makeLine = () => buildOrganicLine(variant, C, cols);
  const total = (tokens: Tok[]) => tokens.map(t => t.t).join('').length;

  // Single list; last item is active
  const [lines, setLines] = useState<{ tokens: Tok[]; chars: number }[]>([
    { tokens: makeLine(), chars: 0 },
  ]);
  const tickRef = useRef<number | null>(null);
  const pauseAfterLine = useRef(false);

  useEffect(() => {
    // When variant/size changes, reset with a single fresh line
    setLines([{ tokens: makeLine(), chars: 0 }]);
  }, [variant, cols]);

  useEffect(() => {
    if (enabled) {
      pauseAfterLine.current = false;
      start();
    } else {
      // finish current active line, then stop
      pauseAfterLine.current = true;
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, variant, rows, cols, typingSpeed]);

  const start = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => {
      setLines(prev => {
        const out = [...prev];
        const last = out[out.length - 1];
        const max = total(last.tokens);
        if (last.chars < max) {
          last.chars += 1;
          return out;
        }
        // Line finished → if pausing, stop here (no new line)
        if (pauseAfterLine.current) {
          if (tickRef.current) clearInterval(tickRef.current);
          tickRef.current = null;
          return out;
        }
        // Append new active line; cap total to `rows`
        out.push({ tokens: makeLine(), chars: 0 });
        if (out.length > rows) out.shift(); // drop oldest
        return out;
      });
    }, typingSpeed);
  };

  const renderUpTo = (tokens: Tok[], upto: number, caret: boolean) => {
    let pos = 0;
    const parts: Tok[] = [];
    tokens.forEach(seg => {
      const take = Math.max(0, Math.min(upto - pos, seg.t.length));
      if (take > 0) parts.push({ t: seg.t.slice(0, take), c: seg.c });
      pos += seg.t.length;
    });
    return (
      <>
        <span style={{ color: C.prompt }}>$&gt;</span>
        {parts.map((p, i) => (
          <span key={i} style={{ color: p.c, whiteSpace: 'pre' }}>
            {p.t}
          </span>
        ))}
        {caret && <span style={{ color: '#fff' }}>|</span>}
      </>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize,
        lineHeight: `${lineHeight}px`,
        color: '#bfbfbf',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      {lines.map((ln, i) => {
        const isLast = i === lines.length - 1;
        return (
          <div key={i} style={{ whiteSpace: 'pre', opacity: isLast ? 0.95 : 0.9 }}>
            {renderUpTo(ln.tokens, isLast ? ln.chars : Number.MAX_SAFE_INTEGER, isLast && enabled)}
          </div>
        );
      })}
    </div>
  );
}

// ===== Main component: Terminal + Processor toggle + Conveyor =====
export default function Automation() {
  // Layout geometry
  const STRIP_H = 220;
  const GAP = 12;

  const SCREEN_W = 120;
  const SCREEN_H = 100;
  const BOTTOM_BAR_H = 8;

  const PAD_TOP = 4;
  const PAD_BOTTOM = 6;
  const LINE_HEIGHT = 12;

  // Rows that actually fit inside the clipped terminal area
  const CONTENT_H = SCREEN_H - BOTTOM_BAR_H;
  const ROWS = Math.floor((CONTENT_H - (PAD_TOP + PAD_BOTTOM)) / LINE_HEIGHT);

  const PROC_W = 100;
  const PROC_H = 100;

  const LANE_W = 170;
  const SQ = 24;

  // Conveyor positions: start behind processor → travel right off-lane
  const startX = -(PROC_W / 2) - SQ;
  const endX = LANE_W + SQ;

  // Timing
  const travelSec = 2.8;
  const spawnEveryMs = 600;

  const [enabled, setEnabled] = useState(true);

  // ===== Spawn-based conveyor =====
  const [squares, setSquares] = useState<Square[]>([]);
  const idRef = useRef(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enabled) {
      timerRef.current = setInterval(() => {
        setSquares(prev => [...prev, { id: idRef.current++, color: pickColor() }]);
      }, spawnEveryMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      // in-flight squares finish naturally
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [enabled, spawnEveryMs]);

  const handleSquareComplete = (id: number) => {
    setSquares(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div
      style={{
        width: 310,
        height: STRIP_H,
        display: 'flex',
        alignItems: 'center',
        gap: GAP,
      }}
    >
      {/* 1) Terminal “computer” (no power light) */}
      <div style={{ width: SCREEN_W }}>
        <div
          style={{
            ...bezel,
            width: '100%',
            height: SCREEN_H,
            position: 'relative',
            overflow: 'hidden', // clip inside the screen
          }}
        >
          <Terminal
            enabled={enabled}
            variant="mixed"      // 'mixed' for organic blend; or 'javascript'|'json'|'python'|'xml'
            rows={ROWS}
            cols={36}
            fontSize={8}
            lineHeight={LINE_HEIGHT}
            padding={`${PAD_TOP}px 6px ${PAD_BOTTOM}px 6px`}
            typingSpeed={45}
          />
          {/* Bottom black terminal bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: BOTTOM_BAR_H,
              background: '#000',
              borderTop: '2px solid #111',
            }}
          />
        </div>

        {/* Stand/foot */}
        <div
          style={{
            width: 60,
            height: 6,
            background: '#1a1a1a',
            margin: '6px auto 0',
            borderRadius: 3,
            border: '2px solid #333',
          }}
        />
      </div>

      {/* 2) Processor (clickable ON/OFF) */}
      <button
        onClick={() => setEnabled(v => !v)}
        aria-pressed={enabled}
        style={{
          all: 'unset',
          cursor: 'pointer',
          ...frameStyle,
          width: PROC_W,
          height: PROC_H,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // hides emergence until center
          zIndex: 2,          // sits above the lane
        }}
        title={enabled ? 'Turn OFF' : 'Turn ON'}
      >
        {/* Unlabeled ON/OFF indicator */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid #333',
            background: enabled ? '#2ecc71' : '#e74c3c',
            boxShadow: enabled ? '0 0 6px 2px rgba(53, 255, 134, 0.96)' : 'none',
          }}
        />
      </button>

      {/* 3) Conveyor — squares emerge from behind processor */}
      <div
        style={{
          position: 'relative',
          width: LANE_W,
          height: PROC_H,
          marginLeft: -(PROC_W / 2), // tuck lane under processor so emergence is hidden
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1, // under processor
        }}
      >
        {squares.map(sq => (
          <motion.div
            key={sq.id}
            initial={{ x: startX }}
            animate={{ x: endX }}
            transition={{ duration: travelSec, ease: 'linear' }}
            onAnimationComplete={() => handleSquareComplete(sq.id)}
            style={{
              position: 'absolute',
              top: '50%',
              marginTop: -(SQ / 2),
              left: 0,
              width: SQ,
              height: SQ,
              borderRadius: 6,
              border: '2px solid #333',
              boxShadow: '0 2px 6px #0001',
              background: sq.color,
            }}
          />
        ))}
      </div>
    </div>
  );
}
