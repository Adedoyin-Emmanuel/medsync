"use client";

import React from "react";

interface TextProps {
  className?: string;
  children: React.ReactNode;
  noCapitalize?: boolean;
}

const Text = ({ className, children, noCapitalize }: TextProps) => {
  return (
    <p className={`text-sm ${noCapitalize ? "" : "capitalize"} ${className}`}>
      {children}
    </p>
  );
};

export default Text;
