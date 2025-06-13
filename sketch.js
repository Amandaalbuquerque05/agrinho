// Projeto Agrinho 2025- "Festejando a conexão campo-cidade"
// Colégio Estadual Trajano Gracia
// Aluna: Amanda Albuquerque
// Professor: Matheus Gonçalves Nacimento
// Projeto feito com recursos midiáticos e intermediários


let x = 265; // Posição X do agricultor na tela
let velocidade = 1; // Velocidade de movimento do agricultor
let cena = 1; // Controla qual cena do jogo está ativa
let falaAtual = ""; // Armazena o texto do balão de fala atual
let estadoAgricultor = "falandoRuralInicial"; // Controla o estado do agricultor

let xPessoaCidade; // Posição X da pessoa da cidade
let velocidadePessoaCidade = 0.8; // Velocidade de movimento da pessoa da cidade
let estadoPessoaCidade = "andandoReto"; // Controla o estado da pessoa da cidade

let xFuncionarioMercado; // Posição X do funcionário do mercado
let indiceFalaRural = 0; // Índice para controlar qual fala do agricultor está sendo exibida na cena rural
let proximoQuadroParaMudarFala = 0; 
let indiceFalaInteriorMercado = 0; // Índice para controlar as falas no interior do mercado
let indiceFalaEncontro = 0; // Índice para controlar as falas do encontro agricultor-cidade

//Dados das falas dos personagens
const FALAS_RURAIS_INICIAIS = [
  "Bom dia! O campo acordou junto com as galinhas hoje...",
  "Esses tomates já estão quase no ponto...",
  "Vamos ver quais já posso colher!",
];

const FALAS_RURAIS = [
  "Opa, com isso já posso ir vender na cidade!",
  "Agora é levar tudo fresquinho.",
  "Para que as pessoas sintam o sabor rural!",
];

const FALAS_ENCONTRO = [
  ["agricultor", "Bão sô! Que bom te encontrar por aqui!"],
  ["cidade", "Bom dia! Chegou a colheita de hoje? Que beleza, está linda!"],
  ["agricultor", "Com certeza, foi colhido com muito carinho."],
  [
    "cidade",
    "A gente agradece muito! Uma comida de qualidade realmente faz a diferença.",
  ],
];

const FALAS_INTERIOR_MERCADO = [
  [
    "funcionario",
    "Olá, tudo bom? Chegou a estrela do dia: seus produtos fresquinhos!",
  ],
  [
    "agricultor",
    "Tudo jóia! Trouxe tudo que a roça tem de melhor a oferecer. A cidade precisa disso, né?",
  ],
  [
    "funcionario",
    "Com certeza! É uma parceria recíproca que vem de anos. Vocês produzem, a gente distribui.",
  ],
  [
    "agricultor",
    "Isso mesmo! Campo e cidade juntos. Sem o campo, a mesa fica vazia.",
  ],
  [
    "funcionario",
    "Perfeito! Pode deixar a cesta aqui, que esse alimento será muito bem aproveitado!",
  ],
  [
    "agricultor",
    "Tá entregue! Que venham as próximas colheitas e essa parceria fique cada vez mais forte!",
  ],
];

const FALA_FINAL_AGRICULTOR =
  "Meu trabalho aqui na roça não termina quando a colheita sai... Ele só faz a primeira parte da viagem! Quer ver onde tudo isso chega?";

const FALA_FINAL_CIDADE =
  "Aqui na cidade, meus produtos se tornam valiosos e importantes para alimentares muitas pessoas. A união da área urbana e da área rural, é a chave para construírmos um futuro mais próspero e sustentável!";

//Variáveis de controle da cesta e itens
let mostrarCesta = true; // Controla a visibilidade da cesta
let cestaNoMercadoExterno = false; 
let cestaNoInteriorMercado = false; 
let itensNaCesta = 0; // Contador de itens colhidos e na cesta
let totalItensMaduros = 0; // Total de itens maduros que precisam ser colhido

//Constantes de posição e tempo
const ALTURA_Y_PERSONAGENS = 190; // Posição Y padrão para a base dos personagens no chão
const POS_X_MERCADO_EXTERNO = 350; // Posição X da fachada do mercado na cena urbana
const LARGURA_MERCADO_EXTERNO = 180; // Largura da fachada do mercado
const DURACAO_FALA_QUADROS = 240; // Duração de cada balão de fala
const PROXIMIDADE_ENCONTRO = 120; // Distância mínima para o encontro entre agricultor e pessoa da cidade
const NUM_PLANTAS_COLHEIVEIS = 6; // Quantidade de plantas que aparecerão na cena rural
const POS_INICIAL_AGRICULTOR_MERCADO_X = -70; // Posição X inicial do agricultor ao entrar no mercado
const POS_FINAL_AGRICULTOR_MERCADO_X = 220; // Posição X final do agricultor dentro do mercado (próximo ao balcão)
const PONTO_ENCONTRO_X = 300; // Ponto X onde agricultor e pessoa da cidade se encontram
const GALINHA_X_CENARIO = 50; // Posição X da galinha no cenário rural
const GALINHA_Y_CENARIO = 360; // Posição Y da galinha no cenário rural
const TIPOS_PLANTAS = ["tomate"]; // Tipo de planta gerada

