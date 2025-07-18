# Test Automatizado Playwright - Validación Nota de Venta sin Productos

Este proyecto contiene un test automatizado utilizando [Playwright](https://playwright.dev/) para validar que **Flujo completo de creación de Nota de Venta, no se permite crear una nota de venta sin agregar productos y Cerrar sesión correctamente** en la plataforma.

---

## 🧪 Cómo ejecutar la prueba

### 1. Instalar dependencias

Primero, asegúrate de tener Node.js instalado, luego ejecuta:

```bash
npm install
npm install -D @playwright/test
npx playwright install
npx playwright install chromium
```

### 2. Ejecutar el test

Usa el siguiente comando para ejecutar el test:

```bash
npx playwright test o npx playwright test --headed
```

> Asegúrate de que el entorno esté disponible y accesible en el navegador que Playwright abre (por ejemplo, https://demo.relbase.cl o la URL correspondiente al entorno QA).

---

## ✅ Validaciones realizadas

- Inicio de sesión con un usuario válido (`qa_junior@relke.cl`).
- Acceso al módulo de ventas y creación de una nueva nota de venta.
- Selección de datos obligatorios:
  - Sucursal (`Casa matriz`)
  - Bodega (`Bodega principal`)
  - Cliente (`FALABELLA`)
  - Moneda (`Pesos`)
- **Validación principal:** al hacer clic en el botón **"Enviar"** sin agregar ningún producto, se espera que aparezca un mensaje de error o validación que indique que falta agregar productos.

Se valida específicamente que exista un mensaje de error en pantalla que contenga la palabra `producto`.

---

## ⚠️ Desafíos o decisiones tomadas

- **Identificación del botón de envío:** Fue necesario usar el selector `button[type="submit"].btn.btn-primary` para garantizar que se haga clic en el botón correcto que ejecuta la acción de envío de la nota.
- **Manejo de Select2:** Las cajas desplegables como sucursal, bodega y cliente utilizan Select2, por lo que se manipuló el DOM directamente simulando clics y búsquedas.
- **Confirmaciones automáticas:** Se omitió la confirmación del `onclick="return confirm(...)"` del botón para simular de manera eficiente el flujo de prueba automatizado.

---

## 📁 Estructura del proyecto

```
tests/
├── nota-venta.spec.ts      # Test automatizado principal
README.md                   # Este archivo
```

---

## 📌 Requisitos previos

- Node.js v16+
- Navegador compatible (Chromium, Firefox o WebKit)
- Acceso a la URL de pruebas

---
