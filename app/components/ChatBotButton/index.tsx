"use client";
import React from "react";
import { LiaRobotSolid } from "react-icons/lia";

interface ChatBotButton extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onClick?: () => void;
  others?: React.Attributes;
}

const ChatBotButton = ({ className, onClick, ...others }: ChatBotButton) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(true);
  let scrollTimeout: any = null;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(false);
      console.log("scrolling");

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);
  return (
    <section className="fixed bottom-20 right-3">
      {isVisible && (
        <section
          className={`w-16 h-16 flex items-center justify-center  bg-accent rounded-full shadow cursor-pointer relative transform-gpu transition-transform duration-200 scale-100 hover:scale-110 ${className}`}
          onClick={onClick}
          {...others}
        >
          <LiaRobotSolid className="h-10 w-10 text-white" />
        </section>
      )}
    </section>
  );
};

export default ChatBotButton;
