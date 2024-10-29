import { z } from "zod";

const nonNegativeStringRule = z.string().refine(
  (value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  },
  {
    message: "Amount must be a non-negative number.",
  },
);

const validDateRule = (fieldName: string) =>
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: `Invalid date format for ${fieldName}.`,
  });

export const csvValidationSchema = z.object({
  "Claim ID": z.string().regex(/^\d+$/, "Claim ID must be a  number."),
  "Subscriber ID": z
    .string()
    .regex(/^[a-zA-Z0-9]{8}[a-zA-Z]{2}$/, { message: "Subscriber ID must be 9 characters long, with 7 alphanumeric characters followed by 2 alphabetic character." }),
  "Member Sequence": nonNegativeStringRule,
  "Claim Status": z.enum(["Payable", "Denied", "Partial Deny"]),
  Billed: nonNegativeStringRule,
  Allowed: nonNegativeStringRule,
  Paid: nonNegativeStringRule,
  "Payment Status Date": validDateRule("Payment Status Date"),
  "Service Date": validDateRule("Service Date"),
  "Received Date": validDateRule("Received Date"),
  "Entry Date": validDateRule("Entry Date"),
  "Processed Date": validDateRule("Processed Date"),
  "Paid Date": validDateRule("Paid Date"),
  "Payment Status": z.enum(["Paid", "Unpaid"]),
  "Group Name": z.string().regex(/^[A-Za-z\s.]+$/, { message: "Group Name must only contain alphabetic characters and spaces" }),
  "Group ID": z.string().regex(/^[A-Z]{3}\d{3}$/, { message: "Group ID must start with 3 uppercase letters and end with 3 digits." }),
  "Division Name": z.enum(["North", "West", "South", "East"]),
  "Division ID": z.enum(["N", "W", "S", "E"]),
  Plan: z.enum(["Premium Care Plan", "Family Coverage Plan", "Senior Wellness Plan", "Young Adult Plan", "Basic Health Plan"]),
  "Plan ID": z.string().regex(/^[A-Z]{3}\d{3}$/, { message: "Plan ID must start with 3 uppercase letters and end with 3 digits." }),
  "Place of Service": z.enum(["Outpatient Hospital", "Emergency Room - Hospital", "Inpatient Hospital"]),
  "Claim Type": z.enum(["Professional", "Institutional"]),
  "Procedure Code": z.string().regex(/^[a-zA-Z]{1}[0-9]{4}$/, { message: "Procedure Code must start with 1 letter and end with 4 digits." }),
  "Member Gender": z.enum(["Male", "Female"]),
  "Provider ID": z.string().regex(/^\d{6,10}$/, { message: "Provider ID must be a numeric value between 6 and 10 digits long" }),
  "Provider Name": z.string().regex(/^[A-Za-z\s.]+$/, { message: "Provider Name must only contain alphabetic characters and spaces" }),
});

export const uploadFileSchema = z.object({
  csvFile: z.instanceof(File).optional(),
});
