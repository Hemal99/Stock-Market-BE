import mongoose, { Schema, Document, Model } from "mongoose";

export interface PdfDoc extends Document {
  pdfUrl: string;
  title: string;
  description: string;
  lessonId: string;
}

const PdfSchema = new Schema(
  {
    pdfUrl: String,
    title: String,
    description: String,
    lessonId: { type: Schema.Types.ObjectId, ref: "lesson" },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Pdf = mongoose.model<PdfDoc>("Pdf", PdfSchema);

export { Pdf };
