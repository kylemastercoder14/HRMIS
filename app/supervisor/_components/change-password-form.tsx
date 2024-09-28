"use client";

import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { ChangePasswordSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="field-group-col3">
          <CustomFormField
            control={form.control}
            label="Old Password"
            placeholder="********"
            isRequired={true}
            type="password"
            disabled={isPending}
            fieldType={FormFieldType.INPUT}
            name="oldPassword"
          />
          <CustomFormField
            control={form.control}
            label="New Password"
            placeholder="********"
            isRequired={true}
            type="password"
            disabled={isPending}
            fieldType={FormFieldType.INPUT}
            name="newPassword"
          />
          <CustomFormField
            control={form.control}
            label="Confirm Password"
            placeholder="********"
            isRequired={true}
            type="password"
            disabled={isPending}
            fieldType={FormFieldType.INPUT}
            name="confirmPassword"
          />
        </div>
        <SubmitButton className="mt-3" isLoading={isPending}>Save Changes</SubmitButton>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
