import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabaseClient';

const Checkout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { items, getCartTotal, removeItem, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const total = getCartTotal(paymentMethod);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    const totalQuantity = items.reduce((count, item) => count + item.quantity, 0);
    
    if (paymentMethod === 'transfer') {
      let activeUnitPrice = 170;
      if (totalQuantity >= 6) activeUnitPrice = 147;
      else if (totalQuantity >= 2) activeUnitPrice = 150;

      const orderSummaryText = `Nuevo Pedido de MEDIALOCA

Cliente: ${formData.name}
Dirección: ${formData.address}, ${formData.city}
Método de Pago: Transferencia Bancaria

Productos:
${items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}

Total a pagar: $${total.toFixed(0)}`;

      supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        payment_method: paymentMethod,
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: activeUnitPrice })),
        total_price: total
      }]).then(() => {
        const whatsappNumber = "59899123456"; 
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderSummaryText)}`;
        
        clearCart();
        window.open(whatsappUrl, '_blank');
        navigate('/');
      });

    } else {
      let activeUnitPrice = 190;
      if (totalQuantity >= 6) activeUnitPrice = 165;
      else if (totalQuantity >= 2) activeUnitPrice = 170;

      supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        payment_method: paymentMethod,
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: activeUnitPrice })),
        total_price: total
      }]).then(() => {
        const orderSummaryText = `Nuevo Pedido de MEDIALOCA (MercadoPago)\n\nCliente: ${formData.name}\nTotal a pagar: $${total.toFixed(0)}\n\nPor favor envíame el link de pago.`;
        const whatsappNumber = "59899123456";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderSummaryText)}`;
        
        clearCart();
        window.open(whatsappUrl, '_blank');
        navigate('/');
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-xl text-center space-y-lg animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-md">
          <span className="material-symbols-outlined text-[48px]">check_circle</span>
        </div>
        <h1 className="font-display-lg text-display-lg text-primary">¡Pedido Pronto!</h1>
        <p className="text-body-lg text-on-surface-variant">
          Te redirigimos a WhatsApp para enviarnos tu pedido. Una vez enviado el mensaje, te pasaremos los datos para abonar.
        </p>
        <div className="bg-surface-container-low p-md rounded-xl inline-block mt-lg border border-surface-variant">
          <p className="font-title-md text-on-surface mb-xs">¿No se abrió WhatsApp?</p>
          <p className="text-body-md text-on-surface-variant mb-sm">Puedes enviarnos el mensaje manualmente a nuestro número.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-center py-xl text-title-md">Tu carrito está vacío.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl max-w-container-max mx-auto">
      {/* Checkout Form */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Detalles de Envío</h2>
        <form onSubmit={handleCheckout} className="space-y-md">
          <div className="grid grid-cols-2 gap-md">
            <input required type="text" name="name" placeholder="Nombre completo" onChange={handleInputChange} className="w-full rounded-lg border-outline-variant p-sm focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest" />
            <input required type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full rounded-lg border-outline-variant p-sm focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest" />
          </div>
          <input required type="text" name="phone" placeholder="Teléfono / WhatsApp" onChange={handleInputChange} className="w-full rounded-lg border-outline-variant p-sm focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest" />
          <input required type="text" name="address" placeholder="Dirección de envío" onChange={handleInputChange} className="w-full rounded-lg border-outline-variant p-sm focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest" />
          <input required type="text" name="city" placeholder="Ciudad / Departamento" onChange={handleInputChange} className="w-full rounded-lg border-outline-variant p-sm focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest" />

          <h2 className="font-headline-lg text-headline-lg text-primary mt-lg mb-md">Método de Pago</h2>
          <div className="space-y-sm">
            <label className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'transfer' ? 'border-primary bg-primary-container/20' : 'border-outline-variant'}`}>
              <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="text-primary focus:ring-primary" />
              <span className="font-title-md">Transferencia Bancaria</span>
            </label>
            <label className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'mercadopago' ? 'border-primary bg-primary-container/20' : 'border-outline-variant'}`}>
              <input type="radio" name="payment" value="mercadopago" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} className="text-primary focus:ring-primary" />
              <span className="font-title-md">MercadoPago <span className="text-label-sm bg-surface-variant px-2 py-1 rounded-full ml-2">Pronto</span></span>
            </label>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="bg-surface-container-low p-md rounded-lg mt-md">
              <p className="text-body-md text-on-surface-variant">Al confirmar, serás redirigido a WhatsApp para enviarnos tu pedido. Te pasaremos los datos de la cuenta BROU/Itau para realizar la transferencia.</p>
            </div>
          )}

          <button type="submit" className="w-full py-md mt-lg bg-primary text-on-primary rounded-full font-label-md uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md hover:shadow-lg">
            Confirmar Pedido
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant h-fit">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Resumen</h2>
        
        {/* Shipping Banner */}
        <div className="bg-primary-container/30 border border-primary/20 rounded-lg p-md mb-md text-on-surface">
          <h3 className="font-title-md text-primary mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Envíos a todo el país
          </h3>
          <p className="text-body-sm text-on-surface-variant">Llegamos a todo el Uruguay mediante envíos rápidos y seguros.</p>
        </div>
        {/* Discount Explanation Banner */}
        <div className="bg-primary-container/30 border border-primary/20 rounded-lg p-md mb-md text-on-surface">
          <h3 className="font-title-md text-primary mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">local_offer</span>
            Precios Especiales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <div>
              <p className="font-bold text-secondary mb-1">Transferencia:</p>
              <ul className="text-body-sm text-on-surface-variant space-y-1">
                <li className="flex justify-between"><span>1 par:</span> <span>$170 c/u</span></li>
                <li className="flex justify-between"><span>2 a 5 pares:</span> <span>$150 c/u</span></li>
                <li className="flex justify-between"><span>6 o más:</span> <span>$147 c/u</span></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-secondary mb-1">MercadoPago:</p>
              <ul className="text-body-sm text-on-surface-variant space-y-1">
                <li className="flex justify-between"><span>1 par:</span> <span>$190 c/u</span></li>
                <li className="flex justify-between"><span>2 a 5 pares:</span> <span>$170 c/u</span></li>
                <li className="flex justify-between"><span>6 o más:</span> <span>$165 c/u</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-md mb-lg divide-y divide-surface-variant">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between pt-md first:pt-0">
              <div className="flex items-center gap-sm">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <p className="font-title-md">{item.name}</p>
                  <p className="text-on-surface-variant">
                    {(() => {
                      const totalQty = items.reduce((c, i) => c + i.quantity, 0);
                      let unitPrice = 170;
                      if (paymentMethod === 'transfer') {
                        if (totalQty >= 6) unitPrice = 147;
                        else if (totalQty >= 2) unitPrice = 150;
                      } else {
                        if (totalQty >= 6) unitPrice = 165;
                        else if (totalQty >= 2) unitPrice = 170;
                        else unitPrice = 190;
                      }
                      return `$${unitPrice.toFixed(0)} x ${item.quantity}`;
                    })()}
                  </p>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-error hover:text-error-container">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
        <div className="border-t border-surface-variant pt-md flex flex-col gap-sm">
          {paymentMethod === 'mercadopago' && items.length > 0 && (
            <div className="flex justify-between items-center text-body-md text-on-surface-variant bg-surface-container p-sm rounded-lg">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">info</span> Recargo MercadoPago</span>
              <span>+ ${(useCartStore.getState().getCartTotal('mercadopago') - useCartStore.getState().getCartTotal('transfer')).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-sm">
            <span className="font-title-md">Total a Pagar</span>
            <span className="font-headline-lg text-headline-lg text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
