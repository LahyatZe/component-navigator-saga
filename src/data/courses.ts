
import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "html-basics",
    title: "Les fondamentaux du HTML",
    description: "Apprenez les bases du HTML pour créer vos premières pages web. Ce cours couvre tous les éléments HTML essentiels et leur utilisation.",
    level: "beginner",
    category: "html",
    duration: 120,
    modules: [
      {
        id: "html-structure",
        title: "Structure HTML",
        lessons: [
          {
            id: "html-intro",
            title: "Introduction au HTML",
            content: "Le HTML (HyperText Markup Language) est le langage standard pour créer des pages web. Il décrit la structure d'une page web avec des éléments qui indiquent au navigateur comment afficher le contenu.",
            duration: 15,
            completed: false,
            exercises: [
              {
                id: "html-first-page",
                title: "Créer votre première page HTML",
                description: "Créez une page HTML simple avec un titre, un paragraphe et une image.",
                difficulty: "easy",
                codeTemplate: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Ma première page</title>\n</head>\n<body>\n  <!-- Ajoutez votre contenu ici -->\n</body>\n</html>",
                completed: false
              }
            ]
          },
          {
            id: "html-elements",
            title: "Éléments HTML de base",
            content: "Les éléments HTML sont représentés par des balises qui définissent le contenu de la page. Les balises les plus courantes sont les titres (h1-h6), les paragraphes (p), les liens (a), et les images (img).",
            duration: 20,
            completed: false,
            exercises: [
              {
                id: "html-elements-ex",
                title: "Utiliser les éléments de base",
                description: "Créez une page avec différents niveaux de titres, des paragraphes et des listes.",
                difficulty: "easy",
                completed: false
              }
            ]
          }
        ]
      },
      {
        id: "html-forms",
        title: "Formulaires HTML",
        lessons: [
          {
            id: "html-form-basics",
            title: "Bases des formulaires",
            content: "Les formulaires HTML permettent de collecter des données utilisateur. Ils sont composés d'éléments comme input, textarea, button, select, etc.",
            duration: 25,
            completed: false,
            exercises: [
              {
                id: "create-simple-form",
                title: "Créer un formulaire simple",
                description: "Créez un formulaire de contact avec des champs pour le nom, l'email et un message.",
                difficulty: "medium",
                completed: false
              }
            ]
          }
        ]
      }
    ],
    prerequisites: [],
    author: "Marie Dupont",
    authorRole: "Développeuse Web Senior",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    published: true,
    slug: "fondamentaux-html"
  },
  {
    id: "css-basics",
    title: "CSS pour débutants",
    description: "Apprenez à styliser vos pages web avec CSS. De la syntaxe de base aux mises en page complexes, ce cours couvre tout ce dont vous avez besoin pour donner vie à vos designs.",
    level: "beginner",
    category: "css",
    duration: 180,
    modules: [
      {
        id: "css-syntax",
        title: "Syntaxe CSS",
        lessons: [
          {
            id: "css-intro",
            title: "Introduction au CSS",
            content: "CSS (Cascading Style Sheets) est utilisé pour styliser les pages web. Il contrôle la couleur, la police, la taille, l'espacement et bien d'autres aspects visuels.",
            duration: 15,
            completed: false,
            exercises: [
              {
                id: "css-first-style",
                title: "Votre première feuille de style",
                description: "Créez une feuille de style CSS pour changer les couleurs et les polices d'une page HTML.",
                difficulty: "easy",
                completed: false
              }
            ]
          }
        ]
      }
    ],
    prerequisites: ["html-basics"],
    author: "Lucas Martin",
    authorRole: "Designer UI/UX",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    published: true,
    slug: "css-pour-debutants"
  },
  {
    id: "js-fundamentals",
    title: "JavaScript: Les fondamentaux",
    description: "Découvrez les concepts de base de JavaScript, le langage de programmation du web. Apprenez à manipuler le DOM, gérer les événements et créer des applications interactives.",
    level: "intermediate",
    category: "javascript",
    duration: 240,
    modules: [
      {
        id: "js-basics",
        title: "Bases de JavaScript",
        lessons: [
          {
            id: "js-variables",
            title: "Variables et types de données",
            content: "JavaScript utilise des variables pour stocker des données. Les principaux types de données sont les nombres, les chaînes de caractères, les booléens, les objets et les tableaux.",
            duration: 20,
            completed: false,
            exercises: [
              {
                id: "js-var-exercise",
                title: "Travailler avec des variables",
                description: "Créez et manipulez différents types de variables en JavaScript.",
                difficulty: "medium",
                completed: false
              }
            ]
          }
        ]
      }
    ],
    prerequisites: ["html-basics", "css-basics"],
    author: "Thomas Bernard",
    authorRole: "Développeur Frontend",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    published: true,
    slug: "javascript-fondamentaux"
  },
  {
    id: "python-intro",
    title: "Introduction à Python",
    description: "Découvrez Python, un langage polyvalent utilisé dans le développement web, la science des données, l'IA et bien plus encore. Ce cours vous donne les bases pour démarrer avec Python.",
    level: "beginner",
    category: "python",
    duration: 210,
    modules: [
      {
        id: "python-start",
        title: "Démarrer avec Python",
        lessons: [
          {
            id: "python-install",
            title: "Installation et configuration",
            content: "Apprenez à installer Python et à configurer votre environnement de développement avec des outils comme VS Code ou PyCharm.",
            duration: 15,
            completed: false,
            exercises: [
              {
                id: "python-hello-world",
                title: "Votre premier programme Python",
                description: "Écrivez un programme 'Hello World' en Python et exécutez-le.",
                difficulty: "easy",
                completed: false
              }
            ]
          }
        ]
      }
    ],
    prerequisites: [],
    author: "Sophie Moreau",
    authorRole: "Data Scientist",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    published: true,
    slug: "introduction-python"
  },
  {
    id: "react-beginners",
    title: "React pour débutants",
    description: "Apprenez à construire des interfaces utilisateur modernes avec React. Ce cours vous guide à travers les concepts fondamentaux de React et vous montre comment créer des applications web interactives.",
    level: "intermediate",
    category: "react",
    duration: 300,
    modules: [
      {
        id: "react-intro",
        title: "Introduction à React",
        lessons: [
          {
            id: "react-components",
            title: "Composants React",
            content: "Les composants sont les blocs de construction de toute application React. Ils vous permettent de diviser l'interface utilisateur en pièces indépendantes et réutilisables.",
            duration: 25,
            completed: false,
            exercises: [
              {
                id: "create-component",
                title: "Créer votre premier composant",
                description: "Créez un composant React simple qui affiche un message de bienvenue.",
                difficulty: "medium",
                completed: false
              }
            ]
          }
        ]
      }
    ],
    prerequisites: ["html-basics", "css-basics", "js-fundamentals"],
    author: "Alex Dubois",
    authorRole: "Développeur React Senior",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    published: true,
    slug: "react-pour-debutants"
  }
];
