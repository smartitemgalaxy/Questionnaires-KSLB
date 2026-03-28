
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { PatientInfo } from '../types';
import { parseLLMResponse, type LLMParsed } from '@/lib/parseLLMResponse';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: string;
}

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface WhatsAppChatProps {
    onBack: () => void;
    patientInfo: PatientInfo;
}

const getSystemPrompt = (pi: PatientInfo) => `Vous êtes un assistant médical intelligent pour le cabinet de kinésithérapie KSLB.
Votre rôle est de mener un entretien d'anamnèse professionnel et bienveillant pour recueillir les informations médicales du patient AVANT sa consultation.

## PATIENT IDENTIFIÉ
Le patient est déjà connecté et identifié :
- Prénom : ${pi.prenom}
- Nom : ${pi.nom}
NE DEMANDEZ PAS son nom ou prénom. Ces informations sont déjà enregistrées.

## RÈGLES ABSOLUES
1. Parlez en français formel et professionnel PARFAIT. Orthographe irréprochable. COPIEZ les questions de la section STRUCTURE ci-dessous MOT POUR MOT — ne les reformulez JAMAIS. Tous les accents doivent être corrects (é, è, ê, à, ù, ô, î, û, ç). Exemples corrects : "Ressentez-vous" (JAMAIS "Ressez-vous"), "Où" (JAMAIS "Ou"), "déjà", "problème", "résumé". JAMAIS d'emojis. JAMAIS de mot anglais — tout doit être en français.
2. Ton chaleureux mais professionnel (vouvoiement, style messagerie soignée).
3. Posez UNE SEULE question à la fois, jamais de rafale.
4. Langage patient accessible — pas de jargon médical sauf si le patient l'utilise.
5. Si le patient donne une réponse floue, demandez des précisions avec tact.
6. Ne donnez JAMAIS de diagnostic. Vous préparez le dossier pour le kiné.
7. Si vous détectez un RED FLAG, ne paniquez pas le patient mais notez-le.

## RÈGLES DE CONCISION — CRITIQUE
- Votre message doit faire 1 à 3 phrases MAXIMUM. Jamais plus.
- NE RÉCAPITULEZ JAMAIS la réponse du patient. Ne reformulez pas ce qu'il vient de dire.
- NE DITES PAS "passons à la question suivante", "merci pour cette information", "je comprends", ni aucune phrase de transition.
- Posez DIRECTEMENT la question suivante, sans préambule ni commentaire.
- Si le patient ne comprend pas, répétez la question telle quelle ou reformulez-la simplement.
- Exemple CORRECT : "Avez-vous déjà essayé des traitements pour votre dos ? Kinésithérapie, ostéopathie, médicaments, infiltrations ?"
- Exemple INTERDIT : "Merci de me fournir cette information, Dev. Il semblerait que vous avez une douleur au dos qui est plutôt pesante et qui peut varier en intensité. Pouvez-vous me dire combien de temps durent ces crises ?"

## STRUCTURE DE L'INTERROGATOIRE

### PHASE 1 — MOTIF DE CONSULTATION (questions 1 à 6)
Commencez DIRECTEMENT par Q1 — le patient est déjà identifié.

Q1. "Quelle est la raison de votre consultation ? Où avez-vous mal ou quel est votre problème ?" (zone corporelle + description libre)
Q2. "Quand est-ce que ce problème est apparu, et dans quelles circonstances ?" (date + contexte : activité en cours, effort, sans raison...)
Q3. Caractéristiques de la douleur — posez en 1-2 échanges :
    - Est-ce que la douleur est présente le matin au réveil ? Besoin de "se dérouiller" ?
    - Quel type de douleur ? (brûlure, tiraillement, élancement, décharge électrique, pesanteur...)
    - Est-ce que la douleur se déplace ou irradie vers une autre zone ?
Q4. "Combien de temps durent les crises ? À quelle fréquence reviennent-elles ? Comment ça évolue depuis le début ?"
Q5. "Qu'est-ce qui aggrave votre douleur ? Et qu'est-ce qui la soulage ?"
Q6. "Avez-vous d'autres symptômes associés ? Par exemple : fourmillements, engourdissements, faiblesse, gonflement, craquements... Et sur une échelle de 0 à 10, comment évaluez-vous votre douleur ?"

### PHASE 2 — ANTÉCÉDENTS MÉDICAUX PAR SYSTÈME (questions 7 à 13)
Pour chaque système, posez UNE question parapluie. Si NON → passez au suivant. Si OUI → creusez : quel problème, depuis quand, traitement actuel.

Q7. CARDIOVASCULAIRE : "Avez-vous ou avez-vous eu des problèmes au niveau du cœur ou des vaisseaux ? Par exemple : tension élevée, maladie du cœur, infarctus, AVC, phlébite, problème de circulation..."
Q8. RESPIRATOIRE : "Avez-vous ou avez-vous eu des problèmes respiratoires ? Par exemple : asthme, bronchite chronique, essoufflement, apnée du sommeil..."
Q9. ENDOCRINIEN / MÉTABOLIQUE : "Avez-vous des problèmes de diabète, thyroïde, cholestérol, ou autre maladie du métabolisme ?"
Q10. DIGESTIF : "Avez-vous des problèmes digestifs importants ? Ulcère, reflux, maladie du foie, maladie de l'intestin..."
Q11. RÉNAL / URINAIRE : "Avez-vous des problèmes au niveau des reins ou des voies urinaires ?"
Q12. URO-GYNÉCOLOGIQUE : Si homme → "Avez-vous des problèmes de prostate ?" Si femme → "Avez-vous des problèmes gynécologiques ?"
Q13. FILET DE SÉCURITÉ : "Y a-t-il d'autres problèmes de santé que nous n'avons pas encore abordés ?"

### PHASE 3 — CONTEXTE ET MODE DE VIE (questions 14 à 21)

Q14. "Avez-vous déjà fait des examens d'imagerie pour ce problème ? Radio, scanner, IRM, échographie ?"
Q15. "Avez-vous déjà essayé des traitements pour ce problème ? Kiné, ostéo, médicaments, infiltrations..."
Q16. "Avez-vous déjà été opéré(e) ? Si oui, pour quoi ?"
Q17. "Avez-vous eu des traumatismes importants ? Accidents, chutes graves..."
Q18. "Prenez-vous des médicaments actuellement ? Et avez-vous des allergies connues ?"
Q19. "Concernant votre mode de vie : fumez-vous ? Avez-vous des troubles du sommeil ? Vous sentez-vous stressé(e) ou anxieux(se) ?"
Q20. "Quelle est votre activité professionnelle et ses contraintes physiques ? Pratiquez-vous un sport ?"
Q21. "Pour terminer : quels sont vos objectifs et attentes vis-à-vis de la kinésithérapie ?"

### CONCLUSION
Après Q21, remerciez simplement le patient avec un message court et chaleureux du type : "Merci beaucoup pour vos réponses. Votre dossier va être transmis à votre kinésithérapeute qui en prendra connaissance avant votre séance. À très bientôt."
NE FAITES PAS de récapitulatif visible, NE LISTEZ PAS les données collectées, N'AFFICHEZ PAS de JSON au patient. Juste un remerciement simple et humain.
En revanche, remplissez bien le champ "synthese" dans votre JSON de réponse avec TOUTES les données collectées en texte structuré — c'est ce qui sera sauvegardé dans le dossier du praticien.

## RED FLAGS À SURVEILLER
Si mentionnés, notez-les mais ne paniquez pas le patient :
- Douleur thoracique + essoufflement
- Paresthésies périnéales / troubles sphinctériens (syndrome queue de cheval)
- Perte de poids inexpliquée + douleur nocturne (suspicion néoplasique)
- Fièvre + douleur articulaire (suspicion infectieuse)
- Déficit neurologique brutal
- Douleur de jambe + gonflement + chaleur (suspicion TVP)
- Céphalée brutale "en coup de tonnerre"
- Trauma + déformation

## FORMAT DE RÉPONSE — OBLIGATOIRE
Répondez UNIQUEMENT en JSON valide, sans markdown ni backticks.

EXEMPLE avec collected REMPLI (ce que vous DEVEZ faire) :
{"message":"Quand est-ce que ce problème est apparu ?","phase":1,"question_num":2,"red_flags":[],"collected":{"motif":"lombalgie","zone":"bas du dos"},"progress":10,"done":false}

CHAMPS OBLIGATOIRES à chaque réponse :
- message : votre texte au patient (1-3 phrases max)
- phase : 1, 2 ou 3
- question_num : numéro de question en cours (1-21)
- red_flags : liste de red flags détectés (chaînes vides si aucun)
- collected : OBLIGATOIRE — accumulez TOUTES les données recueillies depuis le début. NE RENVOYEZ JAMAIS un collected vide {} après Q1. Ajoutez les nouvelles données à chaque tour. Clés : motif, zone, date_apparition, circonstances, douleur_matin, derouillage, type_douleur, trajet_irradiation, duree_crises, frequence_crises, evolution, facteurs_aggravants, facteurs_soulageants, symptomes_associes, eva, cardiovasculaire, respiratoire, endocrinien, digestif, renal, uro_gyneco, autres_antecedents, imagerie, traitements_anterieurs, chirurgies, traumatismes, medicaments, allergies, tabac, sommeil, stress, profession, sport, objectifs
- progress : pourcentage estimé (0-100), incrémentez à chaque question (~5% par question)
- done : true quand l'interrogatoire est terminé (après Q21)

QUAND done=true, vous DEVEZ ajouter un champ "synthese" avec un résumé clinique COMPLET et structuré reprenant TOUTES les données du champ collected en texte lisible pour le praticien. La synthèse doit faire au minimum 5 lignes et couvrir : motif, caractéristiques douleur, antécédents, traitements, mode de vie, objectifs.

## DÉMARRAGE
Premier message : saluez ${pi.prenom} par son prénom et posez directement Q1 (motif de consultation). Ne demandez PAS le nom.`;

