"use client";

import React from "react";

const Text = ({ className = "", children, noCapitalize = false }) => {
  return (
    <p className={`text-md  ${noCapitalize ? "text-green-400 font-thin" : "capitalize"} ${className}`}>
      {children}
    </p>
  );
};

export default Text;
