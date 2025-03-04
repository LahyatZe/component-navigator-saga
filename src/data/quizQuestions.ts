
import { Question } from '@/types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    level: 1,
    question: "Quel a été mon premier diplôme ?",
    options: [
      "Bac S",
      "Bac ES",
      "Bac Pro",
      "Bac L"
    ],
    correctAnswer: 1,
    explanation: "J'ai obtenu un Bac ES en 2018 avant de poursuivre mes études en informatique.",
    hints: [
      "C'est un baccalauréat général obtenu en 2018.",
      "Ce bac comporte des matières en économie et sciences sociales."
    ]
  },
  {
    id: 2,
    level: 1,
    question: "Dans quelle ville ai-je commencé mes études supérieures ?",
    options: [
      "Paris",
      "Lyon",
      "Saint-Étienne",
      "Montpellier"
    ],
    correctAnswer: 2,
    explanation: "J'ai commencé mes études supérieures à Saint-Étienne, où j'ai développé mes premières compétences en développement.",
    hints: [
      "C'est une ville de la région Auvergne-Rhône-Alpes.",
      "Cette ville est connue pour son équipe de football 'Les Verts'."
    ]
  },
  {
    id: 3,
    level: 2,
    question: "Dans quelle entreprise ai-je effectué mon alternance ?",
    options: [
      "Sam Outillage",
      "My Pets Life",
      "Capgemini Technologies & Services",
      "IGSI Calliope"
    ],
    correctAnswer: 2,
    explanation: "J'ai effectué mon alternance chez Capgemini Technologies & Services, où j'ai travaillé sur des projets d'applications bancaires.",
    hints: [
      "C'est une grande entreprise de conseil en technologies.",
      "Son logo est bleu et comporte un symbole qui ressemble à un 'C'.",
      "Cette entreprise est présente dans plus de 50 pays."
    ]
  },
  {
    id: 4,
    level: 2,
    question: "Quelle technologie ai-je principalement utilisée lors de mon stage chez MyPetsLife ?",
    options: [
      "Java",
      "Python",
      "Express.js et React.js",
      "C++"
    ],
    correctAnswer: 2,
    explanation: "J'ai principalement utilisé Express.js et React.js lors de mon stage chez MyPetsLife pour développer leur plateforme.",
    hints: [
      "Une de ces technologies est un framework backend basé sur Node.js.",
      "L'autre est une bibliothèque frontend très populaire développée par Facebook.",
      "Ces technologies sont souvent utilisées ensemble pour créer des applications web full-stack en JavaScript."
    ]
  },
  {
    id: 5,
    level: 3,
    question: "Quel est mon dernier titre RNCP obtenu ?",
    options: [
      "Niveau 5 - Développeur Web",
      "Niveau 6 - Concepteur Développeur",
      "Niveau 7 - Expert IT",
      "Niveau 4 - Technicien"
    ],
    correctAnswer: 1,
    explanation: "J'ai obtenu le titre RNCP niveau 6 - Concepteur Développeur, attestant de mes compétences en développement d'applications web.",
    hints: [
      "Le RNCP est le Répertoire National des Certifications Professionnelles.",
      "Ce titre correspond à un niveau bac+3/4.",
      "Ce titre est équivalent à un niveau licence ou master 1."
    ]
  },
  {
    id: 6,
    level: 3,
    question: "Sur quel projet significatif ai-je travaillé en 2023 ?",
    options: [
      "Application mobile de livraison",
      "Logiciel de supervision Sam Tool Supervisor",
      "Système de gestion de contenu",
      "Plateforme e-commerce"
    ],
    correctAnswer: 1,
    explanation: "En 2023, j'ai travaillé sur le logiciel de supervision Sam Tool Supervisor pour suivre l'activité de contenants automatisés intelligents.",
    hints: [
      "Ce projet est lié à une entreprise d'outillage.",
      "Il s'agit d'un logiciel de suivi et de gestion.",
      "Ce projet implique des technologies IoT pour les outils connectés."
    ]
  },
  {
    id: 7,
    level: 4,
    question: "Quelle technologie principale que j'ai utilisée pour ICY - Solution de gestion d'intervention ?",
    options: [
      "React",
      "Vue.js",
      "Angular",
      "Svelte"
    ],
    correctAnswer: 2,
    explanation: "Pour ICY, j'ai principalement utilisé Angular, avec TypeScript et PWA pour développer une solution robuste et performante.",
    hints: [
      "Cette technologie est développée et maintenue par Google.",
      "Elle utilise TypeScript par défaut.",
      "Son logo est un bouclier rouge avec un 'A'."
    ]
  },
  {
    id: 8,
    level: 4,
    question: "Quelle compétence technique ai-je particulièrement développée dans mes projets récents ?",
    options: [
      "IA et machine learning",
      "Développement d'applications PWA",
      "Blockchain",
      "Réalité virtuelle"
    ],
    correctAnswer: 1,
    explanation: "Ces dernières années, j'ai particulièrement développé mes compétences en développement d'applications PWA, comme en témoigne le projet ICY.",
    hints: [
      "Cette technologie permet de créer des applications web qui fonctionnent comme des applications natives.",
      "Elle offre des fonctionnalités hors ligne et des performances améliorées.",
      "Google est un grand promoteur de cette approche de développement."
    ]
  }
];
