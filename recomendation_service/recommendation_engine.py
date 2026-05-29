def normalize_brands(raw_brands: str | None) -> list[str]:
    if not raw_brands:
        return []
    return [brand.strip() for brand in raw_brands.split(",") if brand.strip()]


def normalize_budget(raw_budget) -> float | None:
    if raw_budget is None or raw_budget == "":
        return None
    return float(raw_budget)


def recommend_products(products: list[dict], brands: list[str], budget: float | None, limit: int = 5) -> list[dict]:
    recommendations = []

    for product in products:
        if brands and product.get("marca") not in brands:
            continue
        if budget is not None and float(product.get("precio", 0)) > budget:
            continue
        recommendations.append(product)

    return recommendations[:limit]
