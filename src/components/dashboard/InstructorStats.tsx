
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InstructorStats: FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Étudiants actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">127</div>
          <p className="text-xs sm:text-sm text-muted-foreground">+12% depuis le mois dernier</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Cours publiés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">5</div>
          <p className="text-xs sm:text-sm text-muted-foreground">sur la plateforme</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Taux de complétion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">78%</div>
          <p className="text-xs sm:text-sm text-muted-foreground">en moyenne</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Questions en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">14</div>
          <p className="text-xs sm:text-sm text-muted-foreground">à répondre</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorStats;
