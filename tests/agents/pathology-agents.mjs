#!/usr/bin/env node
/**
 * Pathology Test Agents — Tests the WhatsApp Chat AI with 8 kinesitherapy pathologies.
 * Each agent simulates a real patient through 5 exchanges (Q1-Q5) to detect:
 *   - Empty responses
 *   - Invalid JSON from LLM
 *   - Timeout / API failures
 *   - Wrong question progression
 *   - Red flag detection
 *   - Response latency
 *
 * Usage: node tests/agents/pathology-agents.mjs [--full] [--all] [--pathology=lombalgie]
 *   (default)     : 3 agents x 6 exchanges, ~3min total
 *   --all         : all 8 agents (slower, ~10min)
 *   --full        : run all 21 questions per agent
 *   --pathology=X : run only one pathology
 */

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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';

const MODEL_CHAIN = [
    'nvidia/nemotron-nano-9b-v2:free',
    'google/gemma-3-12b-it:free',
    'google/gemma-3-4b-it:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
];

// Ollama local — fallback ultime, jamais rate-limited
const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';
const OLLAMA_MODEL = 'qwen3:8b';

// ─── System prompt (same as WhatsAppChat.tsx) ───
function getSystemPrompt(prenom, nom) {
    return `Vous êtes un assistant médical intelligent pour le cabinet de kinésithérapie KSLB.
Votre rôle est de mener un entretien d'anamnèse professionnel et bienveillant pour recueillir les informations médicales du patient AVANT sa consultation.

## PATIENT IDENTIFIÉ
Le patient est déjà connecté et identifié :
- Prénom : ${prenom}
- Nom : ${nom}
NE DEMANDEZ PAS son nom ou prénom. Ces informations sont déjà enregistrées.

## RÈGLES ABSOLUES
1. Parlez en Français. Ton chaleureux mais professionnel (style messagerie).
2. Posez UNE SEULE question à la fois, jamais de rafale.
3. Langage patient accessible — pas de jargon médical sauf si le patient l'utilise.
4. Si le patient donne une réponse floue, demandez des précisions avec tact.
5. Ne donnez JAMAIS de diagnostic. Vous préparez le dossier pour le kiné.
6. Utilisez quelques emojis avec parcimonie pour rendre l'échange humain.
7. Si vous détectez un RED FLAG, ne paniquez pas le patient mais notez-le.

## STRUCTURE DE L'INTERROGATOIRE
### PHASE 1 — MOTIF DE CONSULTATION (questions 1 à 6)
Q1. Motif + zone corporelle
Q2. Date apparition + circonstances
Q3. Caractéristiques douleur (type, irradiation)
Q4. Durée crises, fréquence, évolution
Q5. Facteurs aggravants / soulageants
Q6. Symptômes associés + EVA

### PHASE 2 — ANTÉCÉDENTS MÉDICAUX (questions 7 à 13)
Q7-Q13. Systèmes : cardio, respi, endocrinien, digestif, rénal, uro-gynéco, filet sécurité

### PHASE 3 — CONTEXTE ET MODE DE VIE (questions 14 à 21)
Q14-Q21. Imagerie, traitements antérieurs, chirurgies, traumatismes, médicaments/allergies, mode de vie, profession/sport, objectifs

## FORMAT DE RÉPONSE
Répondez UNIQUEMENT en JSON valide, sans markdown ni backticks :
{"message":"votre message","phase":1,"question_num":1,"red_flags":[],"collected":{},"progress":5,"done":false}

## DÉMARRAGE
Premier message : saluez ${prenom} par son prénom et posez directement Q1.`;
}

