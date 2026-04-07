# SARA — Sistema de Análisis y Respuestas Automáticas

Aplicación web para asesores comerciales de concesionarias automotrices.

## Stack

| Capa      | Tecnología                        |
|-----------|-----------------------------------|
| Frontend  | HTML + CSS + JavaScript (vanilla) |
| Backend   | Python 3.11 + FastAPI             |
| Datos     | CSV + JSON (sin base de datos)    |
| Deploy    | GitHub Pages + Render             |

## Estructura

```
sara-web/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── app.css
│   └── js/
│       ├── api.js        ← comunicación con el backend
│       ├── scorecard.js  ← lógica de puntajes
│       ├── ui.js         ← renders de tabs
│       └── app.js        ← inicialización y eventos
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── data/
│       ├── vehiculos.csv
│       └── promociones.json
└── docs/
    └── DEPLOY.md
```

## Correr localmente

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend — simplemente abrir en el navegador
# o servir con cualquier servidor estático:
cd frontend
npx serve .     # si tenés node
python -m http.server 5500  # si no
```

Ver `docs/DEPLOY.md` para subir a GitHub Pages + Render.
