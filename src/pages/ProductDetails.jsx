import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabaseClient';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-xl">Cargando producto...</div>;
  }

  if (!product) {
    return <div className="text-center py-xl">Producto no encontrado</div>;
  }

  const handleAddToCart = () => {
    addItem(product);
    navigate('/checkout');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg lg:gap-xl max-w-container-max mx-auto mt-lg">
      {/* Product Image */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center p-md shadow-sm">
        <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-xl" />
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <p className="text-primary font-label-md uppercase tracking-widest mb-xs">{product.collection}</p>
        <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">{product.name}</h1>
        <p className="font-headline-lg text-headline-lg text-on-surface mb-md">${product.price.toFixed(2)}</p>

        <p className="text-body-lg text-on-surface-variant mb-lg">
          Experimenta la mezcla perfecta de estilo, comodidad y rendimiento. 
          Nuestras medias premium están diseñadas con atención meticulosa a cada detalle.
        </p>

        <div className="bg-surface-container-low p-sm rounded-lg mb-lg inline-block border border-outline-variant">
          <span className="text-body-md text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">straighten</span>
            Talle Único - Se adapta a todos
          </span>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full py-md bg-primary text-on-primary rounded-full font-label-md uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-colors mb-sm">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
