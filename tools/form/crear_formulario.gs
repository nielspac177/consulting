// Run ONCE at https://script.new (owner's Google account). Running it again creates a duplicate form.
function crearFormularioConsultoria() {
  var f = FormApp.create('Consulta de proyecto · Project inquiry');
  f.setDescription('Cuénteme sobre su proyecto y le respondo en dos días hábiles. / Tell me about your project and I will reply within two business days.');
  f.setCollectEmail(true);
  f.addTextItem().setTitle('Nombre / Name').setRequired(true);
  f.addTextItem().setTitle('Organización / Organization');
  f.addCheckboxItem().setTitle('¿Qué necesita? / What do you need?').setChoiceValues([
    'Análisis estadístico / Statistical analysis',
    'Machine learning o IA / Machine learning or AI',
    'Diseño de estudio o protocolo / Study design or protocol',
    'Revisión sistemática o metaanálisis / Systematic review or meta-analysis',
    'Redacción científica o figuras / Scientific writing or figures',
    'Docencia o taller / Teaching or workshop',
    'Otro / Other'
  ]).setRequired(true);
  f.addParagraphTextItem().setTitle('Describa el proyecto / Describe the project').setRequired(true);
  f.addTextItem().setTitle('Plazo / Timeline');
  f.addMultipleChoiceItem().setTitle('Presupuesto aproximado / Approximate budget').setChoiceValues([
    'Menos de US$ 500 / Under US$ 500',
    'US$ 500 – 2,000',
    'US$ 2,000 – 5,000',
    'Más de US$ 5,000 / Over US$ 5,000',
    'Aún no lo sé / Not sure yet'
  ]);
  f.addTextItem().setTitle('¿Cómo me encontró? / How did you hear about me?');
  f.setConfirmationMessage('Gracias. Le respondo en dos días hábiles. / Thank you. I will reply within two business days.');
  Logger.log('EDIT: ' + f.getEditUrl());
  Logger.log('LIVE: ' + f.getPublishedUrl());
}
