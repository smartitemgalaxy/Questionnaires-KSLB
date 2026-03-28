import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBilan } from '../contexts/BilanContext';
import { CompletedBilan } from '../storageTypes';
import * as StorageService from '../services/storage';
import {
    generateFabqText, generatePcsText, generateCsiText, generateMedicalText,
    generateOswestryText, generateQuebecText, generateRolandMorrisText,
    generateNdiText, generateNorthwickParkText, generateCopenhagenText,
    generateDashText, generateOssText, generateSpadiText, generateVasText,
    generateOswestryThoracicText, generateIkdcText, generateLysholmText,
    generateKoosText, generateOesText, generatePrteeText, generatePrweText,
    generateMhqText, generateHoospsText, generateHarrisHipScoreText,
    generateOxfordHipScoreText, generateHagosText, generatePfdiText,
    generateIciqText, generateAofasText, generateFadiText, generateFfirText,
    generateFogqText, generateFesText, generateFesiText, generateBergText,
    generateLefsText, generateJflsText, generateTmdText, generateWpaiText,
    generateObjectifsText, generateAmplitudesText, generateMmrcText,
    generateSgrqText, generatePsfsText, generateHadText,
    downloadTextFile
} from '../utils';
import {
    MEDICAL_QUESTIONNAIRE,
} from '../constants';
import Logo from './Logo';

