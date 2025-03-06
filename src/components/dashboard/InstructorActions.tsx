
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users } from 'lucide-react';

const InstructorActions: FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Actions</CardTitle>
        <CardDescription>Gérer vos cours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <Button className="w-full flex items-center gap-2 h-auto py-2 sm:py-3">
            <Plus className="h-4 w-4" />
            <span>Créer un nouveau cours</span>
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-2 sm:py-3">
            <FileText className="h-4 w-4" />
            <span>Gérer les cours existants</span>
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-2 sm:py-3">
            <Users className="h-4 w-4" />
            <span>Voir les étudiants</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorActions;
