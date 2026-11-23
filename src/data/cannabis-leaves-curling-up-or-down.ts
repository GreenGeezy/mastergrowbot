import type { GrowGuide } from './growGuides';

const SLUG = 'cannabis-leaves-curling-up-or-down';
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

export const cannabisLeavesCurlingGuide: GrowGuide = {
  slug: SLUG,
  title: 'Cannabis Leaves Curling Up or Down: 8 Causes and Exact Fixes',
  h1: 'Cannabis Leaves Curling Up or Down: How to Diagnose Tacoing, Clawing, and Drooping Fast',
  shortDescription:
    'Tell upward tacoing (heat, LED light intensity, high VPD, broad mites) apart from downward clawing (overwatering, nitrogen toxicity, wind burn, cold roots) in under a minute.',
  metaTitle: 'Cannabis Leaves Curling Up or Down: Causes & Fix | MasterGrowbot AI',
  metaDescription:
    'Cannabis leaves curling up like tacos or clawing down? Match heat stress, LED intensity, VPD, overwatering, or nitrogen toxicity fast with MasterGrowbot AI.',
  publishedDate: '2026-11-23T00:00:00Z',
  modifiedDate: '2026-11-23T00:00:00Z',
  intro: `When cannabis leaves curl up like a taco or hook sharply downward like a claw, your plant is trying to protect itself from water loss, excess light, root suffocation, or heavy fertilizer salts. The single fastest way to fix curling leaves is to separate the direction of the curl first: upward curling almost always points to canopy stress above the pot, while downward curling usually starts inside the root zone or nutrient bottle.

Want a fast check on your exact leaf shape before changing your light, fan, or feed schedule? Snap a clear photo in natural light with [MasterGrowbot AI](${IOS}). Our proprietary cannabis cultivation AI analyzes visible curl, color, and texture patterns and walks you through the top checks in order. Download free on [iPhone](${IOS}) or [Android](${ANDROID}). Eligible new Pro subscribers can try 3 days free. You can also compare symptoms right now in our free browser [cannabis symptom checker](/cannabis-symptom-checker).`,
  sections: [
    {
      heading: 'Quick Diagnosis Table: Curling Up vs Curling Down in 30 Seconds',
      bodyHtml:
        p('Match the exact shape and location of the curl before making changes. Fixing the wrong cause, such as flushing a heat-stressed plant or raising a light over an overwatered pot, usually adds days of unnecessary stress.') +
        table(
          ['Curl Direction & Shape', 'Where It Appears', 'Most Likely Cause', 'What to Check First'],
          [
            ['Edges curl UP like a taco / canoe', 'Top canopy directly under LED', 'Heat stress or excess light intensity (PPFD)', 'Canopy temperature, LED hanging height, and dimmer setting'],
            ['Edges curl UP, dry and papery', 'Upper and mid canopy across tent', 'Low humidity / high VPD', 'Temperature and RH in the free VPD calculator'],
            ['Tips hook DOWN sharply (eagle claw) on dark glossy leaves', 'Upper and mid fan leaves', 'Nitrogen toxicity', 'Runoff EC/PPM and nitrogen dose in current feed'],
            ['Whole leaf arches DOWN, thick and heavy', 'Whole plant, lower leaves first', 'Overwatering or poor drainage', 'Pot weight, dry-back days, and standing tray runoff'],
            ['Whole leaf hangs DOWN, thin and limp', 'Whole plant rapidly', 'Underwatering', 'Feather-light pot and dry medium down two inches'],
            ['Twisted, curled DOWN or clawed on one side only', 'Leaves directly in front of fan', 'Wind burn', 'Oscillating fan speed and direct airflow distance'],
            ['New growth curls UP/twists, shiny or blistered', 'Newest tops and young shoots', 'Broad mites or russet mites (check with 60x loupe)', 'Underside of young leaves under strong magnification'],
            ['Edges curl UP or DOWN with brown crispy tips', 'Leaf tips and margins across canopy', 'Root-zone pH drift or salt buildup', 'Calibrated runoff pH and runoff EC before next feed'],
          ],
        ) +
        p(`If your plant shows both curling and yellowing at the same time, run a quick photo scan in ${a(IOS, 'MasterGrowbot AI on iPhone')} or ${a(ANDROID, 'MasterGrowbot AI on Android')}, and review our ${a('/grow-guides/yellow-leaves-on-cannabis-causes-and-fixes', 'yellow leaves diagnosis guide')} to separate nutrient lockout from light stress.`),
    },
    {
      heading: 'Leaves Curling Up (Tacoing / Canoeing): 4 Canopy Causes to Check First',
      bodyHtml:
        `<figure class="my-5 overflow-hidden rounded-2xl border border-white/10"><img src="/images/grow/flowering-cannabis-plant-led-tent.webp" alt="Indoor flowering cannabis canopy under LED grow light with digital temperature and humidity hygrometer reading 78.1 F and 52 percent RH" width="1448" height="1086" loading="lazy" decoding="async" class="w-full h-auto" /><figcaption class="px-4 py-3 text-sm text-white/55 font-sans">Monitoring canopy temperature and humidity right at bud height catches excess VPD and LED heat stress before upper leaves start canoeing upward.</figcaption></figure>` +
        p('When serrated leaf edges fold upward toward the center vein like a taco shell, the leaf is reducing its exposed surface area to slow down moisture loss. Always inspect these four canopy factors in order before adjusting nutrients:') +
        p(`<strong>1. Excess LED light intensity (PPFD) and radiant heat:</strong> Modern full-spectrum LEDs feel cool to the back of your hand while still blasting the top buds with more photons than the plant can process. If only the tallest colas closest to the fixture are tacoing while lower shaded branches sit flat, dim the light by 15 to 25 percent or raise the fixture 4 to 6 inches. Verify your hanging distance and daily light integral with our free ${a('/grow-light-calculator', 'grow light calculator')}.`) +
        p(`<strong>2. High canopy temperature and low humidity (High VPD):</strong> When tent air is hot and dry, leaves lose water faster than the roots can pump it up the stem. That pushes Vapor Pressure Deficit (VPD) too high, causing serrated margins to curl upward tightly. Plug your actual canopy temperature and relative humidity into our free ${a('/vpd-calculator', 'VPD calculator')} and target roughly 0.8 to 1.2 kPa in veg and 1.0 to 1.5 kPa in flower.`) +
        p('<strong>3. Exhaust and air exchange bottlenecks:</strong> Even when your tent sensor reads 78 F at the wall, stagnant pockets directly under an LED driver can run 6 to 10 degrees hotter. Place a thermometer probe at exact canopy height and confirm your inline exhaust fan is actively pulling warm air out of the tent.') +
        p('<strong>4. Microscopic pests (broad mites or russet mites):</strong> If upper new leaves curl upward, look unusually shiny or blistered, and stop expanding even after temperature, VPD, and light distance are verified in range, inspect the underside of new shoots with a 60x to 100x jeweler loupe. Broad and russet mites are invisible to the naked eye and are frequently misdiagnosed as heat or pH stress.'),
    },
    {
      heading: 'Leaves Curling Down (Clawing and Drooping): 4 Root and Feed Causes',
      body: `Downward curling looks dramatic, yet the texture and color of the leaf tell you immediately which root or nutrient issue you are dealing with.

1. Overwatering (thick, firm downward arch):
Overwatered leaves feel plump, heavy, and swollen with water. The entire leaf blade and petiole arch downward while the pot feels heavy and wet. Roots suffocate when air pockets stay flooded for days. Stop watering until the top inch of soil is dry and the pot feels noticeably lighter, confirm drain trays are emptied after every irrigation, and keep tent temperatures warm enough for steady root uptake. See our full [cannabis watering schedule guide](/grow-guides/cannabis-watering-schedule-guide) for pot-weight dry-back checks.

2. Nitrogen toxicity (the dark-green eagle claw):
Unlike overwatering, which bends the whole leaf gently downward, nitrogen toxicity bends just the sharp tips of the fingers straight down at a 90-degree hook while turning the foliage abnormally dark, glossy forest green. This happens easily in pre-amended hot soils or when growers keep pushing high-nitrogen veg nutrients deep into flowering. Cut back nitrogen immediately, give plain pH-balanced water for one or two cycles if runoff EC is elevated, and check your [cannabis pH guide](/grow-guides/cannabis-ph-guide) ranges (6.0 to 6.8 in soil, 5.5 to 6.2 in coco/hydro).

3. Underwatering (thin, papery droop):
An underwatered plant droops rapidly with soft, lifeless stems and leaves that feel thin and dry rather than turgid. Lift the container first: if it feels nearly weightless, water slowly until you see 10 to 15 percent runoff. Most underwatered plants perk back up within two to four hours.

4. Cold root zones and root rot:
Pots sitting directly on cold basement concrete often drop below 60 F at root level even when canopy air reads 75 F. Cold roots slow water uptake and trigger persistent downward curling. Elevating pots onto a foam riser or plant stand fixes cold-floor droop within days. If runoff smells sour or roots look brown and slimy in hydro, address root oxygen and water temperature right away.`,
    },
    {
      heading: 'Wind Burn: The Single-Sided Curl Most Growers Miss',
      body: `Wind burn is one of the easiest problems to misdiagnose as nitrogen toxicity or overwatering because it makes leaves curl downward into twisted talons. The dead giveaway is geography: wind burn only hits the specific branches sitting directly in the blast path of a clip-on fan, while leaves on the opposite side of the exact same plant remain smooth and flat.

Leaves need a gentle rustle, never a constant wind tunnel. Point oscillating fans slightly above the canopy or bounce airflow off the tent wall so air circulates smoothly around the stems without stripping moisture off one set of fan leaves for 18 hours a day.`,
    },
    {
      heading: 'How Long Do Curled Leaves Take to Recover?',
      body: `Recovery speed depends on what caused the curl and how long the stress lasted:
- Underwatering droop: Usually rebounds in 2 to 6 hours after thorough watering.
- Mild heat or high-VPD tacoing: Often relaxes within 24 to 48 hours after dimming the LED and bringing VPD back into target range.
- Overwatering droop: Typically improves in 2 to 4 days once the medium dries back and oxygen returns to the roots.
- Severe nitrogen claw or wind burn: Permanently hardened curled tips rarely flatten out completely. Judge recovery by watching brand-new growth emerging over the next 5 to 7 days. If new leaves open flat and medium green, your fix worked.

Logging side-by-side photos every 48 hours in [MasterGrowbot AI](${IOS}) makes it obvious whether new shoots are flattening out or if stress is still spreading.`,
    },
    {
      heading: 'Step-by-Step Recovery Checklist: Fix Curling Leaves Today',
      bodyHtml:
        p('Run through these five checks in order before adding any new bottles to your feed:') +
        `<ol class="list-decimal pl-6 space-y-2 text-base text-white/65 leading-relaxed font-sans mb-4">
          <li><strong>Check the direction first:</strong> Upward tacoing starts with light, canopy heat, and VPD. Downward clawing or drooping starts with pot weight, nitrogen strength, and direct fan blast.</li>
          <li><strong>Verify environment numbers at canopy height:</strong> Check your exact temperature and humidity in the ${a('/vpd-calculator', 'VPD calculator')} and your LED height in the ${a('/grow-light-calculator', 'grow light calculator')}.</li>
          <li><strong>Lift the pot and test runoff pH:</strong> Confirm whether the medium is heavy and soggy or dry and light, and verify runoff pH sits inside your substrate range before feeding.</li>
          <li><strong>Check fan aim and pot floor temperature:</strong> Redirect any fan blasting one side of the canopy and lift pots off cold floors.</li>
          <li><strong>Track recovery with photo check-ins:</strong> Capture a clear leaf photo in ${a(IOS, 'MasterGrowbot AI for iPhone')} or ${a(ANDROID, 'MasterGrowbot AI for Android')} to get a guided plant health report and follow-up tasks. Eligible new Pro subscribers can try 3 days free.</li>
        </ol>` +
        p(`Need more troubleshooting help? Browse every guide in the ${a('/grow-guides', 'cannabis grow guides hub')} or return to the ${a('/', 'MasterGrowbot AI homepage')}.`),
    },
  ],
  faqs: [
    {
      question: 'Why are my cannabis leaves curling up like a taco?',
      answer:
        'Upward curling or tacoing is usually a defensive response to canopy stress: excess LED light intensity (PPFD), high canopy temperatures, or low relative humidity (high VPD). Lowering light intensity by 15 to 25 percent and checking canopy VPD resolves most cases within 48 hours.',
    },
    {
      question: 'How do I tell overwatering droop from nitrogen claw?',
      answer:
        'Overwatering makes the entire leaf blade arch downward and feel thick and heavy in a wet pot, often starting with lower leaves. Nitrogen toxicity hooks just the sharp tips downward at a steep angle while turning foliage unusually dark, glossy green.',
    },
    {
      question: 'Will curled cannabis leaves flatten back out after I fix the problem?',
      answer:
        'Mild heat stress, high VPD, and watering droop usually relax within a few hours to 48 hours. Severely clawed nitrogen-burned or wind-burned leaves often keep some permanent curl, so track recovery by checking whether brand-new leaves emerge flat and healthy.',
    },
    {
      question: 'Can I diagnose curled leaves with a phone photo?',
      answer:
        'Yes. Take a clear photo in natural white light (turn off purple blurple lights) showing both the curled leaf and surrounding canopy, then scan it in MasterGrowbot AI on iPhone or Android to review likely causes and next checks. Eligible new Pro subscribers can try 3 days free.',
    },
  ],
  relatedSlugs: [
    'yellow-leaves-on-cannabis-causes-and-fixes',
    'cannabis-watering-schedule-guide',
    'cannabis-vpd-guide',
    'cannabis-ph-guide',
    'cannabis-nutrient-lockout',
  ],
};
