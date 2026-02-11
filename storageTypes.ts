import {
    PatientInfo, FABQAnswers, PCSAnswers, CSI_PartA_Answers, CSI_PartB_Answers,
    MedicalAnswers, OswestryAnswers, QuebecAnswers, RolandMorrisAnswers,
    NDIAnswers, NorthwickParkAnswers, CopenhagenAnswers, DASHAnswers, OSSAnswers,
    SPADIAnswers, VASAnswers, OswestryThoracicAnswers, IKDCAnswers, LysholmAnswers,
    KOOSAnswers, OESAnswers, PRTEEAnswers, PRWEAnswers, MHQAnswers, HOOSPSAnswers,
    HarrisHipScoreAnswers, OHSAnswers, HAGOSAnswers, PFDIAnswers, ICIQAnswers,
    AOFASAnswers, FADIAnswers, FFIRAnswers, FOGQAnswers, FESAnswers, FESIAnswers,
    BergAnswers, LEFSAnswers, JFLSAnswers, TMDAnswers, WPAIAnswers,
    ObjectifsAnswers, AmplitudesAnswers, MMRCAnswers, SGRQAnswers, PSFSAnswers,
    HADAnswers, Step
} from './types';

export const APP_VERSION = '1.0.0';

export const APP_STORAGE_KEYS = {
    PATIENTS: 'kslb_patients',
    SESSION: 'kslb_session',
    VERSION: 'kslb_app_version',
    ADMINS: 'kslb_admins',
    ADMIN_SESSION: 'kslb_admin_session',
} as const;

export interface PatientAccount {
    id: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    numeroSecuriteSociale: string;
    pinHash: string;
    createdAt: string;
}

export interface AllAnswersSnapshot {
    fabq: FABQAnswers;
    pcs: PCSAnswers;
    csiPartA: CSI_PartA_Answers;
    csiPartB: CSI_PartB_Answers;
    medical: MedicalAnswers;
    oswestry: OswestryAnswers;
    quebec: QuebecAnswers;
    rolandMorris: RolandMorrisAnswers;
    ndi: NDIAnswers;
    northwick: NorthwickParkAnswers;
    copenhagen: CopenhagenAnswers;
    dash: DASHAnswers;
    oss: OSSAnswers;
    spadi: SPADIAnswers;
    vas: VASAnswers;
    oswestryThoracic: OswestryThoracicAnswers;
    ikdc: IKDCAnswers;
    lysholm: LysholmAnswers;
    koos: KOOSAnswers;
    oes: OESAnswers;
    prtee: PRTEEAnswers;
    prwe: PRWEAnswers;
    mhq: MHQAnswers;
    hoosps: HOOSPSAnswers;
    harrisHipScore: HarrisHipScoreAnswers;
    oxfordHipScore: OHSAnswers;
    hagos: HAGOSAnswers;
    pfdi: PFDIAnswers;
    iciq: ICIQAnswers;
    aofas: AOFASAnswers;
    fadi: FADIAnswers;
    ffir: FFIRAnswers;
    fogq: FOGQAnswers;
    fes: FESAnswers;
    fesi: FESIAnswers;
    berg: BergAnswers;
    lefs: LEFSAnswers;
    jfls: JFLSAnswers;
    tmd: TMDAnswers;
    wpai: WPAIAnswers;
    objectifs: ObjectifsAnswers;
    amplitudes: AmplitudesAnswers;
    mmrc: MMRCAnswers;
    sgrq: SGRQAnswers;
    psfs: { [zone: string]: PSFSAnswers };
    had: HADAnswers;
}

export interface CompletedBilan {
    id: string;
    completedAt: string;
    patientInfo: PatientInfo;
    visibleSteps: Step[];
    answers: AllAnswersSnapshot;
}

export interface InProgressSession {
    bilanId: string;
    startedAt: string;
    lastSavedAt: string;
    currentStep: Step;
    steps: Step[];
    answers: AllAnswersSnapshot;
}

export interface PatientRecord {
    account: PatientAccount;
    completedBilans: CompletedBilan[];
    inProgress: InProgressSession | null;
}

export interface SessionData {
    patientId: string;
    loggedInAt: string;
}

// ---- Admin ----

export interface AdminAccount {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: string;
}

export interface AdminSessionData {
    adminId: string;
    loggedInAt: string;
}
