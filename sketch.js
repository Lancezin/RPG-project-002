let inputs = [];
let atributos = ["Força", "Vigor", "Inteligência", "Presença", "Magia"];
let pontosDistribuir = 11;
let pontos = [0, 0, 0, 0, 0]; // Valores iniciais dos atributos
let circulos = []; // Armazena posições dos círculos
let resetButton; // Botão de reset
let classeSelect; // Caixa de seleção para a classe
let classeDescricao; // Texto para a descrição da classe

// Variáveis para HP, Sanidade e Esforço
let hp = 20;
let sanidade = 10;
let esforco = 5;

let imagemUrlInput; // Caixa de texto para o URL da imagem
let imagemPreview; // Elemento para mostrar a imagem
let verificarImagemButton; // Botão "Verificar Imagem"
let imagemDisplay; // Exibindo a imagem ao lado direito

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  // Caixa de entrada para Nome, Idade e Classe
  criarCamposDeEntrada();
  
  // Definindo posições dos círculos em forma de pentágono
  let centroX = width / 2 + 250;  // Movido para o lado direito
  let centroY = 250;  // Movido para mais para cima, alinhado ao topo da caixa de "Nome"
  let raio = 150;
  
  circulos = []; // Resetando posições
  for (let i = 0; i < atributos.length; i++) {
    let angle = TWO_PI / 5 * i - PI / 2;
    let x = centroX + raio * cos(angle);
    let y = centroY + raio * sin(angle);
    circulos.push({ x: x, y: y, r: 25 });
  }
  
  // Criando a caixa de seleção para a classe
  classeSelect = createSelect();
  classeSelect.position(50, 180); // Agora está abaixo da idade
  classeSelect.size(250, 30);
  classeSelect.option('Nenhuma classe');
  classeSelect.option('Sábio');
  classeSelect.option('Velocista');
  classeSelect.option('Fisiculturista');
  classeSelect.option('Tagarela');
  classeSelect.option('Especialista');
  classeSelect.changed(atualizarDescricaoClasse);
  
  // Criando a área para a descrição da classe
  classeDescricao = createDiv('Não aumenta nada');
  classeDescricao.position(50, 220); // Ajustando a posição da descrição
  classeDescricao.style('color', '#fff');
  classeDescricao.style('font-size', '12px');

  // Botão de reset
  resetButton = createButton('Reset');
  resetButton.position(centroX - 65, centroY + 20);  // Abaixo de "Atributos" e alinhado
  resetButton.size(120, 30);
  resetButton.mousePressed(resetAtributos);
  
  // Caixa de texto para a URL da imagem
  imagemUrlInput = createInput(''); 
  imagemUrlInput.position(50, 490);  // Posição logo abaixo do escudo
  imagemUrlInput.size(250, 30);
  
  // Botão "Verificar Imagem"
  verificarImagemButton = createButton('Verificar Imagem');
  verificarImagemButton.position(50, 530);
  verificarImagemButton.size(250, 30);
  verificarImagemButton.mousePressed(exibirImagem);
  
  // Área para exibir a imagem
  imagemDisplay = createImg('');
  imagemDisplay.position(350, 320); // Posição ao lado direito das informações
  imagemDisplay.size(250, 250); // Tamanho fixo da imagem
}

