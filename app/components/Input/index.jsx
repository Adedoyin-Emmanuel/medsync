"use client";

import React from "react";

const Input = ({ className, inputRef, required = true, ...others }) => {
  return (
    <input
      ref={inputRef}
      className="input border-2 border-gray-500 focus:outline-none rounded-xl p-4 w-full h-14"
      {...others}
      required={required}
    />
  );
};

export default Input;
