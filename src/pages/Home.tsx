import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to My Portfolio
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Explore my projects, skills, and experiences. Feel free to reach out!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/projects"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700"
          >
            View Projects
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-600 hover:text-white"
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
