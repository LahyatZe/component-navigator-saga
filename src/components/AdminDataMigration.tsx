
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { migrateCoursesToSupabase } from "@/services/dataMigrationService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminDataMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const handleMigration = async () => {
    if (window.confirm("This will migrate all local course data to Supabase. Continue?")) {
      setIsLoading(true);
      try {
        const result = await migrateCoursesToSupabase();
        if (result.success) {
          toast.success("Data migration completed successfully!");
          setMigrationComplete(true);
        } else {
          toast.error("Error during data migration. Check console for details.");
        }
      } catch (error) {
        console.error("Migration error:", error);
        toast.error("Error during data migration. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Data Migration</CardTitle>
        <CardDescription>
          Migrate local course data to Supabase database. This should only be run once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This tool will migrate all courses from your local data to the Supabase database.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Note: This process may take a few minutes to complete. The page might appear frozen during the migration.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleMigration} 
          disabled={isLoading || migrationComplete}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating Data...
            </>
          ) : migrationComplete ? (
            "Migration Complete"
          ) : (
            "Start Migration"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminDataMigration;
