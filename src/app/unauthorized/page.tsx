import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Доступ запрещен</h1>
        <p className="mt-4 text-lg text-gray-700">
          У вас нет прав для доступа к этой странице.
        </p>
        <Link href={"/"}>
          <button className="mt-6 inline-block px-4 py-2 rounded">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
}