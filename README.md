# DevPortfolio — Portafolio Web Multiusuario

Proyecto Integrador — Programación y Plataformas Web  
Universidad Politécnica Salesiana · Período Marzo–Agosto 2026

**🌐 Demo en producción:** https://portafolio-web-f46e7.web.app

---

## Descripción

Aplicación web tipo portafolio profesional multiusuario que permite presentar perfiles de programadores, mostrar proyectos destacados y gestionar solicitudes de contacto entre usuarios externos y programadores.

## Arquitectura del sistema

```
Cliente (Navegador)
    │
    ▼
Angular (Frontend) ── localhost:4200
    │
    ├── Firebase Authentication  (login / registro / Google)
    ├── Cloud Firestore          (solicitudes de contacto)
    └── Strapi CMS REST API ──── localhost:1337
                                  (programadores, proyectos, servicios)
```

**Separación de responsabilidades:**

- **Angular** — interfaz de usuario, routing, consumo de APIs
- **Firebase Auth** — autenticación de usuarios externos y programadores (correo/contraseña y Google)
- **Cloud Firestore** — almacenamiento de solicitudes de contacto
- **Strapi CMS** — administración del contenido dinámico (sin panel propio en Angular)

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21 | Framework frontend |
| Firebase | 12 | Autenticación y base de datos |
| Strapi | 5 | CMS Headless |
| TypeScript | 5.9 | Lenguaje principal |
| SQLite | — | Base de datos local de Strapi |

## Estructura del proyecto

```
frontend/
└── src/app/
    ├── components/
    │   └── navbar/          # Navbar reutilizable
    ├── pages/
    │   ├── home/            # Página principal con todas las secciones
    │   ├── perfil/          # Perfil individual del programador
    │   └── solicitudes/     # Panel de solicitudes (programador y usuario)
    └── services/
        ├── auth.service.ts      # Firebase Authentication
        ├── solicitud.service.ts # Firestore CRUD
        ├── strapi.service.ts    # Consumo de Strapi REST API
        └── firebase.config.ts   # Configuración Firebase
```

## Rutas de la aplicación

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Home con secciones Hero, Equipo, Servicios, Proyectos y Contacto | Público |
| `/programador/:slug` | Perfil individual del programador con sus proyectos | Público |
| `/solicitudes` | Panel de solicitudes (vista diferente según rol) | Autenticado |

## Configuración y despliegue local

### Requisitos previos
- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)
- pnpm (`npm install -g pnpm`)

### 1. Levantar el backend (Strapi)

```bash
cd ruta/al/backend
npm run develop
```

Strapi quedará disponible en `http://localhost:1337`

**Configurar permisos en Strapi:**
1. Ir a `Settings → Users & Permissions → Roles → Public`
2. Activar `find` y `findOne` para: Programador, Proyecto, Servicio
3. Guardar

### 2. Levantar el frontend (Angular)

```bash
cd ruta/al/frontend
pnpm install
ng serve
```

La aplicación quedará disponible en `http://localhost:4200`

### Despliegue en Firebase Hosting

```bash
ng build --configuration production
firebase login
firebase init hosting  # public dir: dist/frontend/browser, SPA: y
firebase deploy
```

## Guía de usuario

### Usuario externo
1. Ingresar a la aplicación — puede explorar el portafolio sin iniciar sesión
2. Para enviar una solicitud: hacer clic en **Iniciar sesión** o **Registrarse**
3. Puede autenticarse con correo/contraseña o con **Google**
4. Solo usuarios externos pueden registrarse desde la app
5. Ir a la sección **Contacto**, llenar el formulario y seleccionar un programador
6. En **Mis solicitudes** puede ver el historial y las respuestas recibidas

### Programador
1. Su cuenta en Firebase es creada por el administrador o mediante Google
2. El correo de Firebase debe coincidir exactamente con el campo `correo` en Strapi
3. Al iniciar sesión, en **Mis solicitudes** verá las solicitudes recibidas
4. Puede responder cada solicitud y cambiar su estado a **Respondida**

### Administrador de contenido (Strapi)
1. Ingresar a `http://localhost:1337/admin`
2. Gestionar programadores en **Content Manager → Programador**
3. Gestionar proyectos en **Content Manager → Proyecto**
   - Marcar `destacado = true` para que aparezca en el Home
   - Relacionar el proyecto con uno o varios programadores
4. Gestionar servicios en **Content Manager → Servicio**
5. Publicar el contenido con el botón **Publish**

## Decisiones de diseño

- **Detección de rol sin campo extra en Firebase** — el sistema determina si un usuario es programador comparando su email con el campo `correo` de Strapi, evitando complejidad adicional en la autenticación.
- **Login con Google como extra** — implementado para programadores que usen cuentas institucionales Google, sin necesidad de crear usuarios manualmente en Firebase.
- **Lazy loading en rutas** — cada página se carga solo cuando se necesita, mejorando el rendimiento inicial.
- **Strapi v5 con SQLite** — base de datos local para facilitar el desarrollo sin dependencias externas.
- **Standalone components** — se usa la arquitectura moderna de Angular sin NgModules.

## Desafíos enfrentados

- **Strapi v5 cambia la estructura de respuesta** — los datos ya no vienen en `attributes` sino directamente en el objeto. Se creó un `StrapiService` con normalización para manejar ambos casos.
- **Rich text (blocks) de Strapi** — el campo `descripcionCompleta` devuelve un array de bloques en lugar de texto plano, requiriendo una función de extracción de texto.
- **Scroll en Angular SPA** — los enlaces de ancla del navbar requieren scroll programático con `scrollIntoView` en lugar de `href="#seccion"`.
- **Error 400 en Strapi v5** — el populate anidado con punto no es compatible, se resolvió usando parámetros `populate` separados.

---

**Docente:** Ing. Pablo Torres  
**Carrera:** Computación — UPS  
**Período:** Marzo–Agosto 2026
