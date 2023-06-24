import mongoose, { Schema, Document, Model } from "mongoose";

interface StockDoc extends Document {
 name:String;
 value:String;
 type:String;
}

const StockSchema = new Schema(
  {
    name: { type: String },
    value: { type: Number },
    type: { type: String },
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

const Stock = mongoose.model<StockDoc>("stock", StockSchema);

export { Stock };
