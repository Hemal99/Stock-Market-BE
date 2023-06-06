import mongoose, { Schema, Document, Model } from "mongoose";

enum SubjectEnum {
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
}

interface LessonDoc extends Document {
  lessonName: string;
  lessonDescription: string;
  subject: SubjectEnum;
}

const LessonSchema = new Schema(
  {
    lessonName: { type: String },
    lessonDescription: { type: String },
    lessonThumbnail: { type: String },
    subject: { type: SubjectEnum },
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

const Lesson = mongoose.model<LessonDoc>("lesson", LessonSchema);

export { Lesson };
