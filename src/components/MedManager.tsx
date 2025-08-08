import React, { useEffect, useState } from "react";

const OUTER_W = 800;
const OUTER_H = 50;
const EXPANDED_H = OUTER_H * 2; // triple height on expand

const OUTER_BG = "#fff";
const OUTLINE = "#333";

const drugs = [
  { name: "Lisinopril", strength: "10 mg", quantity: 30 },
  { name: "Atorvastatin", strength: "40 mg", quantity: 60 },
  { name: "Metformin", strength: "500 mg", quantity: 90 },
  { name: "Amoxicillin", strength: "875 mg", quantity: 20 },
  { name: "Omeprazole", strength: "20 mg", quantity: 15 },
  { name: "Sertraline", strength: "50 mg", quantity: 45 },
  { name: "Levothyroxine", strength: "75 mcg", quantity: 30 },
  { name: "Amlodipine", strength: "5 mg", quantity: 30 },
  { name: "Simvastatin", strength: "20 mg", quantity: 60 },
  { name: "Gabapentin", strength: "300 mg", quantity: 30 },
];

function getRandomRxNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function getRandomDrug() {
  return drugs[Math.floor(Math.random() * drugs.length)];
}
function getRandomLastFillDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const fillDate = new Date(today);
  fillDate.setDate(today.getDate() - daysAgo);
  return fillDate.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function MedManager() {
  const [rxNumber, setRxNumber] = useState<string | null>(null);
  const [drug, setDrug] = useState<{ name: string; strength: string; quantity: number } | null>(null);
  const [lastFill, setLastFill] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setRxNumber(getRandomRxNumber());
    setDrug(getRandomDrug());
    setLastFill(getRandomLastFillDate());
  }, []);

  if (!rxNumber || !drug || !lastFill) {
    return <div style={{ width: OUTER_W, height: OUTER_H }} />;
  }

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div
      style={{
        width: OUTER_W,
        cursor: "pointer",
        userSelect: "none",
        marginTop: 0,
        marginLeft: 0,
      }}
      tabIndex={0}
      onClick={toggleExpanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded();
        }
      }}
      role="button"
      aria-expanded={expanded}
      aria-label="Toggle prescription detail view"
    >
      {/* Title above the frames */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "#333",
          marginBottom: 12,
          textAlign: "center",
          userSelect: "none",
          maxWidth: OUTER_W,
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}
      >
        A SIMPLE MED MANAGER WITH POWERFUL FEATURES
      </div>
            <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          color: "#333",
          marginBottom: 12,
          textAlign: "center",
          userSelect: "none",
          maxWidth: OUTER_W,
          lineHeight: 1.4,
        }}
      >
        Take control of your health.
      </div>

      <div
        style={{
          width: "100%",
          height: expanded ? EXPANDED_H : OUTER_H,
          border: `2px solid ${OUTLINE}`,
          borderRadius: 6,
          background: OUTER_BG,
          boxShadow: "0 2px 9px 0 #e9ecf690",
          display: "flex",
          flexDirection: "column",
          fontFamily: "inherit",
          fontSize: 18,
          boxSizing: "border-box",
          transition: "height 0.4s ease",
          overflow: "hidden",
          transformOrigin: "top center",
          position: "relative",
          padding: 0,
        }}
      >
        {/* Top info row (fixed height, vertically centered) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: OUTER_H,
            flexShrink: 0,
            paddingLeft: 8,
            paddingRight: 8,
            boxSizing: "border-box",
          }}
        >
          {/* RX Number (left) */}
          <div
            style={{
              width: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "1px",
              userSelect: "all",
              background: "transparent",
              cursor: "pointer",
              lineHeight: "normal",
              paddingTop: 0,
              paddingBottom: 0,
              margin: 0,
            }}
          >
            <span
              style={{
                color: "#777",
                fontWeight: 600,
                fontSize: 17,
                marginRight: 6,
                lineHeight: "normal",
              }}
            >
              RX #
            </span>
            {rxNumber}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 30,
              width: 2,
              background: "#245bb5ff",
              margin: "0 13px 0 8px",
              alignSelf: "center",
              borderRadius: 2,
              opacity: 1,
              flexShrink: 0,
            }}
          />

          {/* Drug Name + Strength + Quantity (center) */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 24,
              color: "#232c3b",
              fontWeight: 600,
              fontSize: 18,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              justifyContent: "center",
              lineHeight: "normal",
              margin: 0,
              padding: 0,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                letterSpacing: 0.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 220,
                lineHeight: "normal",
                textTransform: "uppercase",
              }}
            >
              {drug.name}
            </span>
            <span
              style={{
                color: "#ca1818ff",
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.2,
                marginLeft: 7,
                whiteSpace: "nowrap",
                lineHeight: "normal",
              }}
            >
              {drug.strength}
            </span>
            <span
              style={{
                color: "#094720ff",
                fontWeight: 400,
                fontSize: 18,
                letterSpacing: 0.2,
                marginLeft: 7,
                whiteSpace: "nowrap",
                lineHeight: "normal",
              }}
            >
              Qty: {drug.quantity}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 30,
              width: 2,
              background: "#245bb5ff",
              margin: "0 13px 0 8px",
              alignSelf: "center",
              borderRadius: 2,
              opacity: 1,
              flexShrink: 0,
            }}
          />

          {/* Last Fill */}
          <div
            style={{
              width: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "1px",
              userSelect: "all",
              background: "transparent",
              flexShrink: 0,
              cursor: "pointer",
              lineHeight: "normal",
              paddingTop: 0,
              paddingBottom: 0,
              margin: 0,
            }}
          >
            <span
              style={{
                color: "#777",
                fontWeight: 600,
                fontSize: 17,
                marginRight: 6,
                lineHeight: "normal",
              }}
            >
              Last:
            </span>
            {lastFill}
          </div>
        </div>

        {/* Divider line to separate expanded section */}
        {expanded && (
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#d1d7e0",
              marginTop: 8,
              marginBottom: 6,
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
        )}

        {/* Expanded text below divider */}
        {expanded && (
          <div
            style={{
              flex: 1,
              width: "100%",
              textAlign: "center",
              color: "#555",
              fontWeight: 400,
              fontSize: 15,
              padding: "0 12px",
              userSelect: "none",
            }}
          >
            Detailed Overview, Your Prescription in Focus
          </div>
        )}
      </div>
    </div>
  );
}

export default MedManager;
