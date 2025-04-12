import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 glass-card">
      <h2 className="text-lg font-bold">Nuevo Lead</h2>
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="auth-input" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Categoría</label>
        <select className="auth-input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="ciudadano">Ciudadano</option>
          <option value="empresa">Empresa</option>
          <option value="inversor">Inversor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Origen</label>
        <input className="auth-input" value={source} onChange={e => setSource(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <input className="auth-input" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Teléfono</label>
        <input className="auth-input" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <button type="submit" className="auth-button">
        Guardar Lead
      </button>
      {success && <div className="text-green-700 font-bold">¡Lead guardado!</div>}
    </form>
  );
}
