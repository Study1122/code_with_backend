import mongoose, { Schema } from "mongoose";

const subsSchema = new Schema(
  {
    subscriberName: {
      type: Schema.Types.ObjectId, //one who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //one whom asubscribre is subcscribing
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subs = mongoose.model("Subs", subsSchema);
