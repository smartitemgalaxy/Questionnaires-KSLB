# Audit UX KSLB — 17 février 2026

## Contexte
Audit réalisé sur l'app Questionnaires KSLB (localhost:5175) en mode dev patient.
Screenshots pris via Playwright : login, dashboard, chat, formulaire classique, vue mobile.

---

## AXE 1 — Interface du chat (CRITIQUE)

### Problèmes constatés
- **Erreur 429 (rate limit) dès le 1er message** : la clé OpenRouter free-tier est épuisée/rate-limitée. Le patient voit "⚠️ Connexion au serveur impossible" immédiatement → expérience morte dès le départ.
- **Compteur "Q0/21"** dans le header : démarre à 0 au lieu de 1. Impression de bug.
- **Bouton envoyer désactivé** alors que l'input est actif : confusion utilisateur.
- **Message fallback incohérent** : "⚠️ Connexion impossible" suivi de "Bonjour Dev ! voici la première question" dans la même bulle. Contradictoire : est-on connecté ou pas ?
- **Barre de progression invisible** : à 0%, on ne la voit pas du tout.
- **Zone de chat vide immense** : fond beige WhatsApp vide, impression de chat mort.

### Actions à faire
- [ ] Résoudre le problème d'API (nouvelle clé, ou fallback Groq/local)
- [ ] Compteur Q1/21 (pas Q0/21) au démarrage
- [ ] Séparer le message d'erreur du message de bienvenue (2 bulles distinctes)
- [ ] Barre de progression visible dès le début (au moins 5%)
- [ ] État initial plus accueillant (avatar animé, message d'accueil clair)

---

## AXE 2 — Lenteur / adaptativité des questions (CRITIQUE)

### Problèmes constatés
- **Impossible de tester le parcours complet** : l'API 429 bloque tout.
- **System prompt massif (~110 lignes)** envoyé à chaque message : consomme des tokens, ralentit la réponse.
- **Pas de streaming** : le patient attend que toute la réponse arrive d'un coup. Sur modèle gratuit = 5-15 secondes de "écrit..." sans feedback visuel.
- **Aucune preuve que la compression systémique fonctionne** : pas de test de bout en bout des 21 questions.

### Actions à faire
- [ ] Implémenter le streaming SSE pour affichage progressif des réponses
- [ ] Réduire le system prompt (version condensée, ou le découper par phase)
- [ ] Tester le parcours complet 21 questions avec un vrai patient fictif
- [ ] Mesurer le temps moyen par question et le temps total du parcours
- [ ] Ajouter un fallback intelligent si le LLM est trop lent (>10s)

---

## AXE 3 — Navigation dans l'app (IMPORTANT)

### Problèmes constatés
- **Deux parcours concurrents** : "Nouveau bilan" (formulaire classique 9 pages, 54 questions) vs "Chat IA" (bouton navbar). Le patient ne sait pas lequel prendre.
- **Le formulaire classique est le parcours principal** : bouton "Nouveau bilan" proéminent + "Commencer mon premier bilan" → tous les deux lancent l'ancien parcours.
- **Le Chat IA est un bouton secondaire** : petit bouton dans la navbar, facile à rater. Or c'est censé être LE parcours principal qui remplace le formulaire.
- **Pas de hiérarchie claire** : rien n'indique au patient que le Chat IA est la méthode recommandée.

### Actions à faire
- [ ] Faire du Chat IA le parcours par DÉFAUT (bouton principal du dashboard)
- [ ] Reléguer le formulaire classique en option secondaire ("Mode formulaire classique")
- [ ] Supprimer ou renommer "Nouveau bilan" → "Commencer mon anamnèse" qui lance le chat
- [ ] Ajouter un texte explicatif court : "Répondez à quelques questions en discutant avec notre assistant (5-10 min)"
- [ ] Retirer le bouton "Chat IA" de la navbar (plus nécessaire si c'est le parcours par défaut)

---

## AXE 4 — Design mobile (IMPORTANT)

### Problèmes constatés
- **Navbar surchargée** : logo + "QUITTER CHAT" + "DÉCONNEXION" s'empilent mal sur petit écran.
- **Texte sécurité en bas en MAJUSCULES** : "LES DONNÉES SONT SÉCURISÉES..." est agressif et prend de la place.
- **Zone de chat vide** : énorme espace beige inutilisé (car API morte).
- **Formulaire classique pas mobile-first** : champs larges, trop de scroll, boutons pas optimisés tactile.
- **Pas de vue optimisée téléphone** pour le chat : le clavier virtuel va cacher la zone d'input.

### Actions à faire
- [ ] Navbar mobile simplifiée : juste le logo + bouton retour, actions dans un menu ⋯
- [ ] Texte sécurité : plus petit, pas en majuscules
- [ ] Chat : gérer le clavier virtuel (scroll auto, input toujours visible)
- [ ] Bulles de chat : taille adaptée mobile (max-width 90% au lieu de 85%)
- [ ] Touch targets : boutons min 44x44px pour le tactile
- [ ] Test avec viewport iPhone SE (375x667) et iPhone 14 (390x844)

---

## Priorités

| Priorité | Axe | Pourquoi |
|----------|-----|----------|
| 🔴 P0 | API morte (Axe 1+2) | Sans API, rien ne fonctionne |
| 🔴 P1 | Navigation — Chat IA = parcours par défaut (Axe 3) | Le but du projet est de remplacer le formulaire |
| 🟡 P2 | Interface chat — UX améliorée (Axe 1) | Première impression du patient |
| 🟡 P3 | Streaming + performance (Axe 2) | Fluidité du parcours |
| 🟢 P4 | Design mobile (Axe 4) | Optimisation finale |

---

## Rappel projet
- **Objectif** : Remplacer 54 questions / 25-30 min par 21 questions / 5-10 min
- **Stratégie** : Compression systémique — le LLM adapte le flux selon les réponses
- **Cible** : Patients sur smartphone, avant leur RDV kiné
