#!/usr/bin/env bash

set -euo pipefail

API_URL="${API_URL:-http://localhost:3000/api}"

PROWNER_EMAIL="victor@example.com"
PROWNER_PASSWORD="123456"

PRUNNER_EMAIL="hugo@example.com"
PRUNNER_PASSWORD="123456"

TEMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TEMP_DIR"

  unset PROWNER_TOKEN
  unset PRUNNER_TOKEN
  unset COMPLETED_WALK_ID
  unset PRUNNER_ID
}

trap cleanup EXIT

print_step() {
  echo
  echo "▶ $1"
}

assert_status() {
  local actual="$1"
  local expected="$2"
  local label="$3"

  if [ "$actual" != "$expected" ]; then
    echo "❌ $label — esperado HTTP $expected, recibido HTTP $actual"
    exit 1
  fi

  echo "✅ $label — HTTP $actual"
}

assert_json_value() {
  local file="$1"
  local expression="$2"
  local expected="$3"
  local label="$4"

  local actual
  actual="$(jq -r "$expression" "$file")"

  if [ "$actual" != "$expected" ]; then
    echo "❌ $label — esperado '$expected', recibido '$actual'"
    exit 1
  fi

  echo "✅ $label"
}

request() {
  local method="$1"
  local url="$2"
  local output_file="$3"
  shift 3

  curl -s \
    -o "$output_file" \
    -w "%{http_code}" \
    -X "$method" \
    "$url" \
    "$@"
}

print_step "Healthcheck"

HEALTH_FILE="$TEMP_DIR/health.json"

HEALTH_STATUS="$(request \
  GET \
  "$API_URL/health" \
  "$HEALTH_FILE")"

assert_status "$HEALTH_STATUS" "200" "Healthcheck"
assert_json_value "$HEALTH_FILE" '.data.status' 'ok' "Backend activo"
assert_json_value "$HEALTH_FILE" '.data.database' 'connected' "MongoDB conectado"

print_step "Login PROWNER"

PROWNER_LOGIN_FILE="$TEMP_DIR/prowner-login.json"

PROWNER_LOGIN_STATUS="$(request \
  POST \
  "$API_URL/auth/login" \
  "$PROWNER_LOGIN_FILE" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$PROWNER_EMAIL\",
    \"password\":\"$PROWNER_PASSWORD\"
  }")"

assert_status "$PROWNER_LOGIN_STATUS" "200" "Login PROWNER"

PROWNER_TOKEN="$(jq -r '.data.token' "$PROWNER_LOGIN_FILE")"

if [ -z "$PROWNER_TOKEN" ] || [ "$PROWNER_TOKEN" = "null" ]; then
  echo "❌ Token PROWNER no generado"
  exit 1
fi

echo "✅ Token PROWNER generado"

print_step "Login PRUNNER"

PRUNNER_LOGIN_FILE="$TEMP_DIR/prunner-login.json"

PRUNNER_LOGIN_STATUS="$(request \
  POST \
  "$API_URL/auth/login" \
  "$PRUNNER_LOGIN_FILE" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$PRUNNER_EMAIL\",
    \"password\":\"$PRUNNER_PASSWORD\"
  }")"

assert_status "$PRUNNER_LOGIN_STATUS" "200" "Login PRUNNER"

PRUNNER_TOKEN="$(jq -r '.data.token' "$PRUNNER_LOGIN_FILE")"

if [ -z "$PRUNNER_TOKEN" ] || [ "$PRUNNER_TOKEN" = "null" ]; then
  echo "❌ Token PRUNNER no generado"
  exit 1
fi

echo "✅ Token PRUNNER generado"

print_step "Perfil PROWNER"

PROWNER_PROFILE_FILE="$TEMP_DIR/prowner-profile.json"

PROWNER_PROFILE_STATUS="$(request \
  GET \
  "$API_URL/users/me" \
  "$PROWNER_PROFILE_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$PROWNER_PROFILE_STATUS" "200" "Perfil PROWNER"
assert_json_value "$PROWNER_PROFILE_FILE" '.data.role' 'PROWNER' "Rol PROWNER correcto"

print_step "Perros del PROWNER"

DOGS_FILE="$TEMP_DIR/dogs.json"

DOGS_STATUS="$(request \
  GET \
  "$API_URL/dogs" \
  "$DOGS_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$DOGS_STATUS" "200" "Listado de perros"

DOGS_COUNT="$(jq '.data | length' "$DOGS_FILE")"

if [ "$DOGS_COUNT" -lt 2 ]; then
  echo "❌ Se esperaban al menos 2 perros, encontrados: $DOGS_COUNT"
  exit 1
fi

echo "✅ Perros encontrados: $DOGS_COUNT"

print_step "Dashboard PROWNER"

PROWNER_DASHBOARD_FILE="$TEMP_DIR/prowner-dashboard.json"

PROWNER_DASHBOARD_STATUS="$(request \
  GET \
  "$API_URL/dashboard/prowner" \
  "$PROWNER_DASHBOARD_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$PROWNER_DASHBOARD_STATUS" "200" "Dashboard PROWNER"

assert_json_value \
  "$PROWNER_DASHBOARD_FILE" \
  '.data.dogs' \
  '2' \
  "Total de perros del PROWNER"

print_step "Área de servicio PRUNNER"

SERVICE_AREA_FILE="$TEMP_DIR/service-area.json"

