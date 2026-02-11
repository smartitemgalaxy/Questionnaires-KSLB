
import React, { useState, useMemo } from 'react';
import { 
    ALL_FABQ_QUESTIONS, PCS_QUESTIONS_FR, CSI_PART_A_QUESTIONS_FR, 
    OSWESTRY_QUESTIONS_FR, QUEBEC_QUESTIONS_FR, ROLAND_MORRIS_QUESTIONS_FR, 
    NDI_QUESTIONS_FR, NORTHWICK_PARK_QUESTIONS_FR, COPENHAGEN_QUESTIONS_FR, 
    DASH_QUESTIONS_FR, OSS_QUESTIONS_FR, ALL_SPADI_QUESTIONS_FR, 
    OSWESTRY_THORACIC_QUESTIONS_FR, IKDC_QUESTIONS_FR, LYSHOLM_QUESTIONS_FR, 
    KOOS_QUESTIONS_FR, OES_QUESTIONS_FR, ALL_PRTEE_QUESTIONS_FR, 
    ALL_PRWE_QUESTIONS_FR, MHQ_QUESTIONS_FR, HOOS_PS_QUESTIONS_FR, 
    OXFORD_HIP_SCORE_QUESTIONS_FR, HAGOS_QUESTIONS_FR, PFDI_QUESTIONS_FR, 
    ALL_FADI_QUESTIONS_FR, ALL_FFIR_QUESTIONS_FR, 
    FOGQ_QUESTIONS_FR, FES_QUESTIONS_FR, BERG_QUESTIONS_FR, 
    LEFS_QUESTIONS_FR, JFLS_QUESTIONS_FR, TMD_QUESTIONS_FR, 
    WPAI_QUESTIONS_FR, OBJECTIFS_QUESTIONS_FR, HAD_QUESTIONS_FR,
    ALL_MEDICAL_QUESTIONS, ANATOMY_HIERARCHY, MMRC_QUESTION_FR, SGRQ_QUESTIONS_FR
} from '../constants';

// PDFLib est chargé via le script tag dans index.html
declare var PDFLib: any;

interface DashboardProps {
    onBack: () => void;
}

