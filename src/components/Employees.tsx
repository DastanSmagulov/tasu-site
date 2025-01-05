// components/Users.js
import React from "react";

const Employees = () => {
  const users = [
    {
      name: "Айдаров Ерболат Касымович",
      email: "sultonbek1234@mall.kz",
      phone: "+7 (701) 123-45-67",
      role: "Бухалтер",
    },
    {
      name: "Тимурова Алия Жанатовна",
      email: "olgq.kuznetsovo2024@gmail.com",
      phone: "+7 (701) 123-45-67",
      role: "Менеджер",
    },
    {
      name: "Абдрахманов Рустам Байдулатович",
      email: "sultonbek1234@mall.kz",
      phone: "+7 (701) 123-45-67",
      role: "Водитель",
    },
    {
      name: "Досмухамбетов Нуржан Ахметович",
      email: "sultonbek1234@mall.kz",
      phone: "+7 (701) 123-45-67",
      role: "Водитель",
    },
    {
      name: "Шарипов Ержан Абдрахманович",
      email: "sultonbek1234@mall.kz",
      phone: "+7 (701) 123-45-67",
      role: "Водитель",
    },
    {
      name: "Бекмурзаева Айнура Казбековна",
      email: "sultonbek1234@mall.kz",
      phone: "+7 (701) 123-45-67",
      role: "Водитель",
    },
    {
      name: "Мухтарова Асель Алматовна",
      email: "sultonbek1234@mall.kz",
      phone: "+7 (701) 123-45-67",
      role: "Водитель",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Cотрудники</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>ФИО </th>
            <th>Почта</th>
            <th>Номер телефона</th>
            <th>Роль </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
