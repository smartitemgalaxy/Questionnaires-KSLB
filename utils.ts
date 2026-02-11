import {
  PatientInfo,
  FABQAnswers,
  PCSAnswers,
  CSI_PartA_Answers,
  CSI_PartB_Answers,
  MedicalAnswers,
  MedicalAnswer,
  MedicalQuestionSectionDef,
  AnatomySelection,
  OswestryAnswers,
  QuebecAnswers,
  RolandMorrisAnswers,
  NDIAnswers,
  NorthwickParkAnswers,
  CopenhagenAnswers,
  DASHAnswers,
  OSSAnswers,
  SPADIAnswers,
  VASAnswers,
  OswestryThoracicAnswers,
  IKDCAnswers,
  LysholmAnswers,
  KOOSAnswers,
  OESAnswers,
  PRTEEAnswers,
  PRWEAnswers,
  MHQAnswers,
  HOOSPSAnswers,
  HarrisHipScoreAnswers,
  OHSAnswers,
  HAGOSAnswers,
  PFDIAnswers,
  ICIQAnswers,
  AOFASAnswers,
  FADIAnswers,
  FFIRAnswers,
  FOGQAnswers,
  FESAnswers,
  FESIAnswers,
  BergAnswers,
  LEFSAnswers,
  JFLSAnswers,
  TMDAnswers,
  WPAIAnswers,
  ObjectifsAnswers,
  AmplitudesAnswers,
  MouvementAmplitudes,
  MMRCAnswers,
  SGRQAnswers,
  PSFSAnswers,
  HADAnswers,
} from './types';
import {
  ALL_FABQ_QUESTIONS,
  PCS_QUESTIONS_FR,
  CSI_PART_A_QUESTIONS_FR,
  CSI_PART_B_QUESTIONS_FR,
  CSI_PART_A_RATING_DESCRIPTIONS,
  OSWESTRY_QUESTIONS_FR,
  QUEBEC_QUESTIONS_FR,
  ROLAND_MORRIS_QUESTIONS_FR,
  NDI_QUESTIONS_FR,
  NORTHWICK_PARK_QUESTIONS_FR,
  COPENHAGEN_QUESTIONS_FR,
  COPENHAGEN_RATING_DESCRIPTIONS,
  DASH_QUESTIONS_FR,
  OSS_QUESTIONS_FR,
  ALL_SPADI_QUESTIONS_FR,
  VAS_QUESTION_FR,
  OSWESTRY_THORACIC_QUESTIONS_FR,
  IKDC_QUESTIONS_FR,
  LYSHOLM_QUESTIONS_FR,
  KOOS_QUESTIONS_FR,
  OES_QUESTIONS_FR,
  ALL_PRTEE_QUESTIONS_FR,
  ALL_PRWE_QUESTIONS_FR,
  MHQ_QUESTIONS_FR,
  HOOS_PS_QUESTIONS_FR,
  OXFORD_HIP_SCORE_QUESTIONS_FR,
  HAGOS_QUESTIONS_FR,
  PFDI_QUESTIONS_FR,
  ICIQ_DATA_FR,
  ALL_FADI_QUESTIONS_FR,
  ALL_FFIR_QUESTIONS_FR,
  FOGQ_QUESTIONS_FR,
  FES_QUESTIONS_FR,
  BERG_QUESTIONS_FR,
  LEFS_QUESTIONS_FR,
  JFLS_QUESTIONS_FR,
  TMD_QUESTIONS_FR,
  WPAI_QUESTIONS_FR,
  OBJECTIFS_QUESTIONS_FR,
  AMPLITUDES_QUESTIONS_FR,
  MMRC_QUESTION_FR,
  SGRQ_QUESTIONS_FR,
  PSFS_DATA_FR,
  HAD_QUESTIONS_FR,
  HAD_ANXIETY_Q_IDS,
  HAD_DEPRESSION_Q_IDS
} from './constants';

// L'URL de votre script a été insérée automatiquement.
const GOOGLE_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbxr2iO9SWk4DEW36Of2OR4PeZCAgA_dupscwTT6twAsY2-c29vY9Xkgf678J76dtXYWgw/exec';


