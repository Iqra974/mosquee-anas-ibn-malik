const config = window.MOSQUEE_CONFIG;
const zone = config.timezone || "Indian/Reunion";
const $ = (id) => document.getElementById(id);

document.title = `${config.mosqueName} — Horaires de prière`;
document.querySelector("h1").textContent = config.mosqueName;
document.querySelector(".brand-ar").textContent = config.mosqueNameArabic;
$("location").textContent = config.location;
$("reminder-text").textContent = config.reminder.text;
$("reminder-source").textContent = config.reminder.source;
$("notice-text").textContent = config.notice;
$("ticker-text").textContent = `${config.ticker}     ${config.ticker}`;

function localParts() {
  const pieces = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  return Object.fromEntries(pieces.filter((p) => p.type !== "literal").map((p) => [p.type, p.value]));
}

function timeForToday(value, offset = 0) {
  const p = localParts();
  const [hour, minute] = value.split(":").map(Number);
  return Date.UTC(+p.year, +p.month - 1, +p.day + offset, hour - 4, minute, 0);
}

function findNextPrayer() {
  const now = Date.now();
  for (const prayer of config.prayers.filter((p) => !p.sunrise)) {
    const at = timeForToday(prayer.time);
    if (at > now) return { prayer, at };
  }
  const fajr = config.prayers.find((p) => p.name === "Fajr");
  return { prayer: fajr, at: timeForToday(fajr.time, 1) };
}

function renderPrayers() {
  const next = findNextPrayer().prayer.name;
  $("prayer-grid").innerHTML = config.prayers.map((p) => `
    <article class="prayer ${p.name === next ? "active" : ""}">
      <div><h2>${p.name}</h2><p class="arabic" lang="ar" dir="rtl">${p.arabic}</p></div>
      <time>${p.time}</time>
      <p class="iqama">${p.sunrise ? "Lever du soleil" : `Iqama <strong>${p.iqama}</strong>`}</p>
    </article>`).join("");
}

function update() {
  const now = new Date();
  $("clock").textContent = new Intl.DateTimeFormat("fr-FR", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(now);
  $("today").textContent = new Intl.DateTimeFormat("fr-FR", { timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  const next = findNextPrayer();
  $("next-name").textContent = next.prayer.name;
  $("next-time").textContent = next.prayer.time;
  const seconds = Math.max(0, Math.floor((next.at - Date.now()) / 1000));
  $("countdown").textContent = `Dans ${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  if (new Date().getSeconds() === 0) renderPrayers();
}

renderPrayers();
update();
setInterval(update, 1000);
