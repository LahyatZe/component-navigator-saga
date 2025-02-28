
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Viewing project with ID: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Project content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Project;
