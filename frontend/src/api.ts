const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

export interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  description?: string;
  available_stock: number | null;
}

export interface AlliedCatalog {
  items?: ApiProduct[];
  message?: string;
  source?: string;
  service?: string;
}

export interface ExchangeRate {
  provider?: string;
  from: string;
  to: string;
  rate: string | number;
  date?: string;
}

const requestJson = async <T = unknown>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw data;
  }

  return data as T;
};

// Usuarios
export const registrarUsuario = (datos: object) =>
  requestJson("/usuarios/registro/", {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const iniciarSesion = (datos: object) =>
  requestJson("/usuarios/login/", {
    method: "POST",
    body: JSON.stringify(datos),
  });

// Productos
export const listarProductos = () =>
  requestJson<ApiProduct[]>("/productos/");

export const listarProductosPorCategoria = (categoriaId: string) =>
  requestJson(`/productos/categoria/${categoriaId}/`);

export const detalleProducto = (productoId: string) =>
  requestJson(`/productos/${productoId}/`);

// Carrito
export const verCarrito = (usuarioId: string) =>
  requestJson(`/carrito/${usuarioId}/`);

export const agregarAlCarrito = (usuarioId: string, productoId: string, cantidad: number) =>
  requestJson(`/carrito/${usuarioId}/agregar/`, {
    method: "POST",
    body: JSON.stringify({ product_id: productoId, quantity: cantidad }),
  });

export const eliminarDelCarrito = (usuarioId: string, productoId: string) =>
  requestJson(`/carrito/${usuarioId}/eliminar/${productoId}/`, {
    method: "DELETE",
  });

// Pedidos
export const crearPedido = (usuarioId: string, shipping_address: string) =>
  requestJson("/pedidos/crear/", {
    method: "POST",
    body: JSON.stringify({ user_id: usuarioId, shipping_address }),
  });

export const crearPedidoDesdeItems = (
  usuarioId: string,
  shipping_address: string,
  items: { product_id: string; quantity: number }[]
) =>
  requestJson("/pedidos/crear/", {
    method: "POST",
    body: JSON.stringify({ user_id: usuarioId, shipping_address, items }),
  });

// Recomendaciones
export const obtenerRecomendaciones = (usuarioId: string) =>
  requestJson(`/recomendaciones/${usuarioId}/`);

// Integraciones
export const obtenerCatalogoPublico = () =>
  requestJson<AlliedCatalog>("/integracion/catalogo/");

export const obtenerCatalogoAliado = () =>
  requestJson<AlliedCatalog>("/integracion/aliado/catalogo/");

export const obtenerTasaCambio = (from = "USD", to = "COP") =>
  requestJson<ExchangeRate>(`/integracion/tasa-cambio/?from=${from}&to=${to}`);
