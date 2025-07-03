
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AttachmentIcon from '@/components/icons/AttachmentIcon';

interface AttachmentButtonProps {
  onFileSelect: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ 
  onFileSelect, 
  className = "",
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (file.size > maxSize) {
        toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type "${file.type}" is not supported.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
      toast.success(`${validFiles.length} file(s) attached successfully.`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleFileClick}
        disabled={disabled}
        className={`cyber-button relative from-slate-700 to-slate-900 bg-gradient-to-br border border-slate-500/30 hover:from-slate-600 hover:to-slate-800 shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
        title="Attach files (images, documents)"
      >
        <AttachmentIcon className="h-5 w-5" />
      </Button>
    </>
  );
};

export default AttachmentButton;
