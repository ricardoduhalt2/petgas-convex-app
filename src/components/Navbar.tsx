import React from "react";

export function Navbar() {
  return (
    <nav className="petgas-navbar petgas-animate-fadein" style={{
      background: "#fff",
      color: "#222b2e",
      borderRadius: "0 0 24px 24px",
      boxShadow: "0 8px 32px 0 rgba(0,177,64,0.13)",
      fontFamily: "'Montserrat', Arial, sans-serif",
      fontWeight: 700,
      fontSize: "1.2rem",
      display: "flex",
      alignItems: "center",
      gap: 32,
      padding: "18px 32px",
      marginBottom: 0
    }}>
      <img
        src="https://petgas.com.do/wp-content/uploads/2025/03/cropped-cropped-favi.png"
        alt="PETGAS Logo"
        style={{
          width: 54,
          height: 54,
          marginRight: 18,
          borderRadius: "50%",
          boxShadow: "0 2px 16px 0 rgba(0,177,64,0.12)",
          background: "#fff"
        }}
      />
      <span style={{
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: "0.01em",
        color: "#00b140",
        marginRight: 32
      }}>
        PETGAS Ecosystem Manager
      </span>
      <a className="petgas-btn" href="/" style={{ marginLeft: 12 }}>Dashboard</a>
      <a className="petgas-btn" href="/nuevo-lead">Nuevo Lead</a>
      <div style={{ flexGrow: 1 }} />
      <span style={{
        fontWeight: 700,
        fontSize: 16,
        color: "#009fe3",
        marginRight: 18,
        letterSpacing: "0.01em"
      }}>
        <span style={{ color: "#00b140" }}>petgas.com.mx</span>
      </span>
    </nav>
  );
}
