SITE DE CASAMENTO - FERNANDA & GUILHERME
VERSÃO FÚCSIA ELEGANTE / PROFISSIONAL

O QUE FOI ALTERADO NESTA VERSÃO
- Mantive o fúcsia como cor principal do tema.
- O fúcsia foi aplicado de forma mais elegante: botões, títulos, monograma, destaques, cards especiais e áreas importantes.
- O fundo ficou em marfim/off-white para não deixar o visual enjoativo ou cansativo.
- Mantive dourado/champagne apenas como cor de apoio.
- Confirmação de presença continua direcionando para o link da assessora.
- Estrutura para trocar fotos do casal continua simples, sem precisar mexer no HTML.

PALETA PRINCIPAL
- Fúcsia principal: #a00062
- Fúcsia escuro: #700044
- Marfim/fundo: #fffaf7 / #f7f1ee
- Dourado champagne: #b8925d
- Texto escuro: #23191f

CONFIRMAÇÃO DE PRESENÇA
A confirmação está configurada no arquivo config.js, neste trecho:

confirmacaoAssessora: {
  textoBotao: "Confirmar presença com a assessoria",
  link: "https://wa.me/554498271200?..."
}

Troque o link por qualquer link da assessora:
- WhatsApp
- Google Forms
- site da assessoria
- formulário externo

FOTOS DO CASAL
Para trocar as fotos, entre na pasta:

img/casal/

Substitua os arquivos mantendo exatamente estes nomes:

hero.jpg          -> foto principal do casal, de preferência vertical
noiva.jpg         -> foto da noiva
noivo.jpg         -> foto do noivo
galeria-01.jpg    -> foto da galeria
galeria-02.jpg    -> foto da galeria
galeria-03.jpg    -> foto da galeria
galeria-04.jpg    -> foto da galeria horizontal
galeria-05.jpg    -> foto da galeria
galeria-06.jpg    -> foto da galeria

Dica:
- hero.jpg: use foto vertical ou retrato do casal.
- noiva.jpg e noivo.jpg: fotos individuais ou recortes elegantes.
- galeria-04.jpg: fica melhor com foto horizontal.

Se quiser usar outros nomes de arquivo, edite o trecho "fotos" dentro de config.js.

PRESENTES E PIX
A lista de presentes continua usando Google Apps Script + Planilha.
O site tenta buscar a lista na planilha. Se não conseguir, mostra a lista demo do config.js.

Arquivos principais:
- index.html: estrutura do site
- style.css: visual, cores e layout
- script.js: funcionamento do site
- config.js: dados fáceis de editar
- apps_script_google.js: código para colar no Google Apps Script
- modelo_planilha.csv: modelo da planilha

IMPORTANTE PARA PUBLICAR NO GITHUB PAGES
Suba todos os arquivos mantendo a estrutura de pastas:

index.html
style.css
script.js
config.js
apps_script_google.js
modelo_planilha.csv
img/
  casal/
  qrcode-pix.png
  pix.svg
  presente.svg
  ...

Depois de subir, atualize com Ctrl + F5 para limpar o cache.

ATUALIZAÇÃO VISUAL - FÚCSIA SUAVE E ELEGANTE
- O fúcsia foi mantido como cor principal, mas agora aparece como assinatura visual: botões, monograma, detalhes, bordas e pequenos destaques.
- Foram removidos blocos grandes em fúcsia escuro para deixar o site menos pesado e menos cansativo.
- A base agora é marfim/off-white com fúcsia fechado e dourado discreto.
- A estrutura de fotos continua pronta em img/casal/.