// ─── 8 Pathology Agents ───
const PATHOLOGY_AGENTS = {
    lombalgie: {
        name: 'Lombalgie chronique',
        patient: { prenom: 'Martin', nom: 'Dupont' },
        responses: [
            "Bonjour, je suis prêt pour le questionnaire médical.",
            "J'ai mal au bas du dos depuis 3 mois, c'est apparu en soulevant un carton au travail",
            "C'etait il y a 3 mois, en soulevant un carton lourd. J'ai senti un craquement",
            "C'est un tiraillement constant, ca descend parfois dans la jambe droite jusqu'au mollet",
            "Ca dure toute la journee, c'est pire le matin au reveil. Ca empire depuis 2 semaines",
            "Rester assis longtemps aggrave, marcher un peu soulage. Le chaud aide aussi",
            "J'ai des fourmillements dans le pied droit parfois, douleur a 6/10",
            // Phase 2
            "Non, pas de probleme cardiaque",
            "Non, rien de respiratoire",
            "Non, pas de diabete ni thyroide",
            "Un peu de reflux gastrique mais rien de grave",
            "Non, rien au niveau renal",
            "Non, pas de probleme de prostate",
            "Non, je crois qu'on a fait le tour",
            // Phase 3
            "J'ai fait une radio il y a 2 mois, le medecin a dit que c'etait normal",
            "J'ai fait 10 seances de kine il y a 1 mois, ca a un peu aide",
            "Non, jamais opere",
            "J'ai eu un accident de moto il y a 10 ans mais rien au dos",
            "Je prends du paracetamol quand j'ai trop mal, pas d'allergie",
            "Je ne fume pas, je dors mal a cause de la douleur, un peu stresse par le travail",
            "Je suis magasinier, beaucoup de port de charges. Je fais du velo le weekend",
            "Je voudrais pouvoir retravailler sans douleur et reprendre le sport normalement",
        ],
    },

    cervicalgie: {
        name: 'Cervicalgie + céphalées',
        patient: { prenom: 'Sophie', nom: 'Martin' },
        responses: [
            "Bonjour, je suis prête pour le questionnaire.",
            "J'ai des douleurs au niveau du cou et des maux de tête qui vont avec depuis 6 semaines",
            "Ca a commence progressivement, je travaille beaucoup sur ordinateur",
            "C'est une raideur dans le cou avec des douleurs qui montent vers la tete, surtout du cote droit",
            "Les maux de tete durent 2-3 heures, j'en ai presque tous les jours. Ca empire",
            "L'ecran aggrave, les positions statiques aussi. Les etirements et le repos soulagent un peu",
            "Parfois des vertiges quand je tourne la tete vite, douleur a 5/10",
            "Non rien de cardiaque",
            "Non",
            "Non",
            "Non",
            "Non",
            "Pas de probleme gyneco particulier",
            "Non c'est tout",
            "Non pas d'imagerie pour le moment",
            "J'ai essaye l'osteo une fois, ca a soulage 2 jours",
            "Non jamais operee",
            "Non pas de traumatisme",
            "Ibuprofene quand j'ai trop mal, allergie au pollen mais c'est tout",
            "Non fumeuse, sommeil perturbe par les douleurs, stress au travail important",
            "Comptable, assise 8h/jour devant l'ecran. Un peu de yoga le soir",
            "Pouvoir travailler sans maux de tete et retrouver de la mobilite dans le cou",
        ],
    },

    epaule: {
        name: 'Tendinite épaule',
        patient: { prenom: 'Pierre', nom: 'Leroy' },
        responses: [
            "Bonjour, je commence.",
            "J'ai mal a l'epaule droite, surtout quand je leve le bras",
            "Ca a commence il y a 2 mois apres avoir peint le plafond de ma maison pendant tout un weekend",
            "C'est une douleur vive quand je leve le bras au dessus de l'epaule, comme un pincement",
            "La douleur dure quelques secondes a chaque mouvement, mais c'est frequent. Stable depuis 1 mois",
            "Lever le bras aggrave, dormir sur le cote droit aussi. Le repos soulage",
            "Pas de fourmillement ni gonflement, douleur a 7/10 quand je fais le mouvement",
            "Un peu d'hypertension traitee par medicament",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non rien d'autre",
            "Non pas d'imagerie",
            "Anti-inflammatoires pendant 2 semaines, ca n'a pas trop aide",
            "Opere du genou il y a 5 ans (menisque)",
            "Non pas de traumatisme a l'epaule",
            "Amlodipine pour la tension, pas d'allergie",
            "Ancien fumeur arrete il y a 3 ans, bon sommeil, pas trop stresse",
            "Peintre en batiment, beaucoup de gestes au dessus de la tete. Football le dimanche",
            "Pouvoir retravailler sans douleur et rejouer au foot",
        ],
    },

    genou: {
        name: 'Gonalgie post-entorse',
        patient: { prenom: 'Lucas', nom: 'Bernard' },
        responses: [
            "Salut, on y va.",
            "J'ai mal au genou gauche depuis un mois, ca a lache pendant un match de foot",
            "Il y a 4 semaines pendant un match, j'ai fait un changement de direction et j'ai senti mon genou partir",
            "C'est instable, j'ai l'impression que ca peut lacher. Douleur sur le cote interne",
            "Quand je marche ca va a peu pres, mais des que je tourne ou descends les escaliers c'est douloureux",
            "Le sport aggrave, monter les escaliers aussi. La glace soulage bien",
            "Le genou a gonfle les premiers jours, douleur a 4/10 au repos, 8/10 en appui",
            "Non rien",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non c'est tout",
            "J'ai fait une IRM la semaine derniere, on m'a dit entorse du ligament lateral interne grade 2",
            "Rien pour le moment, c'est pour ca que je viens",
            "Non jamais opere",
            "J'ai eu une entorse a la cheville droite il y a 2 ans",
            "Pas de medicament, pas d'allergie",
            "Non fumeur, bon dormeur, un peu frustre de pas pouvoir jouer au foot",
            "Informaticien, assis toute la journee. Football 2 fois par semaine habituellement",
            "Retrouver la stabilite du genou et reprendre le foot dans 2-3 mois",
        ],
    },

    fibromyalgie: {
        name: 'Fibromyalgie',
        patient: { prenom: 'Nathalie', nom: 'Moreau' },
        responses: [
            "Bonjour, je suis prete.",
            "J'ai des douleurs un peu partout, surtout le dos, les epaules et les cuisses. C'est diffus",
            "Ca a commence il y a environ 2 ans, progressivement, sans evenement declencheur precis",
            "C'est comme des courbatures permanentes, une sensation de brulure dans les muscles",
            "C'est present quasi en permanence, avec des poussees plus fortes qui durent 2-3 jours",
            "Le stress et le froid aggravent beaucoup, la chaleur et les bains chauds soulagent un peu",
            "Fatigue intense, troubles du sommeil, brouillard mental parfois. Douleur a 6/10 en moyenne",
            "Non rien de cardiaque",
            "Non",
            "Hypothyroidie traitee par Levothyrox",
            "Colon irritable depuis des annees",
            "Non",
            "Pas de probleme gyneco",
            "Syndrome de Raynaud aux mains quand il fait froid",
            "IRM et bilan sanguin complet, tout est normal. Le rhumatologue a diagnostique la fibromyalgie",
            "Kine 2 fois, piscine, yoga, antidepresseurs. Le yoga aide le plus",
            "Non jamais operee",
            "Non pas de traumatisme",
            "Levothyrox, duloxetine, tramadol en cas de crise. Allergie a la penicilline",
            "Non fumeuse, insomnie chronique, anxiete importante",
            "Enseignante en college, debout beaucoup. Natation 1 fois par semaine",
            "Mieux gerer mes crises et pouvoir dormir correctement",
        ],
    },

    postop_prothese: {
        name: 'Post-op prothèse hanche',
        patient: { prenom: 'Gerard', nom: 'Blanc' },
        responses: [
            "Bonjour.",
            "Je viens de me faire operer de la hanche droite, prothese totale il y a 3 semaines",
            "L'operation etait le 28 janvier, arthrose severe depuis 5 ans qui ne repondait plus aux traitements",
            "C'est raide et douloureux quand je bouge, surtout en flexion. La cicatrice tire un peu",
            "La douleur est constante mais supportable, elle diminue progressivement depuis l'operation",
            "La marche aide a debloquer, rester assis trop longtemps raidit. Les exercices du chirurgien soulagent",
            "Pas de gonflement anormal, pas de fievre, douleur a 4/10. Un peu de boiterie",
            "Hypertension arterielle",
            "Non",
            "Diabete type 2 bien equilibre",
            "Non",
            "Non",
            "Non pas de probleme de prostate",
            "De l'arthrose dans les deux genoux aussi",
            "Radio post-op de controle, tout est bien en place",
            "Kine a domicile depuis 2 semaines, 3 fois par semaine",
            "Prothese de hanche droite il y a 3 semaines, appendicite il y a 30 ans",
            "Non pas de chute ni traumatisme",
            "Metformine, amlodipine, paracetamol. Pas d'allergie",
            "Ancien fumeur, sommeil ameliore depuis l'operation, zen",
            "Retraite depuis 2 ans, ancien menuisier. Jardinage et petanque",
            "Remarcher normalement, reprendre le jardin et la petanque",
        ],
    },

    canal_carpien: {
        name: 'Syndrome canal carpien',
        patient: { prenom: 'Claire', nom: 'Petit' },
        responses: [
            "Bonjour, on commence.",
            "J'ai des fourmillements et des engourdissements dans la main droite, surtout la nuit",
            "Ca a commence il y a 6 mois, progressivement. Je travaille beaucoup au clavier",
            "C'est des fourmillements dans le pouce, l'index et le majeur. Parfois une decharge electrique",
            "Les fourmillements me reveillent la nuit, 3-4 fois par semaine. Ca empire ces derniers mois",
            "Taper au clavier aggrave, secouer la main soulage. Porter des objets lourds aussi c'est penible",
            "Perte de force dans la pince pouce-index, je laisse tomber des objets. Douleur a 3/10 mais gene a 7/10",
            "Non rien",
            "Non",
            "Non",
            "Non",
            "Non",
            "Pas de probleme gyneco, pas enceinte",
            "Tendinite au coude droit il y a 2 ans",
            "EMG confirme syndrome du canal carpien modere a droite",
            "Attelle de nuit depuis 1 mois, aide un peu pour le sommeil",
            "Non jamais operee",
            "Non",
            "Pilule contraceptive, pas d'allergie",
            "Non fumeuse, sommeil perturbe par les fourmillements, un peu stressée",
            "Secretaire medicale, clavier toute la journee. Pas de sport",
            "Pouvoir travailler sans gene et dormir sans etre reveillee par les fourmillements",
        ],
    },

    entorse_cheville: {
        name: 'Entorse cheville récidivante',
        patient: { prenom: 'Mehdi', nom: 'Kaci' },
        responses: [
            "Salut, c'est parti.",
            "Je me suis tordu la cheville droite il y a 10 jours en courant, et c'est la 3eme fois en 1 an",
            "Il y a 10 jours en faisant un footing, mon pied est parti vers l'interieur sur un trottoir",
            "C'est douloureux sur l'exterieur de la cheville, ca tire quand je marche",
            "Ca fait mal surtout en marchant, le gonflement a bien diminue mais c'est encore sensible",
            "Marcher sur terrain inegal aggrave, le repos et la glace soulagent",
            "Instabilite de la cheville, impression que ca peut lacher. Douleur a 3/10 au repos",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non",
            "Non c'est tout",
            "Radio faite aux urgences, pas de fracture. Ligaments etires mais pas rompus",
            "Entorse il y a 6 mois soignee avec chevillere, et une autre il y a 1 an pas soignee du tout",
            "Non jamais opere",
            "Les 2 entorses precedentes de la meme cheville",
            "Pas de medicament, pas d'allergie",
            "Non fumeur, bon dormeur, frustre de pas pouvoir courir",
            "Developpeur web, assis toute la journee. Course a pied 3 fois par semaine",
            "Stabiliser ma cheville definitivement et reprendre la course sans risque",
        ],
    },
};

