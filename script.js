document.addEventListener("DOMContentLoaded", () => {
  let currentFontSize = 100;
  let currentUtterance = null; // Evita limpeza pelo garbage collector

  // Elementos do DOM
  const btnIncrease = document.getElementById("btn-increase-font");
  const btnDecrease = document.getElementById("btn-decrease-font");
  const btnTheme = document.getElementById("btn-toggle-theme");
  const btnRead = document.getElementById("btn-read-text");
  const btnStop = document.getElementById("btn-stop-text");
  const secoes = document.querySelectorAll(".secao-conteudo");

  // 1. Aumentar Fonte
  function aumentarFonte() {
    if (currentFontSize < 150) {
      currentFontSize += 10;
      document.body.style.fontSize = `${currentFontSize}%`;
    }
  }

  // 2. Diminuir Fonte
  function diminuirFonte() {
    if (currentFontSize > 80) {
      currentFontSize -= 10;
      document.body.style.fontSize = `${currentFontSize}%`;
    }
  }

  // 3. Alternar Modo Escuro / Alto Contraste
  function alternarTema() {
    document.body.classList.toggle("dark-mode");
  }

  // Identifica qual seção do site está visível na tela no momento
  function obterSecaoVisivel() {
    const alturaTela = window.innerHeight;
    let secaoVisivel = secoes[0];

    secoes.forEach((secao) => {
      const rect = secao.getBoundingClientRect();
      // Se o topo da seção estiver visível na metade superior da tela
      if (rect.top <= alturaTela / 2 && rect.bottom >= 0) {
        secaoVisivel = secao;
      }
    });

    return secaoVisivel;
  }

  // 4. Ler Texto da Seção Atual (ou Texto Selecionado pelo Usuário)
  function lerTexto() {
    pararLeitura();

    // Prioridade 1: Ler o texto que o usuário selecionou com o mouse
    const textoSelecionado = window.getSelection().toString().trim();
    let textoParaLers = textoSelecionado;

    // Prioridade 2: Ler apenas a seção visível na tela no momento
    if (!textoParaLers) {
      const secaoAtual = obterSecaoVisivel();
      if (secaoAtual) {
        textoParaLers = secaoAtual.innerText;
      }
    }

    if (!textoParaLers) return;

    currentUtterance = new SpeechSynthesisUtterance(textoParaLers);
    currentUtterance.lang = "pt-BR";
    currentUtterance.rate = 1.0;

    currentUtterance.onend = () => {
      currentUtterance = null;
    };

    currentUtterance.onerror = (e) => {
      console.error("Erro na reprodução de voz:", e);
      currentUtterance = null;
    };

    window.speechSynthesis.speak(currentUtterance);
  }

  // 5. Parar Leitura
  function pararLeitura() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  // Eventos dos Botões
  btnIncrease.addEventListener("click", aumentarFonte);
  btnDecrease.addEventListener("click", diminuirFonte);
  btnTheme.addEventListener("click", alternarTema);
  btnRead.addEventListener("click", lerTexto);
  btnStop.addEventListener("click", pararLeitura);
});
