
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { submitBilan } from '../utils';
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
1. Parlez en Français. Ton chaleureux mais professionnel (style messagerie).
2. Posez UNE SEULE question à la fois, jamais de rafale.
3. Langage patient accessible — pas de jargon médical sauf si le patient l'utilise.
4. Si le patient donne une réponse floue, demandez des précisions avec tact.
5. Ne donnez JAMAIS de diagnostic. Vous préparez le dossier pour le kiné.
6. Utilisez quelques emojis avec parcimonie pour rendre l'échange humain.
7. Si vous détectez un RED FLAG, ne paniquez pas le patient mais notez-le.

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
Après Q21, remerciez simplement le patient avec un message court et chaleureux du type : "Merci beaucoup pour vos réponses ! Votre dossier va être transmis à votre kinésithérapeute qui en prendra connaissance avant votre séance. À très bientôt ! 😊"
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

## FORMAT DE RÉPONSE
Répondez UNIQUEMENT en JSON valide, sans markdown ni backticks :
{"message":"votre message au patient","phase":1,"question_num":1,"red_flags":[],"collected":{},"progress":5,"done":false}

- message : votre texte au patient
- phase : 1, 2 ou 3
- question_num : numéro de question en cours (1-21)
- red_flags : liste de red flags détectés (chaînes)
- collected : objet avec les données recueillies mises à jour. Clés possibles : motif, zone, date_apparition, circonstances, douleur_matin, derouillage, type_douleur, trajet_irradiation, duree_crises, frequence_crises, evolution, facteurs_aggravants, facteurs_soulageants, symptomes_associes, eva, cardiovasculaire, respiratoire, endocrinien, digestif, renal, uro_gyneco, autres_antecedents, imagerie, traitements_anterieurs, chirurgies, traumatismes, medicaments, allergies, tabac, sommeil, stress, profession, sport, objectifs
- progress : pourcentage estimé (0-100)
- done : true quand l'interrogatoire est terminé

Quand done=true, ajoutez un champ "synthese" avec le résumé clinique complet en texte structuré.

