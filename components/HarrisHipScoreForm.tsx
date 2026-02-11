
import React, { useState, useCallback } from 'react';
import { HarrisHipScoreAnswers } from '../types';

interface HarrisHipScoreFormProps {
    initialAnswers: HarrisHipScoreAnswers;
    onNext: (answers: HarrisHipScoreAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: HarrisHipScoreAnswers) => void;
    onSave: (answers: HarrisHipScoreAnswers) => void;
}

const RadioSection: React.FC<{ title: string; name: keyof HarrisHipScoreAnswers; options: { label: string; value: number }[]; value: number | null; onChange: (name: keyof HarrisHipScoreAnswers, value: number) => void }> = ({ title, name, options, value, onChange }) => (
    <section className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">{title}</h3>
        <div className="space-y-3">
            {options.map(opt => (
                <div key={opt.value} className="flex items-center">
                    <input type="radio" id={`${name}-${opt.value}`} name={name} checked={value === opt.value} onChange={() => onChange(name, opt.value)} className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                    <label htmlFor={`${name}-${opt.value}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">{opt.label}</label>
                </div>
            ))}
        </div>
    </section>
);


const HarrisHipScoreForm: React.FC<HarrisHipScoreFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<HarrisHipScoreAnswers>(initialAnswers);

    const handleChange = useCallback((name: keyof HarrisHipScoreAnswers, value: number) => {
        setAnswers(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleDeformityChange = useCallback((name: keyof HarrisHipScoreAnswers['deformity']) => {
        setAnswers(prev => ({ ...prev, deformity: { ...prev.deformity, [name]: !prev.deformity[name] }}));
    }, []);

    const handleRomChange = useCallback((name: keyof HarrisHipScoreAnswers['rom'], value: string) => {
        setAnswers(prev => ({ ...prev, rom: { ...prev.rom, [name]: value }}));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4"><h2 className="text-xl font-bold text-gray-900">Harris Hip Score</h2></header>
            
            <RadioSection title="Douleur" name="pain" options={[ { label: 'Aucune ou l’ignore (44)', value: 44 }, { label: 'Légère, occasionnelle, pas de compromis dans les activités (40)', value: 40 }, { label: 'Douleur légère, pas d’effet sur les activités moyennes, douleur modérée rare avec une activité inhabituelle; peut prendre de l’aspirine (30)', value: 30 }, { label: 'Douleur modérée, tolérable mais fait des concessions à la douleur. Limitation de l’activité ordinaire ou du travail. Peut nécessiter occasionnellement un médicament plus fort que l’aspirine (20)', value: 20 }, { label: 'Douleur marquée, limitation sérieuse des activités (10)', value: 10 }, { label: 'Totalement handicapé, invalide, douleur au lit, grabataire (0)', value: 0 }, ]} value={answers.pain} onChange={handleChange} />
            <RadioSection title="Boiterie" name="limp" options={[ { label: 'Aucune (11)', value: 11 }, { label: 'Légère (8)', value: 8 }, { label: 'Modérée (5)', value: 5 }, { label: 'Sévère (0)', value: 0 } ]} value={answers.limp} onChange={handleChange} />
            <RadioSection title="Support" name="support" options={[ { label: 'Aucun (11)', value: 11 }, { label: 'Canne pour les longues marches (7)', value: 7 }, { label: 'Canne la plupart du temps (5)', value: 5 }, { label: 'Une béquille (3)', value: 3 }, { label: 'Deux cannes (2)', value: 2 }, { label: 'Deux béquilles ou incapable de marcher (0)', value: 0 } ]} value={answers.support} onChange={handleChange} />
            <RadioSection title="Distance de marche" name="distance" options={[ { label: 'Illimitée (11)', value: 11 }, { label: 'Six pâtés de maisons (8)', value: 8 }, { label: 'Deux ou trois pâtés de maisons (5)', value: 5 }, { label: 'Uniquement à l’intérieur (2)', value: 2 }, { label: 'Au lit et en fauteuil (0)', value: 0 } ]} value={answers.distance} onChange={handleChange} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RadioSection title="Escaliers" name="stairs" options={[ { label: 'Normalement sans utiliser la rampe (4)', value: 4 }, { label: 'Normalement en utilisant la rampe (2)', value: 2 }, { label: 'De n’importe quelle manière (1)', value: 1 }, { label: 'Incapable de monter les escaliers (0)', value: 0 } ]} value={answers.stairs} onChange={handleChange} />
                <RadioSection title="Mettre chaussures et chaussettes" name="shoes" options={[ { label: 'Avec facilité (4)', value: 4 }, { label: 'Avec difficulté (2)', value: 2 }, { label: 'Incapable (0)', value: 0 } ]} value={answers.shoes} onChange={handleChange} />
                <RadioSection title="Position assise" name="sitting" options={[ { label: 'Confortablement dans un fauteuil ordinaire pendant une heure (5)', value: 5 }, { label: 'Sur une chaise haute pendant 30 minutes (3)', value: 3 }, { label: 'Incapable de s’asseoir confortablement dans n’importe quel fauteuil (0)', value: 0 } ]} value={answers.sitting} onChange={handleChange} />
                <RadioSection title="Transport public" name="transport" options={[ { label: 'Oui (1)', value: 1 }, { label: 'Non (0)', value: 0 } ]} value={answers.transport} onChange={handleChange} />
            </div>

            <section className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">Absence de Déformation (4 points si tout est 'Oui')</h3>
                <div className="space-y-3">
                    {[ { key: 'flexion', label: 'Moins de 30° de flexion fixe' }, { key: 'abduction', label: 'Moins de 10° d’abduction fixe' }, { key: 'internalRotation', label: 'Moins de 10° de rotation interne fixe en extension' }, { key: 'limbLength', label: 'Inégalité de longueur des membres de moins de 3,2 cm' } ].map(item => (
                        <div key={item.key} className="flex items-center">
                            <input type="checkbox" id={`deformity-${item.key}`} checked={answers.deformity[item.key as keyof typeof answers.deformity]} onChange={() => handleDeformityChange(item.key as keyof typeof answers.deformity)} className="h-4 w-4 text-blue-800 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor={`deformity-${item.key}`} className="ml-3 text-sm text-gray-700">{item.label}</label>
                        </div>
                    ))}
                </div>
            </section>

             <section className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">Amplitude de mouvement (entrez les degrés)</h3>
                 <div className="space-y-3">
                    {[ { key: 'flexion', label: 'Flexion (*140°)' }, { key: 'abduction', label: 'Abduction (*40°)' }, { key: 'adduction', label: 'Adduction (*40°)' }, { key: 'externalRotation', label: 'Rotation externe (*40°)' }, { key: 'internalRotation', label: 'Rotation interne (*40°)' } ].map(item => (
                        <div key={item.key} className="grid grid-cols-2 items-center">
                            <label htmlFor={`rom-${item.key}`} className="text-sm text-gray-700">{item.label}:</label>
                            <input type="number" id={`rom-${item.key}`} value={answers.rom[item.key as keyof typeof answers.rom]} onChange={(e) => handleRomChange(item.key as keyof typeof answers.rom, e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-md" placeholder="degrés" />
                        </div>
                    ))}
                </div>
            </section>

            <footer className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                >
                    Précédent
                </button>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-end gap-4">
                    <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100">Enregistrer</button>
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300">Passer</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default HarrisHipScoreForm;