interface QuestionnaireDef {
    id: string;
    title: string;
    description: string;
    instructions: string;
    category: string;
    questions: any;
    isMedical?: boolean;
    isChecklist?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const questionnaires: QuestionnaireDef[] = useMemo(() => [
        { 
            id: 'medical_complet', 
            title: 'Questionnaire Médical Complet', 
            category: 'Tronc Commun', 
            description: "Interrogatoire complet incluant Motif, Antécédents et Contexte de vie.",
            instructions: "Veuillez répondre à toutes les questions. Pour les cases à cocher, sélectionnez Oui ou Non. Utilisez les zones de texte pour apporter des précisions sur vos dates de diagnostic ou vos traitements actuels.",
            questions: ALL_MEDICAL_QUESTIONS, 
            isMedical: true 
        },
        { 
            id: 'objectifs', 
            title: 'Fixation d\'Objectifs', 
            category: 'Tronc Commun', 
            description: "Identification des valeurs et buts du patient.",
            instructions: "Ce questionnaire nous aide à orienter votre rééducation. Cochez les cases qui correspondent à vos priorités (maximum 3 par section) et utilisez les curseurs pour évaluer votre importance et votre confiance.",
            questions: OBJECTIFS_QUESTIONS_FR.sections 
        },
        { 
            id: 'fabq', 
            title: 'FABQ', 
            category: 'Tronc Commun', 
            description: "Croyances d'évitement de la peur liées à l'activité physique et au travail.",
            instructions: "Pour chaque affirmation, cochez le chiffre de 0 (Pas du tout d'accord) à 6 (Tout à fait d'accord) qui correspond le mieux à votre ressenti actuel.",
            questions: ALL_FABQ_QUESTIONS 
        },
        { 
            id: 'pcs', 
            title: 'PCS', 
            category: 'Tronc Commun', 
            description: "Échelle de catastrophisme face à la douleur.",
            instructions: "Indiquez dans quelle mesure vous avez ces pensées lorsque vous avez mal, de 0 (Pas du tout) à 4 (Tout le temps).",
            questions: PCS_QUESTIONS_FR 
        },
        { 
            id: 'csi', 
            title: 'CSI', 
            category: 'Tronc Commun', 
            description: "Inventaire de Sensibilisation Centrale.",
            instructions: "Partie A : évaluez la fréquence de vos symptômes de 0 (Jamais) à 4 (Toujours). Partie B : indiquez si un médecin a déjà posé l'un de ces diagnostics.",
            questions: CSI_PART_A_QUESTIONS_FR 
        },
        { 
            id: 'had', 
            title: 'HAD', 
            category: 'Tronc Commun', 
            description: "Échelle d'Anxiété et de Dépression.",
            instructions: "Cochez la réponse qui décrit le mieux votre état au cours de la semaine dernière. Ne réfléchissez pas trop longtemps, votre première impression est souvent la meilleure.",
            questions: HAD_QUESTIONS_FR 
        },
        { 
            id: 'oswestry', 
            title: 'Oswestry', 
            category: 'Rachis Lombaire', 
            description: "Incapacité fonctionnelle liée aux douleurs lombaires.",
            instructions: "Dans chaque section, ne cochez qu'UNE SEULE case, celle qui vous décrit le mieux AUJOURD'HUI.",
            questions: OSWESTRY_QUESTIONS_FR 
        },
        { 
            id: 'quebec', 
            title: 'Québec', 
            category: 'Rachis Lombaire', 
            description: "Handicap pour les activités quotidiennes lié au dos.",
            instructions: "Évaluez votre difficulté à accomplir ces tâches aujourd'hui, de 0 (Aucune difficulté) à 5 (Incapable).",
            questions: QUEBEC_QUESTIONS_FR 
        },
        { 
            id: 'rolandmorris', 
            title: 'Roland-Morris', 
            category: 'Rachis Lombaire', 
            description: "Incapacité fonctionnelle (EIFEL).",
            instructions: "Lisez chaque phrase. Si elle correspond à votre état AUJOURD'HUI, cochez la case. Si elle ne vous correspond pas, laissez-la vide.",
            questions: ROLAND_MORRIS_QUESTIONS_FR, 
            isChecklist: true 
        },
        { 
            id: 'ndi', 
            title: 'NDI', 
            category: 'Rachis Cervical', 
            description: "Neck Disability Index (Cervicalgies).",
            instructions: "Pour chaque catégorie, cochez la proposition qui se rapproche le plus de votre situation actuelle.",
            questions: NDI_QUESTIONS_FR 
        },
        { 
            id: 'dash', 
            title: 'DASH', 
            category: 'Membre Supérieur', 
            description: "Incapacité de l'épaule, du bras et de la main.",
            instructions: "Évaluez votre capacité à effectuer les activités suivantes au cours de la semaine dernière, sur une échelle de 1 (Aucune difficulté) à 5 (Incapable).",
            questions: DASH_QUESTIONS_FR 
        },
        { 
            id: 'oss', 
            title: 'Oxford Shoulder', 
            category: 'Épaule', 
            description: "Score d'évaluation de l'épaule.",
            instructions: "Répondez à chaque question en cochant la case correspondant à votre état au cours des 4 dernières semaines.",
            questions: OSS_QUESTIONS_FR 
        },
        { 
            id: 'spadi', 
            title: 'SPADI', 
            category: 'Épaule', 
            description: "Douleur et incapacité de l'épaule.",
            instructions: "Attribuez une note de 0 (Pas de douleur/difficulté) à 10 (Pire douleur/Incapable) pour chaque situation décrite.",
            questions: ALL_SPADI_QUESTIONS_FR 
        },
        { 
            id: 'oes', 
            title: 'Oxford Elbow', 
            category: 'Coude', 
            description: "Score d'évaluation du coude.",
            instructions: "Cochez la case qui correspond le mieux à votre coude sur les 4 dernières semaines.",
            questions: OES_QUESTIONS_FR 
        },
        { 
            id: 'prtee', 
            title: 'PRTEE', 
            category: 'Coude', 
            description: "Évaluation des épicondylalgies (Tennis Elbow).",
            instructions: "Évaluez votre douleur et votre fonction sur une échelle de 0 à 10 pour la semaine écoulée.",
            questions: ALL_PRTEE_QUESTIONS_FR 
        },
        { 
            id: 'prwe', 
            title: 'PRWE', 
            category: 'Poignet et Main', 
            description: "Évaluation des douleurs et fonctions du poignet.",
            instructions: "Notez la douleur et la difficulté de 0 à 10 pour chaque activité mentionnée.",
            questions: ALL_PRWE_QUESTIONS_FR 
        },
        { 
            id: 'mhq', 
            title: 'MHQ', 
            category: 'Poignet et Main', 
            description: "Michigan Hand Questionnaire.",
            instructions: "Répondez à chaque section en distinguant bien votre main droite de votre main gauche.",
            questions: MHQ_QUESTIONS_FR 
        },
        { 
            id: 'hoosps', 
            title: 'HOOS-PS', 
            category: 'Hanche', 
            description: "Fonction physique de la hanche.",
            instructions: "Indiquez votre degré de difficulté pour chaque activité au cours des 8 derniers jours.",
            questions: HOOS_PS_QUESTIONS_FR 
        },
        { 
            id: 'oxfordhip', 
            title: 'Oxford Hip Score', 
            category: 'Hanche', 
            description: "Score fonctionnel de la hanche.",
            instructions: "Choisissez l'option qui décrit le mieux votre état habituel sur le dernier mois.",
            questions: OXFORD_HIP_SCORE_QUESTIONS_FR 
        },
        { 
            id: 'hagos', 
            title: 'HAGOS', 
            category: 'Aine et Pubalgie', 
            description: "Hanche et aine chez le patient actif.",
            instructions: "Répondez à chaque question en pensant à votre hanche/aine au cours de la semaine écoulée.",
            questions: HAGOS_QUESTIONS_FR 
        },
        { 
            id: 'ikdc', 
            title: 'IKDC', 
            category: 'Genou', 
            description: "Évaluation subjective du genou.",
            instructions: "Répondez aux questions sur vos symptômes et votre niveau d'activité physique.",
            questions: IKDC_QUESTIONS_FR 
        },
        { 
            id: 'lysholm', 
            title: 'Lysholm', 
            category: 'Genou', 
            description: "Score fonctionnel du genou (Ligaments/Ménisques).",
            instructions: "Cochez la case qui décrit le mieux votre genou pour chaque catégorie.",
            questions: LYSHOLM_QUESTIONS_FR 
        },
        { 
            id: 'koos', 
            title: 'KOOS', 
            category: 'Genou', 
            description: "Knee injury and Osteoarthritis Outcome Score.",
            instructions: "Évaluez vos symptômes sur les 7 derniers jours en cochant la case appropriée.",
            questions: KOOS_QUESTIONS_FR 
        },
        { 
            id: 'lefs', 
            title: 'LEFS', 
            category: 'Membre Inférieur', 
            description: "Lower Extremity Functional Scale.",
            instructions: "Indiquez votre niveau de difficulté pour chaque activité, de 0 (Difficulté extrême) à 4 (Aucune difficulté).",
            questions: LEFS_QUESTIONS_FR 
        },
        { 
            id: 'pfdi', 
            title: 'PFDI-20', 
            category: 'Plancher Pelvien', 
            description: "Détresse liée aux troubles du plancher pelvien.",
            instructions: "Pour chaque question, indiquez d'abord si vous avez le symptôme, puis si oui, à quel point il vous gêne (de 0 à 4).",
            questions: PFDI_QUESTIONS_FR 
        },
        { 
            id: 'fadi', 
            title: 'FADI', 
            category: 'Cheville et Pied', 
            description: "Foot and Ankle Disability Index.",
            instructions: "Répondez à chaque question en décrivant votre état au cours de la semaine dernière.",
            questions: ALL_FADI_QUESTIONS_FR 
        },
        { 
            id: 'ffir', 
            title: 'FFI-R', 
            category: 'Cheville et Pied', 
            description: "Foot Function Index (Version révisée).",
            instructions: "Indiquez votre niveau de douleur ou de difficulté sur les échelles proposées.",
            questions: ALL_FFIR_QUESTIONS_FR 
        },
        { 
            id: 'jfls', 
            title: 'JFLS-20', 
            category: 'ATM', 
            description: "Limitation fonctionnelle de la mâchoire.",
            instructions: "Indiquez votre niveau de limitation pour chaque action au cours du dernier mois, de 0 (Aucune limitation) à 10 (Limitation sévère).",
            questions: JFLS_QUESTIONS_FR 
        },
        { 
            id: 'tmd', 
            title: 'TMD', 
            category: 'ATM', 
            description: "Indice de dysfonction temporo-mandibulaire.",
            instructions: "Cochez l'affirmation qui vous correspond le mieux dans chaque catégorie.",
            questions: TMD_QUESTIONS_FR 
        },
        { 
            id: 'berg', 
            title: 'Berg', 
            category: 'Équilibre et Marche', 
            description: "Échelle d'équilibre de Berg.",
            instructions: "Auto-évaluez votre capacité à réaliser ces tests d'équilibre sans aide.",
            questions: BERG_QUESTIONS_FR 
        },
        { 
            id: 'fogq', 
            title: 'FOGQ', 
            category: 'Équilibre et Marche', 
            description: "Freezing of Gait Questionnaire (Parkinson).",
            instructions: "Répondez aux questions en décrivant vos épisodes de blocage à la marche.",
            questions: FOGQ_QUESTIONS_FR 
        },
        { 
            id: 'mmrc', 
            title: 'mMRC', 
            category: 'Respiratoire', 
            description: "Échelle de dyspnée (Essoufflement).",
            instructions: "Cochez la seule case qui décrit le mieux votre essoufflement dans la vie quotidienne.",
            questions: MMRC_QUESTION_FR.options 
        },
        { 
            id: 'sgrq', 
            title: 'SGRQ', 
            category: 'Respiratoire', 
            description: "Qualité de vie liée aux problèmes respiratoires.",
            instructions: "Répondez à toutes les sections en suivant les indications spécifiques pour chaque bloc de questions.",
            questions: SGRQ_QUESTIONS_FR.part1 
        },
    ], []);

