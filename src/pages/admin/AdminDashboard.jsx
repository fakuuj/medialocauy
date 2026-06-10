import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ pendingOrders: 0, monthlyEarnings: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Pedidos Pendientes
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente');

      // Ganancias del mes (asumiendo que los pagados y enviados cuentan)
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { data: monthlyOrders } = await supabase
        .from('orders')
        .select('total_price')
        .gte('created_at', firstDayOfMonth)
        .in('status', ['Pagado', 'Enviado']);

      const monthlyEarnings = (monthlyOrders || []).reduce((acc, order) => acc + Number(order.total_price), 0);

      // Low stock (< 20)
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 20);

      setStats({
        pendingOrders: pendingCount || 0,
        monthlyEarnings,
        lowStock: lowStockCount || 0
      });
    } catch (err) {
      console.error("Error fetching stats", err);
    }
    setLoading(false);
  };

  if (loading) return <div>Cargando dashboard...</div>;

  return (
    <div>
      <h1 className="font-headline-lg text-on-surface mb-lg">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant shadow-sm flex flex-col">
          <span className="material-symbols-outlined text-primary mb-sm text-[32px]">pending_actions</span>
          <p className="text-label-md text-on-surface-variant mb-xs">Pedidos Pendientes</p>
          <p className="font-display-md text-on-surface">{stats.pendingOrders}</p>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant shadow-sm flex flex-col">
          <span className="material-symbols-outlined text-secondary mb-sm text-[32px]">payments</span>
          <p className="text-label-md text-on-surface-variant mb-xs">Ganancias del Mes</p>
          <p className="font-display-md text-on-surface">${stats.monthlyEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant shadow-sm flex flex-col">
          <span className="material-symbols-outlined text-error mb-sm text-[32px]">warning</span>
          <p className="text-label-md text-on-surface-variant mb-xs">Productos con Bajo Stock</p>
          <p className="font-display-md text-on-surface">{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
