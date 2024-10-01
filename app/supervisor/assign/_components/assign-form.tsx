"use client";

import { assignFaculty } from "@/actions/faculty";
import CustomFormField from "@/components/custom-formfield";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { COURSES, FormFieldType, SECTIONS, YEAR_LEVEL } from "@/lib/constants";
import { AssignFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Faculty } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AssignFormProps {
  initialData: Faculty | null;
}

const AssignForm: React.FC<AssignFormProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const fullName =
    initialData?.fname +
    " " +
    initialData?.mname +
    " " +
    initialData?.lname +
    " " +
    initialData?.suffix;

  const yearLevel = initialData?.yearLevel.map((yearLevel) => yearLevel);
  const course = initialData?.course.map((course) => course);
  const section = initialData?.section.map((section) => section);

  const form = useForm<z.infer<typeof AssignFormSchema>>({
    resolver: zodResolver(AssignFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          faculty: fullName,
          yearLevel: yearLevel ?? [],
          course: course ?? [],
          section: section ?? [],
        }
      : {
          faculty: fullName,
          yearLevel: yearLevel ?? [],
          course: course ?? [],
          section: section ?? [],
        },
  });

  async function onSubmit(values: z.infer<typeof AssignFormSchema>) {
    setIsLoading(true);
    assignFaculty(params.facultyId as string, values)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/supervisor/assign");
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <div className="space-y-3">
            <CustomFormField
              control={form.control}
              name="faculty"
              fieldType={FormFieldType.INPUT}
              disabled
              label="Faculty Name"
              placeholder="Faculty Name"
              isRequired
            />
            <FormField
              control={form.control}
              name="yearLevel"
              render={() => (
                <FormItem>
                  <div className="mb-1">
                    <FormLabel>
                      Year Level <span className="text-red-700 tex-lg"> *</span>
                    </FormLabel>
                  </div>
                  <div className="flex items-center gap-5">
                    {YEAR_LEVEL.map((year) => (
                      <FormField
                        key={year.id}
                        control={form.control}
                        name="yearLevel"
                        render={({ field }) => {
                          return (
                            <FormItem
                              className="flex flex-row items-center space-x-2 space-y-0"
                              key={year.id}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(year.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          year.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== year.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {year.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={() => (
                <FormItem>
                  <div className="mb-1">
                    <FormLabel>
                      Course <span className="text-red-700 tex-lg"> *</span>
                    </FormLabel>
                  </div>
                  <div className="space-y-2">
                    {COURSES.map((course, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name="course"
                        render={({ field }) => {
                          return (
                            <FormItem
                              className="flex flex-row items-center space-x-2 space-y-0"
                              key={index}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(course)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, course])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== course
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {course}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={() => (
                <FormItem>
                  <div className="mb-1">
                    <FormLabel>
                      Secion <span className="text-red-700 tex-lg"> *</span>
                    </FormLabel>
                  </div>
                  <div className="flex gap-4">
                    {SECTIONS.map((section, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name="section"
                        render={({ field }) => {
                          return (
                            <FormItem
                              className="flex flex-row items-center space-x-2 space-y-0"
                              key={index}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(section)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          section,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== section
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {section}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="mt-5">
            {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AssignForm;
