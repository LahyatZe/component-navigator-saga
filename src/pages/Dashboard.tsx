
import { FC, useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Book } from 'lucide-react';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import InstructorDashboard from '@/components/dashboard/InstructorDashboard';
import SignedOutView from '@/components/dashboard/SignedOutView';

const Dashboard: FC = () => {
  const [activeRole, setActiveRole] = useState<'student' | 'instructor'>('student');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <SignedIn>
        <WelcomeMessage />
        
        <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as 'student' | 'instructor')} className="mb-8">
          <TabsList>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Étudiant</span>
            </TabsTrigger>
            <TabsTrigger value="instructor" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span>Instructeur</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="student" className="mt-6">
            <StudentDashboard />
          </TabsContent>
          
          <TabsContent value="instructor" className="mt-6">
            <InstructorDashboard />
          </TabsContent>
        </Tabs>
      </SignedIn>
      
      <SignedOut>
        <SignedOutView />
      </SignedOut>
    </div>
  );
};

export default Dashboard;
