import React, { useState, useEffect } from 'react';
import { PatientInfo, Step } from './types';
import {
    MEDICAL_QUESTIONNAIRE
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

// ==================== #M12 — Empty form detection utility ====================

/** Returns true if the form data appears completely empty (all null / default values). */
function isFormDataEmpty(data: any): boolean {
    if (!data || typeof data !== 'object') return true;

    // PSFS: check if all activities have empty descriptions
    if (data.activities && Array.isArray(data.activities)) {
        return data.activities.every((a: any) => !a.description || a.description.trim() === '');
    }

    // CSI combined {partA, partB}
    if (data.partA && data.partB) {
        return isFormDataEmpty(data.partA) && isFormDataEmpty(data.partB);
    }

    // Medical answers: {value, details} per question
    const values = Object.values(data);
    if (values.length === 0) return true;

    return values.every((v: any) => {
        if (v === null || v === undefined) return true;
        if (typeof v === 'object' && v !== null) {
            // Medical: { value: null, details: '' }
            if ('value' in v && 'details' in v) return v.value === null;
            // IKDC function: empty object
            if (Object.keys(v).length === 0) return true;
            // CSI Part B: { diagnosed: null, year: '' }
            if ('diagnosed' in v) return v.diagnosed === null;
        }
        return false;
    });
}

// ==================== Questionnaire Flow ====================

function QuestionnaireFlow({ onComplete }: { onComplete: () => void }) {
    const { currentPatient } = useAuth();
    const {
        state, saveStatus, goToNextStep, goToPreviousStep, skipToSummary,
        saveAnswers, saveAnswersAndNext, saveMedicalAndNext,
        completeBilan, setStep, resetBilan,
    } = useBilan();

    const { currentStep, steps, answers } = state;

    // #M12 — Empty form validation warning
    const [emptyWarning, setEmptyWarning] = useState<{ formType: Step; data: any } | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setEmptyWarning(null); // clear warning on step change
    }, [currentStep]);

    /** Wraps saveAnswersAndNext to warn if form is empty */
    const validatedSaveAndNext = (formType: Step, data: any) => {
        if (isFormDataEmpty(data)) {
            setEmptyWarning({ formType, data });
            window.scrollTo(0, 0);
            return;
        }
        setEmptyWarning(null);
        saveAnswersAndNext(formType, data);
    };
    const confirmEmptyAdvance = () => {
        if (emptyWarning) {
            saveAnswersAndNext(emptyWarning.formType, emptyWarning.data);
            setEmptyWarning(null);
        }
    };
    const validatedMedicalAndNext = (data: any) => {
        if (isFormDataEmpty(data)) {
            setEmptyWarning({ formType: 'medical' as Step, data });
            window.scrollTo(0, 0);
            return;
        }
        setEmptyWarning(null);
        saveMedicalAndNext(data);
    };

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

    // Progress bar
    const currentStepIndex = steps.indexOf(currentStep);
    const totalSteps = steps.length;
    const progressPercent = totalSteps > 1 ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) : 0;
    const stepLabel = allStepDetails[currentStep]?.title || currentStep;

    const ProgressBar = () => (
        <div className="mb-4 no-print">
            {/* #M12 — Empty form validation warning */}
            {emptyWarning && (
                <div role="alert" className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-sm">
                    <p className="font-semibold">Aucune réponse n'a été saisie dans ce questionnaire.</p>
                    <p className="mt-1">Souhaitez-vous tout de même passer au suivant ?</p>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={confirmEmptyAdvance} className="px-3 py-1 text-xs font-semibold bg-amber-200 hover:bg-amber-300 rounded transition-colors">Oui, continuer</button>
                        <button type="button" onClick={() => setEmptyWarning(null)} className="px-3 py-1 text-xs font-semibold text-amber-700 hover:underline">Rester et compléter</button>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{stepLabel}</span>
                <div className="flex items-center gap-2">
                    {/* #M13 — Auto-save visual feedback */}
                    {saveStatus === 'saving' && <span className="text-amber-500 text-[10px] animate-pulse">Sauvegarde...</span>}
                    {saveStatus === 'saved' && <span className="text-green-600 text-[10px]">✓ Sauvegardé</span>}
                    {saveStatus === 'error' && <span className="text-red-500 text-[10px]">✗ Erreur sauvegarde</span>}
                    <span>{currentStepIndex + 1} / {totalSteps}</span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-[#1565C0] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );

    // PSFS dynamic
    if (currentStep.startsWith('psfs_')) {
        const zone = allStepDetails[currentStep]?.title || currentStep.replace('psfs_', '').replace(/_/g, ' ');
        const psfsKey = currentStep.replace('psfs_', '').replace(/_/g, ' ');
        return <>
            <ProgressBar />
            <PSFSForm
                key={currentStep}
                title={zone}
                initialAnswers={answers.psfs[psfsKey] || { activities: Array.from({ length: 5 }, () => ({ description: '', score: null })) }}
                onNext={(a) => { validatedSaveAndNext(currentStep, a); }}
                onPrevious={goToPreviousStep}
                onSkipToSummary={(a) => handleSkipToSummary(a, currentStep)}
                onSave={(a) => saveAnswers(currentStep, a)}
            />
        </>;
    }

    // Wrap each form with the progress bar (except summary)
    const wrapWithProgress = (form: React.ReactNode) => currentStep === 'summary' ? form : <><ProgressBar />{form}</>;

    switch (currentStep) {
        case 'medical':
            return wrapWithProgress(<MedicalForm title="Anamnèse" questionnaire={MEDICAL_QUESTIONNAIRE} initialAnswers={answers.medical} onNext={(a) => validatedMedicalAndNext(a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'medical')} onSave={(a) => saveAnswers('medical', a)} />);
        case 'had':
            return wrapWithProgress(<HADForm initialAnswers={answers.had} onNext={(a) => validatedSaveAndNext('had', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'had')} onSave={(a) => saveAnswers('had', a)} />);
        case 'fabq':
            return wrapWithProgress(<FABQForm initialAnswers={answers.fabq} onNext={(a) => validatedSaveAndNext('fabq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fabq')} onSave={(a) => saveAnswers('fabq', a)} />);
        case 'pcs':
            return wrapWithProgress(<PCSForm initialAnswers={answers.pcs} onNext={(a) => validatedSaveAndNext('pcs', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'pcs')} onSave={(a) => saveAnswers('pcs', a)} />);
        case 'csi':
            return wrapWithProgress(<CSIForm initialPartAAnswers={answers.csiPartA} initialPartBAnswers={answers.csiPartB} onNext={(partA, partB) => validatedSaveAndNext('csi', { partA, partB })} onPrevious={goToPreviousStep} onSkipToSummary={(partA, partB) => handleSkipToSummary({ partA, partB }, 'csi')} onSave={(partA, partB) => saveAnswers('csi', { partA, partB })} />);
        case 'oswestry':
            return wrapWithProgress(<OswestryForm initialAnswers={answers.oswestry} onNext={(a) => validatedSaveAndNext('oswestry', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oswestry')} onSave={(a) => saveAnswers('oswestry', a)} />);
        case 'quebec':
            return wrapWithProgress(<QuebecForm initialAnswers={answers.quebec} onNext={(a) => validatedSaveAndNext('quebec', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'quebec')} onSave={(a) => saveAnswers('quebec', a)} />);
        case 'rolandmorris':
            return wrapWithProgress(<RolandMorrisForm initialAnswers={answers.rolandMorris} onNext={(a) => validatedSaveAndNext('rolandmorris', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'rolandmorris')} onSave={(a) => saveAnswers('rolandmorris', a)} />);
        case 'ndi':
            return wrapWithProgress(<NDIForm initialAnswers={answers.ndi} onNext={(a) => validatedSaveAndNext('ndi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'ndi')} onSave={(a) => saveAnswers('ndi', a)} />);
        case 'northwick':
            return wrapWithProgress(<NorthwickParkForm initialAnswers={answers.northwick} onNext={(a) => validatedSaveAndNext('northwick', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'northwick')} onSave={(a) => saveAnswers('northwick', a)} />);
        case 'copenhagen':
            return wrapWithProgress(<CopenhagenForm initialAnswers={answers.copenhagen} onNext={(a) => validatedSaveAndNext('copenhagen', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'copenhagen')} onSave={(a) => saveAnswers('copenhagen', a)} />);
        case 'dash':
            return wrapWithProgress(<DASHForm initialAnswers={answers.dash} onNext={(a) => validatedSaveAndNext('dash', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'dash')} onSave={(a) => saveAnswers('dash', a)} />);
        case 'oss':
            return wrapWithProgress(<OSSForm initialAnswers={answers.oss} onNext={(a) => validatedSaveAndNext('oss', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oss')} onSave={(a) => saveAnswers('oss', a)} />);
        case 'spadi':
            return wrapWithProgress(<SPADIForm initialAnswers={answers.spadi} onNext={(a) => validatedSaveAndNext('spadi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'spadi')} onSave={(a) => saveAnswers('spadi', a)} />);
        case 'vas':
            return wrapWithProgress(<VASForm initialAnswers={answers.vas} onNext={(a) => validatedSaveAndNext('vas', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'vas')} onSave={(a) => saveAnswers('vas', a)} />);
        case 'oswestryThoracic':
            return wrapWithProgress(<OswestryThoracicForm initialAnswers={answers.oswestryThoracic} onNext={(a) => validatedSaveAndNext('oswestryThoracic', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oswestryThoracic')} onSave={(a) => saveAnswers('oswestryThoracic', a)} />);
        case 'ikdc':
            return wrapWithProgress(<IKDCForm initialAnswers={answers.ikdc} onNext={(a) => validatedSaveAndNext('ikdc', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'ikdc')} onSave={(a) => saveAnswers('ikdc', a)} />);
        case 'lysholm':
            return wrapWithProgress(<LysholmForm initialAnswers={answers.lysholm} onNext={(a) => validatedSaveAndNext('lysholm', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'lysholm')} onSave={(a) => saveAnswers('lysholm', a)} />);
        case 'koos':
            return wrapWithProgress(<KOOSForm initialAnswers={answers.koos} onNext={(a) => validatedSaveAndNext('koos', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'koos')} onSave={(a) => saveAnswers('koos', a)} />);
        case 'oes':
            return wrapWithProgress(<OESForm initialAnswers={answers.oes} onNext={(a) => validatedSaveAndNext('oes', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oes')} onSave={(a) => saveAnswers('oes', a)} />);
        case 'prtee':
            return wrapWithProgress(<PRTEEForm initialAnswers={answers.prtee} onNext={(a) => validatedSaveAndNext('prtee', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'prtee')} onSave={(a) => saveAnswers('prtee', a)} />);
        case 'prwe':
            return wrapWithProgress(<PRWEForm initialAnswers={answers.prwe} onNext={(a) => validatedSaveAndNext('prwe', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'prwe')} onSave={(a) => saveAnswers('prwe', a)} />);
        case 'mhq':
            return wrapWithProgress(<MHQForm initialAnswers={answers.mhq} onNext={(a) => validatedSaveAndNext('mhq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'mhq')} onSave={(a) => saveAnswers('mhq', a)} />);
        case 'hoosps':
            return wrapWithProgress(<HOOSPSForm initialAnswers={answers.hoosps} onNext={(a) => validatedSaveAndNext('hoosps', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'hoosps')} onSave={(a) => saveAnswers('hoosps', a)} />);
        case 'harriship':
            return wrapWithProgress(<HarrisHipScoreForm initialAnswers={answers.harrisHipScore} onNext={(a) => validatedSaveAndNext('harriship', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'harriship')} onSave={(a) => saveAnswers('harriship', a)} />);
        case 'oxfordhip':
            return wrapWithProgress(<OxfordHipScoreForm initialAnswers={answers.oxfordHipScore} onNext={(a) => validatedSaveAndNext('oxfordhip', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'oxfordhip')} onSave={(a) => saveAnswers('oxfordhip', a)} />);
        case 'hagos':
            return wrapWithProgress(<HAGOSForm initialAnswers={answers.hagos} onNext={(a) => validatedSaveAndNext('hagos', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'hagos')} onSave={(a) => saveAnswers('hagos', a)} />);
        case 'pfdi':
            return wrapWithProgress(<PFDIForm initialAnswers={answers.pfdi} onNext={(a) => validatedSaveAndNext('pfdi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'pfdi')} onSave={(a) => saveAnswers('pfdi', a)} />);
        case 'iciq':
            return wrapWithProgress(<ICIQForm initialAnswers={answers.iciq} onNext={(a) => validatedSaveAndNext('iciq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'iciq')} onSave={(a) => saveAnswers('iciq', a)} />);
        case 'aofas':
            return wrapWithProgress(<AOFASForm initialAnswers={answers.aofas} onNext={(a) => validatedSaveAndNext('aofas', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'aofas')} onSave={(a) => saveAnswers('aofas', a)} />);
        case 'fadi':
            return wrapWithProgress(<FADIForm initialAnswers={answers.fadi} onNext={(a) => validatedSaveAndNext('fadi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fadi')} onSave={(a) => saveAnswers('fadi', a)} />);
        case 'ffir':
            return wrapWithProgress(<FFIRForm initialAnswers={answers.ffir} onNext={(a) => validatedSaveAndNext('ffir', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'ffir')} onSave={(a) => saveAnswers('ffir', a)} />);
        case 'fogq':
            return wrapWithProgress(<FOGQForm initialAnswers={answers.fogq} onNext={(a) => validatedSaveAndNext('fogq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fogq')} onSave={(a) => saveAnswers('fogq', a)} />);
        case 'fes':
            return wrapWithProgress(<FESForm initialAnswers={answers.fes} onNext={(a) => validatedSaveAndNext('fes', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fes')} onSave={(a) => saveAnswers('fes', a)} />);
        case 'fesi':
            return wrapWithProgress(<FESIForm initialAnswers={answers.fesi} onNext={(a) => validatedSaveAndNext('fesi', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'fesi')} onSave={(a) => saveAnswers('fesi', a)} />);
        case 'berg':
            return wrapWithProgress(<BergForm initialAnswers={answers.berg} onNext={(a) => validatedSaveAndNext('berg', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'berg')} onSave={(a) => saveAnswers('berg', a)} />);
        case 'lefs':
            return wrapWithProgress(<LEFSForm initialAnswers={answers.lefs} onNext={(a) => validatedSaveAndNext('lefs', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'lefs')} onSave={(a) => saveAnswers('lefs', a)} />);
        case 'jfls':
            return wrapWithProgress(<JFLSForm initialAnswers={answers.jfls} onNext={(a) => validatedSaveAndNext('jfls', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'jfls')} onSave={(a) => saveAnswers('jfls', a)} />);
        case 'tmd':
            return wrapWithProgress(<TMDForm initialAnswers={answers.tmd} onNext={(a) => validatedSaveAndNext('tmd', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'tmd')} onSave={(a) => saveAnswers('tmd', a)} />);
        case 'wpai':
            return wrapWithProgress(<WPAIForm initialAnswers={answers.wpai} onNext={(a) => validatedSaveAndNext('wpai', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'wpai')} onSave={(a) => saveAnswers('wpai', a)} />);
        case 'mmrc':
            return wrapWithProgress(<MMRCForm initialAnswers={answers.mmrc} onNext={(a) => validatedSaveAndNext('mmrc', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'mmrc')} onSave={(a) => saveAnswers('mmrc', a)} />);
        case 'sgrq':
            return wrapWithProgress(<SGRQForm initialAnswers={answers.sgrq} onNext={(a) => validatedSaveAndNext('sgrq', a)} onPrevious={goToPreviousStep} onSkipToSummary={(a) => handleSkipToSummary(a, 'sgrq')} onSave={(a) => saveAnswers('sgrq', a)} />);
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
            // #C10 — Prevent blank screen on unknown step
            return (
                <div className="max-w-2xl mx-auto text-center py-16 px-4">
                    <p className="text-red-600 font-semibold mb-4">Étape inconnue : "{currentStep}"</p>
                    <button
                        onClick={() => setStep(steps[0] || 'medical')}
                        className="px-6 py-3 bg-[#1565C0] text-white font-bold rounded-xl hover:bg-[#0D57A6] transition-colors"
                    >
                        Retourner au début
                    </button>
                </div>
            );
    }
}

// ==================== Read-only Summary Viewer ====================

function BilanSummaryViewer({ bilan, onBack }: { bilan: CompletedBilan; onBack: () => void }) {
    const a = bilan.answers;
    return (
        <div>
            <div className="mb-4 no-print">
                <button onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors">
                    Retour à l'historique
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
                readOnly={true}
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
                        {isSetup ? 'Créer le compte administrateur' : 'Connexion administrateur'}
                    </p>
                </div>

                {error && (
                    <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div>
                        <label htmlFor="admin-username" className={labelClass}>Nom d'utilisateur</label>
                        <input
                            id="admin-username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={inputClass}
                            placeholder="admin"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className={labelClass}>Mot de passe</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={inputClass}
                            placeholder="8 caractères (majuscule, minuscule, chiffre)"
                            autoComplete={isSetup ? 'new-password' : 'current-password'}
                        />
                    </div>
                    {isSetup && (
                        <div>
                            <label htmlFor="admin-password-confirm" className={labelClass}>Confirmer le mot de passe</label>
                            <input
                                id="admin-password-confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={e => setPasswordConfirm(e.target.value)}
                                className={inputClass}
                                placeholder="Confirmer"
                                autoComplete="new-password"
                            />
                            {password.length >= 8 && passwordConfirm.length >= 8 && password !== passwordConfirm && (
                                <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas.</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-3 text-base font-semibold text-white bg-[#0D57A6] rounded-lg shadow-sm hover:bg-[#0a4785] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D57A6] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Connexion...' : isSetup ? 'Créer le compte admin' : 'Se connecter'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        <button type="button" onClick={onBack} className="text-[#1565C0] font-semibold hover:underline">
                            Retour à l'espace patient
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
        // DEV_BYPASS: ?dev=admin skips admin login
        if (import.meta.env.DEV) {
            const devMode = new URLSearchParams(window.location.search).get('dev');
            if (devMode === 'admin') return 'admin';
        }
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
        const isDevAdmin = import.meta.env.DEV && new URLSearchParams(window.location.search).get('dev') === 'admin';
        const admin = AdminAuth.getCurrentAdmin();
        if (!admin && !isDevAdmin) {
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
                        onStartBilan={() => setView('chat')}
                        onStartClassicBilan={() => setView('bilan')}
                        onViewSummary={handleViewSummary}
                    />
                );
        }
    };

    return (
        <BilanProvider>
            <div className="min-h-screen bg-slate-50">
                {/* Top bar — #P4 mobile-optimized */}
                <div className="bg-white shadow-sm sticky top-0 z-10 no-print safe-top">
                    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 cursor-pointer min-w-0" onClick={() => setView('dashboard')}>
                            <Logo className="h-9 w-9 sm:h-12 sm:w-12 flex-shrink-0" />
                            <h1 className="text-lg sm:text-xl font-bold text-[#0D57A6] hidden sm:block truncate">Questionnaires KSLB</h1>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <button
                                onClick={() => setView(view === 'chat' ? 'dashboard' : 'chat')}
                                className={`px-2.5 sm:px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    view === 'chat'
                                    ? 'bg-[#25D366] text-white'
                                    : 'bg-green-50 text-[#075E54] border border-green-200 hover:bg-green-100'
                                }`}
                            >
                                <span className="sm:hidden">{view === 'chat' ? '✕' : '💬'}</span>
                                <span className="hidden sm:inline">{view === 'chat' ? 'Quitter Chat' : 'Chat IA'}</span>
                            </button>
                            {view !== 'dashboard' && view !== 'chat' && (
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="px-2.5 sm:px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all whitespace-nowrap"
                                    title="Mes bilans"
                                >
                                    <span className="sm:hidden">📋</span>
                                    <span className="hidden sm:inline">Mes bilans</span>
                                </button>
                            )}
                            <button
                                onClick={logout}
                                className="px-2.5 sm:px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                                title="Se déconnecter"
                            >
                                <span className="sm:hidden">⏻</span>
                                <span className="hidden sm:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className={`${view === 'chat' ? 'max-w-none' : 'max-w-3xl'} mx-auto ${view === 'chat' ? 'py-0' : 'py-4 sm:py-8'} px-3 sm:px-6`}>
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
