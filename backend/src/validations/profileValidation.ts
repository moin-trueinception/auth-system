import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const profileCreateSchema = z.object({
  fullname: z.string().min(1, "Fullname is required").trim(),
  age: z.coerce.number().int().min(1, "Age must be at least 1").max(150, "Age must be at most 150"),
  bio: z.string().min(1, "Bio is required").trim(),
  avatarUrl: z.union([z.string().url("Invalid avatar URL"), z.literal("")]).optional(),
  address: z.string().min(1, "Address is required").trim(),
  contact: z.string().min(1, "Contact is required").trim()
});

const profileUpdateSchema = z.object({
  fullname: z.string().min(1, "Fullname cannot be empty").trim().optional(),
  age: z.coerce.number().int().min(1).max(150).optional(),
  bio: z.string().min(1, "Bio cannot be empty").trim().optional(),
  avatarUrl: z.union([z.string().url("Invalid avatar URL"), z.literal("")]).optional(),
  address: z.string().min(1, "Address cannot be empty").trim().optional(),
  contact: z.string().min(1, "Contact cannot be empty").trim().optional()
}).strict();

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

function zodErrorToMessage(error: z.ZodError): { message: string; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue: z.ZodIssue) => {
    const path = issue.path.join(".");
    if (!errors[path]) errors[path] = issue.message;
  });
  return {
    message: "Validation failed",
    errors
  };
}

export function validateCreateProfile(req: Request, res: Response, next: NextFunction): void {
  const parsed = profileCreateSchema.safeParse(req.body);
  if (parsed.success) {
    req.body = parsed.data;
    next();
    return;
  }
  const { message, errors } = zodErrorToMessage(parsed.error);
  res.status(400).json({ success: false, message, errors });
}

export function validateUpdateProfile(req: Request, res: Response, next: NextFunction): void {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (parsed.success) {
    req.body = parsed.data;
    next();
    return;
  }
  const { message, errors } = zodErrorToMessage(parsed.error);
  res.status(400).json({ success: false, message, errors });
}
