import React, { useState, useEffect } from 'react';
import { PatientInfo, Step } from './types';
import {
    MEDICAL_QUESTIONNAIRE_MOTIF_SYMPTOMES, MEDICAL_QUESTIONNAIRE_ANTECEDENTS_MEDICAUX,
    MEDICAL_QUESTIONNAIRE_CONTEXTE_VIE
} from './constants';

// Form components (unchanged)
import FABQForm from './components/FABQForm';
import PCSForm from './components/PCSForm';
import CSIForm from './components/CSIForm';
import MedicalForm from './components/MedicalForm';
import SummaryPage from './components/SummaryPage';
import OswestryForm from './components/OswestryForm';
import QuebecForm from './components/QuebecForm';
import RolandMorrisForm from './components/RolandMorrisForm';
import NDIForm from './components/NDIForm';
import NorthwickParkForm from './components/NorthwickParkForm';
import CopenhagenForm from './components/CopenhagenForm';
import DASHForm from './components/DASHForm';
import OSSForm from './components/OSSForm';
import SPADIForm from './components/SPADIForm';
import VASForm from './components/VASForm';
import OswestryThoracicForm from './components/OswestryThoracicForm';
import IKDCForm from './components/IKDCForm';
import LysholmForm from './components/LysholmForm';
import KOOSForm from './components/KOOSForm';
import OESForm from './components/OESForm';
import PRTEEForm from './components/PRTEEForm';
import PRWEForm from './components/PRWEForm';
import MHQForm from './components/MHQForm';
import HOOSPSForm from './components/HOOSPSForm';
import HarrisHipScoreForm from './components/HarrisHipScoreForm';
import OxfordHipScoreForm from './components/OxfordHipScoreForm';
import HAGOSForm from './components/HAGOSForm';
import PFDIForm from './components/PFDIForm';
import ICIQForm from './components/ICIQForm';
import AOFASForm from './components/AOFASForm';
import FADIForm from './components/FADIForm';
import FFIRForm from './components/FFIRForm';
import FOGQForm from './components/FOGQForm';
import FESForm from './components/FESForm';
import FESIForm from './components/FESIForm';
import BergForm from './components/BergForm';
import LEFSForm from './components/LEFSForm';
import JFLSForm from './components/JFLSForm';
import TMDForm from './components/TMDForm';
import WPAIForm from './components/WPAIForm';
import ObjectifsForm from './components/ObjectifsForm';
import AmplitudesForm from './components/AmplitudesForm';
import MMRCForm from './components/MMRCForm';
import SGRQForm from './components/SGRQForm';
import PSFSForm from './components/PSFSForm';
import HADForm from './components/HADForm';
import Dashboard from './components/Dashboard';
import WhatsAppChat from './components/WhatsAppChat';
import Logo from './components/Logo';
import LoginPage from './components/LoginPage';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';

// Auth & Bilan contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BilanProvider, useBilan, allStepDetails, createInitialAnswers } from './contexts/BilanContext';
import { CompletedBilan } from './storageTypes';
import * as AdminAuth from './services/adminAuth';

// ==================== Questionnaire Flow ====================

