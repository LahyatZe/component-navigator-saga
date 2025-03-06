
import { FC } from 'react';
import InstructorStats from './InstructorStats';
import CoursePerformance from './CoursePerformance';
import InstructorActions from './InstructorActions';
import StudentActivities from './StudentActivities';
import useResponsive from '@/hooks/useResponsive';

// Données simulées pour les statistiques
const studentData = [
  { name: 'HTML', value: 45 },
  { name: 'CSS', value: 32 },
  { name: 'JavaScript', value: 28 },
  { name: 'Python', value: 18 },
  { name: 'React', value: 15 }
];

const InstructorDashboard: FC = () => {
  const { isMobile } = useResponsive();
  
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-1 md:px-0 mobile-container">
      <InstructorStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className={`${isMobile ? 'order-2' : 'order-1'} lg:col-span-2`}>
          <CoursePerformance data={studentData} />
        </div>
        <div className={`${isMobile ? 'order-1' : 'order-2'} lg:col-span-1`}>
          <InstructorActions />
        </div>
      </div>
      
      <StudentActivities />
    </div>
  );
};

export default InstructorDashboard;
