# Correcciones Entrega 1

Este archivo deja trazabilidad explicita para la rubrica. Reemplazar la columna "Observacion recibida" con el texto exacto de la retroalimentacion del profesor cuando lo tengan.

| Observacion recibida | Correccion aplicada | Evidencia |
|---|---|---|
| Completar arquitectura de despliegue | Se documento Nginx como gateway, Django como monolito, Flask como microservicio, Postgres como BD y Redis/Celery como broker/worker. | `README.md`, `docker-compose.yml`, `nginx/nginx.conf` |
| Orquestar dependencias completas | Se agregaron servicios Docker para Postgres, Redis, Celery worker, frontend, Django, Flask y Nginx. | `docker-compose.yml` |
| Evitar SQLite como unica BD de despliegue | Django usa Postgres en Docker y conserva SQLite solo como fallback local. | `backend/config/settings.py` |
| Evidenciar integraciones | Se agregaron endpoints JSON propios, consumo de aliado y adapter para API externa. | `backend/api/infra/`, `backend/api/urls.py` |
| Internacionalizacion | Se habilito `LocaleMiddleware`, `LANGUAGES`, `LOCALE_PATHS` y catalogos gettext. | `backend/config/settings.py`, `backend/locale/` |

Pendiente operativo: anexar capturas o enlace de AWS Academy cuando se despliegue en EC2 con IP elastica.