//Arrays para objetos do jogo
let plantasColheiveis = []; // Armazena os objetos de cada planta
let pontosTomate = []; // Usado para a animação dos "tomates" saindo da cesta
let cestaClicada = false; // Controla se a cesta de envio foi clicada
const NUM_TOMATES_ESPALHADOS = 20; // Quantidade de tomates que saem da cesta na animação
 
// Configurações inicias 
function setup() {
  createCanvas(600, 400); // Cria o canvas
  textAlign(CENTER); // Alinha o texto
  textSize(14);

  xPessoaCidade = width + 50;
  xFuncionarioMercado = width / 2 + 80;

  // Definições de posição e tamanho para as áreas de exclusão
  const AGRICULTOR_AREA = {
    x: 265, // Posição X inicial do agricultor
    y: ALTURA_Y_PERSONAGENS, // Posição Y do agricultor
    largura: 70,
    altura: 90,
  };

  const GALINHA_AREA = {
    x: GALINHA_X_CENARIO - 70 / 2, // Galinha desenhada centralizada, ajustar para canto superior esquerdo
    y: GALINHA_Y_CENARIO - 40 / 2, // Altura aproximada do corpo da galinha
    largura: 70, // Largura aproximada da galinha
    altura: 40, // Altura aproximada da galinha
  };

  const MARGEM_SEGURANCA = 40; // Margem para evitar que itens fiquem muito próximos

  for (let i = 0; i < NUM_PLANTAS_COLHEIVEIS; i++) {
    let novaX, novaY;
    let sobreposto;
    let tentativas = 0;
    const MAX_TENTATIVAS = 100; // Limite de tentativas para evitar loop infinito

    do {
      novaX = random(50, width - 50);
      novaY = random(220, height - 20); // Limita a geração ao chão

      sobreposto = false;

      // Verifica sobreposição com o agricultor
      if (
        novaX + 15 > AGRICULTOR_AREA.x - MARGEM_SEGURANCA &&
        novaX - 15 <
          AGRICULTOR_AREA.x + AGRICULTOR_AREA.largura + MARGEM_SEGURANCA &&
        novaY + 15 > AGRICULTOR_AREA.y - MARGEM_SEGURANCA &&
        novaY - 15 <
          AGRICULTOR_AREA.y + AGRICULTOR_AREA.altura + MARGEM_SEGURANCA
      ) {
        sobreposto = true;
      }

      // Verifica sobreposição com a galinha
      if (!sobreposto) {
        if (
          novaX + 15 > GALINHA_AREA.x - MARGEM_SEGURANCA &&
          novaX - 15 <
            GALINHA_AREA.x + GALINHA_AREA.largura + MARGEM_SEGURANCA &&
          novaY + 15 > GALINHA_AREA.y - MARGEM_SEGURANCA &&
          novaY - 15 < GALINHA_AREA.y + GALINHA_AREA.altura + MARGEM_SEGURANCA
        ) {
          sobreposto = true;
        }
      }
      tentativas++;
    } while (sobreposto && tentativas < MAX_TENTATIVAS);

    if (!sobreposto) {
      let tipoAleatorio = random(TIPOS_PLANTAS); 
      let estaMadura = i % 2 === 0; // Alterna entre maduro e não maduro
      plantasColheiveis.push({
        x: novaX,
        y: novaY,
        colhida: false,
        madura: estaMadura,
        tipo: tipoAleatorio, // Adiciona o tipo à planta
      });
      if (estaMadura) {
        totalItensMaduros++; // Conta quantos itens maduros para colher
      }
    } else {
      console.warn(
        "Não foi possível encontrar um local livre para a planta após várias tentativas."
      );
    }
  }
}

