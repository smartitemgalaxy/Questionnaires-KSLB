import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import {
    FABQAnswers, PCSAnswers, CSI_PartA_Answers, CSI_PartB_Answers,
    MedicalAnswers, OswestryAnswers, QuebecAnswers, RolandMorrisAnswers,
    NDIAnswers, NorthwickParkAnswers, CopenhagenAnswers, DASHAnswers, OSSAnswers,
    SPADIAnswers, VASAnswers, OswestryThoracicAnswers, IKDCAnswers, LysholmAnswers,
    KOOSAnswers, OESAnswers, PRTEEAnswers, PRWEAnswers, MHQAnswers, HOOSPSAnswers,
    HarrisHipScoreAnswers, OHSAnswers, HAGOSAnswers, PFDIAnswers, ICIQAnswers,
    AOFASAnswers, FADIAnswers, FFIRAnswers, FOGQAnswers, FESAnswers, FESIAnswers,
    BergAnswers, LEFSAnswers, JFLSAnswers, TMDAnswers, WPAIAnswers,
    ObjectifsAnswers, AmplitudesAnswers, MMRCAnswers, SGRQAnswers, PSFSAnswers,
    HADAnswers, Step, AnatomySelection, PatientInfo
} from '../types';
import {
    ALL_FABQ_QUESTIONS, PCS_QUESTIONS_FR, CSI_PART_A_QUESTIONS_FR, CSI_PART_B_QUESTIONS_FR,
    ALL_MEDICAL_QUESTIONS, OSWESTRY_QUESTIONS_FR, QUEBEC_QUESTIONS_FR, ROLAND_MORRIS_QUESTIONS_FR,
    NDI_QUESTIONS_FR, NORTHWICK_PARK_QUESTIONS_FR, COPENHAGEN_QUESTIONS_FR, DASH_QUESTIONS_FR,
    OSS_QUESTIONS_FR, ALL_SPADI_QUESTIONS_FR, OSWESTRY_THORACIC_QUESTIONS_FR, IKDC_QUESTIONS_FR,
    LYSHOLM_QUESTIONS_FR, KOOS_QUESTIONS_FR, OES_QUESTIONS_FR, ALL_PRTEE_QUESTIONS_FR,
    ALL_PRWE_QUESTIONS_FR, MHQ_QUESTIONS_FR, HOOS_PS_QUESTIONS_FR, OXFORD_HIP_SCORE_QUESTIONS_FR,
    HAGOS_QUESTIONS_FR, PFDI_QUESTIONS_FR, ALL_FADI_QUESTIONS_FR, ALL_FFIR_QUESTIONS_FR,
    FOGQ_QUESTIONS_FR, FES_QUESTIONS_FR, BERG_QUESTIONS_FR, LEFS_QUESTIONS_FR,
    JFLS_QUESTIONS_FR, TMD_QUESTIONS_FR, PSFS_DATA_FR, HAD_QUESTIONS_FR
} from '../constants';
import { AllAnswersSnapshot, InProgressSession, CompletedBilan } from '../storageTypes';
import { useAuth } from './AuthContext';
import * as StorageService from '../services/storage';

// ==================== Initial Answer Factories ====================

