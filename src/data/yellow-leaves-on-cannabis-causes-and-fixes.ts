import type { GrowGuide } from './growGuides';

const SLUG = 'yellow-leaves-on-cannabis-causes-and-fixes';
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

export const yellowLeavesOnCannabisGuide: GrowGuide = {
  slug: SLUG,
  title: 'Yellow Leaves on Cannabis: 7 Causes and What to Check First',
  h1: 'Yellow Leaves on Cannabis: How to Find the Real Cause and Fix It Fast',
  shortDescription:
    'Identify why your cannabis leaves are turning yellow by location and pattern. Separate nitrogen deficiency, pH lockout, magnesium issues, watering stress, and normal late-flower fade before adding more nutrients.',
  metaTitle: 'Yellow Leaves on Cannabis: Causes & Fix | MasterGrowbot AI',
  metaDescription:
    'Yellow leaves on cannabis? Tell nitrogen deficiency, pH lockout, magnesium, and normal flower fade apart fast. Scan your leaf free in MasterGrowbot AI.',
  publishedDate: '2026-11-22T00:00:00Z',
  modifiedDate: '2026-11-22T00:00:00Z',
  intro: `Yellow leaves on a cannabis plant do not automatically mean your plant needs more nitrogen. In fact, adding extra fertilizer is the single fastest way home growers turn a simple pH lockout or overwatering problem into severe nutrient burn. Before you pour anything into your pot, check two things: where on the plant the yellowing started (bottom, middle, or top) and whether the leaf veins are still green.

If you are looking at a yellowing leaf in your tent right now and want a fast second opinion before feeding, scan it with [MasterGrowbot AI](${IOS}). Our proprietary cannabis cultivation AI reads your phone photo, flags the most likely cause, and gives you the first corrective step to check. Download free on [iPhone](${IOS}) or [Android](${ANDROID}) - eligible new Pro subscribers can try 3 days free. You can also test your symptoms in the browser with our free [cannabis symptom checker](/cannabis-symptom-checker).`,
  sections: [
    {
      heading: 'Quick Diagnosis Table: Match Your Yellowing Pattern in 30 Seconds',
      bodyHtml:
        p('Location on the canopy narrows seven possible causes down to one or two immediately, because mobile nutrients pull from older lower leaves while immobile nutrients and light stress show up at the top.') +
        table(
          ['Where Yellowing Starts', 'Visual Pattern on Leaf', 'Most Likely Cause', 'What to Check First'],
          [
            ['Bottom older leaves (veg or early flower)', 'Uniform pale yellow from tips inward, soft fade, leaves drop easily', 'Nitrogen deficiency', 'Feed strength and runoff pH before increasing nitrogen'],
            ['Bottom and mid leaves', 'Yellow between dark green veins (interveinal chlorosis), rusty spots later', 'Magnesium deficiency or pH lockout', 'Root-zone pH first (soil 6.0-6.8, coco/hydro 5.5-6.2)'],
            ['Whole plant, especially lower canopy', 'Droopy, heavy, curled-down yellow leaves in constantly wet medium', 'Overwatering or root stress', 'Pot weight, drainage holes, and dry-back time between waterings'],
            ['Top new growth only', 'Bright yellow or pale lime-green new shoots while lower leaves stay green', 'Iron or sulfur deficiency (often high pH)', 'Runoff pH and root-zone temperature before adding micronutrients'],
            ['Top canopy directly under LED', 'Bleached yellow-white tops while shaded lower leaves look healthy', 'Light burn / excess PPFD', 'Light hanging height, dimmer level, and daily light integral'],
            ['Leaf tips and jagged edges first', 'Yellowing with brown crispy tips and upward curl', 'Nutrient burn or salt buildup', 'Runoff EC/PPM compared with input feed'],
            ['Bottom fan leaves (weeks 6-9 of flower)', 'Slow, even yellowing across oldest fan leaves while buds stay healthy', 'Normal late-flower senescence', 'Check trichomes and harvest window; do not dump heavy nitrogen'],
          ],
        ) +
        p(`Not sure which row matches your plant? Snap a well-lit natural-color photo and run it through ${a(IOS, 'MasterGrowbot AI on iOS')} or ${a(ANDROID, 'MasterGrowbot AI on Android')} to compare the visible signs against thousands of documented leaf patterns.`),
    },
    {
      heading: 'Cause 1: Root-Zone pH Lockout (The Hidden Reason Behind Most Yellow Leaves)',
      bodyHtml:
        `<figure class="my-5 overflow-hidden rounded-2xl border border-white/10"><img src="/images/grow/cannabis-leaf-yellowing-brown-spots.webp" alt="Cannabis leaf with yellowing and brown spots analyzed by MasterGrowbot AI as a calcium and magnesium deficiency with likely pH lockout" width="1448" height="1086" loading="lazy" decoding="async" class="w-full h-auto" /><figcaption class="px-4 py-3 text-sm text-white/55 font-sans">A real MasterGrowbot AI photo report on a yellowing spotted leaf: Calcium and Magnesium Deficiency (Likely Root-Zone pH Lockout), directing the grower to check and adjust pH before adding more feed.</figcaption></figure>` +
        p('When a fed plant turns yellow anyway, pH lockout is the first suspect. Nutrients can be sitting right in your soil or coco, yet the roots cannot absorb them if root-zone pH drifts outside the absorption window. Dumping extra bottles into a locked-out pot only spikes salt levels and makes yellowing spread faster.') +
        p(`Always measure both the water going in and the runoff coming out using a calibrated pH pen. Target 6.0 to 6.8 in soil and 5.5 to 6.2 in coco or hydro. If your runoff is way off target, flush with plain pH-balanced water, then resume a light balanced feed. For full step-by-step recovery ranges, read our ${a('/grow-guides/cannabis-ph-guide', 'cannabis pH guide')} and ${a('/grow-guides/cannabis-nutrient-lockout', 'nutrient lockout recovery guide')}.`),
    },
    {
      heading: 'Cause 2: Nitrogen Deficiency (True Hunger on Lower Leaves)',
      body: `Nitrogen is a mobile nutrient. When your plant runs short during vegetative growth or the early flowering stretch, it strips nitrogen out of its oldest bottom fan leaves to feed new tops. Those lower leaves turn an even, uniform light green, then pale yellow, and eventually fall off with a gentle tug.

How to confirm it is genuine nitrogen hunger rather than lockout:
- Check your feeding log. Are you running plain water in lightly amended soil past week 3 or 4, or feeding a bloom formula too early before the stretch finishes?
- Check runoff pH. If pH is inside range and runoff EC is low, the plant genuinely needs more nitrogen.
- Expect recovery in new growth, not old leaves. Fully yellow lower fan leaves rarely turn dark green again, so judge success by whether the yellowing stops climbing upward over the next 5 to 7 days.`,
    },
    {
      heading: 'Cause 3: Magnesium and Calcium Deficiencies (Green Veins, Yellow Blade)',
      body: `Unlike nitrogen, which yellows the entire leaf blade evenly, magnesium deficiency creates a sharp striped pattern: the veins stay dark green while the tissue between them turns yellow, starting on older and mid-canopy leaves. Brown or rust-colored spots often appear alongside it when calcium is also restricted.

This shows up constantly in coco coir, reverse-osmosis (RO) water grows, and intense modern LED tents where transpiration runs high. First verify root-zone pH (magnesium locks out quickly below 6.0 in soil or below 5.6 in coco). Once pH is verified, add a standard Cal-Mag supplement at the label rate and check your tent climate with the free [VPD calculator](/vpd-calculator), because poor vapor pressure deficit slows calcium transport through the plant. See our full [Cal-Mag deficiency guide](/grow-guides/cal-mag-deficiency-cannabis) for side-by-side symptoms.`,
    },
    {
      heading: 'Cause 4: Overwatering and Root-Zone Oxygen Loss',
      body: `Roots need oxygen as much as water. When soil stays soggy for days, roots suffocate and stop moving nutrients upward. The result looks almost identical to nitrogen deficiency at first glance: yellowing lower leaves, sluggish growth, and stems that look weak.

The easiest giveaway is posture and pot weight. An overwatered plant has thick, heavy leaves that droop downward in a firm claw, and the pot feels heavy when you lift it. An underwatered plant feels feather-light, and its leaves look thin, papery, and wilted.

Fix overwatering by pausing irrigation until the top inch of soil is dry and the pot feels noticeably lighter, checking that pots drain freely without sitting in standing runoff trays, and verifying that tent temperatures are not too cold for steady evaporation. Track watering intervals in [MasterGrowbot AI](${IOS}) so you never guess how many days ago you last watered.`,
    },
    {
      heading: 'Cause 5: Light Burn and Heat Stress on Upper Leaves',
      body: `If the yellowing starts at the very top of the plant, closest to your LED fixture, while shaded lower leaves remain rich green, suspect light intensity before nutrients. Excess PPFD bleaches chlorophyll out of upper leaves, turning them pale yellow or almost white, often with serrated leaf edges curling upward like a taco.

Move your LED higher or turn down the dimmer by 15 to 25 percent, and check your canopy PPFD and daily light integral using our free [grow light calculator](/grow-light-calculator). Keep canopy temperatures in range (roughly 72 to 80 F in veg and 68 to 78 F in flower) and pair gentle airflow across the tops without blasting one cola directly with a fan.`,
    },
    {
      heading: 'Cause 6: Iron or Sulfur Deficiency on Brand-New Growth',
      body: `When brand-new leaves emerging at the growing tips turn bright yellow while older lower leaves stay dark green, you are looking at an immobile nutrient issue, most commonly iron or sulfur. Because immobile nutrients cannot be moved from old leaves to new shoots, symptoms hit the newest growth first.

Before buying specialty micronutrient bottles, check two things: high root-zone pH (iron locks out quickly above 6.8 in soil or above 6.3 in coco/hydro) and cold root zones. Correcting pH almost always restores normal green color to the next set of new leaves within a week.`,
    },
    {
      heading: 'Cause 7: Normal Late-Flower Fade (Do Not Panic in Weeks 6 to 9)',
      body: `Not every yellow leaf is a problem. During the final two to three weeks of flowering, many cannabis cultivars naturally redirect stored energy from older fan leaves into finishing flowers. Lower and mid fan leaves fade smoothly from green to yellow, sometimes showing purple or red tones depending on genetics and night temperatures.

How to tell normal fade from a real problem:
- Timing: Normal fade happens late in flower, not in veg or weeks 1 to 4 of bloom.
- Health of sugar leaves: Small leaves growing out of the flowers remain green and healthy while big fan leaves gently fade.
- No rapid necrotic spotting, mushy brown buds, or pest webbing.

If you are unsure what week of flower you are actually in or when fade should start, check your timeline with our free [Grow Week cannabis calendar](/cannabis-grow-calendar).`,
    },
    {
      heading: 'Step-by-Step Checklist: What to Do Right Now',
      bodyHtml:
        p('Follow this exact order before touching your nutrient bottles. It prevents 90 percent of cascading home-grow mistakes:') +
        `<ol class="list-decimal pl-6 space-y-2 text-base text-white/65 leading-relaxed font-sans mb-4">
          <li><strong>Locate the yellowing:</strong> Bottom leaves point to nitrogen, magnesium, watering, or late-flower fade. Top leaves point to light burn, heat, or high-pH iron/sulfur lockout.</li>
          <li><strong>Check pot weight and runoff pH:</strong> Confirm the medium is drying back properly and runoff pH sits inside your substrate window before adding any nutrients.</li>
          <li><strong>Verify light distance and VPD:</strong> Check light height with the ${a('/grow-light-calculator', 'grow light calculator')} and room climate with the ${a('/vpd-calculator', 'VPD calculator')}.</li>
          <li><strong>Photograph the exact same leaf today and in 48 hours:</strong> Do not expect yellowed older leaves to turn green again; watch whether yellowing stops spreading to healthy leaves above it.</li>
          <li><strong>Get a guided diagnosis:</strong> Snap a clear photo in natural light with ${a(IOS, 'MasterGrowbot AI for iPhone')} or ${a(ANDROID, 'MasterGrowbot AI for Android')} to log your plant, review likely causes, and follow step-by-step actions. Eligible new Pro subscribers can try 3 days free.</li>
        </ol>` +
        p(`Want to keep learning? Explore all guides in the ${a('/grow-guides', 'cannabis grow guides hub')} or return to the ${a('/', 'MasterGrowbot AI homepage')}. Snap a photo. Save your plant.`),
    },
  ],
  faqs: [
    {
      question: 'Should I cut off yellow leaves on my cannabis plant?',
      answer:
        'Leave leaves that are less than half yellow because they still supply mobile nutrients and energy to the plant. Once a lower fan leaf is completely yellow, crispy, or comes off with a gentle tug, remove it cleanly to keep airflow moving and reduce mold risk.',
    },
    {
      question: 'Will yellow cannabis leaves turn green again after I fix the problem?',
      answer:
        'Lightly pale leaves caught early sometimes regain some color, but fully yellow lower leaves rarely turn dark green again. Judge whether your fix worked by watching healthy leaves higher on the plant and new growth over the next 5 to 7 days.',
    },
    {
      question: 'Why are my cannabis leaves turning yellow during flowering?',
      answer:
        'In weeks 1 to 4 of flowering, yellowing lower leaves usually mean nitrogen hunger from the flowering stretch, magnesium deficiency, or pH lockout. In weeks 6 to 9 of flowering, gradual yellowing of older fan leaves is often normal late-flower fade.',
    },
    {
      question: 'What is the fastest way to check what is causing yellow cannabis leaves?',
      answer:
        'Check whether yellowing started at the bottom or top, verify pot weight and runoff pH first, and scan a clear natural-light photo with MasterGrowbot AI on iPhone or Android (eligible new Pro subscribers can try 3 days free) or try the free browser symptom checker.',
    },
  ],
  relatedSlugs: [
    'cannabis-nutrient-deficiency-guide',
    'cannabis-ph-guide',
    'cannabis-nutrient-lockout',
    'cal-mag-deficiency-cannabis',
  ],
};
