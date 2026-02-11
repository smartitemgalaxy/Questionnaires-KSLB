
// Patient Info
export interface PatientInfo {
    nom: string;
    prenom: string;
    numeroSecuriteSociale: string;
    date: string;
}

// For FABQ
export interface RatingQuestion {
  id: number;
  text: string;
}

export interface FABQAnswers {
  [key: number]: number | null;
}

export interface FABQScores {
  work: number | null;
  physicalActivity: number | null;
}

// For Pain Catastrophizing Scale (PCS)
export interface PCSAnswers {
  [key: number]: number | null;
}

export interface PCSScores {
  total: number | null;
}

// For Central Sensitization Inventory (CSI)
export interface CSI_PartA_Answers {
  [key: number]: number | null;
}

export interface CSI_PartB_Answer {
    diagnosed: boolean | null;
    year: string;
}

export interface CSI_PartB_Answers {
  [key: number]: CSI_PartB_Answer;
}

export interface CSIScores {
  partA: number | null;
}

// For Medical Questionnaire
export type MedicalQuestionType = 'text' | 'yes-no' | 'yes-no-specify' | 'anatomy-selector';

export interface AnatomySelection {
    selected: string[];
    autre_descriptions: string[];
}

export interface AnatomyNode {
    name: string;
    children?: AnatomyNode[];
}

export interface MedicalQuestionDef {
    id: string;
    text: string;
    type: MedicalQuestionType;
    placeholder?: string;
}

export interface MedicalQuestionSectionDef {
    title: string;
    questions: MedicalQuestionDef[];
}

export interface MedicalAnswer {
    value: string | boolean | AnatomySelection | null;
    details: string;
}

export interface MedicalAnswers {
    [key: string]: MedicalAnswer;
}

// For Oswestry Disability Index
export interface OswestryQuestion {
    id: number;
    section: string;
    options: string[];
}
export interface OswestryAnswers {
    [key: number]: number | null;
}

// For Québec Back Pain Disability Scale
export interface QuebecQuestion {
    id: number;
    text: string;
}
export interface QuebecAnswers {
    [key: number]: number | null;
}

// For Roland-Morris Disability Questionnaire
export interface RolandMorrisQuestion {
    id: number;
    text: string;
}
export interface RolandMorrisAnswers {
    [key: number]: boolean;
}

// For Neck Disability Index (NDI)
export interface NDIQuestion {
    id: number;
    section: string;
    options: string[];
}
export interface NDIAnswers {
    [key: number]: number | null;
}

// For Northwick Park Neck Pain Questionnaire
export interface NorthwickParkQuestion {
    id: number;
    section: string;
    options: string[];
}
export interface NorthwickParkAnswers {
    [key: number]: number | null;
}

// For Copenhagen Neck Disability Scale
export interface CopenhagenQuestion {
    id: number;
    text: string;
}
export interface CopenhagenAnswers {
    [key: number]: number | null; // 0 for No, 1 for Occasionally, 2 for Yes
}

// For DASH (Disabilities of the Arm, Shoulder and Hand)
export interface DASHQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface DASHAnswers {
    [key: number]: number | null; // 1-5
}

// For Oxford Shoulder Score (OSS)
export interface OSSQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface OSSAnswers {
    [key: number]: number | null; // 0-4
}

// For SPADI (Shoulder Pain and Disability Index)
export interface SPADIQuestion {
    id: number;
    text: string;
    scale: 'pain' | 'disability';
}
export interface SPADIAnswers {
    [key: number]: number | null; // 0-10
}

// For VAS (Visual Analog Scale)
export interface VASAnswers {
    pain: number | null;
}

// For Oswestry Thoracic Pain Disability Questionnaire
export interface OswestryThoracicQuestion {
    id: number;
    section: string;
    options: string[];
}
export interface OswestryThoracicAnswers {
    [key: number]: number | null;
}

