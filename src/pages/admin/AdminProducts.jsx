import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [collection, setCollection] = useState('Esenciales');
  const [stock, setStock] = useState('0');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setPrice('');
    setCollection('Esenciales');
    setStock('0');
    setFile(null);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCollection(product.collection);
    setStock(product.stock.toString());
    setFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingId && !file) {
      alert('Debes seleccionar una imagen para un producto nuevo');
      return;
    }

    setIsSubmitting(true);
    try {
      let publicUrl = undefined;

      // 1. Subir imagen a storage si hay una nueva
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        publicUrl = data.publicUrl;
      }

      const productData = {
        name,
        price: Number(price),
        collection,
        stock: Number(stock),
      };
      if (publicUrl) productData.image = publicUrl;

      // 2. Insertar o actualizar producto en BD
      if (editingId) {
        const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert([productData]);
        if (insertError) throw insertError;
      }

      // Limpiar y recargar
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error guardando producto", error);
      alert('Error guardando el producto');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres borrar este producto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="font-headline-lg text-on-surface">Productos</h1>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-primary text-on-primary px-md py-sm rounded-full flex items-center gap-sm font-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
          <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg mb-lg shadow-sm">
          <h2 className="font-title-lg mb-md">{editingId ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-xs">Nombre</label>
              <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-xs">Precio</label>
              <input required type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-xs">Colección</label>
              <select value={collection} onChange={e=>setCollection(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary">
                {['Deportivo', 'Casual', 'Invierno', 'Sustentable', 'Esenciales', 'Limitado'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-xs">Stock Inicial</label>
              <input required type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-label-sm text-on-surface-variant mb-xs">Imagen {editingId && '(Opcional, dejar vacío para no cambiarla)'}</label>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} required={!editingId} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-sm" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button disabled={isSubmitting} type="submit" className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-md disabled:opacity-50">
                {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
        {products.map(product => (
          <div key={product.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col group">
            <div className="aspect-square bg-surface-container-low relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => handleEditClick(product)}
                className="absolute top-2 right-12 w-8 h-8 bg-surface text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Editar">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button 
                onClick={() => handleDelete(product.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
            <div className="p-md flex-grow flex flex-col">
              <p className="text-label-sm text-primary uppercase tracking-tighter">{product.collection}</p>
              <h3 className="font-title-md text-on-surface truncate">{product.name}</h3>
              <div className="flex justify-between items-center mt-auto pt-sm">
                <span className="font-title-md text-on-surface">${product.price}</span>
                <span className="text-label-sm text-on-surface-variant">Stock: {product.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
