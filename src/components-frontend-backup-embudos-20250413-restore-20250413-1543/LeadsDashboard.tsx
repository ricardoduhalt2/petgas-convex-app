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
        .select("*")
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
        {/* Cards de categorías inteligentes */}
        <CategoryCards
          leads={leads}
          onCategoryClick={setFilterCategory}
        />
      </div>
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
          <option value="">Todas las categorías AI</option>
          <option value="Inversor">Inversor</option>
          <option value="Empresa">Empresa</option>
          <option value="Ciudadano">Ciudadano</option>
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
              <th className="petgas-badge gray" style={{ fontWeight: 700, color: "#222", width: "22%", textAlign: "left", padding: "18px 24px" }}>Nombre</th>
              <th className="petgas-badge gray" style={{ fontWeight: 700, color: "#222", width: "28%", textAlign: "left", padding: "18px 24px" }}>Email</th>
              <th className="petgas-badge gray" style={{ fontWeight: 700, color: "#222", width: "18%", textAlign: "left", padding: "18px 24px" }}>Origen</th>
              <th className="petgas-badge gray" style={{ fontWeight: 700, color: "#222", width: "18%", textAlign: "left", padding: "18px 24px" }}>Categoría</th>
              <th className="petgas-badge gray" style={{ fontWeight: 700, color: "#222", width: "14%", textAlign: "left", padding: "18px 24px" }}>Fecha</th>
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
                const searchText = (name + " " + email + " " + lead.source + " " + lead.category).toLowerCase();
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

/** Cards visuales para categorías de leads */
function CategoryCards({ leads, onCategoryClick }: { leads: any[], onCategoryClick: (category: string) => void }) {
  const categories = [
    {
      key: "Inversor",
      label: "Inversor",
      color: "#00b140",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#eafff2"/>
          <path d="M16 18c3.31 0 6 2.24 6 5v1H10v-1c0-2.76 2.69-5 6-5Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="#00b140"/>
        </svg>
      )
    },
    {
      key: "Empresa",
      label: "Empresa",
      color: "#009fe3",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#eaf7ff"/>
          <rect x="10" y="12" width="12" height="8" rx="2" fill="#009fe3"/>
          <rect x="13" y="16" width="2" height="4" fill="#fff"/>
          <rect x="17" y="16" width="2" height="4" fill="#fff"/>
        </svg>
      )
    },
    {
      key: "Ciudadano",
      label: "Ciudadano",
      color: "#7f7fff",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#f0f0ff"/>
          <path d="M16 10v8m0 0l-4-4m4 4l4-4" stroke="#7f7fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      key: "CRYPTO",
      label: "CRYPTO",
      color: "#ffe600",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#fffbe6"/>
          <path d="M16 10v12m-4-6h8" stroke="#ffe600" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 24,
      marginBottom: 32
    }}>
      {categories.map(cat => {
        const count = leads.filter(lead => lead.metadata?.category_ai === cat.key).length;
        return (
          <div key={cat.key}
            onClick={() => onCategoryClick(cat.key)}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: `0 2px 12px 0 ${cat.color}22`,
              border: `2px solid ${cat.color}33`,
              padding: "24px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 140,
              transition: "box-shadow 0.2s",
              cursor: "pointer"
            }}
          >
            <div style={{ marginBottom: 12 }}>{cat.icon}</div>
            <div style={{
              fontWeight: 900,
              fontSize: 22,
              color: cat.color,
              marginBottom: 6,
              letterSpacing: "0.02em"
            }}>{cat.label}</div>
            <div style={{
              color: "#888",
              fontSize: 15,
              textAlign: "center"
            }}>
              {count} leads
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Utilidad para extraer email de un string tipo 'Nombre <email@dominio.com>'
function extractEmailFromName(name: string): string | null {
  const match = name.match(/<([^>]+)>/);
  if (match) return match[1];
  return null;
}
