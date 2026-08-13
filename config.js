window.MOSQUEE_CONFIG = {
  mosqueName: "Mosquée Anas Ibn Malik",
  mosqueNameArabic: "مسجد أنس بن مالك",
  location: "La Réunion",
  timezone: "Indian/Reunion",

  // Laisser vide pour utiliser automatiquement le calendrier hégirien du navigateur.
  // La future page Admin pourra remplacer cette valeur selon l'annonce locale officielle.
  // Exemple : "29 Safar 1448 هـ"
  hijriDateOverride: "",

  // Horaires de PRIÈRE fixés par la mosquée (futurs champs de la page Admin).
  // Les horaires ADHAN restent issus du calendrier officiel JSON + correction altitude.
  prayers: [
    { name: "Fajr", arabic: "الفجر", iqama: "05:30" },
    { name: "Dhuhr", arabic: "الظهر", iqama: "12:45" },
    { name: "Asr", arabic: "العصر", iqama: "16:00" },
    { name: "Maghrib", arabic: "المغرب", iqama: "—" },
    { name: "Isha", arabic: "العشاء", iqama: "19:45" }
  ],

  // Heure de Jumu'a : futur champ modifiable depuis l'administration.
  jumua: "—"
};
