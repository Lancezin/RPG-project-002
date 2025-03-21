// Declaração de variáveis originais
let inputs = [];
let atributos = ["Força", "Vigor", "Inteligência", "Presença", "Magia"];
let pontosDistribuir = 11;
let pontos = [0, 0, 0, 0, 0]; // Valores iniciais dos atributos
let circulos = []; // Armazena posições dos círculos
let resetButton; // Botão de reset
let salvarButton; // Botão de capturar tela
let classeSelect; // Caixa de seleção para a classe
let classeDescricao; // Texto para a descrição da classe

// Variáveis para HP, Sanidade e Esforço
let hp = 20;
let sanidade = 10;
let esforco = 5;

let imagemUrlInput; // Caixa de texto para o URL da imagem
let verificarImagemButton; // Botão "Verificar Imagem"
let imagemDisplay; // Exibindo a imagem ao lado direito

// Variável global para armazenar a URL da foto, se definida
let fotoUrl = "";

// Lista de 10 perícias com seus inputs e seus rótulos
let pericias = [
  "Atletismo",
  "Ocultismo",
  "Percepção",
  "Persuasão",
  "Medicina",
  "Programação",
  "Liderança",
  "Engenharia",
  "Investigação"
];
let periciasInputs = [];
let periciasLabels = []; // Array para armazenar os rótulos das perícias

