'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HL7FhirImg from '../assets/HL7_FHIR.png';
import NcpdpImg from '../assets/ncpdp.png';
import { FaDatabase } from 'react-icons/fa';

const SQUARE = 15;
const GAP = 14;
const COLORS = [
  "#39d353",
  "#9c27b0",
  "#2683FF",
  "#ffbe2f",
  "#ff8800",
  "#ff0033",
];
const ANIMATION_TIME = 0.5;

function Transmission() {
  const [active, setActive] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (active < 2) {
        setActive(a => a + 1);
      } else {
        setActive(0);
        setColorIdx(c => (c + 1) % COLORS.length);
      }
    }, ANIMATION_TIME * 1000);
    return () => clearTimeout(timer);
  }, [active, colorIdx]);

  return (
    <div
      style={{
        width: SQUARE * 3 + GAP * 2,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: GAP,
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{
            background: i === active ? COLORS[colorIdx] : "#e4e4e4",
            opacity: i === active ? 1 : 0.44,
            scale: i === active ? 1.16 : 1,
            boxShadow: i === active ? "0 2px 12px #0003" : "none",
          }}
          transition={{
            duration: ANIMATION_TIME * 0.8,
            ease: "easeInOut",
          }}
          style={{
            width: SQUARE,
            height: SQUARE,
            borderRadius: 4,
            background: "#e4e4e4",
            boxShadow: "none",
          }}
        />
      ))}
    </div>
  );
}

export default function InteropSection() {
  return (
    <div
      style={{
        width: 1000,
        height: 350,
        minHeight: 120,
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        background: "transparent",
        gap: 50,
      }}
    >
      {/* Left column: Transmission animation + icons */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ marginTop: 6 }}>
          <Transmission />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
          <img src={HL7FhirImg.src} alt="HL7 FHIR" style={{ height: 40 }} />
          <img src={NcpdpImg.src} alt="NCPDP" style={{ height: 34 }} />
<FaDatabase style={{ fontSize: 36, color: '#555' }} />
        </div>
      </div>

      {/* Right column: Text */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 40,
        }}
      >
        <div
          style={{
            color: "#333",
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 740,
          }}
        >
          INTEROPERABILITY <br /> Through a robust tech stack, enriched databases, HL7 FHIR standards, and API endpoints.
        </div>
        <div
          style={{
            color: "#333",
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 740,
            fontWeight: 400,
          }}
        >
          SCALABILITY <br /> Thoughtfully designed by healthcare providers from the beginning.
        </div>
                <div
          style={{
            color: "#333",
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 740,
            fontWeight: 400,
          }}
        >
          SECURITY <br />
          Advanced encryption and authentication measures, protecting your health information at every step. 
        </div>
      </div>
    </div>
  );
}
