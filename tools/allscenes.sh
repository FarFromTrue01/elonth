#!/bin/bash
# Tüm hikâye sahnelerini otomatik oynatır, hata ve son durumu yazar. Kullanım: tools/allscenes.sh <çıktı_klasörü> [saniye]
OUT=${1:-/tmp/allscenes}; SEC=${2:-150}; mkdir -p $OUT
PORT=${PORT:-8790}
for s in p_crash p_wake p_village p_window c1_alley c1_selen c1_run c1_spar c1_harvest c1_guild c1_ceremony c1_walk c1_system; do
  echo "=== $s"
  PORT=$PORT TS=3 timeout $((SEC+120)) python3 tools/runscene.py $s $SEC $OUT/$s- 15 2>&1 | grep -v "CERT_AUTH" | tail -6
done
