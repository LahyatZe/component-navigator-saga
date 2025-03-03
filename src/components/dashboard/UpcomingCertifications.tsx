
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from 'lucide-react';

const UpcomingCertifications: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaines certifications</CardTitle>
        <CardDescription>Objectifs à atteindre</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
            <Trophy className="text-yellow-500 h-10 w-10" />
            <div>
              <h4 className="font-semibold">HTML & CSS</h4>
              <p className="text-sm text-muted-foreground">2 cours restants</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
            <Award className="text-blue-500 h-10 w-10" />
            <div>
              <h4 className="font-semibold">JavaScript Fondamentaux</h4>
              <p className="text-sm text-muted-foreground">1 cours restant</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingCertifications;
