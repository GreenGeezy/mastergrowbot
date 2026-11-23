async function load(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function draw(image: HTMLImageElement, maxSide: number, quality: number): string {
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot prepare photos. Try a different browser.');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

/** Resizes in the browser. Redrawing also removes location and camera details from the photo. */
export async function preparePhoto(file: File): Promise<{ image: string; thumbnail: string | null }> {
  if (file.size > 30 * 1024 * 1024) throw new Error('Choose a photo smaller than 30 MB.');
  let source: HTMLImageElement;
  try {
    source = await load(file);
  } catch {
    throw new Error('This photo type cannot be opened in your browser. Save it as JPEG or PNG and try again.');
  }
  const thumbnail = draw(source, 360, 0.62);
  return { image: draw(source, 1600, 0.86), thumbnail: thumbnail.length <= 60_000 ? thumbnail : null };
}