SERVICE_AREA_STATUS="$(request \
  GET \
  "$API_URL/users/me/service-area" \
  "$SERVICE_AREA_FILE" \
  -H "Authorization: Bearer $PRUNNER_TOKEN")"

assert_status "$SERVICE_AREA_STATUS" "200" "Área de servicio PRUNNER"

assert_json_value \
  "$SERVICE_AREA_FILE" \
  '.data.serviceRadiusKm' \
  '10' \
  "Radio de servicio correcto"

print_step "Walks del PROWNER"

PROWNER_WALKS_FILE="$TEMP_DIR/prowner-walks.json"

PROWNER_WALKS_STATUS="$(request \
  GET \
  "$API_URL/walks" \
  "$PROWNER_WALKS_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$PROWNER_WALKS_STATUS" "200" "Walks del PROWNER"

COMPLETED_WALK_ID="$(
  jq -r '.data[] | select(.status == "completed") | .id' \
    "$PROWNER_WALKS_FILE" \
    | head -n 1
)"

if [ -z "$COMPLETED_WALK_ID" ]; then
  echo "❌ No se encontró un walk completed"
  exit 1
fi

echo "✅ Walk completed encontrado: $COMPLETED_WALK_ID"

print_step "Detalle del walk completado"

WALK_DETAIL_FILE="$TEMP_DIR/walk-detail.json"

WALK_DETAIL_STATUS="$(request \
  GET \
  "$API_URL/walks/$COMPLETED_WALK_ID" \
  "$WALK_DETAIL_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$WALK_DETAIL_STATUS" "200" "Detalle del walk"

assert_json_value \
  "$WALK_DETAIL_FILE" \
  '.data.status' \
  'completed' \
  "Estado completed correcto"

PRUNNER_ID="$(jq -r '.data.prunnerId' "$WALK_DETAIL_FILE")"

if [ -z "$PRUNNER_ID" ] || [ "$PRUNNER_ID" = "null" ]; then
  echo "❌ El walk completado no tiene PRUNNER asignado"
  exit 1
fi

echo "✅ PRUNNER asociado: $PRUNNER_ID"

print_step "Tracking del walk completado"

TRACKING_FILE="$TEMP_DIR/tracking.json"

TRACKING_STATUS="$(request \
  GET \
  "$API_URL/walks/$COMPLETED_WALK_ID/tracking" \
  "$TRACKING_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$TRACKING_STATUS" "200" "Tracking del walk"

TRACKING_COUNT="$(jq '.data | length' "$TRACKING_FILE")"

if [ "$TRACKING_COUNT" -lt 1 ]; then
  echo "❌ No se encontraron puntos de tracking"
  exit 1
fi

echo "✅ Puntos de tracking encontrados: $TRACKING_COUNT"

print_step "Fotos del walk completado"

PHOTOS_FILE="$TEMP_DIR/photos.json"

PHOTOS_STATUS="$(request \
  GET \
  "$API_URL/walks/$COMPLETED_WALK_ID/photos" \
  "$PHOTOS_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$PHOTOS_STATUS" "200" "Fotos del walk"

PHOTOS_COUNT="$(jq '.data | length' "$PHOTOS_FILE")"

if [ "$PHOTOS_COUNT" -lt 1 ]; then
  echo "❌ No se encontraron fotos"
  exit 1
fi

echo "✅ Fotos encontradas: $PHOTOS_COUNT"

print_step "Rating del PRUNNER"

RATING_FILE="$TEMP_DIR/rating.json"

RATING_STATUS="$(request \
  GET \
  "$API_URL/prunners/$PRUNNER_ID/rating" \
  "$RATING_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$RATING_STATUS" "200" "Rating del PRUNNER"

assert_json_value \
  "$RATING_FILE" \
  '.data.rating' \
  '5' \
  "Rating promedio correcto"

assert_json_value \
  "$RATING_FILE" \
  '.data.ratingsCount' \
  '1' \
  "Cantidad de ratings correcta"

print_step "Dashboard PRUNNER"

PRUNNER_DASHBOARD_FILE="$TEMP_DIR/prunner-dashboard.json"

PRUNNER_DASHBOARD_STATUS="$(request \
  GET \
  "$API_URL/dashboard/prunner" \
  "$PRUNNER_DASHBOARD_FILE" \
  -H "Authorization: Bearer $PRUNNER_TOKEN")"

assert_status "$PRUNNER_DASHBOARD_STATUS" "200" "Dashboard PRUNNER"

assert_json_value \
  "$PRUNNER_DASHBOARD_FILE" \
  '.data.completedWalks' \
  '1' \
  "Walks completados del PRUNNER"

assert_json_value \
  "$PRUNNER_DASHBOARD_FILE" \
  '.data.totalEarnings' \
  '120' \
  "Ingresos del PRUNNER"

print_step "Protección de roles"

FORBIDDEN_FILE="$TEMP_DIR/forbidden.json"

FORBIDDEN_STATUS="$(request \
  GET \
  "$API_URL/dashboard/prunner" \
  "$FORBIDDEN_FILE" \
  -H "Authorization: Bearer $PROWNER_TOKEN")"

assert_status "$FORBIDDEN_STATUS" "403" "PROWNER bloqueado en dashboard PRUNNER"

echo
echo "============================================"
echo "✅ Prun MVP v1 backend smoke test completed"
echo "============================================"
