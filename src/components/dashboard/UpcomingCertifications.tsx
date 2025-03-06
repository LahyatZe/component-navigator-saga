
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from 'lucide-react';

const UpcomingCertifications: FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Prochaines certifications</CardTitle>
        <CardDescription>Objectifs à atteindre</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 p-2 sm:p-3 bg-secondary/20 rounded-lg">
            <Trophy className="text-yellow-500 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
            <div>
              <h4 className="text-sm sm:text-base font-semibold">HTML & CSS</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">2 cours restants</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 sm:p-3 bg-secondary/20 rounded-lg">
            <Award className="text-blue-500 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
            <div>
              <h4 className="text-sm sm:text-base font-semibold">JavaScript Fondamentaux</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">1 cours restant</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingCertifications;
