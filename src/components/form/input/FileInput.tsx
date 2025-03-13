import { FC } from "react";

interface FileInputProps {
  className?: string;
  onFileSelect: (file: File | null) => void;
}

const FileInput: FC<FileInputProps> = ({ className, onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Récupère le premier fichier sélectionné
    onFileSelect(file); // Appelle la fonction passée en props
  };

  return (
    <input
      type="file"
      accept=".pdf,.png,.jpg,.jpeg" // ✅ Permet de limiter aux formats autorisés
      className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-none focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 ${className}`}
      onChange={handleFileChange}
    />
  );
};

export default FileInput;
