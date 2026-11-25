import sharp from "sharp";

export async function readImageDimensions(bytes: Uint8Array) {
  const metadata = await sharp(bytes, { limitInputPixels: 40_000_000 }).metadata();
  if (!metadata.width || !metadata.height || metadata.width * metadata.height > 40_000_000) {
    throw new Error("Imagem inválida ou com resolução superior a 40 megapixels.");
  }
  return { width: metadata.width, height: metadata.height };
}
