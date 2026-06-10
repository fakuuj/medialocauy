import React from 'react';

const FAQ = () => {
  const faqs = [
    { q: "¿Cuáles son los métodos de pago?", a: "Aceptamos transferencia bancaria y pronto incorporaremos MercadoPago para que puedas abonar con todas las tarjetas." },
    { q: "¿Dónde están ubicados?", a: "Somos una tienda online de Uruguay, realizamos envíos a todo el país." },
    { q: "¿Cómo sé mi talle?", a: "Nuestros calcetines tienen un rango de adaptabilidad amplio. Generalmente abarcan desde el talle 36 al 44. En cada producto especificamos si hay alguna variación." },
    { q: "¿Venden por mayor?", a: "Sí, contamos con precios especiales para compras mayoristas. Contáctanos por WhatsApp para más información." }
  ];

  return (
    <div className="max-w-3xl mx-auto py-xl">
      <h1 className="font-display-lg text-display-lg text-primary mb-lg text-center">Preguntas Frecuentes</h1>
      <div className="space-y-md">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant">
            <h3 className="font-title-md text-on-surface mb-xs">{faq.q}</h3>
            <p className="text-body-md text-on-surface-variant">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
