
import { FC } from 'react';
import { courses } from '@/data/courses';
import StudentStats from './StudentStats';
import CourseProgress from './CourseProgress';
import LearningDistribution from './LearningDistribution';
import UpcomingCertifications from './UpcomingCertifications';
import useResponsive from '@/hooks/useResponsive';

// Données simulées pour les statistiques
const studentData = [
  { name: 'HTML', value: 45 },
  { name: 'CSS', value: 32 },
  { name: 'JavaScript', value: 28 },
  { name: 'Python', value: 18 },
  { name: 'React', value: 15 }
];

const StudentDashboard: FC = () => {
  const { isMobile } = useResponsive();
  
  // Simuler les données de progression de l'utilisateur
  const userCourseProgress = courses.map(course => ({
    id: course.id,
    title: course.title,
    progress: Math.floor(Math.random() * 100)
  })).slice(0, 3);
  
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-1 md:px-0 mobile-container">
      <StudentStats 
        coursesCount={userCourseProgress.length} 
        totalCourses={courses.length} 
      />
      
      <CourseProgress courses={userCourseProgress} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className={`${isMobile ? 'order-2' : 'order-1'} lg:col-span-2`}>
          <LearningDistribution data={studentData} />
        </div>
        <div className={`${isMobile ? 'order-1' : 'order-2'} lg:col-span-1`}>
          <UpcomingCertifications />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