async function callGoogleScript(payload: { [key: string]: any }): Promise<any> {
  try {
    console.log('Submitting payload to Google Script:', JSON.stringify(payload, null, 2));
    
    const formData = new URLSearchParams();
    formData.append('payload', JSON.stringify(payload));

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
    
    const responseText = await response.text();
    console.log('Raw response from Google Script:', responseText);

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${responseText}`);
    }

    try {
        const result = JSON.parse(responseText);
        if (result && result.status === 'error') {
            const message = typeof result.message === 'object' ? JSON.stringify(result.message) : result.message;
            throw new Error(`Erreur Serveur: ${message}`);
        }
        return result;
    } catch (e) {
        if (e instanceof Error && e.message.startsWith('Erreur Serveur:')) {
            throw e;
        }
        if (responseText.includes('<title>Google Accounts</title>')) {
             throw new Error("Erreur de permissions: Le script Google n'est pas accessible. Vérifiez son déploiement ('Exécuter en tant que: Moi', 'Qui a accès: Tout le monde').");
        }
        throw new Error(`Réponse inattendue du serveur: ${responseText}`);
    }

  } catch (error) {
    console.error('Erreur de communication avec Google Script:', error);
    throw error;
  }
}

export async function submitBilan(payload: { 
    patientInfo: PatientInfo; 
    filesToCreate: { path: string; content: string }[] 
}): Promise<{ status: string; message: string }> {
    return callGoogleScript({ action: 'submitBilan', ...payload });
}


const renderMedicalAnswer = (answer: MedicalAnswer) => {
    if (answer.value === null) return 'Non répondu';

    if (typeof answer.value === 'object' && answer.value !== null && 'selected' in answer.value) {
        const selection = answer.value as AnatomySelection;
        let result = '';
        if (selection.selected.length > 0) {
            result += `Sélections: ${selection.selected.join(', ')}.`;
        }
        if (selection.autre_descriptions && selection.autre_descriptions.some(d => d.trim() !== '')) {
            result += ` Autre: ${selection.autre_descriptions.filter(d => d.trim() !== '').join(', ')}.`;
        }
        return result.trim() || 'Non précisé';
    }

    if (typeof answer.value === 'boolean') {
        const base = answer.value ? 'Oui' : 'Non';
        const details = answer.details ? ` (${answer.details})` : '';
        return `${base}${details}`;
    }
    return answer.value || 'Non précisé';
}

const generateHeader = (questionnaireName: string, patientInfo: PatientInfo): string => {
  return `Résultats du ${questionnaireName} pour ${patientInfo.prenom} ${patientInfo.nom}\nNuméro de Sécurité Sociale: ${patientInfo.numeroSecuriteSociale}\nDate du bilan: ${patientInfo.date}\n\n---\n\n`;
};

export const generateMedicalText = (answers: MedicalAnswers, patientInfo: PatientInfo, questionnaire: MedicalQuestionSectionDef[]): string => {
  let content = generateHeader('Questionnaire Médical', patientInfo);
  questionnaire.forEach(section => {
    content += `Section: ${section.title}\n`;
    section.questions.forEach(q => {
      content += `  - ${q.text}: ${renderMedicalAnswer(answers[q.id] || { value: null, details: '' })}\n`;
    });
    content += '\n';
  });
  return content;
};

export const generateFabqText = (answers: FABQAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire FABQ', patientInfo);
  ALL_FABQ_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
  });
  return content;
};

export const generatePcsText = (answers: PCSAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire PCS', patientInfo);
  PCS_QUESTIONS_FR.forEach(q => {
    const answer = answers[q.id];
    content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
  });
  return content;
};

export const generateCsiText = (partA: CSI_PartA_Answers, partB: CSI_PartB_Answers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire CSI', patientInfo);
  content += '--- PARTIE A ---\n';
  CSI_PART_A_QUESTIONS_FR.forEach(q => {
    const answerValue = partA[q.id];
    const answerText = answerValue !== null && CSI_PART_A_RATING_DESCRIPTIONS[answerValue] ? `${CSI_PART_A_RATING_DESCRIPTIONS[answerValue]} (${answerValue})` : 'Non répondu';
    content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n\n`;
  });

  content += '--- PARTIE B ---\n';
  CSI_PART_B_QUESTIONS_FR.forEach(q => {
    const answer = partB[q.id];
    const diagnosedText = answer.diagnosed === null ? 'Non répondu' : (answer.diagnosed ? 'Oui' : 'Non');
    const yearText = answer.diagnosed && answer.year ? ` (Année: ${answer.year})` : '';
    content += `${q.id}. ${q.text}\n   Réponse: ${diagnosedText}${yearText}\n\n`;
  });

  return content;
};

