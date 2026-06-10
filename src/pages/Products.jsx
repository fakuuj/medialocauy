import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabaseClient';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const addItem = useCartStore((state) => state.addItem);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortBy, setSortBy] = useState('Destacados');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCollectionToggle = (col) => {
    setSelectedCollection(prev => prev === col ? null : col);
    setVisibleCount(12);
  };

  const processedProducts = products
    .filter(p => !selectedCollection || selectedCollection === p.collection)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.collection.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Precio: Menor a Mayor') return a.price - b.price;
      if (sortBy === 'Precio: Mayor a Menor') return b.price - a.price;
      return 0;
    });

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl">
      <h1 className="font-display-lg text-display-lg mb-lg">Todos los <span className="text-primary">Productos</span></h1>
      
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-xl gap-md bg-surface-container-low p-md rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full w-full sm:w-auto focus-within:ring-2 focus-within:ring-primary-container">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Buscar medias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-label-md font-label-md w-full sm:w-48 placeholder:text-on-surface-variant/70"
          />
        </div>
        <div className="flex items-center gap-sm mt-sm sm:mt-0">
          <span className="text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant whitespace-nowrap hidden sm:inline">Ordenar</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container border-none rounded-full px-md py-xs text-label-md font-label-md focus:ring-2 focus:ring-primary-container">
            <option>Destacados</option>
            <option>Más Nuevos</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      {loading ? (
        <div className="text-center py-xl">Cargando productos...</div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-lg">
            {/* Collection Filter */}
            <div>
              <h3 className="font-title-md text-title-md mb-md">Colección</h3>
              <div className="space-y-sm">
                {['Deportivo', 'Casual', 'Invierno', 'Sustentable', 'Esenciales', 'Limitado'].map(col => (
                  <label key={col} className="flex items-center gap-sm cursor-pointer group">
                    <input
                      type="radio"
                      name="desktopCollection"
                      checked={selectedCollection === col}
                      onChange={() => handleCollectionToggle(col)}
                      className="w-5 h-5 rounded-full border-outline-variant text-secondary focus:ring-secondary"
                    />
                    <span className="group-hover:text-primary transition-colors">{col}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Pills */}
        <div className="lg:hidden flex gap-sm overflow-x-auto no-scrollbar pb-md mb-md">
          {['Deportivo', 'Casual', 'Invierno', 'Sustentable', 'Esenciales', 'Limitado'].map(col => (
            <button
              key={col}
              onClick={() => handleCollectionToggle(col)}
              className={`px-md py-sm border rounded-full whitespace-nowrap font-label-md text-label-md transition-colors ${selectedCollection === col
                ? 'bg-primary border-primary text-on-primary'
                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}>
              {col}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-md md:gap-lg">
            {processedProducts.slice(0, visibleCount).map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col h-full bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-primary-container/10">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {product.badge && (
                    <div className="absolute top-sm right-sm">
                      <span className={`${product.badgeColor} font-label-sm text-label-sm px-sm py-xs rounded-full`}>{product.badge}</span>
                    </div>
                  )}
                </div>
                <div className="p-md flex flex-col flex-grow">
                  <p className="text-label-sm font-label-sm text-primary mb-xs uppercase tracking-tighter">{product.collection}</p>
                  <h3 className="font-title-md text-title-md text-on-surface mb-sm">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-headline-lg text-headline-lg-mobile text-on-surface">${product.price.toFixed(2)}</span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < processedProducts.length && (
            <div className="mt-xl flex justify-center pb-24 md:pb-xl">
              <button
                onClick={handleLoadMore}
                className="px-xl py-md bg-surface-container-high hover:bg-primary-container text-on-surface transition-all rounded-full font-label-md text-label-md">
                Cargar Más Productos
              </button>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default Products;
