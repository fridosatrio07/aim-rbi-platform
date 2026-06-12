const DEFAULT_SNAPSHOT_FILENAME = "sucofindo-aim-dashboard-snapshot.png";

function copyComputedStyles(source: Element, target: Element) {
  if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) return;

  const computed = window.getComputedStyle(source);

  for (const propertyName of computed) {
    target.style.setProperty(
      propertyName,
      computed.getPropertyValue(propertyName),
      computed.getPropertyPriority(propertyName),
    );
  }

  Array.from(source.children).forEach((sourceChild, index) => {
    const targetChild = target.children.item(index);
    if (targetChild) {
      copyComputedStyles(sourceChild, targetChild);
    }
  });
}

function waitForImageLoad(image: HTMLImageElement) {
  return new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Dashboard snapshot image render failed."));
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}

export async function exportDashboardSnapshot(
  elementId = "dashboard-snapshot-area",
  filename = DEFAULT_SNAPSHOT_FILENAME,
) {
  const source = document.getElementById(elementId);

  if (!source) {
    throw new Error(`Dashboard snapshot target #${elementId} was not found.`);
  }

  const width = Math.ceil(source.scrollWidth || source.getBoundingClientRect().width);
  const height = Math.ceil(source.scrollHeight || source.getBoundingClientRect().height);

  if (width <= 0 || height <= 0) {
    throw new Error("Dashboard snapshot target has no measurable size.");
  }

  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";
  clone.style.transform = "none";

  copyComputedStyles(source, clone);

  const serialized = new XMLSerializer().serializeToString(clone);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<foreignObject x="0" y="0" width="100%" height="100%">`,
    serialized,
    "</foreignObject>",
    "</svg>",
  ].join("");

  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.decoding = "async";
  image.src = svgUrl;

  await waitForImageLoad(image);

  const scale = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    URL.revokeObjectURL(svgUrl);
    throw new Error("Dashboard snapshot canvas context is unavailable.");
  }

  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.fillStyle = window.getComputedStyle(source).backgroundColor || "#f8fafc";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(svgUrl);

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Dashboard snapshot PNG generation failed."));
      }
    }, "image/png");
  });

  downloadBlob(pngBlob, filename);
}
