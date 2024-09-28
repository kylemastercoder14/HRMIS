"use client";

import React from "react";
import Lottie from "lottie-react";
import underMaintenance from "@/public/under-maintenance.json";

const StudentRecord = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mt-20 text-4xl font-black">
        This page is on-going development!!
      </div>
      <Lottie animationData={underMaintenance} className="w-[50%] mt-10" loop />
    </div>
  );
};

export default StudentRecord;
