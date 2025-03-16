#!/bin/bash
echo "Instalando Puppeteer..."
npm install puppeteer
echo "Capturando a tela..."
node screenshot.js
echo "Screenshot salva como ficha.png"
