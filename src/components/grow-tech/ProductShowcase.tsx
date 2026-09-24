import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/growTechProducts";
import { trackEvent } from "@/lib/analytics";

const images = [
  "/images/premium/ai-scout-camera-10-20x.webp",
  "/images/grow-tech/generated-review/environment-monitor-grow-tent.webp",
  "/images/grow-tech/generated-review/soil-health-meter-root-zone.webp",
];
export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const product = products[active];
  return (
    <div className="premium-product-showcase">
      <div className="premium-product-photo">
        <img
          src={images[active]}
          alt={product.alt}
          width="1000"
          height="1000"
          fetchPriority="high"
        />
        <span className="premium-product-tag">IN THE COMPLETE KIT</span>
      </div>
      <div
        className="premium-product-select"
        role="group"
        aria-label="Explore the three kit tools"
      >
        {products.map((p, i) => (
          <button
            key={p.productId}
            aria-pressed={active === i}
            onClick={() => {
              setActive(i);
              trackEvent("growtech_hero_product_select", {
                product_id: p.productId,
              });
            }}
          >
            <span>0{i + 1}</span>
            {["Scout Camera", "Environment", "Soil Meter"][i]}
          </button>
        ))}
      </div>
      <div className="premium-product-caption" aria-live="polite">
        <div>
          <h2>{product.name.replace("MasterGrowbot AI ", "")}</h2>
          <p>{product.comparisonBestFor}</p>
        </div>
        <a
          href={`#${product.anchorId}`}
          aria-label={`See ${product.name} details`}
        >
          <ArrowRight size={22} />
        </a>
      </div>
      <p className="premium-product-disclaimer">
        Product illustration. Phone, tent and lighting not included. Tools work
        independently; no direct app syncing.
      </p>
    </div>
  );
}
