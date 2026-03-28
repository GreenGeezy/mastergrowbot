export interface GrowGuideFAQ {
  question: string;
  answer: string;
}

export interface GrowGuideSection {
  heading: string;
  body: string; // paragraphs separated by \n\n
}

export interface GrowGuide {
  slug: string;
  title: string;
  h1: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  publishedDate: string;
  modifiedDate: string;
  intro: string;
  sections: GrowGuideSection[];
  faqs: GrowGuideFAQ[];
  relatedSlugs: string[];
}

export const growGuides: GrowGuide[] = [
  {
    slug: 'cannabis-nutrient-deficiency-guide',
    title: 'Cannabis Nutrient Deficiency Guide',
    h1: 'Cannabis Nutrient Deficiency Guide: Identify and Fix Every Problem',
    shortDescription:
      'Learn to identify and fix the most common cannabis nutrient deficiencies, including nitrogen, calcium, magnesium, and more, with step-by-step treatment plans.',
    metaTitle: 'Cannabis Nutrient Deficiency Guide | MasterGrowbot AI',
    metaDescription:
      'Identify and fix cannabis nutrient deficiencies fast. Covers nitrogen, phosphorus, potassium, calcium, magnesium, iron, and more. Download MasterGrowbot AI for instant photo diagnosis.',
    publishedDate: '2026-03-28',
    modifiedDate: '2026-03-28',
    intro: `Nutrient deficiencies are the number one reason cannabis growers lose yield, potency, and profit. A nitrogen deficiency can stall a plant's vegetative growth for two weeks before most growers even recognize what they are looking at. A calcium problem during late flower can cost you bud density on the entire canopy. And a misdiagnosed phosphorus issue, where a grower adds more phosphorus to a plant that is already locked out by low pH, can push a salvageable crop into unrecoverable decline.

The frustrating reality is that cannabis shows its problems through its leaves, and most symptoms look deceptively similar to each other. Yellowing can mean nitrogen deficiency, magnesium deficiency, iron lockout, or simple overwatering. Brown leaf edges could be potassium, calcium, nutrient burn, or windburn. Getting the diagnosis wrong and applying the wrong fix is often more damaging than doing nothing at all.

This guide covers every major cannabis nutrient deficiency: what it looks like, what causes it, and exactly how to fix it. Better yet, download MasterGrowbot AI and use the plant scan feature the next time you spot something wrong. Photograph the affected leaf and the AI identifies the specific issue in seconds, with a step-by-step treatment plan built around your grow setup. Start your free 3-day trial on iOS or Android.

Whether you are in week two of veg or approaching the harvest window, the faster you identify a nutrient problem, the faster your plant recovers. Let's get into it.`,
    sections: [
      {
        heading: 'Understanding Cannabis Nutrients: The Foundation',
        body: `Cannabis needs three primary macronutrients: nitrogen (N), phosphorus (P), and potassium (K). These are the numbers on every nutrient bottle (the NPK ratio) and they form the backbone of your feeding program. Beyond NPK, cannabis also requires secondary macronutrients including calcium (Ca), magnesium (Mg), and sulfur (S), plus a range of micronutrients: iron (Fe), zinc (Zn), manganese (Mn), copper (Cu), boron (B), and molybdenum (Mo).

One of the most important concepts in cannabis nutrition is nutrient mobility. Mobile nutrients (nitrogen, phosphorus, potassium, magnesium) can move from older tissue to newer growth when the plant runs short. This means deficiency symptoms in mobile nutrients always show up on older, lower leaves first. Immobile nutrients (calcium, iron, zinc, manganese) cannot move once they are deposited. Deficiency symptoms in immobile nutrients show up on new growth first.

Understanding mobility tells you immediately where to look when diagnosing a problem. Yellow lower leaves point to mobile nutrient issues. Pale or distorted new growth points to immobile nutrient issues.

The second concept every grower must understand is pH lockout. Most nutrient deficiencies in well-fed plants are not caused by a lack of nutrients in the feed solution. They are caused by the root zone pH drifting outside the range where specific nutrients remain soluble. When pH is off, nutrients are present but chemically unavailable. Adding more nutrients to a pH-locked plant makes the underlying problem worse by increasing salt buildup. Fix the pH first, every time.`,
      },
      {
        heading: 'Nitrogen Deficiency: The Most Common Cannabis Problem',
        body: `Nitrogen is the engine of vegetative growth. It is a core component of chlorophyll, amino acids, and proteins, and cannabis demands more of it during veg than any other nutrient. Because nitrogen is mobile, any shortage is quickly drawn from the lower, older fan leaves and redirected to the growing tips.

Symptoms: The telltale sign of nitrogen deficiency is progressive yellowing that starts on the tips and inner areas of lower fan leaves, then spreads across the whole leaf. The yellowing is uniform and pale, without spots or patterns. Affected leaves eventually turn fully yellow, then light brown before dropping. The plant may also look generally smaller and slower-growing than expected, with a lighter overall green color across the canopy.

Causes: Underfeeding is the obvious cause, but pH lockout is equally common. Nitrogen becomes poorly available below pH 6.0 in soil. Overwatering is another major contributor because waterlogged roots cannot absorb nutrients efficiently. Switching to a low-nitrogen bloom formula too early, before the stretch phase is complete in early flower, is a common cause of N deficiency in mid-veg.

How to fix it: First, check your root zone pH and bring it into the correct range (6.2-6.8 in soil, 5.8-6.2 in coco or hydro). If pH is in range, increase your nitrogen feed gradually. In soil, flush with pH-correct water and then reintroduce a nitrogen-rich vegetative nutrient at half strength, increasing over 3-5 days. In hydro or coco, adjust your nutrient ratio to raise the N level. New growth should begin to show improvement within 3-5 days. Existing damaged leaves will not recover and can be removed once new growth looks healthy.

Prevention: Feed a complete vegetative nutrient throughout the veg phase and the first two to three weeks of flower. Monitor runoff pH at every watering. If you are growing in coco, check that your base nutrient includes adequate nitrogen for the current growth stage.`,
      },
      {
        heading: 'Phosphorus Deficiency: Dark Leaves and Slow Buds',
        body: `Phosphorus is critical during two phases: early root development and the flowering stage, where it drives bud formation, terpene production, and resin density. A phosphorus deficiency during flower directly reduces yield and potency.

Symptoms: Phosphorus deficiency is recognizable by its unusual coloration. Older lower leaves develop a dark green or blue-green tint, sometimes showing purple or reddish-purple coloring on the undersides of leaves and along the stems. This is because phosphorus deficiency reduces chlorophyll degradation, causing pigment accumulation. As the deficiency worsens, the leaves develop brown or bronze spots and may curl downward. Growth slows noticeably, and bud sites may not develop as expected.

Note: Some strains develop natural purple coloration from temperature variation or genetics. The key distinction is whether the purpling is paired with leaf spotting, browning, and slowed growth. Genetic purpling is uniform and occurs without other symptoms.

Causes: Cold root zone temperatures (below 60 degrees Fahrenheit) significantly impair phosphorus uptake regardless of pH. pH below 5.5 or above 7.0 locks phosphorus out. Overwatering reduces phosphorus availability by limiting root function. High calcium or zinc levels in the nutrient solution can also compete with phosphorus uptake.

How to fix it: Raise root zone temperature if it is below 65 degrees. Check and correct pH. In soil, a top dressing with a phosphorus-rich bloom fertilizer can help, but results take 5-7 days to show. In hydro or coco, switch to a higher P:K ratio bloom formula and flush first to clear salt buildup. Bone meal and bat guano are common organic phosphorus sources for soil growers.

Prevention: Use a complete bloom nutrient from week one of flower. Keep root zone temperatures above 65 degrees. Avoid overwatering, which restricts the root's ability to uptake phosphorus efficiently.`,
      },
      {
        heading: 'Potassium Deficiency: Burnt Edges and Weak Structure',
        body: `Potassium regulates water movement through the plant, drives photosynthesis efficiency, and is essential for strong cell walls. Cannabis needs elevated potassium levels during the flowering stage, which is why quality bloom formulas carry a high K ratio.

Symptoms: Potassium deficiency shows as browning and scorching along the edges and tips of older leaves, progressing inward. The damage looks similar to nutrient burn, but with potassium deficiency the brown edges appear on otherwise healthy-looking leaves rather than the extreme tips of leaves that are dark green from overfeeding. Leaves may also curl upward at the edges. Stems can weaken, buds may develop slowly, and the plant overall looks stressed.

Causes: Underfeeding potassium is one cause, but pH lockout (above 7.0 in soil) is the most common reason. High sodium in your water source can block potassium uptake through competitive inhibition. Excess nitrogen also suppresses potassium absorption in some cases.

How to fix it: Check pH first. Flush the root zone with pH-correct water to clear salt buildup, then reintroduce a potassium-rich bloom formula. If your water source is high in sodium, use a reverse osmosis filter or dilute with distilled water. Results should be visible on new growth within 5-7 days.

Prevention: Use a quality bloom nutrient with a strong K component throughout flower. If your water is high in mineral content, test it and factor that into your nutrient calculations. Monitor leaf edges throughout flower, as potassium demand increases as buds develop.`,
      },
      {
        heading: 'Calcium and Magnesium Deficiency: The Cal-Mag Problem',
        body: `Calcium and magnesium deficiencies are the second most common issues cannabis growers face, so common that Cal-Mag supplements are a standard item in every serious nutrient program. They are especially prevalent in coco coir grows because coco naturally binds calcium and magnesium ions, stripping them from your nutrient solution before roots can reach them.

Calcium deficiency symptoms: Brown, crispy spots scattered across leaves, especially on newer growth, since calcium is immobile and cannot move from old tissue to new. The spots often have a slightly darker border and a dry, papery texture. Leaf tips and edges may look burned. During late flower, calcium issues show up as poor bud density, soft calyxes, and in severe cases, blossom-end rot on developing buds.

Magnesium deficiency symptoms: Interveinal chlorosis is the defining sign. The veins stay green while the tissue between them turns yellow. Because magnesium is mobile, symptoms start on older lower leaves and progress upward. Under HID or LED lighting, the yellow-between-green-veins pattern is very distinctive once you have seen it.

How to fix it: Add a quality Cal-Mag supplement at 2-5 ml per gallon, depending on your base nutrient program. Check your pH first, as both deficiencies are dramatically worsened by low pH (below 6.0 in soil, below 5.5 in coco). In coco, Cal-Mag should be part of your baseline feeding program from day one, not added only when symptoms appear. In RO water grows, calcium and magnesium must be supplemented because RO water removes them.

Prevention: If growing in coco or with RO water, add Cal-Mag from week one. If using tap water, test your calcium and magnesium levels to understand what your source water already provides before supplementing.`,
      },
      {
        heading: 'Iron, Zinc, and Manganese Deficiencies',
        body: `Micronutrient deficiencies are less common in properly managed grows, but when they appear they can look alarming and are often misdiagnosed as macronutrient problems.

Iron deficiency presents as bright yellow new growth with the veins remaining distinctly green. Because iron is immobile, it always shows on new leaves first. If your youngest growth is coming in pale yellow while older leaves look normal, iron is the most likely explanation. Do not confuse this with magnesium deficiency, which shows the same vein-green pattern but on older leaves, not new ones.

Zinc deficiency causes new leaves to emerge unusually small, narrow, pale, and with twisted or contorted tips. Affected growth often struggles to unfurl properly and may look stunted compared to surrounding healthy leaves. Internode spacing can become very short, giving an almost clustered appearance to new growth.

Manganese deficiency looks similar to magnesium and iron deficiency: interveinal chlorosis on newer leaves with yellow tissue between green veins. The distinction from iron deficiency is that manganese deficiency often shows a more gradual fade rather than an abrupt bright yellow, and symptoms may appear slightly lower on the plant as manganese has partial mobility.

The critical point for all three of these micronutrients: they are almost always caused by pH being too high. Iron locks out above 6.5 in soil and 6.0 in hydro. Zinc and manganese lock out above 7.0. Correcting your pH is the fix in the vast majority of cases. Flushing with pH-correct water and bringing your range back to target resolves iron, zinc, and manganese deficiencies faster than any supplement. If pH is already correct and deficiencies persist, use a complete micronutrient supplement at a low dose.`,
      },
      {
        heading: 'Nutrient Lockout: When Feeding Is Not the Problem',
        body: `Nutrient lockout is one of the most misunderstood and destructive problems in cannabis cultivation. It occurs when nutrients are present in your feed solution and in your substrate, but your plant cannot absorb them because the root zone conditions make them chemically unavailable. Growers who do not understand lockout keep adding more nutrients to a locked-out plant, increasing salt concentration and making the problem exponentially worse.

What causes lockout: pH drift is the primary cause. Each nutrient has a specific pH range in which it remains soluble and available to roots. When pH moves outside that range, the nutrient binds to substrate particles or precipitates out of solution. This is why cannabis growers are taught to monitor pH obsessively. It is not a paranoid habit. It directly determines whether your plant can access what you are feeding it.

Salt buildup is the second common cause. When nutrients accumulate in the substrate over many waterings without being flushed, the high salt concentration creates an osmotic imbalance that prevents roots from absorbing water and nutrients normally. The plant appears to be deficient across multiple nutrients simultaneously, which is a key diagnostic sign.

How to recognize lockout vs. true deficiency: If your plant is showing deficiency symptoms but you are feeding correctly and have been for several weeks, pH lockout or salt buildup is far more likely than an actual shortage of nutrients in your solution. Lockout tends to produce multiple nutrient symptoms at once (yellowing plus spots plus edge burn) rather than the single, specific pattern of a true single-nutrient deficiency.

How to fix it: Flush the root zone thoroughly with pH-correct water at 1.5-2 times your pot volume. For severe salt buildup, use a commercial flushing agent. After flushing, allow the substrate to dry slightly, then reintroduce nutrients at half strength, with pH dialed in precisely. The plant should begin responding within 5-7 days.

MasterGrowbot AI is particularly useful for distinguishing lockout from true deficiency. The AI has been trained on thousands of plant images and can identify the multi-symptom pattern of lockout versus the specific visual signature of individual nutrient deficiencies, helping you choose the right fix rather than making a guess that costs you another week of growth.`,
      },
      {
        heading: 'How to Diagnose Nutrient Deficiencies Accurately',
        body: `The core challenge with nutrient deficiency diagnosis is that multiple deficiencies, environmental problems, and pests can all produce overlapping symptoms. Nitrogen deficiency looks like heat stress. Iron deficiency looks like magnesium deficiency on first glance. Potassium deficiency looks like nutrient burn. Overwatering mimics almost every deficiency by preventing nutrient uptake across the board.

A reliable diagnostic process: Start by ruling out environmental causes. Check temperature, humidity, VPD, and light distance. Then check your root zone pH, as this is the most likely cause of any apparent deficiency in a well-fed plant. Check for overwatering by lifting the pot or observing how long the substrate takes to dry. Only after ruling out environmental and pH causes should you consider adjusting your nutrient program.

Next, use the mobile vs. immobile concept to narrow the suspect list. Old leaves first means mobile nutrient shortage (nitrogen, phosphorus, potassium, magnesium). New leaves first means immobile nutrient shortage or lockout (calcium, iron, zinc, manganese).

MasterGrowbot AI eliminates most of this guesswork. Photograph the affected leaf with good lighting and the AI cross-references the visual pattern against its plant health database, identifying whether you are looking at a true deficiency, lockout, environmental stress, or pest damage. It then delivers a specific, actionable treatment plan. Download MasterGrowbot AI free and use the plant scan feature before you change anything in your nutrient program. Diagnosing wrong and fixing wrong is worse than a slow, careful approach.

For more in-depth help and additional cannabis growing guides, visit the MasterGrowbot AI grow guides hub, where we cover everything from pest identification to harvest timing.`,
      },
      {
        heading: 'Preventing Nutrient Deficiencies: A Grower\'s Checklist',
        body: `Prevention is always faster and cheaper than treatment. The following habits, applied consistently, will eliminate the vast majority of nutrient problems before they appear.

Monitor pH at every watering, not just occasionally. Soil target: 6.2-6.8. Coco target: 5.8-6.2. Hydro/DWC target: 5.5-6.2. Use a reliable digital pH meter calibrated regularly. Strips and drops are not accurate enough for serious cultivation. Track your runoff pH to catch substrate drift before it becomes a crisis.

Do not overfeed. More nutrient problems are caused by excess salts, overly high EC, and nutrient interactions from overfeeding than by actual deficiency. Follow a proven feeding schedule, increase doses slowly, and always watch your plants' response before pushing higher.

Maintain proper root zone temperature. Roots below 60 degrees Fahrenheit struggle to absorb phosphorus, calcium, and other nutrients regardless of pH. Roots above 75 degrees in hydro accelerate pathogen growth and reduce dissolved oxygen.

Flush periodically to clear salt accumulation. In coco and hydro, a periodic light flush prevents the buildup that causes lockout. In soil, flushing is less frequent but still valuable every 4-6 weeks in longer grows.

Use MasterGrowbot AI's daily task system to stay on top of your watering schedule, feeding rotation, and plant check-ins. Consistent monitoring is the foundation of healthy plants. The growers who catch problems earliest are the ones who are looking at their plants every day with a clear system to track what they see.

The more you understand what healthy cannabis looks like at each stage, the faster you will recognize when something is wrong. That awareness, combined with accurate AI diagnosis, is what separates growers who save their harvests from growers who wonder what went wrong.`,
      },
    ],
    faqs: [
      {
        question: 'What is the most common cannabis nutrient deficiency?',
        answer:
          'Nitrogen deficiency is the most common cannabis nutrient deficiency, especially during the vegetative stage. It causes older leaves to turn pale yellow-green from the tips inward and progressively moves upward through the plant. It is most often caused by underfeeding or pH lockout rather than a genuine shortage of nitrogen in the feed solution.',
      },
      {
        question: 'How do I fix nutrient deficiencies in cannabis?',
        answer:
          'Start by checking and correcting your root zone pH, as most deficiencies are caused by pH lockout rather than missing nutrients. For soil, target 6.2-6.8; for coco and hydro, target 5.5-6.2. Once pH is correct, flush if salt buildup is suspected, then adjust your nutrient program to address the specific deficiency. Use MasterGrowbot AI to photograph your plant for an accurate diagnosis and a personalized treatment plan.',
      },
      {
        question: 'What does calcium deficiency look like in cannabis?',
        answer:
          'Calcium deficiency shows as brown, crispy spots scattered across leaves, especially on newer growth. Leaf tips and edges may look burned or scorched. Because calcium is immobile, symptoms always appear on new growth first rather than on older fan leaves. During flower, calcium deficiency reduces bud density and can cause soft or poorly formed calyxes.',
      },
      {
        question: 'What is nutrient lockout in cannabis?',
        answer:
          'Nutrient lockout happens when nutrients are present in your feed solution but your plant cannot absorb them because the root zone pH is outside the correct range, or because high salt concentration has disrupted normal root function. The fix is to flush with pH-correct water and reintroduce nutrients at half strength after correcting pH. Adding more nutrients to a locked-out plant makes the problem worse.',
      },
      {
        question: 'Can MasterGrowbot AI diagnose nutrient deficiencies?',
        answer:
          'Yes. MasterGrowbot AI includes a plant scan feature: take a photo of any affected leaf and the app identifies the specific deficiency, disease, or pest issue in seconds, along with a step-by-step treatment plan. It can also distinguish nutrient lockout from true deficiency, which prevents the common mistake of adding more nutrients to a plant that cannot absorb what it already has. Available free for 3 days on iOS and Android.',
      },
    ],
    relatedSlugs: [],
  },
];

export function getGuideBySlug(slug: string): GrowGuide | undefined {
  return growGuides.find((g) => g.slug === slug);
}
