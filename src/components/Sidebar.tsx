import Logo from "./Logo";
import MenuGroup from "./MenuGroup";
import Footer from "./Footer";
import routes from "../routes/sidebar";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 min-h-screen shadow-md p-6 bg-white">
      <Logo />
      <div className="space-y-6 mb-20">
        <MenuGroup title="Экспедитор" items={routes.slice(0, 4)} />
        <MenuGroup title="Админ" items={routes.slice(4, 10)} />
        <MenuGroup title="Бухгалтерия" items={routes.slice(10, 11)} />
      </div>
      <Footer />
    </div>
  );
};

export default Sidebar;