function draw() {
  background(135, 226, 235); // Cor de fundo

  if (cena === 1) { // Cena rural
    desenharCenaRural();
    desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");

    if (mostrarCesta) {
      desenharCesta(x + 50, ALTURA_Y_PERSONAGENS + 60, itensNaCesta > 0);
    } // Desenha cesta

    for (let i = 0; i < plantasColheiveis.length; i++) {
      let p = plantasColheiveis[i];
      if (!p.colhida) {
        desenharPlanta(p.x, p.y, p.tipo, p.madura);
      } // Desenha plantas
    }

    if (estadoAgricultor === "falandoRuralInicial") {
      falaAtual = FALAS_RURAIS_INICIAIS[indiceFalaRural];
      desenharBalaoFala(x, ALTURA_Y_PERSONAGENS, falaAtual, "agricultor");
      if (proximoQuadroParaMudarFala === 0) {
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
      }

      if (frameCount >= proximoQuadroParaMudarFala) {
        indiceFalaRural++;
        if (indiceFalaRural >= FALAS_RURAIS_INICIAIS.length) {
          estadoAgricultor = "prontoParaColher";
          falaAtual = "";
          indiceFalaRural = 0;
          proximoQuadroParaMudarFala = 0;
        } else {
          proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
        }
      }
    } else if (estadoAgricultor === "prontoParaColher") {
      let todasMadurasColhidas = true;
      for (let i = 0; i < plantasColheiveis.length; i++) {
        let p = plantasColheiveis[i];
        if (p.madura && !p.colhida) {
          todasMadurasColhidas = false;
        }
      }

      if (!todasMadurasColhidas) {
        let instrucao1 = "Clique nas plantas";
        let instrucao2 = "maduras para colher!";
        desenharInstrucao(instrucao1, instrucao2, width / 2, 35);

        // Desenhar a barra de progresso da colheita
        let barraX = width / 2 - 100;
        let barraY = 80;
        let barraLarguraTotal = 200;
        let barraAltura = 20;

        // Fundo da barra
        fill(150);
        rect(barraX, barraY, barraLarguraTotal, barraAltura, 5);

        // Preenchimento da barra 
        let progressoLargura = map(
          itensNaCesta,
          0,
          totalItensMaduros,
          0,
          barraLarguraTotal
        );
        fill(0, 200, 0);
        rect(barraX, barraY, progressoLargura, barraAltura, 5);

        // Borda da barra
        noFill();
        stroke(0);
        strokeWeight(2);
        rect(barraX, barraY, barraLarguraTotal, barraAltura, 5);
        noStroke();

        // Texto de progresso
        fill(255);
        textSize(12);
        text(
          `${itensNaCesta}/${totalItensMaduros} Colhidos`,
          barraX + barraLarguraTotal / 2,
          barraY + barraAltura / 2 + 5
        );
        textSize(14); // Retorna ao tamanho padrão
      } else {
        estadoAgricultor = "falandoRural";
        indiceFalaRural = 0;
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
      }
    }

    if (estadoAgricultor === "falandoRural") {
      falaAtual = FALAS_RURAIS[indiceFalaRural];
      desenharBalaoFala(x, ALTURA_Y_PERSONAGENS, falaAtual, "agricultor");

      if (frameCount >= proximoQuadroParaMudarFala) {
        indiceFalaRural++;
        if (indiceFalaRural >= FALAS_RURAIS.length) {
          estadoAgricultor = "andandoRural";
          falaAtual = "";
        } else {
          proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
        }
      }
    }

    if (estadoAgricultor === "andandoRural") {
      x += velocidade;
      if (x > width + 50) {
        cena = 2;
        x = -70;
        estadoAgricultor = "indoEncontroCidade";
        xPessoaCidade = width + 50;
        estadoPessoaCidade = "andandoReto";
        velocidade = 0.9;
        velocidadePessoaCidade = 0.8;
        falaAtual = "";
        cestaNoMercadoExterno = false;
        cestaNoInteriorMercado = false;
        mostrarCesta = true;
      }
    }
  } else if (cena === 2) { // Cena urbana
    desenharCenaUrbana();

    if (estadoPessoaCidade === "andandoReto") {
      let distanciaParaParada =
        xPessoaCidade - (PONTO_ENCONTRO_X + PROXIMIDADE_ENCONTRO / 2);
      if (distanciaParaParada < 70 && distanciaParaParada > 0) {
        velocidadePessoaCidade = map(distanciaParaParada, 0, 70, 0.1, 0.8);
      } else if (distanciaParaParada <= 0) {
        estadoPessoaCidade = "paradoParaFalar";
        xPessoaCidade = PONTO_ENCONTRO_X + PROXIMIDADE_ENCONTRO / 2;
        velocidadePessoaCidade = 0;
      }
      xPessoaCidade -= velocidadePessoaCidade;
    } else if (estadoPessoaCidade === "andandoParaSumi") {
      xPessoaCidade -= velocidadePessoaCidade;
      if (xPessoaCidade < -50) {
        estadoPessoaCidade = "sumiu";
      }
    }

    if (estadoPessoaCidade !== "sumiu") {
      desenharPersonagem(xPessoaCidade, ALTURA_Y_PERSONAGENS, "cidade");
    }

    if (mostrarCesta && !cestaNoMercadoExterno && !cestaNoInteriorMercado) {
      desenharCesta(x + 50, ALTURA_Y_PERSONAGENS + 60, true);
    } else if (cestaNoMercadoExterno) {
      desenharCesta(
        POS_X_MERCADO_EXTERNO + LARGURA_MERCADO_EXTERNO - 70,
        ALTURA_Y_PERSONAGENS + 60,
        true
      );
    }

    if (estadoAgricultor === "indoEncontroCidade") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");
      let distanciaParaParadaAgricultor =
        PONTO_ENCONTRO_X - PROXIMIDADE_ENCONTRO / 2 - x;
      if (
        distanciaParaParadaAgricultor < 70 &&
        distanciaParaParadaAgricultor > 0
      ) {
        velocidade = map(distanciaParaParadaAgricultor, 0, 70, 0.1, 0.9);
      } else if (distanciaParaParadaAgricultor <= 0) {
        estadoAgricultor = "falasEncontro";
        x = PONTO_ENCONTRO_X - PROXIMIDADE_ENCONTRO / 2;
        velocidade = 0;
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
        falaAtual = "";
      }
      x += velocidade;
    } else if (estadoAgricultor === "falasEncontro") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");

      if (indiceFalaEncontro < FALAS_ENCONTRO.length) {
        let falante = FALAS_ENCONTRO[indiceFalaEncontro][0];
        let frase = FALAS_ENCONTRO[indiceFalaEncontro][1];

        falaAtual = frase;
        if (falante === "cidade") {
          desenharBalaoFala(
            xPessoaCidade,
            ALTURA_Y_PERSONAGENS,
            falaAtual,
            "cidade"
          );
        } else {
          desenharBalaoFala(x, ALTURA_Y_PERSONAGENS, falaAtual, "agricultor");
        }

        if (frameCount >= proximoQuadroParaMudarFala) {
          indiceFalaEncontro++;
          if (indiceFalaEncontro < FALAS_ENCONTRO.length) {
            proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
          } else {
            estadoPessoaCidade = "andandoParaSumi";
            velocidadePessoaCidade = 0.8;
            estadoAgricultor = "indoMercado";
            velocidade = 0.9;
            falaAtual = "";
            cestaNoMercadoExterno = false;
            cestaNoInteriorMercado = false;
            mostrarCesta = true;
          }
        }
      }
    } else if (estadoAgricultor === "indoMercado") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");
      x += velocidade;
      if (x > POS_X_MERCADO_EXTERNO + LARGURA_MERCADO_EXTERNO - 70) {
        cena = 3;
        x = POS_INICIAL_AGRICULTOR_MERCADO_X;
        estadoAgricultor = "indoParaCaixaMercado";
        indiceFalaInteriorMercado = 0;
      }
    }
  } else if (cena === 3) { // Cena mercado
    desenharCenaInteriorMercado();
    desenharPersonagem(
      xFuncionarioMercado,
      ALTURA_Y_PERSONAGENS,
      "funcionario"
    );

    if (mostrarCesta && !cestaNoInteriorMercado) {
      desenharCesta(x + 50, ALTURA_Y_PERSONAGENS + 60, true);
    } else if (cestaNoInteriorMercado) {
      desenharCesta(xFuncionarioMercado - 50, ALTURA_Y_PERSONAGENS + 60, true);
    }

    if (estadoAgricultor === "indoParaCaixaMercado") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");
      x += velocidade;

      if (x >= POS_FINAL_AGRICULTOR_MERCADO_X) {
        x = POS_FINAL_AGRICULTOR_MERCADO_X;
        estadoAgricultor = "falandoInteriorMercado";
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
      }
    } else if (estadoAgricultor === "falandoInteriorMercado") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");

      if (indiceFalaInteriorMercado < FALAS_INTERIOR_MERCADO.length) {
        let falante = FALAS_INTERIOR_MERCADO[indiceFalaInteriorMercado][0];
        let frase = FALAS_INTERIOR_MERCADO[indiceFalaInteriorMercado][1];

        falaAtual = frase;
        if (falante === "funcionario") {
          desenharBalaoFala(
            xFuncionarioMercado,
            ALTURA_Y_PERSONAGENS,
            falaAtual,
            "funcionario"
          );
        } else {
          desenharBalaoFala(x, ALTURA_Y_PERSONAGENS, falaAtual, "agricultor");
        }

        if (frameCount >= proximoQuadroParaMudarFala) {
          indiceFalaInteriorMercado++;

          if (
            indiceFalaInteriorMercado === FALAS_INTERIOR_MERCADO.length - 1 &&
            falante === "funcionario"
          ) {
            mostrarCesta = false;
            cestaNoInteriorMercado = true;
          }

          if (indiceFalaInteriorMercado < FALAS_INTERIOR_MERCADO.length) {
            proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
          } else {
            estadoAgricultor = "voltandoParaCasa";
            falaAtual = "";
          }
        }
      }
    }
    if (estadoAgricultor === "voltandoParaCasa") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");
      x -= velocidade; // Faz o agricultor andar para a esquerda

      // Verifica se o agricultor saiu da tela pela esquerda
      if (x < -70) {
        cena = 4; // Muda para a cena rural
        x = -70; 
        estadoAgricultor = "andandoParaCasa"; 
        velocidade = 0.9; 
        falaAtual = ""; 
      }
    }
  } else if (cena === 4) { // Cena rural
    desenharCenaRural(); // Desenha o cenário rural

    if (estadoAgricultor === "andandoParaCasa") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor");
      x += velocidade; 

      // Condição para ele parar de andar e começar a falar
      if (x >= width / 2 - 35) {
        x = width / 2 - 35; // Fixa a posição final
        velocidade = 0; // Para de andar
        estadoAgricultor = "falaFinal";
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS * 2; 
      }
    } else if (estadoAgricultor === "falaFinal") {
      desenharPersonagem(x, ALTURA_Y_PERSONAGENS, "agricultor"); // Desenha o agricultor parado
      falaAtual = FALA_FINAL_AGRICULTOR; // Define a fala
      desenharBalaoFala(x, ALTURA_Y_PERSONAGENS, falaAtual, "agricultor"); // Desenha o balão de fala

      if (frameCount >= proximoQuadroParaMudarFala) {
        cena = 4.5; // Transita para a próxima fase (cesta)
        estadoAgricultor = "aguardandoCesta";
        cestaClicada = false;
        pontosTomate = [];
      }
    }
  } else if (cena === 4.5) { // Cena dos tomates
    desenharCenaUrbanaSimplificada();
    desenharCesta(width / 2 - 25, height / 2 - 15, true);

    if (!cestaClicada) {
      let instrucao = "Clique na cesta para enviar os alimentos!";
      fill(0);
      textSize(16);
      text(instrucao, width / 2, height / 2 + 50);
    } else {
      for (let i = 0; i < pontosTomate.length; i++) {
        let pt = pontosTomate[i];
        fill(220, 0, 0); // Cor dos tomates saindo da cesta
        ellipse(pt.x, pt.y, 8, 8);

        pt.x += (pt.destinoX - pt.x) * 0.05;
        pt.y += (pt.destinoY - pt.y) * 0.05;

        if (dist(pt.x, pt.y, pt.destinoX, pt.destinoY) < 5) {
          pontosTomate.splice(i, 1);
          i--;
        }
      }

      if (pontosTomate.length === 0 && cestaClicada) {
        cena = 5;
        x = width / 2 - 35;
        estadoAgricultor = "finalizandoJogo";
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS * 3;
      }
    }
  } else if (cena === 5) { // Cena urbana/final
    desenharCenaUrbanaSimplificada();
    desenharPersonagem(x, ALTURA_Y_PERSONAGENS + 80, "agricultor");

    if (estadoAgricultor === "finalizandoJogo") {
      falaAtual = FALA_FINAL_CIDADE;
      desenharBalaoFala(x, ALTURA_Y_PERSONAGENS + 80, falaAtual, "agricultor");

      if (frameCount > proximoQuadroParaMudarFala) {
        // Fim do jogo
      }
    }
  }
}

