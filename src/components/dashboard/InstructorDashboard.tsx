
import { FC } from 'react';
import InstructorStats from './InstructorStats';
import CoursePerformance from './CoursePerformance';
import InstructorActions from './InstructorActions';
import StudentActivities from './StudentActivities';

// Données simulées pour les statistiques
const studentData = [
  { name: 'HTML', value: 45 },
  { name: 'CSS', value: 32 },
  { name: 'JavaScript', value: 28 },
  { name: 'Python', value: 18 },
  { name: 'React', value: 15 }
];

const InstructorDashboard: FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <InstructorStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <CoursePerformance data={studentData} />
        <InstructorActions />
      </div>
      
      <StudentActivities />
    </div>
  );
};

export default InstructorDashboard;