function criarCamposDeEntrada() {
  // Caixa de entrada para Nome e Idade
  let campos = ["Nome", "Idade"];
  for (let i = 0; i < campos.length; i++) {
    let input = createInput("");
    input.position(50, 100 + i * 40); // Ajustando para o lado esquerdo
    input.size(250, 30);
    input.style("background", "#fff");
    input.style("color", "#000");
    input.attribute("placeholder", campos[i]);
    
    // Se for o campo de idade, permite apenas números
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
  background(0);
  
  // Desenhando os círculos dos atributos
  for (let i = 0; i < atributos.length; i++) {
    fill(255);
    ellipse(circulos[i].x, circulos[i].y, 50, 50);
    
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(pontos[i], circulos[i].x, circulos[i].y);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(atributos[i], circulos[i].x, circulos[i].y + 30);
  }
  
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Atributos", width / 2 + 250, 250);  // Ajustando para mais para cima
  
  // Exibindo as barras com valores atualizados
  hp = calcularHP();
  sanidade = calcularSanidade();
  esforco = calcularEsforco();
  
  // Desenhando as barras coloridas
  desenharBarra("HP", hp, 50, 270, color(255, 0, 0), 10, 36);
  desenharBarra("Sanidade", sanidade, 50, 320, color(0, 0, 255), 5, 24);
  desenharBarra("Esforço", esforco, 50, 370, color(255, 255, 0), 3, 8);
  
  // Desenhando o texto "Defesa" nas novas coordenadas
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Defesa", 70, 410);  // Atualizando para a nova posição
  
  // Desenhando o escudo da defesa
  let defesa = calcularDefesa();
  desenharEscudo(50, 420, defesa);
  
  // Desenhando o botão de reset
  resetButton.show();
}

function desenharBarra(nome, valor, x, y, cor, min, max) {
  // Desenhando o título da barra
  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(nome + ": " + valor, x, y - 10);

  // Desenhando a barra de progresso
  fill(cor);
  noStroke();
  rect(x, y, map(valor, min, max, 0, 250), 20);
}

function calcularHP() {
  let hpBase = 20;
  
  // Base de HP da classe
  switch (classeSelect.value()) {
    case 'Sábio': hpBase -= 2; break;
    case 'Velocista': hpBase += 5; break;
    case 'Fisiculturista': hpBase += 7; break;
    case 'Tagarela': hpBase += 3; break;
    case 'Especialista': hpBase -= 3; break;
  }
  
  // Influência dos atributos
  hpBase += pontos[0] * 2; // Força
  hpBase += pontos[1] * 1; // Vigor
  
  return constrain(hpBase, 10, 36);
}

function calcularSanidade() {
  let sanidadeBase = 10;
  
  // Base de sanidade da classe
  switch (classeSelect.value()) {
    case 'Sábio': sanidadeBase += 5; break;
    case 'Velocista': sanidadeBase -= 1; break;
    case 'Fisiculturista': sanidadeBase -= 2; break;
    case 'Tagarela': sanidadeBase += 2; break;
    case 'Especialista': sanidadeBase += 3; break;
  }
  
  // Influência dos atributos
  sanidadeBase += pontos[2] * 2; // Inteligência
  sanidadeBase += pontos[3] * 1; // Presença
  
  return constrain(sanidadeBase, 5, 24);
}

function calcularEsforco() {
  let esforcoBase = 5;
  
  // Base de esforço da classe
  switch (classeSelect.value()) {
    case 'Sábio': esforcoBase += 1; break;
    case 'Velocista': esforcoBase += 1; break;
    case 'Fisiculturista': esforcoBase += 1; break;
    case 'Tagarela': esforcoBase += 1; break;
    case 'Especialista': esforcoBase += 2; break;
  }
  
  // Influência dos atributos
  if (pontos[4] >= 2) { // Magia
    esforcoBase += 1;
  }
  
  return constrain(esforcoBase, 3, 8);
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
  fill(200);  // Cinza claro
  stroke(173, 216, 230);  // Borda azul claro
  strokeWeight(4);  // Borda mais espessa
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

function calcularDefesa() {
  let defesaBase = 10;
  
  // Modificadores de classe
  switch (classeSelect.value()) {
    case 'Fisiculturista': defesaBase += 2; break;
    case 'Velocista': defesaBase += 1; break;
    case 'Tagarela': defesaBase -= 1; break;
    case 'Sábio': defesaBase -= 2; break;
  }
  
  // Vigor adiciona +1 por ponto investido
  defesaBase += pontos[1];
  
  return max(defesaBase, 0); // Defesa não pode ser negativa
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
    imagemDisplay.attribute('src', urlImagem);
}
