import React, { useState, useMemo } from 'react';
import { PatientRecord, CompletedBilan } from '../storageTypes';
import * as StorageService from '../services/storage';
import * as AdminAuth from '../services/adminAuth';
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
    MEDICAL_QUESTIONNAIRE_MOTIF_SYMPTOMES,
    MEDICAL_QUESTIONNAIRE_ANTECEDENTS_MEDICAUX,
    MEDICAL_QUESTIONNAIRE_CONTEXTE_VIE,
} from '../constants';
import Logo from './Logo';

interface AdminDashboardProps {
    onViewBilan: (bilan: CompletedBilan) => void;
    onLogout: () => void;
    onPdfCatalog: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewBilan, onLogout, onPdfCatalog }) => {
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [expandedBilanId, setExpandedBilanId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const patients = useMemo(() => StorageService.getPatients(), []);

    const filteredPatients = useMemo(() => {
        if (!searchQuery.trim()) return patients;
        const q = searchQuery.toLowerCase();
        return patients.filter(p =>
            p.account.nom.toLowerCase().includes(q) ||
            p.account.prenom.toLowerCase().includes(q) ||
            p.account.numeroSecuriteSociale.includes(q)
        );
    }, [patients, searchQuery]);

    const selectedPatient = useMemo(() => {
        if (!selectedPatientId) return null;
        return patients.find(p => p.account.id === selectedPatientId) || null;
    }, [patients, selectedPatientId]);

    const selectedBilans = useMemo(() => {
        if (!selectedPatient) return [];
        return [...selectedPatient.completedBilans].sort(
            (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
    }, [selectedPatient]);

    const storageUsage = useMemo(() => StorageService.getStorageUsage(), []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

    const formatDateShort = (iso: string) =>
        new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleExportText = (bilan: CompletedBilan) => {
        const a = bilan.answers;
        const pi = bilan.patientInfo;
        const steps = bilan.visibleSteps.filter(s => s !== 'summary');
        let text = `BILAN KSLB - ${pi.prenom} ${pi.nom}\n`;
        text += `Date: ${new Date(bilan.completedAt).toLocaleDateString('fr-FR')}\n`;
        text += `${'='.repeat(50)}\n\n`;

        const stepTextMap: Record<string, () => string> = {
            medical1: () => generateMedicalText(a.medical, pi, MEDICAL_QUESTIONNAIRE_MOTIF_SYMPTOMES),
            medical2: () => generateMedicalText(a.medical, pi, MEDICAL_QUESTIONNAIRE_ANTECEDENTS_MEDICAUX),
            medical3: () => generateMedicalText(a.medical, pi, MEDICAL_QUESTIONNAIRE_CONTEXTE_VIE),
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

    const handleExportAllPatients = () => {
        const allData = patients.map(p => {
            const { pinHash, ...accountSafe } = p.account;
            return { account: accountSafe, completedBilans: p.completedBilans };
        });
        const data = JSON.stringify(allData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `KSLB_export_complet_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalBilans = patients.reduce((sum, p) => sum + p.completedBilans.length, 0);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D57A6] to-[#1565C0] p-6 rounded-2xl shadow-sm text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Logo className="h-10 w-10" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Administration KSLB</h2>
                            <p className="text-blue-100 text-sm">
                                {patients.length} patient{patients.length !== 1 ? 's' : ''} - {totalBilans} bilan{totalBilans !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onPdfCatalog}
                            className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors"
                        >
                            Catalogue PDF
                        </button>
                        <button
                            onClick={handleExportAllPatients}
                            className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors"
                        >
                            Exporter tout
                        </button>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors"
                        >
                            Deconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-3xl font-bold text-[#0D57A6]">{patients.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Patient{patients.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-3xl font-bold text-green-600">{totalBilans}</p>
                    <p className="text-xs text-gray-500 mt-1">Bilan{totalBilans !== 1 ? 's' : ''} termines</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-3xl font-bold text-amber-600">{storageUsage.percentage}%</p>
                    <p className="text-xs text-gray-500 mt-1">Stockage ({storageUsage.usedKB} KB)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient list */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-3">Patients</h3>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87] outline-none"
                            />
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            {filteredPatients.length === 0 ? (
                                <p className="p-4 text-gray-400 text-sm text-center">Aucun patient</p>
                            ) : (
                                filteredPatients.map(p => (
                                    <div
                                        key={p.account.id}
                                        onClick={() => { setSelectedPatientId(p.account.id); setExpandedBilanId(null); }}
                                        className={`p-3 cursor-pointer border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                                            selectedPatientId === p.account.id ? 'bg-blue-50 border-l-4 border-l-[#0D57A6]' : ''
                                        }`}
                                    >
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {p.account.nom.toUpperCase()} {p.account.prenom}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {p.completedBilans.length} bilan{p.completedBilans.length !== 1 ? 's' : ''}
                                            {p.inProgress ? ' + 1 en cours' : ''}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Inscrit le {formatDateShort(p.account.createdAt)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Patient detail */}
                <div className="md:col-span-2">
                    {!selectedPatient ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-gray-400 text-sm">Selectionnez un patient pour voir ses bilans</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Patient info card */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0D57A6]">
                                            {selectedPatient.account.prenom} {selectedPatient.account.nom.toUpperCase()}
                                        </h3>
                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                            <p>Date de naissance : {new Date(selectedPatient.account.dateNaissance).toLocaleDateString('fr-FR')}</p>
                                            <p>N° Secu : {selectedPatient.account.numeroSecuriteSociale.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3 $4 $5 $6 $7')}</p>
                                            <p>Inscrit le {formatDate(selectedPatient.account.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        selectedPatient.inProgress
                                        ? 'bg-amber-100 text-amber-700'
                                        : selectedPatient.completedBilans.length > 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {selectedPatient.inProgress
                                            ? 'Bilan en cours'
                                            : `${selectedPatient.completedBilans.length} bilan${selectedPatient.completedBilans.length !== 1 ? 's' : ''}`
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* In-progress notice */}
                            {selectedPatient.inProgress && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                    <p className="text-sm font-semibold text-amber-800">Bilan en cours</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Derniere modification : {formatDate(selectedPatient.inProgress.lastSavedAt)}
                                    </p>
                                    <p className="text-xs text-amber-600 mt-0.5">
                                        Etape : {selectedPatient.inProgress.currentStep} ({selectedPatient.inProgress.steps.indexOf(selectedPatient.inProgress.currentStep) + 1}/{selectedPatient.inProgress.steps.length})
                                    </p>
                                </div>
                            )}

                            {/* Bilans list */}
                            <div>
                                <h4 className="font-bold text-gray-800 mb-3">
                                    Bilans termines ({selectedBilans.length})
                                </h4>
                                {selectedBilans.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                                        <p className="text-gray-400 text-sm">Aucun bilan termine</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedBilans.map(bilan => {
                                            const isExpanded = expandedBilanId === bilan.id;
                                            const stepCount = bilan.visibleSteps.filter(s => s !== 'summary').length;
                                            return (
                                                <div key={bilan.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                                    <div
                                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                                                        onClick={() => setExpandedBilanId(isExpanded ? null : bilan.id)}
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">
                                                                {formatDate(bilan.completedAt)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {stepCount} questionnaire{stepCount !== 1 ? 's' : ''}
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
                                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                                {bilan.visibleSteps.filter(s => s !== 'summary').map(step => (
                                                                    <span key={step} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase">
                                                                        {step}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => onViewBilan(bilan)}
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
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
