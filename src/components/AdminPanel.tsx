
import { FC, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const AdminPanel: FC<AdminPanelProps> = ({ isOpen = true, onClose = () => {}, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
