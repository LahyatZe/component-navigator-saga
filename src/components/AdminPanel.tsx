
import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    year: '',
    company: '',
    section: 'timeline' // timeline, about, projects, contact
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez sauvegarder dans une base de données
    toast.success("Contenu ajouté avec succès");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter du contenu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Section</label>
            <select 
              className="w-full p-2 border rounded-md mt-1"
              value={newContent.section}
              onChange={(e) => setNewContent({...newContent, section: e.target.value})}
            >
              <option value="timeline">Parcours</option>
              <option value="about">À propos</option>
              <option value="projects">Projets</option>
              <option value="contact">Contact</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input 
              value={newContent.title}
              onChange={(e) => setNewContent({...newContent, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={newContent.description}
              onChange={(e) => setNewContent({...newContent, description: e.target.value})}
            />
          </div>
          
          {newContent.section === 'timeline' && (
            <>
              <div>
                <label className="text-sm font-medium">Année</label>
                <Input 
                  value={newContent.year}
                  onChange={(e) => setNewContent({...newContent, year: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Entreprise</label>
                <Input 
                  value={newContent.company}
                  onChange={(e) => setNewContent({...newContent, company: e.target.value})}
                />
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full">
            Ajouter
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
