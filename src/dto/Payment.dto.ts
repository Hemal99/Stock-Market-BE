import {
  MonthEnum,
  PaymentStatusEnum,
  PaymentSubjectEnum,
} from "../models/Payment";

export class PaymentInputDto {
  userId: string;
  classType: PaymentSubjectEnum;
  videoId: string;
  amount: number;
  month: MonthEnum;
  year: number;
  status: PaymentStatusEnum;
  slipurl: string;
}
