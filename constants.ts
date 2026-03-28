
import { RatingQuestion, MedicalQuestionSectionDef, AnatomyNode, OswestryQuestion, QuebecQuestion, RolandMorrisQuestion, NDIQuestion, NorthwickParkQuestion, CopenhagenQuestion, DASHQuestion, OSSQuestion, SPADIQuestion, OswestryThoracicQuestion, IKDCQuestion, LysholmQuestion, KOOSSubscale, OESQuestion, PRTEEQuestion, PRWEQuestion, MHQQuestion, HOOSPSQuestion, OHSQuestion, HAGOSSubscale, PFDIQuestion, FADIQuestion, FFIRQuestion, FOGQQuestion, FESQuestion, BergQuestion, LEFSQuestion, JFLSQuestion, TMDQuestion } from './types';

// FABQ en Français
export const PHYSICAL_ACTIVITY_QUESTIONS_FR: RatingQuestion[] = [
  { id: 1, text: 'Ma douleur a été causée par une activité physique.' },
  { id: 2, text: "L'activité physique aggrave ma douleur." },
  { id: 3, text: "L'activité physique pourrait nuire à mon dos." },
  { id: 4, text: "Je ne devrais pas faire d'activités physiques qui (pourraient) aggraver ma douleur." },
  { id: 5, text: "Je ne peux pas faire d'activités physiques qui (pourraient) aggraver ma douleur." },
];

export const WORK_QUESTIONS_FR: RatingQuestion[] = [
  { id: 6, text: 'Ma douleur a été causée par mon travail ou par un accident de travail.' },
  { id: 7, text: 'Mon travail a aggravé ma douleur.' },
  { id: 8, text: "J'ai une demande d'indemnisation pour ma douleur." },
  { id: 9, text: 'Mon travail est trop lourd pour moi.' },
  { id: 10, text: 'Mon travail aggrave ou pourrait aggraver ma douleur.' },
  { id: 11, text: 'Mon travail pourrait nuire à mon dos.' },
  { id: 12, text: 'Je ne devrais pas faire mon travail normal avec ma douleur actuelle.' },
  { id: 13, text: 'Je ne peux pas faire mon travail normal avec ma douleur actuelle.' },
  { id: 14, text: "Je ne peux pas faire mon travail normal tant que ma douleur n'est pas traitée." },
  { id: 15, text: "Je ne pense pas que je serai de retour à mon travail normal d'ici 3 mois." },
  { id: 16, text: 'Je ne pense pas que je pourrai un jour retourner à ce travail.' },
];

export const ALL_FABQ_QUESTIONS = [...PHYSICAL_ACTIVITY_QUESTIONS_FR, ...WORK_QUESTIONS_FR];

export const SCORE_SCALE_WORK_ITEMS: number[] = [6, 7, 9, 10, 11, 12, 15];
export const SCORE_SCALE_PHYSICAL_ACTIVITY_ITEMS: number[] = [2, 3, 4, 5];

export const RATING_LABELS = [0, 1, 2, 3, 4, 5, 6];

// Pain Catastrophizing Scale (PCS) en Français
export const PCS_QUESTIONS_FR: RatingQuestion[] = [
    { id: 1, text: "Je m'inquiète constamment de savoir si la douleur va cesser." },
    { id: 2, text: "Je sens que je ne peux plus continuer." },
    { id: 3, text: "C'est terrible et je pense que ça ne s'améliorera jamais." },
    { id: 4, text: "C'est affreux et je sens que ça me submerge." },
    { id: 5, text: "Je sens que je n'en peux plus." },
    { id: 6, text: "J'ai peur que la douleur empire." },
    { id: 7, text: "Je continue de penser à d'autres événements douloureux." },
    { id: 8, text: "Je veux anxieusement que la douleur disparaisse." },
    { id: 9, text: "Je n'arrive pas à me le sortir de la tête." },
    { id: 10, text: "Je continue de penser à quel point ça fait mal." },
    { id: 11, text: "Je continue de penser à quel point je veux que la douleur s'arrête." },
    { id: 12, text: "Il n'y a rien que je puisse faire pour réduire l'intensité de la douleur." },
    { id: 13, text: "Je me demande si quelque chose de grave pourrait arriver." },
];

export const PCS_RATING_LABELS = [0, 1, 2, 3, 4];
export const PCS_RATING_DESCRIPTIONS = ["Pas du tout", "Légèrement", "Modérément", "Fortement", "Tout le temps"];


// Inventaire de Sensibilisation Centrale (CSI)
export const CSI_PART_A_QUESTIONS_FR: RatingQuestion[] = [
    { id: 1, text: "J'ai la sensation d'un sommeil non récupérateur quand je me réveille le matin" },
    { id: 2, text: "Je ressens des raideurs et des douleurs musculaires" },
    { id: 3, text: "Je fais des crises d'angoisse" },
    { id: 4, text: "Je grince ou serre les dents" },
    { id: 5, text: "J'ai des problèmes de diarrhée et/ou de constipation" },
    { id: 6, text: "J'ai besoin d'aide pour effectuer mes activités quotidiennes" },
    { id: 7, text: "Je suis sensible aux fortes lumières" },
    { id: 8, text: "Je me fatigue très facilement lorsque je suis actif physiquement" },
    { id: 9, text: "Je ressens des douleurs partout dans le corps" },
    { id: 10, text: "J'ai des maux de tête" },
    { id: 11, text: "Je ressens une gêne à la vessie et/ou des brûlures lorsque j'urine" },
    { id: 12, text: "Je ne dors pas bien" },
    { id: 13, text: "J'ai des difficultés de concentration" },
    { id: 14, text: "J'ai des problèmes de peau tels que sécheresse, démangeaisons ou éruption cutanées" },
    { id: 15, text: "Le stress aggrave mes symptômes physiques" },
    { id: 16, text: "Je me sens triste ou déprimé" },
    { id: 17, text: "J'ai peu d'énergie" },
    { id: 18, text: "Je ressens des tensions musculaires dans la nuque et dans les épaules" },
    { id: 19, text: "J'ai mal à la mâchoire" },
    { id: 20, text: "Certaines odeurs, comme des parfums, me donnent des nausées et des étourdissements" },
    { id: 21, text: "Je dois uriner fréquemment" },
    { id: 22, text: "J'ai la sensation désagréable des jambes sans repos lorsque j'essaye de dormir le soir" },
    { id: 23, text: "J'ai des difficultés à me souvenir de certaines choses" },
    { id: 24, text: "J'ai eu des traumatismes au cours de mon enfance" },
    { id: 25, text: "Je ressens des douleurs dans la région du bassin" },
];

export const CSI_PART_A_RATING_LABELS = [0, 1, 2, 3, 4];
export const CSI_PART_A_RATING_DESCRIPTIONS = ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"];

export const CSI_PART_B_QUESTIONS_FR: RatingQuestion[] = [
    { id: 1, text: "Syndrome des jambes sans repos" },
    { id: 2, text: "Syndrome de fatigue chronique" },
    { id: 3, text: "Fibromyalgie" },
    { id: 4, text: "Trouble de l'articulation temporo-mandibulaire (ATM)" },
    { id: 5, text: "Migraines ou céphalées de tension" },
    { id: 6, text: "Syndrome du côlon irritable" },
    { id: 7, text: "Hypersensibilité chimique multiple" },
    { id: 8, text: "Lésion de la nuque (y-compris le syndrome du coup du lapin, ou « whiplash syndrome »)" },
    { id: 9, text: "Troubles anxieux ou attaques de panique" },
    { id: 10, text: "Dépression" },
];

// Oswestry Disability Index
export const OSWESTRY_QUESTIONS_FR: OswestryQuestion[] = [
    {
        id: 1, section: "Intensité de la douleur",
        options: [
            "Je n'ai pas mal actuellement.",
            "La douleur est très légère actuellement.",
            "La douleur est modérée actuellement.",
            "La douleur est plutôt intense actuellement.",
            "La douleur est très intense actuellement.",
            "La douleur est la pire que l'on puisse imaginer actuellement."
        ]
    },
    {
        id: 2, section: "Soins personnels (se laver, s'habiller, ...etc)",
        options: [
            "Je peux prendre soin de moi normalement, sans augmenter la douleur.",
            "Je peux prendre soin de moi normalement, mais c'est très douloureux.",
            "Cela me fait mal de prendre soin de moi, et je le fait lentement et en faisant attention.",
            "J'ai besoin d'aide, mais dans l'ensemble je parviens à me débrouiller seul.",
            "J'ai besoin d'aide tous les jours pour la plupart de ces gestes quotidiens.",
            "Je ne m'habille pas, me lave avec difficulté et reste au lit."
        ]
    },
    {
        id: 3, section: "Manutention de charges",
        options: [
            "Je peux soulever des charges lourdes sans augmenter mon mal de dos.",
            "Je peux soulever des charges lourdes mais cela augmente ma douleur.",
            "La douleur m'empêche de soulever des charges lourdes à partir du sol mais j'y parviens si la charge est bien placée (par exemple sur une table).",
            "La douleur m'empêche de soulever des charges lourdes mais je peux déplacer des charges légères ou de poids moyen si elles sont correctement placées.",
            "Je peux seulement soulever des objets très légers.",
            "Je ne peux soulever ni transporter quoi que ce soit."
        ]
    },
    {
        id: 4, section: "Marche à pied",
        options: [
            "La douleur ne limite absolument pas mes déplacements.",
            "La douleur m'empêche de marcher plus de 2 km.",
            "La douleur m'empêche de marcher plus de 1 km.",
            "La douleur m'empêche de marcher plus de 500 m.",
            "Je me déplace seulement avec une canne ou des béquilles.",
            "Je reste au lit la plupart du temps et je me traîne seulement jusqu'au WC."
        ]
    },
    {
        id: 5, section: "Position assise",
        options: [
            "Je peux rester assis sur un siège aussi longtemps que je veux.",
            "Je peux rester assis aussi longtemps que je veux mais seulement sur mon siège favori.",
            "La douleur m'empêche de rester assis plus d'une heure.",
            "La douleur m'empêche de rester assis plus d'1/2 heure.",
            "La douleur m'empêche de rester assis plus de 10 minutes.",
            "La douleur m'empêche de rester assis."
        ]
    },
    {
        id: 6, section: "Position debout",
        options: [
            "Je peux rester debout aussi longtemps que je veux sans augmenter la douleur.",
            "Je peux rester debout aussi longtemps que je veux mais cela augmente la douleur.",
            "La douleur m'empêche de rester debout plus d'une heure.",
            "La douleur m'empêche de rester debout plus d'1/2 heure.",
            "La douleur m'empêche de rester debout plus de 10 minutes.",
            "La douleur m'empêche de rester debout."
        ]
    },
    {
        id: 7, section: "Sommeil",
        options: [
            "Mon sommeil n'est jamais perturbé par la douleur.",
            "Mon sommeil est parfois perturbé par la douleur.",
            "A cause de la douleur, je dors moins de 6 heures.",
            "A cause de la douleur, je dors moins de 4 heures.",
            "A cause de la douleur, je dors moins de 2 heures.",
            "La douleur m'empêche complètement de dormir."
        ]
    },
    {
        id: 8, section: "Vie sexuelle",
        options: [
            "Ma vie sexuelle n'est pas modifiée et n'augmente pas mon mal de dos.",
            "Ma vie sexuelle n'est pas modifiée, mais elle augmente la douleur.",
            "Ma vie sexuelle est pratiquement normale, mais elle est très douloureuse.",
            "Ma vie sexuelle est fortement limitée par la douleur.",
            "Ma vie sexuelle est presque inexistante à cause de la douleur.",
            "La douleur m'interdit toute vie sexuelle."
        ]
    },
    {
        id: 9, section: "Vie sociale",
        options: [
            "Ma vie sociale est normale et n'a pas d'effet sur la douleur.",
            "Ma vie sociale est normale, mais elle augmente la douleur.",
            "La douleur n'a pas d'effet sur ma vie sociale, sauf pour des activités demandant plus d'énergie (sport par exemple).",
            "La douleur a réduit ma vie sociale et je ne sors plus autant qu'auparavant.",
            "La douleur a limité ma vie sociale à ce qui se passe chez moi, à la maison.",
            "Je n'ai plus de vie sociale à cause du mal de dos."
        ]
    },
    {
        id: 10, section: "Déplacements",
        options: [
            "Je peux me déplacer n'importe où sans effet sur mon mal de dos.",
            "Je peux me déplacer n'importe où, mais cela augmente la douleur.",
            "La douleur est pénible mais je supporte des trajets de plus de 2 heures.",
            "La douleur me limite à des trajets de moins d'une heure.",
            "La douleur me limite aux courts trajets indispensables, de moins de 30 minutes.",
            "La douleur m'empêche de me déplacer, sauf pour aller voir le docteur ou me rendre à l'hôpital."
        ]
    }
];

// Québec Back Pain Disability Scale
export const QUEBEC_QUESTIONS_FR: QuebecQuestion[] = [
    { id: 1, text: "Sortir du lit" },
    { id: 2, text: "Dormir toute la nuit" },
    { id: 3, text: "Vous retourner dans le lit" },
    { id: 4, text: "Vous promener en voiture" },
    { id: 5, text: "Rester debout durant 20 à 30 minutes" },
    { id: 6, text: "Rester assis sur une chaise durant plusieurs heures" },
    { id: 7, text: "Monter un seul étage à pied" },
    { id: 8, text: "Faire plusieurs coins de rue à pied (300 à 400 mètres)" },
    { id: 9, text: "Marcher plusieurs milles" },
    { id: 10, text: "Atteindre des objets sur des tablettes assez élevées" },
    { id: 11, text: "Lancer une balle" },
    { id: 12, text: "Courir un coin de rue (à peu près 100 mètres)" },
    { id: 13, text: "Sortir des aliments du réfrigérateur" },
    { id: 14, text: "Faire votre lit" },
    { id: 15, text: "Mettre vos bas (collants)" },
    { id: 16, text: "Vous pencher pour laver la baignoire" },
    { id: 17, text: "Déplacer une chaise" },
    { id: 18, text: "Tirer ou pousser des portes lourdes" },
    { id: 19, text: "Transporter deux sacs d'épicerie" },
    { id: 20, text: "Soulever et transporter une grosse valise" }
];
export const QUEBEC_RATING_LABELS = [0, 1, 2, 3, 4, 5];
export const QUEBEC_RATING_DESCRIPTIONS = ["Aucune difficulté", "Très peu difficile", "Un peu difficile", "Difficile", "Très difficile", "Incapable"];

// Roland-Morris Disability Questionnaire
export const ROLAND_MORRIS_QUESTIONS_FR: RolandMorrisQuestion[] = [
    { id: 1, text: "Je reste pratiquement tout le temps à la maison à cause de mon dos." },
    { id: 2, text: "Je change souvent de position pour soulager mon dos." },
    { id: 3, text: "Je marche plus lentement que d'habitude à cause de mon dos." },
    { id: 4, text: "A cause de mon dos, je n'effectue aucune des tâches que j'ai l'habitude de faire à la maison." },
    { id: 5, text: "A cause de mon dos, je m'aide de la rampe pour monter les escaliers." },
    { id: 6, text: "A cause de mon dos, je m'allonge plus souvent pour me reposer." },
    { id: 7, text: "A cause de mon dos, je suis obligé(e) de prendre un appui pour sortir d'un fauteuil." },
    { id: 8, text: "A cause de mon dos, j'essaie d'obtenir que d'autres fassent des choses à ma place." },
    { id: 9, text: "A cause de mon dos, je m'habille plus lentement que d'habitude." },
    { id: 10, text: "Je ne reste debout que de courts moments à cause de mon dos." },
    { id: 11, text: "A cause de mon dos, j'essaie de ne pas me baisser ni de m'agenouiller." },
    { id: 12, text: "A cause de mon dos, j'ai du mal à me lever d'une chaise." },
    { id: 13, text: "J'ai mal au dos la plupart du temps." },
    { id: 14, text: "A cause de mon dos, j'ai des difficultés à me retourner dans mon lit." },
    { id: 15, text: "J'ai moins d'appétit à cause de mon mal de dos." },
    { id: 16, text: "A cause de mon dos, j'ai du mal à mettre mes chaussettes (ou bas/collants)." },
    { id: 17, text: "Je ne peux marcher que sur de courtes distances à cause de mon mal de dos." },
    { id: 18, text: "Je dors moins à cause de mon mal de dos." },
    { id: 19, text: "A cause de mon dos, quelqu'un m'aide pour m'habiller." },
    { id: 20, text: "A cause de mon dos, je reste assis(e) la plus grande partie de la journée." },
    { id: 21, text: "A cause de mon dos, j'évite de faire de gros travaux à la maison." },
    { id: 22, text: "A cause de mon mal de dos, je suis plus irritable que d'habitude et de mauvaise humeur avec les gens." },
    { id: 23, text: "A cause de mon dos, je monte les escaliers plus lentement que d'habitude." },
    { id: 24, text: "A cause de mon dos, je reste au lit la plupart du temps." }
];

