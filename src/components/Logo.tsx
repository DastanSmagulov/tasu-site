// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => (
  <div className="mb-10">
    <Link href="/">
      {" "}
      <Image
        src="/images/logo.svg"
        alt="TASU Kazakhstan"
        width={172}
        height={56}
      />
    </Link>
  </div>
);

export default Logo;
