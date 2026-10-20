// Retail references checked 2026-10-20. These are external purchases, not GrowTech stock.
export const growTechRecommendations = [
  {
    id: 'govee-h5075', label: 'ROOM CONDITIONS', name: 'Govee H5075',
    subtitle: 'Bluetooth thermometer + hygrometer',
    description: 'See temperature and humidity on a local display, with Bluetooth history in Govee Home. A useful companion to the free VPD calculator.',
    limitation: 'Bluetooth proximity is required. This model does not measure CO₂ or sync automatically with MasterGrowbot.',
    href: 'https://us.govee.com/products/govee-bluetooth-hygrometer-thermometer-h5075',
    cta: 'Compare at Govee', icon: 'sensor',
  },
  {
    id: 'fiskars-micro-tip', label: 'EVERYDAY PLANT CARE', name: 'Fiskars Micro-Tip snips',
    subtitle: 'A small tool for detailed work',
    description: 'Fine-tip garden snips for light plant care. A practical, reusable accessory that earns its place beside your other hand tools.',
    limitation: 'Choose the exact blade and handle version at the retailer. These are snips, not heavy-duty branch cutters.',
    href: 'https://www.canadiantire.ca/en/pdp/fiskars-micro-tip-pruning-shears-0591357p.0591357.html',
    cta: 'Compare at Canadian Tire', icon: 'snips',
  },
  {
    id: 'boveda-storage', label: 'STORAGE ESSENTIAL', name: 'Boveda humidity packs',
    subtitle: 'Two-way humidity control for sealed storage',
    description: 'Replaceable humidity-control packs offered in different sizes. A small accessory to compare when organizing sealed storage containers.',
    limitation: 'Choose pack size and RH for the contents using Boveda’s instructions. Not a room dehumidifier or a remedy for contaminated material.',
    href: 'https://bovedainc.com/cannabis/',
    cta: 'Compare at Boveda', icon: 'storage',
  },
] as const;

export const growLightRecommendation = {
  id: 'spider-farmer-sf1000',
  name: 'Spider Farmer SF1000',
  href: 'https://www.spider-farmer.com/products/sf-1000-led-grow-light/',
  referencePrice: '$69.99 USD',
  rating: '4.98/5 from 43 manufacturer-site reviews',
  checked: '20 October 2026',
  specs: ['100 W dimmable LED', '32.5 × 29 × 5.9 cm fixture', 'Manufacturer lists 2×2 ft coverage'],
};
