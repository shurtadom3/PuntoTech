"""
recomendaciones-service/app.py
------------------------------
Microservicio Flask — Strangler Pattern
Extrae la lógica de RecomendacionService del monolito Django.
Recibe parámetros vía JSON y responde recomendaciones filtradas.
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


def _filtrar_productos(productos: list, marcas: list, presupuesto: float | None) -> list:
    resultado = []
    for p in productos:
        if marcas and p.get("marca") not in marcas:
            continue
        if presupuesto and p.get("precio", 0) > presupuesto:
            continue
        resultado.append(p)
    return resultado[:5]


@app.route("/api/v2/recomendaciones/<usuario_id>", methods=["POST"])
def generar_recomendacion(usuario_id):
    """
    Body esperado:
    {
        "tipo_uso": "gaming",
        "marcas_preferidas": "Samsung,Sony",
        "presupuesto": 5000000,
        "productos": [...]   <- lista enviada por Django (proxy)
    }
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser application/json"}), 400

    data = request.get_json()

    productos = data.get("productos")
    if not isinstance(productos, list):
        return jsonify({"error": "El campo 'productos' es obligatorio y debe ser una lista."}), 400

    marcas_raw = data.get("marcas_preferidas", "")
    marcas = [m.strip() for m in marcas_raw.split(",") if m.strip()] if marcas_raw else []

    presupuesto_raw = data.get("presupuesto")
    try:
        presupuesto = float(presupuesto_raw) if presupuesto_raw is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": "El campo 'presupuesto' debe ser un número."}), 400

    tipo_uso = data.get("tipo_uso", "general")

    recomendados = _filtrar_productos(productos, marcas, presupuesto)

    return jsonify({
        "usuario_id": usuario_id,
        "criterio": tipo_uso,
        "recomendaciones": recomendados,
        "total": len(recomendados),
    }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "recomendaciones-flask"}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Ruta no encontrada."}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)