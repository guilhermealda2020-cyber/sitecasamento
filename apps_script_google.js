const SHEET_PRESENTES = "Presentes";
const SHEET_PIX = "Pix";
const SHEET_CONFIRMACOES = "Confirmacoes";
const SHEET_MENSAGENS = "Mensagens";

// Se quiser aprovar mensagens antes de aparecerem no site, troque para false.
const AUTO_APROVAR_MENSAGENS = true;

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = String(params.action || "list").trim().toLowerCase();

    let result;

    if (action === "reserva") {
      result = reservarPresente(params);
    } else if (action === "pix") {
      result = registrarPix(params);
    } else if (action === "rsvp") {
      result = registrarConfirmacao(params);
    } else if (action === "mensagem") {
      result = registrarMensagem(params);
    } else if (action === "listmessages") {
      result = listarMensagens();
    } else {
      result = listarPresentes();
    }

    return responder(result, params.callback);
  } catch (error) {
    return responder({ success: false, message: error.message }, e && e.parameter ? e.parameter.callback : "");
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const tipo = String(body.tipo || body.action || "reserva").trim().toLowerCase();

    if (tipo === "pix") return responder(registrarPix(body));
    if (tipo === "rsvp") return responder(registrarConfirmacao(body));
    if (tipo === "mensagem") return responder(registrarMensagem(body));
    if (tipo === "listmessages") return responder(listarMensagens());

    return responder(reservarPresente(body));
  } catch (error) {
    return responder({ success: false, message: error.message });
  }
}

function listarPresentes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRESENTES);

  if (!sheet) {
    return { success: false, message: "Aba Presentes não encontrada." };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data.shift().map(h => String(h).trim());

  return data
    .filter(row => row.some(cell => String(cell).trim() !== ""))
    .map(row => linhaParaObjeto(headers, row));
}

function reservarPresente(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const id = String(data.id || "").trim();
    const convidado = String(data.convidado || "").trim();
    const mensagem = String(data.mensagem || "").trim();

    if (!id || !convidado) {
      return { success: false, message: "Dados incompletos para reserva." };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_PRESENTES);

    if (!sheet) {
      return { success: false, message: "Aba Presentes não encontrada." };
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(h => String(h).trim());

    const idCol = headers.indexOf("id");
    const reservadoCol = headers.indexOf("reservado");
    const convidadoCol = headers.indexOf("convidado");
    const mensagemCol = headers.indexOf("mensagem");
    const dataCol = headers.indexOf("data");

    if (idCol === -1 || reservadoCol === -1) {
      return { success: false, message: "Colunas id ou reservado não encontradas." };
    }

    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idCol]).trim() === id) {
        if (String(values[i][reservadoCol]).trim()) {
          return { success: false, message: "Este presente já foi reservado." };
        }

        sheet.getRange(i + 1, reservadoCol + 1).setValue("SIM");
        if (convidadoCol !== -1) sheet.getRange(i + 1, convidadoCol + 1).setValue(convidado);
        if (mensagemCol !== -1) sheet.getRange(i + 1, mensagemCol + 1).setValue(mensagem);
        if (dataCol !== -1) sheet.getRange(i + 1, dataCol + 1).setValue(new Date());

        return { success: true, message: "Reservado com sucesso." };
      }
    }

    return { success: false, message: "Presente não encontrado." };
  } finally {
    lock.releaseLock();
  }
}

function registrarPix(data) {
  const nome = String(data.nome || "").trim();
  const valor = String(data.valor || "").trim();
  const mensagem = String(data.mensagem || "").trim();

  if (!nome || !valor) {
    return { success: false, message: "Nome e valor são obrigatórios para aviso de Pix." };
  }

  const sheet = obterOuCriarAba(SHEET_PIX, ["data", "nome", "valor", "mensagem"]);
  sheet.appendRow([new Date(), nome, valor, mensagem]);

  return { success: true, message: "Aviso de Pix registrado." };
}

function registrarConfirmacao(data) {
  const nome = String(data.nome || "").trim();
  const contato = String(data.contato || data.email || data.telefone || "").trim();
  const presenca = String(data.presenca || "").trim();
  const quantidade = String(data.quantidade || "1").trim();
  const mensagem = String(data.mensagem || "").trim();

  if (!nome || !presenca) {
    return { success: false, message: "Nome e presença são obrigatórios." };
  }

  const sheet = obterOuCriarAba(SHEET_CONFIRMACOES, ["data", "nome", "contato", "presenca", "quantidade", "mensagem"]);
  sheet.appendRow([new Date(), nome, contato, presenca, quantidade, mensagem]);

  return { success: true, message: "Confirmação registrada." };
}

function registrarMensagem(data) {
  const nome = String(data.nome || "").trim();
  const mensagem = String(data.mensagem || "").trim();

  if (!nome || !mensagem) {
    return { success: false, message: "Nome e mensagem são obrigatórios." };
  }

  const sheet = obterOuCriarAba(SHEET_MENSAGENS, ["data", "nome", "mensagem", "aprovado"]);
  sheet.appendRow([new Date(), nome, mensagem, AUTO_APROVAR_MENSAGENS ? "SIM" : ""]);

  return { success: true, message: "Mensagem registrada." };
}

function listarMensagens() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_MENSAGENS);

  if (!sheet) return { success: true, mensagens: [] };

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, mensagens: [] };

  const headers = data.shift().map(h => String(h).trim());

  const mensagens = data
    .filter(row => row.some(cell => String(cell).trim() !== ""))
    .map(row => linhaParaObjeto(headers, row))
    .filter(item => String(item.aprovado || "SIM").toUpperCase() === "SIM")
    .map(item => ({
      nome: item.nome || "Convidado",
      mensagem: item.mensagem || ""
    }))
    .filter(item => item.mensagem);

  return { success: true, mensagens: mensagens };
}

function obterOuCriarAba(nome, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(nome);

  if (!sheet) {
    sheet = ss.insertSheet(nome);
    sheet.appendRow(headers);
    return sheet;
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function linhaParaObjeto(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] === undefined ? "" : row[index];
  });
  return obj;
}

function responder(obj, callback) {
  const json = JSON.stringify(obj);
  const cb = String(callback || "").trim();

  if (cb && /^[a-zA-Z_$][0-9a-zA-Z_$\.]*$/.test(cb)) {
    return ContentService
      .createTextOutput(cb + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
