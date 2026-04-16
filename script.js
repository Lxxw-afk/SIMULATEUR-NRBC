let currentAnalysis = null;
let guidedSteps = [];
let currentStepIndex = 0;

function chargerScenario(type) {
  const input = document.getElementById("situationInput");

  const scenarios = {
    colisRadiologique:
      "Un colis suspect a été ouvert dans un bâtiment administratif. Un objet étrange à l’intérieur a été manipulé. Aucun signe visible immédiat, mais risque de contamination radiologique.",
    avpRadiologique:
      "Un véhicule transportant du matériel médical est accidenté. Le chauffeur est choqué, une autre victime est en état grave, et la route est fréquentée. Le risque radiologique n’est pas visible sur le véhicule mais figure sur le bon de transport.",
    fuiteChimique:
      "Plusieurs victimes au sol, forte odeur, fuite visible près d’un entrepôt industriel. Certaines personnes présentent une détresse respiratoire rapide.",
    metroChimique:
      "Dans une station de métro, plusieurs personnes tombent presque simultanément et convulsent. Un état de panique est visible.",
    poudreBiologique:
      "Une poudre blanche suspecte est découverte dans un colis reçu à domicile. Plusieurs personnes vivent sur place, aucun symptôme immédiat.",
    centreCommercial:
      "Plusieurs personnes présentent les mêmes symptômes dans un centre commercial. Aucune odeur, aucune cause visible, propagation progressive."
  };

  input.value = scenarios[type] || "";
}

function jouerAlarme() {
  const sirene = document.getElementById("sirene");
  const voix = document.getElementById("voix");

  if (!sirene || !voix) return;

  sirene.pause();
  voix.pause();

  sirene.currentTime = 0;
  voix.currentTime = 0;

  sirene.volume = 0.7;
  voix.volume = 1;

  sirene.play().catch(() => {});
  voix.play().catch(() => {});
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
  const gravite = evaluerGravite(texte, analyse.type);

  currentAnalysis = {
    ...analyse,
    gravite
  };

  afficherResultat(currentAnalysis);
  guidedSteps = buildGuidedSteps(currentAnalysis.type, currentAnalysis.gravite);
  currentStepIndex = 0;
  renderCurrentStep();
}

function detecterTypeCrise(texte) {
  const motsChimiques = [
    "odeur", "nuage", "chlore", "fumée", "fumee", "gaz", "fuite",
    "produit chimique", "respiratoire", "convuls", "toxique", "brûlure", "brulure"
  ];

  const motsBiologiques = [
    "symptôme", "symptomes", "virus", "bactérie", "bacterie",
    "poudre blanche", "contagion", "incubation", "épidémie", "epidemie",
    "pandémie", "pandemie", "laboratoire", "biologique"
  ];

  const motsRadiologiques = [
    "colis suspect", "radiologique", "radioactif", "irradiation",
    "contamination", "source", "rayonnement", "médical", "medical",
    "objet suspect", "matériel médical", "materiel medical"
  ];

  const scoreChimique = compterMots(texte, motsChimiques);
  const scoreBiologique = compterMots(texte, motsBiologiques);
  const scoreRadiologique = compterMots(texte, motsRadiologiques);

  if (scoreChimique > scoreBiologique && scoreChimique > scoreRadiologique) {
    return {
      type: "chimique",
      confiance: "élevée",
      raison: "Présence d’indices typiques : odeur, nuage, fuite, détresse respiratoire ou convulsions."
    };
  }

  if (scoreBiologique > scoreChimique && scoreBiologique > scoreRadiologique) {
    return {
      type: "biologique",
      confiance: "élevée",
      raison: "Présence d’indices typiques : symptômes progressifs, poudre suspecte, laboratoire, propagation."
    };
  }

  if (scoreRadiologique > scoreChimique && scoreRadiologique > scoreBiologique) {
    return {
      type: "radiologique",
      confiance: "élevée",
      raison: "Présence d’indices typiques : objet suspect, contamination, irradiation, matériel médical ou source radioactive."
    };
  }

  return {
    type: "inconnu",
    confiance: "moyenne",
    raison: "Les indices sont insuffisants ou mélangés. Une reconnaissance NRBC complète est nécessaire."
  };
}

function evaluerGravite(texte, type) {
  let score = 0;

  const graves = [
    "plusieurs victimes", "victimes au sol", "convuls", "état grave", "etat grave",
    "panique", "fuite visible", "fuite active", "nuage", "forte odeur",
    "route fréquentée", "route frequentee", "centre commercial", "métro", "metro"
  ];

  for (const mot of graves) {
    if (texte.includes(mot)) score += 1;
  }

  if (type === "chimique") score += 1;
  if (texte.includes("plusieurs") || texte.includes("nombreux")) score += 1;

  if (score <= 1) return "faible";
  if (score <= 3) return "modérée";
  if (score <= 5) return "sévère";
  return "critique";
}

function compterMots(texte, liste) {
  let score = 0;
  for (const mot of liste) {
    if (texte.includes(mot)) score++;
  }
  return score;
}

function afficherResultat(analyse) {
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

  const gravityClass = {
    "faible": "gravity-badge gravity-faible",
    "modérée": "gravity-badge gravity-moderee",
    "sévère": "gravity-badge gravity-severe",
    "critique": "gravity-badge gravity-critique"
  };

  resultat.innerHTML = `
    <div class="${classes[analyse.type]}">${libelles[analyse.type]}</div>
    <p><strong>Niveau de confiance :</strong> ${analyse.confiance}</p>
    <p><strong>Pourquoi :</strong> ${analyse.raison}</p>
    <div class="${gravityClass[analyse.gravite]}">Gravité : ${analyse.gravite}</div>
  `;
}

