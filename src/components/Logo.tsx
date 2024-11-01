// components/Logo.tsx
import Image from "next/image";

const Logo: React.FC = () => (
  <div className="mb-10">
    <Image
      src="/images/logo.svg"
      alt="TASU Kazakhstan"
      width={172}
      height={56}
    />
  </div>
);

export default Logo;
