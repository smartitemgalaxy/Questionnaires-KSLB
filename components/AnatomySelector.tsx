import React, { useState, useEffect } from 'react';
import { ANATOMY_HIERARCHY } from '../constants';
import type { AnatomyNode, AnatomySelection } from '../types';

interface AnatomySelectorProps {
    value: AnatomySelection | null;
    onChange: (value: AnatomySelection) => void;
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const AnatomySelector: React.FC<AnatomySelectorProps> = ({ value, onChange }) => {
    const currentSelection = value ?? { selected: [], autre_descriptions: [''] };
    
    useEffect(() => {
        // Ensure there's always at least one empty 'autre' field if none are filled
        const anies = currentSelection.autre_descriptions || [];
        const hasText = anies.some(d => d.trim() !== '');
        if (!hasText && anies.length > 1) {
            onChange({ ...currentSelection, autre_descriptions: [''] });
        } else if (hasText && anies[anies.length - 1].trim() !== '') {
             onChange({ ...currentSelection, autre_descriptions: [...anies, ''] });
        }
    }, [currentSelection.autre_descriptions]);

    
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleMainCategoryClick = (categoryName: string) => {
        setActiveCategory(current => (current === categoryName ? null : categoryName));
    };
    
    const handleSelectionChange = (itemName: string, isSelected: boolean) => {
        const newSelected = isSelected
            ? [...currentSelection.selected, itemName]
            : currentSelection.selected.filter(item => item !== itemName);
        onChange({ ...currentSelection, selected: newSelected.sort() });
    };
    
    const handleAutreDescriptionChange = (index: number, text: string) => {
        const newDescriptions = [...(currentSelection.autre_descriptions || [''])];
        newDescriptions[index] = text;
        onChange({ ...currentSelection, autre_descriptions: newDescriptions });
    };
    
    const clearAll = () => {
        onChange({ selected: [], autre_descriptions: [''] });
        setActiveCategory(null);
    };

    const isMainCategorySelectedOrHasSelectedChild = (node: AnatomyNode): boolean => {
        if (currentSelection.selected.includes(node.name)) return true;
        if (!node.children) return false;
        
        const checkChildren = (children: AnatomyNode[]): boolean => {
            for (const child of children) {
                if (currentSelection.selected.includes(child.name)) return true;
                if (child.children && checkChildren(child.children)) return true;
            }
            return false;
        }
        return checkChildren(node.children);
    };

    const SubOptions: React.FC<{ nodes: AnatomyNode[], level?: number }> = ({ nodes, level = 0 }) => (
        <div className="space-y-2">
            {nodes.map(node => (
                <div key={node.name} style={{ paddingLeft: `${level * 1.5}rem`}}>
                    <label className="flex items-center space-x-3 cursor-pointer group p-1 rounded-md hover:bg-rose-50">
                        <input
                            type="checkbox"
                            checked={currentSelection.selected.includes(node.name)}
                            onChange={e => handleSelectionChange(node.name, e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-[#FF8F87] focus:ring-[#FF8F87]"
                        />
                        <span className="text-gray-800 group-hover:text-rose-800">{node.name}</span>
                    </label>
                    {node.children && (
                        <div className="mt-1">
                            <SubOptions nodes={node.children} level={level + 1} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
    
    const activeNode = ANATOMY_HIERARCHY.find(node => node.name === activeCategory);
    
    const hasAnyOtherDescription = (currentSelection.autre_descriptions || []).some(d => d.trim() !== '');

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-end mb-3">
                <button type="button" onClick={clearAll} className="text-sm text-blue-800 hover:underline font-semibold no-print">
                    Tout désélectionner
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...ANATOMY_HIERARCHY, { name: 'Autre' }].map(node => {
                     const isSelected = node.name === 'Autre' ? hasAnyOtherDescription : isMainCategorySelectedOrHasSelectedChild(node as AnatomyNode);
                     const isActive = activeCategory === node.name;
                     return (
                        <button
                            type="button"
                            key={node.name}
                            onClick={() => handleMainCategoryClick(node.name)}
                            className={`relative p-3 h-20 flex items-center justify-center text-center text-sm font-semibold rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F87] ${
                                isActive
                                    ? 'bg-rose-50 border-[#FF8F87] text-rose-900 shadow-md'
                                    : isSelected
                                    ? 'bg-gray-200 border-gray-300 text-gray-800'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#FF8F87] hover:bg-rose-50'
                            }`}
                        >
                            {isSelected && !isActive && <div className="absolute top-1 right-1 w-5 h-5 bg-[#FF8F87] text-white rounded-full flex items-center justify-center"><CheckIcon /></div>}
                            {node.name}
                        </button>
                    );
                })}
            </div>
            
            {activeNode && activeNode.children && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Préciser pour : <span className="text-[#FF8F87]">{activeNode.name}</span>
                    </h3>
                    <SubOptions nodes={activeNode.children} />
                </div>
            )}
            
            {(activeCategory === 'Autre' || hasAnyOtherDescription) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Autre motif de consultation</h3>
                    <p className="text-sm text-gray-600 mb-2">Veuillez décrire votre problème ou votre pathologie ci-dessous.</p>
                    <div className="space-y-2">
                        {(currentSelection.autre_descriptions || ['']).map((desc, index) => (
                             <input
                                key={index}
                                type="text"
                                value={desc}
                                onChange={(e) => handleAutreDescriptionChange(index, e.target.value)}
                                className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87]"
                                placeholder="Description..."
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnatomySelector;