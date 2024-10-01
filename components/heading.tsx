import React from "react";

interface HeadingProps {
  title: string;
  description: string;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description, className }) => {
  return (
    <div className={className}>
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-md mt-2">{description}</p>
    </div>
  );
};

export default Heading;
