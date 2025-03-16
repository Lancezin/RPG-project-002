const puppeteer = require('puppeteer');

(async () => {
  // Abre o navegador
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Acessa o endereço do seu site – ajuste se necessário
  await page.goto('http://localhost:5500');

  // Captura a página inteira e salva como "ficha.png"
  await page.screenshot({ path: 'ficha.png', fullPage: true });

  await browser.close();
  console.log("Screenshot salva como ficha.png");
})();
