import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Evaluation, Faculty } from "@prisma/client";
import React from "react";

interface FacultyRecordClientProps {
  data: Faculty | null;
  evaluations: {
    students: Evaluation | null;
    peers: Evaluation | null;
    self: Evaluation | null;
    supervisor: Evaluation | null;
  };
}

// Function to compute the QCE Rating
const computeQCERating = (averageRating: number) => {
  const percentageRating = (averageRating / 5) * 100; // Scale the 1-5 average to a 100% scale
  return percentageRating.toFixed(2); // Return as string
};

// Function to get recommendation message based on QCE Rating
const getRecommendationMessage = (qceRating: number) => {
  if (qceRating >= 80 && qceRating <= 100) {
    return "Outstanding faculty. The teacher demonstrates a strong commitment to student success and academic excellence. Their teaching methods consistently engage students, foster critical thinking, and encourage independent learning. They go above and beyond to support the diverse needs of students, adapting their lessons and materials to ensure inclusivity. This faculty member has earned the respect and admiration of both students and colleagues, making them a role model for others. Continued professional development will further solidify their exceptional performance, but they are already setting a high standard for teaching in the institution.";
  } else if (qceRating >= 60 && qceRating < 80) {
    return "Good faculty. The teacher shows effective teaching skills and a clear dedication to student success, though there is some room for improvement. Their classes are generally well-structured, and they are responsive to student needs, but certain areas, such as more creative engagement or innovative teaching techniques, could be enhanced. Focusing on incorporating varied teaching methods or additional student feedback could elevate their overall performance. They are on the right track, and with focused effort on refining their skills, they could become a top performer in the faculty.";
  } else if (qceRating >= 40 && qceRating < 60) {
    return "Needs improvement. The teacher's performance currently falls below expectations. While they may have a foundational understanding of teaching principles, there are clear gaps in student engagement, lesson planning, or adaptability in the classroom. Their methods may not be resonating with students as effectively as needed, leading to lower satisfaction and learning outcomes. To improve, the teacher should seek professional development opportunities, mentorship from more experienced colleagues, and actively incorporate feedback from evaluations to enhance their teaching techniques.";
  } else {
    return "Poor performance. Immediate action is necessary to address significant deficiencies in teaching and student engagement. The faculty member is struggling to meet the basic expectations of their role, which may be reflected in disorganized lessons, poor communication, or a lack of responsiveness to student needs. Urgent intervention is required, including targeted professional development, mentoring, and possibly reassignment of duties to focus on areas for improvement. Without swift corrective measures, student learning outcomes may continue to suffer, and the teacher's role in the institution could be in jeopardy.";
  }
};

const categories = [
  { name: "Commitment", weight: 0.2 },
  { name: "Knowledge of Subjects", weight: 0.2 },
  { name: "Teaching for Independent Learning", weight: 0.3 },
  { name: "Management of Learning", weight: 0.3 },
];

const calculateTotalRating = (ratingData: Evaluation) => {
  const commitment =
    (parseInt(ratingData.demonstrate) +
      parseInt(ratingData.integrate) +
      parseInt(ratingData.available) +
      parseInt(ratingData.regularly) +
      parseInt(ratingData.accurate)) /
    5;

  const knowledge =
    (parseInt(ratingData.mastery) +
      parseInt(ratingData.draws) +
      parseInt(ratingData.practical) +
      parseInt(ratingData.relevance) +
      parseInt(ratingData.awareness)) /
    5;

  const independentLearning =
    (parseInt(ratingData.teaching) +
      parseInt(ratingData.enhance) +
      parseInt(ratingData.objectives) +
      parseInt(ratingData.independent) +
      parseInt(ratingData.encourage)) /
    5;

  const managementLearning =
    (parseInt(ratingData.opportunity) +
      parseInt(ratingData.roles) +
      parseInt(ratingData.experience) +
      parseInt(ratingData.structures) +
      parseInt(ratingData.instructional)) /
    5;

  // Applying the weights for each category
  const totalRating =
    commitment * 0.2 +
    knowledge * 0.2 +
    independentLearning * 0.3 +
    managementLearning * 0.3;

  return totalRating.toFixed(2);
};

