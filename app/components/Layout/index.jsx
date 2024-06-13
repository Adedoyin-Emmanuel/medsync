import React from "react";

const Layout = ({ className = "", children, ...others }) => {
  return (
    <section
      className={`w-full md:items-start flex flex-col overflow-x-hidden ${className}`}
      {...others}
    >
      {children}
    </section>
  );
};

export default Layout;