// Função de interação
function mouseClicked() {
  if (cena === 1 && estadoAgricultor === "prontoParaColher") {
    for (let i = 0; i < plantasColheiveis.length; i++) {
      let p = plantasColheiveis[i];
      if (p.madura && !p.colhida && dist(mouseX, mouseY, p.x, p.y) < 20) {
        p.colhida = true;
        itensNaCesta++;
        
        proximoQuadroParaMudarFala = frameCount + DURACAO_FALA_QUADROS;
        break; // Sai do loop após colher um item
      }
    }
  } else if (cena === 4.5 && !cestaClicada) {
    if (dist(mouseX, mouseY, width / 2, height / 2) < 50) {
      cestaClicada = true;
      for (let i = 0; i < NUM_TOMATES_ESPALHADOS; i++) {
        let destinosPredefinidos = [
          {
            x: 65,
            y: 120,
          },
          {
            x: 95,
            y: 160,
          },
          {
            x: 165,
            y: 140,
          },
          {
            x: 195,
            y: 180,
          },
          {
            x: 270,
            y: 160,
          },
          {
            x: 300,
            y: 180,
          },
          {
            x: 375,
            y: 130,
          },
          {
            x: 405,
            y: 170,
          },
          {
            x: 475,
            y: 150,
          },
          {
            x: 505,
            y: 190,
          },
        ];
        let destinoAleatorio = random(destinosPredefinidos);
        pontosTomate.push({
          x: width / 2,
          y: height / 2,
          destinoX: destinoAleatorio.x + random(-10, 10),
          destinoY: destinoAleatorio.y + random(-10, 10),
        });
      }
    }
  }
}