export const generateOswestryText = (answers: OswestryAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Oswestry', patientInfo);
  OSWESTRY_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.section}\n   Réponse: ${answerText} (Score: ${answerIndex ?? 'N/A'})\n\n`;
  });
  return content;
};

export const generateQuebecText = (answers: QuebecAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Québec', patientInfo);
  QUEBEC_QUESTIONS_FR.forEach(q => {
    const answer = answers[q.id];
    content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
  });
  return content;
};

export const generateRolandMorrisText = (answers: RolandMorrisAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Roland-Morris', patientInfo);
  content += 'Affirmations cochées par le patient :\n\n';
  ROLAND_MORRIS_QUESTIONS_FR.forEach(q => {
    if (answers[q.id]) {
      content += `- ${q.text}\n`;
    }
  });
  return content;
};

export const generateNdiText = (answers: NDIAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire NDI', patientInfo);
  NDI_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.section}\n   Réponse: ${answerText} (Score: ${answerIndex ?? 'N/A'})\n\n`;
  });
  return content;
};

export const generateNorthwickParkText = (answers: NorthwickParkAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Northwick Park', patientInfo);
  NORTHWICK_PARK_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.section}\n   Réponse: ${answerText} (Score: ${answerIndex ?? 'N/A'})\n\n`;
  });
  return content;
};

export const generateCopenhagenText = (answers: CopenhagenAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Copenhagen', patientInfo);
  COPENHAGEN_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? COPENHAGEN_RATING_DESCRIPTIONS[2 - answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n\n`;
  });
  return content;
};

export const generateDashText = (answers: DASHAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire DASH', patientInfo);
  DASH_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? `${q.options[answerIndex - 1]} (${answerIndex})` : 'Non répondu';
    content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n\n`;
  });
  return content;
};

export const generateOssText = (answers: OSSAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Oxford Shoulder Score (OSS)', patientInfo);
  OSS_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    // Score is 4-0 (best to worst), so index 0 = score 4.
    const score = answerIndex !== null ? 4 - answerIndex : null;
    const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.text}\n   Réponse: ${answerText} (Score: ${score ?? 'N/A'})\n\n`;
  });
  return content;
};

export const generateSpadiText = (answers: SPADIAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('SPADI', patientInfo);
  ALL_SPADI_QUESTIONS_FR.forEach(q => {
    const answer = answers[q.id];
    content += `${q.id}. ${q.text} (${q.scale})\n   Réponse: ${answer !== null ? answer : 'Non répondu'}/10\n\n`;
  });
  return content;
};

export const generateVasText = (answers: VASAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('EVA Douleur Thoracique', patientInfo);
    content += `${VAS_QUESTION_FR.text}\n`;
    content += `Réponse: ${answers.pain !== null ? answers.pain : 'Non répondu'} / 10\n\n`;
    return content;
};

