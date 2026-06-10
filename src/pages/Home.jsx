import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import SmileyFace from '../components/SmileyFace';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortBy, setSortBy] = useState('Destacados');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCollectionToggle = (col) => {
    setSelectedCollection(prev => prev === col ? null : col);
    setVisibleCount(6);
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
    setVisibleCount(prev => prev + 6);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem(product);
  };

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SmileyFace className="w-24 h-24 top-20 left-10 animate-float z-20 text-secondary opacity-60" />
      <SmileyFace className="w-16 h-16 top-60 right-20 animate-float-reverse z-20 text-primary opacity-60" />
      <SmileyFace className="w-32 h-32 top-[800px] left-1/4 animate-float opacity-30 text-secondary" />
      <SmileyFace className="w-20 h-20 bottom-[500px] right-10 animate-float-reverse z-20 text-primary opacity-50" />
      <SmileyFace className="w-12 h-12 top-[1200px] right-1/4 animate-float opacity-50 text-secondary" />
      <SmileyFace className="w-40 h-40 bottom-40 left-10 animate-float-reverse opacity-20 text-primary" />

      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] md:h-[600px] flex items-center overflow-hidden -mt-lg mb-xl rounded-xl shadow-sm bg-gradient-to-br from-[#FFF0F5] to-white group">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <SmileyFace className="w-40 h-40 -top-10 -left-10 animate-float opacity-30 text-secondary" />
          <SmileyFace className="w-64 h-64 -bottom-20 left-1/3 animate-float-reverse opacity-20 text-secondary" />
          <SmileyFace className="w-32 h-32 top-20 right-10 animate-float opacity-40 text-primary" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <div className="order-2 md:order-1 flex justify-center pb-xl md:pb-0">
            <img src="/images/logoml.png" alt="Medialoca" className="w-full max-w-sm md:max-w-md object-contain drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="order-1 md:order-2 flex flex-col items-center text-center md:items-start md:text-left pt-xl md:pt-0">
            <h2 className="font-display-lg text-[40px] leading-[48px] md:text-[56px] md:leading-[64px] text-on-surface mb-md">
              ¡Descubrí tu lado <br className="hidden md:block" /><span className="text-secondary font-bold">Vibrante!</span>
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-xl max-w-md">
              Tus medias dicen mucho de vos. Diseñamos colecciones únicas para que tu estilo destaque con mucha personalidad.
            </p>
            <a href="#catalog" className="px-xl py-md bg-secondary text-white rounded-full font-label-md text-label-md hover:bg-[#db1481] hover:scale-105 transition-all shadow-lg text-center uppercase tracking-wider font-bold">
              ¡Ver Colección!
            </a>
          </div>
        </div>
      </section>

      {/* Why Medialoca */}
      <section className="py-xl max-w-container-max mx-auto px-gutter overflow-hidden animate-on-scroll">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-square md:aspect-square rounded-xl overflow-hidden shadow-2xl relative z-10">
              <img src="/images/fotoprinci.png" alt="Logo Medialoca" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container rounded-full -z-0 opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-secondary-fixed rounded-full -z-0 opacity-30 blur-3xl"></div>
          </div>
          <div className="order-1 md:order-2">
            <span className="font-label-md text-label-md text-secondary tracking-widest mb-md block">NUESTRA IDENTIDAD</span>
            <h2 className="font-display-lg text-display-lg mb-md">¿Por qué <span className="text-primary">Medialoca</span>?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl leading-relaxed">
              Unas buenas medias hacen la diferencia. Trabajamos con materiales de excelente calidad, diseños modernos y una producción cuidada en cada detalle para ofrecer un producto cómodo, duradero y con identidad propia.
            </p>
            <div className="space-y-md">
              <div className="flex gap-md items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h5 className="font-title-md text-title-md">Diseños con estilo propio</h5>
                  <p className="font-body-md text-body-md text-on-surface-variant">No dejes que tu outfit quede incompleto.</p>
                </div>
              </div>
              <div className="flex gap-md items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h5 className="font-title-md text-title-md">Orgullosamente Uruguayos</h5>
                  <p className="font-body-md text-body-md text-on-surface-variant">Diseñadas y producidas localmente con prácticas éticas.</p>
                </div>
              </div>
              <div className="flex gap-md items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div>
                  <h5 className="font-title-md text-title-md">Diseños con personalidad</h5>
                  <p className="font-body-md text-body-md text-on-surface-variant">Modelos pensados para quienes buscan algo diferente sin exagerar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Catalog Header */}
      {/* Catalog Section */}
      <section className="py-xl animate-on-scroll">
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
      </section>

      {/* Main Grid Layout */}
      {loading ? (
        <div className="text-center py-xl">Cargando productos...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-lg animate-on-scroll">
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

          <div className="mt-xl flex justify-center pb-24 md:pb-xl">
            <Link
              to="/products"
              className="px-xl py-md bg-surface-container-high hover:bg-primary-container text-on-surface transition-all rounded-full font-label-md text-label-md">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Home;
