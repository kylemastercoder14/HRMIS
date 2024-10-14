"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { ForgotPasswordSchema } from "@/lib/validators";
import CustomFormField from "@/components/custom-formfield";
import { FormFieldType, OPT_LENGTH } from "@/lib/constants";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/actions/faculty";

const ForgotPassword = () => {
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // Hook for forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    router.push("/faculty");
    return null; // Prevent rendering further after redirect
  }

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    setIsPending(true);
    try {
      await signIn
        ?.create({
          strategy: "reset_password_email_code",
          identifier: values.email,
        })
        .then(() => {
          setSuccessfulCreation(true);
        })
        .catch((err) => {
          console.error("error", err.errors[0].longMessage);
          toast.error(err.errors[0].longMessage);
        });
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsPending(true);
      await signIn
        ?.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: code, // Use the OTP code entered by the user
          password: password, // Use the new password entered by the user
        })
        .then(async (result) => {
          if (result.status === "complete") {
            await resetPassword(password, result.createdSessionId as string);
            setActive({ session: result.createdSessionId });
            toast.success("Password reset successful");
            router.push("/student");
          } else {
            console.error(JSON.stringify(result, null, 2));
            toast.error("An error occurred while resetting your password");
          }
        })
        .catch((err) => {
          console.error("error", err.errors[0].longMessage);
          toast.error(err.errors[0].longMessage);
        });
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto grid gap-6">
      {successfulCreation ? (
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below to continue
          </p>
          <form onSubmit={onReset} className="grid gap-3">
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
            <div className="grid gap-2">
              <Label>New Password</Label>
              <Input
                placeholder="------"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shad-input"
              />
            </div>
            <SubmitButton isLoading={isPending}>Reset</SubmitButton>
          </form>
        </div>
      ) : (
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email address below to reset your password
          </p>
          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
              className="grid gap-3"
            >
              <CustomFormField
                control={forgotPasswordForm.control}
                name="email"
                placeholder="juan.delacruz@cbsua.edu.ph"
                disabled={isPending}
                isRequired
                label="Email Address"
                fieldType={FormFieldType.INPUT}
              />
              <SubmitButton isLoading={isPending}>Continue</SubmitButton>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