export const generateOswestryThoracicText = (answers: OswestryThoracicAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Oswestry Thoracique', patientInfo);
  OSWESTRY_THORACIC_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.section}\n   Réponse: ${answerText} (Score: ${answerIndex ?? 'N/A'})\n\n`;
  });
  return content;
};

export const generateIkdcText = (answers: IKDCAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire IKDC', patientInfo);
  IKDC_QUESTIONS_FR.forEach(q => {
    content += `${q.id}. ${q.text}\n`;
    if (q.type === 'function' && q.subQuestions) {
        q.subQuestions.forEach(sq => {
            const answerIndex = (answers[q.id] as any)?.[sq.id];
            const answerText = (answerIndex !== null && answerIndex !== undefined && sq.options) ? sq.options[answerIndex].text : 'Non répondu';
            content += `   - ${sq.text}: ${answerText}\n`;
        });
    } else {
        const answerIndex = answers[q.id] as number;
        const answerText = (answerIndex !== null && answerIndex !== undefined && q.options) ? q.options[answerIndex].text : `Score ${answerIndex ?? 'N/A'}`;
        content += `   Réponse: ${answerText}\n`;
    }
    content += `\n`;
  });
  return content;
};

export const generateLysholmText = (answers: LysholmAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Questionnaire Lysholm', patientInfo);
  LYSHOLM_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answer = answerIndex !== null ? q.options[answerIndex] : null;
    content += `${q.id}. ${q.section}\n   Réponse: ${answer ? `${answer.text} (Score: ${answer.score})` : 'Non répondu'}\n\n`;
  });
  return content;
};

export const generateKoosText = (answers: KOOSAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('Questionnaire KOOS', patientInfo);
    KOOS_QUESTIONS_FR.forEach(subscale => {
        content += `--- ${subscale.title.toUpperCase()} ---\n`;
        subscale.questions.forEach(q => {
            const answer = answers[q.id];
            content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
        });
    });
    return content;
};

export const generateOesText = (answers: OESAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Oxford Elbow Score (OES)', patientInfo);
  OES_QUESTIONS_FR.forEach(q => {
    const answerIndex = answers[q.id];
    const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
    content += `${q.id}. ${q.text}\n   Réponse: ${answerText} (Score: ${answerIndex ?? 'N/A'})\n\n`;
  });
  return content;
};

export const generatePrteeText = (answers: PRTEEAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('PRTEE', patientInfo);
  ALL_PRTEE_QUESTIONS_FR.forEach(q => {
    const answer = answers[q.id];
    content += `${q.id}. ${q.text} (${q.scale})\n   Réponse: ${answer !== null ? answer : 'Non répondu'}/10\n\n`;
  });
  return content;
};

export const generatePrweText = (answers: PRWEAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('PRWE', patientInfo);
  ALL_PRWE_QUESTIONS_FR.forEach(q => {
    const answer = answers[q.id];
    content += `${q.id}. ${q.text} (${q.scale})\n   Réponse: ${answer !== null ? answer : 'Non répondu'}/10\n\n`;
  });
  return content;
};

export const generateMhqText = (answers: MHQAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('Michigan Hand Outcomes Questionnaire (MHQ)', patientInfo);
    MHQ_QUESTIONS_FR.forEach(q => {
        const answerValue = answers[q.id];
        const answerText = (answerValue !== null && q.options) ? q.options[answerValue - 1] : 'Non répondu';
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText} (Valeur: ${answerValue ?? 'N/A'})\n\n`;
    });
    return content;
};

export const generateHoospsText = (answers: HOOSPSAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('HOOS-PS', patientInfo);
    const scoreMap = [4, 3, 2, 1, 0];
    HOOS_PS_QUESTIONS_FR.forEach(q => {
        const answerScore = answers[q.id];
        const answerIndex = answerScore !== null ? scoreMap.indexOf(answerScore) : -1;
        const answerText = answerIndex !== -1 ? q.options[answerIndex] : 'Non répondu';
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText} (Score: ${answerScore ?? 'N/A'})\n\n`;
    });
    return content;
};

export const generateHarrisHipScoreText = (answers: HarrisHipScoreAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('Harris Hip Score', patientInfo);
    // Simple dump of values for now.
    for (const [key, value] of Object.entries(answers)) {
        if (typeof value === 'object' && value !== null) {
            content += `${key}:\n`;
            for (const [subKey, subValue] of Object.entries(value)) {
                content += `  - ${subKey}: ${subValue}\n`;
            }
        } else {
            content += `${key}: ${value ?? 'Non répondu'}\n`;
        }
    }
    return content;
};

export const generateOxfordHipScoreText = (answers: OHSAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('Oxford Hip Score', patientInfo);
    OXFORD_HIP_SCORE_QUESTIONS_FR.forEach(q => {
        const answerScore = answers[q.id];
        const scoreMap = [4,3,2,1,0];
        const answerIndex = answerScore !== null ? scoreMap.indexOf(answerScore) : -1;
        const answerText = answerIndex !== -1 ? q.options[answerIndex] : 'Non répondu';
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText} (Score: ${answerScore ?? 'N/A'})\n\n`;
    });
    return content;
};

export const generateHagosText = (answers: HAGOSAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('HAGOS', patientInfo);
     HAGOS_QUESTIONS_FR.forEach(subscale => {
        content += `--- ${subscale.title.toUpperCase()} ---\n`;
        subscale.questions.forEach(q => {
            const answer = answers[q.id];
            content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
        });
    });
    return content;
};

