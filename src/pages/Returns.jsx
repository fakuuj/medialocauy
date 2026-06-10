import React from 'react';

const Returns = () => {
  return (
    <div className="max-w-3xl mx-auto py-xl">
      <h1 className="font-display-lg text-display-lg text-primary mb-lg text-center">Cambios y Devoluciones</h1>
      <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant space-y-md text-body-lg text-on-surface-variant">
        <p>Tu satisfacción es nuestra prioridad. Queremos que estés 100% feliz con tus MEDIALOCA.</p>
        
        <h3 className="font-title-md text-primary mt-lg">Plazo para Cambios</h3>
        <p>Tienes un plazo de 30 días calendario a partir de la fecha de recepción de tu pedido para solicitar un cambio, siempre y cuando el producto se encuentre sin uso y en su empaque original.</p>
        
        <h3 className="font-title-md text-primary mt-lg">Proceso</h3>
        <p>Para iniciar un cambio, comunícate con nuestro equipo a través de WhatsApp indicando tu nombre, número de pedido y el motivo. Nos encargaremos de coordinar el proceso de la forma más ágil posible.</p>

        <p className="text-sm mt-md text-on-surface-variant">Nota: Por motivos de higiene, ciertos artículos íntimos (si el empaque fue abierto y probado) pueden no estar sujetos a devolución. Consulta por WhatsApp para casos específicos.</p>
      </div>
    </div>
  );
};

export default Returns;
