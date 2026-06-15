let presentes = [];
let presenteSelecionado = null;
let contadorIntervalo = null;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
  aplicarConfiguracoesVisuais();
  configurarMenuMobile();
  configurarMusica();
  renderizarHistoria();
  renderizarGaleria();
  renderizarAcomodacoes();
  iniciarContador();

  await carregarPresentes();
  configurarFiltro();
  renderizarPresentes();
}

function obterConfig() {
  return window.SITE_CONFIG || SITE_CONFIG;
}

function configurarMusica() {
  const audio = document.getElementById("musicaCasamento");
  if (!audio) return;

  audio.volume = 0.6;
  audio.play().catch(() => {
    const tocar = () => audio.play().catch(() => {});
    document.addEventListener("click", tocar, { once: true });
    document.addEventListener("touchstart", tocar, { once: true });
    document.addEventListener("keydown", tocar, { once: true });
  });
}

function aplicarConfiguracoesVisuais() {
  const cfg = obterConfig();
  const nomeCasalAmp = `${cfg.noiva} & ${cfg.noivo}`;
  const nomeCasalE = `${cfg.noiva} e ${cfg.noivo}`;

  document.title = `Casamento | ${nomeCasalAmp}`;
  setTexto("brandNomes", nomeCasalAmp);
  setTexto("heroNoiva", cfg.noiva);
  setTexto("heroNoivo", cfg.noivo);
  setTexto("heroDiaSemana", cfg.diaSemana);
  setTexto("heroData", cfg.dataTexto);
  setTexto("heroHorario", cfg.horario);
  setTexto("heroFrasePrincipal", cfg.frasePrincipal);
  setTexto("cardNoivaNome", cfg.noiva);
  setTexto("cardNoivoNome", cfg.noivo);
  setTexto("cardNoivaTexto", cfg.casal?.noiva);
  setTexto("cardNoivoTexto", cfg.casal?.noivo);
  setTexto("textoPedidoCasamento", cfg.pedidoCasamento);
  setTexto("confirmarAte", cfg.confirmarAte);
  setTexto("footerNomes", nomeCasalAmp);
  setTexto("footerData", `${cfg.dataTexto} | ${cfg.cidade}`);

  configurarImagem("fotoPrincipal", cfg.fotos?.principal, `Foto de ${nomeCasalE}`);
  configurarImagem("fotoNoiva", cfg.fotos?.noiva, `Foto da ${cfg.noiva}`);
  configurarImagem("fotoNoivo", cfg.fotos?.noivo, `Foto do ${cfg.noivo}`);

  setTexto("cerimoniaTitulo", cfg.cerimonia?.titulo || "Cerimônia");
  setTexto("cerimoniaHorario", cfg.cerimonia?.horario || cfg.horario);
  setTexto("cerimoniaLocal", cfg.cerimonia?.local);
  setEndereco("cerimoniaEndereco", cfg.cerimonia?.endereco);
  configurarLink("cerimoniaLink", cfg.cerimonia?.linkMaps, "Ver no mapa", "Link em breve");

  setTexto("festaTitulo", cfg.festa?.titulo || "Recepção");
  setTexto("festaHorario", cfg.festa?.horario || "Após a cerimônia");
  setTexto("festaLocal", cfg.festa?.local);
  setEndereco("festaEndereco", cfg.festa?.endereco);
  configurarLink("festaLink", cfg.festa?.linkMaps, "Ver no mapa", "Link em breve");

  const textoBotaoConfirmacao = cfg.confirmacaoAssessora?.textoBotao || "Confirmar presença";
  const linkConfirmacao = cfg.confirmacaoAssessora?.link || "#confirmacao";
  configurarLink("linkConfirmacaoAssessora", linkConfirmacao, textoBotaoConfirmacao, "Link da assessora em breve");

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = `Site de casamento de ${nomeCasalE}: evento, fotos, confirmação de presença e lista de presentes.`;
  }
}

function setTexto(id, valor) {
  const el = document.getElementById(id);
  if (el && valor !== undefined && valor !== null) el.textContent = valor;
}

function setEndereco(id, valor) {
  const el = document.getElementById(id);
  if (!el || !valor) return;

  const partes = valor.split(" - ");
  if (partes.length < 3) {
    el.textContent = valor;
    return;
  }

  const primeiraLinha = partes.slice(0, -2).join(" - ");
  const segundaLinha = partes[partes.length - 2];
  const terceiraLinha = partes[partes.length - 1];

  el.innerHTML = `
    <span>${escaparHTML(primeiraLinha)}</span>
    <span>${escaparHTML(segundaLinha)}</span>
    <span>${escaparHTML(terceiraLinha)}</span>
  `;
}

