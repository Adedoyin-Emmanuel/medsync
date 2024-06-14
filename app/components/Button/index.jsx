import React from "react";

const Button = ({ className = "", children, disabled = false, onClick, ...others }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{backgroundColor:" #218353;"}}
      className={`capitalize text-white ${className} w-full rounded-xl p-5  transition-colors`}
      {...others}
    >
      {children}
    </button>
  );
};

export default Button;
