/* ============================================================
   script.js — PetShop Amigo Fiel
   Funções JavaScript para dinamismo e interatividade.

   Este arquivo é carregado por TODAS as páginas do site.
   Cada função só age se o elemento que ela precisa existir na página.
============================================================ */


/* ------------------------------------------------------------
   1. RELÓGIO AO VIVO
   Preenche o elemento com id="relogio" com data e hora atuais.
   Atualiza a cada 1 segundo (1000 milissegundos).
------------------------------------------------------------ */
function relogioAoVivo() {
  // new Date() → cria um objeto com a data/hora exata agora
  const agora = new Date();

  // toLocaleDateString → converte a data para texto no formato brasileiro
  const data = agora.toLocaleDateString('pt-BR', {
    weekday: 'long',  // ex: "sexta-feira"
    day: '2-digit',   // ex: "27"
    month: 'long',    // ex: "março"
    year: 'numeric'   // ex: "2026"
  });

  // toLocaleTimeString → converte só o horário para texto
  const hora = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // document.getElementById → busca o elemento HTML pelo id
  const el = document.getElementById('relogio');

  // Verifica se o elemento existe na página antes de mexer nele
  // (este script é carregado por todas as páginas, nem todas têm o relógio)
  if (el) {
    el.innerHTML = `📅 ${data} &nbsp;|&nbsp; ⏰ <strong>${hora}</strong>`;
    // innerHTML → permite inserir HTML dentro da string (o <strong> deixa a hora em negrito)
    // Template literal (crase ` `) → deixa colocar variáveis direto no texto com ${}
  }
}

// Chama uma vez imediatamente para não ficar em branco no primeiro segundo
relogioAoVivo();

// setInterval → chama a função repetidamente a cada X milissegundos
setInterval(relogioAoVivo, 1000); // 1000ms = 1 segundo


/* ------------------------------------------------------------
   2. CONTADOR ANIMADO
   Anima os números da seção "Nossos Números" (0 → meta).
   Usa IntersectionObserver para só iniciar quando o usuário
   rolar a página até a seção — economizando performance.
------------------------------------------------------------ */
function animarContador(elemento) {
  // Lê o atributo data-meta do HTML para saber o valor final
  // Ex: <p data-meta="500"> → meta = 500
  const meta      = parseInt(elemento.getAttribute('data-meta'), 10);
  const duracao   = 1800;        // duração total da animação em milissegundos
  const passos    = 60;          // quantas vezes o número vai ser atualizado
  const intervalo = duracao / passos;   // tempo entre cada atualização
  const aumento   = meta / passos;     // quanto o número cresce por atualização
  let valorAtual  = 0;

  // setInterval executa a função atualizadora repetidamente
  const timer = setInterval(() => {
    valorAtual += aumento;

    if (valorAtual >= meta) {
      // Chegou no valor final: para o timer e exibe o número exato
      clearInterval(timer); // clearInterval → para o setInterval
      elemento.textContent = meta.toLocaleString('pt-BR') + '+';
    } else {
      // Ainda animando: exibe o número atual arredondado para baixo
      elemento.textContent = Math.floor(valorAtual).toLocaleString('pt-BR');
      // toLocaleString('pt-BR') formata: 1200 → "1.200" (com ponto como separador)
    }
  }, intervalo);
}

// IntersectionObserver → observa quando elementos entram na área visível da tela
// threshold: 0.3 → dispara quando 30% do elemento está visível
const observadorContador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      // isIntersecting = true → elemento entrou na área visível
      animarContador(entrada.target);
      observadorContador.unobserve(entrada.target); // anima só uma vez por elemento
    }
  });
}, { threshold: 0.3 });

// Seleciona todos os elementos com classe .contador e começa a observar cada um
document.querySelectorAll('.contador').forEach(el => observadorContador.observe(el));
// querySelectorAll → retorna uma lista de todos os elementos que correspondem ao seletor CSS


