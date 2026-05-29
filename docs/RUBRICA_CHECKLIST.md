# Checklist de Rubrica

Este archivo deja la evidencia de entrega sin reemplazar el README principal.

| Requerimiento | Evidencia |
|---|---|
| Docker Compose | `docker-compose.yml` orquesta Django, Flask, Nginx, PostgreSQL, Redis, Celery y Frontend. |
| AWS Academy EC2 | Ver `docs/AWS_EC2_DESPLIEGUE.md`. |
| Strangler Pattern | Nginx envia `/api/v2/recomendaciones/` al microservicio Flask. |
| API Gateway | `nginx/nginx.conf` enruta frontend, Django y Flask. |
| Servicio JSON propio | `GET /api/integracion/catalogo/`. |
| Servicio aliado | `GET /api/integracion/aliado/catalogo/` usando `ALLIED_SERVICE_URL`. |
| API externa Adapter | `GET /api/integracion/tasa-cambio/?from=USD&to=COP`. |
| Message Broker | Redis + Celery en `docker-compose.yml` y `backend/api/tasks.py`. |
| i18n | `LocaleMiddleware`, `LANGUAGES` y `backend/locale/`. |

## Comandos de Sustentacion

```bash
docker compose up --build -d
docker compose ps
curl http://localhost/api/health/
curl http://localhost/flask/health
curl http://localhost/api/integracion/catalogo/
curl http://localhost/api/integracion/aliado/catalogo/
curl "http://localhost/api/integracion/tasa-cambio/?from=USD&to=COP"
```
