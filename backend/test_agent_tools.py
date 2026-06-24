import sys
import logging

logging.disable(logging.CRITICAL)

from app.agents.tools import product_search, get_product_details

passed = 0
failed = 0


def check(label, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS: {label}")
    else:
        failed += 1
        print(f"  FAIL: {label}  -- {detail}")


# ── product_search ──────────────────────────────────────────────────

print("\n=== product_search ===\n")

# 1. Search by name
print("[1] Search by product name 'Green Tea'")
result = product_search.invoke({"query": "Green Tea", "store_id": "test_store"})
check("returns string", isinstance(result, str))
check("contains Organic Green Tea", "Organic Green Tea" in result, result[:200])
check("contains price 12.99", "12.99" in result, result[:200])
check("contains category Beverages", "Beverages" in result, result[:200])

# 2. Search by category
print("\n[2] Search by category 'Accessories'")
result = product_search.invoke({"query": "Accessories", "store_id": "test_store"})
check("returns string", isinstance(result, str))
check("contains Bamboo Water Bottle", "Bamboo Water Bottle" in result, result[:300])
check("contains Cotton Tote Bag", "Cotton Tote Bag" in result, result[:300])

# 3. Search by tag
print("\n[3] Search by tag 'eco-friendly'")
result = product_search.invoke({"query": "eco-friendly", "store_id": "test_store"})
check("returns string", isinstance(result, str))
check("contains Bamboo Water Bottle", "Bamboo Water Bottle" in result, result[:200])

# 4. Search by description keyword
print("\n[4] Search by description keyword 'lavender'")
result = product_search.invoke({"query": "lavender", "store_id": "test_store"})
check("returns string", isinstance(result, str))
check("contains Natural Soy Candle", "Natural Soy Candle" in result, result[:200])

# 5. Search with no match
print("\n[5] Search with no match 'xyznonexistent'")
result = product_search.invoke({"query": "xyznonexistent", "store_id": "test_store"})
check("returns no-results message", "No products found" in result, result[:200])

# 6. Search without store_id (global)
print("\n[6] Search without store_id (global search)")
result = product_search.invoke({"query": "Candle"})
check("returns string", isinstance(result, str))
check("contains Natural Soy Candle", "Natural Soy Candle" in result, result[:200])

# 7. Search with empty store_id
print("\n[7] Search with empty store_id string")
result = product_search.invoke({"query": "tea", "store_id": ""})
check("returns string", isinstance(result, str))
check("contains Organic Green Tea", "Organic Green Tea" in result, result[:200])

# 8. Search result limit
print("\n[8] Search 'organic' should return up to 5 results")
result = product_search.invoke({"query": "organic", "store_id": "test_store"})
check("returns string", isinstance(result, str))
lines = [l for l in result.strip().split("\n") if l.strip()]
check("returns at most 5 results", len(lines) <= 5, f"got {len(lines)}")
check("returns at least 1 result", len(lines) >= 1, f"got {len(lines)}")

# 9. Verify result format contains expected fields
print("\n[9] Verify result format")
result = product_search.invoke({"query": "Bamboo", "store_id": "test_store"})
check("contains ID:", "ID:" in result, result[:200])
check("contains Name:", "Name:" in result, result[:200])
check("contains Price:", "Price:" in result, result[:200])
check("contains Description:", "Description:" in result, result[:200])
check("contains Category:", "Category:" in result, result[:200])
check("contains Image:", "Image:" in result, result[:200])
check("contains URL:", "URL:" in result, result[:200])


# ── get_product_details ─────────────────────────────────────────────

print("\n=== get_product_details ===\n")

# 10. Get existing product
print("[10] Get existing product (ID=5, Organic Green Tea)")
result = get_product_details.invoke({"product_id": 5})
check("returns string", isinstance(result, str))
check("contains Organic Green Tea", "Organic Green Tea" in result, result[:200])
check("contains price 12.99", "12.99" in result, result[:200])
check("contains Beverages", "Beverages" in result, result[:200])
check("contains tags", "tea,organic,green tea,japanese" in result, result[:300])
check("contains Image:", "Image:" in result, result[:200])

# 11. Get another product
print("\n[11] Get product ID=7 (Cotton Tote Bag)")
result = get_product_details.invoke({"product_id": 7})
check("returns string", isinstance(result, str))
check("contains Cotton Tote Bag", "Cotton Tote Bag" in result, result[:200])
check("contains price 18.50", "18.50" in result, result[:200])
check("contains Accessories", "Accessories" in result, result[:200])

# 12. Get non-existent product
print("\n[12] Get non-existent product (ID=99999)")
result = get_product_details.invoke({"product_id": 99999})
check("returns not-found message", "not found" in result.lower(), result[:200])

# 13. Verify detail format includes Tags field
print("\n[13] Verify detail format includes Tags")
result = get_product_details.invoke({"product_id": 6})
check("contains Tags:", "Tags:" in result, result[:300])
check("contains bamboo tag", "bamboo" in result, result[:300])


# ── Summary ─────────────────────────────────────────────────────────

print(f"\n{'='*50}")
print(f"Results: {passed} passed, {failed} failed, {passed + failed} total")
print(f"{'='*50}\n")

sys.exit(1 if failed else 0)