function configurarImagem(id, src, alt) {
  const el = document.getElementById(id);
  if (!el || !src) return;
  el.src = src;
  if (alt) el.alt = alt;
}

function configurarLink(id, href, textoAtivo, textoVazio) {
  const el = document.getElementById(id);
  if (!el) return;

  if (textoAtivo) el.textContent = textoAtivo;

  if (!href || href === "#") {
    el.href = "#";
    el.removeAttribute("target");
    if (textoVazio) el.textContent = textoVazio;
    return;
  }

  el.href = href;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
}

function configurarMenuMobile() {
  const btn = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const aberto = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function iniciarContador() {
  const cfg = obterConfig();
  const dataEvento = new Date(cfg.dataISO).getTime();

  function atualizar() {
    const agora = Date.now();
    const diferenca = Math.max(0, dataEvento - agora);

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    setTexto("dias", dias);
    setTexto("horas", String(horas).padStart(2, "0"));
    setTexto("minutos", String(minutos).padStart(2, "0"));
    setTexto("segundos", String(segundos).padStart(2, "0"));

    if (diferenca <= 0 && contadorIntervalo) clearInterval(contadorIntervalo);
  }

  atualizar();
  contadorIntervalo = setInterval(atualizar, 1000);
}

function renderizarHistoria() {
  const cfg = obterConfig();
  const container = document.getElementById("timelineHistoria");
  if (!container) return;

  container.innerHTML = "";
  (cfg.historia || []).forEach(item => {
    const article = document.createElement("article");
    article.className = "timeline-item";
    article.innerHTML = `
      <div>
        <h3>${escaparHTML(item.titulo)}</h3>
        <p class="timeline-date">${escaparHTML(item.data)}</p>
      </div>
      <p>${escaparHTML(item.texto)}</p>
    `;
    container.appendChild(article);
  });
}

function renderizarGaleria() {
  const cfg = obterConfig();
  const container = document.getElementById("galeriaFotos");
  if (!container) return;

  container.innerHTML = "";
  (cfg.fotos?.galeria || []).forEach(item => {
    const card = document.createElement("figure");
    card.className = "gallery-item";
    card.innerHTML = `
      <img src="${escaparAtributo(item.src)}" alt="${escaparAtributo(item.legenda || 'Foto do casal')}" loading="lazy" />
    `;
    container.appendChild(card);
  });
}

function renderizarAcomodacoes() {
  const cfg = obterConfig();
  const container = document.getElementById("acomodacoesLista");
  if (!container) return;

  container.innerHTML = "";
  (cfg.acomodacoes || []).forEach(item => {
    const card = document.createElement("article");
    card.className = "accommodation-card";
    card.innerHTML = `
      <strong>${escaparHTML(item.tipo || "Sugestão")}</strong>
      <h3>${escaparHTML(item.nome || "Nome do local")}</h3>
      <p>${escaparHTML(item.endereco || "Endereço em breve")}</p>
      <p>${escaparHTML(item.contato || "Contato em breve")}</p>
      ${item.link && item.link !== "#" ? `<a class="btn-secondary full" href="${escaparAtributo(item.link)}" target="_blank" rel="noopener noreferrer">Abrir link</a>` : ""}
    `;
    container.appendChild(card);
  });
}

function configurarFormularios() {
  const formMensagem = document.getElementById("formMensagem");
  if (formMensagem) {
    formMensagem.addEventListener("submit", enviarMensagem);
  }
}

function chamarAppsScript(params = {}) {
  return new Promise((resolve, reject) => {
    if (!API_URL || API_URL.includes("SUA_URL")) {
      reject(new Error("API_URL não configurada"));
      return;
    }

    const callbackName = "jsonpCallback_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    const url = new URL(API_URL);

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.set(key, params[key]);
      }
    });

    url.searchParams.set("callback", callbackName);

    const script = document.createElement("script");
    let timeout;

    window[callbackName] = function(dados) {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
      resolve(dados);
    };

    script.onerror = function() {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
      reject(new Error("Erro ao carregar Apps Script"));
    };

    timeout = setTimeout(() => {
      delete window[callbackName];
      script.remove();
      reject(new Error("Tempo esgotado ao carregar Apps Script"));
    }, 15000);

    script.src = url.toString();
    document.body.appendChild(script);
  });
}

async function carregarPresentes() {
  try {
    const dados = await chamarAppsScript({ action: "list" });
    const lista = Array.isArray(dados) ? dados : (Array.isArray(dados.presentes) ? dados.presentes : []);

    if (!lista.length) throw new Error("Lista vazia ou retorno inválido");

    presentes = lista
      .map(normalizarPresente)
      .filter(item => !ehPix(item));
  } catch (erro) {
    console.warn("Usando lista demo:", erro);
    presentes = (PRESENTES_DEMO || []).map(normalizarPresente).filter(item => !ehPix(item));
  }

  presentes.unshift(normalizarPresente(PIX_ITEM));
}