function QuestionnaireFlow({ onComplete }: { onComplete: () => void }) {
    const { currentPatient } = useAuth();
    const {
        state, goToNextStep, goToPreviousStep, skipToSummary,
        saveAnswers, saveAnswersAndNext, saveMedical1AndNext,
        completeBilan, setStep, resetBilan,
    } = useBilan();

    const { currentStep, steps, answers } = state;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    const handleSkipToSummary = (data: any, formType?: Step) => {
        saveAnswers(formType || currentStep, data);
        skipToSummary();
    };

    const patientInfo: PatientInfo = currentPatient ? {
        nom: currentPatient.account.nom,
        prenom: currentPatient.account.prenom,
        numeroSecuriteSociale: currentPatient.account.numeroSecuriteSociale,
        date: new Date().toLocaleDateString('fr-FR'),
    } : { nom: '', prenom: '', numeroSecuriteSociale: '', date: '' };

    // PSFS dynamic
    if (currentStep.startsWith('psfs_')) {
        const zone = allStepDetails[currentStep]?.title || currentStep.replace('psfs_', '').replace(/_/g, ' ');
        const psfsKey = currentStep.replace('psfs_', '').replace(/_/g, ' ');
        return <PSFSForm
            key={currentStep}
            title={zone}
            initialAnswers={answers.psfs[psfsKey] || { activities: Array.from({ length: 5 }, () => ({ description: '', score: null })) }}
            onNext={(a) => { saveAnswersAndNext(currentStep, a); }}
            onPrevious={goToPreviousStep}
            onSkipToSummary={(a) => handleSkipToSummary(a, currentStep)}
            onSave={(a) => saveAnswers(currentStep, a)}
        />;
    }

    switch (currentStep) {
        case 'medical1':
            return <MedicalForm title="Questionnaire Medical (1/3)" questionnaire={MEDICAL_QUESTIONNAIRE_MOTIF_SYMPTOMES} initialAnswers={answers.medical} onNext={(a) => saveMedical1AndNext(a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'medical1')} onSave={(a) => saveAnswers('medical1', a)} />;
        case 'medical2':
            return <MedicalForm title="Questionnaire Medical (2/3)" questionnaire={MEDICAL_QUESTIONNAIRE_ANTECEDENTS_MEDICAUX} initialAnswers={answers.medical} onNext={(a) => saveAnswersAndNext('medical2', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'medical2')} onSave={(a) => saveAnswers('medical2', a)} />;
        case 'medical3':
            return <MedicalForm title="Questionnaire Medical (3/3)" questionnaire={MEDICAL_QUESTIONNAIRE_CONTEXTE_VIE} initialAnswers={answers.medical} onNext={(a) => saveAnswersAndNext('medical3', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'medical3')} onSave={(a) => saveAnswers('medical3', a)} />;
        case 'objectifs':
            return <ObjectifsForm initialAnswers={answers.objectifs} onNext={(a) => saveAnswersAndNext('objectifs', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'objectifs')} onSave={(a) => saveAnswers('objectifs', a)} />;
        case 'had':
            return <HADForm initialAnswers={answers.had} onNext={(a) => saveAnswersAndNext('had', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'had')} onSave={(a) => saveAnswers('had', a)} />;
        case 'amplitudes':
            return <AmplitudesForm initialAnswers={answers.amplitudes} onNext={(a) => saveAnswersAndNext('amplitudes', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'amplitudes')} onSave={(a) => saveAnswers('amplitudes', a)} />;
        case 'fabq':
            return <FABQForm initialAnswers={answers.fabq} onNext={(a) => saveAnswersAndNext('fabq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fabq')} onSave={(a) => saveAnswers('fabq', a)} />;
        case 'pcs':
            return <PCSForm initialAnswers={answers.pcs} onNext={(a) => saveAnswersAndNext('pcs', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'pcs')} onSave={(a) => saveAnswers('pcs', a)} />;
        case 'csi':
            return <CSIForm initialPartAAnswers={answers.csiPartA} initialPartBAnswers={answers.csiPartB} onNext={(partA, partB) => saveAnswersAndNext('csi', { partA, partB })} onPrevious={goToPreviousStep} onSkipToSummary={(partA, partB) => handleSkipToSummary({ partA, partB }, 'csi')} onSave={(partA, partB) => saveAnswers('csi', { partA, partB })} />;
        case 'oswestry':
            return <OswestryForm initialAnswers={answers.oswestry} onNext={(a) => saveAnswersAndNext('oswestry', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oswestry')} onSave={(a) => saveAnswers('oswestry', a)} />;
        case 'quebec':
            return <QuebecForm initialAnswers={answers.quebec} onNext={(a) => saveAnswersAndNext('quebec', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'quebec')} onSave={(a) => saveAnswers('quebec', a)} />;
        case 'rolandmorris':
            return <RolandMorrisForm initialAnswers={answers.rolandMorris} onNext={(a) => saveAnswersAndNext('rolandmorris', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'rolandmorris')} onSave={(a) => saveAnswers('rolandmorris', a)} />;
        case 'ndi':
            return <NDIForm initialAnswers={answers.ndi} onNext={(a) => saveAnswersAndNext('ndi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'ndi')} onSave={(a) => saveAnswers('ndi', a)} />;
        case 'northwick':
            return <NorthwickParkForm initialAnswers={answers.northwick} onNext={(a) => saveAnswersAndNext('northwick', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'northwick')} onSave={(a) => saveAnswers('northwick', a)} />;
        case 'copenhagen':
            return <CopenhagenForm initialAnswers={answers.copenhagen} onNext={(a) => saveAnswersAndNext('copenhagen', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'copenhagen')} onSave={(a) => saveAnswers('copenhagen', a)} />;
        case 'dash':
            return <DASHForm initialAnswers={answers.dash} onNext={(a) => saveAnswersAndNext('dash', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'dash')} onSave={(a) => saveAnswers('dash', a)} />;
        case 'oss':
            return <OSSForm initialAnswers={answers.oss} onNext={(a) => saveAnswersAndNext('oss', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oss')} onSave={(a) => saveAnswers('oss', a)} />;
        case 'spadi':
            return <SPADIForm initialAnswers={answers.spadi} onNext={(a) => saveAnswersAndNext('spadi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'spadi')} onSave={(a) => saveAnswers('spadi', a)} />;
        case 'vas':
            return <VASForm initialAnswers={answers.vas} onNext={(a) => saveAnswersAndNext('vas', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'vas')} onSave={(a) => saveAnswers('vas', a)} />;
        case 'oswestryThoracic':
            return <OswestryThoracicForm initialAnswers={answers.oswestryThoracic} onNext={(a) => saveAnswersAndNext('oswestryThoracic', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oswestryThoracic')} onSave={(a) => saveAnswers('oswestryThoracic', a)} />;
        case 'ikdc':
            return <IKDCForm initialAnswers={answers.ikdc} onNext={(a) => saveAnswersAndNext('ikdc', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'ikdc')} onSave={(a) => saveAnswers('ikdc', a)} />;
        case 'lysholm':
            return <LysholmForm initialAnswers={answers.lysholm} onNext={(a) => saveAnswersAndNext('lysholm', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'lysholm')} onSave={(a) => saveAnswers('lysholm', a)} />;
        case 'koos':
            return <KOOSForm initialAnswers={answers.koos} onNext={(a) => saveAnswersAndNext('koos', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'koos')} onSave={(a) => saveAnswers('koos', a)} />;
        case 'oes':
            return <OESForm initialAnswers={answers.oes} onNext={(a) => saveAnswersAndNext('oes', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oes')} onSave={(a) => saveAnswers('oes', a)} />;
        case 'prtee':
            return <PRTEEForm initialAnswers={answers.prtee} onNext={(a) => saveAnswersAndNext('prtee', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'prtee')} onSave={(a) => saveAnswers('prtee', a)} />;
        case 'prwe':
            return <PRWEForm initialAnswers={answers.prwe} onNext={(a) => saveAnswersAndNext('prwe', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'prwe')} onSave={(a) => saveAnswers('prwe', a)} />;
        case 'mhq':
            return <MHQForm initialAnswers={answers.mhq} onNext={(a) => saveAnswersAndNext('mhq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'mhq')} onSave={(a) => saveAnswers('mhq', a)} />;
        case 'hoosps':
            return <HOOSPSForm initialAnswers={answers.hoosps} onNext={(a) => saveAnswersAndNext('hoosps', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'hoosps')} onSave={(a) => saveAnswers('hoosps', a)} />;
        case 'harriship':
            return <HarrisHipScoreForm initialAnswers={answers.harrisHipScore} onNext={(a) => saveAnswersAndNext('harriship', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'harriship')} onSave={(a) => saveAnswers('harriship', a)} />;
        case 'oxfordhip':
            return <OxfordHipScoreForm initialAnswers={answers.oxfordHipScore} onNext={(a) => saveAnswersAndNext('oxfordhip', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oxfordhip')} onSave={(a) => saveAnswers('oxfordhip', a)} />;
        case 'hagos':
            return <HAGOSForm initialAnswers={answers.hagos} onNext={(a) => saveAnswersAndNext('hagos', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'hagos')} onSave={(a) => saveAnswers('hagos', a)} />;
        case 'pfdi':
            return <PFDIForm initialAnswers={answers.pfdi} onNext={(a) => saveAnswersAndNext('pfdi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'pfdi')} onSave={(a) => saveAnswers('pfdi', a)} />;
        case 'iciq':
            return <ICIQForm initialAnswers={answers.iciq} onNext={(a) => saveAnswersAndNext('iciq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'iciq')} onSave={(a) => saveAnswers('iciq', a)} />;
        case 'aofas':
            return <AOFASForm initialAnswers={answers.aofas} onNext={(a) => saveAnswersAndNext('aofas', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'aofas')} onSave={(a) => saveAnswers('aofas', a)} />;
        case 'fadi':
            return <FADIForm initialAnswers={answers.fadi} onNext={(a) => saveAnswersAndNext('fadi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fadi')} onSave={(a) => saveAnswers('fadi', a)} />;
        case 'ffir':
            return <FFIRForm initialAnswers={answers.ffir} onNext={(a) => saveAnswersAndNext('ffir', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'ffir')} onSave={(a) => saveAnswers('ffir', a)} />;
        case 'fogq':
            return <FOGQForm initialAnswers={answers.fogq} onNext={(a) => saveAnswersAndNext('fogq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fogq')} onSave={(a) => saveAnswers('fogq', a)} />;
        case 'fes':
            return <FESForm initialAnswers={answers.fes} onNext={(a) => saveAnswersAndNext('fes', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fes')} onSave={(a) => saveAnswers('fes', a)} />;
        case 'fesi':
            return <FESIForm initialAnswers={answers.fesi} onNext={(a) => saveAnswersAndNext('fesi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fesi')} onSave={(a) => saveAnswers('fesi', a)} />;
        case 'berg':
            return <BergForm initialAnswers={answers.berg} onNext={(a) => saveAnswersAndNext('berg', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'berg')} onSave={(a) => saveAnswers('berg', a)} />;
        case 'lefs':
            return <LEFSForm initialAnswers={answers.lefs} onNext={(a) => saveAnswersAndNext('lefs', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'lefs')} onSave={(a) => saveAnswers('lefs', a)} />;
        case 'jfls':
            return <JFLSForm initialAnswers={answers.jfls} onNext={(a) => saveAnswersAndNext('jfls', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'jfls')} onSave={(a) => saveAnswers('jfls', a)} />;
        case 'tmd':
            return <TMDForm initialAnswers={answers.tmd} onNext={(a) => saveAnswersAndNext('tmd', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'tmd')} onSave={(a) => saveAnswers('tmd', a)} />;
        case 'wpai':
            return <WPAIForm initialAnswers={answers.wpai} onNext={(a) => saveAnswersAndNext('wpai', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'wpai')} onSave={(a) => saveAnswers('wpai', a)} />;
        case 'mmrc':
            return <MMRCForm initialAnswers={answers.mmrc} onNext={(a) => saveAnswersAndNext('mmrc', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'mmrc')} onSave={(a) => saveAnswers('mmrc', a)} />;
        case 'sgrq':
            return <SGRQForm initialAnswers={answers.sgrq} onNext={(a) => saveAnswersAndNext('sgrq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'sgrq')} onSave={(a) => saveAnswers('sgrq', a)} />;
        case 'summary':
            return <SummaryPage
                patientInfo={patientInfo}
                fabqAnswers={answers.fabq}
                pcsAnswers={answers.pcs}
                csiPartAAnswers={answers.csiPartA}
                csiPartBAnswers={answers.csiPartB}
                medicalAnswers={answers.medical}
                amplitudesAnswers={answers.amplitudes}
                oswestryAnswers={answers.oswestry}
                quebecAnswers={answers.quebec}
                rolandMorrisAnswers={answers.rolandMorris}
                ndiAnswers={answers.ndi}
                northwickAnswers={answers.northwick}
                copenhagenAnswers={answers.copenhagen}
                dashAnswers={answers.dash}
                ossAnswers={answers.oss}
                spadiAnswers={answers.spadi}
                oesAnswers={answers.oes}
                prteeAnswers={answers.prtee}
                prweAnswers={answers.prwe}
                mhqAnswers={answers.mhq}
                vasAnswers={answers.vas}
                oswestryThoracicAnswers={answers.oswestryThoracic}
                ikdcAnswers={answers.ikdc}
                lysholmAnswers={answers.lysholm}
                koosAnswers={answers.koos}
                hoospsAnswers={answers.hoosps}
                harrisHipScoreAnswers={answers.harrisHipScore}
                oxfordHipScoreAnswers={answers.oxfordHipScore}
                hagosAnswers={answers.hagos}
                pfdiAnswers={answers.pfdi}
                iciqAnswers={answers.iciq}
                aofasAnswers={answers.aofas}
                fadiAnswers={answers.fadi}
                ffirAnswers={answers.ffir}
                fogqAnswers={answers.fogq}
                fesAnswers={answers.fes}
                fesiAnswers={answers.fesi}
                bergAnswers={answers.berg}
                lefsAnswers={answers.lefs}
                jflsAnswers={answers.jfls}
                tmdAnswers={answers.tmd}
                wpaiAnswers={answers.wpai}
                objectifsAnswers={answers.objectifs}
                mmrcAnswers={answers.mmrc}
                sgrqAnswers={answers.sgrq}
                psfsAnswers={answers.psfs}
                hadAnswers={answers.had}
                visibleSteps={steps}
                onEditQuestionnaire={(step) => setStep(step)}
                onRestart={() => { completeBilan(patientInfo); onComplete(); }}
            />;
        default:
            return null;
    }
}

// ==================== Read-only Summary Viewer ====================

function BilanSummaryViewer({ bilan, onBack }: { bilan: CompletedBilan; onBack: () => void }) {
    const a = bilan.answers;
    return (
        <div>
            <div className="mb-4 no-print">
                <button onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors">
                    Retour a l'historique
                </button>
            </div>
            <SummaryPage
                patientInfo={bilan.patientInfo}
                fabqAnswers={a.fabq}
                pcsAnswers={a.pcs}
                csiPartAAnswers={a.csiPartA}
                csiPartBAnswers={a.csiPartB}
                medicalAnswers={a.medical}
                amplitudesAnswers={a.amplitudes}
                oswestryAnswers={a.oswestry}
                quebecAnswers={a.quebec}
                rolandMorrisAnswers={a.rolandMorris}
                ndiAnswers={a.ndi}
                northwickAnswers={a.northwick}
                copenhagenAnswers={a.copenhagen}
                dashAnswers={a.dash}
                ossAnswers={a.oss}
                spadiAnswers={a.spadi}
                oesAnswers={a.oes}
                prteeAnswers={a.prtee}
                prweAnswers={a.prwe}
                mhqAnswers={a.mhq}
                vasAnswers={a.vas}
                oswestryThoracicAnswers={a.oswestryThoracic}
                ikdcAnswers={a.ikdc}
                lysholmAnswers={a.lysholm}
                koosAnswers={a.koos}
                hoospsAnswers={a.hoosps}
                harrisHipScoreAnswers={a.harrisHipScore}
                oxfordHipScoreAnswers={a.oxfordHipScore}
                hagosAnswers={a.hagos}
                pfdiAnswers={a.pfdi}
                iciqAnswers={a.iciq}
                aofasAnswers={a.aofas}
                fadiAnswers={a.fadi}
                ffirAnswers={a.ffir}
                fogqAnswers={a.fogq}
                fesAnswers={a.fes}
                fesiAnswers={a.fesi}
                bergAnswers={a.berg}
                lefsAnswers={a.lefs}
                jflsAnswers={a.jfls}
                tmdAnswers={a.tmd}
                wpaiAnswers={a.wpai}
                objectifsAnswers={a.objectifs}
                mmrcAnswers={a.mmrc}
                sgrqAnswers={a.sgrq}
                psfsAnswers={a.psfs}
                hadAnswers={a.had}
                visibleSteps={bilan.visibleSteps}
                onEditQuestionnaire={() => {}}
                onRestart={onBack}
            />
        </div>
    );
}

// ==================== Admin Login / Setup ====================

function AdminLoginPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
    const isSetup = !AdminAuth.hasAnyAdmin();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (isSetup) {
            if (password !== passwordConfirm) {
                setError('Les mots de passe ne correspondent pas.');
                setIsSubmitting(false);
                return;
            }
            const result = await AdminAuth.setupFirstAdmin(username, password);
            if (!result.success) {
                setError(result.error || 'Erreur.');
                setIsSubmitting(false);
                return;
            }
        } else {
            const result = await AdminAuth.adminLogin(username, password);
            if (!result.success) {
                setError(result.error || 'Erreur.');
                setIsSubmitting(false);
                return;
            }
        }
        setIsSubmitting(false);
        onSuccess();
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87] outline-none transition-colors";
    const labelClass = "block text-left text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Logo className="h-24 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0D57A6]">Administration KSLB</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {isSetup ? 'Creer le compte administrateur' : 'Connexion administrateur'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div>
                        <label className={labelClass}>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={inputClass}
                            placeholder="admin"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={inputClass}
                            placeholder="6 caracteres minimum"
                            autoComplete={isSetup ? 'new-password' : 'current-password'}
                        />
                    </div>
                    {isSetup && (
                        <div>
                            <label className={labelClass}>Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={e => setPasswordConfirm(e.target.value)}
                                className={inputClass}
                                placeholder="Confirmer"
                                autoComplete="new-password"
                            />
                            {password.length >= 6 && passwordConfirm.length >= 6 && password !== passwordConfirm && (
                                <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas.</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-3 text-base font-semibold text-white bg-[#0D57A6] rounded-lg shadow-sm hover:bg-[#0a4785] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D57A6] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Connexion...' : isSetup ? 'Creer le compte admin' : 'Se connecter'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        <button type="button" onClick={onBack} className="text-[#1565C0] font-semibold hover:underline">
                            Retour a l'espace patient
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

// ==================== Main App Content ====================

type AppView = 'dashboard' | 'bilan' | 'chat' | 'viewBilan' | 'pdfCatalog';
type GlobalMode = 'patient' | 'admin' | 'adminLogin';

function AppContent() {
    const { isAuthenticated, isLoading, currentPatient, logout } = useAuth();
    const [view, setView] = useState<AppView>('dashboard');
    const [viewingBilan, setViewingBilan] = useState<CompletedBilan | null>(null);
    const [mode, setMode] = useState<GlobalMode>(() => {
        // Check if admin is already logged in
        if (AdminAuth.getCurrentAdmin()) return 'admin';
        return 'patient';
    });

    if (isLoading && mode === 'patient') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Logo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-500 text-sm">Chargement...</p>
                </div>
            </div>
        );
    }

    // ---- Admin mode ----
    if (mode === 'adminLogin') {
        return <AdminLoginPage onBack={() => setMode('patient')} onSuccess={() => setMode('admin')} />;
    }

    if (mode === 'admin') {
        const admin = AdminAuth.getCurrentAdmin();
        if (!admin) {
            return <AdminLoginPage onBack={() => setMode('patient')} onSuccess={() => setMode('admin')} />;
        }

        const handleAdminLogout = () => {
            AdminAuth.adminLogout();
            setMode('patient');
        };

        const handleAdminViewBilan = (bilan: CompletedBilan) => {
            setViewingBilan(bilan);
        };

        // Admin viewing a bilan summary
        if (viewingBilan) {
            return (
                <div className="min-h-screen bg-slate-50">
                    <div className="bg-gradient-to-r from-[#0D57A6] to-[#1565C0] shadow-sm sticky top-0 z-10 no-print">
                        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Logo className="h-10 w-10" />
                                <h1 className="text-lg font-bold text-white hidden sm:block">Administration KSLB</h1>
                            </div>
                        </div>
                    </div>
                    <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
                        <BilanSummaryViewer bilan={viewingBilan} onBack={() => setViewingBilan(null)} />
                    </main>
                </div>
            );
        }

        // Admin viewing PDF catalog
        if (view === 'pdfCatalog') {
            return (
                <div className="min-h-screen bg-slate-50">
                    <div className="bg-gradient-to-r from-[#0D57A6] to-[#1565C0] shadow-sm sticky top-0 z-10 no-print">
                        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('dashboard')}>
                                <Logo className="h-10 w-10" />
                                <h1 className="text-lg font-bold text-white hidden sm:block">Administration KSLB</h1>
                            </div>
                            <button
                                onClick={() => setView('dashboard')}
                                className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors"
                            >
                                Retour admin
                            </button>
                        </div>
                    </div>
                    <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
                        <Dashboard onBack={() => setView('dashboard')} />
                    </main>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-50">
                <div className="bg-gradient-to-r from-[#0D57A6] to-[#1565C0] shadow-sm sticky top-0 z-10 no-print">
                    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Logo className="h-10 w-10" />
                            <h1 className="text-lg font-bold text-white hidden sm:block">Administration KSLB</h1>
                        </div>
                    </div>
                </div>
                <AdminDashboard
                    onViewBilan={handleAdminViewBilan}
                    onLogout={handleAdminLogout}
                    onPdfCatalog={() => setView('pdfCatalog')}
                />
            </div>
        );
    }

    // ---- Patient mode ----
    if (!isAuthenticated) {
        return <LoginPage onAdminAccess={() => setMode('adminLogin')} />;
    }

    const handleViewSummary = (bilan: CompletedBilan) => {
        setViewingBilan(bilan);
        setView('viewBilan');
    };

    const patientInfo: PatientInfo = currentPatient ? {
        nom: currentPatient.account.nom,
        prenom: currentPatient.account.prenom,
        numeroSecuriteSociale: currentPatient.account.numeroSecuriteSociale,
        date: new Date().toLocaleDateString('fr-FR'),
    } : { nom: '', prenom: '', numeroSecuriteSociale: '', date: '' };

    const renderView = () => {
        switch (view) {
            case 'chat':
                return <WhatsAppChat onBack={() => setView('dashboard')} patientInfo={patientInfo} />;
            case 'viewBilan':
                return viewingBilan ? (
                    <BilanSummaryViewer bilan={viewingBilan} onBack={() => { setViewingBilan(null); setView('dashboard'); }} />
                ) : null;
            case 'bilan':
                return <QuestionnaireFlow onComplete={() => setView('dashboard')} />;
            case 'dashboard':
            default:
                return (
                    <PatientDashboard
                        onStartBilan={() => setView('bilan')}
                        onViewSummary={handleViewSummary}
                    />
                );
        }
    };

    return (
        <BilanProvider>
            <div className="min-h-screen bg-slate-50">
                {/* Top bar */}
                <div className="bg-white shadow-sm sticky top-0 z-10 no-print">
                    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('dashboard')}>
                            <Logo className="h-12 w-12" />
                            <h1 className="text-xl font-bold text-[#0D57A6] hidden sm:block">Questionnaires KSLB</h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setView(view === 'chat' ? 'dashboard' : 'chat')}
                                    className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                                        view === 'chat'
                                        ? 'bg-[#25D366] text-white'
                                        : 'bg-green-50 text-[#075E54] border border-green-200 hover:bg-green-100'
                                    }`}
                                >
                                    {view === 'chat' ? 'Quitter Chat' : 'Chat IA'}
                                </button>
                                {view !== 'dashboard' && view !== 'chat' && (
                                    <button
                                        onClick={() => setView('dashboard')}
                                        className="px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                                    >
                                        Mes bilans
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className={`${view === 'chat' ? 'max-w-none' : 'max-w-3xl'} mx-auto ${view === 'chat' ? 'py-0' : 'py-8'} px-4 sm:px-6`}>
                    {renderView()}
                </main>
            </div>
        </BilanProvider>
    );
}

// ==================== Root App ====================

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