const getInitialFabqAnswers = (): FABQAnswers => ALL_FABQ_QUESTIONS.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as FABQAnswers);
const getInitialPcsAnswers = (): PCSAnswers => PCS_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as PCSAnswers);
const getInitialCsiPartAAnswers = (): CSI_PartA_Answers => CSI_PART_A_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as CSI_PartA_Answers);
const getInitialCsiPartBAnswers = (): CSI_PartB_Answers => CSI_PART_B_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = { diagnosed: null, year: '' }; return acc; }, {} as CSI_PartB_Answers);
const getInitialMedicalAnswers = (): MedicalAnswers => ALL_MEDICAL_QUESTIONS.flatMap(s => s.questions).reduce((acc, q) => { acc[q.id] = { value: null, details: '' }; return acc; }, {} as MedicalAnswers);
const getInitialOswestryAnswers = (): OswestryAnswers => OSWESTRY_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as OswestryAnswers);
const getInitialQuebecAnswers = (): QuebecAnswers => QUEBEC_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as QuebecAnswers);
const getInitialRolandMorrisAnswers = (): RolandMorrisAnswers => ROLAND_MORRIS_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = false; return acc; }, {} as RolandMorrisAnswers);
const getInitialNdiAnswers = (): NDIAnswers => NDI_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as NDIAnswers);
const getInitialNorthwickParkAnswers = (): NorthwickParkAnswers => NORTHWICK_PARK_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as NorthwickParkAnswers);
const getInitialCopenhagenAnswers = (): CopenhagenAnswers => COPENHAGEN_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as CopenhagenAnswers);
const getInitialDashAnswers = (): DASHAnswers => DASH_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as DASHAnswers);
const getInitialOssAnswers = (): OSSAnswers => OSS_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as OSSAnswers);
const getInitialSpadiAnswers = (): SPADIAnswers => ALL_SPADI_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as SPADIAnswers);
const getInitialVasAnswers = (): VASAnswers => ({ pain: null });
const getInitialOswestryThoracicAnswers = (): OswestryThoracicAnswers => OSWESTRY_THORACIC_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as OswestryThoracicAnswers);
const getInitialIkdcAnswers = (): IKDCAnswers => IKDC_QUESTIONS_FR.reduce((acc, q) => { if (q.type === 'function') { acc[q.id] = {}; } else { acc[q.id] = null; } return acc; }, {} as IKDCAnswers);
const getInitialLysholmAnswers = (): LysholmAnswers => LYSHOLM_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as LysholmAnswers);
const getInitialKoosAnswers = (): KOOSAnswers => KOOS_QUESTIONS_FR.flatMap(s => s.questions).reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as KOOSAnswers);
const getInitialOesAnswers = (): OESAnswers => OES_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as OESAnswers);
const getInitialPrteeAnswers = (): PRTEEAnswers => ALL_PRTEE_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as PRTEEAnswers);
const getInitialPrweAnswers = (): PRWEAnswers => ALL_PRWE_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as PRWEAnswers);
const getInitialMhqAnswers = (): MHQAnswers => MHQ_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as MHQAnswers);
const getInitialHoospsAnswers = (): HOOSPSAnswers => HOOS_PS_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as HOOSPSAnswers);
const getInitialHarrisHipScoreAnswers = (): HarrisHipScoreAnswers => ({ pain: null, limp: null, support: null, distance: null, stairs: null, shoes: null, sitting: null, transport: null, deformity: { flexion: false, abduction: false, internalRotation: false, limbLength: false }, rom: { flexion: '', abduction: '', adduction: '', externalRotation: '', internalRotation: '' } });
const getInitialOhsAnswers = (): OHSAnswers => OXFORD_HIP_SCORE_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as OHSAnswers);
const getInitialHagosAnswers = (): HAGOSAnswers => HAGOS_QUESTIONS_FR.flatMap(s => s.questions).reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as HAGOSAnswers);
const getInitialPfdiAnswers = (): PFDIAnswers => PFDI_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = { hasSymptom: null, bother: null }; return acc; }, {} as PFDIAnswers);
const getInitialIciqAnswers = (): ICIQAnswers => ({ gender: null, frequency: null, amount: null, interference: null, when: { never: false, beforeToilet: false, coughSneeze: false, asleep: false, active: false, finishedUrinating: false, noReason: false, allTheTime: false } });
const getInitialAofasAnswers = (): AOFASAnswers => ({ pain: null, activity_limitations: null, walking_distance: null, walking_surface: null, gait_abnormality: null, sagittal_motion: null, hindfoot_motion: null, stability: null, alignment: null });
const getInitialFadiAnswers = (): FADIAnswers => ALL_FADI_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as FADIAnswers);
const getInitialFfirAnswers = (): FFIRAnswers => ALL_FFIR_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as FFIRAnswers);
const getInitialFogqAnswers = (): FOGQAnswers => FOGQ_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as FOGQAnswers);
const getInitialFesAnswers = (): FESAnswers => FES_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as FESAnswers);
const getInitialFesiAnswers = (): FESIAnswers => FES_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as FESIAnswers);
const getInitialBergAnswers = (): BergAnswers => BERG_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as BergAnswers);
const getInitialLefsAnswers = (): LEFSAnswers => LEFS_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as LEFSAnswers);
const getInitialJflsAnswers = (): JFLSAnswers => JFLS_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as JFLSAnswers);
const getInitialTmdAnswers = (): TMDAnswers => TMD_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as TMDAnswers);
const getInitialWpaiAnswers = (): WPAIAnswers => ({ employed: null, missedWorkHoursHealth: null, missedWorkHoursOther: null, workedHours: null, workAffected: null, activityAffected: null });
const getInitialObjectifsAnswers = (): ObjectifsAnswers => ({ q1: [], q1_autre: '', q2: [], q2_autre: '', q3: [], q3_autre: '', q4: [], q5: null, q6: null, q7: null, q8: null, q9: null, q10: null, q11: null, q11_autre: '', q12: null, q12_details: {}, q13: null, q14: null });
const getInitialAmplitudesAnswers = (): AmplitudesAnswers => ({});
const getInitialPsfsAnswers = (): PSFSAnswers => ({ activities: Array.from({ length: PSFS_DATA_FR.activityCount }, () => ({ description: '', score: null })) });
const getInitialMmrcAnswers = (): MMRCAnswers => ({ score: null });
const getInitialSgrqAnswers = (): SGRQAnswers => ({});
const getInitialHadAnswers = (): HADAnswers => HAD_QUESTIONS_FR.reduce((acc, q) => { acc[q.id] = null; return acc; }, {} as HADAnswers);

