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

const getRecommendationMessage = (comment: string) => {
  if (comment.includes("Magaling magturo, madaling intindihin ang lesson.")) {
    return "Continue current teaching methods; consider mentoring other instructors.";
  } else if (comment.includes("Pwede pong bagalan ng kaunti ang discussion.")) {
    return "Slow down pace for complex topics; provide additional time for questions.";
  } else if (comment.includes("Minsan hindi malinaw ang paliwanag.")) {
    return "Focus on improving clarity through examples and visuals.";
  } else if (comment.includes("Hindi open for consultations after class.")) {
    return "Set clear office hours and be more approachable for student inquiries.";
  } else if (
    comment.includes("Inspirational siya, nagiging motivated ako mag-aral.")
  ) {
    return "Recognize for exceptional performance and student impact.";
  } else if (
    comment.includes("Sana po mas updated ang materials na ginagamit.")
  ) {
    return "Incorporate more up-to-date teaching resources and materials.";
  } else if (comment.includes("Medyo strict at intimidating minsan.")) {
    return "Improve teacher-student rapport; consider a feedback session to address concerns.";
  } else if (comment.includes("Napakabait at approachable.")) {
    return "Maintain positive demeanor; encourage sharing of best practices with peers.";
  } else if (
    comment.includes("Pwede po sana dagdagan ang practical examples.")
  ) {
    return "Add more real-world examples to improve engagement and understanding.";
  } else if (comment.includes("Medyo monotone minsan, nakakaantok.")) {
    return "Work on voice modulation and include interactive activities in lessons.";
  } else if (
    comment.includes("Laging may energy at engaging ang discussions.")
  ) {
    return "Continue fostering student engagement; introduce peer-learning activities.";
  } else if (comment.includes("Medyo laging late sa klase.")) {
    return "Prioritize punctuality; consider adjusting class schedules if necessary.";
  } else if (comment.includes("Mabilis masyado magturo, di nasasabayan.")) {
    return "Adjust teaching pace for better comprehension; conduct quick reviews after discussions.";
  } else if (
    comment.includes("Ang ganda ng materials na ginagamit, very visual.")
  ) {
    return "Share resources with other instructors; keep exploring creative tools.";
  } else if (comment.includes("Parang bias minsan sa ibang students.")) {
    return "Evaluate and improve fairness in grading and interactions.";
  } else if (comment.includes("Very accommodating sa questions namin.")) {
    return "Maintain approachable attitude; consider organizing Q&A sessions after lectures.";
  } else if (comment.includes("Mas maganda sana kung interactive ang klase.")) {
    return "Introduce activities like group work, case studies, or role-playing exercises.";
  } else if (comment.includes("Madalas mawala sa lesson plan.")) {
    return "Stay aligned with lesson plans; use a checklist or planner to ensure coverage.";
  } else if (
    comment.includes("Laging nagbibigay ng practical examples, ang helpful.")
  ) {
    return "Continue with practical examples; consider collaborating with industry professionals for case studies.";
  } else if (comment.includes("Thank you, Sir/Ma'am, for the guidance.")) {
    return "Continue to be supportive; consider providing additional resources for students.";
  } else if (comment.includes("The best instructor! Very inspiring.")) {
    return "Recognize for exemplary teaching performance; consider mentoring other instructors.";
  } else if (comment.includes("Nice approach, very effective.")) {
    return "Maintain current teaching style; explore ways to share strategies with peers.";
  } else if (
    comment.includes("Thank you for making the lessons fun and clear.")
  ) {
    return "Continue engaging teaching methods; consider adding more creative activities.";
  } else if (comment.includes("The best prof! Dami kong natutunan.")) {
    return "Highlight as a role model in teaching; encourage involvement in faculty development programs.";
  } else if (comment.includes("Nice and approachable.")) {
    return "Keep fostering a positive and approachable demeanor; conduct informal consultations to strengthen student connections.";
  } else if (
    comment.includes("Thank you for always explaining until we understand.")
  ) {
    return "Keep being thorough in explanations; consider adding summaries after discussions.";
  } else if (comment.includes("Nice lectures, very detailed.")) {
    return "Continue detailed lectures; explore creating handouts for better retention.";
  } else if (comment.includes("Thank you for being approachable and kind.")) {
    return "Continue being approachable; organize informal study groups to support students.";
  } else {
    return "Seek more detailed feedback to identify strengths and areas for improvement.";
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

const SummaryReport = ({
  faculty,
  comment,
}: {
  faculty: Faculty | null;
  comment: string | null;
}) => {
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
            <p>{getRecommendationMessage(comment || "")}</p>
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
