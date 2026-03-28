# Session 14 Février 2026 — Chat IA Anamnèse KSLB

## Contexte Projet
- **Application** : Questionnaires KSLB
- **Repo** : github.com/smartitemgalaxy/Questionnaires-KSLB
- **Objectif** : Remplacer le questionnaire papier 54 questions (25-30 min) par un chat LLM conversationnel de 21 questions (5-10 min)
- **Stratégie** : Compression systémique — le LLM regroupe les questions par système et adapte le flux selon les réponses
- **Infrastructure** : Google Apps Script → APP BILANS/Patients Data/{NOM_PRENOM_NSS}/

## Commits Poussés
| Commit | Message | Contenu |
|--------|---------|---------|
| 9742615 | Changement modèle LLM | qwen/qwen3-8b:free → mistralai/mistral-small-3.1-24b-instruct:free |
| a872baa | Fix patient identifié | Skip nom/prénom, system prompt dynamique, modèle mistral |
| 9f06647 | Fix patientInfo undefined | Définition dans AppContent pour le cas 'chat' |

## Prochaines Étapes (à faire)
1. Test parcours complet : Tester les 21 questions du chat en conditions réelles
2. Vérifier sauvegarde Drive : Confirmer que le JSON est bien envoyé à Google Drive à la fin
3. Test mobile : Valider l'ergonomie sur smartphone (cible principale patient)
4. Message de fin : Vérifier que le message de remerciement s'affiche (pas le JSON brut)
5. Gestion d'erreurs : Tester comportement si OpenRouter est down ou timeout

## Architecture Technique
```
Patient → LoginPage (nom/prénom/NSS)
    → AppContent (dashboard)
        → PatientApp (formulaires classiques)
        → WhatsAppChat (chat LLM) ← patientInfo passé en props
            → OpenRouter API (mistral-small-3.1-24b-instruct:free)
            → Google Apps Script (sauvegarde Drive)
```
