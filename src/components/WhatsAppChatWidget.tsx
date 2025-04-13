import React, { useState } from "react";
import WhatsAppLeadDialog from "./WhatsAppLeadDialog";

const floatingBtnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 28,
  right: 28,
  zIndex: 9999,
  background: "#25D366",
  borderRadius: "50%",
  width: 64,
  height: 64,
  boxShadow: "0 4px 16px 0 rgba(0,0,0,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "none",
  outline: "none",
  transition: "box-shadow 0.2s"
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(30,41,59,0.25)",
  zIndex: 9998,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalContent: React.CSSProperties = {
  zIndex: 9999,
  animation: "popup-fadein 0.25s",
  maxWidth: 440,
  width: "95vw"
};

export default function WhatsAppChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        style={floatingBtnStyle}
        onClick={() => setOpen(true)}
        aria-label="Abrir chat de WhatsApp"
        title="Chatea con nosotros por WhatsApp"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{ width: 38, height: 38 }}
        />
      </button>
      {open && (
        <>
          <div style={modalOverlay} onClick={() => setOpen(false)} />
          <div style={modalContent}>
            <WhatsAppLeadDialog />
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "rgba(0,0,0,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: 22,
                color: "#222b2e",
                zIndex: 10000
              }}
              aria-label="Cerrar chat"
              title="Cerrar"
            >
              ×
            </button>
          </div>
          <style>
            {`
              @keyframes popup-fadein {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </>
      )}
    </>
  );
}
