import React, { useState } from "react";

/**
 * Componente de diálogo tipo chatbot para captar información antes de enviar a WhatsApp.
 * El usuario responde preguntas guiadas, el historial se guarda localmente y solo al finalizar se envía el lead a Convex y se abre WhatsApp.
 */

const WHATSAPP_NUMBER = "5212295484549";

const questions = [
  { key: "name", label: "¿Cuál es tu nombre?" },
  { key: "email", label: "¿Cuál es tu correo electrónico?" },
  { key: "interest", label: "¿Qué te interesa? (Adquirir planta, asesoría, entregar plásticos, etc.)" },
  { key: "message", label: "Describe brevemente tu consulta o mensaje para WhatsApp:" }
];

// Define an interface for the answers state
interface Answers {
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
  [key: string]: string | undefined; // Allow string indexing for dynamic keys from questions
}

export default function WhatsAppLeadDialog() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({}); // Initialize with the interface type
  const [sending, setSending] = useState(false);

  // FAQ/CHIDO redirección
  const handleFAQ = () => {
    window.open("https://petgas.com.do/petgasdo/chat.html", "_blank");
  };

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    setAnswers(prev => ({ ...prev, [questions[step].key]: input.value }));
    input.value = "";
    setStep(step + 1);
  };

  const handleSend = async () => {
    setSending(true);
    // Guardar el lead en Convex vía HTTP Action
    await fetch("/import-leads", {
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
    // Redirigir a WhatsApp Web con el mensaje prellenado
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(answers["message"] || "")}`;
    window.open(url, "_blank");
    setSending(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <img
        src="https://petgas.com.do/wp-content/uploads/2025/03/image-removebg-preview.png"
        alt="WhatsApp Petgas"
        style={{ width: 80, height: 80, marginBottom: 12 }}
      />
      <h3>Chat de contacto WhatsApp</h3>
      <button onClick={handleFAQ} style={{ width: "100%", marginBottom: 12, background: "#e0e0e0" }}>
        FAQ y BASE DEL CONOCIMIENTO C.H.I.D.O.
      </button>
      {step < questions.length ? (
        <form onSubmit={handleInput}>
          <label>{questions[step].label}</label>
          <input type="text" required autoFocus style={{ width: "100%", marginBottom: 8 }} />
          <button type="submit" style={{ width: "100%" }}>Siguiente</button>
        </form>
      ) : (
        <div>
          <h4>Resumen:</h4>
          <ul>
            {questions.map(q => (
              <li key={q.key}><b>{q.label}</b> {answers[q.key]}</li>
            ))}
          </ul>
          <button onClick={handleSend} disabled={sending} style={{ width: "100%" }}>
            {sending ? "Enviando..." : "Enviar y abrir WhatsApp"}
          </button>
        </div>
      )}
    </div>
  );
}