// Neck Disability Index (NDI)
export const NDI_QUESTIONS_FR: NDIQuestion[] = [
    {
        id: 1, section: "Intensité de la douleur", options: [
            "Je n'ai aucune douleur pour le moment.",
            "La douleur est très légère en ce moment.",
            "La douleur est modérée en ce moment.",
            "La douleur est assez sévère en ce moment.",
            "La douleur est très sévère en ce moment.",
            "La douleur est la pire imaginable en ce moment."
        ]
    },
    {
        id: 2, section: "Soins personnels", options: [
            "Je peux prendre soin de moi normalement sans causer de douleur supplémentaire.",
            "Je peux prendre soin de moi normalement, mais cela cause une douleur supplémentaire.",
            "Il est douloureux de prendre soin de moi, et je suis lent et prudent.",
            "J'ai besoin d'aide mais je gère la plupart de mes soins personnels.",
            "J'ai besoin d'aide tous les jours pour la plupart des aspects de mes soins.",
            "Je ne m'habille pas. Je me lave avec difficulté et reste au lit."
        ]
    },
    {
        id: 3, section: "Soulever des objets", options: [
            "Je peux soulever des poids lourds sans douleur supplémentaire.",
            "Je peux soulever des poids lourds, mais cela me donne une douleur supplémentaire.",
            "La douleur m'empêche de soulever des poids lourds du sol mais je peux y arriver s'ils sont placés de manière pratique, par exemple sur une table.",
            "La douleur m'empêche de soulever des poids lourds, mais je peux gérer des poids légers s'ils sont placés de manière pratique.",
            "Je ne peux soulever que des poids très légers.",
            "Je ne peux rien soulever ou porter du tout."
        ]
    },
    {
        id: 4, section: "Travail", options: [
            "Je peux faire autant de travail que je veux.",
            "Je ne peux faire que mon travail habituel, mais pas plus.",
            "Je peux faire la plupart de mon travail habituel, mais pas plus.",
            "Je ne peux pas faire mon travail habituel.",
            "Je peux à peine faire du travail.",
            "Je ne peux faire aucun travail."
        ]
    },
    {
        id: 5, section: "Maux de tête", options: [
            "Je n'ai aucun mal de tête.",
            "J'ai de légers maux de tête qui surviennent rarement.",
            "J'ai des maux de tête modérés qui surviennent rarement.",
            "J'ai des maux de tête modérés qui surviennent frequently.",
            "J'ai des maux de tête sévères qui surviennent frequently.",
            "J'ai des maux de tête presque tout le temps."
        ]
    },
    {
        id: 6, section: "Concentration", options: [
            "Je peux me concentrer pleinement sans difficulté.",
            "Je peux me concentrer pleinement avec une légère difficulté.",
            "J'ai un certain degré de difficulté à me concentrer.",
            "J'ai beaucoup de difficulté à me concentrer.",
            "J'ai énormément de difficulté à me concentrer.",
            "Je ne peux pas me concentrer du tout."
        ]
    },
    {
        id: 7, section: "Sommeil", options: [
            "Je n'ai aucun problème de sommeil.",
            "Mon sommeil est légèrement perturbé pendant moins d'une heure.",
            "Mon sommeil est légèrement perturbé jusqu'à 1-2 heures.",
            "Mon sommeil est modérément perturbé jusqu'à 2-3 heures.",
            "Mon sommeil est grandement perturbé jusqu'à 3-5 heures.",
            "Mon sommeil est complètement perturbé jusqu'à 5-7 heures."
        ]
    },
    {
        id: 8, section: "Conduite", options: [
            "Je peux conduire ma voiture sans douleur au cou.",
            "Je peux conduire aussi longtemps que je veux avec une légère douleur au cou.",
            "Je peux conduire aussi longtemps que je veux avec une douleur modérée au cou.",
            "Je ne peux pas conduire aussi longtemps que je veux à cause d'une douleur modérée au cou.",
            "Je peux à peine conduire à cause d'une douleur sévère au cou.",
            "Je ne peux pas du tout conduire ma voiture à cause de la douleur au cou."
        ]
    },
    {
        id: 9, section: "Lecture", options: [
            "Je peux lire autant que je veux sans douleur au cou.",
            "Je peux lire autant que je veux avec une légère douleur au cou.",
            "Je peux lire autant que je veux avec une douleur modérée au cou.",
            "Je ne peux pas lire autant que je veux à cause d'une douleur modérée au cou.",
            "Je ne peux pas lire autant que je veux à cause d'une douleur sévère au cou.",
            "Je ne peux pas lire du tout."
        ]
    },
    {
        id: 10, section: "Loisirs", options: [
            "Je n'ai aucune douleur au cou pendant toutes les activités de loisirs.",
            "J'ai une certaine douleur au cou avec toutes les activités de loisirs.",
            "J'ai une certaine douleur au cou avec quelques activités de loisirs.",
            "J'ai des douleurs au cou avec la plupart des activités de loisirs.",
            "Je peux à peine faire des activités de loisirs à cause de la douleur au cou.",
            "Je ne peux faire aucune activité de loisir à cause de la douleur au cou."
        ]
    }
];

// Northwick Park Neck Pain Questionnaire
export const NORTHWICK_PARK_QUESTIONS_FR: NorthwickParkQuestion[] = [
    {
        id: 1, section: "Intensité de la douleur", options: [
            "Je n'ai aucune douleur pour le moment.",
            "Ma douleur est très légère en ce moment.",
            "Ma douleur est modérée en ce moment.",
            "Ma douleur est assez sévère en ce moment.",
            "Ma douleur est très sévère en ce moment."
        ]
    },
    {
        id: 2, section: "Douleur et sommeil", options: [
            "Mon sommeil n'est jamais perturbé par la douleur.",
            "Mon sommeil est occasionnellement perturbé par la douleur.",
            "Mon sommeil est régulièrement perturbé par la douleur.",
            "À cause de la douleur, j'ai moins de 5 heures de sommeil au total.",
            "À cause de la douleur, j'ai moins de 2 heures de sommeil au total."
        ]
    },
    {
        id: 3, section: "Picotements, aiguilles ou engourdissements dans les bras la nuit", options: [
            "Je n'ai pas de picotements, d'aiguilles ou d'engourdissements la nuit.",
            "J'ai occasionnellement des picotements, des aiguilles ou des engourdissements la nuit.",
            "Mon sommeil est régulièrement perturbé par des picotements, des aiguilles ou des engourdissements.",
            "À cause des picotements, des aiguilles ou des engourdissements, j'ai moins de 5 heures de sommeil au total.",
            "À cause des picotements, des aiguilles ou des engourdissements, j'ai moins de 2 heures de sommeil au total."
        ]
    },
    {
        id: 4, section: "Durée des symptômes", options: [
            "Mon cou et mes bras sont normaux toute la journée.",
            "J'ai des symptômes dans le cou ou les bras en marchant, qui durent moins d'une heure.",
            "Les symptômes sont présents par intermittence pour une période totale de 1 à 4 heures.",
            "Les symptômes sont présents par intermittence pour une période totale de plus de 4 heures.",
            "Les symptômes sont présents en continu toute la journée."
        ]
    },
    {
        id: 5, section: "Porter des objets", options: [
            "Je peux porter des objets lourds sans douleur supplémentaire.",
            "Je peux porter des objets lourds, mais ils me donnent une douleur supplémentaire.",
            "La douleur m'empêche de porter des objets lourds, mais je peux gérer des objets de poids moyen.",
            "Je ne peux soulever que des objets légers.",
            "Je ne peux rien soulever du tout."
        ]
    },
    {
        id: 6, section: "Lecture et télévision", options: [
            "Je peux le faire aussi longtemps que je le souhaite sans problème.",
            "Je peux le faire aussi longtemps que je le souhaite, si je suis dans une position appropriée.",
            "Je peux le faire aussi longtemps que je le souhaite, mais cela cause une douleur supplémentaire.",
            "La douleur me fait arrêter de le faire plus tôt que je ne le voudrais.",
            "La douleur m'empêche de le faire du tout."
        ]
    },
    {
        id: 7, section: "Travail/Ménage, etc.", options: [
            "Je peux faire mon travail habituel sans douleur supplémentaire.",
            "Je peux faire mon travail habituel, mais cela me donne une douleur supplémentaire.",
            "La douleur m'empêche de faire mon travail habituel pendant plus de la moitié du temps habituel.",
            "La douleur m'empêche de faire mon travail habituel pendant plus d'un quart du temps habituel.",
            "La douleur m'empêche de travailler du tout."
        ]
    },
    {
        id: 8, section: "Activités sociales", options: [
            "Ma vie sociale est normale et ne me cause aucune douleur supplémentaire.",
            "Ma vie sociale est normale mais augmente le degré de douleur.",
            "La douleur a restreint ma vie sociale, mais je peux encore sortir.",
            "La douleur a restreint ma vie sociale à la maison.",
            "Je n'ai aucune vie sociale à cause de la douleur."
        ]
    },
    {
        id: 9, section: "Conduite (si applicable)", options: [
            "Je peux conduire chaque fois que nécessaire sans inconfort.",
            "Je peux conduire chaque fois que nécessaire, mais avec inconfort.",
            "La douleur ou la raideur du cou limite ma conduite occasionnellement.",
            "La douleur ou la raideur du cou limite ma conduite fréquemment.",
            "Je ne peux pas du tout conduire à cause des symptômes du cou."
        ]
    },
    {
        id: 10, section: "Comparé à la dernière fois que vous avez répondu à cette question, votre douleur au cou est :", options: [
            "Beaucoup mieux.",
            "Légèrement mieux.",
            "La même.",
            "Légèrement pire.",
            "Beaucoup pire."
        ]
    }
];

// Copenhagen Neck Disability Scale
export const COPENHAGEN_QUESTIONS_FR: CopenhagenQuestion[] = [
    { id: 1, text: "Pouvez-vous dormir la nuit sans que la douleur au cou n'interfère ?" },
    { id: 2, text: "Pouvez-vous gérer les activités quotidiennes sans que la douleur au cou ne réduise les niveaux d'activité ?" },
    { id: 3, text: "Pouvez-vous gérer les activités quotidiennes sans l'aide des autres ?" },
    { id: 4, text: "Pouvez-vous vous habiller le matin sans prendre plus de temps que d'habitude ?" },
    { id: 5, text: "Pouvez-vous vous pencher au-dessus du lavabo pour vous brosser les dents sans avoir mal au cou ?" },
    { id: 6, text: "Passez-vous plus de temps que d'habitude à la maison à cause de la douleur au cou ?" },
    { id: 7, text: "Êtes-vous empêché de soulever des objets pesant de 2 à 4 kg à cause de la douleur au cou ?" },
    { id: 8, text: "Avez-vous réduit votre activité de lecture à cause de la douleur au cou ?" },
    { id: 9, text: "Avez-vous été dérangé par des maux de tête pendant la période où vous avez eu mal au cou ?" },
    { id: 10, text: "Sentez-vous que votre capacité à vous concentrer est réduite à cause de la douleur au cou ?" },
    { id: 11, text: "Êtes-vous empêché de participer à vos activités de loisirs habituelles à cause de la douleur au cou ?" },
    { id: 12, text: "Restez-vous au lit plus longtemps que d'habitude à cause de la douleur au cou ?" },
    { id: 13, text: "Sentez-vous que la douleur au cou a influencé votre relation affective avec votre famille la plus proche ?" },
    { id: 14, text: "Avez-vous dû renoncer au contact social avec d'autres personnes au cours des deux dernières semaines à cause de la douleur au cou ?" },
    { id: 15, text: "Sentez-vous que la douleur au cou influencera votre avenir ?" }
];

export const COPENHAGEN_RATING_LABELS = [2, 1, 0];
export const COPENHAGEN_RATING_DESCRIPTIONS = ["Oui", "Parfois", "Non"];


