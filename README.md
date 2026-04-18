# PuntoTech 🛒
 
E-commerce de tecnología con arquitectura monolito + microservicio, construido con Django, Flask, React y orquestado con Docker y Nginx.
 
---
 
## Tecnologías
 
| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend (monolito) | Django 5.2 + Django REST Framework |
| Microservicio | Flask 3.1 |
| Base de datos | SQLite3 |
| Reverse proxy | Nginx |
| Contenedores | Docker + Docker Compose |
 
---
 
## Arquitectura
 
```
Cliente (React :5173)
        │
        ▼
   Nginx :80
   ├── /api/*  ──────────────► Django :8000  (monolito)
   └── /api/v2/recomendaciones/ ► Flask :5000  (microservicio)
```
 
El proyecto aplica el **Strangler Fig Pattern**: el módulo de recomendaciones fue extraído del monolito Django a un microservicio Flask independiente. Ver [Wiki — Migración a Microservicios](../../wiki/Migración-a-Microservicios-(Strangler-Pattern)) para la justificación técnica completa.
 
---
 
## Estructura del Proyecto
 
```
PuntoTech/
├── backend/                   ← Monolito Django
│   ├── api/
│   │   ├── application/       ← Servicios (lógica de negocio)
│   │   ├── domain/            ← Builder pattern
│   │   ├── infra/             ← Factory + Email mock/real
│   │   ├── presentation/      ← Views + Serializers
│   │   └── models.py
│   ├── config/                ← Settings, URLs, WSGI
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── recomendation_service/     ← Microservicio Flask
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                  ← React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api.ts
│   └── package.json
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```
 
---
 
## Módulos del Backend
 
| Módulo | Responsabilidad |
|---|---|
| `UsuarioService` | Registro y actualización de perfil |
| `ProductoService` | Listado y detalle de productos |
| `StockService` | Validación, reserva y descuento de stock |
| `CarritoService` | Agregar, eliminar y calcular total del carrito |
| `PedidoService` | Creación de pedidos con patrón Builder |
| `RecomendacionService` | ~~Recomendaciones~~ → migrado a Flask |
 
---
 
## Endpoints
 
### Django — `/api/`
 
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health/` | Health check |
| POST | `/api/usuarios/registro/` | Registrar usuario |
| PUT | `/api/usuarios/{id}/perfil/` | Actualizar perfil |
| GET | `/api/productos/categoria/{id}/` | Listar por categoría |
| GET | `/api/productos/{id}/` | Detalle de producto |
| GET | `/api/carrito/{id}/` | Ver carrito |
| POST | `/api/carrito/{id}/agregar/` | Agregar producto |
| DELETE | `/api/carrito/{id}/eliminar/{prod_id}/` | Eliminar producto |
| POST | `/api/pedidos/crear/` | Crear pedido |
| GET | `/api/pedidos/{id}/` | Listar pedidos |
 
### Flask — `/api/v2/`
 
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v2/recomendaciones/{id}` | Generar recomendaciones |
| GET | `/flask/health` | Health check Flask |
 
---
 
## Correr el Proyecto
 
### Con Docker (recomendado)
 
```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd PuntoTech
 
# 2. Levantar todos los servicios
docker-compose up --build
 
# 3. Verificar que todo está corriendo
curl http://localhost/api/health/       # Django
curl http://localhost/flask/health      # Flask
```
 
### Frontend (desarrollo local)
 
```bash
cd frontend
npm install
npm run dev
```
 
Abre `http://localhost:5173`
 
---
 
## Probar el Microservicio de Recomendaciones
 
```bash
curl -X POST http://localhost/api/v2/recomendaciones/usuario-123 \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_uso": "gaming",
    "marcas_preferidas": "Samsung,Sony",
    "presupuesto": 5000000,
    "productos": [
      {"id": "1", "nombre": "Galaxy S24", "marca": "Samsung", "precio": 4299000},
      {"id": "2", "nombre": "WH-1000XM5", "marca": "Sony", "precio": 1499000}
    ]
  }'
```
 
**Respuesta esperada:**
```json
{
  "usuario_id": "usuario-123",
  "criterio": "gaming",
  "recomendaciones": [...],
  "total": 2
}
```
 
---
 
## Variables de Entorno
 
| Variable | Valores | Descripción |
|---|---|---|
| `ENV_TYPE` | `DEV` / `PROD` | `DEV` usa EmailMock, `PROD` usa EmailReal con SMTP |
| `SMTP_HOST` | string | Host SMTP (solo en PROD) |
| `SMTP_USER` | string | Usuario SMTP |
| `SMTP_PASS` | string | Contraseña SMTP |
| `ADMIN_EMAIL` | string | Email para alertas de stock bajo |
 
---
 
## Patrones de Diseño Aplicados
 
| Patrón | Dónde |
|---|---|
| **Builder** | `PedidoBuilder` — construye pedidos validados paso a paso |
| **Factory** | `NotificadorFactory` — decide entre `EmailReal` y `EmailMock` según el entorno |
| **Service Layer** | `application/services.py` — toda la lógica de negocio separada de las vistas |
| **Strangler Fig** | `RecomendacionService` extraído a microservicio Flask |
 
---
 
## Apagar el Stack
 
```bash
docker-compose down
```
