import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export function SignInForm({ onSignIn }: { onSignIn?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (onSignIn) {
      onSignIn();
    }
  };

  return (
    <div
      className="petgas-panel petgas-animate-pop"
      style={{
        maxWidth: 420,
        margin: "64px auto",
        background: "#fff",
        boxShadow: "0 8px 32px 0 rgba(0,177,64,0.13)",
        borderRadius: 24,
        padding: 36,
        textAlign: "center"
      }}
    >
      <img
        src="https://petgas.com.do/wp-content/uploads/2025/03/cropped-cropped-favi.png"
        alt="PETGAS Logo"
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          marginBottom: 18,
          boxShadow: "0 2px 16px 0 rgba(0,177,64,0.12)",
          background: "#fff"
        }}
      />
      <h2 style={{
        fontWeight: 900,
        fontSize: 28,
        color: "#00b140",
        marginBottom: 8,
        letterSpacing: "0.01em"
      }}>
        Iniciar sesión en PETGAS
      </h2>
      <p style={{ color: "#222b2e", marginBottom: 24 }}>
        Accede a la plataforma inteligente de leads PETGAS
      </p>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1.5px solid #00b140",
            background: "#f5f7fa",
            color: "#222b2e",
            fontSize: 16,
            marginBottom: 18,
            outline: "none"
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1.5px solid #00b140",
            background: "#f5f7fa",
            color: "#222b2e",
            fontSize: 16,
            marginBottom: 18,
            outline: "none"
          }}
        />
        <button
          type="submit"
          className="petgas-btn"
          style={{
            width: "100%",
            padding: "14px 0",
            fontSize: 18,
            borderRadius: 16,
            marginTop: 4,
            marginBottom: 8
          }}
          disabled={loading}
        >
          {loading ? "Accediendo..." : "Iniciar sesión"}
        </button>
        {error && (
          <div style={{ color: "#e11d48", fontWeight: 700, marginTop: 10 }}>
            {error}
          </div>
        )}
      </form>
      <div style={{ marginTop: 18, color: "#009fe3", fontWeight: 700 }}>
        <span style={{ color: "#00b140" }}>petgas.com.mx</span>
      </div>
    </div>
  );
}
