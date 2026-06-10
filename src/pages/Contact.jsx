import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto py-xl">
      <h1 className="font-display-lg text-display-lg text-primary mb-lg text-center">Contacto</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-sm">chat</span>
          <h3 className="font-title-md text-on-surface mb-xs">WhatsApp</h3>
          <p className="text-on-surface-variant mb-md">La forma más rápida de contactarnos para dudas o pedidos.</p>
          <a href="https://wa.me/59899000000" target="_blank" rel="noreferrer" className="px-md py-sm bg-primary text-on-primary rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors">
            Enviar Mensaje
          </a>
        </div>

        <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-surface-variant flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-sm">mail</span>
          <h3 className="font-title-md text-on-surface mb-xs">Email</h3>
          <p className="text-on-surface-variant mb-md">Para consultas mayoristas o alianzas estratégicas.</p>
          <a href="mailto:hola@medialoca.com.uy" className="px-md py-sm border border-outline text-on-surface rounded-full hover:border-primary hover:text-primary transition-colors">
            Escribir Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