export function createInitialAnswers(): AllAnswersSnapshot {
    return {
        fabq: getInitialFabqAnswers(),
        pcs: getInitialPcsAnswers(),
        csiPartA: getInitialCsiPartAAnswers(),
        csiPartB: getInitialCsiPartBAnswers(),
        medical: getInitialMedicalAnswers(),
        oswestry: getInitialOswestryAnswers(),
        quebec: getInitialQuebecAnswers(),
        rolandMorris: getInitialRolandMorrisAnswers(),
        ndi: getInitialNdiAnswers(),
        northwick: getInitialNorthwickParkAnswers(),
        copenhagen: getInitialCopenhagenAnswers(),
        dash: getInitialDashAnswers(),
        oss: getInitialOssAnswers(),
        spadi: getInitialSpadiAnswers(),
        vas: getInitialVasAnswers(),
        oswestryThoracic: getInitialOswestryThoracicAnswers(),
        ikdc: getInitialIkdcAnswers(),
        lysholm: getInitialLysholmAnswers(),
        koos: getInitialKoosAnswers(),
        oes: getInitialOesAnswers(),
        prtee: getInitialPrteeAnswers(),
        prwe: getInitialPrweAnswers(),
        mhq: getInitialMhqAnswers(),
        hoosps: getInitialHoospsAnswers(),
        harrisHipScore: getInitialHarrisHipScoreAnswers(),
        oxfordHipScore: getInitialOhsAnswers(),
        hagos: getInitialHagosAnswers(),
        pfdi: getInitialPfdiAnswers(),
        iciq: getInitialIciqAnswers(),
        aofas: getInitialAofasAnswers(),
        fadi: getInitialFadiAnswers(),
        ffir: getInitialFfirAnswers(),
        fogq: getInitialFogqAnswers(),
        fes: getInitialFesAnswers(),
        fesi: getInitialFesiAnswers(),
        berg: getInitialBergAnswers(),
        lefs: getInitialLefsAnswers(),
        jfls: getInitialJflsAnswers(),
        tmd: getInitialTmdAnswers(),
        wpai: getInitialWpaiAnswers(),
        objectifs: getInitialObjectifsAnswers(),
        amplitudes: getInitialAmplitudesAnswers(),
        mmrc: getInitialMmrcAnswers(),
        sgrq: getInitialSgrqAnswers(),
        psfs: {},
        had: getInitialHadAnswers(),
    };
}

