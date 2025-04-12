import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = useMutation(api.auth.signIn);
  const signUp = useMutation(api.auth.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (registerMode) {
        const res = await signUp({ username, password });
        setUserId(res.userId);
        setRegisterMode(false);
      } else {
        const res = await signIn({ username, password });
        setUserId(res.userId);
      }
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err?.message || "Error");
    }
  };

  if (userId) {
    return (
      <div className="space-y-6 animate-text-slide">
        <div className="text-green-700 font-bold">Bienvenido, sesión iniciada.</div>
        <div className="text-xs text-gray-500">User ID: {userId}</div>
        <button
          className="auth-button bg-gray-400 hover:bg-gray-500 text-white"
          onClick={() => setUserId(null)}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-text-slide">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        <button type="submit" className="auth-button">
          {registerMode ? "Registrarse" : "Iniciar sesión"}
        </button>
        <button
          type="button"
          className="auth-button bg-blue-600 hover:bg-blue-700 text-white mt-2"
          onClick={() => setRegisterMode(m => !m)}
        >
          {registerMode ? "¿Ya tienes cuenta? Inicia sesión" : "Crear cuenta nueva"}
        </button>
        {error && <div className="text-red-600 font-bold">{error}</div>}
      </form>
    </div>
  );
}
