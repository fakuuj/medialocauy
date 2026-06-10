import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Layout = () => {
  const cartCount = useCartStore((state) => state.getCartCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          const input = el.querySelector('input[type="text"]');
          if (input) input.focus();
        }
      }, 100);
    } else {
      const el = document.getElementById('catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const input = el.querySelector('input[type="text"]');
        if (input) input.focus();
      }
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-secondary bg-gradient-to-r from-secondary to-primary text-white text-center py-xs px-gutter font-label-sm text-label-sm font-bold tracking-widest uppercase w-full flex flex-col md:flex-row justify-center items-center gap-2">
        <span>📦 Envíos a todo el Uruguay</span>
        <span className="hidden md:inline">|</span>
        <span>10% OFF con Transferencia</span>
      </div>

      <header className="bg-white/70 dark:bg-inverse-surface/80 backdrop-blur-xl border-b border-white/20 font-title-md text-title-md docked full-width top-0 sticky z-50 transition-all duration-300">
        <div className="flex justify-between items-center px-gutter py-sm w-full max-w-container-max mx-auto">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display-lg text-[24px] md:text-display-lg tracking-tighter text-primary dark:text-primary-fixed hover:scale-105 transition-transform">
            MEDIA<span className="text-secondary dark:text-secondary-fixed">LOCA</span>
          </Link>

          <div className="flex items-center gap-md">
            <button className="hidden md:flex scale-95 hover:scale-110 active:scale-90 transition-transform text-on-surface dark:text-white">
              <span className="material-symbols-outlined text-[28px]">search</span>
            </button>
            <Link to="/checkout" className="scale-95 hover:scale-110 active:scale-90 transition-transform text-on-surface dark:text-white flex items-center gap-2">
              <span className="font-title-md font-bold text-secondary dark:text-secondary-fixed">
                $ {cartTotal.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="relative">
                <span className="material-symbols-outlined text-[28px] text-secondary dark:text-secondary-fixed">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter py-lg pb-32 md:pb-lg min-h-screen">
        <Outlet />
      </main>

      <footer className="bg-surface-container-low dark:bg-surface-container-lowest full-width py-xl px-gutter mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-container-max mx-auto">
          <div>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block font-title-md text-title-md font-bold text-primary mb-md">
              MEDIA<span className="text-secondary dark:text-secondary-fixed">LOCA</span>
            </Link>
            <p className="text-on-surface-variant font-body-md text-body-md">© 2026 Medialoca Uruguay. Medias Premium. Esenciales elevados para el estilo de vida moderno.</p>
          </div>
          <div className="flex flex-col gap-sm">
            <Link to="/about" className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">Sobre la marca</Link>
            <Link to="/faq" className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">Preguntas Frecuentes</Link>
            <Link to="/shipping" className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">Información de envíos</Link>
            <Link to="/returns" className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">Cambios y devoluciones</Link>
            <Link to="/contact" className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">Contacto</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <a href="#" className="text-secondary dark:text-secondary-fixed underline font-body-md text-body-md">Soporte por WhatsApp</a>
            <div className="flex gap-md mt-sm">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">face_nod</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">camera</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">alternate_email</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-xl pt-lg border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">
            Trabajado por <a href="https://fstudio.uy" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:opacity-80 transition-opacity">fstudio.uy</a>
          </p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-sm pb-md pt-xs bg-surface/90 dark:bg-surface-container-highest/90 backdrop-blur-lg shadow-lg z-50 rounded-t-xl">
        <Link to="/" className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all duration-300 ${location.pathname === '/' ? 'bg-primary-container text-on-primary-container scale-105' : 'text-on-surface-variant hover:bg-primary-container/50'}`}>
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-label-sm text-label-sm">Tienda</span>
        </Link>
        <button onClick={handleSearchClick} className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all duration-300 text-on-surface-variant hover:bg-primary-container/50`}>
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm">Buscar</span>
        </button>
        <Link to="/checkout" className={`flex flex-col items-center justify-center relative rounded-full px-4 py-1 transition-all duration-300 ${location.pathname === '/checkout' ? 'bg-primary-container text-on-primary-container scale-105' : 'text-on-surface-variant hover:bg-primary-container/50'}`}>
          <span className="material-symbols-outlined">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 bg-secondary text-on-secondary text-[10px] w-3 h-3 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
          <span className="font-label-sm text-label-sm">Bolsa</span>
        </Link>
      </nav>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/59898847741" target="_blank" rel="noopener noreferrer" className="fixed bottom-24 md:bottom-gutter right-gutter z-[60] group">
        <div className="relative flex items-center justify-center">
          <span className="absolute -top-12 right-0 bg-white dark:bg-surface-container-highest text-on-surface px-md py-xs rounded-lg shadow-lg font-label-md text-label-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¡Escríbenos!
          </span>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95">
            <svg className="w-8 h-8 md:w-10 md:h-10 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.834-2.527-2.921-2.641-.087-.114-.707-.939-.707-1.791 0-.852.446-1.271.605-1.442.158-.171.345-.214.46-.214.115 0 .23 0 .331.005.109.004.254-.042.398.302.145.344.496 1.208.539 1.294.043.087.072.188.014.302-.057.115-.086.187-.172.287-.086.1-.182.224-.26.3-.086.086-.176.18-.076.353.1.172.443.731.951 1.183.655.582 1.207.762 1.38.848.172.086.273.072.374-.043.101-.115.431-.502.546-.675.115-.172.23-.144.388-.086.158.058 1.006.474 1.179.56s.287.13.33.201c.043.072.043.417-.101.821z"></path>
            </svg>
          </div>
        </div>
      </a>
    </>
  );
};

export default Layout;
