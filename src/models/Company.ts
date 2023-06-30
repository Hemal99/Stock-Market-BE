import mongoose, { Schema, Document, Model } from "mongoose";

interface CompanyDoc extends Document {
  companyName: String;
  description: String;
  exchangeShortName: String;
  image: String;
  stocks :[Number],
  firstQuarter: Number,
  secondQuarter: Number,
  thirdQuarter: Number,
}

const CompanySchema = new Schema(
  {
    companyName: { type: String },
    description: { type: String },
    exchangeShortName: { type: String },
    image: { type: String },
    stocks: [Number],
    firstQuarter: { type: Number },
    secondQuarter: { type: Number },
    thirdQuarter: { type: Number },
    stockCount: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Company = mongoose.model<CompanyDoc>("company", CompanySchema);

export { Company };
