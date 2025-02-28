
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
        description: "Comprendre la structure de base d'une page HTML et ses éléments principaux.",
        order: 1,
        lessons: [
          {
            id: "html-intro",
            title: "Introduction au HTML",
            content: "Le HTML (HyperText Markup Language) est le langage standard pour créer des pages web. Il décrit la structure d'une page web avec des éléments qui indiquent au navigateur comment afficher le contenu.\n\nLe HTML utilise des 'tags' ou balises pour structurer le contenu. Par exemple, <p> pour les paragraphes, <h1> à <h6> pour les titres, <a> pour les liens, etc.\n\nUn document HTML de base ressemble à ceci:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Titre de la page</title>\n  <meta charset=\"UTF-8\">\n</head>\n<body>\n  <h1>Titre principal</h1>\n  <p>Un paragraphe de texte.</p>\n</body>\n</html>\n```",
            duration: 15,
            completed: false,
            order: 1,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            resources: [
              {
                id: "html-mdn",
                title: "Documentation MDN sur HTML",
                type: "documentation",
                url: "https://developer.mozilla.org/fr/docs/Web/HTML",
                description: "La référence complète du HTML par Mozilla."
              },
              {
                id: "html-w3schools",
                title: "Tutoriel HTML W3Schools",
                type: "article",
                url: "https://www.w3schools.com/html/",
                description: "Tutoriel interactif pour apprendre HTML."
              }
            ],
            exercises: [
              {
                id: "html-first-page",
                title: "Créer votre première page HTML",
                description: "Créez une page HTML simple avec un titre, un paragraphe et une image.",
                difficulty: "easy",
                codeTemplate: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Ma première page</title>\n</head>\n<body>\n  <!-- Ajoutez votre contenu ici -->\n</body>\n</html>",
                solution: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Ma première page</title>\n</head>\n<body>\n  <h1>Bienvenue sur ma première page</h1>\n  <p>Ceci est un paragraphe de texte.</p>\n  <img src=\"https://via.placeholder.com/300x200\" alt=\"Image d'exemple\">\n</body>\n</html>",
                completed: false,
                hints: [
                  "N'oubliez pas d'utiliser la balise <h1> pour le titre principal",
                  "La balise <img> nécessite les attributs src et alt"
                ],
                points: 10
              }
            ],
            quiz: [
              {
                id: "html-basics-quiz-1",
                question: "Que signifie HTML?",
                options: [
                  "Hyper Text Markup Language",
                  "High Tech Modern Language",
                  "Hyper Type Machine Learning",
                  "Home Tool Markup Language"
                ],
                correctAnswer: 0,
                explanation: "HTML signifie HyperText Markup Language. C'est le langage standard pour créer et structurer le contenu des pages web."
              },
              {
                id: "html-basics-quiz-2",
                question: "Quelle balise est utilisée pour créer un lien hypertexte?",
                options: [
                  "<link>",
                  "<a>",
                  "<href>",
                  "<hyperlink>"
                ],
                correctAnswer: 1,
                explanation: "La balise <a> (pour 'anchor' en anglais) est utilisée pour créer des liens hypertextes, avec l'attribut href pour spécifier la destination."
              }
            ]
          },
          {
            id: "html-elements",
            title: "Éléments HTML de base",
            content: "Les éléments HTML sont représentés par des balises qui définissent le contenu de la page. Les balises les plus courantes sont les titres (h1-h6), les paragraphes (p), les liens (a), et les images (img).\n\nLes titres sont structurés de <h1> (le plus important) à <h6> (le moins important). Un bon référencement et une bonne accessibilité nécessitent une structure hiérarchique cohérente des titres.\n\nLes liens sont créés avec la balise <a> et l'attribut href: <a href=\"https://exemple.com\">Texte du lien</a>\n\nLes images sont insérées avec la balise <img>, qui nécessite au minimum les attributs src (source) et alt (texte alternatif): <img src=\"image.jpg\" alt=\"Description de l'image\">",
            duration: 20,
            completed: false,
            order: 2,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            exercises: [
              {
                id: "html-elements-ex",
                title: "Utiliser les éléments de base",
                description: "Créez une page avec différents niveaux de titres, des paragraphes et des listes.",
                difficulty: "easy",
                codeTemplate: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Éléments HTML</title>\n</head>\n<body>\n  <!-- Utilisez h1, h2, p, ul, ol, li -->\n</body>\n</html>",
                completed: false,
                hints: [
                  "Utilisez <h1> pour le titre principal, <h2> pour les sous-titres",
                  "Créez une liste non ordonnée avec <ul> et <li>",
                  "Créez une liste ordonnée avec <ol> et <li>"
                ],
                points: 15
              }
            ]
          }
        ]
      },
      {
        id: "html-forms",
        title: "Formulaires HTML",
        description: "Apprendre à créer des formulaires interactifs pour collecter des informations utilisateur.",
        order: 2,
        lessons: [
          {
            id: "html-form-basics",
            title: "Bases des formulaires",
            content: "Les formulaires HTML permettent de collecter des données utilisateur. Ils sont composés d'éléments comme input, textarea, button, select, etc.\n\nUn formulaire est défini par la balise <form>, qui contient généralement les attributs action (URL où envoyer les données) et method (GET ou POST).\n\nL'élément <input> est le plus courant dans les formulaires. Son comportement est déterminé par l'attribut type (text, email, password, checkbox, radio, etc.).\n\nExemple de formulaire simple:\n\n```html\n<form action=\"/submit-form\" method=\"post\">\n  <label for=\"name\">Nom:</label>\n  <input type=\"text\" id=\"name\" name=\"name\" required>\n  \n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required>\n  \n  <button type=\"submit\">Envoyer</button>\n</form>\n```",
            duration: 25,
            completed: false,
            order: 1,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            exercises: [
              {
                id: "create-simple-form",
                title: "Créer un formulaire simple",
                description: "Créez un formulaire de contact avec des champs pour le nom, l'email et un message.",
                difficulty: "medium",
                codeTemplate: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Formulaire de contact</title>\n</head>\n<body>\n  <!-- Créez votre formulaire ici -->\n</body>\n</html>",
                completed: false,
                hints: [
                  "Utilisez <form> pour englober tous les éléments du formulaire",
                  "Ajoutez des <label> pour améliorer l'accessibilité",
                  "Utilisez <textarea> pour le champ de message"
                ],
                points: 20
              }
            ],
            quiz: [
              {
                id: "html-form-quiz-1",
                question: "Quel attribut d'un élément <input> définit son type?",
                options: [
                  "inputType",
                  "type",
                  "form-type",
                  "data-type"
                ],
                correctAnswer: 1,
                explanation: "L'attribut 'type' définit le type d'input, comme 'text', 'email', 'password', etc."
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
    slug: "fondamentaux-html",
    rating: 4.8,
    reviewCount: 125,
    updatedAt: "2023-10-15",
    popularity: 98,
    tags: ["html", "web", "débutant", "bases"],
    price: 0,
    featured: true,
    language: "french",
    certificateAvailable: true
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
        description: "Comprendre la syntaxe CSS et comment appliquer des styles à vos pages web.",
        lessons: [
          {
            id: "css-intro",
            title: "Introduction au CSS",
            content: "CSS (Cascading Style Sheets) est utilisé pour styliser les pages web. Il contrôle la couleur, la police, la taille, l'espacement et bien d'autres aspects visuels.\n\nIl existe trois façons d'ajouter du CSS à un document HTML :\n1. CSS externe (fichier .css séparé)\n2. CSS interne (dans la section <head>)\n3. CSS en ligne (attribut style)\n\nLa syntaxe CSS de base comprend un sélecteur et une déclaration :\n\n```css\nsélecteur {\n  propriété: valeur;\n  propriété: valeur;\n}\n```\n\nExemple :\n```css\np {\n  color: blue;\n  font-size: 16px;\n}\n```",
            duration: 15,
            completed: false,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            exercises: [
              {
                id: "css-first-style",
                title: "Votre première feuille de style",
                description: "Créez une feuille de style CSS pour changer les couleurs et les polices d'une page HTML.",
                difficulty: "easy",
                codeTemplate: "/* Ajoutez vos styles ici */",
                completed: false,
                hints: [
                  "Utilisez 'body' comme sélecteur pour appliquer des styles à toute la page",
                  "La propriété 'font-family' permet de changer la police",
                  "Utilisez 'h1', 'p' pour cibler ces éléments spécifiques"
                ]
              }
            ],
            quiz: [
              {
                id: "css-basics-quiz",
                question: "Quelle syntaxe CSS est correcte?",
                options: [
                  "body { color = black; }",
                  "body: { color: black; }",
                  "body { color: black; }",
                  "{body color: black;}"
                ],
                correctAnswer: 2,
                explanation: "La syntaxe correcte en CSS est: sélecteur { propriété: valeur; }"
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
    slug: "css-pour-debutants",
    rating: 4.6,
    reviewCount: 98,
    updatedAt: "2023-11-20",
    popularity: 85,
    tags: ["css", "web", "design", "débutant"],
    price: 19.99,
    discount: 15,
    featured: true,
    language: "french",
    certificateAvailable: true
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
        description: "Les concepts fondamentaux de JavaScript: variables, types, fonctions, et structures de contrôle.",
        lessons: [
          {
            id: "js-variables",
            title: "Variables et types de données",
            content: "JavaScript utilise des variables pour stocker des données. Les principaux types de données sont les nombres, les chaînes de caractères, les booléens, les objets et les tableaux.\n\nLes variables peuvent être déclarées avec let, const ou var :\n\n```javascript\n// let pour les variables qui peuvent changer\nlet age = 25;\n\n// const pour les constantes\nconst name = 'John';\n\n// var (ancienne méthode, moins recommandée)\nvar score = 100;\n```\n\nLes nombres peuvent être entiers ou décimaux :\n```javascript\nlet entier = 42;\nlet decimal = 3.14;\n```\n\nLes chaînes de caractères sont entourées de guillemets :\n```javascript\nlet prenom = 'Marie';\nlet message = \"Bienvenue sur notre site\";\nlet template = `Bonjour ${prenom}, vous avez ${age} ans.`;\n```\n\nLes booléens n'ont que deux valeurs :\n```javascript\nlet estConnecte = true;\nlet estAbonne = false;\n```",
            duration: 20,
            completed: false,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            exercises: [
              {
                id: "js-var-exercise",
                title: "Travailler avec des variables",
                description: "Créez et manipulez différents types de variables en JavaScript.",
                difficulty: "medium",
                codeTemplate: "// Déclarez les variables suivantes:\n// 1. Une constante pour votre nom\n// 2. Une variable modifiable pour votre âge\n// 3. Une variable booléenne\n// 4. Un tableau avec vos hobbies\n// 5. Un objet contenant des informations sur vous\n\n// Votre code ici\n\n",
                completed: false,
                testCases: [
                  {
                    id: "test-nom",
                    input: "typeof nom",
                    expectedOutput: "string",
                    isPublic: true
                  },
                  {
                    id: "test-age",
                    input: "typeof age === 'number'",
                    expectedOutput: "true",
                    isPublic: true
                  }
                ]
              }
            ],
            quiz: [
              {
                id: "js-data-types-quiz",
                question: "Quel n'est PAS un type de données en JavaScript?",
                options: [
                  "String",
                  "Boolean",
                  "Float",
                  "Object"
                ],
                correctAnswer: 2,
                explanation: "JavaScript n'a pas de type 'Float' distinct. Les nombres à virgule flottante sont simplement de type 'number'."
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
    slug: "javascript-fondamentaux",
    rating: 4.9,
    reviewCount: 212,
    updatedAt: "2023-12-05",
    popularity: 95,
    tags: ["javascript", "programmation", "web", "interactivité"],
    price: 29.99,
    discount: 0,
    featured: true,
    language: "french",
    certificateAvailable: true
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
        description: "Installation, configuration et premiers pas avec Python.",
        lessons: [
          {
            id: "python-install",
            title: "Installation et configuration",
            content: "Apprenez à installer Python et à configurer votre environnement de développement avec des outils comme VS Code ou PyCharm.\n\nPython est disponible pour Windows, macOS et Linux. Téléchargez-le depuis le site officiel à python.org.\n\nSur Windows, assurez-vous de cocher l'option 'Add Python to PATH' lors de l'installation.\n\nPour vérifier que Python est correctement installé, ouvrez un terminal et tapez :\n```bash\npython --version\n```\n\nVous devriez voir la version de Python s'afficher, par exemple 'Python 3.10.0'.\n\nEnsuite, vous pouvez installer un éditeur de code comme VS Code, qui offre d'excellentes fonctionnalités pour Python avec l'extension Python de Microsoft.",
            duration: 15,
            completed: false,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            exercises: [
              {
                id: "python-hello-world",
                title: "Votre premier programme Python",
                description: "Écrivez un programme 'Hello World' en Python et exécutez-le.",
                difficulty: "easy",
                codeTemplate: "# Écrivez votre premier programme Python ici\n\n",
                solution: "print(\"Hello, World!\")",
                completed: false,
                hints: [
                  "Utilisez la fonction print() pour afficher du texte",
                  "Les chaînes de caractères sont entre guillemets"
                ]
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
    slug: "introduction-python",
    rating: 4.7,
    reviewCount: 156,
    updatedAt: "2023-11-10",
    popularity: 88,
    tags: ["python", "programmation", "data science", "débutant"],
    price: 24.99,
    discount: 10,
    language: "french",
    certificateAvailable: true
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
        description: "Fondamentaux de React, JSX et le modèle de composants.",
        lessons: [
          {
            id: "react-components",
            title: "Composants React",
            content: "Les composants sont les blocs de construction de toute application React. Ils vous permettent de diviser l'interface utilisateur en pièces indépendantes et réutilisables.\n\nIl existe deux types de composants React :\n\n1. **Composants fonctionnels** (recommandés) :\n```jsx\nfunction Welcome(props) {\n  return <h1>Bonjour, {props.name}</h1>;\n}\n```\n\n2. **Composants de classe** (ancienne méthode) :\n```jsx\nclass Welcome extends React.Component {\n  render() {\n    return <h1>Bonjour, {this.props.name}</h1>;\n  }\n}\n```\n\nLes composants peuvent recevoir des données via des props (propriétés) et peuvent avoir un état interne avec les hooks (useState, useEffect, etc.) pour les composants fonctionnels.\n\nLe rendu d'un composant se fait en l'incluant dans le JSX, comme une balise HTML :\n```jsx\n<Welcome name=\"Alice\" />\n```",
            duration: 25,
            completed: false,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            resources: [
              {
                id: "react-docs",
                title: "Documentation officielle React",
                type: "documentation",
                url: "https://reactjs.org/docs/getting-started.html",
                description: "La documentation complète et officielle de React."
              },
              {
                id: "react-github",
                title: "Repo GitHub React",
                type: "github",
                url: "https://github.com/facebook/react",
                description: "Le code source officiel de React sur GitHub."
              }
            ],
            exercises: [
              {
                id: "create-component",
                title: "Créer votre premier composant",
                description: "Créez un composant React simple qui affiche un message de bienvenue.",
                difficulty: "medium",
                codeTemplate: "// Créez un composant fonctionnel Greeting qui prend un prop 'name'\n// et affiche 'Bonjour, [name]!'\n\n// Votre code ici\n\n",
                solution: "function Greeting({ name }) {\n  return <h1>Bonjour, {name}!</h1>;\n}\n\nexport default Greeting;",
                completed: false
              }
            ],
            quiz: [
              {
                id: "react-component-quiz",
                question: "Quelle est la syntaxe correcte pour un composant fonctionnel React?",
                options: [
                  "function MyComponent(props) { return <div>{props.text}</div>; }",
                  "const MyComponent = (props) => { <div>{props.text}</div> }",
                  "function MyComponent { return <div>Hello</div>; }",
                  "class MyComponent extends React { render() { return <div>Hello</div>; } }"
                ],
                correctAnswer: 0,
                explanation: "Un composant fonctionnel est une fonction JavaScript qui accepte des props et retourne du JSX."
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
    slug: "react-pour-debutants",
    rating: 4.8,
    reviewCount: 178,
    updatedAt: "2023-12-15",
    popularity: 92,
    tags: ["react", "javascript", "frontend", "ui"],
    price: 49.99,
    discount: 20,
    featured: true,
    language: "french",
    certificateAvailable: true
  }
];
