import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Papa from 'papaparse';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      fetchOrders();
    }
  };

  const exportToCSV = () => {
    const csvData = orders.map(order => ({
      ID: order.id,
      Fecha: new Date(order.created_at).toLocaleDateString(),
      Cliente: order.customer_name,
      Email: order.customer_email,
      Teléfono: order.customer_phone,
      Dirección: `${order.customer_address}, ${order.customer_city}`,
      Total: order.total_price,
      Método_Pago: order.payment_method,
      Estado: order.status,
      Productos: order.items.map(item => `${item.quantity}x ${item.name}`).join(' | ')
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'pedidos_medialoca.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="font-headline-lg text-on-surface">Pedidos</h1>
        <button 
          onClick={exportToCSV}
          className="bg-[#107c41] text-white px-md py-sm rounded-lg flex items-center gap-sm font-label-md hover:opacity-90">
          <span className="material-symbols-outlined">table</span>
          Exportar a Excel
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant text-label-md text-on-surface-variant">
                <th className="p-md font-bold">Fecha</th>
                <th className="p-md font-bold">Cliente</th>
                <th className="p-md font-bold">Total</th>
                <th className="p-md font-bold">Pago</th>
                <th className="p-md font-bold">Estado</th>
                <th className="p-md font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-xl text-center text-on-surface-variant">No hay pedidos aún.</td>
                </tr>
              )}
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-md text-body-sm whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-md">
                    <p className="font-title-sm">{order.customer_name}</p>
                    <p className="text-body-sm text-on-surface-variant">{order.customer_phone}</p>
                  </td>
                  <td className="p-md font-title-sm">${order.total_price}</td>
                  <td className="p-md text-body-sm capitalize">{order.payment_method}</td>
                  <td className="p-md">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-label-sm font-bold rounded-full px-sm py-1 border-none focus:ring-2 ${
                        order.status === 'Pendiente' ? 'bg-error/20 text-error' :
                        order.status === 'Pagado' ? 'bg-primary/20 text-primary' :
                        order.status === 'Enviado' ? 'bg-secondary/20 text-secondary' :
                        'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-md">
                    <button className="text-primary hover:text-primary-container" title="Ver detalles">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-md">
        {orders.length === 0 && (
          <div className="p-xl text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-surface-variant">
            No hay pedidos aún.
          </div>
        )}
        {orders.map(order => (
          <div key={order.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-title-md text-on-surface">{order.customer_name}</p>
                <p className="text-body-sm text-on-surface-variant">{order.customer_phone}</p>
              </div>
              <p className="font-title-md text-primary">${order.total_price}</p>
            </div>
            
            <div className="flex justify-between items-center text-label-sm text-on-surface-variant mt-xs">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {new Date(order.created_at).toLocaleDateString()}</span>
              <span className="capitalize">{order.payment_method}</span>
            </div>

            <div className="border-t border-surface-variant pt-sm mt-xs flex justify-between items-center">
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`text-label-sm font-bold rounded-full px-sm py-1 border-none focus:ring-2 w-1/2 ${
                  order.status === 'Pendiente' ? 'bg-error/20 text-error' :
                  order.status === 'Pagado' ? 'bg-primary/20 text-primary' :
                  order.status === 'Enviado' ? 'bg-secondary/20 text-secondary' :
                  'bg-surface-variant text-on-surface-variant'
                }`}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Enviado">Enviado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <button className="text-primary hover:text-primary-container flex items-center gap-1 font-label-md">
                Ver más <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
