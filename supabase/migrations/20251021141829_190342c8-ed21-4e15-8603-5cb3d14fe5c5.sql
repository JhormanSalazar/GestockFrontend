-- Crear tabla de negocios
CREATE TABLE public.negocios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;

-- Crear tabla de usuarios de negocio (relación entre usuarios y negocios)
CREATE TABLE public.usuarios_negocio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  negocio_id UUID NOT NULL REFERENCES public.negocios(id) ON DELETE CASCADE,
  rol TEXT DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, negocio_id)
);

ALTER TABLE public.usuarios_negocio ENABLE ROW LEVEL SECURITY;

-- Crear tabla de almacenes
CREATE TABLE public.almacenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID NOT NULL REFERENCES public.negocios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  ubicacion TEXT,
  capacidad_maxima INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.almacenes ENABLE ROW LEVEL SECURITY;

-- Crear tabla de productos
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  almacen_id UUID NOT NULL REFERENCES public.almacenes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  sku TEXT,
  cantidad INTEGER DEFAULT 0 NOT NULL,
  precio_unitario DECIMAL(10,2),
  stock_minimo INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- RLS Policies para negocios
CREATE POLICY "Usuarios pueden ver sus negocios"
  ON public.negocios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios_negocio
      WHERE usuarios_negocio.negocio_id = negocios.id
      AND usuarios_negocio.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins pueden insertar negocios"
  ON public.negocios FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins pueden actualizar sus negocios"
  ON public.negocios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios_negocio
      WHERE usuarios_negocio.negocio_id = negocios.id
      AND usuarios_negocio.user_id = auth.uid()
      AND usuarios_negocio.rol = 'admin'
    )
  );

-- RLS Policies para usuarios_negocio
CREATE POLICY "Usuarios pueden ver sus relaciones"
  ON public.usuarios_negocio FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins pueden insertar usuarios"
  ON public.usuarios_negocio FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios_negocio un
      WHERE un.negocio_id = usuarios_negocio.negocio_id
      AND un.user_id = auth.uid()
      AND un.rol = 'admin'
    ) OR NOT EXISTS (
      SELECT 1 FROM public.usuarios_negocio
      WHERE negocio_id = usuarios_negocio.negocio_id
    )
  );

-- RLS Policies para almacenes
CREATE POLICY "Usuarios pueden ver almacenes de sus negocios"
  ON public.almacenes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios_negocio
      WHERE usuarios_negocio.negocio_id = almacenes.negocio_id
      AND usuarios_negocio.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins pueden crear almacenes"
  ON public.almacenes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios_negocio
      WHERE usuarios_negocio.negocio_id = almacenes.negocio_id
      AND usuarios_negocio.user_id = auth.uid()
      AND usuarios_negocio.rol = 'admin'
    )
  );

CREATE POLICY "Admins pueden actualizar almacenes"
  ON public.almacenes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios_negocio
      WHERE usuarios_negocio.negocio_id = almacenes.negocio_id
      AND usuarios_negocio.user_id = auth.uid()
      AND usuarios_negocio.rol = 'admin'
    )
  );

-- RLS Policies para productos
CREATE POLICY "Usuarios pueden ver productos de sus negocios"
  ON public.productos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.almacenes
      JOIN public.usuarios_negocio ON usuarios_negocio.negocio_id = almacenes.negocio_id
      WHERE almacenes.id = productos.almacen_id
      AND usuarios_negocio.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden crear productos"
  ON public.productos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.almacenes
      JOIN public.usuarios_negocio ON usuarios_negocio.negocio_id = almacenes.negocio_id
      WHERE almacenes.id = productos.almacen_id
      AND usuarios_negocio.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden actualizar productos"
  ON public.productos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.almacenes
      JOIN public.usuarios_negocio ON usuarios_negocio.negocio_id = almacenes.negocio_id
      WHERE almacenes.id = productos.almacen_id
      AND usuarios_negocio.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins pueden eliminar productos"
  ON public.productos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.almacenes
      JOIN public.usuarios_negocio ON usuarios_negocio.negocio_id = almacenes.negocio_id
      WHERE almacenes.id = productos.almacen_id
      AND usuarios_negocio.user_id = auth.uid()
      AND usuarios_negocio.rol = 'admin'
    )
  );

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_negocios_updated_at BEFORE UPDATE ON public.negocios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_almacenes_updated_at BEFORE UPDATE ON public.almacenes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();