from flask import Flask, jsonify, request

from recommendation_engine import normalize_brands, normalize_budget, recommend_products


app = Flask(__name__)


@app.route("/api/v2/recomendaciones/<usuario_id>", methods=["POST"])
def generar_recomendacion(usuario_id):
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser application/json"}), 400

    data = request.get_json()
    products = data.get("productos")

    if not isinstance(products, list):
        return jsonify({"error": "El campo 'productos' es obligatorio y debe ser una lista."}), 400

    try:
        budget = normalize_budget(data.get("presupuesto"))
    except (TypeError, ValueError):
        return jsonify({"error": "El campo 'presupuesto' debe ser un numero."}), 400

    usage_type = data.get("tipo_uso", "general")
    brands = normalize_brands(data.get("marcas_preferidas"))
    recommendations = recommend_products(products, brands, budget)

    return jsonify(
        {
            "usuario_id": usuario_id,
            "criterio": usage_type,
            "recomendaciones": recommendations,
            "total": len(recommendations),
        }
    ), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "recomendaciones-flask"}), 200


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "Ruta no encontrada."}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Error interno del servidor.", "detalle": str(error)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
