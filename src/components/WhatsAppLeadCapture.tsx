import React, { useState } from "react";

/**
 * Componente para capturar el input del usuario antes de enviarlo a WhatsApp.
 * El mensaje se almacena como lead en Convex y luego redirige al usuario al chat de WhatsApp.
 * 
 * Requiere: agregar la lógica de envío a Convex (fetch a /import-leads) y configurar el endpoint.
 */

const WHATSAPP_NUMBER = "5219999999999"; // Cambia por el número real

export default function WhatsAppLeadCapture() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Guardar el lead en Convex vía HTTP Action
    await fetch("/import-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        source: "whatsapp_web",
        category: "whatsapp",
        status: "new",
        metadata: { body: message, date: new Date().toISOString() }
      })
    });

    // Redirigir a WhatsApp Web con el mensaje prellenado
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h3>Contáctanos por WhatsApp</h3>
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <textarea
        placeholder="¿Cuál es tu mensaje?"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="submit" disabled={sending} style={{ width: "100%" }}>
        {sending ? "Enviando..." : "Enviar y abrir WhatsApp"}
      </button>
    </form>
  );
}
