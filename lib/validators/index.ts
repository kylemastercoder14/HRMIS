import { z } from "zod";

export const UserRegistrationSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  middleInitial: z.string().optional(),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().min(1, {
    message: "Email address is required.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character.",
    }),
  course: z.string().min(1, {
    message: "Course is required.",
  }),
  section: z.string().min(1, {
    message: "Section is required.",
  }),
  yearLevel: z.string().min(1, {
    message: "Year level is required.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Terms of agreement must be accepted.",
  }),
});

export const FacultyRegistrationSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  middleInitial: z.string().optional(),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().min(1, {
    message: "Email address is required.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character.",
    }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Terms of agreement must be accepted.",
  }),
});

export const EmailVerificationSchema = z.object({
  otpCode: z.string().min(1, {
    message: "OTP code is required.",
  }),
});

export const UserLoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email address is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const Step1Schema = z.object({
  ratingPeriod: z.string().min(1, {
    message: "Rating period is required.",
  }),
  schoolYear: z.string().min(1, {
    message: "School year is required.",
  }),
  evaluatee: z.string().min(1, {
    message: "Name of faculty to be evaluated is required.",
  }),
  academicRank: z.string().min(1, {
    message: "Academic rank is required.",
  }),
  evaluator: z.string().min(1, {
    message: "Evaluator is required.",
  }),
});

export const Step2Schema = z.object({
  demonstrate: z.string().min(1, {
    message: "This field is required.",
  }),
  integrate: z.string().min(1, {
    message: "This field is required.",
  }),
  available: z.string().min(1, {
    message: "This field is required.",
  }),
  regularly: z.string().min(1, {
    message: "This field is required.",
  }),
  accurate: z.string().min(1, {
    message: "This field is required.",
  }),
});

export const Step3Schema = z.object({
  mastery: z.string().min(1, {
    message: "This field is required.",
  }),
  draws: z.string().min(1, {
    message: "This field is required.",
  }),
  practical: z.string().min(1, {
    message: "This field is required.",
  }),
  relevance: z.string().min(1, {
    message: "This field is required.",
  }),
  awareness: z.string().min(1, {
    message: "This field is required.",
  }),
});

export const Step4Schema = z.object({
  teaching: z.string().min(1, {
    message: "This field is required.",
  }),
  enhance: z.string().min(1, {
    message: "This field is required.",
  }),
  objectives: z.string().min(1, {
    message: "This field is required.",
  }),
  independent: z.string().min(1, {
    message: "This field is required.",
  }),
  encourage: z.string().min(1, {
    message: "This field is required.",
  }),
});

export const Step5Schema = z.object({
  opportunity: z.string().min(1, {
    message: "This field is required.",
  }),
  roles: z.string().min(1, {
    message: "This field is required.",
  }),
  experience: z.string().min(1, {
    message: "This field is required.",
  }),
  structures: z.string().min(1, {
    message: "This field is required.",
  }),
  instructional: z.string().min(1, {
    message: "This field is required.",
  }),
});

export const Step6Schema = z.object({
  comments: z.string().optional(),
});

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  middleInitial: z.string().optional(),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().min(1, {
    message: "Email address is required.",
  }),
  course: z.string().min(1, {
    message: "Course is required.",
  }),
  section: z.string().min(1, {
    message: "Section is required.",
  }),
  yearLevel: z.string().min(1, {
    message: "Year level is required.",
  }),
});

export const ProfileUpdateFacultySchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  middleInitial: z.string().optional(),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().min(1, {
    message: "Email address is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Old Password is required.",
  }),
  newPassword: z
    .string()
    .min(8, { message: "New Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "New Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "New Password must contain at least one lowercase letter.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "New Password must contain at least one special character.",
    }),
  confirmPassword: z.string().min(1, {
    message: "Confirm Password is required.",
  }),
});
