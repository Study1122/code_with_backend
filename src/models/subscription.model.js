import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //User who subscribed
      ref: "User",
      required: true
    },
    channel: {
      type: Schema.Types.ObjectId, //User who got subscribed
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
