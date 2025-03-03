
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  BellDot, 
  Check, 
  Trash2, 
  X,
  Info,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Notification } from '@/types/notification';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

const NotificationCenter: FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // Mark all as read when opening the notification center
      // This is optional, you can remove this if you want users to manually mark as read
      // markAllAsRead();
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <Check className="mr-1 h-3 w-3" />
                Tout marquer comme lu
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                className="h-8 px-2 text-xs text-red-500 hover:text-red-600"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Effacer tout
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="max-h-[60vh]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 relative",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[10px] text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Marquer comme lu
                          </Button>
                        )}
                      </div>
                      
                      {notification.link && (
                        <Link 
                          to={notification.link}
                          className="text-xs text-primary hover:underline block mt-1"
                          onClick={() => {
                            markAsRead(notification.id);
                            setIsOpen(false);
                          }}
                        >
                          Voir les détails
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
              <p className="text-sm font-medium">Aucune notification</p>
              <p className="text-xs text-muted-foreground">
                Vous recevrez des notifications sur les mises à jour importantes.
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
