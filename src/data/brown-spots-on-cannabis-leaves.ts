import type { GrowGuide } from './growGuides';

const SLUG = 'brown-spots-on-cannabis-leaves';
const IOS = `https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=${SLUG}`;
const ANDROID = `https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=${SLUG}`;

const table = (head: string[], rows: string[][]) =>
  `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-white/20 rounded-lg"><thead><tr>${head
    .map((h) => `<th class="border border-white/20 px-3 py-2 text-left text-landing-green text-sm font-semibold">${h}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td class="border border-white/20 px-3 py-2 text-white/70 text-sm">${c}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;
const p = (html: string) => `<p class="text-base text-white/65 leading-relaxed font-sans mb-3">${html}</p>`;
const a = (href: string, text: string) => `<a href="${href}" class="text-landing-green hover:underline">${text}</a>`;

export const brownSpotsOnCannabisLeavesGuide: GrowGuide = {
  slug: SLUG,
  title: 'Brown Spots on Cannabis Leaves: 7 Causes and Exact Fixes',
  h1: 'Brown Spots on Cannabis Leaves: How to Tell Calcium Deficiency, pH Lockout, and Leaf Septoria Apart',
  shortDescription:
    'Identify why cannabis leaves develop brown, rust, or necrotic spots by pattern and canopy height. Separate calcium deficiency, root-zone pH lockout, leaf septoria, nutrient burn, and light stress before feeding more.',
  metaTitle: 'Brown Spots on Cannabis Leaves: Causes | MasterGrowbot AI',
  metaDescription:
    'Brown spots on cannabis leaves? Tell calcium deficiency, pH lockout, leaf septoria, and nutrient burn apart fast. Scan your leaf with MasterGrowbot AI.',
  publishedDate: '2026-11-25T00:00:00Z',
  modifiedDate: '2026-11-25T00:00:00Z',
  intro: `Brown spots on cannabis leaves mean leaf tissue has started dying, not just fading. Unlike uniform yellowing, brown or rust-colored speckles never turn green again once necrosis sets in. Your goal is to identify the exact spot pattern quickly so you stop new spots from spreading onto healthy upper fan leaves and sugar leaves.

Most home growers immediately reach for a bottle of Cal-Mag the moment they see brown dots, yet root-zone pH drift, potassium deficiency, leaf septoria fungus, and LED light stress create very similar spots. Snap a clear photo in white light with [MasterGrowbot AI](${IOS}) before changing your feed. Our proprietary cannabis cultivation AI reads spot borders, halos, and leaf placement to narrow down the cause and walk you through the top checks first. Download free on [iPhone](${IOS}) or [Android](${ANDROID}). Eligible new Pro subscribers can try 3 days free. You can also cross-check visible patterns in our free browser [cannabis symptom checker](/cannabis-symptom-checker).`,
  sections: [
    {
      heading: 'Quick Diagnosis Table: Match Your Brown Spot Pattern in 30 Seconds',
      bodyHtml:
        p('Look closely at the shape, border color, and canopy height of the spots before touching your nutrients. Two spots that look similar from across the tent often have completely opposite fixes.') +
        table(
          ['Spot Shape & Color', 'Where Spots Appear First', 'Most Likely Cause', 'What to Check First'],
          [
            ['Small rust-brown specks, often with faint yellow leaf edges', 'Middle and upper-middle leaves exposed to strong light', 'Calcium deficiency or calcium pH lockout', 'Runoff pH first (soil 6.2 to 6.8, coco/hydro 5.8 to 6.2), then VPD'],
            ['Round tan-brown spots with distinct yellow halos, dark center dots', 'Lowest shaded leaves first, then climbing upward', 'Leaf septoria (yellow leaf spot fungus)', 'Airflow, leaf wetness, RH spikes, and sanitation of fallen leaves'],
            ['Dark bronze or rusty blotches between green veins', 'Older lower and mid-canopy fan leaves', 'Magnesium deficiency (late stage)', 'Root-zone pH and Epsom salt or Cal-Mag balance'],
            ['Brown, crispy dead leaf tips and serrated margins', 'Upper and mid leaves across the canopy', 'Nutrient burn or potassium deficiency', 'Runoff EC/PPM vs input feed and tip curl direction'],
            ['Irregular dry brown patches only right under the LED', 'Top colas and highest fan leaves', 'Light stress or radiant heat burn', 'LED hanging height, dimmer level, and canopy PPFD'],
            ['Water droplets turned into scorched tan-brown circles', 'Scattered leaves hit during foliar spray or watering', 'Water-drop leaf burn or spray burn', 'Foliar spray timing (lights off only) and watering aim'],
            ['Tiny pale stipple dots that later bronze and crisp', 'Lower and mid leaves, often near warm dry air', 'Spider mites or thrips damage', 'Underside of spotted leaves with a 60x loupe for moving specks'],
          ],
        ) +
        p(`If your spotted leaves are also turning pale yellow, check both patterns side by side in ${a(IOS, 'MasterGrowbot AI on iPhone')} or ${a(ANDROID, 'MasterGrowbot AI on Android')}, and read our ${a('/grow-guides/yellow-leaves-on-cannabis-causes-and-fixes', 'yellow leaves diagnosis guide')} to catch combined nitrogen and calcium issues early.`),
    },
    {
      heading: 'Cause 1: Calcium Deficiency and Root-Zone pH Lockout',
      bodyHtml:
        `<figure class="my-5 overflow-hidden rounded-2xl border border-white/10"><img src="/images/grow/cannabis-leaf-yellowing-brown-spots.webp" alt="Cannabis leaf with yellowing and brown rust spots analyzed in MasterGrowbot AI as calcium and magnesium deficiency with likely pH lockout" width="1448" height="1086" loading="lazy" decoding="async" class="w-full h-auto" /><figcaption class="px-4 py-3 text-sm text-white/55 font-sans">A real MasterGrowbot AI leaf scan flagging Calcium and Magnesium Deficiency (Likely Root-Zone pH Lockout) so the grower checks runoff pH before pouring extra fertilizer.</figcaption></figure>` +
        p('Calcium deficiency is the number-one reason indoor cannabis plants under strong LEDs develop rusty brown specks. Calcium builds cell walls and moves through the plant almost entirely through transpiration, meaning water evaporating out of the leaves pulls calcium up from the roots.') +
        p(`Three separate issues cause those exact rust spots, so check them in order:`) +
        p(`<strong>1. Root-zone pH drift:</strong> Even when your nutrient mix contains plenty of calcium, roots struggle to absorb calcium below pH 6.2 in soil or below pH 5.8 in coco and hydro. Test runoff pH with a calibrated meter before adding extra Cal-Mag. See exact target windows in our ${a('/grow-guides/cannabis-ph-guide', 'cannabis pH guide')} and ${a('/grow-guides/cannabis-nutrient-lockout', 'nutrient lockout recovery guide')}.`) +
        p(`<strong>2. Unbuffered coco coir or soft/RO water:</strong> Raw coco binds calcium ions tightly, and reverse-osmosis or soft tap water starts with almost zero dissolved calcium. If you grow in coco or start with RO water below 100 PPM, include a base Cal-Mag supplement from week two onward. Review full dosing signs in our ${a('/grow-guides/cal-mag-deficiency-cannabis', 'Cal-Mag deficiency guide')}.`) +
        p(`<strong>3. Low transpiration (poor VPD):</strong> When tent humidity stays too high or stagnant air stalls leaf evaporation, calcium stalls in the lower stem while upper rapidly growing shoots develop brown necrotic speckles and twisted tips. Plug your canopy temperature and humidity into our free ${a('/vpd-calculator', 'VPD calculator')} to verify your room sits in a healthy transpiration zone.`),
    },
    {
      heading: 'Cause 2: Leaf Septoria (Yellow Leaf Spot Fungus)',
      body: `Leaf septoria is a fungal infection that is routinely misdiagnosed as a calcium or potassium deficiency, and treating it with extra fertilizer only wastes time while spores spread up the canopy.

How to spot leaf septoria instead of a nutrient deficiency:
- Distinct yellow halo: Each brown or tan spot is surrounded by a bright yellow ring, often with tiny black fruiting specks in the center of older lesions.
- Bottom-up climb: Septoria starts on the lowest, oldest leaves closest to damp soil or mulch and splashes upward during watering.
- Soft or papery texture: Spots grow outward and merge until the whole lower leaf turns yellow, browns out, and drops.

If you suspect leaf septoria, do not flush the pot or flood the tent with foliar sprays while lights are on. Put on clean gloves, remove heavily spotted lower leaves gently without shaking them across healthy branches, clean up dead leaf litter on top of the soil, and thin dense lower foliage so air moves freely. Lower excess humidity, water gently at the soil line without splashing leaves, and disinfect pruning shears between plants.`,
    },
    {
      heading: 'Cause 3: Potassium Deficiency vs Nutrient Burn on Leaf Edges',
      body: `Brown leaf edges and crispy brown tips confuse almost every newer grower because potassium deficiency and fertilizer burn both scorch the perimeter of the leaf. Check the edge color and tip shape to tell them apart:

- Potassium deficiency: Leaf margins turn dull yellow first, then dry into rusty brown, brittle patches along the serrated edges while the inner leaf stays medium green. This commonly shows up during weeks 3 to 6 of flowering when bloom demand spikes.
- Nutrient burn (salt buildup): Only the very sharpest leaf tips turn tan or brown and feel crisp, often curving slightly upward or downward on otherwise dark green leaves. Runoff EC/PPM measures higher than your input feed.

If runoff EC is climbing above target, skip one or two nutrient feeds and water with plain pH-balanced water until runoff drops back down. If runoff EC is low, pH is in range, and edges are browning in mid-flower, step up bloom potassium gradually rather than overcorrecting in one heavy feed.`,
    },
    {
      heading: 'Cause 4: Excess LED Intensity and Canopy Heat Spots',
      body: `High-efficiency LED fixtures push intense photon levels without feeling hot at the top of the tent. When upper leaves receive more light than they can process, chlorophyll breaks down, turning upper foliage pale yellow or blotchy brown-bronze strictly on the leaves closest to the fixture. Lower leaves shaded under the top canopy stay completely spot-free.

Verify your fixture distance and PPFD with our free [grow light calculator](/grow-light-calculator). If top leaves show dry bronze or tan patches while lower branches look fine, raise the LED 4 to 6 inches or dim output by 15 to 25 percent, and pair that check with our [cannabis leaves curling guide](/grow-guides/cannabis-leaves-curling-up-or-down) if upper edges are also folding upward like tacos.`,
    },
    {
      heading: 'Cause 5: Late-Stage Magnesium Deficiency and Water-Drop Burn',
      body: `Magnesium deficiency begins as pale yellow stripes between dark green veins on older leaves, then forms dry brown or reddish-brown blotches across those yellowed bands if left unchecked. Fixing pH and adding a modest dose of magnesium sulfate (Epsom salt) or Cal-Mag stops new leaves from spotting.

Separately, stray nutrient water droplets sitting on fan leaves under bright LEDs leave sharp, circular brown or bleached scorch marks where concentrated salts dry on the leaf surface. Foliar sprays applied with lights on cause the exact same scattered burn rings. Water slowly near the base of the stem and apply any foliar treatments right as the lights turn off.`,
    },
    {
      heading: 'Cause 6: Pest Stippling That Turns Brown (Mites and Thrips)',
      body: `Early spider mite and thrips feeding leaves behind clusters of pinpoint white or silvery dots on the upper leaf surface. Within a few days, heavy feeding patches oxidize into dull brown or bronze spots that look deceptively like calcium or magnesium hunger from standing height.

Always flip spotted leaves over and inspect the undersides with a 60x jeweler loupe. Tiny dark dots moving slowly along the veins, fine webbing between leaf fingers, or silvery streaks with black pepper-like frass point to pests rather than fertilizer. Read our [spider mites treatment guide](/grow-guides/spider-mites-cannabis-treatment) if you spot movement on the underside.`,
    },
    {
      heading: 'Should You Cut Off Brown-Spotted Cannabis Leaves?',
      body: `Existing brown necrotic spots never turn green again. Once leaf cells die, they stay brown permanently, so never judge whether a fix worked by staring at an already-spotted leaf.

Use this simple pruning rule:
- Keep leaves with minor spotting (under 40 to 50 percent damaged) if the cause is a nutrient or pH issue, because the green tissue still produces energy and acts as a buffer.
- Remove leaves cleanly if the cause is fungal (leaf septoria) or if more than half the leaf is dead, crispy, and blocking airflow in dense flower sites.
- Track recovery with dated photos: Take a clear photo of the next healthy leaf tier up today and again 48 to 72 hours later in [MasterGrowbot AI](${IOS}) to confirm new spots have stopped forming.`,
    },
    {
      heading: 'Step-by-Step Recovery Checklist: Stop Brown Spots From Spreading',
      bodyHtml:
        p('Run these five steps in sequence before mixing a heavy corrective feed:') +
        `<ol class="list-decimal pl-6 space-y-2 text-base text-white/65 leading-relaxed font-sans mb-4">
          <li><strong>Check the underside of spotted leaves first:</strong> Rule out spider mites, thrips, and fungal lesions with yellow halos before adjusting nutrients.</li>
          <li><strong>Measure runoff pH and runoff EC/PPM:</strong> Verify soil runoff sits near 6.2 to 6.8 (5.8 to 6.2 in coco/hydro) and check whether salts are building up or running low.</li>
          <li><strong>Verify canopy VPD and LED distance:</strong> Confirm humidity and leaf temperature support steady calcium uptake in our ${a('/vpd-calculator', 'VPD calculator')} and check PPFD in the ${a('/grow-light-calculator', 'grow light calculator')}.</li>
          <li><strong>Correct one variable at a time:</strong> Fix pH lockout or fungal airflow first, then adjust Cal-Mag or potassium gently over the next two waterings.</li>
          <li><strong>Log follow-up leaf scans:</strong> Capture a clear white-light leaf photo in ${a(IOS, 'MasterGrowbot AI for iPhone')} or ${a(ANDROID, 'MasterGrowbot AI for Android')} to get a guided check-in plan and daily tasks. Eligible new Pro subscribers can try 3 days free.</li>
        </ol>` +
        p(`Explore more troubleshooting walkthroughs in our ${a('/grow-guides', 'cannabis grow guides hub')} or visit the ${a('/', 'MasterGrowbot AI homepage')}. Download free with a 3-day trial.`),
    },
  ],
  faqs: [
    {
      question: 'What is the most common cause of brown spots on cannabis leaves?',
      answer:
        'Calcium deficiency, often triggered by root-zone pH lockout or low transpiration (poor VPD), is the most frequent cause of small rust-brown spots on indoor cannabis leaves. Always check runoff pH before pouring extra Cal-Mag.',
    },
    {
      question: 'How do I tell calcium deficiency apart from leaf septoria?',
      answer:
        'Calcium deficiency usually appears as small rust-brown specks on middle and upper leaves exposed to bright light. Leaf septoria is a fungus that forms round tan-brown spots with distinct yellow halos, starting on the lowest shaded leaves and climbing upward.',
    },
    {
      question: 'Will brown spots on cannabis leaves heal and turn green again?',
      answer:
        'No. Brown necrotic tissue is dead and will not turn green again. Judge whether your fix worked by watching healthy upper leaves and brand-new growth over the next 3 to 7 days to confirm no new spots appear.',
    },
    {
      question: 'Can I scan brown leaf spots with my phone to narrow down the cause?',
      answer:
        'Yes. Photograph the spotted leaf in natural white light (without purple grow lights) and scan it in MasterGrowbot AI on iPhone or Android for guided checks and follow-up tasks. Eligible new Pro subscribers can try 3 days free.',
    },
  ],
  relatedSlugs: [
    'cal-mag-deficiency-cannabis',
    'yellow-leaves-on-cannabis-causes-and-fixes',
    'cannabis-ph-guide',
    'cannabis-nutrient-lockout',
    'cannabis-leaves-curling-up-or-down',
  ],
};
