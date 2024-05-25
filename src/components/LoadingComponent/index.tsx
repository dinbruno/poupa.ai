import Logo from "@/assets/png/logo.png";
import Image from "next/image";

export default function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        <Image
          src={Logo}
          alt="Loading"
          className="relative w-full h-full object-cover rounded-full"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
}
