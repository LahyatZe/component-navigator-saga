
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
    explanation: "J'ai obtenu un Bac ES en 2018 avant de poursuivre mes études en informatique."
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
    explanation: "J'ai commencé mes études supérieures à Saint-Étienne, où j'ai développé mes premières compétences en développement."
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
    explanation: "J'ai effectué mon alternance chez Capgemini Technologies & Services, où j'ai travaillé sur des projets d'applications bancaires."
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
    explanation: "J'ai principalement utilisé Express.js et React.js lors de mon stage chez MyPetsLife pour développer leur plateforme."
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
    explanation: "J'ai obtenu le titre RNCP niveau 5 - Développeur Web, attestant de mes compétences en développement d'applications web."
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
    explanation: "En 2023, j'ai travaillé sur le logiciel de supervision Sam Tool Supervisor pour suivre l'activité de contenants automatisés intelligents."
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
    explanation: "Pour ICY, j'ai principalement utilisé Angular, avec TypeScript et PWA pour développer une solution robuste et performante."
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
    explanation: "Ces dernières années, j'ai particulièrement développé mes compétences en développement d'applications PWA, comme en témoigne le projet ICY."
  }
];