// ==================== Step Configuration ====================

export const allStepDetails: Record<string, { title: string }> = {
    medical1: { title: 'Medical (1/3)' },
    medical2: { title: 'Medical (2/3)' },
    medical3: { title: 'Medical (3/3)' },
    objectifs: { title: 'Objectifs' },
    had: { title: 'HAD' },
    amplitudes: { title: 'Amplitudes' },
    oswestry: { title: 'Oswestry' },
    quebec: { title: 'Quebec' },
    rolandmorris: { title: 'Roland-Morris' },
    ndi: { title: 'NDI' },
    northwick: { title: 'Northwick' },
    copenhagen: { title: 'Copenhagen' },
    dash: { title: 'DASH' },
    oss: { title: 'Oxford Shoulder' },
    spadi: { title: 'SPADI' },
    oes: { title: 'Oxford Elbow' },
    prtee: { title: 'PRTEE' },
    prwe: { title: 'PRWE' },
    mhq: { title: 'MHQ' },
    vas: { title: 'EVA' },
    oswestryThoracic: { title: 'Oswestry Thoracique' },
    ikdc: { title: 'IKDC' },
    lysholm: { title: 'Lysholm' },
    koos: { title: 'KOOS' },
    hoosps: { title: 'HOOS-PS' },
    harriship: { title: 'Harris Hip Score' },
    oxfordhip: { title: 'Oxford Hip Score' },
    hagos: { title: 'HAGOS' },
    pfdi: { title: 'PFDI-20' },
    iciq: { title: 'ICIQ-UI SF' },
    aofas: { title: 'AOFAS' },
    fadi: { title: 'FADI' },
    ffir: { title: 'FFI-R' },
    fabq: { title: 'FABQ' },
    pcs: { title: 'PCS' },
    csi: { title: 'CSI' },
    fogq: { title: 'FOGQ' },
    fes: { title: 'FES' },
    fesi: { title: 'FES-I' },
    berg: { title: 'Berg' },
    lefs: { title: 'LEFS' },
    jfls: { title: 'JFLS' },
    tmd: { title: 'TMD' },
    wpai: { title: 'WPAI' },
    mmrc: { title: 'mMRC' },
    sgrq: { title: 'SGRQ' },
    summary: { title: 'Resume' },
};

const initialCommonSteps: Step[] = ['medical1', 'medical2', 'medical3', 'objectifs', 'had', 'amplitudes'];
const finalCommonSteps: Step[] = ['fabq', 'pcs', 'csi', 'wpai'];

const lumbarSteps: Step[] = ['oswestry', 'quebec', 'rolandmorris'];
const cervicalSteps: Step[] = ['ndi', 'northwick', 'copenhagen'];
const upperLimbGenericSteps: Step[] = ['dash'];
const shoulderSteps: Step[] = ['oss', 'spadi'];
const elbowSteps: Step[] = ['oes', 'prtee'];
const handWristSteps: Step[] = ['prwe', 'mhq'];
const thoracicSteps: Step[] = ['vas', 'oswestryThoracic'];
const kneeSteps: Step[] = ['ikdc', 'lysholm', 'koos'];
const hipSteps: Step[] = ['hoosps', 'harriship', 'oxfordhip'];
const groinSteps: Step[] = ['hagos'];
const pelvicFloorSteps: Step[] = ['pfdi', 'iciq'];
const footAnkleSteps: Step[] = ['aofas', 'fadi', 'ffir'];
const walkBalanceSteps: Step[] = ['fogq', 'fesi', 'berg'];
const lefsSteps: Step[] = ['lefs'];
const tmjSteps: Step[] = ['jfls', 'tmd'];
const respiratorySteps: Step[] = ['mmrc', 'sgrq'];

// ==================== Step Logic (from App.tsx) ====================

