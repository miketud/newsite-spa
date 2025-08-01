'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

type ModularSectionProps = {
  show: boolean;
};

const GAP = 10;
const TL_INIT = { width: 300, height: 100 };
const TR_INIT = { width: 100, height: 100 };
const BL_INIT = { width: 300, height: 300 };
const BR_INIT = { width: 100, height: 300 };

export default function Modular({ show }: ModularSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showRects, setShowRects] = useState([false, false, false, false]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    if (show) {
      setShowRects([false, false, false, false]);
      for (let i = 0; i < 4; i++) {
        timers.push(
          setTimeout(() => {
            setShowRects(prev => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, i * 120)
        );
      }
      timers.push(
        setTimeout(() => setExpanded(true), 4 * 120 + 1000)
      );
    } else {
      setShowRects([false, false, false, false]);
      setExpanded(false);
    }
    return () => timers.forEach(clearTimeout);
  }, [show]);

  const TL_EXP = { width: TL_INIT.width * 1.8, height: TL_INIT.height };
  const TR_EXP = { width: TR_INIT.width * 3.5, height: TR_INIT.height };
  const BL_EXP = { width: BL_INIT.width * 1.8, height: BL_INIT.height };
  const BR_EXP = { width: BR_INIT.width * 3.5, height: BR_INIT.height };

  const STAGGER = 0.13;
  const delays = [0, 1, 2, 3].map(i => i * STAGGER);

return (
  <AnimatePresence>
    {show && (
      <motion.div
        key="modular-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          minHeight: 800,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          pointerEvents: show ? "auto" : "none",
          position: "relative",
          marginBottom: 16,
        }}
      >
        {/* Title above the animation */}
      <div
        style={{
            fontWeight: 700,
            fontSize: 38,
            marginTop: 0,
            marginBottom: 50,
            color: "#333",
            textAlign: "center",
            maxWidth: 1050,
        }}
      >
        REIMAGINE THE PHARMACY AND PATIENT EXPERIENCE
      </div>

        {/* MODULAR RECTANGLES GRID */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            minHeight: BL_INIT.height + 160,
          }}
        >
                      <div
              style={{
                width: TL_INIT.width + TR_INIT.width + GAP,
                height: TL_INIT.height + BL_INIT.height + GAP,
                position: "relative",
              }}
            >
              {/* Top-Left */}
              <AnimatePresence>
                {showRects[0] && (
                  <motion.div
                    key="tl"
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      width: expanded ? TL_EXP.width : TL_INIT.width,
                      height: TL_INIT.height,
                      transition: {
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.38, ease: "easeOut" },
                        y: { duration: 0.38, ease: "easeOut" },
                        width: { duration: 0.7, delay: expanded ? delays[0] : 0, ease: "easeInOut" },
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.97, y: 24, transition: { duration: 0.16 } }}
                    style={{
                      top: 0,
                      right: TR_INIT.width + GAP,
                      position: "absolute",
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "3px solid #333",
                      boxShadow: "0 2px 8px #0001",
                      zIndex: 1,
                    }}
                  />
                )}
              </AnimatePresence>
              {/* Top-Right */}
              <AnimatePresence>
                {showRects[1] && (
                  <motion.div
                    key="tr"
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      width: expanded ? TR_EXP.width : TR_INIT.width,
                      height: TR_INIT.height,
                      transition: {
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.38, ease: "easeOut" },
                        y: { duration: 0.38, ease: "easeOut" },
                        width: { duration: 0.7, delay: expanded ? delays[1] : 0, ease: "easeInOut" },
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.97, y: 24, transition: { duration: 0.16 } }}
                    style={{
                      top: 0,
                      left: TL_INIT.width + GAP,
                      position: "absolute",
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "3px solid #333",
                      boxShadow: "0 2px 8px #0001",
                      zIndex: 1,
                    }}
                  />
                )}
              </AnimatePresence>
              {/* Bottom-Left */}
              <AnimatePresence>
                {showRects[2] && (
                  <motion.div
                    key="bl"
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      width: expanded ? BL_EXP.width : BL_INIT.width,
                      height: BL_INIT.height,
                      transition: {
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.38, ease: "easeOut" },
                        y: { duration: 0.38, ease: "easeOut" },
                        width: { duration: 0.7, delay: expanded ? delays[2] : 0, ease: "easeInOut" },
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.97, y: 24, transition: { duration: 0.16 } }}
                    style={{
                      top: TL_INIT.height + GAP,
                      right: BR_INIT.width + GAP,
                      position: "absolute",
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "3px solid #333",
                      boxShadow: "0 2px 8px #0001",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Centered Label */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                        textAlign: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 36,
                          fontWeight: 700,
                          color: "#555",
                          userSelect: "none",
                          lineHeight: 1.08,
                          textShadow: "0 2px 16px #fff9",
                        }}
                      >
                        MODULAR
                        <br />
                        COMPONENTS
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Bottom-Right */}
              <AnimatePresence>
                {showRects[3] && (
                  <motion.div
                    key="br"
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      width: expanded ? BR_EXP.width : BR_INIT.width,
                      height: BR_INIT.height,
                      transition: {
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.38, ease: "easeOut" },
                        y: { duration: 0.38, ease: "easeOut" },
                        width: { duration: 0.7, delay: expanded ? delays[3] : 0, ease: "easeInOut" },
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.97, y: 24, transition: { duration: 0.16 } }}
                    style={{
                      top: TL_INIT.height + GAP,
                      left: BL_INIT.width + GAP,
                      position: "absolute",
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "3px solid #333",
                      boxShadow: "0 2px 8px #0001",
                      zIndex: 1,
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subsection below the animation */}
          <div
            style={{
              fontWeight: 400,
              fontSize: 20,
              marginBottom: 0,
              color: "#555",
              textAlign: "center",
              maxWidth: 1000,
              lineHeight: 1.5,
            }}
          >
            Modular components offer a seamless, intuitive experience across every FRAMEWORx enabled environment, <br />
            so you can focus on providing high quality healthcare with speed, consistency, and effortless productivity.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
