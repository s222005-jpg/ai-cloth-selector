import { Bucket } from "encore.dev/storage/objects";

export const clothingImages = new Bucket("clothing-images", {
  public: true
});
