import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  content: string;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  content
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
        <p className="font-semibold mt-2">Your QCE Performance Results in this rating period is {content}</p>
    </Modal>
  );
};

export default RecommendationModal;
