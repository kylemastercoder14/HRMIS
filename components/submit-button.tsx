import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
interface ButtonProps {
  isLoading: boolean;
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
const SubmitButton = ({ isLoading, isDisabled, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || isDisabled}
      className={className ?? "w-full"}
    >
      {isLoading && <Loader2 className="w-4 mr-2 h-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default SubmitButton;
