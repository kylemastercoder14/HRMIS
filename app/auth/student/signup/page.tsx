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
  UserRegistrationSchema,
} from "@/lib/validators";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomFormField from "@/components/custom-formfield";
import { FormFieldType, OPT_LENGTH } from "@/lib/constants";
import { useSignUp } from "@clerk/nextjs";
import { createUser } from "@/actions/users";
import { maskEmail } from "@/lib/utils";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isPending, setIsPending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  // User registration form
  const form = useForm<z.infer<typeof UserRegistrationSchema>>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      email: "",
      password: "",
      course: "",
      section: "",
      yearLevel: "",
      terms: false,
    },
  });

  // Email verification form (OTP)
  const form2 = useForm<z.infer<typeof EmailVerificationSchema>>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  // Submit registration data
  const onSubmit = async (values: z.infer<typeof UserRegistrationSchema>) => {
    if (!isLoaded) return;

    try {
      setIsPending(true);
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      // Send OTP to email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Transition to verification step
      setVerifying(true);
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsPending(false);
    }
  };

  // Handle OTP verification and user creation in the database
  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsPending(true);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        // Capture form data and insert into the database
        const registrationData = form.getValues(); // Get values from the first form
        await createUser(
          registrationData,
          completeSignUp.createdUserId ?? ""
        ).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push("/student");
          }
        });
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error(err.message || "Failed to verify OTP.");
    } finally {
      setIsPending(false);
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
        <Card className="m-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Enter The OTP Code</CardTitle>
            <CardDescription>
              Enter the OTP code that we sent to your email <br />
              <span className="font-bold text-green-400">
                {maskEmail(form.watch("email"))}
              </span>{" "}
              and be careful not to share the code with anyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={onVerify}
              className="flex items-center justify-center flex-col"
            >
              <InputOTP
                maxLength={OPT_LENGTH}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                className="shad-otp"
                value={code}
                onChange={(text) => setCode(text)}
              >
                <InputOTPSlot index={0} className="shad-otp-slot" />
                <InputOTPSlot index={1} className="shad-otp-slot" />
                <InputOTPSlot index={2} className="shad-otp-slot" />
                <InputOTPSlot index={3} className="shad-otp-slot" />
                <InputOTPSlot index={4} className="shad-otp-slot" />
                <InputOTPSlot index={5} className="shad-otp-slot" />
              </InputOTP>
              <SubmitButton className="mt-5 w-full" isLoading={isPending}>Continue</SubmitButton>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
      <Card className="m-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your informations below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <CustomFormField
                  control={form.control}
                  name="firstName"
                  placeholder="Juan"
                  disabled={isPending}
                  isRequired
                  label="First Name"
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  control={form.control}
                  name="middleInitial"
                  placeholder="Reyes"
                  disabled={isPending}
                  isRequired={false}
                  label="Middle Name"
                  fieldType={FormFieldType.INPUT}
                />
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
              <div className="grid gap-2">
                <CustomFormField
                  control={form.control}
                  name="email"
                  placeholder="juandelacruz@gmail.com"
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
                  placeholder="Enter your year level"
                  disabled={isPending}
                  isRequired
                  label="Year Level"
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  control={form.control}
                  name="course"
                  placeholder="Enter your course"
                  disabled={isPending}
                  isRequired
                  label="Course"
                  fieldType={FormFieldType.INPUT}
                />
                <CustomFormField
                  control={form.control}
                  name="section"
                  placeholder="Enter your section"
                  disabled={isPending}
                  isRequired
                  label="Section"
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
            <Link href="/auth/student/login" className="font-semibold underline text-black">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