function desenharCenaRural() { // Desenha cena rural
  noStroke();
  fill(135, 226, 235);
  rect(0, 0, width, height);
  fill(160, 82, 45); // Céu
  rect(0, 200, width, 200); // Chão marrom
  fill(34, 139, 34); // Plantas
  for (let y = 220; y < height; y += 40) {
    for (let xPlanta = 40; xPlanta < width; xPlanta += 60) {
      ellipse(xPlanta, y, 20, 20);
    }
  }
  fill(255, 204, 0); // Plantas
  ellipse(550, 60, 80, 80); // Sol
  fill(255); // Nuven
  ellipse(100, 80, 70, 50); // Mais nuvens
  ellipse(130, 70, 60, 40);
  ellipse(70, 70, 50, 30);
  ellipse(350, 100, 80, 60);
  ellipse(380, 90, 70, 50);
  ellipse(320, 90, 60, 40);

  desenharGalinha(GALINHA_X_CENARIO, GALINHA_Y_CENARIO);
}

function desenharCenaUrbana() {
  noStroke();
  fill(135, 226, 235);
  rect(0, 0, width, height); // Céu
  fill(255, 204, 0);
  ellipse(550, 60, 80, 80); // Sol
  fill(255);
  ellipse(100, 80, 70, 50); // Nuvens
  ellipse(130, 70, 60, 40);
  ellipse(70, 70, 50, 30);
  ellipse(350, 100, 80, 60);
  ellipse(380, 90, 70, 50);
  ellipse(320, 90, 60, 40);
  fill(80);
  rect(0, 250, width, 150); // Rua
  fill(255, 255, 100);
  for (let i = 50; i < width; i += 60) {
    rect(i, 270, 30, 10); // Faixa de pedestre
  }
  fill(150);
  rect(0, 230, width, 20); // Calçada
  fill(255, 60, 60);
  rect(POS_X_MERCADO_EXTERNO, 130, LARGURA_MERCADO_EXTERNO, 100);
  fill(255); // Mercado
  text("MERCADO", POS_X_MERCADO_EXTERNO + LARGURA_MERCADO_EXTERNO / 2, 160);
  fill(100, 50, 20);
  rect(POS_X_MERCADO_EXTERNO + 60, 190, 60, 40);
  fill(100, 180, 255);
  rect(50, 150, 80, 80); // Prédio
  fill(255, 120, 180);
  rect(150, 160, 70, 70); // Mais prédio
  fill(0);
  rect(80, 180, 20, 20);
  rect(170, 180, 20, 20);
  fill(139, 69, 19); // Árvore
  rect(270, 170, 10, 60);
  fill(0, 128, 0);
  ellipse(275, 170, 40, 40);
}

