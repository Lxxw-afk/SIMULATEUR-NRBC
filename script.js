function chargerExemple(type) {
  const input = document.getElementById("situationInput");

  const exemples = {
    chimique: "Plusieurs victimes au sol, forte odeur, nuage visible près d’un entrepôt industriel. Certaines personnes présentent une détresse respiratoire rapide.",
    biologique: "Plusieurs personnes présentent les mêmes symptômes dans un bâtiment fermé. Aucune odeur, aucune cause visible, propagation progressive.",
    radiologique: "Un colis suspect a été ouvert. Aucun signe visible, mais un objet étrange à l’intérieur a été manipulé par un personnel."
  };

  input.value = exemples[type] || "";
}

function jouerAlarme() {
  const alarm = document.getElementById("alarmSound");
  if (!alarm) return;

  alarm.currentTime = 0;
  alarm.play().catch(() => {
    // Certains navigateurs bloquent l'audio sans interaction préalable.
  });
}

function analyserSituation() {
  const input = document.getElementById("situationInput");
  const texte = input.value.trim().toLowerCase();

  if (!texte) {
    afficherErreur("Merci de décrire une situation avant l’analyse.");
    return;
  }

  jouerAlarme();

  const analyse = detecterTypeCrise(texte);
  afficherResultat(analyse.type, analyse.confiance, analyse.raison);
  afficherEtapes(analyse.type);
}

function detecterTypeCrise(texte) {
  const motsChimiques = [
    "odeur", "nuage", "chlore", "fumée", "gaz", "fuite",
    "produit chimique", "respiratoire", "convuls", "toxique", "brûlure"
  ];

  const motsBiologiques = [
    "symptôme", "symptomes", "virus", "bactérie", "bacterie",
    "poudre blanche", "contagion", "incubation", "épidémie", "pandémie",
    "laboratoire", "biologique"
  ];

  const motsRadiologiques = [
    "colis suspect", "radiologique", "radioactif", "irradiation",
    "contamination", "source", "rayonnement", "médical", "medical",
    "aucun signe visible", "objet suspect"
  ];

  let scoreChimique = compterMots(texte, motsChimiques);
  let scoreBiologique = compterMots(texte, motsBiologiques);
  let scoreRadiologique = compterMots(texte, motsRadiologiques);

  if (scoreChimique > scoreBiologique && scoreChimique > scoreRadiologique) {
    return {
      type: "chimique",
      confiance: "élevée",
      raison: "Présence d’indices typiques : odeur, nuage, fuite, détresse respiratoire ou produit toxique."
    };
  }

  if (scoreBiologique > scoreChimique && scoreBiologique > scoreRadiologique) {
    return {
      type: "biologique",
      confiance: "élevée",
      raison: "Présence d’indices typiques : symptômes progressifs, propagation, poudre suspecte ou agent infectieux."
    };
  }

  if (scoreRadiologique > scoreChimique && scoreRadiologique > scoreBiologique) {
    return {
      type: "radiologique",
      confiance: "élevée",
      raison: "Présence d’indices typiques : objet suspect, contamination, irradiation, source radioactive."
    };
  }

  return {
    type: "inconnu",
    confiance: "moyenne",
    raison: "La situation ne permet pas de trancher clairement. Une reconnaissance NRBC complète est nécessaire."
  };
}

function compterMots(texte, liste) {
  let score = 0;
  for (const mot of liste) {
    if (texte.includes(mot)) {
      score++;
    }
  }
  return score;
}

function afficherResultat(type, confiance, raison) {
  const resultat = document.getElementById("resultat");

  const libelles = {
    chimique: "☣️ Crise à dominante chimique",
    biologique: "🧬 Crise à dominante biologique",
    radiologique: "☢️ Crise à dominante radiologique",
    inconnu: "⚠️ Crise NRBC non déterminée"
  };

  const classes = {
    chimique: "alert-box alert-chimique",
    biologique: "alert-box alert-biologique",
    radiologique: "alert-box alert-radiologique",
    inconnu: "alert-box alert-inconnu"
  };

  resultat.innerHTML = `
    <div class="${classes[type]}">
      ${libelles[type]}
    </div>
    <p><strong>Niveau de confiance :</strong> ${confiance}</p>
    <p><strong>Pourquoi :</strong> ${raison}</p>
  `;
}

function afficherEtapes(type) {
  const etapes = document.getElementById("etapes");

  const procedures = {
    chimique: [
      "Se positionner dos au vent et en amont du nuage ou de la fuite.",
      "Établir immédiatement un périmètre de sécurité et un zonage.",
      "Éviter toute exposition directe et interdire l’accès aux non-spécialistes.",
      "Utiliser les équipements adaptés, notamment l’ARI.",
      "Réaliser les relevés avec le matériel approprié : multigaz, PID/FID, tubes colorimétriques, détecteur CWA selon le contexte.",
      "Évacuer les victimes si possible en sécurité, après prise en compte du risque de contamination.",
      "Regrouper les exposés et prévenir les unités sanitaires.",
      "Déclencher la décontamination et informer les autorités compétentes."
    ],
    biologique: [
      "Identifier un risque biologique et éviter tout contact direct avec la source suspecte.",
      "Mettre en place un zonage clair et limiter les déplacements.",
      "Confinement des personnes non exposées si nécessaire.",
      "Isolement des personnes exposées ou suspectes.",
      "Utiliser les EPI adaptés et protéger les primo-intervenants.",
      "Procéder aux premiers prélèvements si les moyens sont disponibles et autorisés.",
      "Regrouper les exposés et prévenir les unités sanitaires.",
      "Suivre la chaîne de décontamination et sécuriser durablement la zone."
    ],
    radiologique: [
      "Identifier un risque radiologique et isoler immédiatement l’objet ou la source.",
      "Mettre en place le zonage et éloigner toute personne non indispensable.",
      "Réaliser les relevés avec les appareils adaptés : radiamètre, contaminamètre, dosimètre.",
      "Isoler les personnels exposés et regrouper les contaminés potentiels.",
      "Limiter le temps d’exposition et augmenter la distance à la source.",
      "Ne jamais manipuler directement un objet suspect sans matériel adapté.",
      "Mettre en place confinement ou évacuation selon la situation.",
      "Prévenir les unités sanitaires et lancer la chaîne de décontamination si nécessaire."
    ],
    inconnu: [
      "Considérer la situation comme potentiellement NRBC.",
      "Établir un périmètre et limiter les accès.",
      "Observer à distance et recueillir un maximum d’informations.",
      "Protéger immédiatement les personnels engagés.",
      "Mettre en place une reconnaissance NRBC complète.",
      "Utiliser les détecteurs adaptés en fonction des premiers indices.",
      "Isoler les personnes exposées et prévenir les unités sanitaires.",
      "Attendre la confirmation du type de menace avant engagement approfondi."
    ]
  };

  const liste = procedures[type] || procedures.inconnu;

  etapes.innerHTML = `
    <ol>
      ${liste.map(etape => `<li>${etape}</li>`).join("")}
    </ol>
  `;
}

function afficherErreur(message) {
  const resultat = document.getElementById("resultat");
  const etapes = document.getElementById("etapes");

  resultat.innerHTML = `<p>${message}</p>`;
  etapes.innerHTML = `<p>Les étapes s’afficheront ici après analyse.</p>`;
}
