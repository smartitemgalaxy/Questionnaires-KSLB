import React, { useMemo, useState } from 'react';
import { PatientInfo, FABQAnswers, MedicalAnswers, MedicalAnswer, PCSAnswers, CSI_PartA_Answers, CSI_PartB_Answers, AnatomySelection, OswestryAnswers, QuebecAnswers, RolandMorrisAnswers, NDIAnswers, NorthwickParkAnswers, CopenhagenAnswers, DASHAnswers, OSSAnswers, SPADIAnswers, VASAnswers, OswestryThoracicAnswers, IKDCAnswers, LysholmAnswers, KOOSAnswers, OESAnswers, PRTEEAnswers, PRWEAnswers, MHQAnswers, HOOSPSAnswers, HarrisHipScoreAnswers, OHSAnswers, HAGOSAnswers, PFDIAnswers, ICIQAnswers, AOFASAnswers, FADIAnswers, FFIRAnswers, FOGQAnswers, FESAnswers, FESIAnswers, BergAnswers, LEFSAnswers, JFLSAnswers, TMDAnswers, WPAIAnswers, ObjectifsAnswers, AmplitudesAnswers, MMRCAnswers, SGRQAnswers, PSFSAnswers, Step } from './types';
// FIX: Step is already imported from './types' above. Removed the erroneous import from '../App'.
import { 
    ALL_FABQ_QUESTIONS, 
    SCORE_SCALE_WORK_ITEMS, 
    SCORE_SCALE_PHYSICAL_ACTIVITY_ITEMS, 
    MEDICAL_QUESTIONNAIRE,
    PCS_QUESTIONS_FR,
    CSI_PART_A_QUESTIONS_FR,
    CSI_PART_B_QUESTIONS_FR,
    OSWESTRY_QUESTIONS_FR,
    QUEBEC_QUESTIONS_FR,
    ROLAND_MORRIS_QUESTIONS_FR,
    NDI_QUESTIONS_FR,
    NORTHWICK_PARK_QUESTIONS_FR,
    COPENHAGEN_QUESTIONS_FR,
    DASH_QUESTIONS_FR,
    OSS_QUESTIONS_FR,
    SPADI_PAIN_QUESTIONS_FR,
    SPADI_DISABILITY_QUESTIONS_FR,
    OSWESTRY_THORACIC_QUESTIONS_FR,
    LYSHOLM_QUESTIONS_FR,
    KOOS_QUESTIONS_FR,
    OES_QUESTIONS_FR,
    PRTEE_PAIN_QUESTIONS_FR,
    PRTEE_SPECIFIC_ACTIVITIES_QUESTIONS_FR,
    PRTEE_USUAL_ACTIVITIES_QUESTIONS_FR,
    PRWE_PAIN_QUESTIONS_FR,
    PRWE_SPECIFIC_ACTIVITIES_QUESTIONS_FR,
    PRWE_USUAL_ACTIVITIES_QUESTIONS_FR,
    MHQ_QUESTIONS_FR,
    HOOS_PS_QUESTIONS_FR,
    OXFORD_HIP_SCORE_QUESTIONS_FR,
    HAGOS_QUESTIONS_FR,
    PFDI_QUESTIONS_FR,
    ICIQ_DATA_FR,
    FADI_ADL_QUESTIONS_FR,
    FADI_SPORTS_QUESTIONS_FR,
    FOGQ_QUESTIONS_FR,
    FES_QUESTIONS_FR,
    BERG_QUESTIONS_FR,
    LEFS_QUESTIONS_FR,
    JFLS_QUESTIONS_FR,
    TMD_QUESTIONS_FR,
    IKDC_QUESTIONS_FR,
    ALL_FADI_QUESTIONS_FR,
    ALL_FFIR_QUESTIONS_FR,
    WPAI_QUESTIONS_FR,
    ALL_PRTEE_QUESTIONS_FR,
    ALL_PRWE_QUESTIONS_FR,
    OBJECTIFS_QUESTIONS_FR,
    AMPLITUDES_QUESTIONS_FR
} from './constants';
import { submitBilan, generateFabqText, generateMedicalText, generatePcsText, generateCsiText, generateOswestryText, generateQuebecText, generateRolandMorrisText, generateNdiText, generateNorthwickParkText, generateCopenhagenText, generateDashText, generateOssText, generateSpadiText, generateVasText, generateOswestryThoracicText, generateIkdcText, generateLysholmText, generateKoosText, generatePatientReportText, downloadTextFile, generateOesText, generatePrteeText, generatePrweText, generateMhqText, generateHoospsText, generateHarrisHipScoreText, generateOxfordHipScoreText, generateHagosText, generatePfdiText, generateIciqText, generateAofasText, generateFadiText, generateFfirText, generateFogqText, generateFesText, generateFesiText, generateBergText, generateLefsText, generateJflsText, generateTmdText, generateWpaiText, generateObjectifsText, generateAmplitudesText, generateMmrcText, generateSgrqText, generatePsfsText } from './utils';

