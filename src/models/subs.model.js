import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
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

export const Subscription = mongoose.model("Subscription", subscriptionSchemab);
