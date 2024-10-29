import { z } from "zod";

export const csvValidationSchema = z.object({
  "Claim ID": z.string().min(1, "Claim ID is required"),
  "Subscriber ID": z.string().min(1, "Subscriber ID is required"),
  "Member Sequence": z.string().min(1, "Member Sequence is required"),
  "Claim Status": z.string().min(1, "Claim Status is required"),
  Billed: z.string().refine((val) => !isNaN(parseFloat(val)), "Billed must be a number"),
  Allowed: z.string().refine((val) => !isNaN(parseFloat(val)), "Allowed must be a number"),
  Paid: z.string().refine((val) => !isNaN(parseFloat(val)), "Paid must be a number"),
  "Payment Status Date": z.string().min(1, "Payment Status Date is required"),
  "Service Date": z.string().min(1, "Service Date is required"),
  "Received Date": z.string().min(1, "Received Date is required"),
  "Entry Date": z.string().min(1, "Entry Date is required"),
  "Processed Date": z.string().min(1, "Processed Date is required"),
  "Paid Date": z.string().min(1, "Paid Date is required"),
  "Payment Status": z.string().min(1, "Payment Status is required"),
  "Group Name": z.string().min(1, "Group Name is required"),
  "Group ID": z.string().min(1, "Group ID is required"),
  "Division Name": z.string().min(1, "Division Name is required"),
  "Division ID": z.string().min(1, "Division ID is required"),
  Plan: z.string().min(1, "Plan is required"),
  "Plan ID": z.string().min(1, "Plan ID is required"),
  "Place of Service": z.string().min(1, "Place of Service is required"),
  "Claim Type": z.enum(["Professional", "Institutional"]),
  "Procedure Code": z.string().min(1, "Procedure Code is required"),
  "Member Gender": z.string().min(1, "Member Gender is required"),
  "Provider ID": z.string().min(1, "Provider ID is required"),
  "Provider Name": z.string().min(1, "Provider Name is required"),
});

export const uploadFileSchema = z.object({
  csvFile: z.instanceof(File).optional(),
});