
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  fallback?: string;
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ 
  size = 'md', 
  src = '/profile-photo.jpg',
  fallback = 'SZ'
}) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40'
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} border-4 border-background shadow-lg`}>
        <AvatarImage src={src} alt="Sohaib Zeghouani" />
        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold flex items-center justify-center">
          {src ? <User className="w-8 h-8" /> : fallback}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
