import Image from "next/image";
import React from "react";

const AuthCoordinatorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2">
      <div className="hidden bg-[#30573c] p-20 lg:block">
        <div className="flex items-center gap-3">
            <Image src="/images/logo-hrmis.png" alt="Logo" width={150} height={150} />
            <div className="text-white">
                <p className="font-normal text-lg">Republic of the Philippines</p>
                <p className="text-2xl font-bold">CENTRAL BICOL STATE UNIVERSITY OF AGRICULTURE</p>
            </div>
        </div>
        <p className="text-white font-semibold text-4xl leading-relaxed mt-10">Evaluation made simple for <br /> people like you</p>
      </div>
      <div className="flex items-center justify-center py-12">{children}</div>
    </div>
  );
};

export default AuthCoordinatorLayout;
