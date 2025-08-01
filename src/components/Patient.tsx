import React, { useState, useRef, useEffect } from "react";

const FRAME_W = 800;
const FRAME_H = 400;
const PADDING = 30;
const NAME_FRAME_H = 110;
const ADDRESS_H = 40;
const CONTACT_H = 40;
const NOTES_H = 100;

const patients = [
  {
    name: "BRUCE WAYNE",
    dob: "02/19/1972",
    id: "092157",
    address: "",
    contact: "",
    notes: "",
  },
];

const sharedTextStyle = {
  fontSize: 16,
  color: "#555",
  fontWeight: 500,
  fontFamily: "inherit",
  letterSpacing: "0.02em",
  padding: "9px 18px 7px 30px",
  width: "100%",
  boxSizing: "border-box" as const,
  background: "transparent",
  border: "none",
  outline: "none",
  resize: "none" as const,
  textAlign: "left" as const,
  lineHeight: 1.33,
};

function EditableBox({
  label,
  value,
  setValue,
  height,
  multiline = false,
  maxLength = 200,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  height: number;
  multiline?: boolean;
  maxLength?: number;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  function handleBlur() {
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      setEditing(false);
    }
    if (multiline && e.key === "Escape") {
      setEditing(false);
    }
  }

  // Label hides if there's value
  const showLabel = !value;

  return (
    <div
      style={{
        width: "100%",
        height,
        border: "1px solid #222",
        borderRadius: 4,
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#f9fbfd",
        position: "relative",
        boxSizing: "border-box",
        overflow: multiline ? "visible" : "hidden",
        cursor: "text",
      }}
      onClick={() => setEditing(true)}
      tabIndex={0}
    >
      {showLabel && !editing && (
        <div
          style={{
            color: "#555",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 0.08,
            position: "absolute",
            top: 7,
            left: 30,
            opacity: 0.98,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {label}
        </div>
      )}
      {editing ? (
        multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={e => setValue(e.target.value.slice(0, maxLength))}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            spellCheck={false}
            wrap="soft"
            style={{
              ...sharedTextStyle,
              height: height - 2,
              minHeight: height - 2,
              maxHeight: height * 3,
              marginTop: 0,
              marginBottom: 0,
              overflowY: "auto",
              overflowX: "hidden",      // Hide horizontal scroll
              whiteSpace: "pre-wrap",   // Keep user line breaks
              wordBreak: "break-word",  // Wrap long words
              resize: "none",
            }}
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={e => setValue(e.target.value.slice(0, maxLength))}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            spellCheck={false}
            style={{
              ...sharedTextStyle,
              height: height - 2,
              marginTop: 0,
              marginBottom: 0,
            }}
            type="text"
          />
        )
      ) : (
        <div
          style={{
            ...sharedTextStyle,
            height: height - 2,
            minHeight: height - 2,
            marginTop: 0,
            marginBottom: 0,
            display: "flex",
            alignItems: multiline ? "flex-start" : "center",
            background: "transparent",
            overflowY: multiline ? "auto" : "hidden",
            overflowX: "hidden",      // Hide horizontal scroll in display mode too
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

export function PatientSection() {
  const patient = patients[0];
  const [address, setAddress] = useState(patient.address);
  const [contact, setContact] = useState(patient.contact);
  const [notes, setNotes] = useState(patient.notes);

  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        marginTop: 0,
        marginBottom: 30,
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          marginBottom: 8,
          color: "#333",
        }}
      >
        COLLABORATIVE PRACTICE—WITH THE PATIENT!
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          color: "#555",
          marginBottom: 30,
          letterSpacing: 0.1,
          textShadow: "0 1px 1px #f6faff, 0 0.5px 1.5px #dbe0ee",
        }}
      >
        Enabling patients to manage their health confidently with streamlined, effective communication.
      </div>

      <div
        style={{
          width: FRAME_W,
          height: FRAME_H,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 10px 48px #12182d18",
          border: "2px solid #222",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          padding: PADDING,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Name Frame */}
        <div
          style={{
            width: "100%",
            height: NAME_FRAME_H,
            border: "4px solid #222",
            borderRadius: 8,
            background: "#f7fafd",
            boxShadow: "0 2px 9px 0 #17265790",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 0.05,
            marginBottom: 26,
            position: "relative",
            gap: 0,
            boxSizing: "border-box",
            minWidth: 0,
          }}
        >
          {/* Name */}
          <div
            style={{
              flex: "3 1 0",
              minWidth: 0,
              color: "#333",
              fontWeight: 800,
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "left",
              whiteSpace: "wrap",
            }}
            title={patient.name}
          >
            {patient.name}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 2,
              height: 50,
              background: "#245bb5ff",
              borderRadius: 4,
              margin: "0 16px",
              flexShrink: 0,
            }}
          />

          {/* DOB */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: "#555",
                fontWeight: 400,
                fontSize: 15,
                letterSpacing: 1,
                marginBottom: 0,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              DOB
            </span>
            <span
              style={{
                color: "#555",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: 1,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {patient.dob}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 2,
              height: 50,
              background: "#245bb5ff",
              borderRadius: 4,
              margin: "0 16px",
              flexShrink: 0,
            }}
          />

          {/* PT. ID */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: "#555",
                fontWeight: 400,
                fontSize: 15,
                letterSpacing: 1,
                marginBottom: 0,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              PT. ID
            </span>
            <span
              style={{
                color: "#555",
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: 2,
                userSelect: "all",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {patient.id}
            </span>
          </div>
        </div>

        {/* Address Field */}
        <EditableBox
          label="Address"
          value={address}
          setValue={setAddress}
          height={ADDRESS_H}
          maxLength={200}
        />

        {/* Contact Field */}
        <EditableBox
          label="Contact"
          value={contact}
          setValue={setContact}
          height={CONTACT_H}
          maxLength={200}
        />

        {/* Notes Field */}
        <EditableBox
          label="Notes"
          value={notes}
          setValue={setNotes}
          height={NOTES_H}
          maxLength={1000}
          multiline
        />
      </div>
    </div>
  );
}

export default PatientSection;