// For IKDC
export type IKDCQuestionType = 'select' | 'scale' | 'multiselect' | 'yesno' | 'function';
export interface IKDCOption { text: string; score?: number; }
export interface IKDCQuestion {
    id: string;
    text: string;
    type: IKDCQuestionType;
    options?: IKDCOption[];
    subQuestions?: IKDCQuestion[]; // For function section
}
export interface IKDCAnswers {
    [key: string]: number | null | { [subKey: string]: number | null };
}

// For Lysholm
export interface LysholmQuestion {
    id: number;
    section: string;
    options: { text: string; score: number }[];
}
export interface LysholmAnswers {
    [key: number]: number | null;
}

// For KOOS
export interface KOOSQuestion {
    id: string; // S1, P2 etc.
    text: string;
}
export interface KOOSSubscale {
    key: 'symptoms' | 'pain' | 'adl' | 'sport' | 'qol';
    title: string;
    description: string;
    questions: KOOSQuestion[];
}
export interface KOOSAnswers {
    [key: string]: number | null; // 0-4
}

// For Oxford Elbow Score (OES)
export interface OESQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface OESAnswers {
    [key: number]: number | null; // 0-4
}

// For Patient-Rated Tennis Elbow Evaluation (PRTEE)
export interface PRTEEQuestion {
    id: number;
    text: string;
    scale: 'pain' | 'specific_activity' | 'usual_activity';
}
export interface PRTEEAnswers {
    [key: number]: number | null; // 0-10
}

// For Patient-Rated Wrist Evaluation (PRWE)
export interface PRWEQuestion {
    id: number;
    text: string;
    scale: 'pain' | 'specific_activity' | 'usual_activity';
}
export interface PRWEAnswers {
    [key: number]: number | null; // 0-10
}

// For Michigan Hand Outcomes Questionnaire (MHQ)
export interface MHQQuestion {
    id: string; // e.g., 'I_A_1'
    text: string;
    section: string; // I_A, I_B, etc.
    options?: string[]; // For multiple choice questions
}
export interface MHQAnswers {
    [key: string]: number | null; // 1-5 for most
}

// For HOOS-PS (Hip disability and Osteoarthritis Outcome Score - Physical Function Short form)
export interface HOOSPSQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface HOOSPSAnswers {
    [key: number]: number | null; // 0-4
}

// For Harris Hip Score (HHS)
export interface HarrisHipScoreAnswers {
    pain: number | null;
    limp: number | null;
    support: number | null;
    distance: number | null;
    stairs: number | null;
    shoes: number | null;
    sitting: number | null;
    transport: number | null;
    deformity: {
        flexion: boolean;
        abduction: boolean;
        internalRotation: boolean;
        limbLength: boolean;
    };
    rom: {
        flexion: number | string;
        abduction: number | string;
        adduction: number | string;
        externalRotation: number | string;
        internalRotation: number | string;
    };
}


// For Oxford Hip Score (OHS)
export interface OHSQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface OHSAnswers {
    [key: number]: number | null; // 0-4
}

// For HAGOS
export interface HAGOSQuestion {
    id: string;
    text: string;
}
export interface HAGOSSubscale {
    key: 'symptoms' | 'pain' | 'adl' | 'sport' | 'pa' | 'qol';
    title: string;
    description: string;
    questions: HAGOSQuestion[];
}
export interface HAGOSAnswers {
    [key: string]: number | null;
}

// For PFDI-20
export interface PFDIQuestion {
    id: number;
    text: string;
}
export interface PFDIAnswers {
    [key: number]: {
        hasSymptom: 'yes' | 'no' | null;
        bother: number | null; // 0-3
    };
}

// For ICIQ-UI SF
export interface ICIQAnswers {
    gender: 'male' | 'female' | null;
    frequency: number | null;
    amount: number | null;
    interference: number | null;
    when: {
        never: boolean;
        beforeToilet: boolean;
        coughSneeze: boolean;
        asleep: boolean;
        active: boolean;
        finishedUrinating: boolean;
        noReason: boolean;
        allTheTime: boolean;
    };
}

