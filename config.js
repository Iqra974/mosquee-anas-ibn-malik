/*
 * FICHIER À MODIFIER CHAQUE JOUR (ou chaque mois) depuis GitHub.
 * Les horaires ci-dessous sont des EXEMPLES et doivent être remplacés
 * par les horaires officiels de la Mosquée Anas Ibn Malik.
 */
window.MOSQUEE_CONFIG = {
  mosqueName: "Mosquée Anas Ibn Malik",
  mosqueNameArabic: "مسجد أنس بن مالك",
  location: "La Réunion",
  timezone: "Indian/Reunion",
  prayers: [
    { name: "Fajr", arabic: "الفجر", time: "05:08", iqama: "05:30" },
    { name: "Chourouq", arabic: "الشروق", time: "06:23", iqama: "—", sunrise: true },
    { name: "Dhuhr", arabic: "الظهر", time: "12:21", iqama: "12:45" },
    { name: "Asr", arabic: "العصر", time: "15:42", iqama: "16:00" },
    { name: "Maghrib", arabic: "المغرب", time: "18:18", iqama: "18:23" },
    { name: "Isha", arabic: "العشاء", time: "19:26", iqama: "19:45" }
  ],
  reminder: {
    text: "La prière est prescrite aux croyants à des temps déterminés.",
    source: "Coran, 4:103"
  },
  notice: "Les horaires affichés sont donnés à titre indicatif : suivez les annonces de la mosquée.",
  ticker: "Cours et rappels : consultez les annonces de la Mosquée Anas Ibn Malik. • Pensez à mettre vos téléphones en silencieux. • Qu’Allah accepte nos prières."
};