// ─── Delay helper ───
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ─── API Call with fallback chain + Ollama local fallback ───
async function callLLM(messages, modelIndex = 0) {
    if (modelIndex >= MODEL_CHAIN.length) {
        // All cloud models failed — try Ollama local
        return callOllama(messages);
    }
    const model = MODEL_CHAIN[modelIndex];
    const start = Date.now();

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ model, messages, max_tokens: 1024, temperature: 0.7 }),
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
            console.log(`    ⚠ ${model} → HTTP ${res.status}`);
            await delay(2000 * (modelIndex + 1));
            return callLLM(messages, modelIndex + 1);
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        const latency = Date.now() - start;

        if (!content) {
            console.log(`    ⚠ ${model} → réponse vide`);
            await delay(2000 * (modelIndex + 1));
            return callLLM(messages, modelIndex + 1);
        }

        return { error: null, content, model, latency };
    } catch (err) {
        const latency = Date.now() - start;
        if (err.name === 'AbortError') {
            console.log(`    ⚠ ${model} → timeout (${latency}ms)`);
        } else {
            console.log(`    ⚠ ${model} → ${err.message}`);
        }
        await delay(2000 * (modelIndex + 1));
        return callLLM(messages, modelIndex + 1);
    }
}

// ─── Ollama local fallback — never rate-limited ───
async function callOllama(messages) {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s for local model

        console.log(`    🏠 Ollama/${OLLAMA_MODEL} (local fallback)...`);
        const res = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: OLLAMA_MODEL, messages, max_tokens: 1024, temperature: 0.7 }),
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
            console.log(`    ⚠ Ollama/${OLLAMA_MODEL} → HTTP ${res.status}`);
            return { error: 'ALL_MODELS_FAILED', content: null, model: null, latency: 0 };
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        const latency = Date.now() - start;

        if (!content) {
            console.log(`    ⚠ Ollama/${OLLAMA_MODEL} → réponse vide`);
            return { error: 'ALL_MODELS_FAILED', content: null, model: null, latency: 0 };
        }

        return { error: null, content, model: `ollama/${OLLAMA_MODEL}`, latency };
    } catch (err) {
        const latency = Date.now() - start;
        if (err.name === 'AbortError') {
            console.log(`    ⚠ Ollama/${OLLAMA_MODEL} → timeout (${latency}ms)`);
        } else {
            console.log(`    ⚠ Ollama/${OLLAMA_MODEL} → ${err.message}`);
        }
        return { error: 'ALL_MODELS_FAILED', content: null, model: null, latency: 0 };
    }
}

