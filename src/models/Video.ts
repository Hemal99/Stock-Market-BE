import mongoose, { Schema, Document, Model } from "mongoose";

export interface VideoDoc extends Document {
  videoUrl: string;
  title: string;
  limit: number;
  description: string;
  lessonId: string;
  thumbnail: string;
}

const VideoSchema = new Schema(
  {
    videoUrl: String,
    title: String,
    limit: String,
    description: String,
    thumbnail: String,
    lessonId: { type: Schema.Types.ObjectId, ref: "lesson" },
    watchTime: [{ type: Schema.Types.ObjectId, ref: "watchTime" }],
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

const Video = mongoose.model<VideoDoc>("Video", VideoSchema);

export { Video };
