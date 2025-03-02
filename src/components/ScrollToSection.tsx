
import { FC } from 'react';

interface ScrollToSectionProps {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
  behavior?: ScrollBehavior;
}

const ScrollToSection: FC<ScrollToSectionProps> = ({ 
  sectionId, 
  children, 
  className = "",
  behavior = "smooth" 
}) => {
  const handleClick = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior });
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export const scrollToSection = (id: string, behavior: ScrollBehavior = "smooth") => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior });
  }
};

export default ScrollToSection;
