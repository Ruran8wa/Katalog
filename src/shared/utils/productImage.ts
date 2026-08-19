export function getPrimaryImageUrl(
  images: string[],
  primaryImageIndex: number,
): string {
  return images[primaryImageIndex] ?? images[0] ?? ''
}
