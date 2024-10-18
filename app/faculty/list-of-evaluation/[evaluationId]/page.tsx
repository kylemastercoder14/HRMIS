import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import db from "@/lib/db";
import UpdateEvaluationForm from "../_components/update-evaluation-form";
import { getFacultyFromCookies } from "@/lib/hooks/use-faculty";

const ListEvaluationPage = async ({
  params,
}: {
  params: { evaluationId: string };
}) => {
  const { userId } = await getFacultyFromCookies();

  const decodedString = decodeURIComponent(params.evaluationId);

  const existingEvaluation = await db.answer.findMany({
    where: {
      evaluatee: decodedString,
    },
  });

  const evaluationForm = await db.evaluation.findFirst({
    include: {
      Categories: { include: { questions: true } },
    },
  });

  const paragraphs = evaluationForm?.description.split("\n").filter(Boolean);

  const evaluationData = evaluationForm
    ? {
        ...evaluationForm,
        category: evaluationForm.Categories, // Rename here
        questions: evaluationForm.Categories.flatMap((cat) => cat.questions), // Flatten questions if needed
      }
    : null;

  if (evaluationForm?.status === "Closed") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="shadow-xl p-8">
          <CardHeader>
            <CardTitle>{evaluationForm?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              This evaluation form is already closed. Please contact your
              coordinator for more information.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full h-[30vh] relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0, 0.8), #1E6044), url('/images/cbsua.jpg')`,
          backgroundSize: "100% 200%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
        }}
      >
        <div className="absolute inset-x-0 top-28 px-12 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-semibold">Evaluation Form</h1>
            <p className="text-lg">
              Central Bicol State University of Agriculture
            </p>
          </div>
        </div>
      </div>
      <Card className="shadow-xl -mt-20 w-[93%] mx-auto relative z-50">
        <CardHeader>
          <CardTitle>{evaluationForm?.title}</CardTitle>
          {paragraphs?.map((paragraph, index) => (
            <div key={index} className="mb-2">
              {paragraph}
            </div>
          ))}
        </CardHeader>
        <Separator />
        <CardContent>
          <UpdateEvaluationForm
            evaluationData={evaluationData}
            existingEvaluation={existingEvaluation}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ListEvaluationPage;
