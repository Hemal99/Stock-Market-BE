import mongoose, { Schema, Document } from "mongoose";

interface StudyPackDoc extends Document {
  name: string;
  description: string;
  videoIds: string[];
  thumbnail: string;
  tutes: string[];
  papers: string[];
  price: number;
}

enum SubjectEnum {
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
}

const StudyPackSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    videoIds: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    thumbnail: { type: String },
    tutes: [{ type: Schema.Types.ObjectId, ref: "Pdf" }],
    papers: [{ type: Schema.Types.ObjectId, ref: "Paper" }],
    price: { type: Number },
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

const StudyPack = mongoose.model<StudyPackDoc>("StudyPack", StudyPackSchema);

export { StudyPack };
