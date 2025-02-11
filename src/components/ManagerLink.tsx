"use client";

import { useState } from "react";
import Checkbox from "./ui/CheckBox";

interface ManagerLinkProps {
  title: string; // Title of the link section
  link: string; // URL link to display
}

export default function ManagerLink({ title, link }: ManagerLinkProps) {
  const [isDamaged, setIsDamaged] = useState<boolean>(false); // Checkbox state
  const [generatedLink, setGeneratedLink] = useState<string | null>(link);

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
    }
  };

  // const handleCreateLink = () => {
  //   // Simulate generating a new link
  //   setGeneratedLink(
  //     `https://tasu.kz/${Math.random().toString(36).substring(7)}`
  //   );
  // };

  return (
    <div className="p-4 space-y-2 border rounded-lg bg-white shadow-sm">
      {/* Checkbox for damaged condition */}
      {/* Section for creating and displaying links */}
      <div className="flex items-center gap-4">
        <div className="text-gray-700">
          Ссылка для <span className="font-bold">{title}</span>
        </div>
        {/* <button
          onClick={handleCreateLink}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded-lg text-white font-medium"
        >
          Создать
        </button> */}
      </div>

      {/* Display generated link */}
      {generatedLink && (
        <div className="flex items-center gap-2 text-blue-500 underline">
          <a href={generatedLink} target="_blank" rel="noopener noreferrer">
            {generatedLink}
          </a>
          <button
            onClick={handleCopy}
            className="bg-gray-200 p-1 rounded-lg hover:bg-gray-300"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
}
