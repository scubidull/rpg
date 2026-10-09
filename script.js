const campo = document.getElementById("campo");
const envio = document.getElementById("envio");
const teclado = document.getElementById("teclado");
const mensagem = document.getElementById("mensagem");
const area = document.getElementById("area");

const textoInicial = mensagem.innerHTML;
const pastas = ["lore"];

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

function fecharTudo() {
  document.querySelectorAll(".janela").forEach((j) => (j.hidden = true));
}

function abrir(nome) {
  fecharTudo();
  document.getElementById("janela-" + nome).hidden = false;
  campo.value = "";
}

document.querySelectorAll(".pasta").forEach((botao) => {
  botao.addEventListener("click", () => abrir(botao.dataset.pasta));
});

document.querySelectorAll("[data-fechar]").forEach((botao) => {
  botao.addEventListener("click", () => {
    fecharTudo();
    mensagem.innerHTML = textoInicial;
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharTudo();
});

envio.addEventListener("submit", (e) => {
  e.preventDefault();
  const digitado = normalizar(campo.value);
  if (!digitado) return;

  if (pastas.includes(digitado)) {
    abrir(digitado);
  } else {
    fecharTudo();
    mensagem.textContent =
      "hmm, não achei a pasta \"" + campo.value.trim() + "\" ♡ tenta: lore";
    area.scrollTop = 0;
    campo.value = "";
  }
});

const linhas = [
  ["A", "B", "C", "D", "E", "F", "G", "H"],
  ["I", "J", "K", "L", "M", "N", "O", "P"],
  ["Q", "R", "S", "T", "U", "V", "W", "X"],
  ["Y", "Z", "⌫", "Space", "Enter"],
];

linhas.forEach((letras) => {
  const linha = document.createElement("div");
  linha.className = "linha";

  letras.forEach((rotulo) => {
    const tecla = document.createElement("button");
    tecla.type = "button";
    tecla.className = "tecla" + (rotulo.length > 1 && rotulo !== "⌫" ? " larga" : "");
    tecla.textContent = rotulo;
    tecla.dataset.tecla = rotulo.toLowerCase();
    if (rotulo === "⌫") tecla.setAttribute("aria-label", "Apagar");

    tecla.addEventListener("click", () => apertar(rotulo));
    linha.appendChild(tecla);
  });

  teclado.appendChild(linha);
});

function apertar(rotulo) {
  if (rotulo === "Enter") {
    envio.requestSubmit();
  } else if (rotulo === "Space") {
    campo.value += " ";
  } else if (rotulo === "⌫") {
    campo.value = campo.value.slice(0, -1);
  } else {
    campo.value += rotulo.toLowerCase();
  }
}

function acharTecla(chave) {
  const nome = chave === " " ? "space" : chave === "Backspace" ? "⌫" : chave.toLowerCase();
  return teclado.querySelector('[data-tecla="' + nome + '"]');
}

document.addEventListener("keydown", (e) => {
  const tecla = acharTecla(e.key);
  if (tecla) tecla.classList.add("apertada");
});

document.addEventListener("keyup", (e) => {
  const tecla = acharTecla(e.key);
  if (tecla) tecla.classList.remove("apertada");
});

const paginasLore = document.querySelectorAll("#janela-lore .pagina");
const numerosLore = document.querySelectorAll("#janela-lore .pag-num");
let paginaAtual = 0;

function irParaPagina(n) {
  paginaAtual = Math.max(0, Math.min(paginasLore.length - 1, n));
  paginasLore.forEach((p, i) => (p.hidden = i !== paginaAtual));
  numerosLore.forEach((b, i) => b.classList.toggle("ativa", i === paginaAtual));
  document.getElementById("corpo-lore").scrollTop = 0;
}

numerosLore.forEach((b) => b.addEventListener("click", () => irParaPagina(Number(b.dataset.ir))));
document.getElementById("pag-anterior").addEventListener("click", () => irParaPagina(paginaAtual - 1));
document.getElementById("pag-proxima").addEventListener("click", () => irParaPagina(paginaAtual + 1));
