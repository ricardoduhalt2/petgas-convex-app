import React, { useState } from "react";

/**
 * WhatsAppLeadDialog - Formulario único editable para WhatsApp leads.
 * Todos los estilos están en JS, sin clases globales.
 */

const WHATSAPP_NUMBER = "5212295484549";

const PETGAS_GREEN = "#00b140";
const PETGAS_BLUE = "#00eaff";
const PETGAS_BG = "#f5f7fa";
const PETGAS_DARK = "#222b2e";

const questions = [
  { key: "name", label: "¿Cuál es tu nombre?" },
  { key: "email", label: "¿Cuál es tu correo electrónico?" },
  { key: "interest", label: "¿Qué te interesa? (Adquirir planta, asesoría, entregar plásticos, etc.)" },
  { key: "message", label: "Describe brevemente tu consulta o mensaje para WhatsApp:" }
];

interface Answers {
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
  [key: string]: string | undefined;
}

const styles = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 32,
    borderRadius: 22,
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 4px 24px 0 rgba(0,177,64,0.10), 0 1.5px 8px 0 rgba(0,234,255,0.08)",
    border: `1.5px solid ${PETGAS_GREEN}`,
    textAlign: "center" as const,
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: PETGAS_DARK,
    position: "relative" as const,
    overflow: "hidden"
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: "50%",
    boxShadow: "0 2px 16px 0 rgba(0,177,64,0.10)"
  },
  title: {
    fontSize: 26,
    fontWeight: 900,
    marginBottom: 8,
    letterSpacing: "0.02em",
    background: `linear-gradient(90deg, ${PETGAS_GREEN} 0%, ${PETGAS_BLUE} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  faqBtn: {
    width: "100%",
    marginBottom: 18,
    padding: "12px 0",
    borderRadius: 14,
    background: PETGAS_BG,
    color: PETGAS_GREEN,
    fontWeight: 700,
    border: `1.5px solid ${PETGAS_GREEN}`,
    boxShadow: "0 2px 8px 0 rgba(0,177,64,0.08)",
    cursor: "pointer",
    fontSize: 16,
    transition: "background 0.2s, box-shadow 0.2s"
  },
  form: {
    marginTop: 12
  },
  label: {
    display: "block",
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 10,
    color: PETGAS_DARK,
    textAlign: "left" as const
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 22,
    border: `1.5px solid #e0eaff`,
    background: "#f8fcff",
    color: PETGAS_DARK,
    fontSize: 15,
    marginBottom: 10,
    outline: "none",
    boxShadow: "0 1px 4px 0 rgba(0,234,255,0.06)",
    transition: "border 0.2s"
  },
  glassBtn: {
    width: "auto",
    minWidth: 120,
    padding: "10px 18px",
    borderRadius: 22,
    background: PETGAS_GREEN,
    color: PETGAS_DARK,
    fontWeight: 900,
    fontSize: 15,
    border: `1.5px solid ${PETGAS_GREEN}`,
    boxShadow: "0 2px 8px 0 rgba(0,177,64,0.10)",
    cursor: "pointer",
    marginTop: 8,
    marginBottom: 4,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "background 0.2s, box-shadow 0.2s"
  },
  glassBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  },
  summary: {
    background: "rgba(0,234,255,0.08)",
    borderRadius: 14,
    padding: 16,
    margin: "18px 0",
    color: PETGAS_DARK,
    fontSize: 16,
    boxShadow: "0 2px 12px 0 rgba(0,234,255,0.06)"
  },
  summaryTitle: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
    color: PETGAS_GREEN
  }
};

export default function WhatsAppLeadDialog() {
  const [answers, setAnswers] = useState<Answers>({});
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFAQ = () => {
    window.open("https://petgas.com.do/petgasdo/chat.html", "_blank");
  };

  const handleChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (
      !answers["name"] ||
      !answers["email"] ||
      !answers["interest"] ||
      !answers["message"]
    ) {
      setErrorMsg("Por favor completa todos los campos antes de enviar.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("http://localhost:4000/api/import-whatsapp-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answers["name"],
          email: answers["email"],
          source: "whatsapp_web",
          category: "whatsapp",
          status: "new",
          metadata: {
            interest: answers["interest"],
            body: answers["message"],
            dialog: answers,
            date: new Date().toISOString()
          }
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Error al enviar los datos.");
        setSending(false);
        return;
      }
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(answers["message"] || "")}`;
      window.open(url, "_blank");
    } catch (err: any) {
      setErrorMsg("Error de red: " + err.message);
    }
    setSending(false);
  };

  return (
    <div style={styles.container}>
      {/* Logo de WhatsApp grande */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        style={{ ...styles.logo, background: "#25D366", padding: 8 }}
      />
      <div style={styles.title}>Chat de contacto WhatsApp</div>
      <button
        onClick={handleFAQ}
        style={styles.faqBtn}
        onMouseOver={e => (e.currentTarget.style.background = "rgba(0,234,255,0.18)")}
        onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
      >
        {/* Logo del bot pequeño */}
        <img
          src="https://petgas.com.do/wp-content/uploads/2025/03/image-removebg-preview.png"
          alt="Bot"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            marginRight: 8,
            verticalAlign: "middle",
            boxShadow: "0 1px 4px 0 rgba(0,177,64,0.10)"
          }}
        />
        FAQ y BASE DEL CONOCIMIENTO C.H.I.D.O.
      </button>
      <form style={styles.form} onSubmit={handleSend}>
        {questions.map(q => (
          <div key={q.key}>
            <label style={styles.label}>{q.label}</label>
            <input
              type="text"
              required
              value={answers[q.key] || ""}
              onChange={e => handleChange(q.key, e.target.value)}
              style={styles.input}
            />
          </div>
        ))}
        {errorMsg && (
          <div style={{ color: "#e00", marginBottom: 10, fontWeight: 700 }}>{errorMsg}</div>
        )}
        <button
          type="submit"
          disabled={sending}
          style={{
            ...styles.glassBtn,
            ...(sending ? styles.glassBtnDisabled : {})
          }}
          onMouseOver={e => (e.currentTarget.style.background = "rgba(0,234,255,0.18)")}
          onMouseOut={e => (e.currentTarget.style.background = PETGAS_GREEN)}
        >
          {sending ? (
            "Enviando..."
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 2, verticalAlign: "middle" }}>
                <path d="M2 10L18 3L11 18L9 11L2 10Z" fill="#00eaff" stroke="#00b140" strokeWidth="1.2"/>
              </svg>
              Enviar y abrir WhatsApp
            </>
          )}
        </button>
      </form>
    </div>
  );
}