// KapCro-Health — fork dédié santé sur port 5011 (Groq → Gemini → Cerebras)
const KAPCRO_URL = 'http://localhost:5011/v1/chat/completions';
const KAPCRO_MODEL = 'health';

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ onBack, patientInfo }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [progress, setProgress] = useState(5);   // Visible dès le début (pas 0%)
    const [phase, setPhase] = useState(1);          // Phase 1 dès le départ
    const [questionNum, setQuestionNum] = useState(1); // Q1/21 (pas Q0/21)
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [collectedData, setCollectedData] = useState<Record<string, any>>({});
    const [isDone, setIsDone] = useState(false);
    const [synthesis, setSynthesis] = useState<string | null>(null);
    const [driveStatus, setDriveStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [isRetrying, setIsRetrying] = useState(false); // Rate-limit retry indicator
    const [isOffline, setIsOffline] = useState(!navigator.onLine); // #M27
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatHistory = useRef<ChatMessage[]>([
        { role: 'system', content: getSystemPrompt(patientInfo) },
    ]);

    const phaseLabels: Record<number, string> = { 1: 'Motif & Symptômes', 2: 'Antécédents Médicaux', 3: 'Contexte & Mode de vie' };

    // Deterministic synthesis: ALWAYS generated from collected data, never from LLM prose
    const formatSynthesis = (data: Record<string, any>, flags: string[]): string => {
        const v = (key: string) => data[key] || '';
        const ras = (key: string) => { const val = v(key); return val && val !== 'RAS' && val !== 'aucun' && val !== 'non' ? val : ''; };
        const sections: string[] = [];

        // Line 1: Patient + Motif
        sections.push(`PATIENT : ${patientInfo.nom} ${patientInfo.prenom}. Motif : ${v('motif') || 'non précisé'}. Zone : ${v('zone') || v('motif')}. Apparition : ${v('date_apparition') || '?'}, circonstances : ${v('circonstances') || 'non précisées'}.`);

        // Line 2: Douleur
        const douleurParts = [
            v('type_douleur') && `type ${v('type_douleur')}`,
            v('eva') && `EVA ${v('eva')}`,
            v('trajet_irradiation') && `irradiation ${v('trajet_irradiation')}`,
            v('douleur_matin') && `matin : ${v('douleur_matin')}`,
            v('derouillage') && `dérouillage : ${v('derouillage')}`,
            v('duree_crises') && `durée : ${v('duree_crises')}`,
            v('frequence_crises') && `fréquence : ${v('frequence_crises')}`,
            v('evolution') && `évolution : ${v('evolution')}`,
        ].filter(Boolean);
        sections.push(`DOULEUR : ${douleurParts.join('. ')}.`);

        // Line 3: Aggravants/Soulageants
        if (v('facteurs_aggravants') || v('facteurs_soulageants') || v('symptomes_associes')) {
            sections.push(`FACTEURS : Aggravants : ${v('facteurs_aggravants') || 'non précisés'}. Soulageants : ${v('facteurs_soulageants') || 'non précisés'}. Symptômes associés : ${v('symptomes_associes') || 'aucun'}.`);
        }

        // Line 4: Antécédents
        const antecParts = [
            ras('cardiovasculaire') && `Cardio : ${v('cardiovasculaire')}`,
            ras('respiratoire') && `Respi : ${v('respiratoire')}`,
            ras('endocrinien') && `Endocrinien : ${v('endocrinien')}`,
            ras('digestif') && `Digestif : ${v('digestif')}`,
            ras('renal') && `Rénal : ${v('renal')}`,
            ras('uro_gyneco') && `Uro-gynéco : ${v('uro_gyneco')}`,
            ras('autres_antecedents') && `Autres : ${v('autres_antecedents')}`,
        ].filter(Boolean);
        const antecLine = antecParts.length > 0 ? antecParts.join('. ') : 'RAS';
        sections.push(`ANTÉCÉDENTS : ${antecLine}. Chirurgies : ${v('chirurgies') || 'aucune'}. Traumatismes : ${v('traumatismes') || 'aucun'}. Imagerie : ${v('imagerie') || 'aucune'}. Traitements antérieurs : ${v('traitements_anterieurs') || 'aucun'}.`);

        // Line 5: Médicaments/Allergies
        sections.push(`TRAITEMENTS : Médicaments : ${v('medicaments') || 'aucun'}. Allergies : ${v('allergies') || 'aucune'}.`);

        // Line 6: Mode de vie
        sections.push(`MODE DE VIE : Profession : ${v('profession') || '?'}. Sport : ${v('sport') || 'aucun'}. Tabac : ${v('tabac') || '?'}. Sommeil : ${v('sommeil') || '?'}. Stress : ${v('stress') || '?'}.`);

        // Line 7: Objectifs
        sections.push(`OBJECTIFS : ${v('objectifs') || 'non précisés'}.`);

        // Line 8: Red flags
        if (flags.length > 0) {
            sections.push(`RED FLAGS : ${flags.join(', ')}.`);
        }

        return sections.join('\n');
    };

    const buildFallbackCollected = (msgs: Message[]): Record<string, string> => {
        const patientMsgs = msgs.filter(m => m.sender === 'user').map(m => m.text);
        const allText = patientMsgs.join(' ').toLowerCase();
        const data: Record<string, string> = {};
        if (patientMsgs.length > 0) data.motif = patientMsgs[0];
        if (patientMsgs.length > 1) data.circonstances = patientMsgs[1];
        const evaMatch = allText.match(/(\d+)\s*(?:sur|\/)\s*10/);
        if (evaMatch) data.eva = `${evaMatch[1]}/10`;
        // Map keywords to fields
        const keywords: [string, string[]][] = [
            ['medicaments', ['médicament', 'medicament', 'comprimé', 'traitement', 'prend']],
            ['allergies', ['allergi', 'pénicilline', 'penicilline']],
            ['chirurgies', ['opér', 'chirurg', 'intervention']],
            ['tabac', ['fume', 'tabac', 'cigarette', 'arrêté de fumer']],
            ['sport', ['sport', 'football', 'tennis', 'escalade', 'yoga', 'aquagym', 'marche']],
            ['profession', ['profession', 'travail', 'secrétaire', 'informaticien', 'cadre', 'retraité']],
            ['sommeil', ['dor', 'sommeil', 'réveil', 'insomni']],
            ['stress', ['stress', 'anxie', 'angoiss']],
        ];
        for (const [field, kws] of keywords) {
            for (const msg of patientMsgs) {
                if (kws.some(k => msg.toLowerCase().includes(k))) {
                    data[field] = msg;
                    break;
                }
            }
        }
        return data;
    };

    // #M27 — Network offline detection
    useEffect(() => {
        const goOffline = () => setIsOffline(true);
        const goOnline = () => setIsOffline(false);
        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);
        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const applyResponse = (parsed: LLMParsed): string => {
        if (parsed.phase) setPhase(parsed.phase);
        if (parsed.question_num) setQuestionNum(parsed.question_num);
        if (parsed.progress != null) setProgress(parsed.progress);
        if (parsed.red_flags?.length) {
            setRedFlags(prev => [...new Set([...prev, ...parsed.red_flags])]);
        }
        if (parsed.collected && Object.keys(parsed.collected).length > 0) {
            setCollectedData(prev => ({ ...prev, ...parsed.collected }));
        }
        if (parsed.done) {
            // Guard: reject done=true if LLM skipped questions (must reach Q21)
            const qNum = parsed.question_num || questionNum;
            const synth = parsed.synthese || '';
            const synthLines = synth.split('\n').filter((l: string) => l.trim().length > 0).length;
            const synthIsValid = synth.length >= 200 && synthLines >= 5;

            if (qNum < 18) {
                // LLM tried to end way too early — force continuation
                console.warn(`[KSLB] Rejected done=true at Q${qNum} — forcing continuation`);
                parsed.done = false;
                parsed.progress = Math.min(parsed.progress || 70, 85);
                return parsed.message?.trim() || 'Continuons avec les questions suivantes.';
            } else if (!synthIsValid) {
                // Synthese too short — accept done but use fallback synthesis
                console.warn(`[KSLB] Synthese too short (${synth.length} chars, ${synthLines} lines) — using fallback`);
                setIsDone(true);
                setSynthesis(null); // will trigger fallback in save useEffect
            } else {
                setIsDone(true);
                setSynthesis(synth);
            }
        }
        return parsed.message?.trim() || 'Pouvez-vous préciser votre réponse ?';
    };

    const sendToLLM = async (userMessage: string): Promise<string> => {
        chatHistory.current.push({ role: 'user', content: userMessage });

        // Limit chat history to prevent unbounded memory growth (#M26)
        const MAX_HISTORY = 50;
        if (chatHistory.current.length > MAX_HISTORY) {
            const systemMsg = chatHistory.current[0];
            chatHistory.current = [systemMsg, ...chatHistory.current.slice(-(MAX_HISTORY - 1))];
        }

        // Helper: call an OpenAI-compatible endpoint
        const callLLM = async (url: string, model: string, label: string): Promise<string | null> => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model,
                        messages: chatHistory.current,
                        max_tokens: 2048,
                        temperature: 0.7,
                    }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!res.ok) {
                    console.warn(`[${label}] ${model} → ${res.status}`);
                    return null;
                }
                const data = await res.json();
                return data.choices?.[0]?.message?.content?.trim() || null;
            } catch (err: any) {
                clearTimeout(timeoutId);
                console.warn(`[${label}] ${model} → ${err.name === 'AbortError' ? 'timeout' : err.message}`);
                return null;
            }
        };

        // KapCro v2.5 — proxy unifié (failover interne entre 39 clés / 6 providers)
        const text = await callLLM(KAPCRO_URL, KAPCRO_MODEL, 'KapCro');

        if (!text) {
            const lastMsg = chatHistory.current[chatHistory.current.length - 1];
            if (lastMsg?.role === 'user') chatHistory.current.pop();
            throw new Error('KapCro-Health est indisponible. Vérifiez que le serveur tourne sur le port 5011.');
        }

        chatHistory.current.push({ role: 'assistant', content: text });
        const parsed = parseLLMResponse(text, { phase, questionNum, progress });
        return applyResponse(parsed);
    };

    // Initial greeting — deterministic Q1, no LLM call needed
    useEffect(() => {
        const greetingText = `Bonjour ${patientInfo.prenom},\n\nQuelle est la raison de votre consultation ? Où avez-vous mal ou quel est votre problème ?`;
        // Inject into chat history so the LLM has context for the next exchange
        chatHistory.current.push({ role: 'assistant', content: JSON.stringify({ message: greetingText, phase: 1, question_num: 1, red_flags: [], collected: {}, progress: 5, done: false }) });
        setMessages([{
            id: '1',
            text: greetingText,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, []);

    // Auto-save on Mac via KapCro /save-anamnese endpoint
    useEffect(() => {
        if (!isDone || driveStatus !== 'idle') return;

        (async () => {
            setDriveStatus('sending');
            try {
                const now = new Date();
                const dateFr = now.toLocaleDateString('fr-FR');
                const nom = patientInfo.nom;
                const prenom = patientInfo.prenom;
                const nss = patientInfo.numeroSecuriteSociale || '000';

                // ALWAYS use collected data (fallback to conversation extraction if empty)
                const hasCollected = Object.keys(collectedData).length > 0;
                const finalCollected = hasCollected ? collectedData : buildFallbackCollected(messages);
                // ALWAYS generate synthesis deterministically from collected data
                // Never trust the LLM synthesis — it's inconsistent (1 paragraph, missing sections, etc.)
                const finalSynthesis = formatSynthesis(finalCollected, redFlags);

                const content = [
                    `ANAMNÈSE CONVERSATIONNELLE — ${nom} ${prenom}`,
                    `Date : ${dateFr} à ${now.toLocaleTimeString('fr-FR')}`,
                    `Mode : Questionnaire LLM adaptatif (KSLB)`,
                    ``,
                    `═══════════════════════════════════════`,
                    `SYNTHÈSE CLINIQUE`,
                    `═══════════════════════════════════════`,
                    ``,
                    finalSynthesis,
                    ``,
                    `═══════════════════════════════════════`,
                    `DONNÉES STRUCTURÉES (JSON)`,
                    `═══════════════════════════════════════`,
                    ``,
                    JSON.stringify(finalCollected, null, 2),
                    ``,
                    redFlags.length > 0 ? `RED FLAGS DÉTECTÉS : ${redFlags.join(', ')}` : 'Aucun red flag détecté.',
                    ``,
                    `═══════════════════════════════════════`,
                    `CONVERSATION COMPLÈTE`,
                    `═══════════════════════════════════════`,
                    ``,
                    ...messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'PATIENT' : 'ASSISTANT'} : ${m.text}`),
                ].join('\n');

                const res = await fetch(`${KAPCRO_URL.replace('/v1/chat/completions', '')}/save-anamnese`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nom: patientInfo.nom,
                        prenom: patientInfo.prenom,
                        ins: nss,
                        content,
                        status: 'Complet',
                    }),
                });

                if (!res.ok) throw new Error(`Erreur sauvegarde: ${res.status}`);
                const result = await res.json();
                console.log('Anamnèse sauvegardée:', result.path);
                setDriveStatus('success');
            } catch (err) {
                console.error('Save error:', err);
                setDriveStatus('error');
            }
        })();
    }, [isDone, driveStatus, synthesis]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping || isDone) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const msgText = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const botText = await sendToLLM(msgText);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botText,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("LLM Error:", error);
            const errorMsg: Message = {
                id: 'err-' + Date.now(),
                text: "Désolé, j'ai rencontré un petit problème technique. Pouvons-nous reprendre ?",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100dvh-56px)] sm:h-[calc(100dvh-72px)] w-full max-w-2xl mx-auto border-x bg-white shadow-2xl overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full" aria-label="Retour">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <Logo className="w-8 h-8" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm">Assistant KSLB</h3>
                    <p className="text-[10px] text-green-200">
                        {isRetrying ? 'un moment de réflexion...' : isTyping ? 'écrit...' : isDone ? '✅ Anamnèse terminée' : `En ligne • Q${questionNum}/21`}
                    </p>
                </div>
            </div>


            {/* #M27 — Offline detection banner */}
            {isOffline && (
                <div className="bg-red-100 border-b border-red-300 px-4 py-2 text-red-800 text-xs font-medium flex items-center gap-2" role="alert">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Connexion internet perdue. Les messages ne peuvent pas être envoyés.
                </div>
            )}

            {/* Progress Bar */}
            <div className="h-[3px] bg-[#0A3D2E]">
                <div
                    className="h-full bg-[#25D366] transition-all duration-700 ease-out"
                    style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(37,211,102,0.5)' }}
                />
            </div>

            {/* Phase Indicator */}
            {phase > 0 && (
                <div className="py-1.5 px-4 bg-gray-50 text-center border-b">
                    <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full ${
                        phase === 1 ? 'text-green-600 bg-green-50' :
                        phase === 2 ? 'text-orange-500 bg-orange-50' :
                        'text-blue-500 bg-blue-50'
                    }`}>
                        Phase {phase}/3 — {phaseLabels[phase]} • {progress}%
                    </span>
                </div>
            )}

            {/* Red Flags — tracked internally but NOT shown to patient (RGPD #C14) */}

            {/* Chat Body — #C13 aria-live for screen readers */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 wa-chat-bg flex flex-col gap-3" role="log" aria-live="polite" aria-label="Conversation">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`max-w-[90%] sm:max-w-[85%] rounded-lg p-3 shadow-sm relative text-sm animate-in zoom-in-95 duration-200 ${
                            m.sender === 'bot'
                            ? 'bg-white self-start text-gray-800 rounded-tl-none'
                            : 'bg-[#DCF8C6] self-end text-gray-900 rounded-tr-none'
                        }`}
                    >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <span className="block text-[9px] text-gray-400 text-right mt-1">{m.timestamp}</span>
                    </div>
                ))}
                {isTyping && (
                    <div className="bg-white self-start rounded-lg rounded-tl-none p-3 shadow-sm flex items-center gap-1" role="status" aria-live="assertive" aria-label="L'assistant est en train d'écrire">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                )}
            </div>

            {/* Drive Status */}
            {isDone && (
                <div className={`py-1.5 px-4 text-center border-t ${
                    driveStatus === 'success' ? 'bg-green-50' :
                    driveStatus === 'error' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                    <span className={`text-[11px] font-medium ${
                        driveStatus === 'success' ? 'text-green-700' :
                        driveStatus === 'error' ? 'text-red-700' : 'text-gray-500'
                    }`}>
                        {driveStatus === 'idle' && '✅ Anamnèse complète'}
                        {driveStatus === 'sending' && 'Sauvegarde en cours...'}
                        {driveStatus === 'success' && 'Dossier sauvegardé sur Mac'}
                        {driveStatus === 'error' && (
                            <>
                                ❌ Erreur de sauvegarde{' '}
                                <button
                                    onClick={() => setDriveStatus('idle')}
                                    className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded hover:bg-red-200 transition-colors"
                                >
                                    Réessayer
                                </button>
                            </>
                        )}
                    </span>
                </div>
            )}

            {/* Input */}
            <div className="p-3 bg-[#F0F0F0] flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isDone ? "Anamnèse terminée" : "Tapez un message..."}
                    className="flex-1 bg-white p-3 rounded-full text-sm outline-none shadow-inner border border-gray-200 focus:ring-1 focus:ring-green-400"
                    disabled={isDone}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping || isDone}
                    className="w-11 h-11 bg-[#075E54] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>

            <div className="bg-white px-4 py-1.5 text-center border-t safe-bottom">
                <p className="text-[9px] text-gray-400">
                    🔒 Données sécurisées — envoyées directement à votre praticien
                </p>
            </div>
        </div>
    );
};

export default WhatsAppChat;
