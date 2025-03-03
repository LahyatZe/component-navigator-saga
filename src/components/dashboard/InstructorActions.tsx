
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users } from 'lucide-react';

const InstructorActions: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Gérer vos cours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Créer un nouveau cours
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gérer les cours existants
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Users className="h-4 w-4" />
            Voir les étudiants
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorActions;