const shouldShowLumbar = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => i === 'Lombaire') || false;
};
const shouldShowCervical = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => i === 'Cervicale') || false;
};
const shouldShowUpperLimb = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    if (!m?.selected) return false;
    const items = ['Membre supérieur', 'Épaule', 'Bras', 'Coude', 'Avant-bras', 'Poignet', 'Main', 'Poignet et main'];
    return m.selected.some(i => items.includes(i));
};
const shouldShowShoulder = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => i === 'Épaule') || false;
};
const shouldShowElbow = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => ['Coude', 'Avant-bras'].includes(i)) || false;
};
const shouldShowHandWrist = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => ['Avant-bras', 'Poignet', 'Main', 'Poignet et main'].includes(i)) || false;
};
const shouldShowThoracic = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.includes('Thoracique') || false;
};
const shouldShowKnee = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => i === 'Genou') || false;
};
const shouldShowHip = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => i === 'Hanche') || false;
};
const shouldShowGroin = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.includes('Aine/Pubalgie') || false;
};
const shouldShowPelvicFloor = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.includes('Plancher pelvien') || false;
};
const shouldShowFootAnkle = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => i === 'Pied et cheville') || false;
};
const shouldShowWalkBalance = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => ['Marche et équilibre', 'Neurologique'].includes(i)) || false;
};
const shouldShowLefs = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.some(i => ['Ceinture pelvienne', 'Cuisse', 'Jambe'].includes(i)) || false;
};
const shouldShowTmj = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.includes('ATM (articulation temporo-mandibulaire)') || false;
};
const shouldShowRespiratory = (a: MedicalAnswers): boolean => {
    const m = a['motif']?.value as AnatomySelection | null;
    return m?.selected?.includes('Respiratoire') || false;
};

function getPsfsZones(answers: MedicalAnswers): string[] {
    const m = answers['motif']?.value as AnatomySelection | null;
    if (!m) return [];
    const zones: string[] = [];
    if (m.selected?.includes('Abdominale')) zones.push('Abdominale');
    if (m.selected?.includes('Tête')) zones.push('Tête');
    if (m.selected?.includes('Rééducation linguale')) zones.push('Linguale');
    (m.autre_descriptions || []).forEach(desc => {
        if (desc.trim()) zones.push(desc.trim());
    });
    return [...new Set(zones)];
}

export function computeSteps(medicalAnswers: MedicalAnswers, currentPsfs: { [zone: string]: PSFSAnswers }): { steps: Step[]; psfs: { [zone: string]: PSFSAnswers } } {
    let dynamic: Step[] = [];
    if (shouldShowLumbar(medicalAnswers)) dynamic.push(...lumbarSteps);
    if (shouldShowCervical(medicalAnswers)) dynamic.push(...cervicalSteps);
    if (shouldShowUpperLimb(medicalAnswers)) dynamic.push(...upperLimbGenericSteps);
    if (shouldShowShoulder(medicalAnswers)) dynamic.push(...shoulderSteps);
    if (shouldShowElbow(medicalAnswers)) dynamic.push(...elbowSteps);
    if (shouldShowHandWrist(medicalAnswers)) dynamic.push(...handWristSteps);
    if (shouldShowThoracic(medicalAnswers)) dynamic.push(...thoracicSteps);
    if (shouldShowKnee(medicalAnswers)) dynamic.push(...kneeSteps);
    if (shouldShowHip(medicalAnswers)) dynamic.push(...hipSteps);
    if (shouldShowGroin(medicalAnswers)) dynamic.push(...groinSteps);
    if (shouldShowPelvicFloor(medicalAnswers)) dynamic.push(...pelvicFloorSteps);
    if (shouldShowFootAnkle(medicalAnswers)) dynamic.push(...footAnkleSteps);
    if (shouldShowWalkBalance(medicalAnswers)) dynamic.push(...walkBalanceSteps);
    if (shouldShowLefs(medicalAnswers)) dynamic.push(...lefsSteps);
    if (shouldShowTmj(medicalAnswers)) dynamic.push(...tmjSteps);
    if (shouldShowRespiratory(medicalAnswers)) dynamic.push(...respiratorySteps);

    const psfsZones = getPsfsZones(medicalAnswers);
    const newPsfs = { ...currentPsfs };
    const psfsSteps: Step[] = psfsZones.map(zone => {
        if (!newPsfs[zone]) newPsfs[zone] = getInitialPsfsAnswers();
        return `psfs_${zone.replace(/\s+/g, '_')}`;
    });

    const unique = [...new Set(dynamic)];
    const all: Step[] = [
        ...initialCommonSteps,
        ...unique,
        ...psfsSteps,
        ...finalCommonSteps,
        'summary',
    ];
    const final = all.filter((item, pos) => all.indexOf(item) === pos);
    return { steps: final, psfs: newPsfs };
}