function normalizarPresente(item) {
  return {
    id: String(item.id || "").trim(),
    nome: String(item.nome || "").trim(),
    valor: String(item.valor || "").trim(),
    categoria: String(item.categoria || "Outros").trim(),
    foto: String(item.foto || "img/presente.svg").trim(),
    descricao: String(item.descricao || item.descrição || "").trim(),
    link_loja: String(item.link_loja || item.link || item.loja || item.produto || "").trim(),
    reservado: String(item.reservado || "").trim(),
    convidado: String(item.convidado || "").trim(),
    mensagem: String(item.mensagem || "").trim(),
    data: String(item.data || "").trim()
  };
}

function ehPix(item) {
  return String(item.categoria || "").toLowerCase() === "pix" || String(item.id || "").toLowerCase().startsWith("pix");
}

function configurarFiltro() {
  const filtro = document.getElementById("filtroCategoria");
  if (!filtro) return;

  const categorias = [...new Set(presentes.map(p => p.categoria).filter(Boolean))].sort();

  filtro.innerHTML = '<option value="todos">Todos</option>';
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filtro.appendChild(option);
  });

  filtro.onchange = renderizarPresentes;
}

function renderizarPresentes() {
  const lista = document.getElementById("listaPresentes");
  const vazia = document.getElementById("mensagemVazia");
  const filtroEl = document.getElementById("filtroCategoria");
  if (!lista || !vazia || !filtroEl) return;

  const filtro = filtroEl.value;
  lista.innerHTML = "";

  const disponiveis = presentes.filter(item => {
    const passaFiltro = filtro === "todos" || item.categoria === filtro;
    const disponivel = ehPix(item) || !item.reservado;
    return passaFiltro && disponivel;
  });

  if (disponiveis.length === 0) {
    vazia.classList.remove("hidden");
    return;
  }
  vazia.classList.add("hidden");

  disponiveis.forEach(item => {
    const card = document.createElement("article");
    card.className = ehPix(item) ? "gift-card pix-card" : "gift-card";

    card.innerHTML = `
      <img src="${escaparAtributo(item.foto)}" alt="${escaparAtributo(item.nome)}" onerror="this.src='img/presente.svg'" />
      <div class="gift-info">
        <p class="category">${escaparHTML(item.categoria)}</p>
        <h3>${escaparHTML(item.nome)}</h3>
        <p class="price">${escaparHTML(item.valor)}</p>
        <button class="btn-primary full" onclick="abrirModal('${escaparAtributo(item.id)}')" type="button">
          ${ehPix(item) ? "Fazer Pix" : "Ver detalhes"}
        </button>
      </div>
    `;

    lista.appendChild(card);
  });
}

function abrirModal(id) {
  presenteSelecionado = presentes.find(p => p.id === id);
  if (!presenteSelecionado) return;

  const isPix = ehPix(presenteSelecionado);
  const modalFoto = document.getElementById("modalFoto");
  modalFoto.src = presenteSelecionado.foto || "img/presente.svg";
  modalFoto.classList.toggle("pix-modal-icon", isPix);

  setTexto("modalCategoria", presenteSelecionado.categoria);
  setTexto("modalTitulo", presenteSelecionado.nome);
  setTexto("modalValor", presenteSelecionado.valor);
  setTexto("modalDescricao", presenteSelecionado.descricao || "Sem descrição detalhada cadastrada.");

  const link = document.getElementById("modalLinkLoja");
  if (!isPix && presenteSelecionado.link_loja) {
    link.href = presenteSelecionado.link_loja;
    link.classList.remove("hidden");
  } else {
    link.href = "#";
    link.classList.add("hidden");
  }

  setTexto("modalAviso", "");
  limparCampos();

  if (isPix) {
    document.getElementById("areaReserva").classList.add("hidden");
    document.getElementById("areaPix").classList.remove("hidden");
    setTexto("pixChaveTexto", PIX_KEY);
    document.getElementById("pixQrCode").src = PIX_QR_CODE;
  } else {
    document.getElementById("areaPix").classList.add("hidden");
    document.getElementById("areaReserva").classList.remove("hidden");
  }

  document.getElementById("modal").classList.remove("hidden");
}