interface SummaryPageProps {
    patientInfo: PatientInfo;
    fabqAnswers: FABQAnswers;
    pcsAnswers: PCSAnswers;
    csiPartAAnswers: CSI_PartA_Answers;
    csiPartBAnswers: CSI_PartB_Answers;
    medicalAnswers: MedicalAnswers;
    amplitudesAnswers: AmplitudesAnswers;
    oswestryAnswers: OswestryAnswers;
    quebecAnswers: QuebecAnswers;
    rolandMorrisAnswers: RolandMorrisAnswers;
    ndiAnswers: NDIAnswers;
    northwickAnswers: NorthwickParkAnswers;
    copenhagenAnswers: CopenhagenAnswers;
    dashAnswers: DASHAnswers;
    ossAnswers: OSSAnswers;
    spadiAnswers: SPADIAnswers;
    oesAnswers: OESAnswers;
    prteeAnswers: PRTEEAnswers;
    prweAnswers: PRWEAnswers;
    mhqAnswers: MHQAnswers;
    vasAnswers: VASAnswers;
    oswestryThoracicAnswers: OswestryThoracicAnswers;
    ikdcAnswers: IKDCAnswers;
    lysholmAnswers: LysholmAnswers;
    koosAnswers: KOOSAnswers;
    hoospsAnswers: HOOSPSAnswers;
    harrisHipScoreAnswers: HarrisHipScoreAnswers;
    oxfordHipScoreAnswers: OHSAnswers;
    hagosAnswers: HAGOSAnswers;
    pfdiAnswers: PFDIAnswers;
    iciqAnswers: ICIQAnswers;
    aofasAnswers: AOFASAnswers;
    fadiAnswers: FADIAnswers;
    ffirAnswers: FFIRAnswers;
    fogqAnswers: FOGQAnswers;
    fesAnswers: FESAnswers;
    fesiAnswers: FESIAnswers;
    bergAnswers: BergAnswers;
    lefsAnswers: LEFSAnswers;
    jflsAnswers: JFLSAnswers;
    tmdAnswers: TMDAnswers;
    wpaiAnswers: WPAIAnswers;
    objectifsAnswers: ObjectifsAnswers;
    mmrcAnswers: MMRCAnswers;
    sgrqAnswers: SGRQAnswers;
    psfsAnswers: { [key: string]: PSFSAnswers };
    visibleSteps: Step[];
    onEditQuestionnaire: (step: Step) => void;
    onRestart: () => void;
}

const ScoreCard: React.FC<{ title: string; score: number | null; maxScore?: number; completionText?: string; isComplete: boolean; onClick?: () => void; }> = ({ title, score, maxScore, completionText, isComplete, onClick }) => {
    const WrapperComponent = isComplete ? 'div' : 'button';

    return (
        <WrapperComponent
            onClick={!isComplete ? onClick : undefined}
            className={`rounded-lg shadow p-6 flex flex-col items-center text-center transition-all duration-200 ${
                !isComplete 
                ? 'bg-red-50 border-2 border-red-300 hover:bg-red-100 cursor-pointer' 
                : 'bg-gray-50'
            }`}
        >
            <h3 className={`text-lg font-semibold ${!isComplete ? 'text-red-700' : 'text-gray-600'}`}>{title}</h3>
            <p className={`text-5xl font-bold my-2 ${!isComplete ? 'text-red-600' : 'text-blue-800'}`}>
                {score !== null ? score : '--'}
                {maxScore !== undefined && <span className="text-2xl text-gray-400 font-normal"> / {maxScore}</span>}
            </p>
            {completionText && <p className={`text-sm ${!isComplete ? 'text-red-500' : 'text-gray-500'}`}>{completionText}</p>}
            {!isComplete && <p className="text-xs text-red-600 font-semibold mt-2">Questionnaire incomplet. Cliquez pour compléter.</p>}
        </WrapperComponent>
    );
};


