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
  await page.waitForTimeout(1000);

    // Paso 6: Seleccionar Sucursal
  await page.locator('#select2-sales_note_branch_id-container').click();
  await page.locator('.select2-results__option', { hasText: 'Casa matriz' }).click();

  // Paso 7: Seleccionar Bodega
  await page.locator('#select2-sales_note_ware_house_id-container').click();
  await page.locator('.select2-results__option', { hasText: 'Bodega principal' }).click();

  // Paso 8: Seleccionar Documento Tributario
  await page.locator('#select2-sales_note_type_document_sii-container').click();
  await page.locator('.select2-results__option', { hasText: 'Factura Electrónica' }).click();

  // Paso 8: Seleccionar Cliente
  await page.locator('#select2-sales_note_customer_id-container').click();  // Abrir dropdown
  await page.locator('.select2-search__field').waitFor({ state: 'visible' });  // Esperar input visible
  await page.locator('.select2-search__field').fill('FALABELLA');  // Escribir cliente
  await page.locator('.select2-results__option', { hasText: 'FALABELLA' }).click();  // Seleccionar

  // Paso 9: Seleccionar moneda Pesos
  await page.locator('#select2-sales_note_currency-container').click();
  await page.locator('.select2-results__option', { hasText: 'Pesos' }).waitFor();
  await page.locator('.select2-results__option', { hasText: 'Pesos' }).click();

  // Paso 10: Seleccionar producto
  await page.locator('#select2-sales_note_e_document_products_attributes_0_product_id-container').click();
  await page.locator('.select2-search__field').fill('POLERA DRYFRES M/C HOMBRE BLANCA L');
  await page.locator('.select2-results__option', { hasText: 'POLERA DRYFRES M/C HOMBRE BLANCA L' }).first().click();

  // Paso 11: Ingresar cantidad 0
  const inputCantidad = page.locator('.js-e-document-quantity');
  await inputCantidad.first().waitFor({ state: 'visible', timeout: 5000 });
  await inputCantidad.first().fill('1');
  await page.waitForTimeout(500);

  // Handler del confirm (debe ir antes del click)
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Paso 12: Click en el botón Enviar
  await page.locator('button[type="submit"].btn.btn-primary').click();

  // Espera a que la página procese el envío
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Validar mensaje de éxito (ajusta el texto si es necesario)
  await expect(page.locator('#msg-div')).toContainText('Nota de venta creada');

  // Screenshot para depuración
  await page.screenshot({ path: 'nota_de_venta_result.png', fullPage: true });

  // Espera final para observar antes de cerrar
  await page.waitForTimeout(3000);
});