function buildGuidedSteps(type, gravite) {
  const base = [
    {
      title: "Reconnaissance initiale",
      content: "Confirmer les indices, garder ses distances, observer la scène et recueillir les premières informations."
    },
    {
      title: "Mise en sécurité",
      content: "Établir un périmètre de sécurité, limiter les accès, protéger les primo-intervenants et éloigner les non-impliqués."
    },
    {
      title: "Zonage",
      content: "Mettre en place les zones adaptées à la menace : soutien, contrôlée, exclusion selon le risque et le contexte."
    }
  ];

  const specific = {
    chimique: [
      {
        title: "Positionnement",
        content: "Se positionner dos au vent, en amont du nuage ou de la fuite, et éviter toute traversée de zone toxique."
      },
      {
        title: "Détection chimique",
        content: "Utiliser le matériel adapté : multigaz, PID/FID, tubes colorimétriques, détecteur CWA selon les indices."
      },
      {
        title: "Victimes et évacuation",
        content: "Évacuer si possible en sécurité, regrouper les exposés, prévenir les sanitaires et prévoir la décontamination."
      }
    ],
    biologique: [
      {
        title: "Confinement / isolement",
        content: "Confinement des non-exposés si nécessaire, isolement des personnes suspectes ou contaminées, limitation stricte des contacts."
      },
      {
        title: "Prélèvements et protection",
        content: "Utiliser les EPI adaptés, éviter tout contact, préparer les moyens de prélèvement si autorisés."
      },
      {
        title: "Chaîne sanitaire",
        content: "Regrouper les exposés, prévenir les unités sanitaires, suivre les procédures de décontamination et de traçabilité."
      }
    ],
    radiologique: [
      {
        title: "Isolement de la source",
        content: "Isoler l’objet ou la source, interdire toute manipulation directe, limiter le temps d’exposition."
      },
      {
        title: "Mesures radiologiques",
        content: "Employer les appareils adaptés : dosimètre, radiamètre, contaminamètre, compteur Geiger selon le besoin."
      },
      {
        title: "Gestion des exposés",
        content: "Isoler les personnels exposés, regrouper les contaminés potentiels, mettre en place confinement ou évacuation selon le cas."
      }
    ],
    inconnu: [
      {
        title: "Levée de doute",
        content: "Considérer la situation comme potentiellement NRBC et engager une reconnaissance technique complète."
      },
      {
        title: "Protection maximale",
        content: "Protéger les personnels, restreindre les accès, observer à distance et adapter les détecteurs aux premiers indices."
      },
      {
        title: "Décision",
        content: "Attendre la confirmation de la menace avant engagement approfondi ou action spécialisée."
      }
    ]
  };

  const finish = [
    {
      title: "Coordination interservices",
      content: "Informer les autorités et les unités sanitaires, coordonner avec les services engagés et préparer les renforts si nécessaire."
    },
    {
      title: "Sortie et décontamination",
      content: "Appliquer la procédure de sortie, décontaminer personnels et matériels, maintenir la traçabilité."
    },
    {
      title: "Compte rendu",
      content: "Rédiger un compte rendu de situation, noter les expositions potentielles et sécuriser la scène pour la suite."
    }
  ];

  const result = [...base, ...(specific[type] || specific.inconnu), ...finish];

  if (gravite === "critique") {
    result.splice(3, 0, {
      title: "Mesures d’urgence renforcées",
      content: "Déclencher une réponse renforcée, élargir rapidement le périmètre, prioriser les victimes critiques et anticiper une aggravation."
    });
  }

  if (gravite === "faible") {
    result.push({
      title: "Stabilisation",
      content: "Maintenir la surveillance, confirmer l’absence d’aggravation et ajuster le dispositif sans surexposition des moyens."
    });
  }

  return result;
}

function startGuidedMode() {
  if (!currentAnalysis) {
    afficherErreur("Analyse d’abord une situation avant de démarrer la procédure guidée.");
    return;
  }

  guidedSteps = buildGuidedSteps(currentAnalysis.type, currentAnalysis.gravite);
  currentStepIndex = 0;
  renderCurrentStep();
}

function renderCurrentStep() {
  const stepMeta = document.getElementById("stepMeta");
  const stepBox = document.getElementById("stepBox");

  if (!guidedSteps.length) {
    stepMeta.innerHTML = "<p>Aucune procédure lancée.</p>";
    stepBox.innerHTML = "<p>L’étape en cours s’affichera ici.</p>";
    return;
  }

  const step = guidedSteps[currentStepIndex];
  stepMeta.innerHTML = `
    <p class="step-progress">Étape ${currentStepIndex + 1} / ${guidedSteps.length}</p>
  `;

  stepBox.innerHTML = `
    <div class="step-title">${step.title}</div>
    <p>${step.content}</p>
  `;
}

function nextStep() {
  if (!guidedSteps.length) return;
  if (currentStepIndex < guidedSteps.length - 1) {
    currentStepIndex++;
    renderCurrentStep();
  }
}

function prevStep() {
  if (!guidedSteps.length) return;
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderCurrentStep();
  }
}

function afficherErreur(message) {
  const resultat = document.getElementById("resultat");
  const stepMeta = document.getElementById("stepMeta");
  const stepBox = document.getElementById("stepBox");

  resultat.innerHTML = `<p>${message}</p>`;
  stepMeta.innerHTML = `<p>Aucune procédure lancée.</p>`;
  stepBox.innerHTML = `<p>L’étape en cours s’affichera ici.</p>`;
}