// ==================== Reducer ====================

interface BilanState {
    currentStep: Step;
    steps: Step[];
    answers: AllAnswersSnapshot;
    isDirty: boolean;
    bilanId: string;
    startedAt: string;
    isActive: boolean; // whether a bilan session is in progress
}

type BilanAction =
    | { type: 'START_NEW' }
    | { type: 'SET_STEP'; step: Step }
    | { type: 'UPDATE_ANSWERS'; formType: Step; data: any }
    | { type: 'UPDATE_STEPS'; steps: Step[]; psfs: { [zone: string]: PSFSAnswers } }
    | { type: 'RESTORE_SESSION'; session: InProgressSession }
    | { type: 'RESET' }
    | { type: 'MARK_SAVED' };

function getInactiveState(): BilanState {
    return {
        currentStep: 'medical1',
        steps: [...initialCommonSteps, ...finalCommonSteps, 'summary'],
        answers: createInitialAnswers(),
        isDirty: false,
        bilanId: '',
        startedAt: '',
        isActive: false,
    };
}

function bilanReducer(state: BilanState, action: BilanAction): BilanState {
    switch (action.type) {
        case 'START_NEW':
            return {
                currentStep: 'medical1',
                steps: [...initialCommonSteps, ...finalCommonSteps, 'summary'],
                answers: createInitialAnswers(),
                isDirty: false,
                bilanId: crypto.randomUUID(),
                startedAt: new Date().toISOString(),
                isActive: true,
            };

        case 'SET_STEP':
            return { ...state, currentStep: action.step, isDirty: true };

        case 'UPDATE_ANSWERS': {
            const newAnswers = { ...state.answers };
            const ft = action.formType;

            if (ft.startsWith('psfs_')) {
                const zone = ft.replace('psfs_', '').replace(/_/g, ' ');
                newAnswers.psfs = { ...newAnswers.psfs, [zone]: action.data };
            } else {
                switch (ft) {
                    case 'fabq': newAnswers.fabq = action.data; break;
                    case 'pcs': newAnswers.pcs = action.data; break;
                    case 'csi':
                        newAnswers.csiPartA = action.data.partA;
                        newAnswers.csiPartB = action.data.partB;
                        break;
                    case 'medical1':
                    case 'medical2':
                    case 'medical3':
                        newAnswers.medical = { ...newAnswers.medical, ...action.data };
                        break;
                    case 'had': newAnswers.had = action.data; break;
                    case 'amplitudes': newAnswers.amplitudes = action.data; break;
                    case 'oswestry': newAnswers.oswestry = action.data; break;
                    case 'quebec': newAnswers.quebec = action.data; break;
                    case 'rolandmorris': newAnswers.rolandMorris = action.data; break;
                    case 'ndi': newAnswers.ndi = action.data; break;
                    case 'northwick': newAnswers.northwick = action.data; break;
                    case 'copenhagen': newAnswers.copenhagen = action.data; break;
                    case 'dash': newAnswers.dash = action.data; break;
                    case 'oss': newAnswers.oss = action.data; break;
                    case 'spadi': newAnswers.spadi = action.data; break;
                    case 'vas': newAnswers.vas = action.data; break;
                    case 'oswestryThoracic': newAnswers.oswestryThoracic = action.data; break;
                    case 'ikdc': newAnswers.ikdc = action.data; break;
                    case 'lysholm': newAnswers.lysholm = action.data; break;
                    case 'koos': newAnswers.koos = action.data; break;
                    case 'oes': newAnswers.oes = action.data; break;
                    case 'prtee': newAnswers.prtee = action.data; break;
                    case 'prwe': newAnswers.prwe = action.data; break;
                    case 'mhq': newAnswers.mhq = action.data; break;
                    case 'hoosps': newAnswers.hoosps = action.data; break;
                    case 'harriship': newAnswers.harrisHipScore = action.data; break;
                    case 'oxfordhip': newAnswers.oxfordHipScore = action.data; break;
                    case 'hagos': newAnswers.hagos = action.data; break;
                    case 'pfdi': newAnswers.pfdi = action.data; break;
                    case 'iciq': newAnswers.iciq = action.data; break;
                    case 'aofas': newAnswers.aofas = action.data; break;
                    case 'fadi': newAnswers.fadi = action.data; break;
                    case 'ffir': newAnswers.ffir = action.data; break;
                    case 'fogq': newAnswers.fogq = action.data; break;
                    case 'fes': newAnswers.fes = action.data; break;
                    case 'fesi': newAnswers.fesi = action.data; break;
                    case 'berg': newAnswers.berg = action.data; break;
                    case 'lefs': newAnswers.lefs = action.data; break;
                    case 'jfls': newAnswers.jfls = action.data; break;
                    case 'tmd': newAnswers.tmd = action.data; break;
                    case 'wpai': newAnswers.wpai = action.data; break;
                    case 'objectifs': newAnswers.objectifs = action.data; break;
                    case 'mmrc': newAnswers.mmrc = action.data; break;
                    case 'sgrq': newAnswers.sgrq = action.data; break;
                }
            }
            return { ...state, answers: newAnswers, isDirty: true };
        }

        case 'UPDATE_STEPS':
            return {
                ...state,
                steps: action.steps,
                answers: { ...state.answers, psfs: action.psfs },
                isDirty: true,
            };

        case 'RESTORE_SESSION':
            return {
                currentStep: action.session.currentStep,
                steps: action.session.steps,
                answers: action.session.answers,
                isDirty: false,
                bilanId: action.session.bilanId,
                startedAt: action.session.startedAt,
                isActive: true,
            };

        case 'RESET':
            return getInactiveState();

        case 'MARK_SAVED':
            return { ...state, isDirty: false };

        default:
            return state;
    }
}

