// CONFIGURAÇÃO PRINCIPAL DO SITE
// Para trocar fotos, substitua os arquivos dentro da pasta img/casal mantendo os mesmos nomes.
// Para trocar textos, datas, locais e links, edite somente este arquivo.

const API_URL = "https://script.google.com/macros/s/AKfycbyz9dVTFiWD3YkDlvR_qYOEdKzeWG9rulRf0JQIBAgdhm2T_IUrc7X9wXUhuEG3uB_E/exec";

const SITE_CONFIG = {
  noiva: "Fernanda",
  noivo: "Guilherme",
  monograma: "F & G",
  dataISO: "2026-10-03T16:00:00-03:00",
  dataTexto: "03 de outubro de 2026",
  diaSemana: "Sábado",
  horario: "16:00h",
  cidade: "Paranavaí-PR",
  confirmarAte: "03/09/2026",

  frasePrincipal:
    "Com alegria, convidamos você para celebrar conosco o início da nossa vida a dois.",

  fraseSecundaria:
    "Reunimos aqui as informações do evento, confirmação de presença, fotos e lista de presentes.",

  // Link da assessora para confirmação de presença.
  // Troque por qualquer link: WhatsApp, formulário, site da assessoria ou Google Forms.
  confirmacaoAssessora: {
    textoBotao: "Falar com Aline Antunes",
    link: "https://wa.me/554498271200?text=Ol%C3%A1%2C%20gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20no%20casamento%20da%20Fernanda%20e%20do%20Guilherme."
  },

  casal: {
    noiva:
      "Fernanda é presença, delicadeza e cuidado. Seu jeito transforma os detalhes em memórias importantes.",
    noivo:
      "Guilherme é parceria, proteção e alegria. Ao lado da Fernanda, encontrou o lugar onde o coração descansa."
  },

  fotos: {
    principal: "img/casal/hero.jpg",
    noiva: "img/casal/noiva.jpg",
    noivo: "img/casal/noivo.jpg",
    galeria: [
      { src: "img/casal/galeria-02.jpg", legenda: "Foto do casal" },
      { src: "img/casal/galeria-03.jpg", legenda: "Foto do casal" },
      { src: "img/casal/galeria-04.jpg", legenda: "Foto do casal" }
    ]
  },

  historia: [
    {
      titulo: "Quando nos conhecemos",
      data: "O início de tudo",
      texto:
        "Nossa história começou de forma simples, em conversas que aos poucos se tornaram presença, cuidado e vontade de continuar."
    },
    {
      titulo: "Primeiro encontro",
      data: "Uma memória especial",
      texto:
        "O primeiro encontro confirmou a leveza que já existia. Entre risadas e afinidades, nasceu a certeza de que havia algo especial."
    },
    {
      titulo: "Começo do namoro",
      data: "A construção do nosso caminho",
      texto:
        "Com o tempo, fomos construindo uma relação baseada em respeito, companheirismo, fé e planos para o futuro."
    },
    {
      titulo: "Pedido de casamento",
      data: "O nosso sim antes do altar",
      texto:
        "O pedido foi íntimo, emocionante e cheio de significado. A partir dele, começamos a sonhar oficialmente com este grande dia."
    },
    {
      titulo: "O grande dia",
      data: "03 de outubro de 2026",
      texto:
        "Agora nos preparamos para dizer sim diante de Deus, da família e dos amigos que fazem parte da nossa caminhada."
    }
  ],

  pedidoCasamento:
    "O pedido foi um dos capítulos mais importantes da nossa história: um momento reservado, verdadeiro e cheio de emoção, onde o nosso futuro começou a ganhar forma.",

  cerimonia: {
    titulo: "Cerimônia",
    horario: "16:00h",
    local: "Capela do Santíssimo",
    endereco: "R. Getúlio Vargas, 717 - Zona 1, Paranavaí - PR, 87702-000",
    linkMaps: "https://www.google.com/maps/place/Capela+do+Sant%C3%ADssimo/@-23.082251,-52.4658983,17z/data=!3m1!4b1!4m6!3m5!1s0x9492966042f5b12f:0x9f598c631b71ba31!8m2!3d-23.082251!4d-52.4658983!16s%2Fg%2F11fzf9h0j_?entry=tts&g_ep=EgoyMDI2MDYwMS4wIPu8ASoASAFQAw%3D%3D&skid=94c7ecaa-aab3-435f-8d9c-a34062dc717e"
  },

  festa: {
    titulo: "Recepção",
    horario: "Após a cerimônia",
    local: "Local da festa",
    endereco: "Av. Gabriel Esperidião, 54 - Centro, Paranavaí - PR, 87703-000",
    linkMaps: "https://maps.app.goo.gl/bdXRKFMPpaZKHvwu7"
  },

  acomodacoes: [
    {
      tipo: "Hotel",
      nome: "Sugestão de hospedagem",
      endereco: "Edite aqui o endereço ou remova esta seção no HTML",
      contato: "Telefone/WhatsApp",
      link: "#"
    },
    {
      tipo: "Beleza",
      nome: "Salão ou maquiagem",
      endereco: "Indicação opcional para convidados",
      contato: "Instagram/WhatsApp",
      link: "#"
    }
  ]
};

const PIX_KEY = "10193675986";
const PIX_QR_CODE = "img/qrcode-pix.png";

const PIX_ITEM = {
  id: "pix_livre",
  nome: "Pix para os noivos",
  valor: "Valor à escolha do convidado",
  categoria: "Pix",
  foto: "img/qrcode-pix.png",
  descricao:
    "Escolha o valor que desejar e envie uma mensagem para nos avisar do Pix. Sua contribuição vai nos ajudar a construir nosso lar.",
  link_loja: ""
};

// Lista usada apenas se a planilha/Apps Script estiver fora do ar.
const PRESENTES_DEMO = [
  {
    id: "airfryer",
    nome: "Air Fryer",
    valor: "R$ 350",
    categoria: "Cozinha",
    foto: "img/airfryer.svg",
    descricao:
      "Air Fryer para preparar refeições rápidas no dia a dia. Preferência por modelos de 4L ou 5L.",
    link_loja: "https://www.google.com/search?q=air+fryer"
  },
  {
    id: "panelas",
    nome: "Jogo de Panelas",
    valor: "R$ 300",
    categoria: "Cozinha",
    foto: "img/panelas.svg",
    descricao: "Jogo de panelas antiaderente para montar nossa cozinha.",
    link_loja: "https://www.google.com/search?q=jogo+de+panelas"
  },
  {
    id: "liquidificador",
    nome: "Liquidificador",
    valor: "R$ 180",
    categoria: "Cozinha",
    foto: "img/liquidificador.svg",
    descricao: "Liquidificador para uso diário, com boa potência e copo resistente.",
    link_loja: "https://www.google.com/search?q=liquidificador"
  }
];
