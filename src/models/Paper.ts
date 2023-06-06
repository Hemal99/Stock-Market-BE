import mongoose, { Schema, Document, Model } from "mongoose";

export interface PaperDoc extends Document {
  paperUrl: string;
  title: string;
  description: string;
  lessonId: string;
  subject: string;
  markingSchemeUrl: string;
  paperType: string;
}

const PaperSchema = new Schema(
  {
    paperUrl: String,
    title: String,
    description: String,
    subject: String,
    markingSchemeUrl: String,
    lessonId: { type: Schema.Types.ObjectId, ref: "lesson" },
    paperType: {
      type: String,
      enum: [
        "UnitTest",
        "MeritProject",
        "WeaklyPaper",
        "FullPaper",
        "ReviseSection",
      ],
      default: null,
    },
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

const Paper = mongoose.model<PaperDoc>("Paper", PaperSchema);

export { Paper };