export const generatePfdiText = (answers: PFDIAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('PFDI-20', patientInfo);
    PFDI_QUESTIONS_FR.forEach(q => {
        const answer = answers[q.id];
        let answerText = `Symptôme: ${answer?.hasSymptom ?? 'Non répondu'}`;
        if (answer?.hasSymptom === 'yes') {
            answerText += `, Gêne: ${answer.bother ?? 'Non répondu'}`;
        }
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n\n`;
    });
    return content;
};

export const generateIciqText = (answers: ICIQAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('ICIQ-UI SF', patientInfo);
    content += `Genre: ${answers.gender ?? 'Non précisé'}\n`;
    content += `Fréquence: ${answers.frequency ?? 'Non répondu'}\n`;
    content += `Quantité: ${answers.amount ?? 'Non répondu'}\n`;
    content += `Gêne: ${answers.interference ?? 'Non répondu'}/10\n`;
    content += `Quand les fuites se produisent-elles:\n`;
    Object.entries(answers.when).forEach(([key, value]) => {
        if(value) {
            const label = ICIQ_DATA_FR.q6.options.find(o => o.key === key)?.label;
            content += `  - ${label}\n`;
        }
    });
    return content;
};

export const generateAofasText = (answers: AOFASAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('AOFAS Ankle-Hindfoot Scale', patientInfo);
    for (const [key, value] of Object.entries(answers)) {
        content += `${key}: ${value ?? 'Non répondu'}\n`;
    }
    return content;
};

export const generateFadiText = (answers: FADIAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('FADI', patientInfo);
    ALL_FADI_QUESTIONS_FR.forEach(q => {
        const answer = answers[q.id];
        content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
    });
    return content;
};

export const generateFfirText = (answers: FFIRAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('FFI-R', patientInfo);
    ALL_FFIR_QUESTIONS_FR.forEach(q => {
        const answer = answers[q.id];
        content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n\n`;
    });
    return content;
};

export const generateFogqText = (answers: FOGQAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('FOGQ', patientInfo);
    FOGQ_QUESTIONS_FR.forEach(q => {
        const answerIndex = answers[q.id];
        const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n\n`;
    });
    return content;
};

export const generateFesText = (answers: FESAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('FES', patientInfo);
    FES_QUESTIONS_FR.forEach(q => {
        const answer = answers[q.id];
        content += `${q.id}. ${q.text}\n   Confiance: ${answer !== null ? answer : 'Non répondu'}/10\n\n`;
    });
    return content;
};

export const generateFesiText = (answers: FESIAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('FES-I', patientInfo);
    FES_QUESTIONS_FR.forEach(q => {
        const answer = answers[q.id];
        content += `${q.id}. ${q.text}\n   Préoccupation: ${answer !== null ? answer : 'Non répondu'}/4\n\n`;
    });
    return content;
};

export const generateBergText = (answers: BergAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('Berg Balance Scale', patientInfo);
    BERG_QUESTIONS_FR.forEach(q => {
        const answerScore = answers[q.id];
        content += `${q.id}. ${q.text}\n   Score: ${answerScore ?? 'Non répondu'}\n\n`;
    });
    return content;
};

export const generateLefsText = (answers: LEFSAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('LEFS', patientInfo);
    LEFS_QUESTIONS_FR.forEach(q => {
        const answerIndex = answers[q.id];
        const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText} (Score: ${answerIndex ?? 'N/A'})\n\n`;
    });
    return content;
};

export const generateJflsText = (answers: JFLSAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('JFLS-20', patientInfo);
    JFLS_QUESTIONS_FR.forEach(q => {
        const answer = answers[q.id];
        content += `${q.id}. ${q.text}\n   Limitation: ${answer !== null ? answer : 'Non répondu'}/10\n\n`;
    });
    return content;
};

export const generateTmdText = (answers: TMDAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('TMD Disability Index', patientInfo);
    TMD_QUESTIONS_FR.forEach(q => {
        const answerIndex = answers[q.id];
        const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
        content += `${q.id}. ${q.section}\n   Réponse: ${answerText}\n\n`;
    });
    return content;
};

export const generateWpaiText = (answers: WPAIAnswers, patientInfo: PatientInfo): string => {
    let content = generateHeader('WPAI', patientInfo);
    content += `${WPAI_QUESTIONS_FR.q1}: ${answers.employed ?? 'Non répondu'}\n`;
    if (answers.employed === 'yes') {
        content += `${WPAI_QUESTIONS_FR.q2}: ${answers.missedWorkHoursHealth ?? 'N/A'} heures\n`;
        content += `${WPAI_QUESTIONS_FR.q3}: ${answers.missedWorkHoursOther ?? 'N/A'} heures\n`;
        content += `${WPAI_QUESTIONS_FR.q4}: ${answers.workedHours ?? 'N/A'} heures\n`;
        content += `${WPAI_QUESTIONS_FR.q5}: ${answers.workAffected ?? 'N/A'}/10\n`;
    }
    content += `${WPAI_QUESTIONS_FR.q6}: ${answers.activityAffected ?? 'Non répondu'}/10\n`;
    return content;
};

