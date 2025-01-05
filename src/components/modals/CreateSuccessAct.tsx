import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const CreateSuccessAct: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Документ успешно отправлен
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Ваш акт документ успешно передан. Ожидайте подтверждения или
          дополнительную информацию в ближайшее время.
        </p>

        {/* Button to Go Back to Main Page */}
        <Link href={`/`}>
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            На главную страницу
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CreateSuccessAct;
