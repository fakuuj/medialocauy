import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';

const AdminLayout = ({ session }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-surface-variant flex flex-col hidden md:flex">
        <div className="p-lg border-b border-surface-variant">
          <h2 className="font-display-sm text-[24px] text-primary">ADMIN</h2>
          <p className="text-label-sm text-on-surface-variant">Medialoca Store</p>
        </div>
        <nav className="p-md flex-grow space-y-xs">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-sm py-sm rounded-lg flex items-center gap-sm font-label-md transition-colors ${activeTab === 'dashboard' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            Resumen
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-sm py-sm rounded-lg flex items-center gap-sm font-label-md transition-colors ${activeTab === 'orders' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined">shopping_cart</span>
            Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-sm py-sm rounded-lg flex items-center gap-sm font-label-md transition-colors ${activeTab === 'products' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined">inventory_2</span>
            Productos
          </button>
        </nav>
        <div className="p-md border-t border-surface-variant">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full text-left px-sm py-sm rounded-lg flex items-center gap-sm text-error hover:bg-error/10 font-label-md transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden bg-surface pb-20 md:pb-0">
        {/* Mobile Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-surface-variant p-md flex justify-between items-center md:hidden sticky top-0 z-50">
          <h2 className="font-display-sm text-[20px] text-primary tracking-tighter">MEDIA<span className="text-secondary">ADMIN</span></h2>
          <button onClick={() => supabase.auth.signOut()} className="text-error bg-error/10 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-grow p-md sm:p-lg md:p-xl overflow-y-auto">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'products' && <AdminProducts />}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-variant flex justify-around items-center p-sm z-50 pb-safe">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined ${activeTab === 'dashboard' ? 'font-fill' : ''}`}>dashboard</span>
            <span className="text-[10px] font-label-sm font-bold">Resumen</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'orders' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined ${activeTab === 'orders' ? 'font-fill' : ''}`}>shopping_cart</span>
            <span className="text-[10px] font-label-sm font-bold">Pedidos</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'products' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined ${activeTab === 'products' ? 'font-fill' : ''}`}>inventory_2</span>
            <span className="text-[10px] font-label-sm font-bold">Productos</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

import AdminLogin from './AdminLogin';

const AdminRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!session) return <AdminLogin onLoginSuccess={setSession} />;

  return <AdminLayout session={session} />;
};

export default AdminRoute;