// For AOFAS
export interface AOFASAnswers {
    pain: number | null;
    activity_limitations: number | null;
    walking_distance: number | null;
    walking_surface: number | null;
    gait_abnormality: number | null;
    sagittal_motion: number | null;
    hindfoot_motion: number | null;
    stability: number | null;
    alignment: number | null;
}

// For FADI
export interface FADIQuestion {
    id: number;
    text: string;
    scale: 'adl' | 'sport';
}
export interface FADIAnswers {
    [key: number]: number | 'N/A' | null;
}

// For FFIR
export interface FFIRQuestion {
    id: number;
    text: string;
    scale: 'pain' | 'stiffness' | 'difficulty' | 'activity' | 'social';
}
export interface FFIRAnswers {
    [key: number]: number | null;
}

// For FOGQ
export interface FOGQQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface FOGQAnswers {
    [key: number]: number | null;
}

// For FES
export interface FESQuestion {
    id: number;
    text: string;
}
export interface FESAnswers {
    [key: number]: number | null;
}

// For FES-I
export interface FESIAnswers {
    [key: number]: number | null;
}


// For Berg Balance Scale
export interface BergQuestion {
    id: number;
    text: string;
    instructions: string;
    options: string[];
}
export interface BergAnswers {
    [key: number]: number | null;
}

// For LEFS
export interface LEFSQuestion {
    id: number;
    text: string;
    options: string[];
}
export interface LEFSAnswers {
    [key: number]: number | null;
}

// For JFLS
export interface JFLSQuestion {
    id: number;
    text: string;
}
export interface JFLSAnswers {
    [key: number]: number | null;
}

// For TMD
export interface TMDQuestion {
    id: number;
    section: string;
    options: string[];
}
export interface TMDAnswers {
    [key: number]: number | null;
}


// For WPAI
export interface WPAIAnswers {
    employed: 'yes' | 'no' | null;
    missedWorkHoursHealth: number | null;
    missedWorkHoursOther: number | null;
    workedHours: number | null;
    workAffected: number | null;
    activityAffected: number | null;
}

// For Objectifs
export interface ObjectifsAnswers {
    q1: string[];
    q1_autre: string;
    q2: string[];
    q2_autre: string;
    q3: string[];
    q3_autre: string;
    q4: string[];
    q5: string | null;
    q6: string | null;
    q7: string | null;
    q8: string | null;
    q9: string | null;
    q10: string | null;
    q11: string | null;
    q11_autre: string;
    q12: string | null;
    q12_details: { [key: string]: string };
    q13: number | null;
    q14: number | null;
    [key: string]: any; // Allow for flexible structure
}


// For Amplitudes Articulaires
export interface MouvementAmplitudes {
    amplitude: string | null;
    douleur: string | null;
}
export interface AmplitudesAnswers {
    [partKey: string]: {
        [mvtKey: string]: MouvementAmplitudes 
    } | {
        gauche: { [mvtKey: string]: MouvementAmplitudes },
        droite: { [mvtKey: string]: MouvementAmplitudes }
    };
}

// For Patient-Specific Functional Scale (PSFS)
export interface PSFSActivity {
    description: string;
    score: number | null;
}
export interface PSFSAnswers {
    activities: PSFSActivity[];
}

// For mMRC Dyspnoea Scale
export interface MMRCAnswers {
    score: number | null;
}

// For St. George's Hospital Respiratory Questionnaire (SGRQ)
export interface SGRQAnswers {
    [key: string]: number | boolean | null;
}

// For Hospital Anxiety and Depression Scale (HAD)
export interface HADAnswers {
  [key: number]: number | null;
}

// FIX: Moved Step type here to resolve circular dependency.
export type Step = string;

export interface SummaryPageProps {
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
    hadAnswers: HADAnswers;
    visibleSteps: Step[];
    onEditQuestionnaire: (step: Step) => void;
    onRestart: () => void;
}