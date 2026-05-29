const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

// Usuarios
export const registrarUsuario = (datos: object) =>
  fetch(`${BASE_URL}/usuarios/registro/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then(res => res.json());

export const iniciarSesion = (datos: object) =>
  fetch(`${BASE_URL}/usuarios/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then(res => res.json());

// Productos
export const listarProductos = () =>
  fetch(`${BASE_URL}/productos/`).then(res => res.json());

export const listarProductosPorCategoria = (categoriaId: string) =>
  fetch(`${BASE_URL}/productos/categoria/${categoriaId}/`).then(res => res.json());

export const detalleProducto = (productoId: string) =>
  fetch(`${BASE_URL}/productos/${productoId}/`).then(res => res.json());

// Carrito
export const verCarrito = (usuarioId: string) =>
  fetch(`${BASE_URL}/carrito/${usuarioId}/`).then(res => res.json());

export const agregarAlCarrito = (usuarioId: string, productoId: string, cantidad: number) =>
  fetch(`${BASE_URL}/carrito/${usuarioId}/agregar/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productoId, quantity: cantidad }),
  }).then(res => res.json());

export const eliminarDelCarrito = (usuarioId: string, productoId: string) =>
  fetch(`${BASE_URL}/carrito/${usuarioId}/eliminar/${productoId}/`, {
    method: "DELETE",
  }).then(res => res.json());

// Pedidos
export const crearPedido = (usuarioId: string, shipping_address: string) =>
  fetch(`${BASE_URL}/pedidos/crear/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: usuarioId, shipping_address }),
  }).then(res => res.json());

// Recomendaciones
export const obtenerRecomendaciones = (usuarioId: string) =>
  fetch(`${BASE_URL}/recomendaciones/${usuarioId}/`).then(res => res.json());
