"use client";

import { assignFaculty, fetchFaculties } from "@/actions/faculty";
import { addInvitation } from "@/actions/invitation";
import CustomFormField from "@/components/custom-formfield";
import FileUpload from "@/components/file-upload";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFieldType } from "@/lib/constants";
import { InvitationFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Faculty, Invitation } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const InvitationForm = ({ initialData }: { initialData?: any | null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchFacultiesData = async () => {
      const response = await fetchFaculties();
      if (response.faculties) {
        setFaculties(response.faculties);
      } else {
        setFaculties([]);
      }
    };

    fetchFacultiesData();
  }, []);

  const form = useForm<z.infer<typeof InvitationFormSchema>>({
    resolver: zodResolver(InvitationFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      platform: "",
      file: "",
      dateStarted: new Date(),
      status: "",
      selectedFaculties: [],
    },
  });

  async function onSubmit(values: z.infer<typeof InvitationFormSchema>) {
    setIsLoading(true);
    addInvitation(values)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          window.location.reload();
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Invitation</Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Title"
                name="name"
                label="Title"
                isRequired
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Platform (e.g. Zoom, Google Meet)"
                name="platform"
                label="Platform"
                isRequired
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATETIME_PICKER}
                name="dateStarted"
                label="Start Date and Time"
                isRequired
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DYNAMIC_SELECT}
                label="Selected Faculties"
                name="selectedFaculties"
                placeholder="Select Faculties"
                dynamicOptions={faculties.map((faculty) => ({
                  label: `${faculty.fname} ${faculty.lname}`,
                  value: faculty.id,
                }))}
                isRequired={true}
                disabled={isLoading}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                label="Status"
                name="status"
                placeholder="Select Status"
                options={["Pending", "On-Going", "Completed"]}
                isRequired={true}
                disabled={isLoading}
              />
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="file"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product File</FormLabel>
                      <FormControl>
                        <FileUpload
                          onFileUpload={(url) => field.onChange(url)}
                          defaultValue={field.value}
                        />
                      </FormControl>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitationForm;
