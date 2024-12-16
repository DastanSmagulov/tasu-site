import Logo from "../components/ui/Logo";
import MenuGroup from "../components/MenuGroup";
import Footer from "./Footer";
import routes from "../helper/sidebar-routes";
import { useSession } from "next-auth/react";

const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col justify-between w-64 h-screen fixed shadow-md py-8 px-10 bg-white">
      <div>
        <Logo width={172} height={56} />
        <div className="space-y-6">
          <MenuGroup title={session?.role.value} items={routes.slice(0, 3)} />
          {/* <MenuGroup title="Админ" items={routes.slice(4, 10)} /> */}
          {/* <MenuGroup title="Бухгалтерия" items={routes.slice(10, 11)} /> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sidebar;
