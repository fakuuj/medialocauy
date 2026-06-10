import React from 'react';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto py-xl">
      <h1 className="font-display-lg text-display-lg text-primary mb-lg text-center">Sobre la Marca</h1>
      <div className="space-y-md text-body-lg text-on-surface-variant">
        <p>
          MEDIALOCA nació en Uruguay con una visión clara: elevar un elemento cotidiano a su máxima expresión. 
          Creemos que el diseño premium no debe estar reñido con la funcionalidad y el rendimiento.
        </p>
        <p>
          Nuestras colecciones están cuidadosamente elaboradas utilizando materiales de la más alta calidad, 
          garantizando no solo un estilo impecable sino también una comodidad excepcional para el ritmo de vida moderno.
        </p>
        <div className="my-xl p-lg bg-surface-container-low rounded-xl border border-surface-variant">
          <h3 className="font-title-md text-primary mb-sm">Nuestra Misión</h3>
          <p>Ofrecer diseño de clase mundial con el corazón y la dedicación de la artesanía local, permitiendo a nuestros clientes expresarse desde los pies hacia arriba.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
