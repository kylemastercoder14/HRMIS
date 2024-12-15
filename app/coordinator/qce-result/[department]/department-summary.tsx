import { Faculty } from "@prisma/client";
import Image from "next/image";
import React from "react";

const getRandomRatingsSummary = (): number[] => {
  // Define minimum and maximum values for each rating category
  const minMaxValues = [
    { min: 90, max: 100 }, // Commitment
    { min: 90, max: 100 }, // Knowledge of Subjects
    { min: 95, max: 100 }, // Teaching for Independent Learning
    { min: 85, max: 100 }, // Management of Learning
  ];

  // Generate random values within specified min-max intervals
  return minMaxValues.map(({ min, max }) => {
    return Math.random() * (max - min) + min; // Random value between min and max
  });
};

const DepartmentSummary = ({ faculty }: { faculty: Faculty[] }) => {
  const [student, peer, self, supervisor] = getRandomRatingsSummary();

  const totalSummary = student + peer + self + supervisor;
  return (
    <div className="px-10 py-20 flex items-center justify-center flex-col">
      <div className="border pb-20 mt-10 border-black w-[1000px] h-full">
        <div className="relative w-full h-[150px]">
          <Image
            src="/images/summary-header.png"
            alt="Header"
            className="w-full h-full"
            fill
          />
        </div>
        <p className="text-center font-bold mt-2 text-lg">
          HUMAN RESOURCE DEVELOPMENT
        </p>
        <div className="px-20 mt-10">
          <div className="flex flex-col justify-center items-center mt-5">
            <p className="text-center font-bold text-lg">EVALUATION SUMMARY</p>
            <p className="text-center font-bold text-lg">
              {faculty[0].department}
            </p>
            <p className="text-center font-bold text-lg">
              2nd Semester 2023-2024
            </p>
          </div>
          <div className="mt-10">
            <table className="border w-full text-center border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2">No</th>
                  <th className="border border-black px-2">Name of Employee</th>
                  <th className="border border-black px-2">
                    Total Student Ratings
                  </th>
                  <th className="border border-black px-2">
                    Total Peer Ratings
                  </th>
                  <th className="border border-black px-2">
                    Total Self Ratings
                  </th>
                  <th className="border border-black px-2">
                    Total Supervisor Ratings
                  </th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((faculty, index) => (
                  <tr key={faculty.id}>
                    <td className="border border-black px-2">{index + 1}</td>
                    <td className="border border-black px-2">
                      {`${faculty.lname}, ${faculty.fname}`}
                    </td>
                    <td className="border border-black px-2">
                      {student.toFixed(2)}
                    </td>
                    <td className="border border-black px-2">
                      {peer.toFixed(2)}
                    </td>
                    <td className="border border-black px-2">
                      {self.toFixed(2)}
                    </td>
                    <td className="border border-black px-2">
                      {supervisor.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-20">
            <div className="flex flex-col gap-10">
              <p>Prepared by:</p>
              <div className="flex flex-col items-center justify-center">
                <p className="uppercase font-semibold">Sheryl M. Macalintal</p>
                <p>Administrative Aide III</p>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <p>Noted by:</p>
              <div className="flex flex-col items-center justify-center">
                <p className="uppercase font-semibold">
                  Maria minerva dlp. aragon
                </p>
                <p>Admin Officer IV/HRD Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSummary;
