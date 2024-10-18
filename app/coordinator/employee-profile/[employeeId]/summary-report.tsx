import { Answer, Faculty } from "@prisma/client";
import Image from "next/image";
import React from "react";

const SummaryReport = ({
  faculty,
}: {
  faculty: Faculty | null;
}) => {
  return (
    <div className="px-10 py-20 flex items-center justify-center flex-col">
      <div className="border pb-20 border-black w-[1000px] h-full">
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
          <div className="flex items-center gap-10">
            <div className="flex text-lg items-center gap-3">
              <p className="font-semibold">Name of Faculty</p>
              <p className="border-b border-black pr-10">
                {faculty?.fname} {faculty?.lname}
              </p>
            </div>
            <div className="flex text-lg items-center gap-3">
              <p className="font-semibold">Semester</p>
              <p className="border-b border-black pr-20">
                2nd Semester
              </p>
            </div>
          </div>
          <div className="flex items-center mt-5 gap-10">
            <div className="flex text-lg items-center gap-3">
              <p className="font-semibold">Status</p>
              <p className="border-b border-black pr-10">{faculty?.status}</p>
            </div>
          </div>
          <div className="mt-10">
            <p className="font-bold mb-2">Student Ratings</p>
            <table className="border text-center border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2">
                    Commitment <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Knowledge of Subjects <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Teaching for Independent Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Management of Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Student Total Ratings
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2">18.16</td>
                  <td className="border border-black px-2">20.50</td>
                  <td className="border border-black px-2">28.63</td>
                  <td className="border border-black px-2">28.16</td>
                  <td className="border border-black px-2">95.45</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10">
            <p className="font-bold mb-2">Peer Ratings</p>
            <table className="border text-center border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2">
                    Commitment <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Knowledge of Subjects <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Teaching for Independent Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Management of Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Peer Total Ratings
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2">18.16</td>
                  <td className="border border-black px-2">20.50</td>
                  <td className="border border-black px-2">28.63</td>
                  <td className="border border-black px-2">28.16</td>
                  <td className="border border-black px-2">95.45</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10">
            <p className="font-bold mb-2">Self Ratings</p>
            <table className="border text-center border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2">
                    Commitment <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Knowledge of Subjects <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Teaching for Independent Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Management of Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Self Total Ratings
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2">18.16</td>
                  <td className="border border-black px-2">20.50</td>
                  <td className="border border-black px-2">28.63</td>
                  <td className="border border-black px-2">28.16</td>
                  <td className="border border-black px-2">95.45</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10">
            <p className="font-bold mb-2">Supervisor Ratings</p>
            <table className="border text-center border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2">
                    Commitment <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Knowledge of Subjects <br /> 20%
                  </th>
                  <th className="border border-black px-2">
                    Teaching for Independent Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Management of Learning <br /> 30%
                  </th>
                  <th className="border border-black px-2">
                    Supervisor Total Ratings
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2">18.16</td>
                  <td className="border border-black px-2">20.50</td>
                  <td className="border border-black px-2">28.63</td>
                  <td className="border border-black px-2">28.16</td>
                  <td className="border border-black px-2">95.45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;
