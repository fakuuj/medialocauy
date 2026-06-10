-- Elimina las tablas si existen
drop table if exists orders;
drop table if exists products;

-- 1. Tabla de Productos
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  collection text not null,
  image text not null,
  badge text,
  badge_color text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Pedidos (Orders)
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null,
  items jsonb not null,
  total_price numeric not null,
  payment_method text not null,
  status text default 'Pendiente' check (status in ('Pendiente', 'Pagado', 'Enviado', 'Cancelado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Políticas de Seguridad (RLS)
-- Productos: Todo el mundo puede verlos (SELECT), solo usuarios autenticados pueden modificarlos
alter table products enable row level security;

create policy "Productos son públicos para ver" 
  on products for select 
  using (true);

create policy "Admin puede insertar productos" 
  on products for insert 
  with check (auth.role() = 'authenticated');

create policy "Admin puede actualizar productos" 
  on products for update 
  using (auth.role() = 'authenticated');

create policy "Admin puede borrar productos" 
  on products for delete 
  using (auth.role() = 'authenticated');

-- Órdenes: Cualquiera puede crear (INSERT), pero solo admin puede ver, actualizar y borrar
alter table orders enable row level security;

create policy "Cualquiera puede crear ordenes" 
  on orders for insert 
  with check (true);

create policy "Admin puede ver ordenes" 
  on orders for select 
  using (auth.role() = 'authenticated');

create policy "Admin puede actualizar ordenes" 
  on orders for update 
  using (auth.role() = 'authenticated');

create policy "Admin puede borrar ordenes" 
  on orders for delete 
  using (auth.role() = 'authenticated');

-- 4. Setup Storage para las imágenes de los productos
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;

create policy "Imágenes públicas" 
  on storage.objects for select 
  using (bucket_id = 'product-images');

create policy "Admin puede subir imágenes" 
  on storage.objects for insert 
  with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');

create policy "Admin puede borrar imágenes" 
  on storage.objects for delete 
  using (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 5. Insertar datos iniciales
insert into products (name, price, collection, image, badge, badge_color, stock)
values
  ('Classic Stripes', 190, 'Esenciales', '/images/product1.png', 'Más Vendido', 'bg-secondary text-white', 100),
  ('Neon Vibes', 190, 'Limitado', '/images/product2.png', 'Nuevo', 'bg-primary text-white', 50),
  ('Eco Earth', 190, 'Sustentable', '/images/product3.png', null, null, 75),
  ('Retro Waves', 190, 'Casual', '/images/product4.png', null, null, 120),
  ('Sport Pro X', 190, 'Deportivo', '/images/product5.png', 'Sale', 'bg-error text-white', 30),
  ('Winter Cozy', 190, 'Invierno', '/images/product6.png', null, null, 80);
