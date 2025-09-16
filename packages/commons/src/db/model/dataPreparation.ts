import { ResponseRequestDigitalAddressModel } from "pdnd-models";

export type DataPreparation = {
  idSubject: string;
  data: ResponseRequestDigitalAddressModel;
  createdAt?: Date;
  updatedAt?: Date;
};
