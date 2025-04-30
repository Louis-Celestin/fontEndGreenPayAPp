import { useRef, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 300); // attend la fin du fadeOut (300ms)
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!visible) return null;

  const animationClass = isOpen ? "fade-in" : "fade-out";

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-[90%] max-w-lg rounded-3xl bg-white dark:bg-gray-900";

  return (
    <div className={`fixed inset-0 flex items-center justify-center overflow-y-auto z-[99999] ${animationClass}`}>
      {!isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-black"
          >
            ×
          </button>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