export const generateObjectifsText = (answers: ObjectifsAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader(OBJECTIFS_QUESTIONS_FR.title, patientInfo);

  OBJECTIFS_QUESTIONS_FR.sections.forEach(section => {
    content += `--- SECTION ${section.id.substring(1)} ---\n\n`;
    
    section.questions.forEach(q => {
      const questionId = q.id as keyof ObjectifsAnswers;
      let answerText = 'Non répondu';

      const answerValue = answers[questionId];

      if (answerValue !== null && answerValue !== undefined) {
        if (q.type === 'checkbox') {
          const selectedOptions = answerValue as string[];
          if (selectedOptions.length > 0) {
            answerText = '\n';
            selectedOptions.forEach(opt => {
              if (opt === 'Autre') {
                const autreKey = `${q.id}_autre` as keyof ObjectifsAnswers;
                answerText += `     - Autre: ${answers[autreKey] || 'Non précisé'}\n`;
              } else {
                answerText += `     - ${opt}\n`;
              }
            });
          }
        } else if (q.type === 'radio') {
            answerText = answerValue as string;
            if (q.hasAutre) {
                const autreKey = `${q.id}_autre` as keyof ObjectifsAnswers;
                if (answers[autreKey]) {
                   answerText = `Autre: ${answers[autreKey]}`;
                }
            }
        } else if (q.type === 'radio-specify' && q.id === 'q12') {
          const selectedKey = answers.q12;
          if (selectedKey) {
            if (selectedKey === 'autre') {
              answerText = `Autre objectif: ${answers.q12_details['autre'] || 'Non précisé'}`;
            } else {
              const selectedOption = q.options.find(opt => opt.key === selectedKey);
              if (selectedOption) {
                answerText = selectedOption.label.split('(')[0].trim();
                if (selectedOption.label.includes(':')) {
                  answerText += `: ${answers.q12_details[selectedKey] || 'Non précisé'}`;
                }
              }
            }
          }
        } else if (q.type === 'scale') {
          answerText = String(answerValue);
        }
      }
      
      content += `${q.text}\n   Réponse: ${answerText}\n\n`;
    });
  });

  content += `\n\n--- SOURCES ET MÉTHODOLOGIE ---\n\n`;
  content += `Sources: Ce questionnaire a été élaboré d'après les principes de la rééducation centrée sur le patient et de la motivation intrinsèque, tels que décrits dans la littérature scientifique sur le goal-setting en réhabilitation. Il intègre également des éléments du modèle peur-évitement pour la prise en charge de la douleur chronique, afin d'identifier et de surmonter les barrières psychologiques à l'adhésion thérapeutique. Les échelles d'importance et de confiance sont inspirées des outils d'entretien motivationnel, qui aident à prédire la réussite d'un changement comportemental en fonction de l'engagement du patient. L'objectif est de garantir que la cible fixée soit pertinente, motivante et durable, pour optimiser l'adhésion du patient au traitement et in fine améliorer ses résultats fonctionnels.\n`;
  
  return content;
};

