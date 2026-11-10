
const TOTAL_REQUESTS = 200;
const URL = 'http://localhost:3000/health';

async function runHealthCheck() {
  let successful = 0;
  let failed = 0;
  const statusCodes = {};

  const start = Date.now();

  console.log(`Iniciando prueba: ${TOTAL_REQUESTS} peticiones\n`);

  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    try {
      const response = await fetch(URL);

      statusCodes[response.status] =
        (statusCodes[response.status] || 0) + 1;

      if (response.ok) {
        successful++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      statusCodes['Error de conexión'] =
        (statusCodes['Error de conexión'] || 0) + 1;
    }
  }

  console.log('\n--- RESULTADOS ---');
  console.log(`Peticiones: ${TOTAL_REQUESTS}`);
  console.log(`Correctas: ${successful}`);
  console.log(`Fallidas: ${failed}`);
  console.log('Códigos HTTP:', statusCodes);
  console.log(`Tiempo: ${Date.now() - start} ms`);
}

runHealthCheck();
