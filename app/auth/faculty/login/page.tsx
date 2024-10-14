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
import { UserLoginSchema } from "@/lib/validators";
import CustomFormField from "@/components/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { useSignIn } from "@clerk/nextjs";

const Signin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // User login form
  const form = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit login data
  const onSubmit = async (values: z.infer<typeof UserLoginSchema>) => {
    if (!isLoaded) return;

    try {
      setIsPending(true);
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      // If sign-in process is complete, set the created session as active and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/faculty");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(
        error.message || "No user found with the provided credentials."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-balance text-muted-foreground">
          Enter your informations below to login your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
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
          <Link href="/auth/faculty/forgot-password" className="text-sm text-right font-semibold underline">Forgot Password?</Link>
          <SubmitButton isLoading={isPending}>Continue</SubmitButton>
        </form>
      </Form>
      <p className="text-center mt-3 text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/faculty/signup"
          className="font-semibold underline text-black"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Signin;
