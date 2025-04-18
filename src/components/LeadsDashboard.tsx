import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { LeadDetailPanel } from "./LeadDetailPanel";

const PAGE_SIZE = 10; // Número de leads por página

export function LeadsDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from("petgas_leads")
        .select("*, metadata")
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      const hasNextPage = (data?.length || 0) > PAGE_SIZE;
      const pageData = data?.slice(0, PAGE_SIZE) || [];
      if (!error) setLeads(pageData);
      setHasNext(hasNextPage);
    }
    fetchLeads();
  }, [page]);

  const hasPrev = page > 1;

  const nextPage = () => {
    if (!hasNext) return;
    setPage(page + 1);
  };
  const prevPage = () => {
    if (!hasPrev) return;
    setPage(page - 1);
  };

  const handleStatusChange = (status: string) => {
    if (selectedLead) setSelectedLead({ ...selectedLead, status });
  };
  const handleAgentChange = (agent: string) => {
    if (selectedLead) setSelectedLead({ ...selectedLead, agent });
  };

  const marqueeStyles = {
    container: {
      width: "100%",
      overflow: "hidden",
      margin: "0 auto 24px auto",
      maxWidth: 1000,
      borderRadius: 18,
      background: "rgba(0,234,255,0.10)",
      boxShadow: "0 2px 12px 0 rgba(0,234,255,0.08)",
      border: "1.5px solid rgba(0,234,255,0.12)",
      padding: "8px 0",
      position: "relative" as const
    },
    content: {
      display: "flex",
      alignItems: "center",
      whiteSpace: "nowrap" as const,
      animation: "marquee-scroll 18s linear infinite"
    },
    logo: {
      width: 36,
      height: 36,
      marginRight: 18,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 8px 0 rgba(0,234,255,0.10)"
    },
    text: {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: "linear-gradient(90deg, #00eaff 0%, #7f7fff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginRight: 32
    },
    keyframes: `
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <style>{marqueeStyles.keyframes}</style>
      <div style={marqueeStyles.container}>
        <div style={marqueeStyles.content}>
          <img
            src="https://petgas.com.do/wp-content/uploads/2025/03/cropped-cropped-favi.png"
            alt="PETGAS Logo"
            style={marqueeStyles.logo}
          />
          <span style={marqueeStyles.text}>
            PETGAS Ecosystem Manager — Plataforma inteligente para captar, segmentar y optimizar leads para transformacion de plásticos y venta de plantas de pirólisis.
          </span>
          <img
            src="https://petgas.com.do/wp-content/uploads/2025/03/cropped-cropped-favi.png"
            alt="PETGAS Logo"
            style={marqueeStyles.logo}
          />
          <span style={{
            ...marqueeStyles.text,
            fontSize: 28,
            fontWeight: 900,
            color: "#00b140",
            textShadow: "0 2px 8px #ffe600, 0 1px 0 #fff"
          }}>
            PETGAS Ecosystem Manager — Plataforma inteligente para captar, segmentar y optimizar leads para transformacion de plásticos y venta de plantas de pirólisis.
          </span>
        </div>
      </div>
      <div style={{ marginTop: 32, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
        <h2 className="petgas-animate-pop" style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, color: "var(--petgas-green)" }}>
          Leads Dashboard
        </h2>
        <p style={{ fontSize: 18, color: "#222b2e", marginBottom: 32 }}>
          Este dashboard muestra los leads captados desde distintas fuentes y categorizados en diferentes embudos.
        </p>
        {/* Botones de importación */}
        <ImportButtons />
      </div>
      {/* Filtros y búsqueda */}
      <div style={{ display: "flex", gap: 24, marginBottom: 18, alignItems: "center", maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
        <input
          type="text"
          placeholder="Buscar por nombre, email, origen..."
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "10px 18px",
            borderRadius: 14,
            border: "1.5px solid #00b140",
            background: "#f5f7fa",
            color: "#222b2e",
            fontSize: 16,
            minWidth: 260,
            marginRight: 12
          }}
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{
            padding: "10px 18px",
            borderRadius: 14,
            border: "1.5px solid #009fe3",
            background: "#f5f7fa",
            color: "#222b2e",
            fontSize: 16,
            minWidth: 160
          }}
        >
          <option value="">Todas las categorías</option>
          <option value="ciudadano">Ciudadano</option>
          <option value="empresa">Empresa</option>
          <option value="inversor">Inversor</option>
          <option value="CRYPTO">CRYPTO</option>
        </select>
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          style={{
            padding: "10px 18px",
            borderRadius: 14,
            border: "1.5px solid #00b140",
            background: "#f5f7fa",
            color: "#222b2e",
            fontSize: 16,
            minWidth: 160
          }}
        >
          <option value="">Todos los orígenes</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="manual">Manual</option>
          <option value="wp_comment">WP Comment</option>
          <option value="CRYPTO">CRYPTO</option>
        </select>
      </div>
      <div className="petgas-panel petgas-animate-fadein" style={{ marginTop: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ fontWeight: 700, color: "#222", width: "22%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Nombre</th>
              <th style={{ fontWeight: 700, color: "#222", width: "28%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Email</th>
              <th style={{ fontWeight: 700, color: "#222", width: "18%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Origen</th>
              <th style={{ fontWeight: 700, color: "#222", width: "14%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Categoría</th>
              <th style={{ fontWeight: 700, color: "#222", width: "14%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Interés</th>
              <th style={{ fontWeight: 700, color: "#222", width: "20%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Mensaje</th>
              <th style={{ fontWeight: 700, color: "#222", width: "10%", textAlign: "left", padding: "18px 24px", background: "#f5f7fa", borderBottom: "2px solid #e0eaff" }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads
              .filter(lead => {
                // Filtro de búsqueda global
                const email = lead.email || (lead.name && extractEmailFromName(lead.name)) || "";
                const name = lead.name
                  ? lead.name.replace(/["<>]/g, "").replace(email, "").replace(/ *$/, "")
                  : "";
                const searchText = (name + " " + email + " " + lead.source + " " + lead.category + " " + (lead.metadata?.interest || "") + " " + (lead.metadata?.body || "")).toLowerCase();
                return (
                  (!search || searchText.includes(search.toLowerCase())) &&
                  (!filterCategory || (lead.category || "").toLowerCase() === filterCategory.toLowerCase()) &&
                  (!filterSource || (lead.source || "").toLowerCase() === filterSource.toLowerCase())
                );
              })
              .map((lead) => {
                // Extrae email y nombre limpios para mostrar en columnas separadas
                let email = lead.email || "-";
                let name = lead.name || "";
                const match = name.match(/<([^>]+)>/);
                if (!lead.email && match) {
                  email = match[1];
                  name = name.replace(match[0], "").replace(/["<>]/g, "").trim();
                } else {
                  name = name.replace(/["<>]/g, "").trim();
                }
                return (
                  <tr
                    key={lead.id}
                    className="petgas-animate-fadein"
                    style={{
                      transition: "background 0.15s, color 0.2s",
                      cursor: "pointer",
                      color: "#222b2e",
                      background: "rgba(255,255,255,0.95)"
                    }}
                    onClick={() => setSelectedLead(lead)}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "rgba(0,177,64,0.08)";
                      e.currentTarget.style.color = "#00b140";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                      e.currentTarget.style.color = "#222b2e";
                    }}
                  >
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{name}</td>
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{email}</td>
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{lead.source}</td>
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{lead.category}</td>
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{lead.metadata?.interest || "-"}</td>
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{lead.metadata?.body || "-"}</td>
                    <td style={{ padding: "18px 24px", color: "inherit" }}>{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "-"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* Mostrar mensaje si no hay leads o están cargando */}
        {leads.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#e0eaff' }}>No hay leads registrados.</div>}
      </div>
      <div style={{display: "flex", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto", padding: "10px"}}>
        <button className="petgas-btn" disabled={!hasPrev} onClick={prevPage} style={{width: "auto", padding: "10px 15px", opacity: hasPrev ? 1 : 0.5, cursor: hasPrev ? "pointer" : "default"}}>Anterior</button>
        <button className="petgas-btn" disabled={!hasNext} onClick={nextPage} style={{width: "auto", padding: "10px 15px", opacity: hasNext ? 1 : 0.5, cursor: hasNext ? "pointer" : "default"}}>Siguiente</button>
      </div>
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onAgentChange={handleAgentChange}
        />
      )}
    </div>
  );
}

/** Botones para importar leads de email, MySQL y WhatsApp */
function ImportButtons() {
  const [loading, setLoading] = useState<"email" | "wp" | "wa" | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleImport(type: "email" | "wp" | "wa") {
    setLoading(type);
    setResult(null);
    try {
      let endpoint = "";
      if (type === "email") endpoint = "http://localhost:4000/import-email-leads";
      else if (type === "wp") endpoint = "http://localhost:4000/import-wp-leads";
      else if (type === "wa") {
        setResult("Importación de WhatsApp aún no implementada.");
        setLoading(null);
        return;
      }
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResult(
          `Importación de ${type === "email" ? "email" : type === "wp" ? "MySQL" : "WhatsApp"} completada:\n` +
            (data.output || "")
        );
      } else {
        setResult(
          `Error al importar ${type === "email" ? "email" : type === "wp" ? "MySQL" : "WhatsApp"}:\n` +
            (data.error || data.stderr || "")
        );
      }
    } catch (err: any) {
      setResult("Error de red: " + err.message);
    }
    setLoading(null);
  }

  // Iconos SVG
  const iconEmail = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6, verticalAlign: "middle" }}>
      <rect width="20" height="20" rx="5" fill="#fff" />
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v9A2.5 2.5 0 0 1 14.5 17h-9A2.5 2.5 0 0 1 3 14.5v-9Zm2.06.44a.75.75 0 0 0-.12 1.05l4.44 5.5a.75.75 0 0 0 1.14 0l4.44-5.5a.75.75 0 1 0-1.16-.93L10 10.07 6.22 6.06a.75.75 0 0 0-1.06-.12Z" fill="#00b140"/>
    </svg>
  );
  const iconDB = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6, verticalAlign: "middle" }}>
      <ellipse cx="10" cy="5" rx="7" ry="3" fill="#fff"/>
      <ellipse cx="10" cy="5" rx="7" ry="3" stroke="#009fe3" strokeWidth="1.5"/>
      <rect x="3" y="5" width="14" height="8" rx="3" fill="#fff"/>
      <rect x="3" y="5" width="14" height="8" rx="3" stroke="#009fe3" strokeWidth="1.5"/>
      <ellipse cx="10" cy="13" rx="7" ry="3" fill="#fff"/>
      <ellipse cx="10" cy="13" rx="7" ry="3" stroke="#009fe3" strokeWidth="1.5"/>
    </svg>
  );
  const iconWA = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6, verticalAlign: "middle" }}>
      <circle cx="10" cy="10" r="10" fill="#25D366"/>
      <path d="M15.2 13.6c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.1-.3.2-.5.1-.2-.1-.8-.3-1.5-1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2 0-.4-.1-.2-.5-1.2-.7-1.6-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.3 0-.4.2-.1.2-.5.5-.5 1.2 0 .7.5 1.4.6 1.5.1.1 1.1 1.7 2.7 2.3.4.2.7.3 1 .4.4.1.7.1 1 .1.3 0 .6 0 .8-.1.2-.1.6-.2.7-.5.1-.3.1-.5.1-.5 0-.1-.1-.1-.2-.2z" fill="#fff"/>
    </svg>
  );

  return (
    <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
      <button
        onClick={() => handleImport("email")}
        disabled={!!loading}
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          background: "#00b140",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          border: "1.5px solid #00b140",
          boxShadow: "0 1px 4px 0 rgba(0,177,64,0.08)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
        }}
        title="Importar leads de Email"
      >
        {iconEmail}
        {loading === "email" ? "Importando..." : "Email"}
      </button>
      <button
        onClick={() => handleImport("wp")}
        disabled={!!loading}
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          background: "#009fe3",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          border: "1.5px solid #009fe3",
          boxShadow: "0 1px 4px 0 rgba(0,159,227,0.08)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
        }}
        title="Importar leads de MySQL"
      >
        {iconDB}
        {loading === "wp" ? "Importando..." : "MySQL"}
      </button>
      <button
        onClick={() => handleImport("wa")}
        disabled
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          background: "#25D366",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          border: "1.5px solid #25D366",
          boxShadow: "0 1px 4px 0 rgba(37,211,102,0.08)",
          opacity: 0.5,
          display: "flex",
          alignItems: "center",
          cursor: "not-allowed",
        }}
        title="Importación de WhatsApp próximamente"
      >
        {iconWA}
        WhatsApp
      </button>
      {result && (
        <pre
          style={{
            background: "#f5f7fa",
            color: "#222b2e",
            borderRadius: 10,
            padding: 10,
            marginLeft: 10,
            maxWidth: 400,
            whiteSpace: "pre-wrap",
            fontSize: 13,
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}

// Utilidad para extraer email de un string tipo 'Nombre <email@dominio.com>'
function extractEmailFromName(name: string): string | null {
  const match = name.match(/<([^>]+)>/);
  if (match) return match[1];
  return null;
}