export const generateAmplitudesText = (answers: AmplitudesAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Auto-évaluation des Amplitudes Articulaires', patientInfo);

  AMPLITUDES_QUESTIONS_FR.forEach(part => {
    content += `\n--- ${part.region.toUpperCase()} ---\n`;
    if (part.bilateral) {
        content += `\n**CÔTÉ GAUCHE**\n`;
        part.mouvements.forEach(mvt => {
            const amp = (answers[part.partKey]?.gauche as any)?.[mvt.mvtKey]?.amplitude || 'Non répondu';
            const douleur = (answers[part.partKey]?.gauche as any)?.[mvt.mvtKey]?.douleur || 'Non répondu';
            content += `- ${mvt.mouvement}:\n`;
            content += `  - Amplitude: ${amp}\n`;
            content += `  - Douleur: ${douleur}\n`;
        });
        content += `\n**CÔTÉ DROIT**\n`;
        part.mouvements.forEach(mvt => {
            const amp = (answers[part.partKey]?.droite as any)?.[mvt.mvtKey]?.amplitude || 'Non répondu';
            const douleur = (answers[part.partKey]?.droite as any)?.[mvt.mvtKey]?.douleur || 'Non répondu';
            content += `- ${mvt.mouvement}:\n`;
            content += `  - Amplitude: ${amp}\n`;
            content += `  - Douleur: ${douleur}\n`;
        });
    } else {
        part.mouvements.forEach(mvt => {
            const amp = (answers[part.partKey]?.[mvt.mvtKey] as MouvementAmplitudes)?.amplitude || 'Non répondu';
            const douleur = (answers[part.partKey]?.[mvt.mvtKey] as MouvementAmplitudes)?.douleur || 'Non répondu';
            content += `- ${mvt.mouvement}:\n`;
            content += `  - Amplitude: ${amp}\n`;
            content += `  - Douleur: ${douleur}\n`;
        });
    }
  });
  
  content += `\n\n--- GUIDE D'INTERPRÉTATION CLINIQUE ---\n\n`;
  content += `Amplitude articulaire : Chaque mouvement peut être coté de 0 à 3 en fonction de la limitation observée. Une réponse correspondant à l'amplitude normale est cotée 0 (≈100% de l'amplitude normale atteinte, aucune limitation). Une limitation légère/modérée (amplitude > ~75% de la normale) est cotée 1 - elle suggère une gêne fonctionnelle faible. Une limitation importante (≈50% de l'amplitude normale) est cotée 2 - impact fonctionnel notable. Une limitation sévère (< ~25% de la normale) est cotée 3 - le mouvement est presque impossible.\n\nDouleur pendant le mouvement : Le moment d'apparition de la douleur apporte des indications sur la nature du problème. Une douleur dès le début du mouvement suggère souvent un processus inflammatoire aigu. Une douleur en milieu de course peut indiquer un conflit mécanique. Une douleur uniquement en fin d'amplitude évoque plutôt une limitation mécanique ou un étirement. L'absence de douleur malgré une amplitude réduite oriente vers une raideur « pure ». En synthétisant le niveau de limitation et le timing de la douleur, le professionnel de santé peut orienter son diagnostic.\n`;
  return content;
};

