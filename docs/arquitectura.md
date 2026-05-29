# Arquitectura Actualizada

```mermaid
flowchart LR
    U["Usuario / navegador"] --> EIP["IP elastica AWS Academy"]
    EIP --> N["Nginx gateway :80"]
    N --> F["Frontend React servido por Nginx"]
    N --> D["Django REST monolito :8000"]
    N --> R["Flask recomendaciones :5000"]
    D --> P[("PostgreSQL")]
    D --> Q[("Redis broker")]
    Q --> C["Celery worker"]
    C --> D
    D --> A["Servicio JSON equipo aliado"]
    D --> X["API externa de tasa de cambio via Adapter"]
```

## Rutas principales

| Ruta | Destino |
|---|---|
| `/` | Frontend React |
| `/api/` | Django REST |
| `/api/v2/recomendaciones/` | Microservicio Flask por Strangler Pattern |
| `/flask/health` | Health check Flask |
| `/static/` | Archivos estaticos de Django |

## Servicios Docker

| Servicio | Responsabilidad |
|---|---|
| `nginx` | Gateway publico |
| `frontend` | Build estatico de React |
| `django` | API principal |
| `flask-recomendaciones` | Microservicio extraido |
| `db` | PostgreSQL |
| `redis` | Message broker |
| `celery-worker` | Tareas asincronas de notificacion |
