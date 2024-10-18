import { Answer, Faculty } from "@prisma/client";
import Image from "next/image";
import React from "react";

const getRandomRatings1 = (): number[] => {
  // Define minimum and maximum values for each rating category
  const minMaxValues = [
    { min: 15, max: 20 }, // Commitment
    { min: 10, max: 20 }, // Knowledge of Subjects
    { min: 25, max: 30 }, // Teaching for Independent Learning
    { min: 20, max: 30 }, // Management of Learning
  ];

  // Generate random values within specified min-max intervals
  return minMaxValues.map(({ min, max }) => {
    return Math.random() * (max - min) + min; // Random value between min and max
  });
};
const getRandomRatings2 = (): number[] => {
  // Define minimum and maximum values for each rating category
  const minMaxValues = [
    { min: 15, max: 20 }, // Commitment
    { min: 10, max: 20 }, // Knowledge of Subjects
    { min: 25, max: 30 }, // Teaching for Independent Learning
    { min: 20, max: 30 }, // Management of Learning
  ];

  // Generate random values within specified min-max intervals
  return minMaxValues.map(({ min, max }) => {
    return Math.random() * (max - min) + min; // Random value between min and max
  });
};
const getRandomRatings3 = (): number[] => {
  // Define minimum and maximum values for each rating category
  const minMaxValues = [
    { min: 15, max: 20 }, // Commitment
    { min: 10, max: 20 }, // Knowledge of Subjects
    { min: 25, max: 30 }, // Teaching for Independent Learning
    { min: 20, max: 30 }, // Management of Learning
  ];

  // Generate random values within specified min-max intervals
  return minMaxValues.map(({ min, max }) => {
    return Math.random() * (max - min) + min; // Random value between min and max
  });
};
const getRandomRatings4 = (): number[] => {
  // Define minimum and maximum values for each rating category
  const minMaxValues = [
    { min: 15, max: 20 }, // Commitment
    { min: 10, max: 20 }, // Knowledge of Subjects
    { min: 25, max: 30 }, // Teaching for Independent Learning
    { min: 20, max: 30 }, // Management of Learning
  ];

  // Generate random values within specified min-max intervals
  return minMaxValues.map(({ min, max }) => {
    return Math.random() * (max - min) + min; // Random value between min and max
  });
};

const getRecommendationMessage = (qceRating: any) => {
  if (qceRating >= 96) {
    return "The teacher demonstrates a strong commitment to student success and academic excellence.";
  } else if (qceRating >= 91) {
    return "The teacher is performing well, but there's still room for small improvements.";
  } else if (qceRating >= 86) {
    return "The teacher meets the minimum expectations but can enhance their effectiveness.";
  } else if (qceRating >= 81) {
    return "The teacher needs improvement to meet job requirements.";
  } else {
    return "The teacher is failing to meet job requirements and requires immediate intervention.";
  }
};

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

const SummaryReport = ({ faculty }: { faculty: Faculty | null }) => {
  const [
    commitmentRating1,
    knowledgeRating1,
    independentLearningRating1,
    managementRating1,
  ] = getRandomRatings1();

  const [
    commitmentRating2,
    knowledgeRating2,
    independentLearningRating2,
    managementRating2,
  ] = getRandomRatings2();

  const [
    commitmentRating3,
    knowledgeRating3,
    independentLearningRating3,
    managementRating3,
  ] = getRandomRatings3();

  const [
    commitmentRating4,
    knowledgeRating4,
    independentLearningRating4,
    managementRating4,
  ] = getRandomRatings4();

  const [student, peer, self, supervisor] = getRandomRatingsSummary();

  const totalSummary = student + peer + self + supervisor;

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
              <p className="border-b border-black pr-20">2nd Semester</p>
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
                  <td className="border border-black px-2">
                    {commitmentRating1.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {knowledgeRating1.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {independentLearningRating1.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {managementRating1.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {(
                      commitmentRating1 +
                      knowledgeRating1 +
                      independentLearningRating1 +
                      managementRating1
                    ).toFixed(2)}
                  </td>
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
                  <td className="border border-black px-2">
                    {commitmentRating2.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {knowledgeRating2.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {independentLearningRating2.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {managementRating2.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {(
                      commitmentRating2 +
                      knowledgeRating2 +
                      independentLearningRating2 +
                      managementRating2
                    ).toFixed(2)}
                  </td>
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
                  <td className="border border-black px-2">
                    {commitmentRating3.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {knowledgeRating3.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {independentLearningRating3.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {managementRating3.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {(
                      commitmentRating3 +
                      knowledgeRating3 +
                      independentLearningRating3 +
                      managementRating3
                    ).toFixed(2)}
                  </td>
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
                  <td className="border border-black px-2">
                    {commitmentRating4.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {knowledgeRating4.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {independentLearningRating4.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {managementRating4.toFixed(2)}
                  </td>
                  <td className="border border-black px-2">
                    {(
                      commitmentRating4 +
                      knowledgeRating4 +
                      independentLearningRating4 +
                      managementRating4
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
          <div className="flex items-center gap-10">
            <div className="flex text-lg items-center gap-3">
              <p className="font-semibold">Name of Faculty</p>
              <p className="border-b border-black pr-10">
                {faculty?.fname} {faculty?.lname}
              </p>
            </div>
            <div className="flex text-lg items-center gap-3">
              <p className="font-semibold">Semester</p>
              <p className="border-b border-black pr-20">2nd Semester</p>
            </div>
          </div>
          <div className="flex items-center mt-5 gap-10">
            <div className="flex text-lg items-center gap-3">
              <p className="font-semibold">Status</p>
              <p className="border-b border-black pr-10">{faculty?.status}</p>
            </div>
          </div>
          <div className="mt-10">
            <p className="font-bold mb-2">Summary of Total Ratings</p>
            <table className="border w-full text-center border-black">
              <thead>
                <tr>
                  <th className="border border-black px-2">Students</th>
                  <th className="border border-black px-2">Peers</th>
                  <th className="border border-black px-2">Self</th>
                  <th className="border border-black px-2">Supervisor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
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
              </tbody>
            </table>
            <p className="font-bold mb-2 mt-10">Comments/Suggestions:</p>
            <p>{getRecommendationMessage(totalSummary)}</p>
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

export default SummaryReport;
