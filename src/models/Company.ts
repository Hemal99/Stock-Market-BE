import mongoose, { Schema, Document, Model } from "mongoose";

interface CompanyDoc extends Document {
  companyName: String;
  description: String;
  exchangeShortName: String;
  image: String;
}

const CompanySchema = new Schema(
  {
    companyName: { type: String },
    description: { type: String },
    exchangeShortName: { type: String },
    image: { type: String },
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
