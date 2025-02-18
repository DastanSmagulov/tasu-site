"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "../../public/images/avatar.svg";
import { FiPlus } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import AccountSettings from "@/components/modals/AccountSettings";
import { axiosInstance } from "@/helper/utils";

interface HeaderProps {
  text: string;
  role: string;
}

const Header: React.FC<HeaderProps> = ({ text, role }) => {
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false); // Modal state
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null | File>(null);

  const handleCreateAct = () => {
    router.push(`/${role}/create-act`);
  };

  useEffect(() => {
    return () => {
      if (profileImage && typeof profileImage !== "string") {
        URL.revokeObjectURL(profileImage as unknown as string);
      }
    };
  }, [profileImage]);

  const fetchProfileInfo = async () => {
    try {
      const { data } = await axiosInstance.get(`/get-profile-info/`);
      setProfileImage(data.id_card_image);
    } catch (error) {
      console.error("Error fetching profile info", error);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const isCreateActPage =
    pathname === `/${role}/create-act` || pathname?.startsWith(`/${role}/act/`);

  const status = "готов к отправке";

  return (
    <>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 py-3 max-lg:mt-12">
        {/* Left Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-lg sm:text-2xl font-semibold">{text}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center flex-wrap justify-start sm:justify-end gap-4">
          {text !== "Создать акт" &&
            role !== "accountant" &&
            role !== "courier" &&
            role !== "carrier" &&
            role !== "admin" && (
              <button
                className="flex items-center justify-center w-full sm:w-auto px-6 py-2 text-[#1A1A1A] bg-[#FDE107] rounded-lg hover:bg-[#f1d81d]"
                onClick={handleCreateAct}
              >
                <FiPlus className="mr-2 w-5 sm:w-7 h-5 sm:h-7 font-normal" />
                <p className="text-base">Создать акт</p>
              </button>
            )}
          {role !== "carrier" && (
            <div className="cursor-pointer">
              {profileImage ? (
                <Image
                  src={
                    typeof profileImage === "string"
                      ? profileImage // Display fetched URL
                      : URL.createObjectURL(profileImage)
                  }
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full w-12 sm:w-14 h-12 sm:h-14"
                  onClick={() => setModalOpen(true)}
                />
              ) : (
                <div className="Загрузка..."></div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Modal for Profile Settings */}
      {isModalOpen && (
        <AccountSettings
          setProfileImage={setProfileImage}
          profileImage={profileImage}
          setModalOpen={setModalOpen}
        />
      )}
    </>
  );
};

export default Header;