export const generateHadText = (answers: HADAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader('Échelle HAD', patientInfo);
  
  const anxietyScore = HAD_ANXIETY_Q_IDS.reduce((sum, id) => sum + (answers[id] ?? 0), 0);
  const depressionScore = HAD_DEPRESSION_Q_IDS.reduce((sum, id) => sum + (answers[id] ?? 0), 0);
  
  const interpretScore = (score: number) => {
    if (score <= 7) return "Absence de symptomatologie";
    if (score >= 8 && score <= 10) return "Symptomatologie douteuse";
    return "Symptomatologie certaine";
  };
  
  content += `--- SCORES ---\n`;
  content += `Score d'Anxiété (A): ${anxietyScore} / 21 (${interpretScore(anxietyScore)})\n`;
  content += `Score de Dépression (D): ${depressionScore} / 21 (${interpretScore(depressionScore)})\n\n`;
  
  content += '--- DÉTAIL DES RÉPONSES ---\n';
  HAD_QUESTIONS_FR.forEach(q => {
    const answerValue = answers[q.id];
    const answerOption = q.options.find(opt => opt.value === answerValue);
    const answerText = answerOption ? `${answerOption.text} (Score: ${answerValue})` : 'Non répondu';
    content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n\n`;
  });

  content += `--- INTERPRÉTATION ---\n`;
  content += `Pour dépister des symptomatologies anxieuses et dépressives, l'interprétation suivante peut être proposée pour chacun des scores (A et D) :\n`;
  content += `- 7 ou moins : absence de symptomatologie\n`;
  content += `- 8 à 10 : symptomatologie douteuse\n`;
  content += `- 11 et plus : symptomatologie certaine.\n\n`;
  content += `Selon les résultats, il sera peut-être nécessaire de demander un avis spécialisé.\n`;

  return content;
};

export const generateMmrcText = (answers: MMRCAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader(MMRC_QUESTION_FR.text, patientInfo);
  const selectedOption = MMRC_QUESTION_FR.options.find(opt => opt.score === answers.score);
  content += `Score: ${answers.score ?? 'Non répondu'}\n`;
  if (selectedOption) {
    content += `Description: ${selectedOption.text}\n`;
  }
  return content;
};

export const generateSgrqText = (answers: SGRQAnswers, patientInfo: PatientInfo): string => {
  let content = generateHeader("Questionnaire Respiratoire du St. George's Hospital", patientInfo);
  content += '--- 1ère PARTIE - 12 Derniers Mois ---\n';
  SGRQ_QUESTIONS_FR.part1.forEach(q => {
    const answerValue = answers[`p1_${q.id}`];
    const answerOption = q.options.find((opt: any) => opt.value === answerValue);
    content += `${q.text}: ${answerOption ? answerOption.label : 'Non répondu'}\n`;
  });
  content += '\n--- 2ème PARTIE ---\n';
  SGRQ_QUESTIONS_FR.part2.sections.forEach(sec => {
    content += `\n${sec.title}:\n`;
    sec.questions.forEach((q:any) => {
      if (q.type === 'radio') {
        const answerValue = answers[`p2_s${sec.id}_${q.id}`];
        const answerOption = q.options.find((opt: any) => opt.value === answerValue);
        content += `  - ${q.text}: ${answerOption ? answerOption.label : 'Non répondu'}\n`;
      } else if (q.type === 'checkbox-group') {
        content += `  - ${q.text}:\n`;
        q.options.forEach((opt: any) => {
          if (answers[`p2_s${sec.id}_q${q.id}_${opt.id}`]) {
            content += `    * ${opt.text}\n`;
          }
        });
      }
    });
  });
  content += '\n--- Gêne Globale ---\n';
  const finalAnswerValue = answers[`final_${SGRQ_QUESTIONS_FR.final.id}`];
  const finalAnswerOption = SGRQ_QUESTIONS_FR.final.options.find((opt: any) => opt.value === finalAnswerValue);
  content += `${SGRQ_QUESTIONS_FR.final.text}: ${finalAnswerOption ? finalAnswerOption.label : 'Non répondu'}\n`;
  return content;
};

export const generatePsfsText = (answers: PSFSAnswers, patientInfo: PatientInfo, zone: string): string => {
  let content = generateHeader(`${PSFS_DATA_FR.title} (${zone})`, patientInfo);
  answers.activities.forEach((activity, index) => {
    if (activity.description.trim()) {
      content += `Activité ${index + 1}:\n`;
      content += `  - Description: ${activity.description}\n`;
      content += `  - Score: ${activity.score !== null ? activity.score : 'Non noté'}/10\n\n`;
    }
  });
  return content;
};

export const downloadTextFile = (content: string, filename: string): void => {
  const element = document.createElement("a");
  const file = new Blob([content], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export const generatePatientReportText = (
    patientInfo: PatientInfo,
    fabqAnswers: FABQAnswers,
    pcsAnswers: PCSAnswers,
    csiPartAAnswers: CSI_PartA_Answers,
    oswestryAnswers: OswestryAnswers
): string => {
    let content = `Rapport Patient pour ${patientInfo.prenom} ${patientInfo.nom}\n`;
    content += `Date: ${patientInfo.date}\n\n`;

    content += '--- Questionnaire FABQ ---\n';
    ALL_FABQ_QUESTIONS.forEach(q => {
        const answer = fabqAnswers[q.id];
        content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n`;
    });
    content += '\n';

    content += '--- Questionnaire PCS ---\n';
    PCS_QUESTIONS_FR.forEach(q => {
        const answer = pcsAnswers[q.id];
        content += `${q.id}. ${q.text}\n   Réponse: ${answer !== null ? answer : 'Non répondu'}\n`;
    });
    content += '\n';

    content += '--- Questionnaire CSI (Partie A) ---\n';
    CSI_PART_A_QUESTIONS_FR.forEach(q => {
        const answerValue = csiPartAAnswers[q.id];
        const answerText = answerValue !== null ? `${CSI_PART_A_RATING_DESCRIPTIONS[answerValue]} (${answerValue})` : 'Non répondu';
        content += `${q.id}. ${q.text}\n   Réponse: ${answerText}\n`;
    });
    content += '\n';

    content += '--- Questionnaire Oswestry ---\n';
    OSWESTRY_QUESTIONS_FR.forEach(q => {
        const answerIndex = oswestryAnswers[q.id];
        const answerText = answerIndex !== null ? q.options[answerIndex] : 'Non répondu';
        content += `${q.id}. ${q.section}\n   Réponse: ${answerText}\n`;
    });

    return content;
};
