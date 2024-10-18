"use client";

import Image from "next/image";
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
  NonTeachingRegistrationSchema,
} from "@/lib/validators";
import CustomFormField from "@/components/custom-formfield";
import { FormFieldType, OFFICES, OPT_LENGTH } from "@/lib/constants";
import { useSignUp } from "@clerk/nextjs";
import { createUser } from "@/actions/non-teaching";
import { maskEmail } from "@/lib/utils";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const Signup = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // User registration form
  const form = useForm<z.infer<typeof NonTeachingRegistrationSchema>>({
    resolver: zodResolver(NonTeachingRegistrationSchema),
    defaultValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      suffix: "",
      email: "",
      password: "",
      office: "",
      position: "",
      terms: false,
      dateHired: "",
    },
  });

  // Submit registration data
  const onSubmit = async (
    values: z.infer<typeof NonTeachingRegistrationSchema>
  ) => {
    try {
      setIsPending(true);
      const data = await createUser(values);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        router.push("/auth/non-teaching/login");
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsPending(false);
    }
  };

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
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="office"
              placeholder="Select Office"
              disabled={isPending}
              options={OFFICES}
              isRequired
              label="Office"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <div className="grid gap-2">
            <CustomFormField
              control={form.control}
              name="position"
              placeholder="Enter Position"
              disabled={isPending}
              isRequired
              label="Position"
              fieldType={FormFieldType.INPUT}
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
          href="/auth/non-teaching/login"
          className="font-semibold underline text-black"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
