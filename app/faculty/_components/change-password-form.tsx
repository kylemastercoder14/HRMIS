"use client";

import { changePassword } from "@/actions/faculty";
import CustomFormField from "@/components/custom-formfield";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { ChangePasswordSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Faculty } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ChangePasswordForm = ({ faculty }: { faculty: Faculty }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    setIsPending(true);
    try {
      const response = await changePassword(values, faculty.clerkId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        router.refresh();
        window.location.assign("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="field-group-col2">
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
        <SubmitButton className="mt-3" isLoading={isPending}>
          Save Changes
        </SubmitButton>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
