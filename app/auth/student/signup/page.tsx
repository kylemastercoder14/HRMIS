"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { UserRegistrationSchema } from "@/lib/validators";
import CustomFormField from "@/components/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createUser } from "@/actions/users";

const Signup = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // User registration form
  const form = useForm<z.infer<typeof UserRegistrationSchema>>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      suffix: "",
      email: "",
      password: "",
      course: "",
      section: "",
      yearLevel: 1,
      terms: false,
    },
  });

  // Submit registration data
  const onSubmit = async (values: z.infer<typeof UserRegistrationSchema>) => {
    try {
      setIsPending(true);
      await createUser(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          router.push("/auth/student/login");
        }
      });
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsPending(false);
    }
  };

  const alphabetOptions = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const courseOptions = [
    "Bachelor of Science in Criminology",
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education",
    "Bachelor of Technology and Livelihood Education",
    "Bachelor of Science in Agroforestry",
    "Bachelor of Science in Environmental Science",
    "Bachelor of Science in Industrial Technology",
    "Bachelor of Science in Information Technology",
    "Bachelor of Engineering Technology",
  ];

  return (
    <div className="mx-auto md:px-20 px-5 grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-balance text-muted-foreground">
          Enter your information below to create an account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="col-span-2">
              <CustomFormField
                control={form.control}
                name="firstName"
                placeholder="Juan"
                disabled={isPending}
                isRequired
                label="First Name"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="col-span-2">
              <CustomFormField
                control={form.control}
                name="middleInitial"
                placeholder="Reyes"
                disabled={isPending}
                isRequired={false}
                label="Middle Name"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="col-span-2">
              <CustomFormField
                control={form.control}
                name="lastName"
                placeholder="Dela Cruz"
                disabled={isPending}
                isRequired
                label="Last Name"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="col-span-1">
              <CustomFormField
                control={form.control}
                name="suffix"
                placeholder="JR."
                disabled={isPending}
                isRequired={false}
                label="Suffix"
                fieldType={FormFieldType.INPUT}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="email"
              placeholder="juan.delacruz@cbsua.edu.ph"
              disabled={isPending}
              isRequired
              label="Email Address"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="password"
              placeholder="********"
              disabled={isPending}
              isRequired
              type="password"
              label="Password"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="field-group-col3">
            <CustomFormField
              control={form.control}
              name="yearLevel"
              placeholder="Select your year level"
              disabled={isPending}
              options={["1", "2", "3", "4"]}
              isRequired
              label="Year Level"
              fieldType={FormFieldType.SELECT}
            />
            <CustomFormField
              control={form.control}
              name="course"
              placeholder="Select your course"
              disabled={isPending}
              options={courseOptions}
              isRequired
              label="Course"
              fieldType={FormFieldType.SELECT}
            />
            <CustomFormField
              control={form.control}
              name="section"
              placeholder="Select your section"
              disabled={isPending}
              options={alphabetOptions}
              isRequired
              label="Section"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <CustomFormField
            control={form.control}
            name="terms"
            disabled={isPending}
            isRequired
            fieldType={FormFieldType.CHECKBOX}
            label="By signing in or creating account, you agree with our Terms & Conditions and Privacy Policy"
          />
          <SubmitButton isLoading={isPending}>Register</SubmitButton>
        </form>
      </Form>
      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/student/login"
          className="font-semibold underline text-black"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
