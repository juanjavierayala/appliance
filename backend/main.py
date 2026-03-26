from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv, json, os
from datetime import datetime, date
from typing import Optional

app = FastAPI(title="SARA PRO API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR   = os.path.dirname(__file__)
CSV_PATH   = os.path.join(BASE_DIR, "data", "vehiculos.csv")
PROMO_PATH = os.path.join(BASE_DIR, "data", "promociones.json")


# ── helpers ─────────────────────────────────────────────────────
def cargar_vehiculos() -> dict:
    db = {}
    with open(CSV_PATH, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            clean = {k: v for k, v in r.items() if k}
            db[clean["modelo"].lower()] = clean
    return db

def cargar_promos() -> dict:
    if os.path.exists(PROMO_PATH):
        with open(PROMO_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {}

def guardar_promos(data: dict):
    with open(PROMO_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def promo_vigente(p: dict) -> bool:
    hasta = p.get("hasta", "")
    if not hasta:
        return True
    try:
        return datetime.strptime(hasta, "%Y-%m-%d").date() >= date.today()
    except Exception:
        return True

def promos_de(modelo: str, db: dict, pj: dict) -> list:
    m, resultado = modelo.lower(), []
    for p in pj.get(m, []):
        resultado.append({**p, "fuente": "form"})
    if m not in db:
        return resultado
    p_data = db[m]
    txt = p_data.get("promo_modelo", "").strip()
    if txt:
        resultado.append({"descripcion": txt, "fuente": "csv_modelo", "hasta": ""})
    marca, vistos = p_data.get("marca", "").lower(), set()
    for otros in db.values():
        if otros.get("marca", "").lower() == marca:
            txt_m = otros.get("promo_marca", "").strip()
            if txt_m and txt_m not in vistos:
                vistos.add(txt_m)
                resultado.append({
                    "descripcion": txt_m,
                    "fuente": "csv_marca",
                    "hasta": "",
                    "_marca": otros.get("marca","").upper()
                })
    return resultado


# ── MODELO CORREGIDO (CLAVE DEL ERROR) ──────────────────────────
class PromoCreate(BaseModel):
    cuotas: Optional[str] = None
    bonificacion: Optional[str] = None
    descripcion: Optional[str] = None
    hasta: Optional[str] = None


# ── endpoints ───────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "SARA PRO API online"}

@app.get("/vehiculos/automotor")
def get_automotor():
    db = cargar_vehiculos()
    return [v for v in db.values() if v.get("concesionaria") == "automotor"]

@app.get("/vehiculos/competencia/{modelo_base}")
def get_competencia(modelo_base: str):
    db = cargar_vehiculos()
    m  = modelo_base.lower()
    if m not in db:
        raise HTTPException(404, "Modelo no encontrado")
    seg = db[m]["segmento"]
    return [v for v in db.values()
            if v["segmento"] == seg and v["concesionaria"] != "automotor"]

@app.get("/vehiculos/{modelo}")
def get_vehiculo(modelo: str):
    db = cargar_vehiculos()
    m  = modelo.lower()
    if m not in db:
        raise HTTPException(404, "Modelo no encontrado")
    return db[m]

@app.get("/comparar")
def comparar(m1: str, m2: str):
    db = cargar_vehiculos()
    a, b = m1.lower(), m2.lower()
    if a not in db:
        raise HTTPException(404, f"Modelo '{m1}' no encontrado")
    if b not in db:
        raise HTTPException(404, f"Modelo '{m2}' no encontrado")
    return {"modelo1": db[a], "modelo2": db[b]}

@app.get("/promociones/{modelo}")
def get_promociones(modelo: str):
    db  = cargar_vehiculos()
    pj  = cargar_promos()
    lst = promos_de(modelo, db, pj)
    return {
        "modelo":   modelo.lower(),
        "vigentes": [p for p in lst if promo_vigente(p)],
        "vencidas": [p for p in lst if not promo_vigente(p)],
    }

@app.post("/promociones/{modelo}")
def agregar_promocion(modelo: str, promo: PromoCreate):
    if not any([promo.cuotas, promo.bonificacion, promo.descripcion]):
        raise HTTPException(400, "Al menos un campo debe tener contenido.")

    if promo.hasta:
        try:
            datetime.strptime(promo.hasta, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(400, "Formato de fecha inválido. Usar AAAA-MM-DD.")

    pj = cargar_promos()
    k  = modelo.lower()

    if k not in pj:
        pj[k] = []

    data = promo.dict(exclude_none=True)  # 🔥 clave corregida
    pj[k].append(data)

    guardar_promos(pj)
    return {"ok": True, "total": len(pj[k])}

@app.delete("/promociones/{modelo}/{idx}")
def eliminar_promocion(modelo: str, idx: int):
    pj  = cargar_promos()
    k   = modelo.lower()
    lst = pj.get(k, [])

    if idx < 0 or idx >= len(lst):
        raise HTTPException(404, "Índice no válido.")

    lst.pop(idx)
    pj[k] = lst
    guardar_promos(pj)

    return {"ok": True, "restantes": len(lst)}
