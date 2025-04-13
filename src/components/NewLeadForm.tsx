import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const styles = {
  form: {
    padding: 32,
    borderRadius: 28,
    background: "rgba(30, 41, 59, 0.55)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.22)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1.5px solid rgba(255,255,255,0.18)",
    color: "#f1f5f9",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    maxWidth: 420,
    margin: "36px auto",
    position: "relative" as const,
    overflow: "hidden"
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 18,
    letterSpacing: "0.02em",
    background: "linear-gradient(90deg, #00eaff 0%, #7f7fff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  label: {
    display: "block",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 6,
    color: "#e0eaff"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 14,
    border: "1.5px solid rgba(0,234,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontSize: 16,
    marginBottom: 18,
    outline: "none",
    boxShadow: "0 1px 8px 0 rgba(0,234,255,0.04)",
    transition: "border 0.2s"
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 14,
    border: "1.5px solid rgba(0,234,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontSize: 16,
    marginBottom: 18,
    outline: "none",
    boxShadow: "0 1px 8px 0 rgba(0,234,255,0.04)",
    transition: "border 0.2s"
  },
  button: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 16,
    background: "rgba(0,234,255,0.18)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
    border: "1.5px solid rgba(0,234,255,0.35)",
    boxShadow: "0 4px 24px 0 rgba(0,234,255,0.12)",
    cursor: "pointer",
    marginTop: 4,
    marginBottom: 4,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "background 0.2s, box-shadow 0.2s"
  },
  success: {
    color: "#00eaff",
    fontWeight: 700,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center" as const
  }
};

export function NewLeadForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("ciudadano");
  const [source, setSource] = useState("manual");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  const createLead = useMutation(api.leads.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLead({
      name,
      category,
      source,
      email: email || undefined,
      phone: phone || undefined,
      metadata: {},
    });
    setSuccess(true);
    setName("");
    setCategory("ciudadano");
    setSource("manual");
    setEmail("");
    setPhone("");
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Nuevo Lead</h2>
      <div>
        <label style={styles.label}>Nombre</label>
        <input style={styles.input} value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label style={styles.label}>Categoría</label>
        <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="ciudadano">Ciudadano</option>
          <option value="empresa">Empresa</option>
          <option value="inversor">Inversor</option>
        </select>
      </div>
      <div>
        <label style={styles.label}>Origen</label>
        <input style={styles.input} value={source} onChange={e => setSource(e.target.value)} />
      </div>
      <div>
        <label style={styles.label}>Email</label>
        <input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label style={styles.label}>Teléfono</label>
        <input style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <button type="submit" style={styles.button}>
        Guardar Lead
      </button>
      {success && <div style={styles.success}>¡Lead guardado!</div>}
    </form>
  );
}
