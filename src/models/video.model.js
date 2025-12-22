import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudnary image
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    duration: {
      //cloudnary image
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timesStamps: true }
);

videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model("Video", userSchema);