function desenharCenaInteriorMercado() {
  noStroke();
  fill(190, 190, 190); // Chão
  rect(0, 250, width, 150);

  stroke(150); // Piso
  strokeWeight(1);
  for (let i = 0; i < width; i += 40) {
    line(i, 250, i, height);
  }
  for (let j = 250; j < height; j += 40) {
    line(0, j, width, j);
  }
  noStroke();

  fill(60, 90, 140); // Teto/ parede
  rect(0, 0, width, 250);

  fill(150, 200, 220); // Prateleira superior
  rect(30, 80, width - 60, 40);

  // Nessa prateleira tem tomates, cenouras, frutas, uvas e queijo.
  fill(220, 0, 0);
  ellipse(70, 95, 20, 20);
  ellipse(90, 100, 22, 22);
  fill(0, 100, 0);
  rect(69, 85, 2, 5);
  rect(89, 90, 2, 5);

  fill(255, 150, 0);
  ellipse(150, 90, 25, 25);
  ellipse(170, 95, 25, 25);

  fill(255, 120, 0);
  triangle(230, 100, 235, 85, 240, 100);
  triangle(250, 105, 255, 90, 260, 105);
  fill(0, 100, 0);
  rect(234, 80, 2, 8);
  rect(254, 85, 2, 8);

  fill(200, 0, 0); 
  ellipse(300, 95, 20, 20);
  fill(0, 100, 0);
  rect(299, 85, 2, 5);
  fill(180, 20, 0);
  ellipse(320, 100, 22, 22);
  fill(0, 100, 0);
  rect(319, 90, 2, 5);

  fill(255, 255, 0);
  rect(380, 90, 15, 30, 5);
  rect(400, 95, 15, 30, 5);
  fill(0, 150, 0);
  ellipse(387, 120, 25, 10);
  ellipse(407, 125, 25, 10);

  fill(150, 0, 150);
  ellipse(460, 95, 10, 10);
  ellipse(470, 95, 10, 10);
  ellipse(465, 105, 10, 10);
  ellipse(455, 105, 10, 10);
  ellipse(460, 115, 10, 10);
  fill(0, 100, 0);
  rect(464, 85, 2, 10);

  fill(150, 200, 220); // Prateleira inferior
  rect(30, 150, width - 60, 40);

  // Nessa prateleira tem pão, suco, bolo, café, doces, e temperos.
  fill(220, 180, 100);
  rect(50, 160, 30, 25, 3);
  fill(200, 150, 80);
  rect(90, 165, 35, 20, 3);

  fill(200, 230, 255);
  rect(150, 160, 20, 30, 3);
  fill(255, 100, 0);
  rect(180, 165, 20, 25, 3);

  fill(245, 220, 150);
  ellipse(240, 170, 40, 25);
  rect(280, 165, 30, 20, 5);

  fill(200, 255, 200);
  ellipse(340, 175, 25, 25);
  fill(255, 200, 200);
  ellipse(370, 170, 25, 25);

  fill(100, 50, 0);
  rect(420, 160, 30, 30, 5);
  rect(460, 165, 25, 25, 5);

  let larguraBalcao = 300; // Balção
  let alturaBalcao = 60;
  let xBalcao = xFuncionarioMercado - larguraBalcao / 2 + 35;

  fill(139, 69, 19);
  rect(xBalcao, 190, larguraBalcao, alturaBalcao, 5);
  fill(160, 120, 80);
  rect(xBalcao, 185, larguraBalcao, 10);

  fill(40, 40, 40); // Caixa registradora
  rect(xBalcao + 50, 140, 80, 45, 5);
  fill(100, 100, 100);
  rect(xBalcao + 75, 180, 30, 10);
  fill(0, 200, 0);
  rect(xBalcao + 55, 145, 70, 35, 3);

  fill(120, 120, 120);
  rect(xBalcao + larguraBalcao - 120, 170, 80, 15, 3);
  fill(255);
  rect(xBalcao + larguraBalcao - 70, 140, 10, 30);

  fill(255, 200, 0);
  ellipse(xBalcao + 180, 175, 10, 10);
  ellipse(xBalcao + 195, 178, 12, 12);
  fill(200, 230, 255, 150);
  rect(xBalcao + larguraBalcao - 50, 160, 30, 30, 5);
  fill(255, 200, 0);
  ellipse(xBalcao + larguraBalcao - 35, 175, 20, 20);

  fill(255, 0, 0);
  triangle(width / 2 - 50, 30, width / 2 + 60, 30, width / 2, 60);
  fill(255, 255, 0);
  text("MERCADO", width / 2, 50);
  fill(0);
  text("MERCADO", width / 2 + 1, 51);

  textSize(14);
}

