# Despliegue en AWS Academy EC2

1. Crear una instancia Linux y abrir los puertos `22` y `80`.
2. Instalar Docker, Compose y Git.
3. Clonar el repositorio.
4. Copiar `.env.example` a `.env` en la raiz.
5. Configurar:

```env
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,django,<EC2_PUBLIC_IP>
CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1,http://<EC2_PUBLIC_IP>
ALLIED_SERVICE_URL=http://<SERVICIO_ALIADO>
```

6. Levantar el stack:

```bash
docker compose up --build -d
docker compose ps
```

7. Probar:

```bash
curl http://<EC2_PUBLIC_IP>/api/health/
curl http://<EC2_PUBLIC_IP>/flask/health
curl "http://<EC2_PUBLIC_IP>/api/integracion/tasa-cambio/?from=USD&to=COP"
```