    const categories = useMemo(() => ['all', ...Array.from(new Set(questionnaires.map(q => q.category)))], [questionnaires]);

    const filteredQuestionnaires = useMemo(() => {
        if (filter === 'all') return questionnaires;
        return questionnaires.filter(q => q.category === filter);
    }, [filter, questionnaires]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleDownloadPDF = async () => {
        if (selectedIds.length === 0) return;
        setIsGenerating(true);
        
        try {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
            const form = pdfDoc.getForm();

            for (const id of selectedIds) {
                const qDef = questionnaires.find(q => q.id === id);
                if (!qDef) continue;

                let page = pdfDoc.addPage([595.28, 841.89]); // A4
                let cursorY = 800;
                let pageNumber = 1;

                const addNewPage = () => {
                    page = pdfDoc.addPage([595.28, 841.89]);
                    cursorY = 800;
                    pageNumber++;
                    page.drawText(`${qDef.title} - Page ${pageNumber}`, { x: 50, y: cursorY, size: 8, font: font, color: rgb(0.6, 0.6, 0.6) });
                    cursorY -= 30;
                };

                const checkSpace = (needed: number) => {
                    if (cursorY - needed < 50) {
                        addNewPage();
                    }
                };

                // HEADER
                page.drawText(qDef.title.toUpperCase(), { x: 50, y: cursorY, size: 18, font: fontBold, color: rgb(0.05, 0.34, 0.65) });
                cursorY -= 18;
                
                // Description
                const descLines = qDef.description.match(/.{1,100}/g) || [];
                descLines.forEach(line => {
                    page.drawText(line, { x: 50, y: cursorY, size: 9, font: font, color: rgb(0.3, 0.3, 0.3) });
                    cursorY -= 12;
                });
                cursorY -= 10;

                // INSTRUCTIONS BOX (MODIFICATION DEMANDÉE)
                checkSpace(60);
                page.drawRectangle({ x: 50, y: cursorY - 35, width: 500, height: 40, color: rgb(0.96, 0.97, 1), borderColor: rgb(0.8, 0.85, 0.9), borderWidth: 1 });
                page.drawText("NOTICE DE REMPLISSAGE :", { x: 60, y: cursorY - 12, size: 7, font: fontBold, color: rgb(0.1, 0.3, 0.6) });
                
                const instrLines = qDef.instructions.match(/.{1,110}/g) || [];
                instrLines.slice(0, 2).forEach((line, i) => {
                    page.drawText(line, { x: 60, y: cursorY - 24 - (i * 10), size: 8, font: fontItalic, color: rgb(0.2, 0.2, 0.2) });
                });
                cursorY -= 55;

                // PATIENT BOX
                page.drawRectangle({ x: 50, y: cursorY - 40, width: 500, height: 40, borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1, color: rgb(0.98, 0.99, 1) });
                page.drawText("NOM & PRÉNOM :", { x: 60, y: cursorY - 12, size: 6, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
                const nameField = form.createTextField(`${id}.name.p${pageNumber}`);
                nameField.addToPage(page, { x: 60, y: cursorY - 32, width: 280, height: 16 });
                
                page.drawText("DATE :", { x: 380, y: cursorY - 12, size: 6, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
                const dateField = form.createTextField(`${id}.date.p${pageNumber}`);
                dateField.addToPage(page, { x: 380, y: cursorY - 32, width: 140, height: 16 });
                cursorY -= 70;

                // QUESTION RENDERING ENGINE
                const drawQuestion = (q: any, idx: number, forceChecklist: boolean = false) => {
                    const qText = q.text || q.section || q.title || `Question ${idx + 1}`;
                    
                    if (forceChecklist) {
                        checkSpace(25);
                        const cb = form.createCheckBox(`${id}.q${idx}.check`);
                        cb.addToPage(page, { x: 50, y: cursorY - 12, width: 12, height: 12 });
                        page.drawText(qText.substring(0, 120), { x: 70, y: cursorY - 10, size: 9, font: font });
                        cursorY -= 20;
                        return;
                    }

                    checkSpace(80);
                    page.drawText(`${idx + 1}. ${qText.substring(0, 95)}`, { x: 50, y: cursorY, size: 10, font: fontBold });
                    cursorY -= 15;

                    if (q.type === 'anatomy-selector') {
                        const zones = ANATOMY_HIERARCHY.map(n => n.name).slice(0, 12);
                        const colWidth = 120;
                        zones.forEach((zone, zIdx) => {
                            const row = Math.floor(zIdx / 4);
                            const col = zIdx % 4;
                            const cb = form.createCheckBox(`${id}.q${idx}.z${zIdx}`);
                            cb.addToPage(page, { x: 60 + (col * colWidth), y: cursorY - 12 - (row * 15), width: 10, height: 10 });
                            page.drawText(zone, { x: 75 + (col * colWidth), y: cursorY - 10 - (row * 15), size: 7, font: font });
                        });
                        cursorY -= 20 + (Math.ceil(zones.length / 4) * 15);
                        page.drawText("Précisez :", { x: 60, y: cursorY, size: 7, font: font, color: rgb(0.5, 0.5, 0.5) });
                        const tf = form.createTextField(`${id}.q${idx}.anatomy_text`);
                        tf.addToPage(page, { x: 100, y: cursorY - 3, width: 450, height: 12 });
                        cursorY -= 25;
                    } 
                    else if (q.type === 'yes-no' || q.type === 'yes-no-specify') {
                        const cbO = form.createCheckBox(`${id}.q${idx}.oui`);
                        cbO.addToPage(page, { x: 65, y: cursorY - 10, width: 12, height: 12 });
                        page.drawText("OUI", { x: 80, y: cursorY - 8, size: 8, font: font });

                        const cbN = form.createCheckBox(`${id}.q${idx}.non`);
                        cbN.addToPage(page, { x: 120, y: cursorY - 10, width: 12, height: 12 });
                        page.drawText("NON", { x: 135, y: cursorY - 8, size: 8, font: font });

                        if (q.type === 'yes-no-specify') {
                            page.drawText("Détails :", { x: 180, y: cursorY - 8, size: 7, font: font, color: rgb(0.4, 0.4, 0.4) });
                            const tf = form.createTextField(`${id}.q${idx}.spec`);
                            tf.addToPage(page, { x: 220, y: cursorY - 12, width: 330, height: 14 });
                        }
                        cursorY -= 30;
                    } 
                    else if (q.options) {
                        const opts = Array.isArray(q.options) ? q.options : [];
                        opts.forEach((opt: any, oIdx: number) => {
                            checkSpace(20);
                            const label = typeof opt === 'string' ? opt : (opt.text || opt.label);
                            const cb = form.createCheckBox(`${id}.q${idx}.opt${oIdx}`);
                            cb.addToPage(page, { x: 65, y: cursorY - 10, width: 10, height: 10 });
                            page.drawText(label.substring(0, 115), { x: 80, y: cursorY - 8, size: 8, font: font });
                            cursorY -= 15;
                        });
                        cursorY -= 10;
                    } 
                    else {
                        const tf = form.createTextField(`${id}.q${idx}.ans`);
                        tf.addToPage(page, { x: 60, y: cursorY - 14, width: 490, height: 16 });
                        cursorY -= 35;
                    }
                };

                if (qDef.isMedical) {
                    let qIdxGlobal = 0;
                    qDef.questions.forEach((section: any, sIdx: number) => {
                        checkSpace(40);
                        page.drawRectangle({ x: 50, y: cursorY - 5, width: 500, height: 18, color: rgb(0.9, 0.92, 0.95) });
                        page.drawText(`${sIdx + 1}. ${section.title.toUpperCase()}`, { x: 55, y: cursorY + 2, size: 9, font: fontBold });
                        cursorY -= 30;
                        section.questions.forEach((q: any) => {
                            drawQuestion(q, qIdxGlobal++);
                        });
                        cursorY -= 10;
                    });
                } else {
                    const isChecklist = qDef.isChecklist;
                    qDef.questions.forEach((q: any, idx: number) => {
                        drawQuestion(q, idx, isChecklist);
                    });
                }

                // FOOTER
                page.drawText(`Document généré par KSLB - Questionnaire Interactif - ${new Date().toLocaleDateString()}`, { x: 50, y: 30, size: 7, font: font, color: rgb(0.7, 0.7, 0.7) });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Bilans_KSLB_Interactifs_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Erreur lors de l'exportation PDF. Veuillez réessayer.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 no-print animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border-2 border-gray-50">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-black text-[#0D57A6] tracking-tight">Catalogue des Bilans</h2>
                    <p className="text-gray-500 font-medium mt-1">Sélectionnez et générez des PDF **interactifs** incluant les notices de remplissage.</p>
                </div>
                <button 
                    onClick={onBack}
                    className="group px-6 py-3 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center gap-2 uppercase text-xs tracking-widest"
                >
                    Retour
                </button>
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                            filter === cat ? 'bg-[#1565C0] text-white shadow-xl scale-105' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-blue-200 hover:text-blue-600'
                        }`}
                    >
                        {cat === 'all' ? 'Tout le catalogue' : cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                {filteredQuestionnaires.map(q => {
                    const isSelected = selectedIds.includes(q.id);
                    return (
                        <div 
                            key={q.id}
                            onClick={() => toggleSelection(q.id)}
                            className={`group p-6 rounded-[2rem] border-2 transition-all cursor-pointer bg-white ${
                                isSelected ? 'border-[#1565C0] bg-blue-50/30 ring-8 ring-blue-50/50' : 'border-gray-100 hover:border-blue-100 shadow-sm'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-[#1565C0] border-[#1565C0] text-white rotate-3 shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-300'
                                }`}>
                                    {isSelected ? '✓' : '+'}
                                </div>
                                <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider border ${
                                    isSelected ? 'bg-blue-100 border-blue-200 text-blue-800' : 'bg-gray-50 border-gray-100 text-gray-400'
                                }`}>
                                    {q.category}
                                </span>
                            </div>
                            <h3 className={`font-black text-xl leading-tight ${isSelected ? 'text-[#0D57A6]' : 'text-gray-900'}`}>{q.title}</h3>
                            <p className="text-xs text-gray-500 mt-3 font-medium line-clamp-2 leading-relaxed">{q.description}</p>
                            {isSelected && (
                                <div className="mt-4 p-3 bg-blue-100/50 rounded-xl border border-blue-100 text-[10px] text-blue-800 font-bold uppercase tracking-wider animate-in slide-in-from-top-2">
                                    Notice incluse
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-[60] animate-in slide-in-from-bottom-10">
                    <div className="bg-gray-900 border border-white/10 p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between gap-6 backdrop-blur-xl">
                        <div className="pl-4 border-l-4 border-blue-500">
                            <p className="text-3xl font-black text-white leading-none">{selectedIds.length}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Sélection</p>
                        </div>
                        <button 
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="flex-1 px-8 py-5 bg-[#1565C0] text-white text-sm font-black rounded-3xl hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest group"
                        >
                            {isGenerating ? (
                                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Génération...</>
                            ) : (
                                <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-125" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg> Télécharger PDF Interactifs (+ Notices)</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
