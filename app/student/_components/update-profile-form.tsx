"use client";

import CustomFormField from "@/components/custom-formfield";
import { Form } from "@/components/ui/form";
import { Student } from "@prisma/client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileUpdateSchema } from "@/lib/validators";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { deleteProfile, updateProfileInfo } from "@/actions/users";
import { toast } from "sonner";
import AlertModal from "@/components/ui/alert-modal";

const UpdateProfileForm = ({ student }: { student: Student }) => {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: student.fname ?? "",
      lastName: student.lname ?? "",
      middleInitial: student.mname ?? "",
      suffix: student.suffix ?? "",
      email: student.email ?? "",
      course: student.course ?? "",
      section: student.section ?? "",
      yearLevel: student.yearLevel ?? 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileUpdateSchema>) => {
    try {
      setIsPending(true);
      const response = await updateProfileInfo(values);
      if (response.error) {
        toast.error(response.error);
      } else {
        window.location.reload();
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.log("Failed to update profile", error);
    } finally {
      setIsPending(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsPending(true);
      const response = await deleteProfile();
      if (response.error) {
        toast.error(response.error);
      } else {
        router.push("/");
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setIsPending(false);
      setOpen(false);
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
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isPending}
        onConfirm={onDelete}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-7 grid-cols-1 mb-2 gap-3">
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
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
            <div className="md:col-span-1">
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
          <CustomFormField
            control={form.control}
            label="Email Address"
            placeholder="jdelacruz@gmail.com"
            isRequired
            type="email"
            disabled
            fieldType={FormFieldType.INPUT}
            name="email"
          />
          <div className="field-group-col3 mt-2">
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
              name="section"
              placeholder="Select your section"
              disabled={isPending}
              options={alphabetOptions}
              isRequired
              label="Section"
              fieldType={FormFieldType.SELECT}
            />
          </div>
          <div className="flex mt-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <SubmitButton isLoading={isPending}>Save Changes</SubmitButton>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/student")}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => setOpen(true)}
              disabled={isPending}
              variant="destructive"
            >
              Delete Account
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UpdateProfileForm;