function limparCampos() {
  ["nomeConvidado", "mensagemConvidado", "pixNome", "pixValor", "pixMensagem"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
  presenteSelecionado = null;
}

async function confirmarReserva() {
  if (!presenteSelecionado || ehPix(presenteSelecionado)) return;

  const nome = document.getElementById("nomeConvidado").value.trim();
  const mensagem = document.getElementById("mensagemConvidado").value.trim();
  const aviso = document.getElementById("modalAviso");

  if (!nome) {
    aviso.textContent = "Informe seu nome para confirmar a reserva.";
    return;
  }

  try {
    aviso.textContent = "Reservando...";

    const retorno = await chamarAppsScript({
      action: "reserva",
      id: presenteSelecionado.id,
      convidado: nome,
      mensagem: mensagem
    });

    if (!retorno.success && retorno.status !== "ok") {
      throw new Error(retorno.message || "Não foi possível reservar.");
    }

    presenteSelecionado.reservado = "SIM";
    presenteSelecionado.convidado = nome;
    aviso.textContent = "Presente reservado com sucesso. Obrigado!";
    setTimeout(() => {
      fecharModal();
      renderizarPresentes();
    }, 900);

  } catch (erro) {
    console.error(erro);
    aviso.textContent = "Não foi possível reservar agora. Tente novamente.";
  }
}

async function copiarPix() {
  const aviso = document.getElementById("modalAviso");
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    aviso.textContent = "Chave Pix copiada com sucesso!";
  } catch (erro) {
    aviso.textContent = "Chave Pix: " + PIX_KEY;
  }
}

async function avisarPix() {
  const nome = document.getElementById("pixNome").value.trim();
  const valor = document.getElementById("pixValor").value.trim();
  const mensagem = document.getElementById("pixMensagem").value.trim();
  const aviso = document.getElementById("modalAviso");

  if (!nome) {
    aviso.textContent = "Informe seu nome para enviar o aviso.";
    return;
  }

  if (!valor) {
    aviso.textContent = "Informe o valor do Pix para os noivos identificarem.";
    return;
  }

  try {
    aviso.textContent = "Enviando aviso...";

    const retorno = await chamarAppsScript({
      action: "pix",
      nome: nome,
      valor: valor,
      mensagem: mensagem
    });

    if (!retorno.success && retorno.status !== "ok") {
      throw new Error(retorno.message || "Não foi possível registrar o aviso.");
    }

    aviso.textContent = "Aviso enviado com sucesso. Muito obrigado!";
    setTimeout(() => fecharModal(), 1200);

  } catch (erro) {
    console.error(erro);
    aviso.textContent = "Não foi possível enviar o aviso agora. Confira se o Apps Script foi atualizado.";
  }
}

async function enviarMensagem(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("statusMensagem");

  const dados = {
    action: "mensagem",
    nome: form.mensagemNome.value.trim(),
    mensagem: form.mensagemTexto.value.trim()
  };

  if (!dados.nome || !dados.mensagem) {
    status.textContent = "Informe seu nome e escreva uma mensagem.";
    return;
  }

  try {
    status.textContent = "Enviando mensagem...";
    const retorno = await chamarAppsScript(dados);

    if (!retorno.success && retorno.status !== "ok") {
      throw new Error(retorno.message || "Erro ao enviar mensagem.");
    }

    status.textContent = "Mensagem enviada com sucesso. Obrigado!";
    adicionarMensagemNoMural(dados.nome, dados.mensagem);
    form.reset();
  } catch (erro) {
    console.error(erro);
    status.textContent = "Não foi possível enviar agora. Confira se o Apps Script foi atualizado.";
  }
}

async function carregarMensagens() {
  const mural = document.getElementById("muralMensagens");
  if (!mural) return;

  try {
    const retorno = await chamarAppsScript({ action: "listMessages" });
    const mensagens = Array.isArray(retorno) ? retorno : (Array.isArray(retorno.mensagens) ? retorno.mensagens : []);

    if (!mensagens.length) return;

    mural.innerHTML = "";
    mensagens.slice(-6).reverse().forEach(msg => adicionarMensagemNoMural(msg.nome, msg.mensagem, false));
  } catch (erro) {
    console.warn("Mural de mensagens indisponível:", erro);
  }
}

function adicionarMensagemNoMural(nome, mensagem, limparPlaceholder = true) {
  const mural = document.getElementById("muralMensagens");
  if (!mural) return;

  if (limparPlaceholder && mural.querySelector("blockquote")) {
    mural.innerHTML = "";
  }

  const note = document.createElement("article");
  note.className = "message-note";
  note.innerHTML = `
    <strong>${escaparHTML(nome)}</strong>
    <p>${escaparHTML(mensagem)}</p>
  `;
  mural.prepend(note);
}

function escaparHTML(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escaparAtributo(texto) {
  return escaparHTML(texto);
}
