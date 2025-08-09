'use client';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { useEffect, useState } from 'react';
import NcpdpImg from '@/assets/ncpdp.png';
import Hl7FhirImg from '@/assets/HL7_FHIR.png';
import { AiOutlineDatabase } from 'react-icons/ai';
import Automation from './Automation';

type ModularSectionProps = {
  show: boolean;
};

const easeOut = cubicBezier(0.42, 0, 0.58, 1);

export default function Modular({ show }: ModularSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const rectStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    border: '4px solid #333',
    borderRadius: 8,
    boxShadow: '0 2px 8px #0001',
  };

  const fadeInFromTop = (delay: number) => ({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay,
    },
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="modular"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 60,
            padding: '0 16px',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontWeight: 700,
              fontSize: 34,
              marginBottom: 50,
              color: '#333',
              textAlign: 'center',
              maxWidth: 1050,
            }}
          >
            DESIGNED TO SIMPLIFY THE PHARMACY EXPERIENCE
          </div>

          {/* 2x3 Grid:
              "c1r1 c2r1"
              "c1r2 c2r2"
              "c1r3 c2r3"
          */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px minmax(300px, 560px)',
              gridTemplateRows: 'auto auto auto',
              gridTemplateAreas: `
                "c1r1 c2r1"
                "c1r2 c2r2"
                "c1r3 c2r3"
              `,
              columnGap: 64,
              rowGap: 20,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {/* Column 1, Row 1: Cluster of frames */}
            <div style={{ gridArea: 'c1r1', position: 'relative', width: 310, height: 0 }}>
              {/* Main frame */}
              <motion.div {...fadeInFromTop(0)} style={{ position: 'absolute', top: 0, left: 0 }}>
                <div style={{ width: 200, height: 100, ...rectStyle }} />
              </motion.div>

              {/* Right-attached smaller frame */}
              <motion.div {...fadeInFromTop(0.3)} style={{ position: 'absolute', top: 0, left: 205 }}>
                <div style={{ width: 90, height: 55, ...rectStyle }} />
              </motion.div>

              {/* Bottom-attached smaller frame */}
              <motion.div {...fadeInFromTop(0.6)} style={{ position: 'absolute', top: 60, left: 205 }}>
                <div style={{ width: 140, height: 40, ...rectStyle }} />
              </motion.div>

              {/* Tiny tag frame */}
              <motion.div {...fadeInFromTop(0.9)} style={{ position: 'absolute', top: 0, left: 300 }}>
                <div style={{ width: 45, height: 55, ...rectStyle }} />
              </motion.div>
            </div>
{/* Column 1, Row 2: Automation animation */}
<div style={{ gridArea: 'c1r2' }}>
  <Automation />
</div>


            {/* Column 1, Row 3: ICONS to the left of Interoperability */}
            <div
              style={{
                gridArea: 'c1r3',
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                width: 310,
              }}
            >
              {/* ncpdp.png */}
              <motion.img
                {...fadeInFromTop(0.2)}
                src={NcpdpImg.src}
                alt="NCPDP"
                style={{ height: 40, display: 'block' }}
              />

              {/* Database icon */}
              <motion.div {...fadeInFromTop(0.35)} style={{ lineHeight: 0 }}>
                <AiOutlineDatabase size={38} />
              </motion.div>

              {/* HL7_FHIR.png */}
              <motion.img
                {...fadeInFromTop(0.5)}
                src={Hl7FhirImg.src}
                alt="HL7 FHIR"
                style={{ gap: 6, height: 40, display: 'block' }}
              />
            </div>

            {/* Column 2, Row 1: Modular Components */}
            <section style={{ gridArea: 'c2r1' }}>
              <div
                style={{
                  fontSize: 30,
                  color: '#555',
                  lineHeight: 1.6,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  marginBottom: 8,
                }}
              >
                MODULAR COMPONENTS
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: '#555',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                The building blocks of FRAMEWORx.
              </div>
            </section>

            {/* Column 2, Row 2: Automation */}
            <section style={{ gridArea: 'c2r2' }}>
              <div
                style={{
                  fontSize: 30,
                  color: '#555',
                  lineHeight: 1.6,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  marginBottom: 8,
                  marginTop: 30,
                }}
              >
                AUTOMATION
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: '#555',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                An intelligent machine on the backend to convert digital messages. Focus on healthcare by automating the boring stuff.
              </div>
            </section>

            {/* Column 2, Row 3: Interoperability */}
            <section style={{ gridArea: 'c2r3' }}>
              <div
                style={{
                  fontSize: 30,
                  color: '#555',
                  lineHeight: 1.6,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  marginBottom: 8,
                }}
              >
                INTEROPERABILITY
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: '#555',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Secure, private, and built with HL7 FHIR standards for extensibility.
              </div>
            </section>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 36,
              maxWidth: 1000,
              fontSize: 24,
              color: '#555',
              lineHeight: 1.6,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            FRAMEWORx transforms the pharmacy experience.
            <br />
            Each component integrates into a unified system to drive efficiency at scale.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
