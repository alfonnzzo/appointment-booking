import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, sesion } from '../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function entrar() {
    setError(null);
    try {
      const { token } = await api.login(username, password);
      sesion.guardar(token);
      navigate('/admin');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Ingreso del negocio</h1>
      <input
        className="mt-6 w-full rounded-lg border border-slate-300 p-2.5"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="mt-3 w-full rounded-lg border border-slate-300 p-2.5"
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && entrar()}
      />
      <button onClick={entrar} className="mt-4 w-full rounded-lg bg-slate-900 p-3 font-medium text-white">
        Ingresar
      </button>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
