# WAKITOKYS - Sistema de Ticketera

Sistema de reserva de entradas con QR para el show de Wakitokys en Tanque Cultural.

## 🎯 Características

- ✅ Formulario público de reserva
- ✅ Generación automática de QR descargable
- ✅ Panel de escaneo en la entrada
- ✅ Búsqueda por nombre (backup si no tienen QR)
- ✅ Control de entradas ya usadas
- ✅ 100% gratis (Google Sheets + Vercel)
- ✅ Límite de 4 entradas por persona

## 📁 Archivos

- `index.html` - Form público de reserva
- `panel.html` - Panel de ingreso para la puerta
- `google-apps-script.js` - API en Google Apps Script
- `public/` - Carpeta con logos (wkty-negro.png, logo-negro.png)

## 🚀 Setup paso a paso

### 1. Crear Google Sheet

1. Andá a [Google Sheets](https://sheets.google.com)
2. Creá una hoja nueva
3. Renombrala "Tickets"
4. Agregá estos headers en la primera fila:

```
ID | Nombre | Email | Teléfono | Cantidad | Estado | Timestamp Reserva | Timestamp Uso
```

### 2. Configurar Google Apps Script

1. En tu Sheet, andá a **Extensiones > Apps Script**
2. Borrá todo el código que viene por defecto
3. Copiá y pegá el contenido de `google-apps-script.js`
4. Click en **Implementar > Nueva implementación**
5. Tipo: **Aplicación web**
6. Configuración:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
7. Click en **Implementar**
8. Copiá la **URL de la aplicación web** (la vas a necesitar en el paso siguiente)

### 3. Configurar los HTML

**En `index.html` (línea 227):**
```javascript
const SHEETS_API_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
```

Reemplazá con la URL que copiaste en el paso anterior.

**En `panel.html` (línea 328):**
```javascript
const SHEETS_API_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
const PASSWORD = 'wakitokys2026'; // Cambiá esto por tu contraseña
```

Reemplazá la URL y cambiá la contraseña por la que quieras usar.

### 4. Subir a GitHub

```bash
git init
git add .
git commit -m "Setup ticketera Wakitokys"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/wakitokys-tickets.git
git push -u origin main
```

**IMPORTANTE:** Asegurate de subir la carpeta `public/` con los logos.

### 5. Deploy en Vercel

1. Andá a [vercel.com](https://vercel.com)
2. Click en **New Project**
3. Importá tu repo de GitHub
4. Configuración:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - No hace falta Build Command ni Output Directory
5. Click en **Deploy**

Listo! Te va a dar dos URLs:
- `tu-proyecto.vercel.app` (form público)
- `tu-proyecto.vercel.app/panel.html` (panel de ingreso)

## 📱 Uso

### Para difundir (público)

Compartí la URL principal: `tu-proyecto.vercel.app`

La gente:
1. Llena el form
2. Descarga su QR automáticamente
3. Lo guarda para el día del show

### En la entrada (vos/staff)

Entrá a: `tu-proyecto.vercel.app/panel.html`

**Contraseña:** La que pusiste en el paso 3

**Opciones:**
- **Tab "Escanear QR"**: Escaneá el QR del celular de la persona
- **Tab "Buscar por nombre"**: Si no tiene QR, buscalo por nombre
- **Tab "Listado"**: Ver todas las reservas y estados

## 🔐 Seguridad

- El panel de ingreso está protegido con contraseña
- Los QR son IDs únicos no secuenciales
- Una vez usado, el ticket no se puede reusar
- Los datos quedan en tu Google Sheet privado

## 📊 Monitoreo

Durante el show vas a ver en el panel:
- Total de reservas
- Total de entradas reservadas
- Total de personas que ya ingresaron

## 🛠 Personalización

### Cambiar la info del evento

En `index.html` líneas 169-173:
```html
<p><strong>Evento:</strong> Presentación "¿A DÓNDE VA?"</p>
<p><strong>Fecha:</strong> 08 de Junio 2026 | 21hs</p>
<p><strong>Lugar:</strong> Tanque Cultural, CABA</p>
```

### Cambiar límite de entradas por persona

En `index.html` líneas 192-197, agregar más opciones o sacar opciones.

### Poner límite de aforo total

En `index.html` antes del `form.addEventListener('submit'...)`:

```javascript
// Verificar aforo antes de guardar
const AFORO_MAXIMO = 300; // Ajustá según tu evento

// En el submit, después de validar campos:
const totalReservadas = await getTotalReservadas();
if (totalReservadas + parseInt(cantidad) > AFORO_MAXIMO) {
    showError('No hay más entradas disponibles');
    return;
}
```

## ❓ Troubleshooting

**"Error al generar la entrada"**
- Revisá que la URL de Google Apps Script esté bien configurada
- Verificá que el Sheet tenga los headers correctos
- Asegurate que el script esté implementado como "Aplicación web"

**El scanner no funciona**
- El celular/tablet necesita tener cámara
- Tenés que dar permiso de acceso a la cámara
- Probá con otro navegador (Chrome funciona mejor)

**No se guardan los datos**
- Revisá los permisos del Google Apps Script
- En el Script, andá a Ver > Registros de ejecución para ver errores

## 💰 Costos

**TODO GRATIS:**
- Google Sheets: gratis
- Google Apps Script: gratis (hasta 20,000 requests/día)
- Vercel: gratis (hasta 100 GB bandwidth/mes)
- GitHub: gratis (repos públicos)

Para este tipo de evento, no vas a llegar ni cerca de los límites.

## 📞 Soporte

Cualquier cosa me mandás un mensaje.
