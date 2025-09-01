# 🎬 TP6 Final Frontend

Frontend desarrollado con **React**, **Vite**, **TailwindCSS** y **React Router** para la gestión de usuarios, perfiles y películas (watchlist + importación desde TMDb).

🌐 **Deploy en Netlify:**  
tp6-front-nodo.netlify.app

---

## 📌 Requisitos

- [Node.js](https://nodejs.org/) v20 o superior  
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)  
- Backend en ejecución (local o deploy en Render)  

---

## ⚙️ Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/usuario/tp6-final-frontend.git
cd tp6-final-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 📦 Dependencias principales

- react → Librería de UI  
- react-dom → Renderizado en navegador  
- react-router-dom → Ruteo SPA  
- react-hook-form → Manejo de formularios  
- yup + @hookform/resolvers → Validaciones  
- axios → Cliente HTTP para conectar con el backend  
- react-toastify → Notificaciones  
- tailwindcss → Estilos utilitarios  
- daisyui (opcional) → Componentes predefinidos  

---

## 📦 Instalación de dependencias

```bash
npm install react react-dom react-router-dom axios react-hook-form yup @hookform/resolvers react-toastify tailwindcss daisyui
```

---

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

> Cambiar la URL si usás el backend deployado en Render.

---

## 🚀 Rutas principales

- `/auth/register` → Registro de usuario  
- `/auth/login` → Login con JWT  
- `/profiles` → Gestión de perfiles (crear, editar, eliminar, seleccionar)  
- `/movies` → Listado de películas con filtros, paginación y buscador  
- `/watchlist` → Películas guardadas por perfil  
- `/tmdb` → Importación de películas desde TMDb (modal)  

---

## 🧪 Flujo de uso

1. Registrar un usuario en `/auth/register`  
2. Iniciar sesión en `/auth/login`  
3. Crear o elegir un perfil en `/profiles`  
4. Navegar al listado de películas `/movies`  
5. Agregar a **watchlist** o importar desde **TMDb**  
6. Revisar tu **watchlist** en `/watchlist`  

---

## 📜 Notas

- El frontend consume directamente la API del backend (`VITE_API_URL`).  
- El token JWT se guarda en `localStorage`.  
- Se usa **react-toastify** para notificaciones y validaciones inline en formularios.  
- Proyecto listo para deploy en **Vercel** o similar.  
