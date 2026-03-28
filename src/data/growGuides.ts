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
    h1: 'Cannabis Nutrient Deficiency Guide: Identify & Fix Every Problem',
    shortDescription:
      'Learn to identify and fix the most common cannabis nutrient deficiencies — nitrogen, calcium, magnesium, and more — with step-by-step treatment plans.',
    metaTitle: 'Cannabis Nutrient Deficiency Guide | MasterGrowbot AI',
    metaDescription:
      'Identify and fix cannabis nutrient deficiencies fast. Covers nitrogen, calcium, magnesium, iron, and more. Download MasterGrowbot AI for instant photo diagnosis.',
    publishedDate: '2026-03-28',
    modifiedDate: '2026-03-28',
    intro: `If you've been growing cannabis for more than a season, you already know the sinking feeling: leaves yellowing out of nowhere, brown spots spreading across your canopy, or new growth twisting and paling when it should be lush and green. Nine times out of ten, you're looking at a nutrient deficiency — and the difference between a quick fix and a ruined harvest comes down to how fast you identify the exact problem.

This guide breaks down every major cannabis nutrient deficiency, what each one looks like, and exactly how to correct it. Better yet, download MasterGrowbot AI free and skip the guesswork entirely — snap a photo of your plant and the AI identifies your specific deficiency in seconds, complete with a personalized treatment plan. Start your free 3-day trial on iOS or Android.

Ready to become the grower who never loses a harvest to something preventable? Let's get into it.`,
    sections: [
      {
        heading: 'Understanding Cannabis Nutrients: The Foundation',
        body: `Cannabis needs three primary macronutrients — nitrogen (N), phosphorus (P), and potassium (K) — plus secondary nutrients and micronutrients including calcium (Ca), magnesium (Mg), sulfur (S), iron (Fe), and zinc (Zn). A deficiency in any of these disrupts your plant's ability to photosynthesize, transport water, or build cell walls strong enough to support heavy buds.

The most important thing most growers miss: deficiency symptoms are often caused by pH lockout, not by actually running out of the nutrient. When your root zone pH drifts outside the optimal range (6.0–7.0 for soil, 5.5–6.5 for hydro/coco), nutrients bind to substrate particles and become unavailable to your plant — even if your reservoir is loaded with them. Always check and correct pH before adding more nutrients.`,
      },
      {
        heading: 'Nitrogen Deficiency: The Most Common Cannabis Problem',
        body: `Nitrogen deficiency is the single most common issue cannabis growers encounter, especially during the vegetative stage. Because nitrogen is a mobile nutrient, the plant redistributes it from older tissue to support new growth — so the first symptoms always appear on the lower, older fan leaves.

What it looks like: Older leaves turn pale yellow-green, starting from the tips and working inward. The yellowing progresses upward through the plant as the deficiency worsens. In severe cases, affected leaves drop off entirely, leaving bare lower branches.

What causes it: Underfeeding, pH lockout (especially below 6.0 in soil), overwatering (which suffocates roots and blocks uptake), or switching to a low-nitrogen bloom formula too early in early flower when the plant is still stretching and demanding heavy N.

How to fix it: In soil, flush with pH-correct water and then apply a nitrogen-rich vegetative nutrient at half-strength, working up to full dose. In hydro or coco, dial your pH to 5.8–6.2 and increase your nitrogen ratio. New growth should green up within 3–5 days — existing damaged leaves will not recover and can be removed once the plant stabilizes.`,
      },
      {
        heading: 'Calcium and Magnesium Deficiency (Cal-Mag)',
        body: `Calcium and magnesium deficiencies are the second most encountered problems — so common that Cal-Mag supplements are standard in every serious nutrient lineup. These deficiencies are especially prevalent in coco coir grows because coco naturally binds calcium and magnesium ions, pulling them out of your nutrient solution before roots can absorb them.

Calcium deficiency looks like: Brown, crispy spots scattered across leaves — especially on newer growth, since calcium is immobile and can't move from old tissue to new. Leaf tips and edges may look burned. In the flowering stage, calcium issues show up as poor bud development and soft spots on developing calyxes.

Magnesium deficiency looks like: Interveinal chlorosis — the veins stay green while the tissue between them turns yellow. Because magnesium is mobile, symptoms start on older, lower leaves and progress upward. Under certain lighting, the yellow-between-green-veins pattern is very distinctive once you've seen it once.

How to fix it: Add a quality Cal-Mag supplement (2–5 ml per gallon is the typical starting dose). Check your pH first — both deficiencies are dramatically worsened by low pH. If growing in coco, build Cal-Mag into your baseline feed from week one rather than waiting for symptoms.`,
      },
      {
        heading: 'Iron, Zinc, and Micronutrient Deficiencies',
        body: `Micronutrient deficiencies are less common but can look alarming when they appear. Iron deficiency presents as bright yellow new growth with the veins remaining green — it looks similar to magnesium deficiency but appears on new leaves (iron is immobile) rather than old ones. If your youngest leaves are coming in yellow while lower leaves look fine, iron is usually the culprit.

Zinc deficiency causes new leaves to emerge very small, pale, and with twisted or contorted tips. Affected growth often looks like it's struggling to unfurl properly. Sulfur deficiency — rare in well-fed plants — shows as pale, uniform yellowing of newer growth that gradually spreads downward.

The most important point: iron, zinc, and most micronutrient deficiencies are almost always caused by pH being too high (above 7.0 in soil, 6.5 in hydro). These elements lock out fast when pH climbs. Before adding any micronutrient supplement, flush with pH-corrected water and bring your range back to target. Most of the time that's all it takes.`,
      },
      {
        heading: 'How to Diagnose Nutrient Deficiencies Accurately',
        body: `The challenge with nutrient deficiencies is that several look nearly identical — and many also mimic environmental problems like light burn, heat stress, root rot, or early pest damage. Nitrogen deficiency looks like heat stress. Iron deficiency looks like magnesium deficiency. Overwatering looks like underwatering. Misdiagnosis leads to adding nutrients to a pH-locked or suffocated plant, making things worse.

MasterGrowbot AI solves this problem. Take a photo of the affected leaf and the AI analyzes the visual symptoms against its training data to identify the specific issue — whether it's a true deficiency, lockout, environmental stress, or pest damage — and delivers a step-by-step treatment plan. No more guessing. No more wasted nutrients. No more dead plants from the wrong fix.

Download MasterGrowbot AI and use the plant scan feature the moment you spot something off. The earlier you catch a deficiency, the faster your plant recovers.`,
      },
      {
        heading: 'Preventing Nutrient Deficiencies: pH Management Is Everything',
        body: `The single most effective prevention strategy is consistent pH management. More deficiencies are caused by pH drift than by running out of any actual nutrient. Invest in a reliable digital pH meter — not drops or strips, which aren't accurate enough for serious cultivation — and monitor your root zone pH every watering.

Target ranges: soil 6.2–6.8, coco 5.8–6.2, hydro/DWC 5.5–6.2. If your runoff pH is drifting, correct it before adjusting your nutrient dose. A slow, steady pH drift can lock out multiple nutrients simultaneously and create a confusing, multi-symptom plant that's hard to diagnose.

Beyond pH: resist the urge to overfeed. More nutrient problems are caused by excess salts and overfeeding than by deficiency. Follow a proven feeding schedule, increase doses slowly, and let your plants' appearance guide you. A healthy cannabis plant in optimal conditions is easy to read — and MasterGrowbot AI makes it even easier.`,
      },
    ],
    faqs: [
      {
        question: 'What is the most common cannabis nutrient deficiency?',
        answer:
          'Nitrogen deficiency is the most common cannabis nutrient deficiency, especially during the vegetative stage. It causes older leaves to turn yellow-green from the tips inward and progresses upward through the plant. It is often caused by underfeeding or pH lockout rather than a true lack of nitrogen.',
      },
      {
        question: 'How do I fix nutrient deficiencies in cannabis?',
        answer:
          'First, check and correct your root zone pH — most deficiencies are caused by pH lockout rather than missing nutrients. For soil, target 6.2–6.8; for coco/hydro, target 5.5–6.2. Once pH is correct, adjust your nutrient feed to address the specific deficiency. Use MasterGrowbot AI to photograph your plant for an accurate diagnosis and treatment plan.',
      },
      {
        question: 'What does calcium deficiency look like in cannabis?',
        answer:
          'Calcium deficiency in cannabis shows as brown, crispy spots scattered across leaves, especially on newer growth. Leaf tips and edges may look burned. Since calcium is immobile, symptoms appear on new growth first rather than old leaves.',
      },
      {
        question: 'Can I use MasterGrowbot AI to diagnose nutrient deficiencies?',
        answer:
          'Yes. MasterGrowbot AI includes an AI-powered plant scan feature — take a photo of any affected leaf and the app identifies the specific deficiency, disease, or pest issue in seconds, along with a step-by-step treatment plan. Available free for 3 days on iOS and Android.',
      },
      {
        question: 'Why do cannabis plants get nutrient deficiencies even when I feed them?',
        answer:
          'The most common reason is pH lockout — when your root zone pH is outside the optimal range, nutrients are chemically bound to the substrate and unavailable to roots even if they are present in your feed solution. Always check pH before diagnosing a deficiency.',
      },
    ],
    relatedSlugs: [],
  },
];

export function getGuideBySlug(slug: string): GrowGuide | undefined {
  return growGuides.find((g) => g.slug === slug);
}
