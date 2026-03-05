const BASE_URL = "http://127.0.0.1:8000/api";

// Usuarios
export const registrarUsuario = (datos: object) =>
  fetch(`${BASE_URL}/usuarios/registro/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then(res => res.json());

// Productos
export const listarProductos = (categoriaId: string) =>
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
    body: JSON.stringify({ producto_id: productoId, cantidad }),
  }).then(res => res.json());

// Pedidos
export const crearPedido = (usuarioId: string, direccion: string) =>
  fetch(`${BASE_URL}/pedidos/crear/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId, direccion_envio: direccion }),
  }).then(res => res.json());

// Recomendaciones
export const obtenerRecomendaciones = (usuarioId: string) =>
  fetch(`${BASE_URL}/recomendaciones/${usuarioId}/`).then(res => res.json());