# Guía de Deploy — SARA PRO

## Paso 1 — Crear el repositorio en GitHub

```bash
cd sara-web
git init
git add .
git commit -m "feat: SARA PRO v5.0 — versión web"
```

Ir a github.com → New repository → nombre: `sara-pro`
```bash
git remote add origin https://github.com/TU_USUARIO/sara-pro.git
git branch -M main
git push -u origin main
```

---

## Paso 2 — Deploy del Backend en Render

1. Ir a **render.com** → New → **Web Service**
2. Conectar tu repositorio de GitHub
3. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
4. Click **Create Web Service**
5. Esperar ~2 minutos. Copiar la URL que te da Render:
   - Ejemplo: `https://sara-pro-api.onrender.com`

---

## Paso 3 — Configurar la URL del backend en el frontend

Abrir `frontend/js/api.js` y cambiar la primera línea:

```js
// Antes:
const API = window.API_URL ?? 'http://localhost:8000'

// Después (pegar tu URL de Render):
const API = window.API_URL ?? 'https://sara-pro-api.onrender.com'
```

Hacer commit y push:
```bash
git add frontend/js/api.js
git commit -m "config: URL de producción del backend"
git push
```

---

## Paso 4 — Deploy del Frontend en GitHub Pages

1. En GitHub → tu repositorio → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Folder: `/frontend`
4. Click **Save**
5. En ~1 minuto el sitio estará en:
   `https://TU_USUARIO.github.io/sara-pro/`

---

## Notas importantes

### CORS en producción
Cuando tengas el dominio de GitHub Pages, en `backend/main.py` cambiar:
```python
# Línea allow_origins — reemplazar "*" por tu dominio exacto:
allow_origins=["https://TU_USUARIO.github.io"],
```

### Render duerme en plan gratuito
El plan free de Render "duerme" el servicio si no recibe tráfico por 15 minutos.
El primer request después del sueño tarda ~30 segundos. Para producción real,
considerar el plan Starter ($7/mes) o usar Railway.

### Actualizar datos (CSV)
Para agregar vehículos al CSV:
1. Editar `backend/data/vehiculos.csv`
2. `git add backend/data/vehiculos.csv`
3. `git commit -m "data: agregar modelos"`
4. `git push`
→ Render redeploya automáticamente.

### Desarrollo local
```bash
# Terminal 1 — backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — frontend (cualquiera de estas opciones)
cd frontend
python -m http.server 5500
# Abrir: http://localhost:5500
```
