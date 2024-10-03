import Image from "next/image";
import React from "react";

const Certificate = ({
  name,
  date,
  title,
  time,
  platform,
}: {
  name: string;
  date: string;
  title: string;
  time: string;
  platform: string;
}) => {
  return (
    <div className="w-[1000px] mt-32 flex items-center justify-center m-auto h-[600px] relative">
      <Image
        src="/images/certificate.png"
        alt="Certificate"
        fill
        className="w-full h-full"
      />
      <p className="absolute top-[250px] left-[50%] translate-x-[-10%] text-center text-2xl font-bold z-40">{name}</p>
      <p className="text-black absolute text-sm top-[300px] left-[300px] w-[600px]">
        for attending {title} conducted by the Central Bicol State University of
        Agriculture on {date} {time} via {platform} platform.
      </p>
      <div className="flex items-center gap-2 absolute top-[500px] left-[295px]">
        <Image src="/images/qr.png" alt="QR" width={50} height={50} />
        <p className="text-[10px] w-40 italic">This certificate is valid as evidenced by the attached QR Code.</p>
      </div>
    </div>
  );
};

export default Certificate;