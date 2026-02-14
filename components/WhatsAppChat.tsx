
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { submitBilan } from '../utils';
import { PatientInfo } from '../types';

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

interface LLMParsed {
    message: string;
    phase: number;
    question_num: number;
    red_flags: string[];
    collected: Record<string, any>;
    progress: number;
    done: boolean;
    synthese?: string;
}

const getSystemPrompt = (pi: PatientInfo) => `Vous êtes un assistant médical intelligent pour le cabinet de kinésithérapie KSLB.
Votre rôle est de mener un entretien d'anamnèse professionnel et bienveillant pour recueillir les informations médicales du patient AVANT sa consultation.

## PATIENT IDENTIFIÉ
Le patient est déjà connecté et identifié :
- Prénom : ${pi.prenom}
- Nom : ${pi.nom}
- N° Sécurité Sociale : ${pi.numeroSecuriteSociale}
NE DEMANDEZ PAS son nom, prénom ou numéro de sécu. Ces informations sont déjà enregistrées.

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

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-small-3.1-24b-instruct:free';

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ onBack, patientInfo }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);
    const [questionNum, setQuestionNum] = useState(0);
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [collectedData, setCollectedData] = useState<Record<string, any>>({});
    const [isDone, setIsDone] = useState(false);
    const [synthesis, setSynthesis] = useState<string | null>(null);
    const [driveStatus, setDriveStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatHistory = useRef<ChatMessage[]>([
        { role: 'system', content: getSystemPrompt(patientInfo) },
    ]);

    const phaseLabels: Record<number, string> = { 1: 'Motif & Symptômes', 2: 'Antécédents Médicaux', 3: 'Contexte & Mode de vie' };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const parseLLMResponse = (text: string): LLMParsed => {
        try {
            let s = text;
            s = s.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (fenceMatch) s = fenceMatch[1].trim();
            const braceMatch = s.match(/\{[\s\S]*\}/);
            if (braceMatch) s = braceMatch[0];
            return JSON.parse(s);
        } catch {
            const cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            return {
                message: cleanText,
                phase: phase,
                question_num: questionNum,
                red_flags: [],
                collected: {},
                progress: progress,
                done: false,
            };
        }
    };

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
        return parsed.message || '';
    };

    const sendToLLM = async (userMessage: string): Promise<string> => {
        chatHistory.current.push({ role: 'user', content: userMessage });

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: chatHistory.current,
                max_tokens: 1024,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter error:', response.status, errorData);
            throw new Error(`Erreur API (${response.status})`);
        }

        const data = await response.json();
        let assistantText = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
        chatHistory.current.push({ role: 'assistant', content: assistantText });

        const parsed = parseLLMResponse(assistantText);
        return applyResponse(parsed);
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
                setMessages([{
                    id: '1',
                    text: `Bonjour ${patientInfo.prenom} ! 👋 Je suis l'assistant numérique du cabinet KSLB.\n\nJe suis là pour préparer votre bilan de santé avant votre rendez-vous. Pour commencer, quelle est la raison de votre consultation ? Où avez-vous mal ou quel est votre problème ?`,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
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
        if (!inputValue.trim() || isTyping) return;

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
        <div className="flex flex-col h-[calc(100vh-64px)] w-full max-w-2xl mx-auto border-x bg-white shadow-2xl overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
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
                        {isTyping ? 'écrit...' : isDone ? '✅ Anamnèse terminée' : `En ligne • Q${questionNum}/21`}
                    </p>
                </div>
            </div>

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

            {/* Red Flags */}
            {redFlags.length > 0 && (
                <div className="mx-3 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-[11px] font-bold text-red-700">⚠️ Red Flags détectés</p>
                    {redFlags.map((f, i) => (
                        <p key={i} className="text-[11px] text-red-600">• {f}</p>
                    ))}
                </div>
            )}

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 wa-chat-bg flex flex-col gap-3">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`max-w-[85%] rounded-lg p-3 shadow-sm relative text-sm animate-in zoom-in-95 duration-200 ${
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
                    <div className="bg-white self-start rounded-lg rounded-tl-none p-3 shadow-sm flex items-center gap-1">
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
                        {driveStatus === 'error' && '❌ Erreur de sauvegarde — contactez le cabinet'}
                    </span>
                </div>
            )}

            {/* Input */}
            <div className="p-3 bg-[#F0F0F0] flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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

            <div className="bg-white px-4 py-2 text-center border-t">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    Les données sont sécurisées et envoyées directement à votre praticien.
                </p>
            </div>
        </div>
    );
};

export default WhatsAppChat;
