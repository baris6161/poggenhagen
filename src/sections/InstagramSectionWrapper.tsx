import { getInstagramImages } from "@/lib/getInstagramImages";
import InstagramSection from "./InstagramSection";

export default async function InstagramSectionWrapper() {
  const images = await getInstagramImages();
  console.log("InstagramSectionWrapper: Loaded images:", images);
  return <InstagramSection images={images} />;
}