function desenharCenaUrbanaSimplificada() {
  noStroke();
  fill(135, 226, 235); // Céu
  rect(0, 0, width, height);
  fill(80); // Estrada
  rect(0, height - 100, width, 100);

  fill(180, 180, 180); // Prédios
  rect(50, 100, 80, 200);
  rect(150, 80, 70, 220);
  rect(250, 120, 90, 180);
  rect(360, 90, 80, 210);
  rect(460, 110, 70, 190);

  fill(100, 150, 200); // Janelas dos prédios
  for (let i = 0; i < 3; i++) {
    rect(65, 120 + i * 40, 20, 20);
    rect(95, 120 + i * 40, 20, 20);
  }
  for (let i = 0; i < 3; i++) {
    rect(165, 100 + i * 40, 20, 20);
    rect(195, 100 + i * 40, 20, 20);
  }
  for (let i = 0; i < 2; i++) {
    rect(270, 140 + i * 40, 20, 20);
    rect(300, 140 + i * 40, 20, 20);
  }
  for (let i = 0; i < 3; i++) {
    rect(375, 110 + i * 40, 20, 20);
    rect(405, 110 + i * 40, 20, 20);
  }
  for (let i = 0; i < 2; i++) {
    rect(475, 130 + i * 40, 20, 20);
    rect(505, 130 + i * 40, 20, 20);
  }

  fill(255, 204, 0); // Sol
  ellipse(550, 60, 80, 80);
}

function star(x, y, radius1, radius2, npoints) { // Desenha polígono
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    let sy2 = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy2);
  }
  endShape(CLOSE);
}

function desenharPersonagem(x, y, tipo) { // Desenha personagens
  noStroke();
  let characterScale = 1;

  push();
  translate(x, y);
  scale(characterScale);

  if (tipo === "agricultor") {
    fill(0, 0, 180);
    rect(0, 0, 70, 90); // Camisa
    fill(255, 230, 195);
    ellipse(35, -10, 80, 80); // Cabeça
    fill(0);
    ellipse(25, -20, 5, 8); // Olhos
    ellipse(45, -20, 5, 8);
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(35, -5, 40, 10, 0, PI); // Sorriso
    noStroke();
    fill(200, 160, 80);
    ellipse(35, -40, 90, 30);
    rect(15, -55, 40, 20);
    arc(35, -55, 40, 20, PI, TWO_PI); // Chapéu marrom
  } else if (tipo === "cidade") {
    fill(200, 100, 0);
    rect(0, 0, 70, 90); // Corpo
    fill(255, 230, 195);
    ellipse(35, -10, 80, 80); // Cabeça
    fill(0);
    ellipse(25, -20, 5, 8); // Olhos
    ellipse(45, -20, 5, 8);
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(35, -5, 40, 10, 0, PI); // Sorriso
    noStroke();
    fill(50, 50, 50);
    rect(10, -45, 50, 15); // Boné cinza
    rect(15, -55, 40, 15);
  } else if (tipo === "funcionario") {
    fill(0, 120, 0);
    rect(0, 0, 70, 90); // Camisa/corpo
    fill(255, 230, 195);
    ellipse(35, -10, 80, 80); // Cabeça
    fill(0);
    ellipse(25, -20, 5, 8); // Olhos
    ellipse(45, -20, 5, 8);
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(35, -5, 40, 10, 0, PI); // Sorriso
    noStroke();
    fill(100, 100, 100);
    rect(10, -50, 50, 20);
    rect(0, -40, 70, 10); // Boné cinza
  }
  pop();
}