function limitarPericias() {
  let total = 0;
  // Calcula o total atual de pontos gastos nas perícias
  for (let i = 0; i < periciasInputs.length; i++) {
    let value = parseInt(periciasInputs[i].value());
    if (isNaN(value)) value = 0;
    total += value;
  }
  
  // Valor do input que disparou o evento
  let currentValue = parseInt(this.value());
  if (isNaN(currentValue)) currentValue = 0;
  
  // Impede valores menores que 0 e maiores que 5
  if (currentValue < 0) {
    currentValue = 0;
    this.value(currentValue);
  }
  if (currentValue > 5) {
    currentValue = 5;
    this.value(currentValue);
  }
  
  // Recalcula o total sem o valor atual
  let sumWithoutCurrent = total - currentValue;
  let allowed = 8 - sumWithoutCurrent;
  allowed = max(allowed, 0);
  
  if (currentValue > allowed) {
    this.value(allowed);
    alert("Você excedeu o total de pontos disponíveis. Cada perícia tem limite de 5 pontos e o total para distribuir é 8.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Cria os campos de entrada para Nome e Idade
  criarCamposDeEntrada();
  
  // Define as posições dos círculos (atributos) em formato de pentágono
  let centroX = width / 2 + 150;  
  let centroY = 250;  
  let raio = 150;
  
  circulos = [];
  for (let i = 0; i < atributos.length; i++) {
    let angle = TWO_PI / 5 * i - PI / 2;
    let x = centroX + raio * cos(angle);
    let y = centroY + raio * sin(angle);
    // Diâmetro 70, então raio 35 para detecção de clique
    circulos.push({ x: x, y: y, r: 35 });
  }
  
  // Caixa de seleção para a classe
  classeSelect = createSelect();
  classeSelect.position(50, 180);
  classeSelect.size(250, 30);
  classeSelect.option('Nenhuma classe');
  classeSelect.option('Sábio');
  classeSelect.option('Velocista');
  classeSelect.option('Fisiculturista');
  classeSelect.option('Tagarela');
  classeSelect.option('Especialista');
  classeSelect.changed(atualizarDescricaoClasse);
  
  // Área para a descrição da classe
  classeDescricao = createDiv('Não aumenta nada');
  classeDescricao.position(50, 220);
  classeDescricao.style('color', '#fff');
  classeDescricao.style('font-size', '12px');

  // Botão de reset
  resetButton = createButton('Reset');
  resetButton.position(centroX - 65, centroY + 10);
  resetButton.size(120, 30);
  resetButton.mousePressed(resetAtributos);
  
  // Botão de capturar tela (antigo "Salvar ficha") – na mesma posição
  salvarButton = createButton('Capturar tela');
  salvarButton.position(50, height - 50);
  salvarButton.size(250, 30);
  salvarButton.mousePressed(salvarFicha);
  
  // Caixa de texto para o URL da imagem
  imagemUrlInput = createInput(''); 
  imagemUrlInput.position(50, 490);
  imagemUrlInput.size(250, 30);
  
  // Botão "Verificar Imagem"
  verificarImagemButton = createButton('Verificar Imagem');
  verificarImagemButton.position(50, 530);
  verificarImagemButton.size(250, 30);
  verificarImagemButton.mousePressed(exibirImagem);
  
  // Área para exibir a imagem
  imagemDisplay = createImg('','');
  imagemDisplay.position(350, 320);
  imagemDisplay.size(250, 250);
  
  // Criação dos campos para as 10 perícias (dispostos à direita)
  let periciaXStart = width - 320;
  let periciaYStart = 80;
  let rowSpacing = 60; // Distância "normal" para evitar sobreposição
  
  for (let i = 0; i < pericias.length; i++) {
    // Cria o rótulo para a perícia e armazena em periciasLabels
    let label = createDiv(pericias[i]);
    label.position(periciaXStart, periciaYStart + i * rowSpacing);
    label.style('color', '#000000');
    label.style('font-size', '17px');
    label.style('z-index', '3');
    periciasLabels.push(label);
    
    // Cria o campo para o valor da perícia
    let input = createInput('0');
    input.position(periciaXStart + 130, periciaYStart + i * rowSpacing);
    input.size(100, 40);
    input.attribute("type", "number");
    input.attribute("min", "0");
    input.attribute("max", "5");
    input.style("background", "transparent");
    input.style("border", "none");
    input.style("text-align", "center");
    input.style("z-index", "3");
    input.style("transform", "translate(18px, -43px)");
    input.input(limitarPericias);
    periciasInputs.push(input);
  }
}

function criarCamposDeEntrada() {
  let campos = ["Nome", "Idade"];
  for (let i = 0; i < campos.length; i++) {
    let input = createInput("");
    input.position(50, 100 + i * 40);
    input.size(250, 30);
    input.style("background", "#fff");
    input.style("color", "#000");
    input.attribute("placeholder", campos[i]);
    if (campos[i] === "Idade") {
      input.attribute("type", "number");
      input.input(verificarIdade);
    }
    inputs.push(input);
  }
}

function verificarIdade() {
  let idade = this.value();
  if (isNaN(idade) || idade < 0) {
    this.value('');
  }
}

function draw() {
  clear();
  
  // Desenha os círculos dos atributos e seus textos
  for (let i = 0; i < atributos.length; i++) {
    let pos = circulos[i];
    
    fill(255);
    ellipse(pos.x, pos.y, 70, 70);
    
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(pontos[i], pos.x, pos.y);
    
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(atributos[i], pos.x, pos.y + 40);
  }
  
  // Atualiza a posição dos elementos DOM dos frames dos atributos
  for (let i = 0; i < circulos.length; i++) {
    let frameElement = select("#frame" + i);
    if (frameElement) {
      frameElement.position(circulos[i].x - 48, circulos[i].y - 43);
    }
  }
  
  // Atualiza a posição dos elementos DOM dos frames das perícias
  for (let i = 0; i < periciasInputs.length; i++) {
    let pos = periciasInputs[i].position();
    let frameElement = select("#pericia-frame" + i);
    if (frameElement) {
      frameElement.position(pos.x - 85, pos.y - 50);
    }
  }
  
  // Atualiza a posição dos rótulos das perícias
  for (let i = 0; i < periciasLabels.length; i++) {
    let pos = periciasInputs[i].position();
    let frameX = pos.x - 140;
    periciasLabels[i].position(frameX + 120 - (periciasLabels[i].elt.offsetWidth / 2), pos.y - 30);
  }
  
  // Título "Atributos"
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Atributos", width / 2 + 150, 250);
  
  // Atualiza valores de HP, Sanidade e Esforço
  hp = calcularHP();
  sanidade = calcularSanidade();
  esforco = calcularEsforco();
  
  desenharBarra("HP", hp, 50, 270, color(255, 0, 0), 10, 36);
  desenharBarra("Sanidade", sanidade, 50, 320, color(0, 0, 255), 5, 24);
  desenharBarra("Esforço", esforco, 50, 370, color(255, 255, 0), 3, 8);
  
  // Desenha o texto "Defesa" e o escudo
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Defesa", 70, 410);
  let defesa = calcularDefesa();
  desenharEscudo(50, 420, defesa);
}

function desenharBarra(nome, valor, x, y, cor, min, max) {
  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(nome + ": " + nf(valor, 1, 0), x, y - 10);
  
  fill(cor);
  noStroke();
  rect(x, y, map(valor, min, max, 0, 250), 20);
}

function calcularHP() {
  let hpBase = 20;
  switch (classeSelect.value()) {
    case 'Sábio': hpBase -= 2; break;
    case 'Velocista': hpBase += 5; break;
    case 'Fisiculturista': hpBase += 7; break;
    case 'Tagarela': hpBase += 3; break;
    case 'Especialista': hpBase -= 3; break;
  }
  hpBase += pontos[0] * 2;
  hpBase += pontos[1] * 1;
  return constrain(hpBase, 10, 36);
}

function calcularSanidade() {
  let sanidadeBase = 10;
  switch (classeSelect.value()) {
    case 'Sábio': sanidadeBase += 5; break;
    case 'Velocista': sanidadeBase -= 1; break;
    case 'Fisiculturista': sanidadeBase -= 2; break;
    case 'Tagarela': sanidadeBase += 2; break;
    case 'Especialista': sanidadeBase += 3; break;
  }
  sanidadeBase += pontos[2] * 2;
  sanidadeBase += pontos[3] * 1;
  return constrain(sanidadeBase, 5, 24);
}

function calcularEsforco() {
  let esforcoBase = 5;
  switch (classeSelect.value()) {
    case 'Sábio': esforcoBase += 1; break;
    case 'Velocista': esforcoBase += 1; break;
    case 'Fisiculturista': esforcoBase += 1; break;
    case 'Tagarela': esforcoBase += 1; break;
    case 'Especialista': esforcoBase += 2; break;
  }
  if (pontos[4] >= 2) {
    esforcoBase += 1;
  }
  return constrain(esforcoBase, 3, 8);
}

function calcularDefesa() {
  let defesaBase = 10;
  switch (classeSelect.value()) {
    case 'Fisiculturista': defesaBase += 2; break;
    case 'Velocista': defesaBase += 1; break;
    case 'Tagarela': defesaBase -= 1; break;
    case 'Sábio': defesaBase -= 2; break;
  }
  defesaBase += pontos[1];
  return max(defesaBase, 0);
}

function mousePressed() {
  for (let i = 0; i < circulos.length; i++) {
    let d = dist(mouseX, mouseY, circulos[i].x, circulos[i].y);
    if (d < circulos[i].r) {
      let proximoValor = (pontos[i] + 1) % 4;
      let diferenca = proximoValor - pontos[i];
      if (pontosDistribuir - diferenca >= 0) {
        pontosDistribuir -= diferenca;
        pontos[i] = proximoValor;
      }
    }
  }
}

function resetAtributos() {
  pontosDistribuir = 11;
  pontos = [0, 0, 0, 0, 0];
  hp = 20;
  sanidade = 10;
  esforco = 5;
}

function desenharEscudo(x, y, defesa) {
  fill(200);
  stroke(173, 216, 230);
  strokeWeight(4);
  beginShape();
  vertex(x, y);
  vertex(x + 40, y);
  vertex(x + 50, y + 20);
  vertex(x + 20, y + 50);
  vertex(x - 10, y + 20);
  endShape(CLOSE);
  
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text(defesa, x + 20, y + 20);
}

function atualizarDescricaoClasse() {
  switch (classeSelect.value()) {
    case 'Sábio': classeDescricao.html('Modifica principalmente HP e Sanidade.'); break;
    case 'Velocista': classeDescricao.html('Aumenta Agilidade e Esforço.'); break;
    case 'Fisiculturista': classeDescricao.html('Modifica Força e Defesa.'); break;
    case 'Tagarela': classeDescricao.html('Aumenta Inteligência e Sanidade.'); break;
    case 'Especialista': classeDescricao.html('Possui bônus em Magia e Defesa.'); break;
    default: classeDescricao.html('Não aumenta nada'); break;
  }
}

function exibirImagem() {
  let urlImagem = imagemUrlInput.value();
  fotoUrl = urlImagem;
  // Define o atributo crossorigin para que a imagem possa ser capturada
  imagemDisplay.elt.crossOrigin = "anonymous";
  imagemDisplay.attribute('src', urlImagem);
  imagemUrlInput.remove();
  verificarImagemButton.remove();
}

/* 
  Nova função de salvamento/captura:
  Em vez de remover elementos e salvar o canvas, este botão apenas
  informa que a captura de tela (de toda a página) deverá ser feita
  através do script Node.js (screenshot.js/screenshot.sh).
*/
function salvarFicha() {
  if (confirm("Você quer tirar uma screenshot?")) {
    html2canvas(document.body).then(canvas => {
      // Cria um link para download
      let link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "ficha.png";
      // Simula um clique para iniciar o download
      link.click();
    }).catch(err => {
      console.error("Erro ao capturar a screenshot:", err);
      alert("Ocorreu um erro ao tentar capturar a tela.");
    });
  }
}
