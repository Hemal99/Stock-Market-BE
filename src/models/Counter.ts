import mongoose, { Schema, Document } from "mongoose";

export interface CounterDoc extends Document {
  c: number;
  p: number;
  cp: number;
}

const CounterSchema = new Schema(
  {
    c: {
      default: 220,
      type: Number,
      unique: true,
    },
    p: {
      default: 285,
      type: Number,
      unique: true,
    },
    cp: {
      default: 620,
      type: Number,
      unique: true,
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

const Counters = mongoose.model<CounterDoc>("Counters", CounterSchema);

export { Counters };