/* ------------------------------------------------------------
   3. VALIDAÇÃO DO FORMULÁRIO DE AGENDAMENTO
   Chamada pelo botão "Confirmar Agendamento" no cadastro.html
   Verifica se todos os campos obrigatórios estão preenchidos.
------------------------------------------------------------ */
function validarFormulario() {
  // Lê os valores de cada campo pelo id
  // Optional chaining (?.) → não dá erro se o elemento não existir na página
  // .trim() → remove espaços em branco do início e fim da string
  const nome     = document.getElementById('nomeCliente')?.value.trim();
  const cpf      = document.getElementById('cpfCliente')?.value.trim();
  const telefone = document.getElementById('telefoneCliente')?.value.trim();
  const email    = document.getElementById('emailCliente')?.value.trim();
  const nomePet  = document.getElementById('nomePet')?.value.trim();
  const dataHora = document.getElementById('dataAgendamento')?.value;

  // querySelector → busca o primeiro elemento que corresponde ao seletor CSS
  // 'input[name="servico"]:checked' → input de nome "servico" que está marcado
  const servicoMarcado = document.querySelector('input[name="servico"]:checked');
  const metodoMarcado  = document.querySelector('input[name="metodo"]:checked');

  // Array (lista) de mensagens de erro — começa vazio
  const erros = [];

  // Validações: se o campo estiver vazio/nulo, adiciona mensagem de erro ao array
  if (!nome)            erros.push('• Nome do cliente é obrigatório.');
  if (!cpf)             erros.push('• CPF é obrigatório.');
  if (!telefone)        erros.push('• Telefone é obrigatório.');
  if (!email)           erros.push('• E-mail é obrigatório.');
  if (!nomePet)         erros.push('• Nome do pet é obrigatório.');
  if (!servicoMarcado)  erros.push('• Selecione um serviço (Banho ou Tosa).');
  if (!metodoMarcado)   erros.push('• Selecione o método (Tele-busca ou Entrega no local).');
  if (!dataHora)        erros.push('• Selecione a data e horário do agendamento.');

  // Validação extra: CPF deve ter 11 dígitos numéricos
  // .replace(/\D/g, '') → remove todos os não-dígitos (pontos, traços)
  // /\D/ é uma expressão regular que representa "não dígito"
  if (cpf && cpf.replace(/\D/g, '').length !== 11) {
    erros.push('• CPF deve conter 11 dígitos numéricos.');
  }

  const caixaFeedback = document.getElementById('feedbackFormulario');

  if (erros.length > 0) {
    // Há erros: exibe a lista em vermelho
    caixaFeedback.className = 'alert alert-danger mt-3';
    caixaFeedback.innerHTML = '<strong>Por favor, corrija os campos abaixo:</strong><br>' + erros.join('<br>');
    caixaFeedback.style.display = 'block';

    // Rola a página suavemente até a caixa de erro
    caixaFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false; // false → interrompe o envio
  }

  // Sem erros → exibe mensagem de sucesso em verde
  caixaFeedback.className = 'alert alert-success mt-3';
  caixaFeedback.innerHTML =
    `✅ <strong>Agendamento confirmado com sucesso!</strong><br>
     Olá, <strong>${nome}</strong>! Seu agendamento para <strong>${nomePet}</strong>
     foi registrado. Entraremos em contato pelo e-mail <strong>${email}</strong>.`;
  caixaFeedback.style.display = 'block';
  caixaFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
}


/* ------------------------------------------------------------
   4. MÁSCARA DE CPF — formata enquanto o usuário digita
   Transforma: "12345678900" → "123.456.789-00"
   Chamada com oninput="formatarCPF(this)" no HTML.
   "this" = o próprio campo de input que disparou o evento.
------------------------------------------------------------ */
function formatarCPF(campo) {
  // Remove tudo que não for número
  let v = campo.value.replace(/\D/g, '');

  // Aplica máscara progressivamente
  if (v.length > 3)  v = v.slice(0,3) + '.' + v.slice(3);   // XXX.
  if (v.length > 7)  v = v.slice(0,7) + '.' + v.slice(7);   // XXX.XXX.
  if (v.length > 11) v = v.slice(0,11) + '-' + v.slice(11); // XXX.XXX.XXX-
  if (v.length > 14) v = v.slice(0, 14);                     // limita em 14 caracteres

  campo.value = v;
}


/* ------------------------------------------------------------
   5. MÁSCARA DE TELEFONE — formata enquanto o usuário digita
   Transforma: "51999887766" → "(51) 99988-7766"
   Chamada com oninput="formatarTelefone(this)" no HTML.
------------------------------------------------------------ */
function formatarTelefone(campo) {
  let v = campo.value.replace(/\D/g, ''); // remove não-dígitos

  if (v.length > 2)  v = '(' + v.slice(0,2) + ') ' + v.slice(2);  // (XX) 
  if (v.length > 10) v = v.slice(0,10) + '-' + v.slice(10);        // XXXXX-
  if (v.length > 15) v = v.slice(0, 15);                            // limite

  campo.value = v;
}


/* ------------------------------------------------------------
   6. MOSTRAR/OCULTAR endereço de tele-busca
   Quando o usuário escolhe "Tele-busca", exibe o campo
   de endereço de coleta. Se escolher "Entrega no local", oculta.
   Chamada com onchange="alterarMetodo()" nos radio buttons.
------------------------------------------------------------ */
function alterarMetodo() {
  const selecionado  = document.querySelector('input[name="metodo"]:checked')?.value;
  const enderecoDiv  = document.getElementById('enderecoTelebusca');

  if (enderecoDiv) {
    // Ternário: condição ? valor_se_verdadeiro : valor_se_falso
    enderecoDiv.style.display = (selecionado === 'telebusca') ? 'block' : 'none';
    // style.display = 'block' → mostra o elemento
    // style.display = 'none'  → oculta o elemento
  }
}
