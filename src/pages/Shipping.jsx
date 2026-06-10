import React from 'react';

const Shipping = () => {
  return (
    <div className="max-w-3xl mx-auto py-xl">
      <h1 className="font-display-lg text-display-lg text-primary mb-lg text-center">Información de Envíos</h1>
      <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant space-y-md text-body-lg text-on-surface-variant">
        <h3 className="font-title-md text-primary">Envíos a todo el país</h3>
        <p>
          Realizamos envíos a todo Uruguay a través de las principales agencias (DAC, UES). 
          El costo de envío corre por cuenta del comprador y se abona al recibir el paquete, a menos que haya una promoción de envío gratis activa.
        </p>
        
        <h3 className="font-title-md text-primary mt-lg">Tiempos de Despacho</h3>
        <p>
          Una vez confirmado el pago, los pedidos se procesan y despachan en un plazo máximo de 24 a 48 horas hábiles.
          Te enviaremos el número de rastreo por WhatsApp para que puedas hacer el seguimiento.
        </p>
      </div>
    </div>
  );
};

export default Shipping;