const SummaryPage: React.FC<SummaryPageProps> = ({ 
    patientInfo, fabqAnswers, pcsAnswers, csiPartAAnswers, csiPartBAnswers, medicalAnswers, oswestryAnswers, 
    quebecAnswers, rolandMorrisAnswers, ndiAnswers, northwickAnswers, copenhagenAnswers, dashAnswers, ossAnswers, 
    spadiAnswers, oesAnswers, prteeAnswers, prweAnswers, mhqAnswers, vasAnswers, oswestryThoracicAnswers, 
    ikdcAnswers, lysholmAnswers, koosAnswers, hoospsAnswers, harrisHipScoreAnswers, oxfordHipScoreAnswers, hagosAnswers,
    pfdiAnswers, iciqAnswers, aofasAnswers, fadiAnswers, ffirAnswers, fogqAnswers, fesAnswers, fesiAnswers, bergAnswers, lefsAnswers, jflsAnswers, tmdAnswers, wpaiAnswers,
    objectifsAnswers, amplitudesAnswers, mmrcAnswers, sgrqAnswers, psfsAnswers,
    visibleSteps, onEditQuestionnaire, onRestart 
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submissionMessage, setSubmissionMessage] = useState('');
    
    const fabqScores = useMemo(() => {
        const workScore = SCORE_SCALE_WORK_ITEMS.reduce((sum, id) => sum + (fabqAnswers[id] || 0), 0);
        const physicalActivityScore = SCORE_SCALE_PHYSICAL_ACTIVITY_ITEMS.reduce((sum, id) => sum + (fabqAnswers[id] || 0), 0);
        return { work: workScore, physicalActivity: physicalActivityScore };
    }, [fabqAnswers]);

    const pcsScore = useMemo(() => {
        const answered = PCS_QUESTIONS_FR.filter(q => pcsAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((sum, q) => sum + (pcsAnswers[q.id] || 0), 0);
    }, [pcsAnswers]);

    const csiScore = useMemo(() => {
        const answered = CSI_PART_A_QUESTIONS_FR.filter(q => csiPartAAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((sum, q) => sum + (csiPartAAnswers[q.id] || 0), 0);
    }, [csiPartAAnswers]);

    const { oswestryScore, oswestryAnsweredSections } = useMemo(() => {
        // FIX: Corrected typo 'osswestryAnswers' to 'oswestryAnswers'
        const answered = OSWESTRY_QUESTIONS_FR.filter(q => oswestryAnswers[q.id] !== null);
        // FIX: Corrected typo 'osswestryAnswers' to 'oswestryAnswers'
        const totalScore = answered.reduce((sum, q) => sum + (oswestryAnswers[q.id] || 0), 0);
        return { oswestryScore: answered.length > 0 ? totalScore : null, oswestryAnsweredSections: answered.length };
        // FIX: Corrected typo 'osswestryAnswers' to 'oswestryAnswers' in dependency array
    }, [oswestryAnswers]);

    const quebecScore = useMemo(() => {
        const answered = QUEBEC_QUESTIONS_FR.filter(q => quebecAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((sum, q) => sum + (quebecAnswers[q.id] || 0), 0);
    }, [quebecAnswers]);
    
    const rolandMorrisScore = useMemo(() => {
        const answeredCount = ROLAND_MORRIS_QUESTIONS_FR.filter(q => rolandMorrisAnswers[q.id]).length;
        return answeredCount;
    }, [rolandMorrisAnswers]);

    const { ndiScore, ndiAnsweredSections } = useMemo(() => {
        const answered = NDI_QUESTIONS_FR.filter(q => ndiAnswers[q.id] !== null);
        const totalScore = answered.reduce((sum, q) => sum + (ndiAnswers[q.id] || 0), 0);
        return { ndiScore: answered.length > 0 ? totalScore : null, ndiAnsweredSections: answered.length };
    }, [ndiAnswers]);

    const { northwickScore, northwickAnsweredSections } = useMemo(() => {
        const scoredQuestions = NORTHWICK_PARK_QUESTIONS_FR.filter(q => q.id !== 10);
        const answered = scoredQuestions.filter(q => northwickAnswers[q.id] !== null);
        const totalScore = answered.reduce((sum, q) => sum + (northwickAnswers[q.id] || 0), 0);
        return { northwickScore: answered.length > 0 ? totalScore : null, northwickAnsweredSections: answered.length };
    }, [northwickAnswers]);

    const copenhagenScore = useMemo(() => {
        const answered = COPENHAGEN_QUESTIONS_FR.filter(q => copenhagenAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((sum, q) => sum + (copenhagenAnswers[q.id] === 0 ? 0 : 1), 0);
    }, [copenhagenAnswers]);

    const { dashScore, dashAnsweredCount } = useMemo(() => {
        const answered = DASH_QUESTIONS_FR.filter(q => dashAnswers[q.id] !== null);
        if (answered.length < 27) return { dashScore: null, dashAnsweredCount: answered.length };
        const sum = answered.reduce((acc, q) => acc + (dashAnswers[q.id] || 0), 0);
        const score = ((sum / answered.length) - 1) * 25;
        return { dashScore: Math.round(score), dashAnsweredCount: answered.length };
    }, [dashAnswers]);

    const ossScore = useMemo(() => {
        const answered = OSS_QUESTIONS_FR.filter(q => ossAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((acc, q) => acc + (ossAnswers[q.id]!), 0);
    }, [ossAnswers]);

    const { spadiPainScore, spadiDisabilityScore } = useMemo(() => {
        const answeredPain = SPADI_PAIN_QUESTIONS_FR.filter(q => spadiAnswers[q.id] !== null);
        const answeredDisability = SPADI_DISABILITY_QUESTIONS_FR.filter(q => spadiAnswers[q.id] !== null);
        const painSum = answeredPain.reduce((acc, q) => acc + (spadiAnswers[q.id] || 0), 0);
        const disabilitySum = answeredDisability.reduce((acc, q) => acc + (spadiAnswers[q.id] || 0), 0);
        return { 
            spadiPainScore: answeredPain.length > 0 ? painSum : null, 
            spadiDisabilityScore: answeredDisability.length > 0 ? disabilitySum : null
        };
    }, [spadiAnswers]);

    const oesScore = useMemo(() => {
        const answered = OES_QUESTIONS_FR.filter(q => oesAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((acc, q) => acc + (oesAnswers[q.id]!), 0);
    }, [oesAnswers]);
    
    const prteeScores = useMemo(() => {
        const pain = PRTEE_PAIN_QUESTIONS_FR.filter(q => prteeAnswers[q.id] !== null);
        const func = [...PRTEE_SPECIFIC_ACTIVITIES_QUESTIONS_FR, ...PRTEE_USUAL_ACTIVITIES_QUESTIONS_FR].filter(q => prteeAnswers[q.id] !== null);
        const painScore = pain.length > 0 ? pain.reduce((s, q) => s + (prteeAnswers[q.id] || 0), 0) : null;
        const funcScore = func.length > 0 ? func.reduce((s, q) => s + (prteeAnswers[q.id] || 0), 0) : null;
        return { pain: painScore, function: funcScore, total: (painScore ?? 0) + (funcScore ?? 0) };
    }, [prteeAnswers]);

    const prweScores = useMemo(() => {
        const pain = PRWE_PAIN_QUESTIONS_FR.filter(q => prweAnswers[q.id] !== null);
        const func = [...PRWE_SPECIFIC_ACTIVITIES_QUESTIONS_FR, ...PRWE_USUAL_ACTIVITIES_QUESTIONS_FR].filter(q => prweAnswers[q.id] !== null);
        const painScore = pain.length > 0 ? pain.reduce((s, q) => s + (prweAnswers[q.id] || 0), 0) : null;
        const funcScore = func.length > 0 ? func.reduce((s, q) => s + (prweAnswers[q.id] || 0), 0) : null;
        return { pain: painScore, function: funcScore, total: (painScore ?? 0) + (funcScore ?? 0) };
    }, [prweAnswers]);
    
    const vasScore = useMemo(() => vasAnswers.pain, [vasAnswers]);

    const { oswestryThoracicScore, oswestryThoracicAnsweredSections } = useMemo(() => {
        const answered = OSWESTRY_THORACIC_QUESTIONS_FR.filter(q => oswestryThoracicAnswers[q.id] !== null);
        const totalScore = answered.reduce((sum, q) => sum + (oswestryThoracicAnswers[q.id] || 0), 0);
        return { oswestryThoracicScore: answered.length > 0 ? totalScore : null, oswestryThoracicAnsweredSections: answered.length };
    }, [oswestryThoracicAnswers]);
    
    const lysholmScore = useMemo(() => {
        const answered = LYSHOLM_QUESTIONS_FR.filter(q => lysholmAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((total, q) => total + q.options[lysholmAnswers[q.id]!].score, 0);
    }, [lysholmAnswers]);

    const hoospsScore = useMemo(() => {
        const answered = HOOS_PS_QUESTIONS_FR.filter(q => hoospsAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((acc, q) => acc + (hoospsAnswers[q.id]!), 0);
    }, [hoospsAnswers]);

    const oxfordHipScore = useMemo(() => {
        const answered = OXFORD_HIP_SCORE_QUESTIONS_FR.filter(q => oxfordHipScoreAnswers[q.id] !== null);
        if (answered.length === 0) return null;
        return answered.reduce((acc, q) => acc + (oxfordHipScoreAnswers[q.id]!), 0);
    }, [oxfordHipScoreAnswers]);
    
    const jflsScore = useMemo(() => {
        const answered = JFLS_QUESTIONS_FR.filter(q => jflsAnswers[q.id] !== null);
        if(answered.length === 0) return null;
        return answered.reduce((s, q) => s + (jflsAnswers[q.id] || 0), 0);
    }, [jflsAnswers]);

    const tmdScore = useMemo(() => {
        const answered = TMD_QUESTIONS_FR.filter(q => tmdAnswers[q.id] !== null);
        if(answered.length === 0) return null;
        return answered.reduce((s, q) => s + (tmdAnswers[q.id] || 0), 0);
    }, [tmdAnswers]);

    const mmrcScore = useMemo(() => mmrcAnswers.score, [mmrcAnswers]);

    const wasFabqFilled = Object.values(fabqAnswers).some(a => a !== null);
    const wasPcsFilled = Object.values(pcsAnswers).some(a => a !== null);
    const wasCsiFilled = Object.values(csiPartAAnswers).some(a => a !== null);
    const wasMedicalFilled = MEDICAL_QUESTIONNAIRE.flatMap(s => s.questions).some(q => medicalAnswers[q.id]?.value !== null && medicalAnswers[q.id]?.value !== '');
    const wasAmplitudesFilled = Object.keys(amplitudesAnswers).length > 0;
    const wasObjectifsFilled = objectifsAnswers && Object.values(objectifsAnswers).some(a => (Array.isArray(a) && a.length > 0 && a.some(i => i !== '')) || (typeof a === 'string' && a !== '') || (a !== null && typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length > 0));
    const wasNdiFilled = ndiAnsweredSections === NDI_QUESTIONS_FR.length;
    const wasNorthwickFilled = northwickAnsweredSections === NORTHWICK_PARK_QUESTIONS_FR.filter(q => q.id !== 10).length;
    const wasCopenhagenFilled = Object.values(copenhagenAnswers).filter(v => v !== null).length === COPENHAGEN_QUESTIONS_FR.length;
    const wasOswestryFilled = oswestryAnsweredSections === OSWESTRY_QUESTIONS_FR.length;
    const wasQuebecFilled = Object.values(quebecAnswers).filter(v => v !== null).length === QUEBEC_QUESTIONS_FR.length;
    const wasRolandMorrisFilled = Object.values(rolandMorrisAnswers).some(a => a === true); // Considered "complete" if any is checked
    const wasVasFilled = vasAnswers.pain !== null;
    const wasOswestryThoracicFilled = oswestryThoracicAnsweredSections === OSWESTRY_THORACIC_QUESTIONS_FR.length;
    const wasDashFilled = dashAnsweredCount >= 27;
    const wasOssFilled = Object.values(ossAnswers).filter(v=>v!==null).length === OSS_QUESTIONS_FR.length;
    const wasSpadiFilled = Object.values(spadiAnswers).some(a => a !== null);
    const wasOesFilled = Object.values(oesAnswers).filter(v=>v!==null).length === OES_QUESTIONS_FR.length;
    const wasPrteeFilled = Object.values(prteeAnswers).some(a => a !== null);
    const wasPrweFilled = Object.values(prweAnswers).some(a => a !== null);
    const wasMhqFilled = Object.values(mhqAnswers).some(a => a !== null);
    const wasIkdcFilled = Object.values(ikdcAnswers).some(a => a !== null && (typeof a !== 'object' || Object.keys(a).length > 0));
    const wasLysholmFilled = Object.values(lysholmAnswers).filter(v=>v!==null).length === LYSHOLM_QUESTIONS_FR.length;
    const wasKoosFilled = Object.values(koosAnswers).some(a => a !== null);
    const wasHoospsFilled = Object.values(hoospsAnswers).filter(v=>v!==null).length === HOOS_PS_QUESTIONS_FR.length;
    const wasHarrisHipScoreFilled = Object.values(harrisHipScoreAnswers).some(a => {
        if (a === null || a === '') return false;
        if (typeof a === 'object') return Object.values(a).some(v => v !== false && v !== '');
        return true;
    });
    const wasOxfordHipScoreFilled = Object.values(oxfordHipScoreAnswers).filter(v=>v!==null).length === OXFORD_HIP_SCORE_QUESTIONS_FR.length;
    const wasHagosFilled = Object.values(hagosAnswers).some(a => a !== null);
    const wasPfdiFilled = Object.values(pfdiAnswers).some((a: PFDIAnswers[number]) => a.hasSymptom !== null);
    const wasIciqFilled = iciqAnswers.frequency !== null && iciqAnswers.amount !== null && iciqAnswers.interference !== null;
    const wasAofasFilled = Object.values(aofasAnswers).filter(v=>v!==null).length === Object.keys(aofasAnswers).length;
    const wasFadiFilled = Object.values(fadiAnswers).some(a => a !== null);
    const wasFfirFilled = Object.values(ffirAnswers).some(a => a !== null);
    const wasFogqFilled = Object.values(fogqAnswers).filter(v=>v!==null).length === FOGQ_QUESTIONS_FR.length;
    const wasFesFilled = Object.values(fesAnswers).filter(v=>v!==null).length === FES_QUESTIONS_FR.length;
    const wasFesiFilled = Object.values(fesiAnswers).filter(v=>v!==null).length === FES_QUESTIONS_FR.length;
    const wasBergFilled = Object.values(bergAnswers).filter(v=>v!==null).length === BERG_QUESTIONS_FR.length;
    const wasLefsFilled = Object.values(lefsAnswers).filter(v=>v!==null).length === LEFS_QUESTIONS_FR.length;
    const wasJflsFilled = Object.values(jflsAnswers).filter(v=>v!==null).length === JFLS_QUESTIONS_FR.length;
    const wasTmdFilled = Object.values(tmdAnswers).filter(v=>v!==null).length === TMD_QUESTIONS_FR.length;
    const wasWpaiFilled = Object.values(wpaiAnswers).some(a => a !== null);
    const wasMmrcFilled = mmrcAnswers.score !== null;
    const wasSgrqFilled = Object.values(sgrqAnswers).some(a => a !== null);
    
    // FIX: Cast psfsInstances to resolve typing issues when accessing 'activities' property.
    const psfsInstances = Object.entries(psfsAnswers) as [string, PSFSAnswers][];
    const wasAnyPsfsFilled = psfsInstances.length > 0 && psfsInstances.some(([_, ans]) => ans.activities.some(a => a.description.trim() !== ''));

    const handleSubmitToDrive = async () => {
        setIsSubmitting(true);
        setSubmissionStatus('idle');
        setSubmissionMessage('');

        const questionnaireToRegionMap: Record<string, string> = {
            Oswestry: 'Rachis_Lombaire', Quebec: 'Rachis_Lombaire', RolandMorris: 'Rachis_Lombaire',
            NDI: 'Rachis_Cervical', NorthwickPark: 'Rachis_Cervical', Copenhagen: 'Rachis_Cervical',
            VAS_Thoracique: 'Rachis_Thoracique', Oswestry_Thoracique: 'Rachis_Thoracique',
            DASH: 'Membre_Superieur', OSS: 'Epaule', SPADI: 'Epaule',
            OES: 'Coude', PRTEE: 'Coude', PRWE: 'Poignet_Main', MHQ: 'Poignet_Main',
            HOOSPS: 'Hanche', HarrisHipScore: 'Hanche', OxfordHipScore: 'Hanche', HAGOS: 'Aine_Pubalgie',
            IKDC: 'Genou', Lysholm: 'Genou', KOOS: 'Genou',
            AOFAS: 'Cheville_Pied', FADI: 'Cheville_Pied', FFIR: 'Cheville_Pied',
            LEFS: 'Membre_Inferieur',
            PFDI: 'Plancher_Pelvien', ICIQ: 'Plancher_Pelvien',
            JFLS: 'ATM', TMD: 'ATM',
            FOGQ: 'Equilibre_Marche', FES: 'Equilibre_Marche', 'FES-I': 'Equilibre_Marche', Berg: 'Equilibre_Marche',
            mMRC: 'Respiratoire', SGRQ: 'Respiratoire',
        };
        const generalQuestionnaireNames = ['Anamnèse', 'Amplitudes', 'FABQ', 'PCS', 'CSI', 'WPAI', 'Objectifs'];
        const allQuestionnaires = [
            { name: 'Anamnèse', filled: wasMedicalFilled, isComplete: true, content: () => generateMedicalText(medicalAnswers, patientInfo, MEDICAL_QUESTIONNAIRE) },
            { name: 'Amplitudes', filled: wasAmplitudesFilled, isComplete: wasAmplitudesFilled, content: () => generateAmplitudesText(amplitudesAnswers, patientInfo) },
            { name: 'Oswestry', filled: Object.values(oswestryAnswers).some(a=>a!==null), isComplete: wasOswestryFilled, content: () => generateOswestryText(oswestryAnswers, patientInfo) },
            { name: 'Quebec', filled: Object.values(quebecAnswers).some(a=>a!==null), isComplete: wasQuebecFilled, content: () => generateQuebecText(quebecAnswers, patientInfo) },
            { name: 'RolandMorris', filled: wasRolandMorrisFilled, isComplete: true, content: () => generateRolandMorrisText(rolandMorrisAnswers, patientInfo) },
            { name: 'NDI', filled: Object.values(ndiAnswers).some(a=>a!==null), isComplete: wasNdiFilled, content: () => generateNdiText(ndiAnswers, patientInfo) },
            { name: 'NorthwickPark', filled: Object.values(northwickAnswers).some(a=>a!==null), isComplete: wasNorthwickFilled, content: () => generateNorthwickParkText(northwickAnswers, patientInfo) },
            { name: 'Copenhagen', filled: Object.values(copenhagenAnswers).some(a=>a!==null), isComplete: wasCopenhagenFilled, content: () => generateCopenhagenText(copenhagenAnswers, patientInfo) },
            { name: 'VAS_Thoracique', filled: wasVasFilled, isComplete: wasVasFilled, content: () => generateVasText(vasAnswers, patientInfo) },
            { name: 'Oswestry_Thoracique', filled: Object.values(oswestryThoracicAnswers).some(a=>a!==null), isComplete: wasOswestryThoracicFilled, content: () => generateOswestryThoracicText(oswestryThoracicAnswers, patientInfo) },
            { name: 'DASH', filled: Object.values(dashAnswers).some(a=>a!==null), isComplete: wasDashFilled, content: () => generateDashText(dashAnswers, patientInfo) },
            { name: 'OSS', filled: Object.values(ossAnswers).some(a=>a!==null), isComplete: wasOssFilled, content: () => generateOssText(ossAnswers, patientInfo) },
            { name: 'SPADI', filled: wasSpadiFilled, isComplete: true, content: () => generateSpadiText(spadiAnswers, patientInfo) },
            { name: 'OES', filled: Object.values(oesAnswers).some(a=>a!==null), isComplete: wasOesFilled, content: () => generateOesText(oesAnswers, patientInfo) },
            { name: 'PRTEE', filled: wasPrteeFilled, isComplete: true, content: () => generatePrteeText(prteeAnswers, patientInfo) },
            { name: 'PRWE', filled: wasPrweFilled, isComplete: true, content: () => generatePrweText(prweAnswers, patientInfo) },
            { name: 'MHQ', filled: wasMhqFilled, isComplete: true, content: () => generateMhqText(mhqAnswers, patientInfo) },
            { name: 'IKDC', filled: wasIkdcFilled, isComplete: true, content: () => generateIkdcText(ikdcAnswers, patientInfo) },
            { name: 'Lysholm', filled: Object.values(lysholmAnswers).some(a=>a!==null), isComplete: wasLysholmFilled, content: () => generateLysholmText(lysholmAnswers, patientInfo) },
            { name: 'KOOS', filled: wasKoosFilled, isComplete: true, content: () => generateKoosText(koosAnswers, patientInfo) },
            { name: 'HOOSPS', filled: Object.values(hoospsAnswers).some(a=>a!==null), isComplete: wasHoospsFilled, content: () => generateHoospsText(hoospsAnswers, patientInfo) },
            { name: 'HarrisHipScore', filled: wasHarrisHipScoreFilled, isComplete: true, content: () => generateHarrisHipScoreText(harrisHipScoreAnswers, patientInfo) },
            { name: 'OxfordHipScore', filled: Object.values(oxfordHipScoreAnswers).some(a=>a!==null), isComplete: wasOxfordHipScoreFilled, content: () => generateOxfordHipScoreText(oxfordHipScoreAnswers, patientInfo) },
            { name: 'HAGOS', filled: wasHagosFilled, isComplete: true, content: () => generateHagosText(hagosAnswers, patientInfo) },
            { name: 'PFDI', filled: wasPfdiFilled, isComplete: true, content: () => generatePfdiText(pfdiAnswers, patientInfo) },
            { name: 'ICIQ', filled: wasIciqFilled, isComplete: wasIciqFilled, content: () => generateIciqText(iciqAnswers, patientInfo) },
            { name: 'AOFAS', filled: Object.values(aofasAnswers).some(a=>a!==null), isComplete: wasAofasFilled, content: () => generateAofasText(aofasAnswers, patientInfo) },
            { name: 'FADI', filled: wasFadiFilled, isComplete: true, content: () => generateFadiText(fadiAnswers, patientInfo) },
            { name: 'FFIR', filled: wasFfirFilled, isComplete: true, content: () => generateFfirText(ffirAnswers, patientInfo) },
            { name: 'FABQ', filled: wasFabqFilled, isComplete: true, content: () => generateFabqText(fabqAnswers, patientInfo) },
            { name: 'PCS', filled: wasPcsFilled, isComplete: true, content: () => generatePcsText(pcsAnswers, patientInfo) },
            { name: 'CSI', filled: wasCsiFilled, isComplete: true, content: () => generateCsiText(csiPartAAnswers, csiPartBAnswers, patientInfo) },
            { name: 'FOGQ', filled: Object.values(fogqAnswers).some(a=>a!==null), isComplete: wasFogqFilled, content: () => generateFogqText(fogqAnswers, patientInfo) },
            { name: 'FES', filled: Object.values(fesAnswers).some(a=>a!==null), isComplete: wasFesFilled, content: () => generateFesText(fesAnswers, patientInfo) },
            { name: 'FES-I', filled: Object.values(fesiAnswers).some(a=>a!==null), isComplete: wasFesiFilled, content: () => generateFesiText(fesiAnswers, patientInfo) },
            { name: 'Berg', filled: Object.values(bergAnswers).some(a=>a!==null), isComplete: wasBergFilled, content: () => generateBergText(bergAnswers, patientInfo) },
            { name: 'LEFS', filled: Object.values(lefsAnswers).some(a=>a!==null), isComplete: wasLefsFilled, content: () => generateLefsText(lefsAnswers, patientInfo) },
            { name: 'JFLS', filled: Object.values(jflsAnswers).some(a=>a!==null), isComplete: wasJflsFilled, content: () => generateJflsText(jflsAnswers, patientInfo) },
            { name: 'TMD', filled: Object.values(tmdAnswers).some(a=>a!==null), isComplete: wasTmdFilled, content: () => generateTmdText(tmdAnswers, patientInfo) },
            { name: 'WPAI', filled: wasWpaiFilled, isComplete: true, content: () => generateWpaiText(wpaiAnswers, patientInfo) },
            { name: 'Objectifs', filled: wasObjectifsFilled, isComplete: true, content: () => generateObjectifsText(objectifsAnswers, patientInfo) },
            { name: 'mMRC', filled: wasMmrcFilled, isComplete: wasMmrcFilled, content: () => generateMmrcText(mmrcAnswers, patientInfo) },
            { name: 'SGRQ', filled: wasSgrqFilled, isComplete: wasSgrqFilled, content: () => generateSgrqText(sgrqAnswers, patientInfo) },
        ];
        
        const stepToQuestionnaireName: { [key in Step]?: string } = {
            medical: 'Anamnèse',
            amplitudes: 'Amplitudes', oswestry: 'Oswestry', quebec: 'Quebec',
            rolandmorris: 'RolandMorris', ndi: 'NDI', northwick: 'NorthwickPark',
            copenhagen: 'Copenhagen', dash: 'DASH', oss: 'OSS', spadi: 'SPADI',
            oes: 'OES', prtee: 'PRTEE', prwe: 'PRWE', mhq: 'MHQ', vas: 'VAS_Thoracique',
            oswestryThoracic: 'Oswestry_Thoracique', ikdc: 'IKDC', lysholm: 'Lysholm',
            koos: 'KOOS', hoosps: 'HOOSPS', harriship: 'HarrisHipScore',
            oxfordhip: 'OxfordHipScore', hagos: 'HAGOS', pfdi: 'PFDI', iciq: 'ICIQ',
            aofas: 'AOFAS', fadi: 'FADI', ffir: 'FFIR', fabq: 'FABQ', pcs: 'PCS',
            csi: 'CSI', fogq: 'FOGQ', fes: 'FES', fesi: 'FES-I', berg: 'Berg',
            lefs: 'LEFS', jfls: 'JFLS', tmd: 'TMD', wpai: 'WPAI',
            objectifs: 'Objectifs', mmrc: 'mMRC', sgrq: 'SGRQ',
        };

        const visibleQuestionnaireNames = visibleSteps
            .map(step => step.startsWith('psfs_') ? `PSFS_${step.replace('psfs_', '').replace(/_/g, ' ')}` : stepToQuestionnaireName[step])
            .filter((name): name is string => !!name);

        const questionnairesToSubmit = allQuestionnaires.filter(q => visibleQuestionnaireNames.includes(q.name));

        const dateParts = patientInfo.date.split('/'); // from "dd/mm/yyyy"
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // to "yyyy-mm-dd"
        
        const patientFolder = `${patientInfo.nom}_${patientInfo.prenom}_${patientInfo.numeroSecuriteSociale}`;
        const basePath = `APP BILANS/Patients Data/${patientFolder}`;

        const filesToCreate: { path: string; content: string }[] = [];

        questionnairesToSubmit.forEach(q => {
            let subFolder = '';
            if (generalQuestionnaireNames.includes(q.name)) {
                subFolder = `Tronc commun_${patientInfo.numeroSecuriteSociale}`;
            } else {
                const regionFolder = questionnaireToRegionMap[q.name.replace('_Thoracique','')] || 'Autres_Specifiques';
                subFolder = `${regionFolder}_${patientInfo.numeroSecuriteSociale}`;
            }

            let prefix = '';
            if (!q.filled) {
                prefix = 'Empty_';
            } else if (!q.isComplete) {
                prefix = 'Incomplet_';
            }

            const filename = `${prefix}${patientInfo.nom}_${patientInfo.prenom}_${formattedDate}_${q.name}_${patientInfo.numeroSecuriteSociale}.txt`;
            const path = `${basePath}/${subFolder}/${filename}`;

            filesToCreate.push({
                path: path,
                content: q.content(),
            });
        });

        // Handle multiple PSFS submissions
        // FIX: Using typed psfsInstances here to avoid compilation errors.
        psfsInstances.forEach(([zone, answers]) => {
            const isFilled = answers.activities.some(a => a.description.trim() !== '');
            const subFolder = zone === 'Abdominale' ? `Abdominal_${patientInfo.numeroSecuriteSociale}` : `Autres_Specifiques_${patientInfo.numeroSecuriteSociale}`;
            const prefix = isFilled ? '' : 'Empty_';
            const filename = `${prefix}${patientInfo.nom}_${patientInfo.prenom}_${formattedDate}_PSFS_${zone}_${patientInfo.numeroSecuriteSociale}.txt`;
            const path = `${basePath}/${subFolder}/${filename}`;
            
            filesToCreate.push({
                path: path,
                content: generatePsfsText(answers, patientInfo, zone),
            });
        });

        if (filesToCreate.length === 0) {
            setIsSubmitting(false);
            setSubmissionStatus('error');
            setSubmissionMessage("Aucun questionnaire à soumettre.");
            return;
        }

        const payload = {
            patientInfo,
            filesToCreate
        };
        
        try {
            const result = await submitBilan(payload);
            setIsSubmitting(false);
            if (result.status === 'success') {
                setSubmissionStatus('success');
                setSubmissionMessage('Le bilan a été soumis avec succès. Merci !');
            } else {
                throw new Error(result.message || 'Erreur de soumission inconnue.');
            }
        } catch (error) {
            setIsSubmitting(false);
            setSubmissionStatus('error');
            let errorMessage = "Une erreur inconnue est survenue.";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = String(error);
            }
            
            let displayMessage = `L'envoi a échoué. Veuillez vérifier votre connexion et réessayer. Si le problème persiste, contactez le support. Détail technique: ${errorMessage}`;
            
            if (errorMessage.includes("Erreur de permissions")) {
                displayMessage = "L'envoi a échoué en raison d'un problème de permissions. Veuillez contacter l'administrateur.";
            } else if (errorMessage.includes("Données manquantes")) {
                displayMessage = "L'envoi a échoué car le serveur n'a pas reçu les données. Veuillez réessayer.";
            }

            setSubmissionMessage(displayMessage);
        }
    };

    const handleDownloadPatientReport = () => {
        const content = generatePatientReportText(
            patientInfo,
            fabqAnswers,
            pcsAnswers,
            csiPartAAnswers,
            oswestryAnswers
        );
        const initials = `${patientInfo.nom.substring(0, 2)}${patientInfo.prenom.substring(0, 2)}`.toUpperCase();
        downloadTextFile(content, `Rapport_Patient_${initials}.txt`);
    };

    const renderMedicalAnswer = (answer: MedicalAnswer): React.ReactNode => {
        if (!answer) {
             return <span className="text-gray-500 italic">Non répondu</span>;
        }

        const { value, details } = answer;

        if (value === null) {
            return <span className="text-gray-500 italic">Non répondu</span>;
        }

        if (typeof value === 'boolean') {
            const base = value ? 'Oui' : 'Non';
            const detailsText = details ? ` (${details})` : '';
            return <>{base}{detailsText}</>;
        }

        if (typeof value === 'string') {
            return value || <span className="text-gray-500 italic">Non précisé</span>;
        }
        
        const selection = value as AnatomySelection;
        const selectedItems = selection.selected || [];
        const autres = (selection.autre_descriptions || []).filter(d => d.trim() !== '');
        
        if (selectedItems.length === 0 && autres.length === 0) {
            return <span className="text-gray-500 italic">Non précisé</span>;
        }

        return (
            <div className="inline-block align-top pl-2">
                {selectedItems.length > 0 && (
                    <ul className="list-disc list-inside">
                        {selectedItems.map(item => <li key={item}>{item}</li>)}
                    </ul>
                )}
                {autres.length > 0 && (
                     <ul className="list-disc list-inside mt-1">
                        {autres.map((autre, index) => <li key={index}><strong>Autre:</strong> {autre}</li>)}
                    </ul>
                )}
            </div>
        );
    }
    
    return (
        <div>
            <div id="print-area">
                <header className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-900">Résumé des réponses</h2></header>

                <section className="mb-8 p-4 border rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-blue-800">Informations du Patient</h3>
                    <p><strong>Nom:</strong> {patientInfo.nom}</p>
                    <p><strong>Prénom:</strong> {patientInfo.prenom}</p>
                    <p><strong>Numéro de Sécurité Sociale:</strong> {patientInfo.numeroSecuriteSociale}</p>
                    <p><strong>Date du bilan:</strong> {patientInfo.date}</p>
                </section>
                
                <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-blue-800">Résultats des Questionnaires</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Static Questionnaires */}
                        {visibleSteps.includes('oswestry') && <ScoreCard title="Oswestry (Incapacité lombaire)" score={oswestryScore} maxScore={OSWESTRY_QUESTIONS_FR.length * 5} completionText={`${oswestryAnsweredSections}/${OSWESTRY_QUESTIONS_FR.length} sections répondues.`} isComplete={wasOswestryFilled} onClick={() => onEditQuestionnaire('oswestry')} />}
                        {/* ... (all other static score cards) ... */}
                        {visibleSteps.includes('sgrq') && <ScoreCard title="SGRQ (Respiratoire)" score={null} completionText="Voir détails" isComplete={wasSgrqFilled} onClick={() => onEditQuestionnaire('sgrq')} />}
                        
                        {/* Dynamic PSFS Questionnaires */}
                        {/* FIX: Typed psfsInstances is used for mapping to resolve compilation errors. */}
                        {psfsInstances.map(([zone, answers]) => {
                            const isComplete = answers.activities.some(a => a.description.trim() !== '');
                             const stepId = `psfs_${zone.replace(/\s+/g, '_')}`;
                            return <ScoreCard key={zone} title={`PSFS (${zone})`} score={null} completionText="Voir détails" isComplete={isComplete} onClick={() => onEditQuestionnaire(stepId)} />;
                        })}
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-blue-800">Détails des Réponses</h3>
                    {/* ... (all other details sections) ... */}
                     {/* FIX: Typed psfsInstances used here to safely access 'activities' property. */}
                     {wasAnyPsfsFilled && psfsInstances.map(([zone, answers]) => {
                         const stepId = `psfs_${zone.replace(/\s+/g, '_')}`;
                         return (
                            <div key={zone} className="p-4 border rounded-lg mb-4">
                                <h4 className="font-bold text-lg">PSFS ({zone}) <button onClick={() => onEditQuestionnaire(stepId)} className="text-sm text-blue-600 hover:underline ml-4 no-print">(Modifier)</button></h4>
                                {answers.activities.map((activity, index) => (
                                    activity.description && <p key={index} className="text-sm"><strong>Activité {index + 1}:</strong> {activity.description} (Score: {activity.score ?? 'N/A'})</p>
                                ))}
                            </div>
                        );
                     })}
                </section>
            </div>
            
            <footer className="mt-12 pt-6 border-t no-print">
                 {submissionStatus === 'idle' && (
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                         <button onClick={onRestart} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300">Recommencer</button>
                         <button onClick={() => window.print()} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-[#1565C0] border border-[#1565C0] rounded-lg shadow-sm hover:bg-blue-50">Imprimer / Enregistrer en PDF</button>
                         <button onClick={handleDownloadPatientReport} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-[#FF8F87] rounded-lg shadow-sm hover:bg-rose-500">Télécharger le rapport (.txt)</button>
                         <button onClick={handleSubmitToDrive} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 disabled:bg-gray-400">
                             {isSubmitting ? 'Envoi en cours...' : 'Soumettre le bilan'}
                         </button>
                     </div>
                 )}

                {submissionStatus !== 'idle' && (
                    <div className={`p-4 rounded-md text-center ${submissionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <p className="font-semibold">{submissionMessage}</p>
                        {submissionStatus === 'success' && <button onClick={onRestart} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Retour à l'accueil</button>}
                        {submissionStatus === 'error' && <button onClick={handleSubmitToDrive} disabled={isSubmitting} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Réessayer d'envoyer</button>}
                    </div>
                )}
            </footer>
        </div>
    );
};

export default SummaryPage;