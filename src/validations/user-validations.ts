import z from "zod";

export const vCreateUser = z.object({
  first_name: z.string().min(3, { message: "First name must be at least 3 characters long" }),
  last_name: z.string().min(3, {message: "Last name must be at least 3 characters long" }).optional(),
  email: z.string().email({message: "Invalid email address"}),
  phone: z.string().min(10, {message: "Phone number must be at least 10 characters long" }).max(15).optional(),
  dob: z.string().transform(val => new Date(val)) ,
  doj: z.string().transform(val => new Date(val)),
  designation: z.string().min(3, {message: "Designation must be at least 3 characters long" }),
});

export type ValidatedCreateUser = z.infer<typeof vCreateUser>;