// ==================== Context ====================

interface BilanContextValue {
    state: BilanState;
    startNewBilan: () => void;
    resumeBilan: (session: InProgressSession) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    skipToSummary: () => void;
    saveAnswers: (formType: Step, data: any) => void;
    saveAnswersAndNext: (formType: Step, data: any) => void;
    saveMedical1AndNext: (data: any) => void;
    resetBilan: () => void;
    completeBilan: (patientInfo: PatientInfo) => void;
    setStep: (step: Step) => void;
}

const BilanContext = createContext<BilanContextValue | null>(null);

export function BilanProvider({ children }: { children: React.ReactNode }) {
    const { currentPatient, refreshPatient } = useAuth();
    const [state, dispatch] = useReducer(bilanReducer, getInactiveState());
    const autoSaveTimerRef = useRef<number>();

    // Auto-save
    useEffect(() => {
        if (!currentPatient || !state.isActive || !state.isDirty) return;

        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = window.setTimeout(() => {
            StorageService.saveInProgress(currentPatient.account.id, {
                bilanId: state.bilanId,
                startedAt: state.startedAt,
                lastSavedAt: new Date().toISOString(),
                currentStep: state.currentStep,
                steps: state.steps,
                answers: state.answers,
            });
            dispatch({ type: 'MARK_SAVED' });
        }, 500);

        return () => window.clearTimeout(autoSaveTimerRef.current);
    }, [state.answers, state.currentStep, state.isDirty, state.isActive, currentPatient]);

    // Save on unmount / tab close
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentPatient && state.isActive && state.isDirty) {
                StorageService.saveInProgress(currentPatient.account.id, {
                    bilanId: state.bilanId,
                    startedAt: state.startedAt,
                    lastSavedAt: new Date().toISOString(),
                    currentStep: state.currentStep,
                    steps: state.steps,
                    answers: state.answers,
                });
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [currentPatient, state]);

    const startNewBilan = useCallback(() => {
        dispatch({ type: 'START_NEW' });
    }, []);

    const resumeBilan = useCallback((session: InProgressSession) => {
        dispatch({ type: 'RESTORE_SESSION', session });
    }, []);

    const goToNextStep = useCallback(() => {
        const idx = state.steps.indexOf(state.currentStep);
        const next = state.steps[idx + 1] || 'summary';
        dispatch({ type: 'SET_STEP', step: next });
    }, [state.steps, state.currentStep]);

    const goToPreviousStep = useCallback(() => {
        const idx = state.steps.indexOf(state.currentStep);
        if (idx > 0) {
            dispatch({ type: 'SET_STEP', step: state.steps[idx - 1] });
        }
    }, [state.steps, state.currentStep]);

    const skipToSummary = useCallback(() => {
        dispatch({ type: 'SET_STEP', step: 'summary' });
    }, []);

    const saveAnswers = useCallback((formType: Step, data: any) => {
        dispatch({ type: 'UPDATE_ANSWERS', formType, data });
    }, []);

    const saveAnswersAndNext = useCallback((formType: Step, data: any) => {
        dispatch({ type: 'UPDATE_ANSWERS', formType, data });
        // Compute next step from current state (after update)
        const idx = state.steps.indexOf(state.currentStep);
        const next = state.steps[idx + 1] || 'summary';
        dispatch({ type: 'SET_STEP', step: next });
    }, [state.steps, state.currentStep]);

    const saveMedical1AndNext = useCallback((data: any) => {
        // Update medical answers
        dispatch({ type: 'UPDATE_ANSWERS', formType: 'medical1', data });
        // Recalculate steps based on the new medical data
        const updatedMedical = { ...state.answers.medical, ...data };
        const { steps: newSteps, psfs: newPsfs } = computeSteps(updatedMedical, state.answers.psfs);
        dispatch({ type: 'UPDATE_STEPS', steps: newSteps, psfs: newPsfs });
        // Move to medical2
        dispatch({ type: 'SET_STEP', step: 'medical2' });
    }, [state.answers.medical, state.answers.psfs]);

    const resetBilan = useCallback(() => {
        if (currentPatient) {
            StorageService.clearInProgress(currentPatient.account.id);
        }
        dispatch({ type: 'RESET' });
    }, [currentPatient]);

    const completeBilan = useCallback((patientInfo: PatientInfo) => {
        if (!currentPatient) return;
        const bilan: CompletedBilan = {
            id: state.bilanId,
            completedAt: new Date().toISOString(),
            patientInfo,
            visibleSteps: state.steps,
            answers: state.answers,
        };
        StorageService.saveCompletedBilan(currentPatient.account.id, bilan);
        dispatch({ type: 'RESET' });
        refreshPatient();
    }, [currentPatient, state.bilanId, state.steps, state.answers, refreshPatient]);

    const setStep = useCallback((step: Step) => {
        dispatch({ type: 'SET_STEP', step });
    }, []);

    return (
        <BilanContext.Provider value={{
            state,
            startNewBilan,
            resumeBilan,
            goToNextStep,
            goToPreviousStep,
            skipToSummary,
            saveAnswers,
            saveAnswersAndNext,
            saveMedical1AndNext,
            resetBilan,
            completeBilan,
            setStep,
        }}>
            {children}
        </BilanContext.Provider>
    );
}

export function useBilan(): BilanContextValue {
    const ctx = useContext(BilanContext);
    if (!ctx) throw new Error('useBilan must be used within BilanProvider');
    return ctx;
}
