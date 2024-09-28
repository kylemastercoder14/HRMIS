"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrashIcon, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { uploadDirect } from "@uploadcare/upload-client";
import { toast } from "sonner";
import { createProfile, removeProfile } from "@/actions/faculty";

const ProfileUpdate = ({
  image,
  fallback,
}: {
  image: string;
  fallback: string;
}) => {
  const [profile, setProfile] = useState<string | null>(image);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const toastId = toast.loading("Uploading: 0%", { duration: Infinity });

      try {
        const result = await uploadDirect(file, {
          publicKey: "79cc1ac0a5122232368b",
          store: "auto",
          onProgress: (progress: any) => {
            // Check if progress has `uploaded` and `total` properties
            if ("uploaded" in progress && "total" in progress) {
              const percentage = Math.round(
                (progress.uploaded / progress.total) * 100
              );
              // Update the toast progress
              toast.message(`Uploading: ${percentage}%`, { id: toastId });
            }
          },
        });

        setProfile(result.cdnUrl);
        const data = await createProfile(result.cdnUrl ?? "");
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          window.location.reload();
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = async () => {
    setProfile(null);
    const response = await removeProfile();
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(response.success);
      window.location.reload();
    }
  };
  return (
    <div className="flex items-center gap-5">
      <Avatar className="w-20 h-20">
        <AvatarImage src={profile as string} />
        <AvatarFallback className="text-2xl font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <Button
          variant="default"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={uploading}
        >
          <UploadCloud className="w-5 h-5 mr-2" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleRemove}
          disabled={uploading || !profile}
        >
          <TrashIcon className="w-5 h-5 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ProfileUpdate;