function desenharCesta(x, y, comItens) { // Desenha cesta
  noStroke();
  fill(139, 69, 19); // Cor marrom
  rect(x, y, 50, 30, 5);
  fill(139, 69, 19);
  rect(x, y, 50, 5, 2);
  if (comItens) {
    let startX = x + 10;
    let startY = y + 10;
    let spacingX = 15;
    let spacingY = 8;
    let maxPerRow = 3;

    for (let i = 0; i < itensNaCesta; i++) {
      let row = floor(i / maxPerRow);
      let col = i % maxPerRow;
      let itemX = startX + col * spacingX;
      let itemY = startY - row * spacingY;
      // Tomates
      fill(220, 0, 0); // Cor
      ellipse(itemX, itemY, 15, 15);
      fill(0, 100, 0);
      rect(itemX - 1, itemY - 10, 2, 4);
    }
  }
}
function desenharPlanta(x, y, tipo, madura) {
  noStroke();
  if (tipo === "tomate") {
    if (madura) {
      fill(220, 0, 0); // Vermelho para tomate maduro
    } else {
      fill(0, 150, 0); // Verde para tomate não maduro
    }
    ellipse(x, y, 30, 30); // Corpo do tomate
    fill(0, 100, 0); // Talinho
    rect(x - 2, y - 20, 4, 10);
    ellipse(x, y - 15, 10, 5); // Base do talinho
  }
}

function desenharBalaoFala( // Desenha balão de fala
  xPersonagem,
  yPersonagemBase,
  texto,
  tipoPersonagem
) {
  if (!texto) return;
  textSize(12);
  let padding = 10;
  let lineHeight = 16;
  let maxWidth = 160;
  let palavras = texto.split(" ");
  let linhas = [];
  let currentLine = "";
  for (let i = 0; i < palavras.length; i++) {
    let palavra = palavras[i];
    let testLine = currentLine === "" ? palavra : currentLine + " " + palavra;
    if (textWidth(testLine) < maxWidth - 2 * padding) {
      currentLine = testLine;
    } else {
      linhas.push(currentLine);
      currentLine = palavra;
    }
  }

  linhas.push(currentLine);

  let larguraBalao = 0;
  for (let i = 0; i < linhas.length; i++) {
    larguraBalao = max(larguraBalao, textWidth(linhas[i]));
  }
  larguraBalao += 2 * padding;
  let alturaBalao = linhas.length * lineHeight + 2 * padding;

  // Posiciona o balão
  let xBalao = xPersonagem + 35; // Posição x do balão
  let yBalao = yPersonagemBase - 70 - alturaBalao; // Posição y do balão

  // Ajusta a posição do balão para que não saia da tela
  if (xBalao + larguraBalao > width - 5) {
    xBalao = width - larguraBalao - 5;
  }
  if (xBalao < 5) {
    xBalao = 5;
  }

  // Desenha o corpo do balão
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(xBalao, yBalao, larguraBalao, alturaBalao, 8); // Bordas arredondadas
  noStroke(); // Volta para sem borda para outros desenhos

  // Desenha o texto dentro do balão
  fill(0);
  textAlign(LEFT);
  for (let i = 0; i < linhas.length; i++) {
    text(
      linhas[i],
      xBalao + padding,
      yBalao + padding + i * lineHeight + lineHeight / 2
    );
  }
  textAlign(CENTER); // Volta ao alinhamento central padrão
  textSize(14); // Volta ao tamanho padrão
}

function desenharGalinha(x, y) {
  // Desenha galinha
  push();
  translate(x, y);
  noStroke();
  fill(255); // Corpo e cabeça
  ellipse(0, 0, 50, 40);
  ellipse(25, -15, 25, 25);
  fill(0); // Olhos
  ellipse(30, -18, 5, 5);
  fill(255, 165, 0); // Bico
  triangle(35, -18, 45, -15, 35, -12);
  fill(200, 0, 0);
  arc(25, -28, 15, 15, PI, TWO_PI);
  beginShape();
  vertex(-25, 0);
  bezierVertex(-35, -20, -35, 10, -25, 0);
  bezierVertex(-30, -5, -30, 5, -25, 0);
  endShape();
  stroke(255, 165, 0);
  strokeWeight(3);
  line(-10, 15, -10, 25);
  line(10, 15, 10, 25);
  line(-10, 25, -15, 28);
  line(-10, 25, -5, 28);
  line(10, 25, 5, 28);
  line(10, 25, 15, 28);
  pop();
}

function desenharInstrucao(linha1, linha2, xPos, yPos) {
  // Desenha balão de instrução
  let larguraLinha1 = textWidth(linha1); // Frase que irá aparecer
  let larguraLinha2 = textWidth(linha2);
  let larguraMaximaTexto = max(larguraLinha1, larguraLinha2);
  let larguraBalao = larguraMaximaTexto + 40;
  let alturaBalao = 60;
  let xBalao = xPos - larguraBalao / 2;
  let yBalao = yPos;
  fill(0, 0, 0, 180); // Desenha fundo do balão
  rect(xBalao, yBalao, larguraBalao, alturaBalao, 5);
  fill(255, 255, 0);
  textSize(14);
  text(linha1, xPos, yBalao + 20); // Posição do texto
  text(linha2, xPos, yBalao + 40);
}
