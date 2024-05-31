import { z } from "zod";
import * as api from "../generated/api.js";

export type CodiceFiscale = z.infer<typeof api.schemas.CodiceFiscale>;

export type DigitalAddress = z.infer<typeof api.schemas.Digital_Address>;

export type MotivationTermination = z.infer<
  typeof api.schemas.Motivation_Termination
>;

export type UsageInfo = z.infer<typeof api.schemas.Usage_Info>;
export type ElementDigitalAddress = z.infer<
  typeof api.schemas.Element_Digital_Address
>;

export type ResponseRequestDigitalAddress = z.infer<
  typeof api.schemas.Response_Request_Digital_Address
>;

export type ResponseListRequestDigitalAddress = z.infer<
  typeof api.schemas.Response_List_Request_Digital_Address
>;
export type PracticalReference = z.infer<typeof api.schemas.PracticalReference>;

export type RequestListDigitalAddress = z.infer<
  typeof api.schemas.Request_List_Digital_Address
>;
export type StatusProcessingRequest = z.infer<
  typeof api.schemas.Status_Processing_Request
>;

export type UUID = z.infer<typeof api.schemas.UUID>;

export type ResponseRequestListDigitalAddress = z.infer<
  typeof api.schemas.Response_Request_List_Digital_Address
>;

export type ResponseVerifyDigitalAddress = z.infer<
  typeof api.schemas.Response_Verify_Digital_Address
>;

export type ResponseStatusListDigitalAddress = z.infer<
  typeof api.schemas.Response_Status_List_Digital_Address
>;

export type ResponseListDigitalAddress = z.infer<
  typeof api.schemas.Response_List_Digital_Address
>;
