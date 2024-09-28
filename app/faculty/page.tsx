"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Step1Form from "./_components/step-1-form";
import { useEffect, useState } from "react";
import Step2Form from "./_components/step-2-form";
import Step3Form from "./_components/step-3-form";
import Step4Form from "./_components/step-4-form";
import Step5Form from "./_components/step-5-form";
import Step6Form from "./_components/step-6-form";

const Home = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stepTitles = [
    "General Information",
    "Commitment",
    "Knowledge of the Subject",
    "Teaching for Independent Learning",
    "Management Learning",
    "Comments, Suggestions or Feedback",
  ];

  const nextStep = () => {
    if (currentStep < stepTitles.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isMounted) return null;
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
          <div className="step flex items-center gap-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`${
                    currentStep === index + 1 ? "bg-white" : "bg-zinc-400"
                  } w-10 h-10 flex items-center justify-center rounded-full`}
                >
                  <p
                    className={`${
                      currentStep === index + 1
                        ? "text-green-400 font-semibold"
                        : "text-white"
                    }`}
                  >
                    {index + 1}
                  </p>
                </div>
                {index === currentStep - 1 && <p>{stepTitles[index]}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Card className="shadow-xl -mt-20 w-[93%] mx-auto relative z-50">
        <CardHeader>
          <CardTitle>
            Instrument for Instruction/Teaching Effectiveness
          </CardTitle>
          <CardDescription>
            Instruction: Please evaluate the faculty using the scale provided.
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>
                5 - Outstanding (The Performance almost always exceeds the job
                requirements. The faculty is an exceptional role model.)
              </li>
              <li>
                4 - Very Satisfactory (The Performance meets and often exceeds
                the job requirements.)
              </li>
              <li>
                3 - Satisfactory (The Performance meets job requirements.)
              </li>
              <li>
                2 - Fair (The performance needs some development to meet the job
                requirements.)
              </li>
              <li>1 - Poor (The faculty fails to meet job requirements.)</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          {currentStep === 1 && <Step1Form nextStep={nextStep} />}
          {currentStep === 2 && <Step2Form nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 3 && <Step3Form nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 4 && <Step4Form nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 5 && <Step5Form nextStep={nextStep} prevStep={prevStep} />}
          {currentStep === 6 && <Step6Form prevStep={prevStep} />}
        </CardContent>
      </Card>
    </>
  );
};

export default Home;
