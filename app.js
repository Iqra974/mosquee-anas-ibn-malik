const config = window.MOSQUEE_CONFIG;
const zone = config.timezone || "Indian/Reunion";
const $ = (id) => document.getElementById(id);
const CALENDAR_URL = "./horaires_priere_zone_sud_reunion_complet.json";

let calendar = [];
let prayers = [];
let loadedDateKey = "";

document.title = `${config.mosqueName} — Horaires de prière`;
document.querySelector("h1").textContent = config.mosqueName;
document.querySelector(".brand-ar").textContent = config.mosqueNameArabic;
$("location").textContent = config.location;
$("reminder-text").textContent = config.reminder.text;
$("reminder-source").textContent = config.reminder.source;
$("notice-text").textContent = config.notice;
$("ticker-text").textContent = `${config.ticker}     ${config.ticker}`;

function localParts(date = new Date()) {
  const pieces = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(date);
  return Object.fromEntries(pieces.filter((p) => p.type !== "literal").map((p) => [p.type, p.value]));
}

function dateKey(parts = localParts()) {
  return `${parts.month}-${parts.day}`;
}

function parseTime(value) {
  if (!value) return null;
  const [hour = 0, minute = 0, second = 0] = value.split(":").map(Number);
  return { hour, minute, second };
}

function format24(value, period) {
  const t = parseTime(value);
  if (!t) return "--:--";
  let hour = t.hour;
  if (period === "pm" && hour < 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

function iqamaFor(name) {
  return config.prayers?.find((p) => p.name === name)?.iqama || "—";
}

function buildPrayers(day) {
  return [
    { name: "Fajr", arabic: "الفجر", time: format24(day.subh_sadiq, "am"), iqama: iqamaFor("Fajr") },
    { name: "Chourouq", arabic: "الشروق", time: format24(day.lever_soleil, "am"), iqama: "—", sunrise: true },
    { name: "Dhuhr", arabic: "الظهر", time: format24(day.zohr, "pm"), iqama: iqamaFor("Dhuhr") },
    { name: "Asr", arabic: "العصر", time: format24(day.asr, "pm"), iqama: iqamaFor("Asr") },
    { name: "Maghrib", arabic: "المغرب", time: format24(day.maghreb, "pm"), iqama: iqamaFor("Maghrib") },
    { name: "Isha", arabic: "العشاء", time: format24(day.isha, "pm"), iqama: iqamaFor("Isha") }
  ];
}

function findCalendarDay(parts = localParts()) {
  return calendar.find((d) => Number(d.mois_numero) === Number(parts.month) && Number(d.jour) === Number(parts.day));
}

function timeForDate(value, parts) {
  const [hour, minute] = value.split(":").map(Number);
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, hour - 4, minute, 0);
}

function tomorrowParts() {
  const p = localParts();
  return localParts(new Date(Date.UTC(+p.year, +p.month - 1, +p.day + 1, 8, 0, 0)));
}

function findNextPrayer() {
  const p = localParts();
  const now = Date.now();
  for (const prayer of prayers.filter((x) => !x.sunrise)) {
    const at = timeForDate(prayer.time, p);
    if (at > now) return { prayer, at };
  }
  const tp = tomorrowParts();
  const tomorrow = findCalendarDay(tp);
  if (tomorrow) {
    const fajr = buildPrayers(tomorrow)[0];
    return { prayer: fajr, at: timeForDate(fajr.time, tp) };
  }
  return null;
}

function renderPrayers() {
  if (!prayers.length) return;
  const nextResult = findNextPrayer();
  const next = nextResult?.prayer.name;
  $("prayer-grid").innerHTML = prayers.map((p) => `
    <article class="prayer ${p.name === next ? "active" : ""}">
      <div><h2>${p.name}</h2><p class="arabic" lang="ar" dir="rtl">${p.arabic}</p></div>
      <time>${p.time}</time>
      <p class="iqama">${p.sunrise ? "Lever du soleil" : `Iqama <strong>${p.iqama}</strong>`}</p>
    </article>`).join("");
}

function loadToday(force = false) {
  const p = localParts();
  const key = dateKey(p);
  if (!force && key === loadedDateKey) return true;
  const day = findCalendarDay(p);
  if (!day) return false;
  prayers = buildPrayers(day);
  loadedDateKey = key;
  renderPrayers();
  return true;
}

function update() {
  const now = new Date();
  loadToday();
  $("clock").textContent = new Intl.DateTimeFormat("fr-FR", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(now);
  $("today").textContent = new Intl.DateTimeFormat("fr-FR", { timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  if (!prayers.length) return;
  const next = findNextPrayer();
  if (!next) return;
  $("next-name").textContent = next.prayer.name;
  $("next-time").textContent = next.prayer.time;
  const seconds = Math.max(0, Math.floor((next.at - Date.now()) / 1000));
  $("countdown").textContent = `Dans ${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  if (new Date().getSeconds() === 0) renderPrayers();
}

async function init() {
  try {
    const response = await fetch(CALENDAR_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    calendar = Array.isArray(data.horaires) ? data.horaires : [];
    if (!calendar.length) throw new Error("Calendrier vide");
    if (!loadToday(true)) throw new Error("Date absente du calendrier");
    update();
    setInterval(update, 1000);
  } catch (error) {
    console.error("Impossible de charger le calendrier officiel", error);
    $("prayer-grid").innerHTML = `<article class="prayer"><div><h2>Horaires indisponibles</h2><p>Le calendrier officiel n'a pas pu être chargé.</p></div></article>`;
  }
}

init();
