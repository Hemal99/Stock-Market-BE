import mongoose, { Schema, Document, Model } from "mongoose";
import { Refer } from "twilio/lib/twiml/VoiceResponse";

export enum MonthEnum {
  JANUARY = 0,
  FEBRUARY = 1,
  MARCH = 2,
  APRIL = 3,
  MAY = 4,
  JUNE = 5,
  JULY = 6,
  AUGUST = 7,
  SEPTEMBER = 8,
  OCTOBER = 9,
  NOVEMBER = 10,
  DECEMBER = 11,
}

export enum PaymentStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export enum PaymentSubjectEnum {
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
  BOTH = "both",
}

interface PaymentDoc extends Document {
  userId: string;
  classType: PaymentSubjectEnum;
  videoId: string;
  amount: number;
  month: MonthEnum;
  year: number;
  status: PaymentStatusEnum;
  checked: boolean;
  slipurl: string;
}

const PaymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    classType: { type: PaymentSubjectEnum, default: null },
    checked: { type: Boolean, default: false },

    videoId: { type: String, default: null },
    amount: { type: Number, default: 0 },
    month: { type: MonthEnum, default: null },
    year: { type: Number, default: 0 },
    status: { type: PaymentStatusEnum, default: PaymentStatusEnum.PENDING },
    slipurl: { type: String, default: null },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Payment = mongoose.model<PaymentDoc>("payment", PaymentSchema);

export { Payment };
