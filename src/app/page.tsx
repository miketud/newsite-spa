'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { TypingBanner } from '@/components/TypingBanner';
import Workflow from '@/components/Workflow';
import Modular from '@/components/Modular';
import { useInView } from '@/components/useInView';
import PatientSection from "@/components/Patient";
import MedManager from '@/components/MedManager';
import MedManagerActions, { ALL_ACTIONS } from '@/components/MedManagerActions';
import { Experience } from '@/components/Experience';

const navLinkStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#181818",
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  fontWeight: 500,
  whiteSpace: "nowrap",
  transition: "color 0.2s",
  cursor: "pointer",
};

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function Divider() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1100,
        height: 0,
        borderTop: '1px solid #00000014',
        margin: '0 auto',
        borderRadius: 2,
        boxShadow: '0 4px 16px -6px #2222',
        background: 'none',
      }}
    />
  );
}

export default function Page() {
  useEffect(() => {
    if (window.location.hash !== "#home") {
      window.location.hash = "#home";
    }
    setTimeout(() => {
      const home = document.getElementById('home');
      if (home) {
        home.scrollIntoView({ behavior: 'auto' });
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
  }, []);

  const [loaded, setLoaded] = useState(false);
  const [squareHover, setSquareHover] = useState(false);

  // Intersection observers for Modular and Workflow sections
  const [modRef, modInView] = useInView(0.6);
  const [workflowRef, workflowInView] = useInView(0.6);

  // Workflow state: paused except when workflow section is in view AND delay has elapsed
  const [beltPaused, setBeltPaused] = useState(true);
  const delayTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (workflowInView) {
      setBeltPaused(true);
      if (delayTimeout.current) clearTimeout(delayTimeout.current);
      delayTimeout.current = setTimeout(() => {
        setBeltPaused(false);
      }, 500);
    } else {
      setBeltPaused(true);
      if (delayTimeout.current) clearTimeout(delayTimeout.current);
    }
    return () => {
      if (delayTimeout.current) clearTimeout(delayTimeout.current);
    };
  }, [workflowInView]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSquareClick = () => {
    window.location.hash = "#home";
    const home = document.getElementById('home');
    if (home) {
      home.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const handleBeltPauseToggle = () => setBeltPaused((prev) => !prev);

  return (
    <main style={{ minHeight: '200vh', background: '#fff', position: 'relative' }}>
      {/* Invisible anchor at absolute top for all jumps */}
      <a id="home" tabIndex={-1} style={{ display: 'block', position: 'absolute', top: 0, left: 0, width: 1, height: 1, pointerEvents: 'none' }} />

      {/* HEADER - always on top, fixed */}
      <header
        style={{
          minHeight: 220,
          width: '100%',
          position: 'relative',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            position: 'fixed',
            top: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.41)',
            borderRadius: 28,
            boxShadow: '0 16px 60px 0 #16332438, 0 2px 8px #0002',
            border: '1.5px solid #30364d33',
            backdropFilter: 'blur(8px)',
            padding: '36px 60px 26px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 1200,
            zIndex: 1000,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 48,
              marginBottom: 20,
            }}
          >
            <button
              type="button"
              aria-label="Scroll to top"
              onClick={handleSquareClick}
              onMouseEnter={() => setSquareHover(true)}
              onMouseLeave={() => setSquareHover(false)}
              style={{
                width: 100,
                height: 100,
                border: '6px solid #000',
                borderRadius: 8,
                background: squareHover ? '#232323' : '#fff',
                transition: 'background 0.5s cubic-bezier(.4,0,.2,1), box-shadow 0.18s',
                cursor: 'pointer',
                flexShrink: 0,
                outline: squareHover ? '1px solid #ffffffff' : 'none',
              }}
            />
            <h1
              style={{
                fontSize: 80,
                fontWeight: 700,
                margin: 0,
                letterSpacing: '-1.5px',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              FRAMEWORx
            </h1>
          </div>
          <nav
            style={{
              display: 'flex',
              gap: 70,
              justifyContent: 'center',
            }}
          >
            <a href="#reimagine" style={navLinkStyle}>DESIGN</a>
            <a href="#pharmacy" style={navLinkStyle}>PHARMACY</a>
            <a href="#patient" style={navLinkStyle}>PATIENT</a>
            <a href="#experience" style={navLinkStyle}>EXPERIENCE</a>
          </nav>
        </div>
      </header>

      {/* Spacer below header */}
      <div style={{ height: 110 }} />

      {/* BANNER SECTION */}
      <section
        id="banner"
        style={{
          scrollMarginTop: 220,
          paddingTop: 80,
          paddingBottom: 80,
          minHeight: 360,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1020,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 180,
            boxSizing: 'border-box',
          }}
        >
          <TypingBanner />
        </div>
      </section>

      <Divider />

      {/* MODULAR PAGE */}
      <section
        id="reimagine"
        ref={modRef}
        style={{
          scrollMarginTop: 220,
          paddingTop: 80,
          paddingBottom: 80,
          minHeight: 800,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#00000010',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', minHeight: 800 }}>
          <AnimatePresence mode="wait">
            {modInView && (
              <motion.div
                key="modular"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                }}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
                exit={{ opacity: 0, y: 80, transition: { duration: 0.4 } }}
              >
                <Modular show={modInView} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Divider />

      {/* WORKFLOW/PHARMACY PAGE */}
      <section
        id="pharmacy"
        ref={workflowRef}
        style={{
          scrollMarginTop: 220,
          paddingTop: 80,
          paddingBottom: 80,
          minHeight: 900,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#00000020',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.49)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 900,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 42,
            position: 'relative',
          }}
        >
          <AnimatePresence>
            <motion.div
              style={{
                width: '100%',
                maxWidth: 900,
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 80,
                position: 'relative',
              }}
              initial={{ opacity: 0, y: 80 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
              }}
              exit={{ opacity: 0, y: 80, transition: { duration: 0.4 } }}
            >
              <Workflow
                paused={beltPaused}
                onTogglePause={handleBeltPauseToggle}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Divider />

      {/* PATIENT PAGE */}
      <section
        id="patient"
        style={{
          scrollMarginTop: 200,
          paddingTop: 80,
          paddingBottom: 80,
          minHeight: 800,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: '#00000010',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',

        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          <PatientSection />
          <MedManager />
          <MedManagerActions actions={ALL_ACTIONS} size={50} borderRadius={6} />
        </div>
      </section>


      <Divider />

      {/* EXPERIENCE PAGE (cleaned up) */}
      <section
        id="experience"
        style={{
          scrollMarginTop: 220,
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: 700,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // background: '#615252cd',

        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 38,
            marginTop: 0,            // adjust as needed
            marginBottom: 44,        // spacing between title & typing card
            color: "#333",
            textAlign: "center",
            maxWidth: 1050,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          A SYSTEM THAT CARES ABOUT YOUR HEALTH.
        </div>
        <Experience />
      </section>

    </main>
  );
}
