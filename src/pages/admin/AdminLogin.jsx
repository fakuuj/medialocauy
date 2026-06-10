import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Credenciales incorrectas o usuario no verificado' : error.message);
    } else {
      onLoginSuccess(data.session);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-gutter">
      <div className="max-w-md w-full bg-surface-container-lowest p-xl rounded-2xl shadow-lg border border-surface-variant">
        <div className="text-center mb-lg">
          <span className="material-symbols-outlined text-[48px] text-primary mb-sm">admin_panel_settings</span>
          <h1 className="font-display-md text-[28px] text-on-surface">Acceso Restringido</h1>
          <p className="text-body-md text-on-surface-variant">Panel de Administración de Medialoca</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-sm rounded-lg mb-md text-center text-label-md font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-md">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="admin@medialoca.com"
            />
          </div>
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-md mt-sm bg-primary text-on-primary rounded-xl font-label-md uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50 flex justify-center items-center gap-sm">
            {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