interface PatientDashboardProps {
    onStartBilan: () => void;
    onStartClassicBilan?: () => void;
    onViewSummary: (bilan: CompletedBilan) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onStartBilan, onStartClassicBilan, onViewSummary }) => {
    const { currentPatient, logout, refreshPatient } = useAuth();
    const { state: bilanState, resumeBilan, resetBilan, startNewBilan } = useBilan();
    const [expandedBilanId, setExpandedBilanId] = useState<string | null>(null);

    const account = currentPatient?.account;
    const inProgress = currentPatient?.inProgress;
    const bilans = useMemo(() =>
        [...(currentPatient?.completedBilans || [])].sort((a, b) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        ),
        [currentPatient?.completedBilans]
    );

    const storageUsage = useMemo(() => StorageService.getStorageUsage(), [bilans.length]);

    // #M08, M17, M30 — Replace confirm() with modal
    const [confirmModal, setConfirmModal] = useState<{
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const showConfirm = (message: string, onConfirm: () => void) => {
        setConfirmModal({ message, onConfirm });
    };

    const handleResume = () => {
        if (inProgress) {
            resumeBilan(inProgress);
            onStartBilan();
        }
    };

    const handleAbandon = () => {
        showConfirm('Abandonner le bilan en cours ? Les données non terminées seront perdues.', () => {
            resetBilan();
            refreshPatient();
            setConfirmModal(null);
        });
    };

    const handleNewBilan = () => {
        if (inProgress) {
            showConfirm('Vous avez un bilan en cours. L\'abandonner pour en commencer un nouveau ?', () => {
                resetBilan();
                startNewBilan();
                onStartBilan();
                setConfirmModal(null);
            });
            return;
        }
        startNewBilan();
        onStartBilan();
    };

    const handleExportText = (bilan: CompletedBilan) => {
        try {
            const a = bilan.answers;
            const pi = bilan.patientInfo;
            const steps = bilan.visibleSteps.filter(s => s !== 'summary');
            let text = `BILAN KSLB - ${pi.prenom} ${pi.nom}\n`;
            text += `Date: ${new Date(bilan.completedAt).toLocaleDateString('fr-FR')}\n`;
            text += `${'='.repeat(50)}\n\n`;

            const stepTextMap: Record<string, () => string> = {
                medical: () => generateMedicalText(a.medical, pi, MEDICAL_QUESTIONNAIRE),
                objectifs: () => generateObjectifsText(a.objectifs, pi),
                had: () => generateHadText(a.had, pi),
                amplitudes: () => generateAmplitudesText(a.amplitudes, pi),
                oswestry: () => generateOswestryText(a.oswestry, pi),
                quebec: () => generateQuebecText(a.quebec, pi),
                rolandmorris: () => generateRolandMorrisText(a.rolandMorris, pi),
                ndi: () => generateNdiText(a.ndi, pi),
                northwick: () => generateNorthwickParkText(a.northwick, pi),
                copenhagen: () => generateCopenhagenText(a.copenhagen, pi),
                dash: () => generateDashText(a.dash, pi),
                oss: () => generateOssText(a.oss, pi),
                spadi: () => generateSpadiText(a.spadi, pi),
                oes: () => generateOesText(a.oes, pi),
                prtee: () => generatePrteeText(a.prtee, pi),
                prwe: () => generatePrweText(a.prwe, pi),
                mhq: () => generateMhqText(a.mhq, pi),
                vas: () => generateVasText(a.vas, pi),
                oswestryThoracic: () => generateOswestryThoracicText(a.oswestryThoracic, pi),
                ikdc: () => generateIkdcText(a.ikdc, pi),
                lysholm: () => generateLysholmText(a.lysholm, pi),
                koos: () => generateKoosText(a.koos, pi),
                hoosps: () => generateHoospsText(a.hoosps, pi),
                harriship: () => generateHarrisHipScoreText(a.harrisHipScore, pi),
                oxfordhip: () => generateOxfordHipScoreText(a.oxfordHipScore, pi),
                hagos: () => generateHagosText(a.hagos, pi),
                pfdi: () => generatePfdiText(a.pfdi, pi),
                iciq: () => generateIciqText(a.iciq, pi),
                aofas: () => generateAofasText(a.aofas, pi),
                fadi: () => generateFadiText(a.fadi, pi),
                ffir: () => generateFfirText(a.ffir, pi),
                fogq: () => generateFogqText(a.fogq, pi),
                fes: () => generateFesText(a.fes, pi),
                fesi: () => generateFesiText(a.fesi, pi),
                berg: () => generateBergText(a.berg, pi),
                lefs: () => generateLefsText(a.lefs, pi),
                jfls: () => generateJflsText(a.jfls, pi),
                tmd: () => generateTmdText(a.tmd, pi),
                wpai: () => generateWpaiText(a.wpai, pi),
                fabq: () => generateFabqText(a.fabq, pi),
                pcs: () => generatePcsText(a.pcs, pi),
                csi: () => generateCsiText(a.csiPartA, a.csiPartB, pi),
                mmrc: () => generateMmrcText(a.mmrc, pi),
                sgrq: () => generateSgrqText(a.sgrq, pi),
            };

            for (const step of steps) {
                if (stepTextMap[step]) {
                    text += stepTextMap[step]() + '\n\n';
                } else if (step.startsWith('psfs_') && a.psfs) {
                    const zone = step.replace('psfs_', '');
                    if (a.psfs[zone]) {
                        text += generatePsfsText(a.psfs[zone], pi, zone) + '\n\n';
                    }
                }
            }

            const filename = `Bilan_${pi.nom}_${pi.prenom}_${new Date(bilan.completedAt).toISOString().slice(0, 10)}.txt`;
            downloadTextFile(text, filename);
        } catch (err) {
            alert('Erreur lors de l\'export. Veuillez reessayer.');
            console.error(err);
        }
    };

    const handleExportJSON = (bilan: CompletedBilan) => {
        const data = JSON.stringify(bilan, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Bilan_${bilan.patientInfo.nom}_${new Date(bilan.completedAt).toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportAll = () => {
        if (!currentPatient) return;
        const data = StorageService.exportPatientDataAsJSON(currentPatient.account.id);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Donnees_${account?.nom}_${account?.prenom}_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteBilan = (bilanId: string) => {
        if (!currentPatient) return;
        showConfirm('Supprimer ce bilan ? Cette action est irréversible.', () => {
            StorageService.deleteCompletedBilan(currentPatient.account.id, bilanId);
            refreshPatient();
            setConfirmModal(null);
        });
    };

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getStepCount = (bilan: CompletedBilan) => {
        return bilan.visibleSteps.filter(s => s !== 'summary').length;
    };

    if (!account) return null;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            {/* Header — #M29 responsive on mobile */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Logo className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0" />
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-[#0D57A6]">
                                Bienvenue, {account.prenom}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500">{bilans.length} bilan{bilans.length !== 1 ? 's' : ''} enregistré{bilans.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleNewBilan}
                            className="flex-1 min-w-[120px] sm:flex-none px-4 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#20bd5a] active:scale-95 transition-all"
                        >
                            Nouveau bilan
                        </button>
                        {onStartClassicBilan && (
                            <button
                                onClick={onStartClassicBilan}
                                className="flex-1 min-w-[120px] sm:flex-none px-4 py-2.5 bg-blue-50 text-[#0D57A6] text-sm font-medium rounded-xl border border-blue-200 hover:bg-blue-100 active:scale-95 transition-all"
                            >
                                Questionnaires
                            </button>
                        )}
                        <button
                            onClick={logout}
                            className="flex-1 min-w-[100px] sm:flex-none px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* In-progress banner — #M29 responsive */}
            {inProgress && (
                <div className="bg-amber-50 border-2 border-amber-200 p-4 sm:p-5 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-amber-800">Bilan en cours</h3>
                            <p className="text-sm text-amber-700 mt-1">
                                Dernière modification : {formatDate(inProgress.lastSavedAt)}
                            </p>
                            <p className="text-xs text-amber-600 mt-0.5">
                                Étape actuelle : {inProgress.currentStep} ({inProgress.steps.indexOf(inProgress.currentStep)}/{inProgress.steps.length - 1})
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleResume}
                                className="flex-1 sm:flex-none px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 transition-colors"
                            >
                                Reprendre
                            </button>
                            <button
                                onClick={handleAbandon}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white text-amber-700 text-sm font-bold rounded-xl border border-amber-300 hover:bg-amber-50 transition-colors"
                            >
                                Abandonner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bilan history */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Historique des bilans</h3>
                {bilans.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                        <p className="text-gray-400 text-sm">Aucun bilan termine pour le moment.</p>
                        <button
                            onClick={handleNewBilan}
                            className="mt-4 px-6 py-2 bg-[#1565C0] text-white text-sm font-bold rounded-xl hover:bg-[#0D57A6] transition-colors"
                        >
                            Commencer mon premier bilan
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bilans.map(bilan => {
                            const isExpanded = expandedBilanId === bilan.id;
                            return (
                                <div key={bilan.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                                        onClick={() => setExpandedBilanId(isExpanded ? null : bilan.id)}
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {formatDate(bilan.completedAt)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {getStepCount(bilan)} questionnaire{getStepCount(bilan) !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {bilan.visibleSteps.filter(s => s !== 'summary').map(step => (
                                                    <span key={step} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase">
                                                        {step}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => onViewSummary(bilan)}
                                                    className="px-3 py-2 bg-[#1565C0] text-white text-xs font-bold rounded-lg hover:bg-[#0D57A6] transition-colors"
                                                >
                                                    Voir le resume
                                                </button>
                                                <button
                                                    onClick={() => handleExportText(bilan)}
                                                    className="px-3 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                                                >
                                                    Exporter .txt
                                                </button>
                                                <button
                                                    onClick={() => handleExportJSON(bilan)}
                                                    className="px-3 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                                                >
                                                    Exporter .json
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBilan(bilan.id)}
                                                    className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer — #M29 responsive */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-500">
                        Stockage : {storageUsage.usedKB} KB utilises ({storageUsage.percentage}%)
                    </p>
                    {storageUsage.percentage > 80 && (
                        <p className="text-xs text-amber-600 font-semibold mt-1">
                            Espace de stockage bientot plein. Pensez a exporter vos donnees.
                        </p>
                    )}
                </div>
                <button
                    onClick={handleExportAll}
                    className="w-full sm:w-auto px-3 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Exporter toutes mes donnees
                </button>
            </div>

            {/* Confirmation modal (#M08, M17, M30) */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 id="confirm-modal-title" className="text-lg font-bold text-gray-800 mb-3">Confirmation</h3>
                        <p className="text-sm text-gray-600 mb-5">{confirmModal.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
