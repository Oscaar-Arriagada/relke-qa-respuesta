import { test, expect } from '@playwright/test';

test('Flujo completo de creación de Nota de Venta', async ({ page }) => {
  // Paso 1: Ir al login
  await page.goto('/');

  // Paso 2: Hacer login
  await page.getByPlaceholder('Correo Electrónico').fill('qa_junior@relke.cl');
  await page.getByPlaceholder('Contraseña').fill('Demo123456!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.waitForLoadState('networkidle');

  // Paso 3: Click en el logo (home)
  await page.click('.navbar-brand');

  // Paso 4: Ir a Ventas
  await page.locator('a[href="/ventas"]').click();

  // Paso 5: Ir a nueva nota de venta
  await page.locator('a[href="/dtes/notas-venta/new"]').click();
  await page.waitForLoadState('networkidle');

  // Paso 6: Seleccionar Sucursal
  await page.locator('#select2-sales_note_branch_id-container').click();
  await page.locator('.select2-results__option', { hasText: 'Casa matriz' }).click();

  // Paso 7: Seleccionar Bodega
  await page.locator('#select2-sales_note_ware_house_id-container').click();
  await page.locator('.select2-results__option', { hasText: 'Bodega principal' }).click();

  // Paso 8: Seleccionar Documento Tributario
  await page.locator('#select2-sales_note_type_document_sii-container').click();
  await page.locator('.select2-results__option', { hasText: 'Factura Electrónica' }).click();

  // Paso 9: Seleccionar Cliente
  await page.locator('#select2-sales_note_customer_id-container').click();
  await page.locator('.select2-search__field').waitFor({ state: 'visible' });
  await page.locator('.select2-search__field').fill('FALABELLA');
  await page.locator('.select2-results__option', { hasText: 'FALABELLA' }).click();

  // Paso 10: Seleccionar moneda Pesos
  await page.locator('#select2-sales_note_currency-container').click();
  await page.locator('.select2-results__option', { hasText: 'Pesos' }).click();

  // Paso 11: Seleccionar producto
  await page.locator('#select2-sales_note_e_document_products_attributes_0_product_id-container').click();
  await page.locator('.select2-search__field').fill('POLERA DRYFRES M/C HOMBRE BLANCA L');
  await page.locator('.select2-results__option', { hasText: 'POLERA DRYFRES M/C HOMBRE BLANCA L' }).click();

  // Paso 12: Ingresar cantidad = 1
  const inputCantidad = page.locator('.js-e-document-quantity');
  await inputCantidad.first().waitFor({ state: 'visible' });
  await inputCantidad.first().fill('1');
  await page.waitForTimeout(2000);

  // Paso 13: Registrar handler para aceptar el diálogo que aparece con el submit
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
  await page.waitForTimeout(2000);

  // Paso 14: Esperar que el botón esté visible y habilitado antes de hacer click
  const btnEnviar = page.locator('button[type="submit"].btn.btn-primary');
  await expect(btnEnviar).toBeVisible();
  await expect(btnEnviar).toBeEnabled();

  // Click en Enviar
  await btnEnviar.click();

  // Paso 15: Esperar confirmación de éxito
  await expect(page.locator('#msg-div')).toContainText('Nota de venta creada');

  // Paso 16: Captura de pantalla para verificación
  //await page.screenshot({ path: 'nota_de_venta_result.png', fullPage: true });
});


test('No se debe permitir crear una nota sin productos', async ({ page }) => {
  // Paso 1: Ir a la página de login
  await page.goto('/');

  // Paso 2: Iniciar sesión
  await page.getByPlaceholder('Correo Electrónico').fill('qa_junior@relke.cl');
  await page.getByPlaceholder('Contraseña').fill('Demo123456!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.waitForLoadState('networkidle');

  // Paso 3: Navegar a Ventas > Nueva Nota de Venta
  await page.click('.navbar-brand');
  await page.locator('a[href="/ventas"]').click();
  await page.locator('a[href="/dtes/notas-venta/new"]').click();
  await page.waitForLoadState('networkidle');

  // Paso 4: Seleccionar datos básicos necesarios para la nota
  await page.locator('#select2-sales_note_branch_id-container').click();
  await page.locator('.select2-results__option', { hasText: 'Casa matriz' }).click();

  await page.locator('#select2-sales_note_ware_house_id-container').click();
  await page.locator('.select2-results__option', { hasText: 'Bodega principal' }).click();

  await page.locator('#select2-sales_note_customer_id-container').click();
  await page.locator('.select2-search__field').fill('FALABELLA');
  await page.locator('.select2-results__option', { hasText: 'FALABELLA' }).click();

  await page.locator('#select2-sales_note_currency-container').click();
  await page.locator('.select2-results__option', { hasText: 'Pesos' }).click();

  // Paso 5: Manejar confirm dialog (aunque no debería aparecer si no hay productos)
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Paso 6: Intentar enviar sin agregar productos
  await page.locator('button[type="submit"].btn.btn-primary').click();

  // Paso 7: Validar que aparece mensaje de error que requiere agregar producto
  // Usamos /producto/i para ignorar mayúsculas/minúsculas
  await expect(page.locator('.alert-danger')).toContainText(/producto/i);
});


test('Cerrar sesión correctamente', async ({ page }) => {
  // 1. Navegar a la página principal (o donde se esté logueado)
  await page.goto('/');

  // 2. (Opcional) Realizar login si es necesario para llegar al estado logueado
  await page.getByPlaceholder('Correo Electrónico').fill('qa_junior@relke.cl');
  await page.getByPlaceholder('Contraseña').fill('Demo123456!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.waitForLoadState('networkidle');

  // 3. Abrir el menú de usuario (que contiene "QA")
  await page.locator('a.dropdown-toggle-profile:has-text("QA")').click();

  // 4. Click en la opción "Salir"
  await page.locator('ul.dropdown-menu li a', { hasText: 'Salir' }).click();

  // 5. Verificar que redirige al login (o URL principal)
  await expect(page).toHaveURL('/ingresar');

  // 6. Validar que el formulario de login está visible
  await expect(page.getByPlaceholder('Correo Electrónico')).toBeVisible();
});