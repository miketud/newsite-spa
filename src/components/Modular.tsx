'use client';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { useEffect, useState } from 'react';

type ModularSectionProps = {
  show: boolean;
};

const easeOut = cubicBezier(0.42, 0, 0.58, 1); // Robust curve

export default function Modular({ show }: ModularSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const rectStyle = {
    backgroundColor: '#fff',
    border: '4px solid #333',
    borderRadius: 8,
    boxShadow: '0 2px 8px #0001',
  };

  const fadeInFromTop = (delay: number) => ({
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.7,
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

          {/* Grid + Right Text */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 64,
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Rectangles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Row 1 */}
              <motion.div {...fadeInFromTop(0)}>
                <div style={{ width: 310, height: 100, ...rectStyle }} />
              </motion.div>

              {/* Row 2 */}
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.div {...fadeInFromTop(0.4)}>
                  <div style={{ width: 200, height: 200, ...rectStyle }} />
                </motion.div>
                <motion.div {...fadeInFromTop(0.8)}>
                  <div style={{ width: 100, height: 200, ...rectStyle }} />
                </motion.div>
              </div>

              {/* Row 3 */}
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.div {...fadeInFromTop(1.2)}>
                  <div style={{ width: 100, height: 100, ...rectStyle }} />
                </motion.div>
                <motion.div {...fadeInFromTop(1.6)}>
                  <div style={{ width: 200, height: 100, ...rectStyle }} />
                </motion.div>
              </div>
            </div>

            {/* Right: Filler Text */}
            <div
              style={{
                maxWidth: 460,
                fontSize: 30,
                color: '#555',
                lineHeight: 1.6,
                flexGrow: 1,
                fontWeight: 700,
                fontStyle: 'italic',
              }}
            >
              <p>
                MODULAR COMPONENTS
              </p>
              <div
                style={{
                  maxWidth: 460,
                  fontSize: 24,
                  color: '#555',
                  lineHeight: 1.6,
                  flexGrow: 1,
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              >
                The building blocks of FRAMEWORx.<br />

              </div>
              <p>
                <br />
                AUTOMATION
              </p>
              <div
                style={{
                  maxWidth: 460,
                  fontSize: 24,
                  color: '#555',
                  lineHeight: 1.6,
                  flexGrow: 1,
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              >
                Focus on healthcare by automating the boring stuff.
              </div>
              <p>
                <br />
                INTEROPERABILITY
              </p>
              <div
                style={{
                  maxWidth: 460,
                  fontSize: 24,
                  color: '#555',
                  lineHeight: 1.6,
                  flexGrow: 1,
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              >
                Secure, private, and built with HL7 FHIR standards for extensibility.
              </div>
            </div>
            <div
              style={{
                maxWidth: 1000,
                fontSize: 24,
                color: '#555',
                lineHeight: 1.6,
                flexGrow: 1,
                fontWeight: 600,
                fontStyle: 'normal',
                textAlign: 'center',
              }}
            >
              FRAMEWORx transforms the pharmacy experience.
              <br />
              Its modular design enables each component to easily integrate into a unified system to drive efficiency at scale.
              <br/>
              Explore the site to learn more.

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
