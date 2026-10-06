import { useState } from "react";

const scenes = [
  { file: "product", label: "Lens + LED light", alt: "AI product illustration of the APEXEL lens, ring light and adjustable phone clip" },
  { file: "grower-tent", label: "At the grow tent", alt: "AI lifestyle illustration of a grower using the lens on a phone beside indoor plants" },
  { file: "grower-window", label: "An observation routine", alt: "AI lifestyle illustration of a grower photographing a leaf with the phone lens" },
];

type GalleryKind = "lens" | "tent" | "soil";

export default function LensGallery({ kind = "lens" }: { kind?: GalleryKind }) {
  const [selected, setSelected] = useState(0);
  const images = kind === "lens" ? scenes : [
    {file:"product",label:kind === "tent" ? "The 2×2 tent" : "The soil tester",alt:`AI product illustration based on the ${kind === "tent" ? "unbranded tent" : "six-function soil tester"} supplier reference`},
    {file:"grower-one",label:"In a grow routine",alt:`AI illustration of an adult male cannabis grower using the ${kind === "tent" ? "unbranded tent" : "six-function soil tester"}`},
    {file:"grower-two",label:"A closer look",alt:`AI illustration of an adult male cannabis grower checking plants with the ${kind === "tent" ? "unbranded tent" : "six-function soil tester"}`},
  ];
  const directory = kind === "lens" ? "lens-launch" : kind === "tent" ? "tent-express-v2" : "soil-launch";
  const scene = images[selected];
  return <figure className="lens-gallery">
    <img className="lens-gallery-main" style={kind === "tent" ? {aspectRatio:"5 / 6",objectFit:"contain"} : undefined} src={`/images/grow-tech/${directory}/${scene.file}.webp`} alt={scene.alt} width={kind === "tent" ? 1145 : 1448} height={kind === "tent" ? 1374 : 1086} loading={kind === "lens" ? "eager" : "lazy"} />
    <div className="lens-thumbnails" aria-label="Product image gallery">
      {images.map((item, index) => <button key={item.file} type="button" aria-label={`View ${kind === "lens" ? "" : `${kind}: `}${item.label}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <img src={`/images/grow-tech/${directory}/${item.file}.webp`} alt="" width={160} height={120} loading="lazy" /><span>{item.label}</span>
      </button>)}
    </div>
    <figcaption>AI illustrations. Models, plants and other props are not included. {kind === "lens" && "Phone not included."}</figcaption>
  </figure>;
}
