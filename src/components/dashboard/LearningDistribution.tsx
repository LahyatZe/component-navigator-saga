
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

const LearningDistribution: FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Répartition de votre apprentissage</CardTitle>
        <CardDescription>Temps passé par catégorie de cours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={50}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningDistribution;
