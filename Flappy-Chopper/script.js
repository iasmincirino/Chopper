const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Imagens locais
const chopper = new Image();
chopper.src = "chopper.png";
const bg = new Image();
bg.src = "bg.png";
const fg = new Image();
fg.src = "fg.jpg";
const pipeTop = new Image();
pipeTop.src = "pipeTop.png";
const pipeBottom = new Image();
pipeBottom.src = "pipeBottom.png";

// Tamanhos das imagens
const chopperWidth = 40;
const chopperHeight = 35;
const pipeWidth = 52;
const pipeHeight = 320;
const fgHeight = 70;

let chopperX = 50;
let chopperY = 150;
let gravity = 0.4;
let velocity = 0;
let isGameOver = false;
let isGameStarted = false;
let score = 0;

let pipes = [];
pipes[0] = {
  x: canvas.width,
  y: Math.floor(Math.random() * pipeHeight) - pipeHeight
};

// Controle com teclado
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && isGameStarted && !isGameOver) {
    velocity = -5;
  }
});

// Controle com toque na tela
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Evita o comportamento padrão (como rolar a página)
  if (isGameStarted && !isGameOver) {
    velocity = -6;
  }
});

// Iniciar o jogo 
document.getElementById("startButton").addEventListener("click", () => {
  if (!isGameStarted) {
    isGameStarted = true;
    isGameOver = false;
    chopperY = 150;
    velocity = 0;
    score = 0;
    pipes = [
      {
        x: canvas.width,
        y: Math.floor(Math.random() * pipeHeight) - pipeHeight
      }
    ];
    draw();
  }
});

function draw() {
  if (isGameOver) return;

  // Fundo
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  for (let i = 0; i < pipes.length; i++) {
    // Tubos
    ctx.drawImage(pipeTop, pipes[i].x, pipes[i].y, pipeWidth, pipeHeight);
    ctx.drawImage(
      pipeBottom,
      pipes[i].x,
      pipes[i].y + pipeHeight + 113,
      pipeWidth,
      pipeHeight
    );

    pipes[i].x--;

    // Adiciona novos tubos
    if (pipes[i].x === 125) {
      pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeHeight) - pipeHeight
      });
    }

    // Colisão com tubos
    if (
      chopperX + chopperWidth > pipes[i].x &&
      chopperX < pipes[i].x + pipeWidth &&
      (chopperY < pipes[i].y + pipeHeight ||
        chopperY + chopperHeight > pipes[i].y + pipeHeight + 113)
    ) {
      endGame();
    }

    // Aumenta a pontuação
    if (pipes[i].x === 5) {
      score++;
    }
  }

  // Chão
  ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);

  // Chopper
  ctx.drawImage(chopper, chopperX, chopperY, chopperWidth, chopperHeight);

  // Gravidade e movimento
  velocity += gravity;
  chopperY += velocity;

  // Exibe pontuação
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 10, 30);

  // Verifica se tocou no chão 
  if (chopperY + chopperHeight >= canvas.height - fgHeight || chopperY < 0) {
    endGame();
  }

  requestAnimationFrame(draw);
}

function endGame() {
  isGameOver = true;
  setTimeout(() => {
    alert(`Pontuação: ${score}`);
    isGameStarted = false;
    showStartScreen();
  }, 100);
}

// Tela inicial
function showStartScreen() {
  ctx.fillStyle = "#ffe6f2"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Clique em 'Start' para jogar", canvas.width / 2 - 115, canvas.height / 2 + 10);
}

// Tela inicial 
showStartScreen();