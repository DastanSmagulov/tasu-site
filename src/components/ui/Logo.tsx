// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => (
  <div className="mb-10">
    {" "}
    <Image
      src="/images/logo.svg"
      alt="TASU Kazakhstan"
      width={172}
      height={56}
    />
  </div>
);

export default Logo;
