import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  href: {
    type: String,
  },
});

const imageSchema = new mongoose.Schema({
  alt: {
    type: String,
  },
  src: {
    type: String,
  },
});

const freeCodeCampSchema = new mongoose.Schema(
  {
    title: { type: String, default: "No Title" },
    description: { type: String, default: "No Description" },
    keywords: { type: String, default: "No Keywords" },
    imageCount: { type: Number },
    images: [imageSchema],
    linkCount: { type: Number },
    links: [linkSchema],
  },
  { timestamps: true }
);

const FreeCodeCamp = mongoose.model("FreeCodeCamp", freeCodeCampSchema);
export default FreeCodeCamp;
