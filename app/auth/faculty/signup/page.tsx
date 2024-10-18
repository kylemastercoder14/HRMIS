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
import {
  EmailVerificationSchema,
  FacultyRegistrationSchema,
} from "@/lib/validators";
import CustomFormField from "@/components/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createUser } from "@/actions/faculty";

const Signup = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // User registration form
  const form = useForm<z.infer<typeof FacultyRegistrationSchema>>({
    resolver: zodResolver(FacultyRegistrationSchema),
    defaultValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      suffix: "",
      department: "",
      academicRank: "",
      status: "",
      email: "",
      password: "",
      position: "",
      dateHired: "",
      terms: false,
    },
  });

  // Submit registration data
  const onSubmit = async (
    values: z.infer<typeof FacultyRegistrationSchema>
  ) => {
    try {
      setIsPending(true);
      const data = await createUser(values);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        router.push("/auth/faculty/login");
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsPending(false);
    }
  };

  const facultyRanks = [
    "Associate Professor I",
    "Associate Professor II",
    "Associate Professor III",
    "Associate Professor IV",
    "Associate Professor V",
    "Assistant Professor I",
    "Assistant Professor II",
    "Assistant Professor III",
    "Assistant Professor IV",
    "Assistant Professor V",
    "COS Faculty",
    "Instructor I",
    "Instructor II",
    "Instructor III",
    "Professor I",
    "Professor II",
    "Professor III",
    "Professor IV",
  ];

  const department = [
    "College of Criminology",
    "College of Education",
    "College of Industrial Technology",
    "College of Information Technology",
    "College of BSES and BSAF Program",
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
              name="department"
              placeholder="Select Department"
              disabled={isPending}
              options={department}
              isRequired
              label="Department"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="academicRank"
              placeholder="Select Academic Rank"
              disabled={isPending}
              options={facultyRanks}
              isRequired
              label="Academic Rank"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="status"
              placeholder="Select Status"
              disabled={isPending}
              options={["Regular", "COS"]}
              isRequired
              label="Status"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="position"
              placeholder="Select Position"
              disabled={isPending}
              options={["Teaching", "Chairperson"]}
              isRequired
              label="Position"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="dateHired"
              placeholder="Enter Date Hired"
              disabled={isPending}
              isRequired
              label="Date Hired"
              fieldType={FormFieldType.DATE_PICKER}
            />
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

      <p className="text-center mt-3 text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/faculty/login"
          className="font-semibold underline text-black"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