## DÉMARRAGE
Premier message : saluez ${pi.prenom} par son prénom et posez directement Q1 (motif de consultation). Ne demandez PAS le nom.`;

// ⚠️ ATTENTION : La clé API OpenRouter est injectée côté client par Vite (process.env).
// Elle est visible dans le bundle JS déployé. C'est acceptable pour une clé free-tier
// mais NE PAS utiliser de clé payante ici. Pour sécuriser : migrer vers un backend proxy.
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Ollama local — fallback ultime, jamais rate-limited
const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';
const OLLAMA_MODEL = 'qwen3:8b';

// Fallback chain : si le 1er modèle retourne 429/erreur, on essaie le suivant
const MODEL_CHAIN = [
    'nvidia/nemotron-nano-9b-v2:free',   // Premier choix — le plus fiable
    'google/gemma-3-12b-it:free',        // Bon francais, parfois rate-limited
    'google/gemma-3-4b-it:free',         // Backup leger
    'mistralai/mistral-small-3.1-24b-instruct:free', // Dernier recours cloud
];

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
            setIsDone(true);
            setSynthesis(parsed.synthese || 'Anamnèse complète');
        }
        return parsed.message?.trim() || 'Pouvez-vous preciser votre reponse ?';
    };

    const sendToLLM = async (userMessage: string): Promise<string> => {
        chatHistory.current.push({ role: 'user', content: userMessage });

        // Limit chat history to prevent unbounded memory growth (#M26)
        const MAX_HISTORY = 50;
        if (chatHistory.current.length > MAX_HISTORY) {
            const systemMsg = chatHistory.current[0];
            chatHistory.current = [systemMsg, ...chatHistory.current.slice(-(MAX_HISTORY - 1))];
        }

        const MAX_RETRIES = 2;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            // Try each model in the fallback chain until one works
            let lastError: Error | null = null;
            for (const model of MODEL_CHAIN) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 12000);

                try {
                    const response = await fetch(OPENROUTER_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model,
                            messages: chatHistory.current,
                            max_tokens: 1024,
                            temperature: 0.7,
                        }),
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const errorData = await response.text();
                        console.warn(`[Fallback] ${model} → ${response.status}`, errorData);
                        lastError = new Error(`Erreur API (${response.status})`);
                        continue; // Try next model
                    }

                    const data = await response.json();
                    const assistantText = data.choices?.[0]?.message?.content?.trim();

                    // Empty response = try next model instead of showing error
                    if (!assistantText) {
                        console.warn(`[Fallback] ${model} → réponse vide`);
                        lastError = new Error('Réponse vide du modèle');
                        continue;
                    }

                    chatHistory.current.push({ role: 'assistant', content: assistantText });
                    console.info(`[LLM] Réponse via ${model} (attempt ${attempt + 1})`);
                    const parsed = parseLLMResponse(assistantText, { phase, questionNum, progress });
                    return applyResponse(parsed);
                } catch (err: any) {
                    clearTimeout(timeoutId);
                    if (err.name === 'AbortError') {
                        console.warn(`[Fallback] ${model} → timeout`);
                        lastError = new Error('Le serveur met trop de temps à répondre.');
                        continue; // Try next model
                    }
                    lastError = err;
                    continue;
                }
            }

            // All cloud models failed — try Ollama local before retrying
            try {
                const ollamaController = new AbortController();
                const ollamaTimeout = setTimeout(() => ollamaController.abort(), 30000); // 30s for local model
                const ollamaRes = await fetch(OLLAMA_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: OLLAMA_MODEL,
                        messages: chatHistory.current,
                        max_tokens: 1024,
                        temperature: 0.7,
                    }),
                    signal: ollamaController.signal,
                });
                clearTimeout(ollamaTimeout);

                if (ollamaRes.ok) {
                    const ollamaData = await ollamaRes.json();
                    const ollamaText = ollamaData.choices?.[0]?.message?.content?.trim();
                    if (ollamaText) {
                        chatHistory.current.push({ role: 'assistant', content: ollamaText });
                        console.info(`[LLM] Réponse via Ollama/${OLLAMA_MODEL} (attempt ${attempt + 1})`);
                        const parsed = parseLLMResponse(ollamaText, { phase, questionNum, progress });
                        return applyResponse(parsed);
                    }
                }
                console.warn(`[Fallback] Ollama/${OLLAMA_MODEL} → ${ollamaRes.ok ? 'réponse vide' : ollamaRes.status}`);
            } catch (ollamaErr: any) {
                console.warn(`[Fallback] Ollama/${OLLAMA_MODEL} → ${ollamaErr.name === 'AbortError' ? 'timeout' : 'indisponible'}`);
            }

            // Ollama also failed — retry with backoff
            if (attempt < MAX_RETRIES) {
                // Remove dangling user message to keep history clean for retry
                // (prevents Gemma 400 errors from incomplete user/assistant pairs)
                const lastMsg = chatHistory.current[chatHistory.current.length - 1];
                if (lastMsg?.role === 'user') {
                    chatHistory.current.pop();
                }
                const backoffMs = 10000 * (attempt + 1); // 10s, then 20s
                console.warn(`[Retry] All models failed, retrying in ${backoffMs / 1000}s (attempt ${attempt + 2}/${MAX_RETRIES + 1})...`);
                setIsRetrying(true);
                await new Promise(r => setTimeout(r, backoffMs));
                setIsRetrying(false);
                // Re-add user message for retry
                chatHistory.current.push({ role: 'user', content: userMessage });
            } else {
                // Final failure — clean up dangling user message
                const lastMsg = chatHistory.current[chatHistory.current.length - 1];
                if (lastMsg?.role === 'user') {
                    chatHistory.current.pop();
                }
                throw lastError || new Error('Tous les modèles sont indisponibles.');
            }
        }

        throw new Error('Tous les modèles sont indisponibles.');
    };

    // Initial greeting
    useEffect(() => {
        (async () => {
            setIsTyping(true);
            try {
                const botText = await sendToLLM("Bonjour, je suis prêt pour le questionnaire médical.");
                setMessages([{
                    id: '1',
                    text: botText,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } catch {
                // #M22 — Separate error message from welcome (2 distinct bubbles)
                const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages([
                    {
                        id: 'err-init',
                        text: `⚠️ L'assistant IA est temporairement indisponible. Vous pouvez quand même commencer.`,
                        sender: 'bot',
                        timestamp: ts,
                    },
                    {
                        id: 'welcome-fallback',
                        text: `Bonjour ${patientInfo.prenom} ! 😊\n\nQuelle est la raison de votre consultation ? Où avez-vous mal ou quel est votre problème ?`,
                        sender: 'bot',
                        timestamp: ts,
                    },
                ]);
            }
            setIsTyping(false);
        })();
    }, []);

    // Auto-submit to Drive when done
    useEffect(() => {
        if (!isDone || driveStatus !== 'idle' || !synthesis) return;

        (async () => {
            setDriveStatus('sending');
            try {
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const dateFr = now.toLocaleDateString('fr-FR');
                const nom = patientInfo.nom.toUpperCase();
                const prenom = patientInfo.prenom;
                const nss = patientInfo.numeroSecuriteSociale || '000';
                const patientFolder = `${nom}_${prenom}_${nss}`;
                const basePath = `APP BILANS/Patients Data/${patientFolder}`;
                const subFolder = `Tronc commun_${nss}`;
                const filename = `${nom}_${prenom}_${dateStr}_Anamnese_Chat_${nss}.txt`;
                const filePath = `${basePath}/${subFolder}/${filename}`;

                const content = [
                    `ANAMNÈSE CONVERSATIONNELLE — ${nom} ${prenom}`,
                    `Date : ${dateFr} à ${now.toLocaleTimeString('fr-FR')}`,
                    `Mode : Questionnaire LLM adaptatif (KSLB)`,
                    ``,
                    `═══════════════════════════════════════`,
                    `SYNTHÈSE CLINIQUE`,
                    `═══════════════════════════════════════`,
                    ``,
                    synthesis,
                    ``,
                    `═══════════════════════════════════════`,
                    `DONNÉES STRUCTURÉES (JSON)`,
                    `═══════════════════════════════════════`,
                    ``,
                    JSON.stringify(collectedData, null, 2),
                    ``,
                    redFlags.length > 0 ? `⚠️ RED FLAGS DÉTECTÉS : ${redFlags.join(', ')}` : 'Aucun red flag détecté.',
                    ``,
                    `═══════════════════════════════════════`,
                    `CONVERSATION COMPLÈTE`,
                    `═══════════════════════════════════════`,
                    ``,
                    ...messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'PATIENT' : 'ASSISTANT'} : ${m.text}`),
                ].join('\n');

                await submitBilan({
                    patientInfo: { ...patientInfo, date: dateFr },
                    filesToCreate: [{ path: filePath, content }],
                });

                setDriveStatus('success');
            } catch (err) {
                console.error('Drive submission error:', err);
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
                text: "Désolé, j'ai rencontré un petit problème technique. Pouvons-nous reprendre ? 🔄",
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

            {/* #C01 — API key warning banner */}
            {!process.env.OPENROUTER_API_KEY && (
                <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-amber-800 text-xs font-medium" role="alert">
                    ⚠️ Clé API OpenRouter manquante. Le chat ne fonctionnera pas. Configurez <code className="bg-amber-200 px-1 rounded">OPENROUTER_API_KEY</code> dans le fichier <code className="bg-amber-200 px-1 rounded">.env</code>.
                </div>
            )}

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
                        {driveStatus === 'sending' && '📤 Sauvegarde en cours...'}
                        {driveStatus === 'success' && '✅ Dossier sauvegardé'}
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