// DASH (Disabilities of the Arm, Shoulder and Hand)
export const DASH_QUESTIONS_FR: DASHQuestion[] = [
  { id: 1, text: 'Ouvrir un bocal neuf ou une bouteille difficile à ouvrir.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 2, text: 'Écrire.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 3, text: 'Tourner une clé.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 4, text: 'Préparer un repas.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 5, text: 'Pousser une porte lourde.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 6, text: 'Placer un objet sur une étagère au-dessus de votre tête.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 7, text: 'Faire des gros travaux ménagers (laver les murs, les planchers).', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 8, text: 'Jardiner ou faire des travaux extérieurs.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 9, text: 'Faire un lit.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 10, text: 'Transporter un sac d’épicerie ou une mallette.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 11, text: 'Transporter un objet lourd (plus de 5 kg).', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 12, text: 'Changer une ampoule au plafond.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 13, text: 'Laver ou sécher vos cheveux.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 14, text: 'Laver votre dos.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 15, text: 'Mettre un chandail.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 16, text: 'Utiliser un couteau pour couper de la nourriture.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 17, text: 'Participer à des activités récréatives qui demandent peu d’effort (jouer aux cartes, tricoter).', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 18, text: 'Participer à des activités récréatives dans lesquelles vous forcez avec votre bras, votre épaule ou votre main (jouer au golf, marteler, jouer au tennis).', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 19, text: 'Participer à des activités récréatives dans lesquelles vous bougez votre bras librement (jouer au frisbee, au badminton).', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 20, text: 'Vous déplacer (vous rendre d’un endroit à un autre).', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 21, text: 'Avoir des relations sexuelles.', options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Incapable"] },
  { id: 22, text: "Au cours de la dernière semaine, à quel point le problème de votre bras, de votre épaule ou de votre main a-t-il nui à vos activités sociales habituelles avec votre famille, vos amis, vos voisins ou avec des groupes?", options: ["Pas du tout", "Légèrement", "Modérément", "Considérablement", "Énormément"] },
  { id: 23, text: 'Au cours de la dernière semaine, avez-vous été limité dans votre travail ou dans vos autres activités quotidiennes à cause du problème de votre bras, de votre épaule ou de votre main?', options: ["Pas du tout limité", "Légèrement limité", "Modérément limité", "Très limité", "Incapable"] },
  { id: 24, text: "Douleur au bras, à l'épaule ou à la main.", options: ["Aucune", "Légère", "Modérée", "Sévère", "Extrême"] },
  { id: 25, text: "Douleur au bras, à l'épaule ou à la main LORSQUE VOUS FAITES UNE ACTIVITÉ SPÉCIFIQUE.", options: ["Aucune", "Légère", "Modérée", "Sévère", "Extrême"] },
  { id: 26, text: "Picotements (fourmillements) au bras, à l'épaule ou à la main.", options: ["Aucuns", "Légers", "Modérés", "Sévères", "Extrêmes"] },
  { id: 27, text: "Faiblesse au bras, à l'épaule ou à la main.", options: ["Aucune", "Légère", "Modérée", "Sévère", "Extrême"] },
  { id: 28, text: "Raideur au bras, à l'épaule ou à la main.", options: ["Aucune", "Légère", "Modérée", "Sévère", "Extrême"] },
  { id: 29, text: "Au cours de la dernière semaine, quel degré de difficulté avez-vous eu à dormir à cause de la douleur à votre bras, à votre épaule ou à votre main?", options: ["Aucune difficulté", "Difficulté légère", "Difficulté modérée", "Grande difficulté", "Tellement de difficulté que je ne peux pas dormir"] },
  { id: 30, text: "Je me sens moins compétent(e), moins confiant(e) ou moins utile à cause du problème de mon bras, de mon épaule ou de ma main.", options: ["Pas du tout d'accord", "Pas d'accord", "Neutre", "D'accord", "Tout à fait d'accord"] }
];
export const DASH_RATING_LABELS = [1, 2, 3, 4, 5];

// Oxford Shoulder Score (OSS)
export const OSS_QUESTIONS_FR: OSSQuestion[] = [
    { id: 1, text: "Comment décririez-vous la pire douleur que vous avez eue à votre épaule ?", options: ["Aucune douleur", "Douleur légère", "Douleur modérée", "Forte douleur", "Douleur insupportable"] },
    { id: 2, text: "Avez-vous eu des difficultés pour vous habiller seul(e) à cause de votre épaule ?", options: ["Aucune difficulté", "Quelques difficultés", "Difficultés modérées", "Enormément de difficultés", "Impossible"] },
    { id: 3, text: "Avez-vous eu des difficultés pour monter dans une voiture (ou en descendre) ou pour utiliser les transports en commun à cause de votre épaule ?", options: ["Aucune difficulté", "Quelques difficultés", "Difficultés modérées", "Enormément de difficultés", "Impossible"] },
    { id: 4, text: "Avez-vous été capable d'utiliser un couteau et une fourchette en même temps ?", options: ["Oui, facilement", "Avec quelques difficultés", "Avec des difficultés modérées", "Avec énormément de difficultés", "Non, impossible"] },
    { id: 5, text: "Avez-vous pu (ou auriez-vous pu) faire les courses seul(e) ?", options: ["Oui, facilement", "Avec quelques difficultés", "Avec des difficultés modérées", "Avec énormément de difficultés", "Non, impossible"] },
    { id: 6, text: "Avez-vous pu (ou auriez-vous pu) porter un plateau repas à travers une pièce ?", options: ["Oui, facilement", "Avec quelques difficultés", "Avec des difficultés modérées", "Avec énormément de difficultés", "Non, impossible"] },
    { id: 7, text: "Avez-vous pu (ou auriez-vous pu) vous coiffer les cheveux avec votre bras atteint ?", options: ["Oui, facilement", "Avec quelques difficultés", "Avec des difficultés modérées", "Avec énormément de difficultés", "Non, impossible"] },
    { id: 8, text: "Votre sommeil a-t-il été perturbé par la douleur de votre épaule ?", options: ["Jamais", "Seulement 1 ou 2 nuits", "Quelques nuits", "La plupart des nuits", "Toutes les nuits"] },
    { id: 9, text: "La douleur de votre épaule vous a-t-elle gêné(e) dans votre travail ou vos tâches quotidiennes ?", options: ["Pas du tout", "Un petit peu", "Modérément", "Énormément", "Totalement"] },
    { id: 10, text: "Êtes-vous obligé(e) de prendre des médicaments contre la douleur à cause de votre épaule ?", options: ["Non", "Seulement quand c'est nécessaire", "Oui, tous les jours", "Oui, des médicaments forts", "Oui, des médicaments très forts"] },
    { id: 11, text: "Avez-vous eu des difficultés pour laver et sécher votre corps à cause de votre épaule ?", options: ["Aucune difficulté", "Quelques difficultés", "Difficultés modérées", "Enormément de difficultés", "Impossible"] },
    { id: 12, text: "Avez-vous pu suspendre votre linge à un fil à linge à hauteur des yeux ?", options: ["Oui, facilement", "Avec quelques difficultés", "Avec des difficultés modérées", "Avec énormément de difficultés", "Non, impossible"] }
];
export const OSS_RATING_LABELS = [4, 3, 2, 1, 0]; // Best to worst

// SPADI (Shoulder Pain and Disability Index)
export const SPADI_PAIN_QUESTIONS_FR: SPADIQuestion[] = [
  { id: 1, text: "Au pire ?", scale: 'pain' },
  { id: 2, text: "En vous allongeant sur le côté atteint ?", scale: 'pain' },
  { id: 3, text: "En tendant la main pour prendre quelque chose sur une étagère élevée ?", scale: 'pain' },
  { id: 4, text: "En touchant la nuque ?", scale: 'pain' },
  { id: 5, text: "En poussant avec le bras atteint ?", scale: 'pain' }
];

export const SPADI_DISABILITY_QUESTIONS_FR: SPADIQuestion[] = [
  { id: 6, text: "Laver vos cheveux ?", scale: 'disability' },
  { id: 7, text: "Laver votre dos ?", scale: 'disability' },
  { id: 8, text: "Mettre une chemise ou un chemisier ?", scale: 'disability' },
  { id: 9, text: "Mettre un pantalon ?", scale: 'disability' },
  { id: 10, text: "Porter un objet de 5 kg ?", scale: 'disability' },
  { id: 11, text: "Sortir quelque chose de votre poche arrière ?", scale: 'disability' },
  { id: 12, text: "Placer un objet sur une étagère élevée ?", scale: 'disability' },
  { id: 13, text: "Changer une ampoule au-dessus de votre tête ?", scale: 'disability' }
];

export const ALL_SPADI_QUESTIONS_FR = [...SPADI_PAIN_QUESTIONS_FR, ...SPADI_DISABILITY_QUESTIONS_FR];
export const SPADI_RATING_LABELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// EVA / VAS
export const VAS_QUESTION_FR = { text: "Sur une échelle de 0 à 10, à quel point évaluez-vous votre douleur thoracique actuelle ? (0 = aucune douleur, 10 = la pire douleur imaginable)" };


// Oswestry Thoracic Pain Disability Questionnaire
export const OSWESTRY_THORACIC_QUESTIONS_FR: OswestryThoracicQuestion[] = [
    { id: 1, section: "Intensité de la douleur", options: ["Je peux supporter la douleur sans avoir besoin de prendre de médicaments.", "La douleur est gênante mais je peux la gérer sans prendre de médicaments.", "Les analgésiques procurent un soulagement complet de la douleur.", "Les analgésiques procurent un soulagement modéré de la douleur.", "Les analgésiques procurent très peu de soulagement de la douleur.", "Les analgésiques n'ont aucun effet sur la douleur et je ne les prends pas."] },
    { id: 2, section: "Soins personnels (se laver, s'habiller)", options: ["Je peux m'occuper de moi-même normalement sans causer de douleur supplémentaire.", "Je peux m'occuper de moi-même normalement mais cela cause une douleur supplémentaire.", "C'est douloureux de m'occuper de moi-même et je suis lent et prudent.", "J'ai besoin d'aide mais je parviens à gérer la plupart de mes soins personnels.", "J'ai besoin d'aide tous les jours pour la plupart des aspects des soins personnels.", "Je ne m'habille pas, je me lave avec difficulté et je reste au lit."] },
    { id: 3, section: "Soulever", options: ["Je peux soulever des objets lourds sans douleur supplémentaire.", "Je peux soulever des objets lourds mais cela me donne une douleur supplémentaire.", "La douleur m'empêche de soulever des objets lourds du sol, mais je peux y arriver s'ils sont placés de manière pratique, par ex. sur une table.", "La douleur m'empêche de soulever des objets lourds mais je peux gérer des poids légers à moyens s'ils sont placés de manière pratique.", "Je ne peux soulever que des poids très légers.", "Je ne peux rien soulever ni porter du tout."] },
    { id: 4, section: "Marcher", options: ["La douleur ne m'empêche pas de marcher sur n'importe quelle distance.", "La douleur m'empêche de marcher sur plus d'un kilomètre.", "La douleur m'empêche de marcher sur plus de 500 mètres.", "La douleur m'empêche de marcher sur plus de 100 mètres.", "Je ne peux marcher qu'à l'aide d'une canne ou de béquilles.", "Je suis au lit la plupart du temps et je dois ramper jusqu'aux toilettes."] },
    { id: 5, section: "S'asseoir", options: ["Je peux m'asseoir dans n'importe quel fauteuil aussi longtemps que je le souhaite.", "Je ne peux m'asseoir que dans mon fauteuil préféré aussi longtemps que je le souhaite.", "La douleur m'empêche de m'asseoir plus d'une heure.", "La douleur m'empêche de m'asseoir plus de 30 minutes.", "La douleur m'empêche de m'asseoir plus de 10 minutes.", "La douleur m'empêche de m'asseoir du tout."] },
    { id: 6, section: "Se tenir debout", options: ["Je peux me tenir debout aussi longtemps que je le souhaite sans douleur supplémentaire.", "Je peux me tenir debout aussi longtemps que je le souhaite mais cela me donne une douleur supplémentaire.", "La douleur m'empêche de me tenir debout plus d'une heure.", "La douleur m'empêche de me tenir debout plus de 30 minutes.", "La douleur m'empêche de me tenir debout plus de 10 minutes.", "La douleur m'empêche de me tenir debout du tout."] },
    { id: 7, section: "Dormir", options: ["La douleur ne m'empêche pas de bien dormir.", "Je ne peux dormir qu'avec des somnifères.", "Même lorsque je prends des somnifères, je dors moins de 6 heures.", "Même lorsque je prends des somnifères, je dors moins de 4 heures.", "Même lorsque je prends des somnifères, je dors moins de 2 heures.", "La douleur m'empêche de dormir du tout."] },
    { id: 8, section: "Vie sociale", options: ["Ma vie sociale est normale et ne me cause aucune douleur supplémentaire.", "Ma vie sociale est normale mais augmente l'intensité de ma douleur.", "La douleur n'a aucun effet significatif sur ma vie sociale, à part limiter mes activités plus énergiques, par ex. le sport, etc.", "La douleur a restreint ma vie sociale et je ne sors pas aussi souvent.", "La douleur a confiné ma vie sociale à ma maison.", "Je n'ai aucune vie sociale à cause de ma douleur."] },
    { id: 9, section: "Voyager", options: ["Je peux voyager n'importe où sans douleur.", "Je peux voyager n'importe où mais cela me donne une douleur supplémentaire.", "La douleur est mauvaise mais je gère des trajets de plus de 2 heures.", "La douleur me limite à des trajets de moins d'une heure.", "La douleur me limite aux courts trajets nécessaires de moins de 30 minutes.", "La douleur m'empêche de voyager sauf pour recevoir un traitement."] },
    { id: 10, section: "Respiration", options: ["Ma respiration n'est pas affectée par la douleur.", "Je dois faire attention à ma respiration à cause de la douleur.", "La douleur rend ma respiration superficielle et rapide.", "La douleur m'empêche de respirer profondément.", "La douleur m'empêche de tousser ou d'éternuer.", "Toute activité impliquant la respiration est douloureuse."] }
];

// IKDC
export const IKDC_QUESTIONS_FR: IKDCQuestion[] = [
    { id: '1', text: "Quel est le plus haut niveau d'activité que vous êtes capable de pratiquer sans douleur significative au genou ?", type: 'select', options: [{ text: "Activité très intense comme sauter ou pivoter sur un sol dur", score: 4 }, { text: "Activité intense comme le travail lourd, le ski ou le tennis", score: 3 }, { text: "Activité modérée comme le jogging ou la course", score: 2 }, { text: "Activité légère comme la marche, le travail léger ou la natation", score: 1 }, { text: "Incapable de pratiquer une des activités ci-dessus à cause du genou", score: 0 }] },
    { id: '2', text: "À quelle fréquence ressentez-vous de la douleur ?", type: 'scale' },
    { id: '3', text: "Si vous ressentez de la douleur, quelle est son intensité ?", type: 'scale' },
    { id: '4', text: "À quelle fréquence votre genou gonfle-t-il ?", type: 'scale' },
    { id: '5', text: "Votre genou se bloque-t-il ou se coince-t-il ?", type: 'scale' },
    { id: '6', text: "Votre genou cède-t-il ou se dérobe-t-il ?", type: 'scale' },
    { id: '7', text: "Quel est votre niveau de fonction actuel du genou ?", type: 'scale' },
    { id: '8a', text: "Votre genou vous pose-t-il problème ?", type: 'yesno' },
    { id: '8b', text: "Dans l'affirmative, dans quelle mesure est-ce un problème ?", type: 'select', options: [{ text: "Problème léger" }, { text: "Problème modéré" }, { text: "Problème sévère" }] },
    {
        id: '9', text: "Comment votre genou affecte-t-il votre capacité à :", type: 'function',
        subQuestions: [
            { id: '9a', text: "Monter les escaliers", type: 'select', options: [{ text: "Aucune difficulté" }, { text: "Difficulté légère" }, { text: "Difficulté modérée" }, { text: "Difficulté sévère" }, { text: "Incapable" }] },
            { id: '9b', text: "Descendre les escaliers", type: 'select', options: [{ text: "Aucune difficulté" }, { text: "Difficulté légère" }, { text: "Difficulté modérée" }, { text: "Difficulté sévère" }, { text: "Incapable" }] },
            { id: '9c', text: "Se lever d'une chaise", type: 'select', options: [{ text: "Aucune difficulté" }, { text: "Difficulté légère" }, { text: "Difficulté modérée" }, { text: "Difficulté sévère" }, { text: "Incapable" }] },
            { id: '9d', text: "S'accroupir", type: 'select', options: [{ text: "Aucune difficulté" }, { text: "Difficulté légère" }, { text: "Difficulté modérée" }, { text: "Difficulté sévère" }, { text: "Incapable" }] },
            { id: '9e', text: "S'agenouiller sur l'avant du genou", type: 'select', options: [{ text: "Aucune difficulté" }, { text: "Difficulté légère" }, { text: "Difficulté modérée" }, { text: "Difficulté sévère" }, { text: "Incapable" }] }
        ]
    },
    { id: '10a', text: "Avez-vous dû modifier votre style de vie pour éviter des activités potentiellement dommageables à votre genou ?", type: 'yesno' },
    { id: '10b', text: "Si oui, dans quelle mesure avez-vous modifié votre style de vie ?", type: 'scale' }
];

// Lysholm Knee Scoring Scale
export const LYSHOLM_QUESTIONS_FR: LysholmQuestion[] = [
    { id: 1, section: "Boiterie", options: [{ text: 'Absente', score: 5 }, { text: 'Légère ou périodique', score: 3 }, { text: 'Constante et modérée', score: 2 }, { text: 'Sévère', score: 0 }] },
    { id: 2, section: "Support", options: [{ text: 'Aucun', score: 5 }, { text: "Canne ou béquilles à l'extérieur", score: 2 }, { text: 'Une canne en permanence', score: 1 }, { text: 'Deux béquilles', score: 0 }] },
    { id: 3, section: "Verrouillage", options: [{ text: 'Aucun', score: 15 }, { text: 'Sensation de blocage mais pas de verrouillage réel', score: 10 }, { text: 'Verrouillage occasionnel', score: 5 }, { text: 'Verrouillage fréquent', score: 2 }, { text: 'Genou bloqué au moment de l’examen', score: 0 }] },
    { id: 4, section: "Instabilité", options: [{ text: 'Jamais', score: 25 }, { text: 'Rarement, lors d’efforts athlétiques', score: 20 }, { text: 'Fréquemment, lors d’efforts athlétiques', score: 15 }, { text: "Occasionnellement, dans la vie de tous les jours", score: 10 }, { text: 'Fréquemment, dans la vie de tous les jours', score: 5 }, { text: 'À chaque pas', score: 0 }] },
    { id: 5, section: "Douleur", options: [{ text: 'Absente', score: 25 }, { text: 'Légère ou intermittente lors d’efforts importants', score: 20 }, { text: 'Marquée lors d’efforts importants', score: 15 }, { text: 'Marquée lors ou après la marche sur terrain plat', score: 10 }, { text: 'Constante', score: 5 }, { text: 'Douleur de repos', score: 0 }] },
    { id: 6, section: "Gonflement", options: [{ text: 'Aucun', score: 10 }, { text: 'Avec des efforts importants', score: 5 }, { text: 'Avec des efforts ordinaires', score: 2 }, { text: 'Constant', score: 0 }] },
    { id: 7, section: "Montée des escaliers", options: [{ text: 'Sans difficulté', score: 10 }, { text: 'Légère difficulté', score: 8 }, { text: 'Une marche à la fois', score: 5 }, { text: 'Impossible', score: 0 }] },
    { id: 8, section: "Accroupissement", options: [{ text: 'Sans difficulté', score: 5 }, { text: 'Avec difficulté', score: 2 }, { text: 'Impossible', score: 0 }] }
];


// KOOS
export const KOOS_QUESTIONS_FR: KOOSSubscale[] = [
    {
        key: 'symptoms', title: "Symptômes", description: "Ces questions concernent les symptômes de votre genou au cours de la semaine écoulée.",
        questions: [
            { id: 'S1', text: "Votre genou est-il gonflé ?" },
            { id: 'S2', text: "Ressentez-vous une sensation de grincement, de cliquetis ou de claquement lorsque vous bougez votre genou ?" },
            { id: 'S3', text: "Votre genou se bloque-t-il ou se coince-t-il lorsque vous le bougez ?" },
            { id: 'S4', text: "Pouvez-vous tendre complètement votre genou ?" },
            { id: 'S5', text: "Pouvez-vous plier complètement votre genou ?" },
        ]
    },
    {
        key: 'pain', title: "Douleur", description: "Quelle douleur avez-vous ressentie au cours de la semaine écoulée ?",
        questions: [
            { id: 'P1', text: "En tournant/pivotant sur votre genou ?" },
            { id: 'P2', text: "En redressant complètement votre genou ?" },
            { id: 'P3', text: "En pliant complètement votre genou ?" },
            { id: 'P4', text: "En marchant sur une surface plane ?" },
            { id: 'P5', text: "En montant ou descendant les escaliers ?" },
            { id: 'P6', text: "La nuit au lit ?" },
            { id: 'P7', text: "En position assise ou couchée ?" },
            { id: 'P8', text: "En position debout ?" },
        ]
    },
    {
        key: 'adl', title: "Activités de la vie quotidienne", description: "Les questions suivantes concernent votre fonction physique. Veuillez décrire le degré de difficulté que vous avez éprouvé au cours de la semaine écoulée en raison de votre genou.",
        questions: [
            { id: 'A1', text: "Descendre les escaliers ?" },
            { id: 'A2', text: "Monter les escaliers ?" },
            { id: 'A3', text: "Se lever d'une position assise ?" },
            { id: 'A4', text: "Se tenir debout ?" },
            { id: 'A5', text: "Se pencher jusqu'au sol ?" },
            { id: 'A6', text: "Marcher sur une surface plane ?" },
            { id: 'A7', text: "Entrer/sortir d'une voiture ?" },
            { id: 'A8', text: "Faire les courses ?" },
            { id: 'A9', text: "Mettre/retirer des chaussettes ?" },
            { id: 'A10', text: "Se lever du lit ?" },
            { id: 'A11', text: "Prendre un bain ?" },
            { id: 'A12', text: "S'asseoir ?" },
            { id: 'A13', text: "S'accroupir ?" },
            { id: 'A14', text: "S'agenouiller ?" },
        ]
    },
    {
        key: 'sport', title: "Fonction dans le sport et les loisirs", description: "Les questions suivantes concernent votre fonction physique lors du sport et des loisirs. Veuillez décrire le degré de difficulté que vous avez éprouvé au cours de la semaine écoulée en raison de votre genou.",
        questions: [
            { id: 'SP1', text: "Courir ?" },
            { id: 'SP2', text: "Sauter ?" },
            { id: 'SP3', text: "S'arrêter brusquement ?" },
            { id: 'SP4', text: "Pivoter sur votre genou blessé ?" },
            { id: 'SP5', text: "S'agenouiller ?" },
        ]
    },
    {
        key: 'qol', title: "Qualité de vie liée au genou", description: "Les questions suivantes concernent votre confiance en votre genou et votre conscience de celui-ci.",
        questions: [
            { id: 'Q1', text: "À quelle fréquence êtes-vous conscient de votre problème au genou ?" },
            { id: 'Q2', text: "Avez-vous modifié votre style de vie pour éviter des activités potentiellement dommageables à votre genou ?" },
            { id: 'Q3', text: "À quel point avez-vous confiance en votre genou ?" },
            { id: 'Q4', text: "En général, quelles difficultés avez-vous avec votre genou ?" },
        ]
    }
];

export const KOOS_RATING_LABELS = [0, 1, 2, 3, 4];
export const KOOS_RATING_DESCRIPTIONS = ["Aucun(e)", "Léger/Légère", "Modéré(e)", "Sévère", "Extrême"];
export const KOOS_RATING_DESCRIPTIONS_FREQ = ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"];
export const KOOS_RATING_DESCRIPTIONS_ABILITY = ["Toujours", "Souvent", "Parfois", "Rarement", "Jamais"];
export const KOOS_RATING_DESCRIPTIONS_QOL_FREQ = ["Jamais", "Mensuel", "Hebdomadaire", "Quotidien", "Constamment"];
export const KOOS_RATING_DESCRIPTIONS_QOL_MODIF = ["Pas du tout", "Légèrement", "Modérément", "Considérablement", "Totalement"];
export const KOOS_RATING_DESCRIPTIONS_QOL_GENE = ["Pas du tout", "Peu", "Modérément", "Beaucoup", "Énormément"];

// Oxford Elbow Score (OES)
export const OES_QUESTIONS_FR: OESQuestion[] = [
  { id: 1, text: "Comment décririez-vous la douleur que vous avez habituellement dans votre coude ?", options: ["Aucune", "Très légère", "Légère", "Modérée", "Sévère"] },
  { id: 2, text: "Votre coude vous a-t-il déjà empêché de dormir la nuit ?", options: ["Jamais", "1 ou 2 nuits par semaine", "Plusieurs nuits par semaine", "La plupart des nuits", "Chaque nuit"] },
  { id: 3, text: "Avez-vous remarqué un clic, un claquement ou tout autre bruit provenant de votre coude ?", options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] },
  { id: 4, text: "Avez-vous déjà ressenti une sensation de blocage ou de coincement dans votre coude ?", options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] },
  { id: 5, text: "Avez-vous eu des difficultés à vous laver et à vous sécher ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
  { id: 6, text: "Avez-vous eu des difficultés à vous habiller ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
  { id: 7, text: "Avez-vous eu des difficultés à faire vos courses ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
  { id: 8, text: "Avez-vous eu des difficultés à utiliser les transports en commun ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
  { id: 9, text: "Avez-vous eu des difficultés à vous peigner ou vous brosser les cheveux ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
  { id: 10, text: "Avez-vous été capable de manger normalement (par exemple, couper les aliments et amener la nourriture à votre bouche) ?", options: ["Aucun problème", "Un peu de difficulté", "Difficulté modérée", "Extrême difficulté", "Impossible à faire"] },
  { id: 11, text: "Avez-vous eu des difficultés à effectuer des tâches ménagères (par exemple, bricolage, jardinage, nettoyage) ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
  { id: 12, text: "Avez-vous eu des difficultés à pratiquer vos sports ou loisirs habituels ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] }
];

// Patient-Rated Tennis Elbow Evaluation (PRTEE)
export const PRTEE_PAIN_QUESTIONS_FR: PRTEEQuestion[] = [
  { id: 1, text: "Douleur au repos", scale: 'pain' },
  { id: 2, text: "En effectuant des activités qui impliquent la flexion du poignet", scale: 'pain' },
  { id: 3, text: "En effectuant des activités qui impliquent l'extension du poignet", scale: 'pain' },
  { id: 4, text: "En portant un objet de 2-3 kg", scale: 'pain' },
  { id: 5, text: "En jetant un objet", scale: 'pain' },
];
export const PRTEE_SPECIFIC_ACTIVITIES_QUESTIONS_FR: PRTEEQuestion[] = [
  { id: 6, text: "Tourner une poignée de porte", scale: 'specific_activity' },
  { id: 7, text: "Soulever un objet lourd", scale: 'specific_activity' },
  { id: 8, text: "Serrer la main de quelqu'un", scale: 'specific_activity' },
  { id: 9, text: "Utiliser un couteau pour couper des aliments", scale: 'specific_activity' },
  { id: 10, text: "Serrer un chiffon", scale: 'specific_activity' },
];
export const PRTEE_USUAL_ACTIVITIES_QUESTIONS_FR: PRTEEQuestion[] = [
  { id: 11, text: "Activités professionnelles habituelles", scale: 'usual_activity' },
  { id: 12, text: "Activités ménagères habituelles", scale: 'usual_activity' },
  { id: 13, text: "Activités récréatives habituelles avec des mouvements de bras répétitifs", scale: 'usual_activity' },
  { id: 14, text: "Activités récréatives habituelles avec des mouvements de bras non répétitifs", scale: 'usual_activity' },
  { id: 15, text: "Soins personnels habituels", scale: 'usual_activity' },
];
export const ALL_PRTEE_QUESTIONS_FR = [...PRTEE_PAIN_QUESTIONS_FR, ...PRTEE_SPECIFIC_ACTIVITIES_QUESTIONS_FR, ...PRTEE_USUAL_ACTIVITIES_QUESTIONS_FR];

// Patient-Rated Wrist Evaluation (PRWE)
export const PRWE_PAIN_QUESTIONS_FR: PRWEQuestion[] = [
  { id: 1, text: "Douleur au repos", scale: 'pain' },
  { id: 2, text: "Douleur lors du mouvement du poignet", scale: 'pain' },
  { id: 3, text: "Douleur en soulevant des objets", scale: 'pain' },
  { id: 4, text: "Douleur en portant un objet de 5 kg", scale: 'pain' },
  { id: 5, text: "Fréquence de la douleur", scale: 'pain' },
];
export const PRWE_SPECIFIC_ACTIVITIES_QUESTIONS_FR: PRWEQuestion[] = [
  { id: 6, text: "Tourner une poignée de porte", scale: 'specific_activity' },
  { id: 7, text: "Couper de la viande", scale: 'specific_activity' },
  { id: 8, text: "Soulever une casserole pleine d'eau", scale: 'specific_activity' },
  { id: 9, text: "Se lever d'une chaise en utilisant les bras", scale: 'specific_activity' },
  { id: 10, text: "Porter un sac d'épicerie", scale: 'specific_activity' },
];
export const PRWE_USUAL_ACTIVITIES_QUESTIONS_FR: PRWEQuestion[] = [
  { id: 11, text: "Travail habituel", scale: 'usual_activity' },
  { id: 12, text: "Hygiène personnelle", scale: 'usual_activity' },
  { id: 13, text: "S'habiller", scale: 'usual_activity' },
  { id: 14, text: "Activités de loisirs", scale: 'usual_activity' },
  { id: 15, text: "Activités ménagères", scale: 'usual_activity' },
];
export const ALL_PRWE_QUESTIONS_FR = [...PRWE_PAIN_QUESTIONS_FR, ...PRWE_SPECIFIC_ACTIVITIES_QUESTIONS_FR, ...PRWE_USUAL_ACTIVITIES_QUESTIONS_FR];

// Michigan Hand Outcomes Questionnaire (MHQ)
export const MHQ_QUESTIONS_FR: MHQQuestion[] = [
  { id: 'I_A_1', text: "Dans l'ensemble, comment évalueriez-vous la fonction de votre main droite ?", section: 'I_A', options: ["Très bonne", "Bonne", "Passable", "Mauvaise", "Très mauvaise"] },
  { id: 'I_B_1', text: "Dans l'ensemble, comment évalueriez-vous la fonction de votre main gauche ?", section: 'I_B', options: ["Très bonne", "Bonne", "Passable", "Mauvaise", "Très mauvaise"] },
  { id: 'II_A_1', text: "Tourner une clé (droite)", section: 'II_A', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_A_2', text: "Écrire (droite)", section: 'II_A', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_A_3', text: "Boutonner une chemise (droite)", section: 'II_A', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_A_4', text: "Utiliser une fourchette (droite)", section: 'II_A', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_A_5', text: "Porter un sac lourd (droite)", section: 'II_A', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_B_1', text: "Tourner une clé (gauche)", section: 'II_B', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_B_2', text: "Écrire (gauche)", section: 'II_B', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_B_3', text: "Boutonner une chemise (gauche)", section: 'II_B', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_B_4', text: "Utiliser une fourchette (gauche)", section: 'II_B', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_B_5', text: "Porter un sac lourd (gauche)", section: 'II_B', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_C_1', text: "Ouvrir un bocal (deux mains)", section: 'II_C', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'II_C_2', text: "Attacher un lacet (deux mains)", section: 'II_C', options: ["Très facile", "Facile", "Un peu difficile", "Très difficile", "Impossible"] },
  { id: 'IV_A_1', text: "À quelle fréquence avez-vous eu mal à la main droite au cours des 4 dernières semaines ?", section: 'IV_A', options: ["Jamais", "Rarement", "Parfois", "Souvent", "Tout le temps"] },
  { id: 'IV_A_2', text: "Quelle a été l'intensité de votre douleur à la main droite au cours des 4 dernières semaines ?", section: 'IV_A', options: ["Aucune", "Très légère", "Légère", "Modérée", "Sévère"] },
  { id: 'IV_B_1', text: "À quelle fréquence avez-vous eu mal à la main gauche au cours des 4 dernières semaines ?", section: 'IV_B', options: ["Jamais", "Rarement", "Parfois", "Souvent", "Tout le temps"] },
  { id: 'IV_B_2', text: "Quelle a été l'intensité de votre douleur à la main gauche au cours des 4 dernières semaines ?", section: 'IV_B', options: ["Aucune", "Très légère", "Légère", "Modérée", "Sévère"] },
  { id: 'VI_A_1', text: "Quelle est votre satisfaction concernant la fonction de votre main droite ?", section: 'VI_A', options: ["Très satisfait", "Satisfait", "Neutre", "Insatisfait", "Très insatisfait"] },
  { id: 'VI_B_1', text: "Quelle est votre satisfaction concernant la fonction de votre main gauche ?", section: 'VI_B', options: ["Très satisfait", "Satisfait", "Neutre", "Insatisfait", "Très insatisfait"] },
];

// HOOS-PS (Hip disability and Osteoarthritis Outcome Score - Physical Function Short form)
export const HOOS_PS_QUESTIONS_FR: HOOSPSQuestion[] = [
  { id: 1, text: "Descendre des escaliers", options: ["Absente", "Légère", "Modérée", "Importante", "Extrême"] },
  { id: 2, text: "Monter des escaliers", options: ["Absente", "Légère", "Modérée", "Importante", "Extrême"] },
  { id: 3, text: "Se lever après être resté assis", options: ["Absente", "Légère", "Modérée", "Importante", "Extrême"] },
  { id: 4, text: "Marcher sur un sol plat", options: ["Absente", "Légère", "Modérée", "Importante", "Extrême"] },
  { id: 5, text: "Mettre ses chaussettes ou ses bas", options: ["Absente", "Légère", "Modérée", "Importante", "Extrême"] },
];

// Oxford Hip Score (OHS)
export const OXFORD_HIP_SCORE_QUESTIONS_FR: OHSQuestion[] = [
    { id: 1, text: "Comment décririez-vous la douleur que vous avez habituellement à la hanche ?", options: ["Aucune", "Très légère", "Légère", "Modérée", "Sévère"] },
    { id: 2, text: "Avez-vous eu une douleur soudaine et intense - 'douleur fulgurante' - de votre hanche ?", options: ["Jamais", "Une fois par mois", "Une fois par semaine", "La plupart des jours", "Chaque jour"] },
    { id: 3, text: "Votre hanche vous a-t-elle déjà empêché de dormir la nuit ?", options: ["Jamais", "1 ou 2 nuits par semaine", "Plusieurs nuits par semaine", "La plupart des nuits", "Chaque nuit"] },
    { id: 4, text: "Combien de temps pouvez-vous marcher avant que la douleur de votre hanche ne devienne sévère (avec ou sans bâtons) ?", options: ["Plus de 30 minutes", "16 à 30 minutes", "5 à 15 minutes", "Environ la maison seulement", "Pas du tout / au lit ou en fauteuil"] },
    { id: 5, text: "Après vous être assis pendant un certain temps, avez-vous des difficultés à vous lever de la chaise à cause de votre hanche ?", options: ["Aucune difficulté", "Légère difficulté", "Difficulté modérée", "Difficulté marquée", "Impossible à faire"] },
    { id: 6, text: "Avez-vous boité en marchant ?", options: ["Jamais", "Parfois / sur de longues distances", "Souvent / pas seulement sur de longues distances", "La plupart du temps", "Tout le temps"] },
    { id: 7, text: "Pouvez-vous monter une volée d'escaliers ?", options: ["Facilement", "Avec une légère difficulté", "Avec une difficulté modérée", "Avec une difficulté marquée", "Impossible"] },
    { id: 8, text: "Avez-vous eu des difficultés à vous baisser pour mettre vos chaussettes/bas/collants ?", options: ["Aucune difficulté", "Légère difficulté", "Difficulté modérée", "Difficulté marquée", "Impossible à faire"] },
    { id: 9, text: "Avez-vous pu faire les tâches ménagères (ou le jardinage) ?", options: ["Sans difficulté", "Avec une légère difficulté", "Avec une difficulté modérée", "Avec une difficulté marquée", "Impossible"] },
    { id: 10, text: "Avez-vous eu des difficultés à vous laver et à vous sécher ?", options: ["Aucune", "Un peu", "Modérée", "Extrême", "Impossible à faire"] },
    { id: 11, text: "Avez-vous pu faire vos courses vous-même ?", options: ["Sans difficulté", "Avec une légère difficulté", "Avec une difficulté modérée", "Avec une difficulté marquée", "Impossible"] },
    { id: 12, text: "Avez-vous eu des difficultés à entrer et sortir de la voiture ?", options: ["Aucune", "Légère", "Modérée", "Sévère", "Impossible"] },
];

// HAGOS
export const HAGOS_QUESTIONS_FR: HAGOSSubscale[] = [
    { key: 'symptoms', title: "Symptômes", description: "Les questions suivantes portent sur les symptômes de votre hanche et/ou de votre aine.", questions: [{ id: 'S1', text: "Ressentez-vous une raideur de la hanche ?" }, { id: 'S2', text: "Ressentez-vous un claquement, un blocage ou un accrochage de la hanche ?" }, { id: 'S3', text: "Votre hanche bouge-t-elle moins que la normale ?" }, { id: 'S4', text: "Avez-vous des difficultés à bouger votre hanche ?" }, { id: 'S5', text: "Ressentez-vous une faiblesse dans la région de la hanche et/ou de l'aine ?" }] },
    { key: 'pain', title: "Douleur", description: "Les questions suivantes portent sur la douleur dans votre hanche et/ou votre aine.", questions: [{ id: 'P1', text: "Avez-vous mal à la hanche et/ou à l'aine ?" }, { id: 'P2', text: "Avez-vous une douleur vive dans la hanche et/ou l'aine ?" }] },
    { key: 'adl', title: "Fonction dans la vie quotidienne (AVQ)", description: "Les questions suivantes portent sur les activités de la vie quotidienne.", questions: [{ id: 'AD1', text: "Difficulté à s'habiller (partie inférieure du corps)" }, { id: 'AD2', text: "Difficulté à se lever du lit" }, { id: 'AD3', text: "Difficulté à s'asseoir" }, { id: 'AD4', text: "Difficulté à se lever d'une position assise" }, { id: 'AD5', text: "Difficulté à monter les escaliers" }, { id: 'AD6', text: "Difficulté à courir tout droit" }, { id: 'AD7', text: "Difficulté à sauter" }, { id: 'AD8', text: "Difficulté à tourner/pivoter sur la jambe blessée" }, { id: 'AD9', text: "Difficulté à s'accroupir" }] },
    { key: 'sport', title: "Fonction dans le sport et les loisirs", description: "Les questions suivantes portent sur le sport et les loisirs.", questions: [{ id: 'SR1', text: "Difficulté à courir tout droit" }, { id: 'SR2', text: "Difficulté à sauter" }, { id: 'SR3', text: "Difficulté à s'arrêter brusquement" }, { id: 'SR4', text: "Difficulté à se déplacer latéralement" }, { id: 'SR5', text: "Difficulté à pivoter sur la jambe blessée" }, { id: 'SR6', text: "Difficulté à donner un coup de pied" }] },
    { key: 'pa', title: "Participation à l'activité physique", description: "Les questions suivantes portent sur la participation à l'activité physique.", questions: [{ id: 'PA1', text: "Participez-vous à une activité physique ?" }, { id: 'PA2', text: "Avez-vous réduit votre niveau de participation sportive ?" }] },
    { key: 'qol', title: "Qualité de vie liée à la hanche et/ou à l'aine", description: "Les questions suivantes portent sur la qualité de vie liée à la hanche et/ou à l'aine.", questions: [{ id: 'Q1', text: "Êtes-vous conscient de votre problème de hanche et/ou d'aine ?" }, { id: 'Q2', text: "Avez-vous modifié votre style de vie pour éviter les mouvements qui blessent votre hanche et/ou votre aine ?" }, { id: 'Q3', text: "À quel point avez-vous confiance en votre hanche et/ou votre aine ?" }, { id: 'Q4', text: "À quel point êtes-vous frustré par votre problème de hanche et/ou d'aine ?" }, { id: 'Q5', text: "Êtes-vous inquiet que votre problème de hanche et/ou d'aine s'aggrave ?" }] }
];


// For PFDI-20
export const PFDI_QUESTIONS_FR: PFDIQuestion[] = [
    { id: 1, text: "Sensation de gonflement ou de protubérance dans le vagin" },
    { id: 2, text: "Sensation de quelque chose qui tombe hors du vagin" },
    { id: 3, text: "Pression pelvienne ou lourdeur" },
    { id: 4, text: "Sensation de vidange incomplète de l'intestin après une selle" },
    { id: 5, text: "Besoin de forcer ou de pousser très fort pour avoir une selle" },
    { id: 6, text: "Perte de selles involontaire (solide, liquide ou pâteuse)" },
    { id: 7, text: "Besoin de mettre les doigts dans ou près de votre vagin pour terminer une selle" },
    { id: 8, text: "Constipation" },
    { id: 9, text: "Douleur au bas de l'abdomen" },
    { id: 10, text: "Douleur avec les selles" },
    { id: 11, text: "Selles douloureuses" },
    { id: 12, text: "Perte involontaire de gaz (flatuosités)" },
    { id: 13, text: "Sensation d'un besoin urgent d'aller à la selle" },
    { id: 14, text: "Perte de contrôle de l'intestin avec l'urgence" },
    { id: 15, text: "Besoin d'uriner fréquemment" },
    { id: 16, text: "Perte d'urine liée à une sensation d'urgence" },
    { id: 17, text: "Perte d'urine avec une activité physique" },
    { id: 18, text: "Fuites urinaires en petites quantités (gouttes)" },
    { id: 19, text: "Difficulté à vider votre vessie" },
    { id: 20, text: "Douleur ou inconfort dans la partie inférieure de l'abdomen ou la région génitale" }
];

// For ICIQ-UI SF
export const ICIQ_DATA_FR = {
  q2: { text: "2. Êtes-vous un homme ou une femme?" },
  q3: { 
    text: "3. À quelle fréquence avez-vous des fuites d'urine?", 
    options: [
      { label: "Jamais", value: 0 },
      { label: "Environ une fois par semaine ou moins souvent", value: 1 },
      { label: "Deux ou trois fois par semaine", value: 2 },
      { label: "Environ une fois par jour", value: 3 },
      { label: "Plusieurs fois par jour", value: 4 },
      { label: "Tout le temps", value: 5 },
    ]
  },
  q4: {
    text: "4. Nous aimerions avoir une idée de la quantité d'urine que vous perdez. Quelle quantité d'urine perdez-vous habituellement (que vous portiez une protection ou non)?",
    options: [
      { label: "Aucune", value: 0 },
      { label: "Une petite quantité", value: 2 },
      { label: "Une quantité modérée", value: 4 },
      { label: "Une grande quantité", value: 6 },
    ]
  },
  q5: {
    text: "5. Dans l'ensemble, à quel point les fuites d'urine ont-elles affecté votre vie quotidienne?",
  },
  q6: {
    text: "6. QUAND avez-vous des fuites d'urine? (Veuillez cocher toutes les options qui s'appliquent)",
    options: [
      { label: "Jamais, je n'ai pas de fuites d'urine", key: 'never' },
      { label: "Fuites avant d'arriver aux toilettes", key: 'beforeToilet' },
      { label: "Fuites en toussant ou en éternuant", key: 'coughSneeze' },
      { label: "Fuites pendant le sommeil", key: 'asleep' },
      { label: "Fuites en faisant de l'exercice physique", key: 'active' },
      { label: "Fuites après avoir fini d'uriner, en s'habillant", key: 'finishedUrinating' },
      { label: "Fuites sans raison évidente", key: 'noReason' },
      { label: "Fuites tout le temps", key: 'allTheTime' },
    ]
  }
};

// For FADI
export const FADI_ADL_QUESTIONS_FR: FADIQuestion[] = [
    { id: 1, text: "Se tenir debout", scale: 'adl' },
    { id: 2, text: "Marcher sur un sol plat", scale: 'adl' },
    { id: 3, text: "Marcher sur un sol inégal", scale: 'adl' },
    { id: 4, text: "Monter les escaliers", scale: 'adl' },
    { id: 5, text: "Descendre les escaliers", scale: 'adl' },
    { id: 6, text: "Monter une pente", scale: 'adl' },
    { id: 7, text: "Descendre une pente", scale: 'adl' },
    { id: 8, text: "Activités de la vie quotidienne", scale: 'adl' },
    { id: 9, text: "Activités ménagères lourdes", scale: 'adl' },
    { id: 10, text: "Activités avec la famille", scale: 'adl' },
    { id: 11, text: "Faire du shopping", scale: 'adl' },
    { id: 12, text: "Marcher initialement", scale: 'adl' },
    { id: 13, text: "Marcher environ 10 minutes", scale: 'adl' },
    { id: 14, text: "Marcher environ 20 minutes", scale: 'adl' },
    { id: 15, text: "Activités récréatives à faible impact", scale: 'adl' },
    { id: 16, text: "Soulever des objets lourds", scale: 'adl' },
    { id: 17, text: "Conduire", scale: 'adl' },
    { id: 18, text: "Dormir", scale: 'adl' },
    { id: 19, text: "Activités de loisirs", scale: 'adl' },
    { id: 20, text: "Travail normal", scale: 'adl' },
    { id: 21, text: "Travail physiquement exigeant", scale: 'adl' },
    { id: 22, text: "Niveau de douleur", scale: 'adl' },
    { id: 23, text: "Douleur au repos", scale: 'adl' },
    { id: 24, text: "Douleur avec l'activité", scale: 'adl' },
    { id: 25, text: "Douleur la nuit", scale: 'adl' },
    { id: 26, text: "Raideur le matin", scale: 'adl' },
];

export const FADI_SPORTS_QUESTIONS_FR: FADIQuestion[] = [
    { id: 27, text: "Courir", scale: 'sport' },
    { id: 28, text: "Sauter", scale: 'sport' },
    { id: 29, text: "Atterrir", scale: 'sport' },
    { id: 30, text: "Démarrer et s'arrêter rapidement", scale: 'sport' },
    { id: 31, text: "Couper, changer de direction", scale: 'sport' },
    { id: 32, text: "Activités à faible impact", scale: 'sport' },
    { id: 33, text: "Capacité à performer, niveau normal", scale: 'sport' },
    { id: 34, text: "Capacité à participer, temps souhaité", scale: 'sport' },
];

export const ALL_FADI_QUESTIONS_FR = [...FADI_ADL_QUESTIONS_FR, ...FADI_SPORTS_QUESTIONS_FR];

// For FFIR
export const FFIR_PAIN_QUESTIONS_FR: FFIRQuestion[] = [
    { id: 1, text: "Douleur au pied au premier lever le matin", scale: 'pain' },
    { id: 2, text: "Douleur au pied en marchant pieds nus", scale: 'pain' },
    { id: 3, text: "Douleur au pied en marchant avec des chaussures", scale: 'pain' },
    { id: 4, text: "Douleur au pied à la fin de la journée", scale: 'pain' },
    { id: 5, text: "Douleur au pied en portant des orthèses ou des inserts de chaussures", scale: 'pain' },
    { id: 6, text: "Douleur au pied en portant des chaussures à la mode ou habillées", scale: 'pain' },
];

export const FFIR_STIFFNESS_QUESTIONS_FR: FFIRQuestion[] = [
    { id: 7, text: "Raideur du pied au premier lever le matin", scale: 'stiffness' },
    { id: 8, text: "Raideur du pied après avoir été assis pendant une longue période", scale: 'stiffness' },
];

export const FFIR_DIFFICULTY_QUESTIONS_FR: FFIRQuestion[] = [
    { id: 9, text: "Difficulté à marcher sur un sol inégal", scale: 'difficulty' },
    { id: 10, text: "Difficulté à monter les escaliers", scale: 'difficulty' },
    { id: 11, text: "Difficulté à descendre les escaliers", scale: 'difficulty' },
    { id: 12, text: "Difficulté à monter sur la pointe des pieds", scale: 'difficulty' },
    { id: 13, text: "Difficulté à porter des orthèses ou des inserts de chaussures", scale: 'difficulty' },
    { id: 14, text: "Difficulté à marcher à un rythme rapide", scale: 'difficulty' },
    { id: 15, text: "Difficulté à marcher sur une courte distance", scale: 'difficulty' },
    { id: 16, text: "Difficulté à marcher sur une longue distance", scale: 'difficulty' },
    { id: 17, text: "Difficulté à monter sur une échelle", scale: 'difficulty' },
    { id: 18, text: "Difficulté avec les activités ménagères légères", scale: 'difficulty' },
    { id: 19, text: "Difficulté avec les activités ménagères lourdes", scale: 'difficulty' },
    { id: 20, text: "Difficulté à faire des courses", scale: 'difficulty' },
    { id: 21, text: "Difficulté à monter et descendre d'un bain", scale: 'difficulty' },
    { id: 22, text: "Difficulté à conduire une voiture", scale: 'difficulty' },
    { id: 23, text: "Difficulté à monter dans les transports en commun", scale: 'difficulty' },
];

export const FFIR_ACTIVITY_QUESTIONS_FR: FFIRQuestion[] = [
    { id: 24, text: "Resté à la maison la plupart de la journée", scale: 'activity' },
    { id: 25, text: "Limité vos activités quotidiennes", scale: 'activity' },
    { id: 26, text: "Utilisé une canne, des béquilles ou un déambulateur", scale: 'activity' },
    { id: 27, text: "Limité vos activités de plein air", scale: 'activity' },
    { id: 28, text: "Limité vos activités sportives", scale: 'activity' },
];

export const FFIR_SOCIAL_QUESTIONS_FR: FFIRQuestion[] = [
    { id: 29, text: "Frustré à cause de vos problèmes de pieds", scale: 'social' },
    { id: 30, text: "Déprimé à cause de vos problèmes de pieds", scale: 'social' },
    { id: 31, text: "Anxieux à cause de vos problèmes de pieds", scale: 'social' },
    { id: 32, text: "Conscient de vos problèmes de pieds en public", scale: 'social' },
    { id: 33, text: "Dépendant des autres à cause de vos problèmes de pieds", scale: 'social' },
    { id: 34, text: "Gêné par l'apparence de vos pieds", scale: 'social' },
];

export const ALL_FFIR_QUESTIONS_FR = [ ...FFIR_PAIN_QUESTIONS_FR, ...FFIR_STIFFNESS_QUESTIONS_FR, ...FFIR_DIFFICULTY_QUESTIONS_FR, ...FFIR_ACTIVITY_QUESTIONS_FR, ...FFIR_SOCIAL_QUESTIONS_FR];

// FOGQ
export const FOGQ_QUESTIONS_FR: FOGQQuestion[] = [
    { id: 1, text: "Indiquez votre accord avec l'affirmation suivante : 'Je marche comme si mes pieds étaient collés au sol'.", options: ["Pas du tout d'accord", "Plutôt d'accord", "D'accord", "Tout à fait d'accord"] },
    { id: 2, text: "Pendant la marche, vous sentez-vous comme si vous étiez sur le point de commencer à marcher, mais vos pieds restent bloqués ?", options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] },
    { id: 3, text: "Le 'freezing' ou le blocage de la marche vous arrive-t-il ?", options: ["Jamais", "Environ une fois par mois", "Environ une fois par semaine", "Environ une fois par jour", "Plus d'une fois par jour"] },
    { id: 4, text: "Quelle est la durée typique de votre plus long épisode de 'freezing' ?", options: ["Moins de 1 seconde", "1 à 2 secondes", "3 à 5 secondes", "5 à 10 secondes", "Plus de 10 secondes"] },
    { id: 5, text: "À quel point le 'freezing' affecte-t-il votre vie quotidienne ?", options: ["Pas du tout", "Légèrement", "Modérément", "Sévèrement", "Extrêmement"] },
    { id: 6, text: "Avez-vous peur de tomber à cause du 'freezing' ?", options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] }
];

// FES
export const FES_QUESTIONS_FR: FESQuestion[] = [
    { id: 1, text: "Nettoyer la maison (par exemple, passer l'aspirateur, faire la poussière)" },
    { id: 2, text: "Préparer des repas simples" },
    { id: 3, text: "Prendre un bain ou une douche" },
    { id: 4, text: "S'habiller ou se déshabiller" },
    { id: 5, text: "Se lever d'une chaise" },
    { id: 6, text: "Monter ou descendre les escaliers" },
    { id: 7, text: "Tendre la main pour attraper quelque chose au-dessus de votre tête ou sur le sol" },
    { id: 8, text: "Marcher dans la maison" },
    { id: 9, text: "Répondre au téléphone ou à la porte" },
    { id: 10, text: "Aller faire les courses" }
];
export const FES_RATING_LABELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Berg Balance Scale
export const BERG_QUESTIONS_FR: BergQuestion[] = [
    { id: 1, text: "Passage de la position assise à la position debout", instructions: "Veuillez vous lever. Essayez de ne pas utiliser vos mains pour vous soutenir.", options: ["Capable de se tenir debout en toute sécurité avec une utilisation minimale des mains", "Capable de se tenir debout indépendamment en utilisant les mains", "Capable de se tenir debout en utilisant les mains après plusieurs tentatives", "Nécessite une aide minime pour se lever ou se stabiliser", "Nécessite une aide modérée ou maximale pour se lever"] },
    { id: 2, text: "Se tenir debout sans support", instructions: "Veuillez vous tenir debout pendant deux minutes sans vous tenir.", options: ["Capable de se tenir debout en toute sécurité pendant 2 minutes", "Capable de se tenir debout pendant 2 minutes avec supervision", "Capable de se tenir debout pendant 30 secondes sans support", "Nécessite plusieurs tentatives pour se tenir debout pendant 30 secondes sans support", "Incapable de se tenir debout 30 secondes sans aide"] },
    { id: 3, text: "S'asseoir sans support", instructions: "Veuillez vous asseoir les bras croisés sur la poitrine pendant 2 minutes.", options: ["S'assoit en toute sécurité et avec assurance pendant 2 minutes", "S'assoit en toute sécurité pendant 2 minutes sous supervision", "S'assoit en toute sécurité pendant 30 secondes", "S'assoit en toute sécurité pendant 10 secondes", "Incapable de s'asseoir sans support pendant 10 secondes"] },
    { id: 4, text: "Passage de la position debout à la position assise", instructions: "Veuillez vous asseoir.", options: ["S'assoit en toute sécurité avec une utilisation minimale des mains", "Contrôle la descente en utilisant les mains", "Utilise l'arrière des jambes contre la chaise pour contrôler la descente", "S'assoit indépendamment mais a une descente incontrôlée", "Nécessite de l'aide pour s'asseoir"] },
    { id: 5, text: "Transferts", instructions: "Veuillez vous déplacer d'un fauteuil avec accoudoirs à un fauteuil sans accoudoirs et vice-versa.", options: ["Capable de transférer en toute sécurité avec une utilisation minimale des mains", "Capable de transférer en toute sécurité, en s'appuyant sur les mains", "Capable de transférer avec des instructions verbales et/ou une supervision", "Nécessite l'aide d'une personne", "Nécessite l'aide de deux personnes ou est jugé dangereux"] },
];

// LEFS
export const LEFS_QUESTIONS_FR: LEFSQuestion[] = [
  { id: 1, text: "Vos activités habituelles de travail, de ménage ou scolaires.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 2, text: "Vos activités récréatives habituelles.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 3, text: "Vous lever du lit.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 4, text: "Mettre vos chaussures ou vos chaussettes.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 5, text: "Marcher plusieurs pâtés de maisons.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 6, text: "Monter ou descendre les escaliers.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 7, text: "Vous accroupir.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 8, text: "Soulever un objet, comme un sac d'épicerie, du sol.", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 9, text: "Effectuer des travaux ménagers légers (par exemple, faire la vaisselle, la poussière).", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
  { id: 10, text: "Effectuer des travaux ménagers lourds (par exemple, passer l'aspirateur, laver les planchers).", options: ["Difficulté extrême", "Assez difficile", "Difficulté modérée", "Un peu difficile", "Aucune difficulté"] },
];

// JFLS
export const JFLS_QUESTIONS_FR: JFLSQuestion[] = [
    { id: 1, text: "Mâcher des aliments tendres" },
    { id: 2, text: "Mâcher des aliments durs ou résistants" },
    { id: 3, text: "Mâcher du poulet (avec os)" },
    { id: 4, text: "Mâcher un steak" },
    { id: 5, text: "Mâcher une pomme" },
    { id: 6, text: "Ouvrir la bouche pour parler" },
    { id: 7, text: "Ouvrir la bouche pour bâiller" },
    { id: 8, text: "Ouvrir la bouche pour prendre une grosse bouchée d'un sandwich" },
    { id: 9, text: "Parler" },
    { id: 10, text: "Sourire" },
    { id: 11, text: "Boire dans une tasse" },
    { id: 12, text: "Avaler" },
    { id: 13, text: "Se brosser les dents" },
    { id: 14, text: "Mettre votre visage dans l'eau" },
    { id: 15, text: "Bouger votre mâchoire d'un côté à l'autre" },
    { id: 16, text: "Serrer les dents" },
    { id: 17, text: "Être examiné par un dentiste" },
    { id: 18, text: "Avoir un traitement dentaire" },
    { id: 19, text: "Conduire" },
    { id: 20, text: "Participer à des activités sociales" },
];

// TMD
export const TMD_QUESTIONS_FR: TMDQuestion[] = [
  { id: 1, section: "Manger", options: ["Je peux manger n'importe quoi.", "Je dois faire attention aux aliments durs.", "Je ne peux manger que des aliments mous.", "Je ne peux manger que des aliments liquides.", "J'ai du mal à avaler."] },
  { id: 2, section: "Fonction de la mâchoire", options: ["Je peux ouvrir la mâchoire normalement.", "Je peux ouvrir la mâchoire avec une légère limitation.", "Je peux ouvrir la mâchoire avec une limitation modérée.", "J'ai une limitation sévère de l'ouverture de la mâchoire.", "Ma mâchoire est bloquée."] },
  { id: 3, section: "Douleur à la mâchoire", options: ["Je n'ai pas de douleur.", "J'ai une douleur légère et occasionnelle.", "J'ai une douleur modérée, mais elle n'interfère pas avec mes activités.", "J'ai une douleur sévère qui interfère avec mes activités.", "Ma douleur est insupportable."] },
  { id: 4, section: "Bruits de la mâchoire", options: ["Je n'ai pas de bruits.", "J'ai des clics ou des claquements occasionnels.", "J'ai des clics ou des claquements fréquents.", "J'ai des grincements ou des crépitements.", "Mes bruits sont forts et gênants."] },
  { id: 5, section: "Maux de tête", options: ["Je n'ai pas de maux de tête.", "J'ai des maux de tête occasionnels.", "J'ai des maux de tête fréquents.", "J'ai des maux de tête quotidiens.", "J'ai des maux de tête constants et sévères."] },
  { id: 6, section: "Activités quotidiennes", options: ["Mes activités ne sont pas affectées.", "Je dois limiter certaines activités.", "Je suis modérément limité dans mes activités.", "Je suis sévèrement limité dans mes activités.", "Je suis incapable de faire la plupart de mes activités."] },
  { id: 7, section: "Sommeil", options: ["Mon sommeil n'est pas affecté.", "Mon sommeil est parfois perturbé.", "Mon sommeil est souvent perturbé.", "J'ai du mal à dormir à cause de la douleur.", "Je ne peux pas dormir à cause de la douleur."] },
  { id: 8, section: "Humeur", options: ["Mon humeur n'est pas affectée.", "Je suis parfois irritable ou anxieux.", "Je suis souvent irritable ou anxieux.", "Je me sens déprimé à cause de mes symptômes.", "Je me sens très déprimé et sans espoir."] },
  { id: 9, section: "Concentration", options: ["Ma concentration n'est pas affectée.", "J'ai parfois du mal à me concentrer.", "J'ai souvent du mal à me concentrer.", "Ma concentration est mauvaise.", "Je ne peux pas me concentrer du tout."] },
  { id: 10, section: "Vie sociale", options: ["Ma vie sociale n'est pas affectée.", "Je limite certaines activités sociales.", "Je suis modérément limité dans ma vie sociale.", "Je suis sévèrement limité dans ma vie sociale.", "Je n'ai pas de vie sociale."] },
];


// WPAI
export const WPAI_QUESTIONS_FR = {
    q1: "1. Êtes-vous actuellement employé (travail rémunéré) ?",
    q2: "2. Au cours des sept derniers jours, combien d'heures de travail avez-vous manquées à cause de vos problèmes de santé ?",
    q3: "3. Au cours des sept derniers jours, combien d'heures de travail avez-vous manquées pour d'autres raisons (comme des vacances, des jours fériés ou du temps libre) ?",
    q4: "4. Au cours des sept derniers jours, combien d'heures avez-vous réellement travaillé ?",
    q5: "5. Au cours des sept derniers jours, à quel point vos problèmes de santé ont-ils affecté votre productivité au travail ? (0 = Les problèmes de santé n'ont eu aucun effet sur mon travail ; 10 = Les problèmes de santé ont complètement empêché mon travail)",
    q6: "6. Au cours des sept derniers jours, à quel point vos problèmes de santé ont-ils affecté votre capacité à effectuer vos activités quotidiennes habituelles, autres que le travail à l'emploi ? (0 = Les problèmes de santé n'ont eu aucun effet sur mes activités quotidiennes ; 10 = Les problèmes de santé ont complètement empêché mes activités quotidiennes)"
};

// For PSFS
export const PSFS_DATA_FR = {
    title: "Patient Specific Functional Scale (PSFS)",
    description: "Veuillez identifier 3 à 5 activités importantes de votre quotidien que vous ne pouvez pas réaliser ou pour lesquelles vous rencontrez des difficultés en raison de votre problème. Exprimez la capacité à réaliser avec plus ou moins de difficulté chaque activité sur une échelle entre 0 à 10 (entourez le chiffre) :",
    activityCount: 5
};


// For mMRC Dyspnoea Scale
export const MMRC_QUESTION_FR = {
    text: "Échelle de Dyspnée mMRC (Modified Medical Research Council)",
    options: [
        { score: 0, text: "Je ne suis essoufflé(e) que lors d'un exercice intense." },
        { score: 1, text: "Je suis essoufflé(e) en me dépêchant sur un terrain plat ou en montant une légère pente." },
        { score: 2, text: "Je marche plus lentement que les gens du même âge sur un terrain plat à cause de l'essoufflement, ou je dois m'arrêter pour reprendre mon souffle en marchant à mon propre rythme sur le plat." },
        { score: 3, text: "Je m'arrête pour reprendre mon souffle après avoir marché environ 100 mètres ou après quelques minutes sur un terrain plat." },
        { score: 4, text: "Je suis trop essoufflé(e) pour quitter la maison ou je suis essoufflé(e) en m'habillant ou en me déshabillant." }
    ]
};

// For St. George's Hospital Respiratory Questionnaire (SGRQ)
export const SGRQ_QUESTIONS_FR = {
    part1: [
        { id: '1', text: "Au cours des 12 derniers mois, combien de fois avez-vous eu une crise de toux ?", options: [{ label: "Jamais", value: 0 }, { label: "Quelques fois seulement", value: 1 }, { label: "Plusieurs fois", value: 2 }, { label: "La plupart des jours", value: 3 }] },
        { id: '2', text: "Au cours des 12 derniers mois, avez-vous produit des expectorations (crachats) ?", options: [{ label: "Jamais", value: 0 }, { label: "Quelques fois seulement", value: 1 }, { label: "Plusieurs fois", value: 2 }, { label: "La plupart des jours", value: 3 }] },
        { id: '3', text: "Au cours des 12 derniers mois, combien de fois avez-vous été essoufflé(e) ?", options: [{ label: "Jamais", value: 0 }, { label: "Quelques fois seulement", value: 1 }, { label: "Plusieurs fois", value: 2 }, { label: "La plupart des jours", value: 3 }] },
        { id: '4', text: "Au cours des 12 derniers mois, avez-vous eu des épisodes de respiration sifflante ?", options: [{ label: "Jamais", value: 0 }, { label: "Quelques fois seulement", value: 1 }, { label: "Plusieurs fois", value: 2 }, { label: "La plupart des jours", value: 3 }] },
    ],
    part2: {
        sections: [
            { id: '1', title: 'Mes activités', questions: [
                { id: '1', type: 'radio', text: "Ma toux ou ma respiration m'essouffle en marchant sur un terrain plat.", options: [{label: 'Vrai', value: 1}, {label: 'Faux', value: 0}]},
                { id: '2', type: 'radio', text: "Je suis ralenti(e) par ma toux ou ma respiration.", options: [{label: 'Vrai', value: 1}, {label: 'Faux', value: 0}]},
            ]},
             { id: '2', title: 'Impacts', questions: [
                { id: '1', type: 'checkbox-group', text: "Les affirmations suivantes décrivent comment votre toux ou votre respiration pourrait vous affecter. Cochez celles qui s'appliquent à vous AUJOURD'HUI.", options: [
                    { id: '1', text: "Ma toux ou ma respiration est embarrassante en public." },
                    { id: '2', text: "Mon problème respiratoire est un problème pour ma famille, mes amis ou mes voisins." },
                    { id: '3', text: "J'ai peur de faire de l'exercice." },
                ]},
            ]},
        ]
    },
    final: { id: '1', text: "En général, comment diriez-vous que votre problème respiratoire vous a gêné(e) ?", options: [{label: 'Pas du tout', value: 1}, {label: 'Très peu', value: 2}, {label: 'Un peu', value: 3}, {label: 'Modérément', value: 4}, {label: 'Beaucoup', value: 5}]}
};


// ... autres constantes ...
// 10 questions ouvertes — remplace les anciens Medical 1/2/3 (archivés dans memory)
export const MEDICAL_QUESTIONNAIRE: MedicalQuestionSectionDef[] = [
    {
        title: "Anamnèse",
        questions: [
            { id: 'q1_motif', text: 'Quelle est la raison de votre consultation ? Où avez-vous mal ou quel est votre problème ?', type: 'text', placeholder: 'Ex : Douleur dans le bas du dos depuis 2 semaines...' },
            { id: 'q2_apparition', text: 'Quand ce problème est-il apparu et dans quelles circonstances ?', type: 'text', placeholder: 'Ex : Il y a 3 semaines, en soulevant une charge lourde...' },
            { id: 'q3_douleur', text: 'Comment décririez-vous votre douleur ? (type, localisation, irradiation, présence le matin au réveil)', type: 'text', placeholder: 'Ex : Brûlure dans le bas du dos, irradie dans la fesse droite, raide le matin...' },
            { id: 'q4_evolution', text: 'Combien de temps durent les crises et à quelle fréquence reviennent-elles ? Comment cela évolue-t-il ?', type: 'text', placeholder: 'Ex : Crises de 30 min, plusieurs fois par jour, aggravation progressive...' },
            { id: 'q5_facteurs', text: 'Qu\'est-ce qui aggrave votre douleur ? Et qu\'est-ce qui la soulage ?', type: 'text', placeholder: 'Ex : La position assise prolongée aggrave, les étirements soulagent...' },
            { id: 'q6_symptomes', text: 'Avez-vous d\'autres symptômes associés ? Sur une échelle de 0 à 10, comment évaluez-vous votre douleur ?', type: 'text', placeholder: 'Ex : Fourmillements dans le pied droit, douleur à 7/10...' },
            { id: 'q7_antecedents', text: 'Avez-vous des problèmes de santé connus, des chirurgies ou des traumatismes importants ?', type: 'text', placeholder: 'Ex : Opération du genou en 2018, diabète de type 2...' },
            { id: 'q8_examens', text: 'Avez-vous déjà réalisé des examens ou essayé des traitements pour ce problème ?', type: 'text', placeholder: 'Ex : IRM lombaire en 2024, 10 séances de kiné, infiltration...' },
            { id: 'q9_mode_vie', text: 'Quelle est votre situation actuelle ? (profession, sport, médicaments, allergies, tabac, sommeil, stress)', type: 'text', placeholder: 'Ex : Employé de bureau, course à pied 2x/sem, paracétamol au besoin...' },
            { id: 'q10_objectifs', text: 'Quels sont vos objectifs et vos attentes vis-à-vis de la kinésithérapie ?', type: 'text', placeholder: 'Ex : Reprendre le sport sans douleur, pouvoir jouer avec mes enfants...' },
        ]
    }
];

// Backward compat aliases — all point to the single questionnaire
export const MEDICAL_QUESTIONNAIRE_MOTIF_SYMPTOMES = MEDICAL_QUESTIONNAIRE;
export const MEDICAL_QUESTIONNAIRE_ANTECEDENTS_MEDICAUX: MedicalQuestionSectionDef[] = [];
export const MEDICAL_QUESTIONNAIRE_CONTEXTE_VIE: MedicalQuestionSectionDef[] = [];
export const ALL_MEDICAL_QUESTIONS = MEDICAL_QUESTIONNAIRE;


// ANATOMY
export const ANATOMY_HIERARCHY: AnatomyNode[] = [
  {
    name: 'Tête et cou',
    children: [
      { name: 'Tête' },
      { name: 'Cervicale' },
      { name: 'ATM (articulation temporo-mandibulaire)' },
    ],
  },
  {
    name: 'Tronc',
    children: [
      { name: 'Thoracique' },
      { name: 'Lombaire' },
      { name: 'Abdominale' },
    ],
  },
  {
    name: 'Membre supérieur',
    children: [
      { name: 'Épaule' },
      { name: 'Bras' },
      { name: 'Coude' },
      { name: 'Avant-bras' },
      { name: 'Poignet et main' },
    ],
  },
  {
    name: 'Membre inférieur',
    children: [
      { name: 'Hanche' },
      { name: 'Cuisse' },
      { name: 'Genou' },
      { name: 'Jambe' },
      { name: 'Pied et cheville' },
    ],
  },
   {
    name: 'Ceinture pelvienne',
    children: [
        { name: 'Bassin' },
        { name: 'Sacro-iliaque' },
        { name: 'Aine/Pubalgie' },
        { name: 'Plancher pelvien' },
    ]
  },
  {
    name: 'Systèmes',
    children: [
        { name: 'Neurologique' },
        { name: 'Respiratoire' },
        { name: 'Cardio-vasculaire' },
        { name: 'Marche et équilibre' },
    ]
  }
];

// OBJECTIFS QUESTIONNAIRE
export const OBJECTIFS_QUESTIONS_FR = {
    title: "Questionnaire de fixation d'objectifs personnalisés",
    description: "Impliquer activement le patient dans la définition de ses objectifs de rééducation est un élément fondamental des soins en réadaptation. Des objectifs personnellement significatifs – c'est-à-dire alignés sur les valeurs et les priorités du patient – favorisent l'engagement, la motivation et même de meilleurs résultats cliniques au cours de la rééducation. Le questionnaire ci-dessous vise à recueillir les informations essentielles pour formuler un objectif de rééducation à la fois pertinent pour le patient et réaliste, en abordant successivement ses valeurs, sa situation de départ, ses éventuelles craintes, et enfin l'objectif visé lui-même.",
    sections: [
        {
            id: "s1",
            title: "Section 1 : Valeurs personnelles",
            description: "Cette section explore ce qui compte le plus pour le patient dans sa vie quotidienne. Identifier les valeurs et priorités du patient permet d'orienter la rééducation vers des buts fonctionnels qui ont du sens pour lui. Fixer un objectif en lien avec une activité de la vie réelle à laquelle le patient attache de l'importance accroît sa motivation à participer et à persévérer dans le traitement. En d'autres termes, un but significatif pour le patient donnera une raison d'adhérer au programme de rééducation, ce qui améliore l'engagement et l'assiduité aux exercices.",
            questions: [
                { id: 'q1', text: 'Q1. Quel aspect de votre vie souhaitez-vous améliorer en priorité grâce à la rééducation ?', type: 'checkbox', options: ["Votre vie familiale ou sociale (ex. pouvoir mieux vous occuper de vos proches)", "Votre travail ou vos études (ex. reprendre une activité professionnelle)", "Vos loisirs ou activités physiques (ex. pratiquer un sport, un hobby)", "Votre autonomie au quotidien (ex. accomplir seul(e) les tâches domestiques)", "Votre santé physique générale (ex. avoir moins de douleurs, plus d'énergie)"], hasAutre: true, autreLabel: "Autre : (précisez un domaine qui vous tient particulièrement à cœur)" },
                { id: 'q2', text: 'Q2. Quelle activité ou tâche précise vous manque le plus actuellement, que vous aimeriez pouvoir réaliser à nouveau ?', type: 'checkbox', options: ["Marcher plus longtemps ou sur de plus grandes distances sans aide", "Porter des charges ou faire un effort physique sans ressentir de douleur", "M'occuper de ma famille/mes enfants sans limitation liée à mon problème", "Reprendre une activité de loisir ou un sport qui me tient à cœur", "Être autonome dans les tâches quotidiennes (courses, ménage, etc.)"], hasAutre: true, autreLabel: "Autre : (indiquez une activité spécifique importante pour vous)" }
            ]
        },
        {
            id: "s2",
            title: "Section 2: Motivation et intentions",
            description: "Cette section évalue la motivation initiale du patient et son intention de s'investir dans le changement. La motivation intrinsèque du patient et son degré de préparation sont des indicateurs clés de la réussite du plan d'action. Lorsque le patient participe activement à la définition de ses objectifs, sa confiance en lui et sa motivation à suivre le programme s'en trouvent renforcées. De plus, le fait d'estimer son niveau de préparation (sa disposition à faire des efforts) permet d'anticiper son engagement: impliquer le patient dans ce processus augmente son sentiment d'appropriation de l'objectif et son engagement envers le plan de traitement.",
            questions: [
                { id: 'q3', text: "Q3. Quel bénéfice principal espérez-vous retirer de ce programme de rééducation ?", type: 'checkbox', options: ["Diminuer significativement ma douleur ou mes symptômes", "Améliorer mes capacités physiques (force, mobilité, endurance)", "Pouvoir réaliser à nouveau une activité spécifique qui me tient à cœur", "Retrouver confiance en mon corps et en mes capacités de mouvement", "Améliorer mon bien-être général (meilleur moral, plus d'énergie au quotidien)"], hasAutre: true, autreLabel: "Autre : (précisez tout autre bénéfice important pour vous)" },
                { id: 'q4', text: "Q4. À quel point vous sentez-vous prêt(e) à faire les efforts nécessaires pour atteindre vos objectifs ?", type: 'checkbox', options: ["Pas du tout prêt(e) – Je ne suis pas disposé(e) à changer mes habitudes pour l'instant", "Peu prêt(e) – J'ai des réticences et je ne suis pas sûr(e) d'être assidu(e)", "Assez prêt(e) – Je suis moyennement disposé(e) à faire des efforts réguliers", "Très prêt(e) – Je suis disposé(e) à faire des efforts importants pour y arriver", "Tout à fait prêt(e) – Je suis pleinement motivé(e) et déterminé(e) à atteindre mon objectif"] }
            ]
        },
        {
            id: "s3",
            title: "Section 3 : Situation de départ (baseline)",
            description: "Cette section dresse un état des lieux initial des capacités du patient et de ses habitudes, afin de définir un objectif réaliste. Connaître le point de départ réel du patient (niveau de douleur, capacités fonctionnelles actuelles, activité physique pratiquée, etc.) aide à fixer une cible ni irréaliste ni trop facile. Un objectif trop ambitieux par rapport au niveau initial risquerait de conduire à un échec frustrant, tandis qu'un objectif trop facile n'apporterait pas de progrès significatif. En évaluant la situation de départ avec précision, le thérapeute pourra calibrer le programme de manière adaptée - c'est-à-dire définir un but atteignable compte tenu des capacités actuelles du patient – et planifier une progression graduelle et cohérente.",
            questions: [
                { id: 'q5', text: "Q5. Comment évalueriez-vous votre douleur moyenne actuelle (ou gêne liée à votre problème) sur une échelle de 0 à 10 ?", type: 'radio', options: ["0-1/10: Aucune douleur ou douleur très faible", "2-3/10: Douleur légère, supportable sans difficulté", "4-6/10: Douleur modérée, gène présente mais gérable", "7-8/10: Douleur forte, impactant vos activités quotidiennes", "9-10/10: Douleur très intense, presque insupportable au quotidien"] },
                { id: 'q6', text: "Q6. Comment décririez-vous vos capacités actuelles par rapport à l'activité que vous souhaitez améliorer ?", type: 'radio', options: ["Très limité(e) – Je ne peux quasiment pas effectuer cette activité actuellement", "Plutôt limité(e) – Je la fais partiellement avec beaucoup de difficultés", "Modérément capable – Je parviens à la faire en partie, avec des limitations notables", "Presque capable – Je peux réaliser cette activité avec quelques difficultés mineures", "Totalement capable - Je réalise déjà cette activité normalement (ou presque)"] },
                { id: 'q7', text: "Q7. À l'heure actuelle, combien de fois par semaine pratiquez-vous une activité physique ou un exercice d'au moins 30 minutes ?", type: 'radio', options: ["0 fois par semaine (aucune activité régulière)", "1 fois par semaine", "2 à 3 fois par semaine", "4 à 5 fois par semaine", "6 à 7 fois par semaine"] },
                { id: 'q8', text: "Q8. Combien de temps pensez-vous qu'il vous faudra pour atteindre votre objectif principal ?", type: 'radio', options: ["Moins d'un mois", "Environ 1 à 3 mois", "Environ 3 à 6 mois", "Plus de 6 mois", "Je ne sais pas / aucune idée précise"] }
            ]
        },
        {
            id: "s4",
            title: "Section 4 : Peurs, croyances et évitements",
            description: "Cette section identifie d'éventuels freins psychologiques – peurs ou croyances – qui pourraient entraver la progression, afin de mieux adapter l'accompagnement. Des croyances négatives ou une peur du mouvement (kinésiophobie) peuvent amener le patient à éviter certaines activités par crainte d'aggraver sa douleur ou sa condition. Or, si elles ne sont pas abordées, ces attitudes d'évitement entretiennent le cercle vicieux du déconditionnement physique et du handicap. En repérant dès le départ ces obstacles psychologiques, le thérapeute pourra rassurer et éduquer le patient, et mettre en place des stratégies comme l'exposition graduelle aux activités redoutées. Une exposition progressive, contrôlée, aide en effet à diminuer peu à peu la peur du mouvement tout en renforçant la confiance du patient dans ses capacités, ce qui est bénéfique pour la récupération.",
            questions: [
                { id: 'q9', text: "Q9. Craignez-vous que certains exercices ou activités puissent aggraver votre problème (douleur ou blessure) ?", type: 'radio', options: ["Oui - J'ai peur de faire empirer mon état, j'évite beaucoup d'activités physiques", "Oui - J'ai quelques craintes, je suis hésitant(e) avant de faire certains efforts", "Pas vraiment - Je suis un peu prudent(e), mais je n'ai pas de peur majeure", "Non - Je n'ai pas de crainte particulière, je ne pense pas que les exercices soient dangereux"] },
                { id: 'q10', text: "Q10. Dans quelle mesure êtes-vous d'accord avec l'affirmation : « Si j'ai mal, c'est que je suis en train d'abîmer mon corps » ?", type: 'radio', options: ["Tout à fait d'accord – Pour moi, la douleur signifie forcément que je me fais du mal", "Plutôt d'accord - J'ai tendance à penser qu'il faut éviter toute activité douloureuse", "Plutôt pas d'accord – Je pense qu'une certaine douleur peut être tolérée sans danger", "Pas du tout d'accord - Je ne crois pas que la douleur signifie nécessairement des dégâts physiques", "Ne sait pas / Pas concerné - Je ne me prononce pas sur cette idée"] },
                { id: 'q11', text: "Q11. Parmi les obstacles suivants, lequel vous paraît le plus susceptible de compromettre votre rééducation ?", type: 'radio', options: ["La douleur ou l'inconfort me découragent facilement", "La peur de l'échec (ne pas y arriver) me freine", "Le manque de soutien ou d'encouragement autour de moi", "Le manque de temps, d'énergie ou d'organisation de ma part", "Aucun de ces obstacles - Je ne vois pas de frein majeur actuellement"], hasAutre: true, autreLabel: "Autre : (précisez tout autre obstacle que vous redoutez)" }
            ]
        },
        {
            id: "s5",
            title: "Section 5 : Définition de l'objectif et engagement",
            description: "Cette dernière section permet au patient d'exprimer concrètement l'objectif qu'il vise, puis d'auto-évaluer son importance et sa confiance en la réussite. On obtient ainsi une base de travail brute pour le thérapeute, qui pourra reformuler l'objectif si nécessaire. Surtout, les échelles d'importance et de confiance servent de critères de validation de l'objectif : en pratique, si le patient n'attribue pas une note supérieure à 7/10 à l'importance de l'objectif et à sa confiance de l'atteindre, l'objectif formulé a peu de chances de tenir sur la durée. Un score faible peut indiquer que le but n'est pas assez signifiant pour le patient ou qu'il le juge peu réaliste; dans ce cas, le thérapeute et le patient devront affiner l'objectif (ou renforcer la confiance du patient par des étapes intermédiaires) afin d'obtenir des scores d'importance et de confiance suffisamment élevés pour garantir l'adhésion du patient.",
            questions: [
                { id: 'q12', text: "Q12. Formulez l'objectif spécifique que vous souhaitez atteindre grâce à la rééducation :", type: 'radio-specify', options: [
                    { key: 'a', label: "Marcher ou me déplacer plus longtemps (distance/temps: _)" },
                    { key: 'b', label: "Porter des charges ou faire un effort physique sans douleur (précisez l'activité: _)" },
                    { key: 'c', label: "M'occuper de ma famille/mes proches plus facilement au quotidien" },
                    { key: 'd', label: "Reprendre une activité de loisir ou un sport qui me tient à cœur (précisez: _)" },
                    { key: 'e', label: "Réduire significativement ma douleur au quotidien (précisez la situation : ex. diminuer la douleur de X/10 lors de _)" }
                ], hasAutre: true, autreLabel: "Autre objectif :" },
                { id: 'q13', text: "Q13. Quelle importance accordez-vous à cet objectif ? (Notez sur 10 où 0 = pas du tout important et 10 = extrêmement important)", type: 'scale', max: 10 },
                { id: 'q14', text: "Q14. À quel point vous sentez-vous confiant(e) de pouvoir atteindre cet objectif ? (Notez sur 10 où 0 = pas du tout confiant et 10 = tout à fait confiant)", type: 'scale', max: 10 }
            ],
            remarque: "Si l'une des notes ci-dessus est inférieure ou égale à 7/10, il sera important d'en discuter avec votre thérapeute. Un objectif doit en effet être suffisamment important pour vous et vous sembler atteignable avec un haut degré de confiance; sans cela, il pourra être nécessaire de réajuster le plan (par exemple, choisir un objectif plus en phase avec vos valeurs, ou découper l'objectif en étapes progressives) afin de maximiser vos chances de succès. Chaque objectif validé servira de référence pour mesurer vos progrès et guider les prochaines étapes de votre rééducation. En fixant des buts spécifiques, mesurables, atteignables, réalistes et planifiés dans le temps, vous mettez toutes les chances de votre côté pour une rééducation réussie et durable."
        }
    ]
};

// AMPLITUDES ARTICULAIRES QUESTIONNAIRE
export const AMPLITUDES_QUESTIONS_FR = [
    {
        region: "Rachis Cervical (Cou)",
        partKey: "rachisCervical",
        mouvements: [
            {
                mouvement: "Flexion (pencher la tête en avant)",
                mvtKey: "flexion",
                amplitude: {
                    question: "En penchant la tête en avant, jusqu'où va votre menton ?",
                    options: ["Je touche la poitrine avec le menton (flexion complète, ~45-50°)", "Mon menton s'approche de la poitrine sans la toucher", "Mon menton reste éloigné (flexion partielle seulement)", "Je ne peux presque pas pencher la tête en avant"]
                },
                douleur: {
                    question: "Douleur ?",
                    options: ["Non", "Dès le début du mouvement", "En cours de mouvement", "En fin de mouvement (au maximum de la flexion)"]
                }
            },
            {
                mouvement: "Extension (regarder en l'air)",
                mvtKey: "extension",
                amplitude: {
                    question: "En levant la tête en arrière (comme pour regarder le plafond), jusqu'où allez-vous ?",
                    options: ["Je peux incliner complètement la tête en arrière (regard vers le plafond, ~45° d'extension)", "J'incline la tête en arrière mais pas entièrement (le visage n'atteint pas l'horizontale)", "J'incline la tête légèrement en arrière seulement", "Je ne peux presque pas incliner la tête en arrière"]
                },
                douleur: {
                    question: "Douleur ?",
                    options: ["Non", "Dès le début du mouvement", "En cours d'extension (après quelques degrés)", "En fin d'extension (à l'inclinaison maximale)"]
                }
            },
             {
                mouvement: "Rotation (tourner la tête)",
                mvtKey: "rotation",
                amplitude: {
                    question: "En tournant la tête à gauche puis à droite (comme pour regarder par-dessus l'épaule), jusqu'où pouvez-vous tourner ?",
                    options: ["Je tourne la tête presque complètement de chaque côté (menton proche de l'axe de l'épaule, ~70°)", "Je tourne la tête des deux côtés mais moins qu'à la normale (menton n'atteint pas l'épaule)", "Je ne tourne la tête que légèrement sur les côtés", "Je ne peux presque pas tourner la tête d'un ou des deux côtés"]
                },
                douleur: {
                    question: "Douleur ?",
                    options: ["Non", "Dès le début du mouvement", "En cours de mouvement", "En fin de mouvement (rotation extrême)"]
                }
            },
            {
                mouvement: "Inclinaison latérale (flexion latérale)",
                mvtKey: "inclinaison",
                amplitude: {
                    question: "En inclinant la tête sur le côté (en rapprochant l'oreille de l'épaule, sans lever l'épaule), jusqu'où va votre tête ?",
                    options: ["Je penche la tête assez loin – mon oreille s'approche de l'épaule (flexion latérale ~45° normale)", "J'incline la tête de côté mais l'oreille reste à distance de l'épaule", "J'incline la tête seulement de quelques degrés de chaque côté", "Je ne peux presque pas incliner la tête latéralement"]
                },
                douleur: {
                    question: "Douleur ?",
                    options: ["Non", "Dès le début du mouvement", "En cours de mouvement", "En fin de mouvement (inclinaison maximale)"]
                }
            },
        ]
    },
    {
        region: "Rachis Dorso-Lombaire (Tronc)",
        partKey: "rachisDorsoLombaire",
        mouvements: [
            {
                mouvement: "Flexion du tronc (antéflexion)",
                mvtKey: "flexion",
                amplitude: { question: "En vous penchant en avant, jambes tendues, jusqu'où descendent vos mains ?", options: ["Je touche le sol (ou mes pieds) avec les doigts", "Je descends les mains jusqu'aux chevilles", "Je descends seulement jusqu'aux genoux", "Je ne descends presque pas (mains à peine plus bas que les cuisses)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le basculement en avant (début du mouvement)", "En descendant plus bas (milieu du mouvement)", "En allant au maximum de la flexion (dos très courbé)"] }
            },
            {
                mouvement: "Extension du tronc (rétroflexion)",
                mvtKey: "extension",
                amplitude: { question: "En vous penchant prudemment en arrière (mains sur les hanches en soutien), jusqu'où parvenez-vous ?", options: ["Je me penche franchement en arrière (léger arc visible, ~30° d'extension lombaire normale)", "Je me penche un peu en arrière mais pas jusqu'au bout", "Je bascule très peu en arrière (extension très limitée)", "Je ne peux pas du tout me pencher en arrière"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement (dès que je commence à me cambrer)", "En cours de mouvement", "En fin de mouvement (en extension maximale)"] }
            },
            {
                mouvement: "Inclinaison latérale du tronc",
                mvtKey: "inclinaisonLaterale",
                amplitude: { question: "Debout, bras le long du corps, en glissant la main le long de la cuisse en vous penchant sur le côté, jusqu'où descendez-vous ?", options: ["Je descends la main jusqu'au niveau du genou (voire plus bas)", "Je descends la main un peu au-dessus du genou, sans l'atteindre", "Je descends la main seulement jusqu'à la mi-cuisse", "Je ne peux presque pas pencher le buste sur le côté"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement", "En cours de mouvement", "En fin de mouvement (inclinaison maximale)"] }
            },
            {
                mouvement: "Rotation du tronc",
                mvtKey: "rotation",
                amplitude: { question: "Assis sur une chaise (bassin fixe), bras croisés sur la poitrine, jusqu'où pouvez-vous tourner les épaules à gauche et à droite ?", options: ["Je peux tourner le buste normalement des deux côtés (rotation ~30° de chaque côté, symétrique)", "Je tourne le buste des deux côtés mais moins qu'à la normale (raideur modérée d'un côté ou des deux)", "Je ne tourne le buste que très peu sur un côté ou des deux", "Je ne peux pratiquement pas faire pivoter le haut du corps"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés de rotation", "En cours de rotation", "Au maximum de la torsion"] }
            }
        ]
    },
    {
        region: "Épaule (Shoulder)",
        partKey: "epaule",
        bilateral: true,
        mouvements: [
            {
                mouvement: "Flexion de l'épaule (élévation antérieure)",
                mvtKey: "flexion",
                amplitude: { question: "En levant le bras vers l'avant, pouce vers le haut, jusqu'où montez-vous le bras ?", options: ["Mon bras monte au-dessus de la tête, aligné avec l'oreille (≈180°)", "Mon bras monte au-dessus de l'épaule, sans atteindre l'oreille", "Mon bras ne monte qu'à l'horizontale (niveau de l'épaule, ~90°)", "Je ne peux pas lever le bras jusqu'à l'horizontale"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de l'élévation", "En milieu d'élévation", "Uniquement en fin de mouvement (bras presque vertical)"] }
            },
            {
                mouvement: "Abduction de l'épaule (élévation latérale)",
                mvtKey: "abduction",
                amplitude: { question: "En levant le bras sur le côté, paume tournée vers l'extérieur, jusqu'où montez-vous le bras ?", options: ["Mon bras s'élève jusqu'au-dessus de la tête, vertical (≈180°)", "Mon bras s'élève au-dessus de l'épaule mais n'atteint pas la verticale", "Mon bras s'élève seulement à l'horizontale (à hauteur d'épaule)", "Je ne peux pas lever le bras latéralement jusqu'à l'horizontale"] },
                douleur: { question: "Douleur ?", options: ["Non", "Entre ~60° et 120° d'élévation (« painful arc »)", "Uniquement en fin d'élévation (près du sommet)", "Présente dès les premiers degrés d'élévation"] }
            },
            {
                mouvement: "Extension de l'épaule (bras en arrière)",
                mvtKey: "extension",
                amplitude: { question: "Bras le long du corps, en le portant tendu en arrière (rétropulsion), jusqu'où allez-vous ?", options: ["Je peux amener le bras nettement en arrière (≈40-50°, main à ~30 cm derrière la hanche)", "Je recule le bras en arrière mais de façon incomplète", "Je parviens à peine à emmener le bras en arrière", "Je ne peux pas du tout porter le bras en arrière"] },
                douleur: { question: "Douleur ?", options: ["Non", "Seulement en fin de mouvement (épaule tirée en arrière)", "Douleur vive dès le début du mouvement", "Douleur dès le début, empêchant l'extension du bras"] }
            },
            {
                mouvement: "Adduction horizontale de l'épaule",
                mvtKey: "adductionHorizontale",
                amplitude: { question: "Bras tendu à l'horizontale devant vous, pouvez-vous le passer vers l'épaule opposée ? Jusqu'où allez-vous en le croisant devant la poitrine ?", options: ["Mon bras va presque jusqu'à toucher l'épaule opposée (adduction complète ~40°)", "Mon bras va à plus de la moitié du chemin vers l'épaule opposée", "Mon bras ne croise que très peu devant moi", "Je ne peux pratiquement pas amener le bras vers l'épaule opposée"] },
                douleur: { question: "Douleur ?", options: ["Non", "En fin de mouvement (lorsque le bras est presque sur l'épaule opposée)", "Dès le début du croisement du bras", "Douleur vive dès le début, empêchant le mouvement"] }
            },
            {
                mouvement: "Rotation externe de l'épaule",
                mvtKey: "rotationExterne",
                amplitude: { question: "Coude collé au corps et plié à 90°, en tournant l'avant-bras vers l'extérieur (comme pour ouvrir une porte), jusqu'où allez-vous ?", options: ["J'arrive à tourner l'avant-bras presque à l'horizontale sur le côté (rotation ~85-90°)", "Je tourne l'avant-bras vers l'extérieur, mais pas jusqu'à l'horizontale", "Je ne tourne l'avant-bras que de quelques degrés vers l'extérieur", "Je ne peux pas du tout tourner l'avant-bras vers l'extérieur"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés de rotation externe", "En cours de rotation externe", "En rotation externe maximale"] }
            },
            {
                mouvement: "Rotation interne de l'épaule",
                mvtKey: "rotationInterne",
                amplitude: { question: "En plaçant la main derrière le dos (paume vers l'extérieur), jusqu'où montez-vous la main le long du dos ?", options: ["Je monte la main jusqu'aux omoplates (haut du dos)", "Je monte la main au milieu du dos", "Je monte la main au niveau de la taille (bas du dos)", "Je ne peux pas monter la main dans le dos du tout"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès la mise en place du bras derrière le dos", "En montant plus haut le long du dos", "En fin de mouvement (au plus haut possible)"] }
            }
        ]
    },
    {
        region: "Coude & Avant-bras",
        partKey: "coudeAvantBras",
        bilateral: true,
        mouvements: [
            {
                mouvement: "Flexion du coude",
                mvtKey: "flexion",
                amplitude: { question: "En pliant le coude, jusqu'où la main peut-elle aller sur l'avant-bras ?", options: ["Je plie complètement le coude, la main touche l'épaule (~140-150° de flexion)", "Je plie le coude presque complètement (la main s'approche de l'épaule à quelques centimètres)", "Je plie le coude partiellement (≈90° de flexion maximale)", "Je ne peux presque pas plier le coude"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés de flexion", "En cours de flexion", "En fin de flexion (coude complètement plié)"] }
            },
            {
                mouvement: "Extension du coude",
                mvtKey: "extension",
                amplitude: { question: "En tendant le bras, jusqu'où pouvez-vous redresser le coude ?", options: ["Je tends complètement le bras, coude totalement droit (0°)", "Je tends le bras presque à fond (il reste une légère flexion résiduelle)", "Je ne peux tendre le bras qu'en partie (le coude reste assez fléchi)", "Mon coude ne se redresse pas du tout (bras bloqué en flexion)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés d'extension", "En cours d'extension", "En fin d'extension (coude totalement tendu)"] }
            },
            {
                mouvement: "Rotation de l'avant-bras (Pronation/Supination)",
                mvtKey: "rotationAvantBras",
                amplitude: { question: "Coude plié à 90° près du corps, en tournant la main paume vers le bas puis vers le haut, quelle amplitude atteignez-vous ?", options: ["Je peux tourner la paume complètement vers le bas et vers le haut (rotation ~80-90° dans chaque sens)", "Je tourne la paume vers le bas et vers le haut mais incomplètement (amplitude réduite dans un sens ou les deux)", "Je ne peux tourner la paume qu'à mi-chemin (paume de profil, rotation très limitée)", "Je ne parviens presque pas à faire pivoter l'avant-bras (paume toujours à moitié tournée)"] },
                douleur: { question: "Douleur ?", options: ["Non", "En pronation maximale (paume vers le bas)", "En supination maximale (paume vers le haut)", "Douleur dès le début du mouvement de rotation"] }
            }
        ]
    },
    {
        region: "Poignet & Main",
        partKey: "poignetMain",
        bilateral: true,
        mouvements: [
            {
                mouvement: "Flexion du poignet (flexion palmaire)",
                mvtKey: "flexion",
                amplitude: { question: "Avant-bras appuyé (paume vers le bas dans le vide), en pliant le poignet vers l'avant, jusqu'où pouvez-vous plier la main ?", options: ["Je plie le poignet au maximum vers l'avant – la main forme presque un angle droit avec l'avant-bras (~85°)", "Je plie le poignet vers l'avant mais avec une légère limitation", "Je plie le poignet seulement à moitié de l'amplitude normale", "Je ne peux quasiment pas plier le poignet vers l'avant"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de la flexion du poignet", "En cours de flexion", "En fin de flexion (poignet complètement plié)"] }
            },
            {
                mouvement: "Extension du poignet (flexion dorsale)",
                mvtKey: "extension",
                amplitude: { question: "Avant-bras appuyé (paume vers le bas), en relevant la main vers le haut (comme pour dire \"stop\"), jusqu'où montez-vous la main ?", options: ["Je redresse complètement le poignet - la main est quasiment alignée avec l'avant-bras (~85° d'extension)", "Je relève la main vers le haut mais sans atteindre l'alignement complet", "Je ne peux relever la main que partiellement (~45° max avant douleur/blocage)", "Je ne peux presque pas relever la main vers le haut"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement vers l'arrière", "En cours de mouvement", "En fin d'extension du poignet (position \"stop\")"] }
            },
            {
                mouvement: "Inclinaison radiale (déviation vers le pouce)",
                mvtKey: "inclinaisonRadiale",
                amplitude: { question: "En inclinant le poignet vers le côté du pouce, jusqu'où allez-vous ?", options: ["J'incline le poignet vers le pouce normalement (mouvement complet, amplitude faible ~15°)", "J'incline le poignet vers le pouce mais avec une légère raideur", "Je n'incline le poignet vers le pouce que très peu", "Je ne peux pas du tout incliner le poignet de ce côté"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de l'inclinaison vers le pouce", "En cours d'inclinaison radiale", "En fin d'inclinaison (mouvement complet vers le pouce)"] }
            },
            {
                mouvement: "Inclinaison ulnaire (déviation vers le petit doigt)",
                mvtKey: "inclinaisonUlnaire",
                amplitude: { question: "En inclinant le poignet vers le côté du petit doigt, jusqu'où allez-vous ?", options: ["J'incline le poignet largement du côté du petit doigt (amplitude quasi normale ~30°)", "J'incline le poignet vers le petit doigt mais pas jusqu'au bout de l'amplitude", "J'incline le poignet très peu vers le petit doigt", "Je ne peux pas du tout incliner le poignet de ce côté"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de l'inclinaison vers le petit doigt", "En cours de mouvement", "En fin de mouvement (inclinaison maximale)"] }
            }
        ]
    },
    {
        region: "Hanche (Hip)",
        partKey: "hanche",
        bilateral: true,
        mouvements: [
            {
                mouvement: "Flexion de hanche",
                mvtKey: "flexion",
                amplitude: { question: "Allongé sur le dos, sans aide extérieure, en ramenant une cuisse fléchie vers votre poitrine (genou plié), jusqu'où montez-vous la cuisse ?", options: ["Ma cuisse monte complètement contre l'abdomen (genou poitrine, ~120° de flexion)", "Ma cuisse monte haut mais sans toucher totalement le ventre", "Ma cuisse ne monte qu'à angle droit environ (~90°)", "Je ne peux presque pas plier la hanche (cuisse peu élevée)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de la flexion de hanche", "En milieu de flexion", "En fin de flexion (cuisse au maximum vers le thorax)"] }
            },
            {
                mouvement: "Extension de hanche",
                mvtKey: "extension",
                amplitude: { question: "Allongé sur le ventre, genou plié à 90°, en levant la cuisse vers le plafond, jusqu'où la soulevez-vous ?", options: ["Je peux soulever la cuisse légèrement du plan de la table (quelques degrés ~10-20° d'extension)", "Je soulève la cuisse en arrière mais difficilement (amplitude d'extension réduite)", "Je parviens à peine à décoller la cuisse en arrière", "Impossible de lever la cuisse vers l'arrière (extension nulle)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement d'extension", "En cours d'extension", "En fin d'extension (hanche étirée au maximum)"] }
            },
            {
                mouvement: "Abduction de hanche",
                mvtKey: "abduction",
                amplitude: { question: "Allongé sur le dos, jambes tendues, en écartant latéralement une jambe sur le côté, jusqu'où allez-vous ?", options: ["Je peux écarter la jambe largement sur le côté (amplitude normale ~45°)", "J'écarte la jambe sur le côté mais pas complètement (l'écart reste modéré)", "Je n'écarte la jambe que partiellement (mouvement nettement réduit)", "Je ne peux presque pas écarter la jambe latéralement"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès ~20° d'écartement (début d'abduction)", "En cours d'abduction", "Vers la fin de l'abduction maximale (~40°)"] }
            },
            {
                mouvement: "Adduction de hanche",
                mvtKey: "adduction",
                amplitude: { question: "Allongé sur le dos, une jambe à plat et l'autre légèrement soulevée, en croisant cette jambe devant l'autre, quelle amplitude atteignez-vous ?", options: ["Je peux croiser la jambe au-delà de la ligne médiane (≈20° d'adduction, la jambe passe devant l'autre)", "Je croise la jambe un peu devant l'autre, mais je suis limité avant 20°", "Je n'arrive à croiser la jambe que très peu (quasiment pas au-delà de l'autre jambe)", "Je ne peux pas du tout croiser une jambe devant l'autre"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de l'adduction (dès que je commence à croiser)", "En cours de mouvement", "En fin de mouvement (jambes croisées au maximum)"] }
            },
            {
                mouvement: "Rotation externe de hanche",
                mvtKey: "rotationExterne",
                amplitude: { question: "Allongé sur le dos, hanche et genou fléchis à 90° (pied en l'air), en pivotant la jambe pour que le pied aille vers l'intérieur, jusqu'où allez-vous ?", options: ["Je pivote la jambe vers l'intérieur pleinement (rotation externe de hanche ~60°, mouvement complet)", "Je pivote la jambe vers l'intérieur mais pas jusqu'au bout (~30-40° seulement)", "Je pivote la jambe très peu vers l'intérieur (rotation externe très limitée)", "Je ne peux pas du tout amener le pied vers l'intérieur (blocage de la rotation externe)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés de rotation externe", "En cours de rotation", "En rotation maximale (pied tourné au maximum vers l'intérieur)"] }
            },
            {
                mouvement: "Rotation interne de hanche",
                mvtKey: "rotationInterne",
                amplitude: { question: "(Même position que précédemment) En pivotant la jambe pour que le pied s'écarte vers l'extérieur, jusqu'où allez-vous ?", options: ["Je pivote la jambe vers l'extérieur sans difficulté (rotation interne ~30-40° normale)", "Je pivote la jambe vers l'extérieur mais de façon incomplète", "Je pivote la jambe à peine de quelques degrés vers l'extérieur", "Je ne peux pas du tout écarter le pied vers l'extérieur (rotation interne nulle)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés de rotation interne", "En cours de rotation", "En fin de rotation interne (pied écarté au maximum)"] }
            }
        ]
    },
    {
        region: "Genou (Knee)",
        partKey: "genou",
        bilateral: true,
        mouvements: [
            {
                mouvement: "Flexion du genou",
                mvtKey: "flexion",
                amplitude: { question: "En pliant le genou (talon vers la fesse), jusqu'où pliez-vous la jambe ?", options: ["Je plie le genou complètement, le talon touche presque la fesse (~135° de flexion)", "Je plie le genou fortement mais un écart de quelques centimètres reste entre le talon et la fesse", "Je plie le genou partiellement (le talon reste loin de la fesse)", "Je ne peux presque pas plier le genou"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début de la flexion (dès que je plie un peu)", "En cours de flexion", "En fin de flexion maximale (genou complètement plié)"] }
            },
            {
                mouvement: "Extension du genou",
                mvtKey: "extension",
                amplitude: { question: "Jambe allongée, en redressant le genou, jusqu'où se tend-il ?", options: ["Mon genou se tend complètement, la jambe est droite (0°)", "Mon genou se tend presque entièrement mais pas tout à fait (il reste un léger fléchi)", "Mon genou ne se tend qu'en partie (jamais complètement plat)", "Mon genou reste fléchi de façon importante (incapable de s'étendre davantage)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès les premiers degrés d'extension", "En cours d'extension", "En fin d'extension (jambe presque ou totalement droite)"] }
            }
        ]
    },
    {
        region: "Cheville & Pied (Ankle & Foot)",
        partKey: "chevillePied",
        bilateral: true,
        mouvements: [
            {
                mouvement: "Flexion dorsale de cheville (lever le pied)",
                mvtKey: "flexionDorsale",
                amplitude: { question: "Assis, genou fléchi ~90°, en relevant la pointe du pied vers le plafond, jusqu'où allez-vous ?", options: ["Je relève le pied jusqu'à former approximativement un angle droit (~90° entre le pied et la jambe, ~20° de flexion dorsale atteints)", "Je relève le pied vers le haut mais n'atteins pas l'angle droit (flexion dorsale incomplète)", "Je ne peux relever le pied que très peu vers le haut", "Impossible de relever la pointe du pied vers le haut (pied bloqué vers le bas)"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement (dorsiflexion initiale)", "En cours de flexion dorsale", "En fin de flexion dorsale (pied tiré au maximum vers le haut)"] }
            },
            {
                mouvement: "Flexion plantaire de cheville (pointer le pied)",
                mvtKey: "flexionPlantaire",
                amplitude: { question: "Assis (jambe allongée ou fléchie), en poussant la pointe du pied vers le sol (comme pour appuyer sur une pédale), jusqu'où allez-vous ?", options: ["Je peux pointer le pied complètement vers le sol (extension plantaire ~50°, cheville étendue en angle obtus)", "Je pointe le pied vers le bas mais sans atteindre toute l'amplitude", "Je ne pointe le pied que partiellement vers le bas", "Impossible de pousser la pointe du pied vers le bas (flexion plantaire nulle)"] },
                douleur: { question: "Douleur ?", options: ["Non", "En flexion plantaire maximale (pied pointé au maximum)", "En cours de flexion plantaire", "Dès le début du mouvement (dès que je commence à pointer le pied)"] }
            },
            {
                mouvement: "Inversion du pied (supination)",
                mvtKey: "inversion",
                amplitude: { question: "Assis, jambe pendante, en tournant la plante du pied vers l'intérieur (vers l'autre pied), jusqu'où allez-vous ?", options: ["Je tourne la plante du pied nettement vers l'intérieur (inversion ~30-35° atteinte, bord interne du pied qui se lève bien)", "Je tourne le pied vers l'intérieur mais modérément (inversion incomplète)", "Je ne tourne le pied vers l'intérieur que très peu", "Je ne peux pas du tout tourner la plante du pied vers l'intérieur"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement d'inversion", "En cours de mouvement", "En fin de mouvement (pied tourné au maximum vers l'intérieur)"] }
            },
            {
                mouvement: "Éversion du pied (pronation)",
                mvtKey: "eversion",
                amplitude: { question: "Assis, jambe pendante, en tournant la plante du pied vers l'extérieur (en écartant le bord interne du pied), jusqu'où allez-vous ?", options: ["Je peux tourner le pied vers l'extérieur normalement (mouvement naturellement plus faible ~15° d'éversion)", "Je tourne le pied vers l'extérieur mais avec une légère limitation", "Je tourne le pied vers l'extérieur à peine de quelques degrés", "Je ne peux pas du tout tourner la plante du pied vers l'extérieur"] },
                douleur: { question: "Douleur ?", options: ["Non", "Dès le début du mouvement d'éversion", "En cours de mouvement", "En fin de mouvement (pied tourné au maximum vers l'extérieur)"] }
            }
        ]
    }
];

// Hospital Anxiety and Depression Scale (HAD)
export const HAD_QUESTIONS_FR: { id: number; text: string; options: { text: string; value: number }[]; isAnxiety: boolean }[] = [
    { id: 1, text: "Je me sens tendu(e) ou énervé(e)", options: [{ text: "La plupart du temps", value: 3 }, { text: "Souvent", value: 2 }, { text: "De temps en temps", value: 1 }, { text: "Jamais", value: 0 }], isAnxiety: true },
    { id: 2, text: "Je prends plaisir aux mêmes choses qu'autrefois", options: [{ text: "Oui, tout autant", value: 0 }, { text: "Pas autant", value: 1 }, { text: "Un peu seulement", value: 2 }, { text: "Presque plus", value: 3 }], isAnxiety: false },
    { id: 3, text: "J'ai une sensation de peur comme si quelque chose d'horrible allait m'arriver", options: [{ text: "Oui, très nettement", value: 3 }, { text: "Oui, mais ce n'est pas trop grave", value: 2 }, { text: "Un peu, mais cela ne m'inquiète pas", value: 1 }, { text: "Pas du tout", value: 0 }], isAnxiety: true },
    { id: 4, text: "Je ris facilement et vois le bon côté des choses", options: [{ text: "Autant que par le passé", value: 0 }, { text: "Plus autant qu'avant", value: 1 }, { text: "Vraiment moins qu'avant", value: 2 }, { text: "Plus du tout", value: 3 }], isAnxiety: false },
    { id: 5, text: "Je me fais du souci", options: [{ text: "Très souvent", value: 3 }, { text: "Assez souvent", value: 2 }, { text: "Occasionnellement", value: 1 }, { text: "Très occasionnellement", value: 0 }], isAnxiety: true },
    { id: 6, text: "Je suis de bonne humeur", options: [{ text: "La plupart du temps", value: 0 }, { text: "Assez souvent", value: 1 }, { text: "Rarement", value: 2 }, { text: "Jamais", value: 3 }], isAnxiety: false },
    { id: 7, text: "Je peux rester tranquillement assis(e) à ne rien faire et me sentir décontracté(e)", options: [{ text: "Oui, quoi qu'il arrive", value: 0 }, { text: "Oui, en général", value: 1 }, { text: "Rarement", value: 2 }, { text: "Jamais", value: 3 }], isAnxiety: true },
    { id: 8, text: "J'ai l'impression de fonctionner au ralenti", options: [{ text: "Jamais", value: 0 }, { text: "Parfois", value: 1 }, { text: "Très souvent", value: 2 }, { text: "Presque toujours", value: 3 }], isAnxiety: false },
    { id: 9, text: "J'éprouve des sensations de peur et j'ai l'estomac noué", options: [{ text: "Très souvent", value: 3 }, { text: "Assez souvent", value: 2 }, { text: "Parfois", value: 1 }, { text: "Jamais", value: 0 }], isAnxiety: true },
    { id: 10, text: "Je ne m'intéresse plus à mon apparence", options: [{ text: "J'y prête autant d'attention que par le passé", value: 0 }, { text: "Il se peut que je n'y fasse plus autant attention", value: 1 }, { text: "Je n'y accorde pas autant d'attention que je devrais", value: 2 }, { text: "Plus du tout", value: 3 }], isAnxiety: false },
    { id: 11, text: "J'ai la bougeotte et n'arrive pas à tenir en place", options: [{ text: "Pas du tout", value: 0 }, { text: "Pas tellement", value: 1 }, { text: "Un peu", value: 2 }, { text: "Oui, c'est tout à fait le cas", value: 3 }], isAnxiety: true },
    { id: 12, text: "Je me réjouis d'avance à l'idée de faire certaines choses", options: [{ text: "Autant qu'avant", value: 0 }, { text: "Un peu moins qu'avant", value: 1 }, { text: "Bien moins qu'avant", value: 2 }, { text: "Presque jamais", value: 3 }], isAnxiety: false },
    { id: 13, text: "J'éprouve des sensations soudaines de panique", options: [{ text: "Vraiment très souvent", value: 3 }, { text: "Assez souvent", value: 2 }, { text: "Pas très souvent", value: 1 }, { text: "Jamais", value: 0 }], isAnxiety: true },
    { id: 14, text: "Je peux prendre plaisir à un bon livre ou à une bonne émission de radio ou de télévision", options: [{ text: "Souvent", value: 0 }, { text: "Parfois", value: 1 }, { text: "Rarement", value: 2 }, { text: "Très rarement", value: 3 }], isAnxiety: false }
];
export const HAD_ANXIETY_Q_IDS = [1, 3, 5, 7, 9, 11, 13];
export const HAD_DEPRESSION_Q_IDS = [2, 4, 6, 8, 10, 12, 14];