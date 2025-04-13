import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface LeadDetailPanelProps {
  lead: any;
  onClose: () => void;
  onStatusChange?: (status: string) => void;
  onAgentChange?: (agent: string) => void;
}

const statusOptions = [
  "nuevo",
  "en seguimiento",
  "contactado",
  "cerrado",
  "descartado"
];

export function LeadDetailPanel({
  lead,
  onClose,
  onStatusChange,
  onAgentChange
}: LeadDetailPanelProps) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar notas desde Supabase
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("petgas_lead_notes")
        .select("*")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false });
      setNotes(data || []);
      setLoading(false);
    }
    if (lead?.id) fetchNotes();
  }, [lead?.id]);

  // Agregar nota y persistir en Supabase
  const handleAddNote = async () => {
    if (note.trim()) {
      const { data, error } = await supabase
        .from("petgas_lead_notes")
        .insert([
          {
            lead_id: lead.id,
            agent: lead.agent || "Agente",
            note: note.trim()
          }
        ])
        .select()
        .single();
      if (!error && data) {
        setNotes([data, ...notes]);
        setNote("");
      }
    }
  };

  if (!lead) return null;

  return (
    <div
      className="petgas-panel petgas-animate-pop"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 480,
        height: "100vh",
        background: "#fff",
        color: "#222b2e",
        boxShadow: "-4px 0 32px 0 rgba(0,177,64,0.13)",
        zIndex: 1000,
        padding: 32,
        overflowY: "auto",
        borderLeft: "6px solid #00b140"
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          color: "#00b140",
          fontSize: 28,
          fontWeight: 900,
          cursor: "pointer"
        }}
        aria-label="Cerrar"
      >
        ×
      </button>
      <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12, color: "#00b140", letterSpacing: "0.01em" }}>
        Detalle del Lead
      </h2>
      <div style={{ marginBottom: 18 }}>
        <strong>Nombre:</strong> {lead.name}
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Email:</strong> <span style={{ color: "#009fe3" }}>{lead.email || "-"}</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Teléfono:</strong> <span style={{ color: "#00b140" }}>{lead.phone || "-"}</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Origen:</strong> <span className="petgas-badge blue">{lead.source}</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Categoría:</strong> <span className="petgas-badge yellow">{lead.category}</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Fecha:</strong>{" "}
        {lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Estado:</strong>{" "}
        <select
          value={lead.status || "nuevo"}
          onChange={e => onStatusChange && onStatusChange(e.target.value)}
          style={{
            background: "#00b140",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "6px 12px",
            fontWeight: 700,
            fontSize: 16,
            marginLeft: 8
          }}
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Agente asignado:</strong>{" "}
        <input
          type="text"
          value={lead.agent || ""}
          onChange={e => onAgentChange && onAgentChange(e.target.value)}
          placeholder="Nombre del agente"
          style={{
            background: "#f5f7fa",
            color: "#222b2e",
            border: "1.5px solid #00b140",
            borderRadius: 8,
            padding: "6px 12px",
            fontWeight: 600,
            fontSize: 16,
            marginLeft: 8
          }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Metadata:</strong>
        <pre
          style={{
            background: "#e5e7eb",
            color: "#222b2e",
            borderRadius: 10,
            padding: 16,
            fontSize: 16,
            marginTop: 6,
            maxHeight: 400,
            minHeight: 120,
            overflow: "auto",
            boxShadow: "0 2px 8px 0 rgba(0,177,64,0.08)"
          }}
        >
          {JSON.stringify(lead.metadata, null, 2)}
        </pre>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Notas / Seguimiento del agente:</strong>
        <div style={{
          background: "#f5f7fa",
          borderRadius: 8,
          padding: 10,
          minHeight: 60,
          marginBottom: 8,
          maxHeight: 180,
          overflowY: "auto",
          boxShadow: "0 1px 4px 0 rgba(0,177,64,0.08)"
        }}>
          {loading && <div style={{ color: "#94a3b8" }}>Cargando notas...</div>}
          {!loading && notes.length === 0 && <div style={{ color: "#94a3b8" }}>Sin notas aún.</div>}
          {notes.map((n, i) => (
            <div key={n.id || i} style={{ marginBottom: 6, borderLeft: "3px solid #00b140", paddingLeft: 8 }}>
              <div style={{ fontWeight: 700, color: "#009fe3" }}>{n.agent || "Agente"}</div>
              <div>{n.note}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</div>
            </div>
          ))}
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Agregar nota o actualización de seguimiento..."
          style={{
            width: "100%",
            minHeight: 40,
            borderRadius: 8,
            border: "1.5px solid #00b140",
            background: "#fff",
            color: "#222b2e",
            padding: 8,
            marginBottom: 6,
            fontSize: 16
          }}
        />
        <button
          onClick={handleAddNote}
          className="petgas-btn"
          style={{
            padding: "8px 24px",
            fontSize: 16,
            marginTop: 4
          }}
        >
          Agregar nota
        </button>
      </div>
      {/* Aquí se pueden agregar más widgets tipo Notion para proceso de seguimiento */}
    </div>
  );
}
