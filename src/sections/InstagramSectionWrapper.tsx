import { getInstagramImages } from "@/lib/getInstagramImages";
import InstagramSection from "./InstagramSection";

export default async function InstagramSectionWrapper() {
  const images = await getInstagramImages();
  return <InstagramSection images={images} />;
}
