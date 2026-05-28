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
 
El proyecto aplica el **Strangler Fig Pattern**: el módulo de recomendaciones fue extraído del monolito Django a un microservicio Flask independiente. 
 
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
| `RecomendacionService` |  → migrado a Flask |
 
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
 
## Instalación y Ejecución

### Requisitos Previos

- Python 3.13+
- Node.js 18+
- npm
- Docker y Docker Compose (opcional, solo para la versión containerizada)

### Opción 1: Desarrollo Local (Sin Docker)

#### Backend (Django)

```bash
# 1. Crear ambiente virtual
python -m venv venv
cd backend
# 2. Activar ambiente virtual
# En Windows:
.\venv\Scripts\Activate.ps1
# En Linux/Mac:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear archivo .env (basado en .env.example)
# Copiar backend/.env.example a backend/.env
copy .env.example .env

# 5. Ejecutar migraciones
..\venv\Scripts\python.exe manage.py migrate

# 6. Crear superusuario (opcional, para acceder a /admin)
..\venv\Scripts\python.exe manage.py createsuperuser

# 7. Ejecutar servidor de desarrollo
..\venv\Scripts\python.exe manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`
- API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`

#### Frontend (React)

```bash
# En otra terminal
cd frontend

# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

#### Microservicio de Recomendaciones (Flask - Opcional)

```bash
# En otra terminal
cd recomendation_service

# 1. Crear ambiente virtual
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Ejecutar servidor
python app.py
```

Estará disponible en: `http://localhost:5000/health`

### Opción 2: Con Docker Compose

#### Requisitos
- Docker instalado: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Docker Compose (viene incluido con Docker Desktop)

#### Pasos

```bash
# 1. Desde la raíz del proyecto
cd PuntoTech

# 2. Crear archivo .env en el backend (opcional, para emails reales)
# Copiar backend/.env.example a backend/.env y completar credenciales

# 3. Construir e iniciar todos los servicios
docker-compose up --build

# 4. Los servicios estarán disponibles en:
# Frontend: http://localhost:80 (o http://localhost/)
# Django API: http://localhost:80/api/
# Flask API: http://localhost:80/api/v2/
# Django Admin: http://localhost:8000/admin/ (acceso directo sin Nginx)
```

#### Detener los servicios

```bash
# Detener y eliminar contenedores
docker-compose down

# Detener sin eliminar datos
docker-compose stop
```

#### Verificar que está corriendo

```bash
# Verificar salud de Django
curl http://localhost/api/health/

# Verificar salud de Flask
curl http://localhost/flask/health
```
 
## Probar el Microservicio de Recomendaciones

> **Nota:** Los comandos `curl` son para **bash/Linux/Git Bash**. Si usas **PowerShell**, ver sección de PowerShell abajo.


### Con Docker Compose — Bash/Linux/Git Bash

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

### PowerShell (Windows)

```powershell
$body = @{
    tipo_uso = "gaming"
    marcas_preferidas = "Samsung,Sony"
    presupuesto = 5000000
    productos = @(
        @{id = "1"; nombre = "Galaxy S24"; marca = "Samsung"; precio = 4299000},
        @{id = "2"; nombre = "WH-1000XM5"; marca = "Sony"; precio = 1499000}
    )
} | ConvertTo-Json

# Desarrollo local (puerto 5000)
Invoke-WebRequest -Uri "http://localhost:5000/api/v2/recomendaciones/usuario-123" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body

# Con Docker Compose (puerto 80)
Invoke-WebRequest -Uri "http://localhost/api/v2/recomendaciones/usuario-123" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body
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
