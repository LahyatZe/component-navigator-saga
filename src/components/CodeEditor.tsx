
import { FC, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  height?: string;
}

export const CodeEditor: FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  language = 'javascript',
  height = '300px'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = height;
    }
  }, [height]);

  // Gérer les tabulations
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Si l'utilisateur appuie sur Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insérer une tabulation (2 espaces)
      const newValue = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      
      // Mettre à jour l'état et replacer le curseur
      onChange(newValue);
      
      // Ce setTimeout est nécessaire pour que la sélection se fasse après le rendu
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="code-editor border rounded-md overflow-hidden">
      <div className="bg-secondary px-3 py-1 text-xs font-mono text-muted-foreground border-b">
        {language}
      </div>
      <Textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="font-mono text-sm resize-none w-full p-4 bg-secondary/10 focus:outline-none focus:ring-0 border-0 rounded-none"
        style={{ 
          height,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'normal',
          overflowX: 'auto'
        }}
      />
    </div>
  );
};
