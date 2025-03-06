
import { FC } from 'react';
import { courses } from '@/data/courses';
import StudentStats from './StudentStats';
import CourseProgress from './CourseProgress';
import LearningDistribution from './LearningDistribution';
import UpcomingCertifications from './UpcomingCertifications';

// Données simulées pour les statistiques
const studentData = [
  { name: 'HTML', value: 45 },
  { name: 'CSS', value: 32 },
  { name: 'JavaScript', value: 28 },
  { name: 'Python', value: 18 },
  { name: 'React', value: 15 }
];

const StudentDashboard: FC = () => {
  // Simuler les données de progression de l'utilisateur
  const userCourseProgress = courses.map(course => ({
    id: course.id,
    title: course.title,
    progress: Math.floor(Math.random() * 100)
  })).slice(0, 3);
  
  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <StudentStats 
        coursesCount={userCourseProgress.length} 
        totalCourses={courses.length} 
      />
      
      <CourseProgress courses={userCourseProgress} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <LearningDistribution data={studentData} />
        <UpcomingCertifications />
      </div>
    </div>
  );
};

export default StudentDashboard;
