import React from "react";
import {
  FaSnowflake,
  FaArchive
} from "react-icons/fa";
import { BsCapsule } from "react-icons/bs";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { RiShareLine } from "react-icons/ri";
import { IconType } from "react-icons";
import { GrSave } from "react-icons/gr";

export type MedManagerAction = {
  icon: IconType;
  label: string;
  onClick: () => void;
};

export const ALL_ACTIONS: MedManagerAction[] = [
  { icon: FaSnowflake, label: "Freeze", onClick: () => alert("Freeze Prescription") },
  { icon: GrSave, label: "Save", onClick: () => alert("Download a Copy") },
  { icon: FaArchive, label: "Archive", onClick: () => alert("Archive Prescription") },
  { icon: BsCapsule, label: "Drug Info", onClick: () => alert("Drug Information") },
  { icon: HiArrowPathRoundedSquare, label: "Refill", onClick: () => alert("Refill Prescription") },
  { icon: RiShareLine, label: "Share", onClick: () => alert("Share") },
];

type MedManagerActionsProps = {
  actions: MedManagerAction[];
  size?: number;
  borderRadius?: number;
};

export default function MedManagerActions({
  actions,
  size = 50,
  borderRadius = 6,
}: MedManagerActionsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {actions.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            tabIndex={0}
            style={{
              width: size,
              height: size,
              border: "2px solid #222",
              borderRadius,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "none",
              outline: "none",
              padding: 0,
              transition: "background 0.15s, box-shadow 0.15s",
            }}
            title={label}
            aria-label={label}
          >
            <Icon size={26} color="#245bb5" />
          </button>
        ))}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          color: "#555",
          userSelect: "none",
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.3,
        }}
      >
        Quick action components to better manage your medications.
      </div>
    </div>
  );
}
