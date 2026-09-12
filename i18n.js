/* Translations: each T.<page> holds the OTHER language for that page
   (pages authored in English carry Spanish here; telesalud is authored
   in Spanish and carries English). One "key": "value" per line; close
   each dictionary with a line containing only "};". */
var T = {};

T.index = {
  "__title": "Niels Pacheco-Barrios, MD — Mentoría, consultoría y telesalud",
  "__desc": "Médico e investigador en Harvard Medical School. Mentoría para estudiantes de medicina e investigadores, consultoría en datos e IA, y consultas médicas en línea.",
  "nav.mentoring": "Mentoría",
  "nav.consulting": "Consultoría",
  "nav.telesalud": "Telesalud",
  "hero.kicker": "Médico · Investigador · Científico de datos",
  "hero.title": "Medicina, datos y respuestas claras.",
  "hero.lede": "Soy Niels Pacheco-Barrios, médico e investigador posdoctoral en Harvard Medical School. Acompaño a estudiantes de medicina e investigadores, asesoro a equipos clínicos en datos e IA, y atiendo pacientes en línea.",
  "hero.cta": "Ver servicios",
  "hero.wa": "Escríbeme por WhatsApp",
  "doors.label": "Servicios",
  "d1.title": "Mentoría",
  "d1.text": "USMLE, el Match, elección de especialidad y carrera en investigación. Para estudiantes de medicina e investigadores que empiezan.",
  "d1.price": "Desde US$ 60 · S/ 120",
  "d2.title": "Consultoría",
  "d2.text": "Estadística, machine learning e IA, diseño de estudios y redacción científica para grupos de investigación y equipos de salud digital.",
  "d2.price": "Llamada inicial gratuita de 30 minutos",
  "d3.title": "Telesalud",
  "d3.text": "Teleconsultas de atención primaria para el Perú, y orientación o segunda opinión en neurología, neurocirugía y psiquiatría desde cualquier lugar.",
  "d3.price": "Desde S/ 80",
  "cred.label": "Credenciales",
  "cred.1": "Médico cirujano, Universidad Peruana Cayetano Heredia",
  "cred.2": "MSc en Bioestadística y Bioinformática, Dresden International University",
  "cred.3": "MMSc en Investigación Clínica, Harvard Medical School",
  "cred.4": "Investigador posdoctoral, MEND Lab, Harvard Medical School",
  "cred.5": "Colegio Médico del Perú",
  "how.title": "Cómo funciona",
  "how.1": "Elige un servicio y reserva una hora. Todas las sesiones son por Google Meet.",
  "how.2": "Paga con PayPal (internacional) o Yape / Plin (Perú). La cita se confirma al recibir el comprobante.",
  "how.3": "Nos reunimos. Te llevas un resumen escrito y los siguientes pasos.",
  "faq.title": "Preguntas frecuentes",
  "faq.q1": "¿En qué idiomas?",
  "faq.a1": "Español e inglés. Los resúmenes escritos van en el idioma de la sesión.",
  "faq.q2": "¿Zona horaria?",
  "faq.a2": "Estoy en Boston (hora del este de EE. UU.). Las páginas de reserva muestran las horas en tu zona horaria.",
  "faq.q3": "¿Cambios y reembolsos?",
  "faq.a3": "Cancela o reprograma con al menos 24 horas de anticipación por WhatsApp y tu pago se mantiene. Con menos aviso, la sesión se cobra.",
  "faq.q4": "¿La telesalud atiende emergencias?",
  "faq.a4": "No. Ante una emergencia llama a tu número local de emergencias (106 SAMU en el Perú).",
  "f.cmp": "Médico, Colegio Médico del Perú",
  "f.site": "Sitio académico"
};

// ---- runtime ----
(function () {
  var body = document.body;
  var page = body.getAttribute("data-page");
  var authored = body.getAttribute("data-lang") || "en";
  var other = authored === "en" ? "es" : "en";
  var dict = (window.T && window.T[page]) || {};
  var BASE = {};
  var current = authored;

  function capture() {
    var els = document.querySelectorAll("[data-i]");
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute("data-i");
      if (!(k in BASE)) BASE[k] = els[i].innerHTML;
    }
    BASE.__title = document.title;
    var m = document.querySelector('meta[name="description"]');
    BASE.__desc = m ? m.getAttribute("content") : "";
    var links = document.querySelectorAll("[data-href-alt]");
    for (var j = 0; j < links.length; j++) {
      links[j].setAttribute("data-href-base", links[j].getAttribute("href"));
    }
  }

  function apply(lang) {
    var src = lang === authored ? BASE : dict;
    var els = document.querySelectorAll("[data-i]");
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute("data-i");
      if (k in src) els[i].innerHTML = src[k];
    }
    var links = document.querySelectorAll("[data-href-alt]");
    for (var j = 0; j < links.length; j++) {
      links[j].setAttribute("href", lang === authored
        ? links[j].getAttribute("data-href-base")
        : links[j].getAttribute("data-href-alt"));
    }
    document.documentElement.lang = lang;
    if (src.__title) document.title = src.__title;
    var m = document.querySelector('meta[name="description"]');
    if (m && src.__desc) m.setAttribute("content", src.__desc);
    var btn = document.getElementById("lang-btn");
    if (btn) {
      btn.textContent = lang === "es" ? "English" : "Español";
      btn.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
    }
    current = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  function initial() {
    var q = /[?&]lang=(es|en)\b/.exec(location.search);
    if (q) return q[1];
    try {
      var s = localStorage.getItem("lang");
      if (s === "es" || s === "en") return s;
    } catch (e) {}
    return authored;
  }

  capture();
  var start = initial();
  if (start !== authored) apply(start);
  var toggle = document.getElementById("lang-btn");
  if (toggle) {
    toggle.addEventListener("click", function () { apply(current === authored ? other : authored); });
  }

  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { entries[i].target.classList.add("in"); io.unobserve(entries[i].target); }
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    for (var r = 0; r < rv.length; r++) io.observe(rv[r]);
  } else {
    for (var s = 0; s < rv.length; s++) rv[s].classList.add("in");
  }
})();
