
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
    <div className="space-y-8">
      <InstructorStats />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CoursePerformance data={studentData} />
        <InstructorActions />
      </div>
      
      <StudentActivities />
    </div>
  );
};

export default InstructorDashboard;