const FacultyRecordSpecificClient: React.FC<FacultyRecordClientProps> = ({
  data,
  evaluations,
}) => {
  const calculateAverage = (evaluatorData: Evaluation | null) => {
    if (!evaluatorData) return "N/A"; // Handle case where there's no evaluation yet.
    const ratings = [
      +evaluatorData.demonstrate || 0,
      +evaluatorData.integrate || 0,
      +evaluatorData.available || 0,
      +evaluatorData.regularly || 0,
      +evaluatorData.accurate || 0,
      +evaluatorData.mastery || 0,
      +evaluatorData.draws || 0,
      +evaluatorData.practical || 0,
      +evaluatorData.relevance || 0,
      +evaluatorData.awareness || 0,
      +evaluatorData.teaching || 0,
      +evaluatorData.enhance || 0,
      +evaluatorData.objectives || 0,
      +evaluatorData.independent || 0,
      +evaluatorData.encourage || 0,
      +evaluatorData.opportunity || 0,
      +evaluatorData.roles || 0,
      +evaluatorData.experience || 0,
      +evaluatorData.structures || 0,
      +evaluatorData.instructional || 0,
    ];

    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const average = sum / ratings.length;
    return average.toFixed(2); // Return as string, rounded to 2 decimals.
  };

  const overallAverages = {
    students: calculateAverage(evaluations.students),
    peers: calculateAverage(evaluations.peers),
    self: calculateAverage(evaluations.self),
    supervisor: calculateAverage(evaluations.supervisor),
  };

  const qceRatings = {
    students: computeQCERating(parseFloat(overallAverages.students)),
    peers: computeQCERating(parseFloat(overallAverages.peers)),
    self: computeQCERating(parseFloat(overallAverages.self)),
    supervisor: computeQCERating(parseFloat(overallAverages.supervisor)),
  };

  // Get recommendation message based on the students' QCE rating
  const recommendationMessage = getRecommendationMessage(+qceRatings.students);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="font-semibold">Name of Faculty</p>
          <p className="underline">
            {data?.fname +
              " " +
              data?.mname +
              " " +
              data?.lname +
              " " +
              data?.suffix}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">Semester</p>
          <p className="underline">{evaluations.students?.ratingPeriod}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">Status</p>
          <p className="underline">{evaluations.students?.academicRank}</p>
        </div>
      </div>

      <table className="mt-10 border text-center w-full mx-auto">
        <thead>
          <tr className="border">
            <th colSpan={4} className="py-2">
              SUMMARY OF TOTAL RATINGS
            </th>
          </tr>
          <tr className="border">
            <th className="py-2 border">Students</th>
            <th className="py-2 border">Peers</th>
            <th className="py-2 border">Self</th>
            <th className="py-2 border">Supervisor</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border">
            <td className="border py-2">{overallAverages.students}</td>
            <td className="border py-2">{overallAverages.peers}</td>
            <td className="border py-2">{overallAverages.self}</td>
            <td className="border py-2">{overallAverages.supervisor}</td>
          </tr>
        </tbody>
      </table>
      <p className="font-semibold mb-0">Comments/Suggestions:</p>
      <p className="mb-20">{recommendationMessage}</p>

      <table className=" border text-center w-full mx-auto">
        <thead>
          <tr className="border">
            <th colSpan={5} className="py-2">
              STUDENT RATINGS
            </th>
          </tr>
          <tr className="border">
            {categories.map((category) => (
              <th key={category.name} className="py-2 border">
                {category.name} ({category.weight * 100}%)
              </th>
            ))}
            <th className="py-2 border">Student Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.students ? (
            <tr className="border">
              {/* Commitment Calculation */}
              <td className="border py-0">
                {(
                  ((Number(evaluations.students.demonstrate) +
                    Number(evaluations.students.integrate) +
                    Number(evaluations.students.available) +
                    Number(evaluations.students.regularly) +
                    Number(evaluations.students.accurate)) /
                    5) *
                  0.2
                ) // Multiply the average by 20%
                  .toFixed(2)}
              </td>

              {/* Knowledge of Subjects Calculation */}
              <td className="border py-0">
                {(
                  ((Number(evaluations.students.mastery) +
                    Number(evaluations.students.draws) +
                    Number(evaluations.students.practical) +
                    Number(evaluations.students.relevance) +
                    Number(evaluations.students.awareness)) /
                    5) *
                  0.2
                ).toFixed(2)}
              </td>

              {/* Teaching for Independent Learning Calculation */}
              <td className="border py-0">
                {(
                  ((Number(evaluations.students.teaching) +
                    Number(evaluations.students.enhance) +
                    Number(evaluations.students.objectives) +
                    Number(evaluations.students.independent) +
                    Number(evaluations.students.encourage)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>

              {/* Management of Learning Calculation */}
              <td className="border py-0">
                {(
                  ((Number(evaluations.students.opportunity) +
                    Number(evaluations.students.roles) +
                    Number(evaluations.students.experience) +
                    Number(evaluations.students.structures) +
                    Number(evaluations.students.instructional)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>
              <td className="border py-0">
                {calculateTotalRating(evaluations.students)}{" "}
              </td>
            </tr>
          ) : (
            <tr className="border">
              <td className="border py-0" colSpan={5}>
                No ratings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <table className=" border text-center w-full mx-auto">
        <thead>
          <tr className="border">
            <th colSpan={5} className="py-2">
              PEER RATINGS
            </th>
          </tr>
          <tr className="border">
            {categories.map((category) => (
              <th key={category.name} className="py-2 border">
                {category.name} ({category.weight * 100}%)
              </th>
            ))}
            <th className="py-2 border">Peer Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.peers ? (
            <tr className="border">
              {/* Commitment Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.peers.demonstrate) +
                    Number(evaluations.peers.integrate) +
                    Number(evaluations.peers.available) +
                    Number(evaluations.peers.regularly) +
                    Number(evaluations.peers.accurate)) /
                    5) *
                  0.2
                ) // Multiply the average by 20%
                  .toFixed(2)}
              </td>

              {/* Knowledge of Subjects Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.peers.mastery) +
                    Number(evaluations.peers.draws) +
                    Number(evaluations.peers.practical) +
                    Number(evaluations.peers.relevance) +
                    Number(evaluations.peers.awareness)) /
                    5) *
                  0.2
                ).toFixed(2)}
              </td>

              {/* Teaching for Independent Learning Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.peers.teaching) +
                    Number(evaluations.peers.enhance) +
                    Number(evaluations.peers.objectives) +
                    Number(evaluations.peers.independent) +
                    Number(evaluations.peers.encourage)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>

              {/* Management of Learning Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.peers.opportunity) +
                    Number(evaluations.peers.roles) +
                    Number(evaluations.peers.experience) +
                    Number(evaluations.peers.structures) +
                    Number(evaluations.peers.instructional)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>
              <td className="border py-2">
                {calculateTotalRating(evaluations.peers)}{" "}
              </td>
            </tr>
          ) : (
            <tr className="border">
              <td colSpan={5} className="border py-2">
                No ratings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <table className=" border text-center w-full mx-auto">
        <thead>
          <tr className="border">
            <th colSpan={5} className="py-2">
              SELF RATINGS
            </th>
          </tr>
          <tr className="border">
            {categories.map((category) => (
              <th key={category.name} className="py-2 border">
                {category.name} ({category.weight * 100}%)
              </th>
            ))}
            <th className="py-2 border">Self Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.self ? (
            <tr className="border">
              {/* Commitment Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.self.demonstrate) +
                    Number(evaluations.self.integrate) +
                    Number(evaluations.self.available) +
                    Number(evaluations.self.regularly) +
                    Number(evaluations.self.accurate)) /
                    5) *
                  0.2
                ) // Multiply the average by 20%
                  .toFixed(2)}
              </td>

              {/* Knowledge of Subjects Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.self.mastery) +
                    Number(evaluations.self.draws) +
                    Number(evaluations.self.practical) +
                    Number(evaluations.self.relevance) +
                    Number(evaluations.self.awareness)) /
                    5) *
                  0.2
                ).toFixed(2)}
              </td>

              {/* Teaching for Independent Learning Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.self.teaching) +
                    Number(evaluations.self.enhance) +
                    Number(evaluations.self.objectives) +
                    Number(evaluations.self.independent) +
                    Number(evaluations.self.encourage)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>

              {/* Management of Learning Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.self.opportunity) +
                    Number(evaluations.self.roles) +
                    Number(evaluations.self.experience) +
                    Number(evaluations.self.structures) +
                    Number(evaluations.self.instructional)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>
              <td className="border py-2">
                {calculateTotalRating(evaluations.self)}{" "}
              </td>
            </tr>
          ) : (
            <tr className="border">
              <td colSpan={5} className="border py-2">
                No ratings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <table className=" border text-center w-full mx-auto">
        <thead>
          <tr className="border">
            <th colSpan={5} className="py-2">
              SUPERVISOR RATINGS
            </th>
          </tr>
          <tr className="border">
            {categories.map((category) => (
              <th key={category.name} className="py-2 border">
                {category.name} ({category.weight * 100}%)
              </th>
            ))}
            <th className="py-2 border">Supervisor Total Ratings</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.supervisor ? (
            <tr className="border">
              {/* Commitment Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.supervisor.demonstrate) +
                    Number(evaluations.supervisor.integrate) +
                    Number(evaluations.supervisor.available) +
                    Number(evaluations.supervisor.regularly) +
                    Number(evaluations.supervisor.accurate)) /
                    5) *
                  0.2
                ) // Multiply the average by 20%
                  .toFixed(2)}
              </td>

              {/* Knowledge of Subjects Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.supervisor.mastery) +
                    Number(evaluations.supervisor.draws) +
                    Number(evaluations.supervisor.practical) +
                    Number(evaluations.supervisor.relevance) +
                    Number(evaluations.supervisor.awareness)) /
                    5) *
                  0.2
                ).toFixed(2)}
              </td>

              {/* Teaching for Independent Learning Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.supervisor.teaching) +
                    Number(evaluations.supervisor.enhance) +
                    Number(evaluations.supervisor.objectives) +
                    Number(evaluations.supervisor.independent) +
                    Number(evaluations.supervisor.encourage)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>

              {/* Management of Learning Calculation */}
              <td className="border py-2">
                {(
                  ((Number(evaluations.supervisor.opportunity) +
                    Number(evaluations.supervisor.roles) +
                    Number(evaluations.supervisor.experience) +
                    Number(evaluations.supervisor.structures) +
                    Number(evaluations.supervisor.instructional)) /
                    5) *
                  0.3
                ).toFixed(2)}
              </td>
              <td className="border py-2">
                {calculateTotalRating(evaluations.supervisor)}{" "}
              </td>
            </tr>
          ) : (
            <tr className="border">
              <td colSpan={5} className="border py-2">
                No ratings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default FacultyRecordSpecificClient;
