import React from "react";

type PanelProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthFormPanel({
  title,
  description,
  footer,
  children,
}: PanelProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header Section */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-2xl font-black tracking-widest text-stone-900 uppercase">
          {title}
        </h1>
        <p className="text-xs text-stone-500 mt-1">{description}</p>
      </div>

      {/* Main Form & Social Buttons (Children) */}
      {children}

      {/* Footer Section */}
      <div className="text-center text-xs text-stone-500 pt-2 ">
        {footer}
      </div>
    </div>
  );
}