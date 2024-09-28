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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      toast.error(error.message || "No user found with the provided credentials.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
      <Card className="m-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your informations below to login your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;