// ─── Parse LLM JSON response (matches parseLLMResponse.ts robustness) ───
function parseLLMJSON(raw) {
    try {
        // Remove <think> blocks (Qwen3 reasoning)
        let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        // Remove markdown fences
        const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) cleaned = fenceMatch[1].trim();
        // Extract outermost braces — strips trailing text after JSON object
        const braceMatch = cleaned.match(/\{[\s\S]*\}/);
        if (braceMatch) cleaned = braceMatch[0];
        return { parsed: JSON.parse(cleaned), error: null };
    } catch (e) {
        // Fallback: try to extract just the "message" field from broken JSON
        const msgMatch = raw.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (msgMatch) {
            try {
                const message = JSON.parse(`"${msgMatch[1]}"`);
                return {
                    parsed: { message, phase: 1, question_num: 1, red_flags: [], collected: {}, progress: 0, done: false },
                    error: null,
                };
            } catch { /* fall through */ }
        }
        return { parsed: null, error: e.message };
    }
}

// ─── Run one pathology agent ───
async function runAgent(key, agent, maxQuestions) {
    const { name, patient, responses } = agent;
    const limit = Math.min(maxQuestions, responses.length);

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🏥 Agent: ${name} (${patient.prenom} ${patient.nom})`);
    console.log(`   ${limit} échanges prévus`);
    console.log('═'.repeat(60));

    const messages = [{ role: 'system', content: getSystemPrompt(patient.prenom, patient.nom) }];
    const results = {
        pathology: key,
        name,
        exchanges: 0,
        successes: 0,
        empty_responses: 0,
        json_errors: 0,
        api_failures: 0,
        timeouts: 0,
        latencies: [],
        question_progression: [],
        red_flags_detected: [],
        frictions: [],
    };

    for (let i = 0; i < limit; i++) {
        const userMsg = responses[i];
        messages.push({ role: 'user', content: userMsg });

        process.stdout.write(`  Q${i + 1}/${limit} `);

        const { error, content, model, latency } = await callLLM(messages);
        results.exchanges++;

        if (error) {
            results.api_failures++;
            results.frictions.push({ exchange: i + 1, type: 'API_FAILURE', detail: error });
            console.log(`❌ API failure`);
            // Remove dangling user message to keep history clean for next attempt
            messages.pop();
            // Extra cooldown after total failure
            await delay(5000);
            continue;
        }

        results.latencies.push(latency);

        // Parse JSON
        const { parsed, error: jsonErr } = parseLLMJSON(content);

        if (jsonErr) {
            results.json_errors++;
            results.frictions.push({
                exchange: i + 1,
                type: 'JSON_PARSE_ERROR',
                detail: jsonErr,
                raw: content.substring(0, 200),
            });
            console.log(`⚠ JSON error (${model}, ${latency}ms)`);
            // Still push assistant message for context continuity
            messages.push({ role: 'assistant', content });
            continue;
        }

        // Check for empty message
        if (!parsed.message?.trim()) {
            results.empty_responses++;
            results.frictions.push({ exchange: i + 1, type: 'EMPTY_MESSAGE', model });
            console.log(`⚠ Empty message (${model}, ${latency}ms)`);
            messages.push({ role: 'assistant', content });
            continue;
        }

        // Track progression
        results.question_progression.push({
            exchange: i + 1,
            question_num: parsed.question_num,
            phase: parsed.phase,
            progress: parsed.progress,
        });

        // Check red flags
        if (parsed.red_flags?.length > 0) {
            results.red_flags_detected.push(...parsed.red_flags);
        }

        // Check for done
        if (parsed.done) {
            console.log(`✅ DONE (${model}, ${latency}ms) — synthèse: ${parsed.synthese ? 'oui' : 'NON'}`);
            if (!parsed.synthese) {
                results.frictions.push({ exchange: i + 1, type: 'MISSING_SYNTHESE' });
            }
            results.successes++;
            messages.push({ role: 'assistant', content });
            break;
        }

        // Latency check
        if (latency > 10000) {
            results.frictions.push({ exchange: i + 1, type: 'SLOW_RESPONSE', latency, model });
        }

        results.successes++;
        const msgPreview = parsed.message.substring(0, 60).replace(/\n/g, ' ');
        console.log(`✅ Q${parsed.question_num}/21 Ph${parsed.phase} ${parsed.progress}% (${model}, ${latency}ms) "${msgPreview}..."`);

        messages.push({ role: 'assistant', content });

        // Rate limit protection — 3s between requests
        await delay(3000);
    }

    // Summary
    const avgLatency = results.latencies.length > 0
        ? Math.round(results.latencies.reduce((a, b) => a + b, 0) / results.latencies.length)
        : 0;

    console.log(`\n  📊 Résumé ${name}:`);
    console.log(`     Échanges: ${results.exchanges} | Succès: ${results.successes} | Échecs JSON: ${results.json_errors} | Vides: ${results.empty_responses} | API: ${results.api_failures}`);
    console.log(`     Latence moy: ${avgLatency}ms | Red flags: ${results.red_flags_detected.length}`);
    if (results.frictions.length > 0) {
        console.log(`     ⚠ FRICTIONS: ${results.frictions.length}`);
        results.frictions.forEach(f => console.log(`       - [${f.type}] exchange ${f.exchange}: ${f.detail || f.model || ''}`));
    } else {
        console.log(`     ✅ Aucune friction détectée`);
    }

    return results;
}

// ─── Main ───
async function main() {
    const args = process.argv.slice(2);
    const fullMode = args.includes('--full');
    const maxQuestions = fullMode ? 22 : 6; // 6 = greeting + Q1-Q5 (fast test)

    const pathologyFilter = args.find(a => a.startsWith('--pathology='))?.split('=')[1];
    const allAgents = args.includes('--all');

    // Default quick mode: 3 representative pathologies to save API quota
    const QUICK_SET = ['lombalgie', 'epaule', 'fibromyalgie'];

    let agentMode;
    let agents;
    if (pathologyFilter) {
        agents = { [pathologyFilter]: PATHOLOGY_AGENTS[pathologyFilter] };
        agentMode = `1 agent (${pathologyFilter})`;
    } else if (allAgents) {
        agents = PATHOLOGY_AGENTS;
        agentMode = '8 agents (all)';
    } else {
        agents = {};
        for (const k of QUICK_SET) agents[k] = PATHOLOGY_AGENTS[k];
        agentMode = `3 agents (${QUICK_SET.join(', ')})`;
    }

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  KSLB Chat AI — Pathology Test Agents                    ║');
    console.log(`║  Mode: ${fullMode ? 'FULL (21 questions)' : 'QUICK (5 questions)'}                          ║`);
    console.log(`║  Agents: ${agentMode.padEnd(47)}║`);
    console.log(`║  Models: ${MODEL_CHAIN[0]} + 3 cloud + Ollama ║`);
    console.log(`║  Delays: 3s/exchange, 15s/agent, backoff retries         ║`);
    console.log('╚════════════════════════════════════════════════════════════╝');

    if (pathologyFilter && !PATHOLOGY_AGENTS[pathologyFilter]) {
        console.error(`\n❌ Pathologie inconnue: "${pathologyFilter}"`);
        console.error(`   Disponibles: ${Object.keys(PATHOLOGY_AGENTS).join(', ')}`);
        process.exit(1);
    }

    const allResults = [];
    const entries = Object.entries(agents);
    for (let idx = 0; idx < entries.length; idx++) {
        const [key, agent] = entries[idx];
        const result = await runAgent(key, agent, maxQuestions);
        allResults.push(result);

        // 15s cooldown between agents to reset rate limits
        if (idx < entries.length - 1) {
            console.log(`\n  ⏳ Cooldown 15s avant prochain agent...`);
            await delay(15000);
        }
    }

    // Final report
    console.log('\n\n' + '═'.repeat(60));
    console.log('📋 RAPPORT FINAL — Toutes pathologies');
    console.log('═'.repeat(60));

    let totalFrictions = 0;
    for (const r of allResults) {
        const status = r.frictions.length === 0 ? '✅' : '⚠';
        const avgLat = r.latencies.length > 0
            ? Math.round(r.latencies.reduce((a, b) => a + b, 0) / r.latencies.length)
            : 0;
        console.log(`  ${status} ${r.name.padEnd(30)} | ${r.successes}/${r.exchanges} OK | ${avgLat}ms moy | ${r.frictions.length} friction(s)`);
        totalFrictions += r.frictions.length;
    }

    console.log(`\n  Total frictions: ${totalFrictions}`);
    if (totalFrictions === 0) {
        console.log('  🎉 Tous les agents ont passé sans friction !');
    } else {
        console.log('  ⚠ Frictions détectées — voir détails ci-dessus');
    }

    // Write JSON report
    const reportPath = new URL('./pathology-report.json', import.meta.url).pathname;
    const { writeFileSync } = await import('fs');
    writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
    console.log(`\n  📁 Rapport JSON: ${reportPath}`);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
