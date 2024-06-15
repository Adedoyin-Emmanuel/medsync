import React from "react";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  className,
  children,
  disabled,
  onClick,
  ...others
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`capitalize text-white ${className} w-full rounded text-sm p-4 bg-[#3BCE87] hover:bg-[#2DB472] transition-colors `}
      {...others}
    >
      {children}
    </button>
  );
};

export default Button;
