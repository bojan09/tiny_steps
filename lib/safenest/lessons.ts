import type { TopicId } from "./model.ts";

export type SafetySource = {
  title: string;
  url: string;
  jurisdiction: string;
  sourceDate: string;
};
export type SafetyLesson = {
  avoid: string;
  safer: string;
  action: string;
  source: SafetySource;
};
export const safetySources = {
  nhs: {
    title: "NHS: Baby and toddler safety",
    url: "https://www.nhs.uk/baby/first-aid-and-safety/safety/baby-and-toddler-safety/",
    jurisdiction: "United Kingdom",
    sourceDate: "Reviewed 19 February 2026",
  },
  sleep: {
    title: "NHS: Reducing sleep-related risk",
    url: "https://www.nhs.uk/baby/caring-for-a-newborn/sudden-infant-death-syndrome-sids/",
    jurisdiction: "United Kingdom",
    sourceDate: "Reviewed 25 November 2025",
  },
  water: {
    title: "HSE: Water safety in the home",
    url: "https://www2.hse.ie/babies-children/child-safety/water-safety/water-safety-home/",
    jurisdiction: "Ireland",
    sourceDate: "Reviewed 24 June 2026",
  },
  furniture: {
    title: "CPSC: Anchor It!",
    url: "https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/AnchorItgov",
    jurisdiction: "United States",
    sourceDate: "Source review date not stated",
  },
  cords: {
    title: "UK OPSS: Blind cord safety",
    url: "https://www.gov.uk/guidance/child-safety-blind-cords",
    jurisdiction: "United Kingdom",
    sourceDate: "Updated 25 January 2024",
  },
  home: {
    title: "Canadian Paediatric Society: Home safety",
    url: "https://caringforkids.cps.ca/handouts/safety-and-injury-prevention/keep_your_young_child_safe",
    jurisdiction: "Canada",
    sourceDate: "Updated May 2023",
  },
} satisfies Record<string, SafetySource>;

// Educational comparisons only: no assessment of a household or certification.
// All source text retrieved and read 31 October 2026. See PHASE_5_REVIEW.md.
export const safetyLessons: Record<TopicId, SafetyLesson> = {
  "sleep-space": {
    avoid: "Pillows, soft toys or a nest inside the cot.",
    safer:
      "Place your baby on their back on a firm, flat mattress in a clear, separate cot in your room for at least the first 6 months.",
    action: "Share the clear-cot routine with every caregiver.",
    source: safetySources.sleep,
  },
  furniture: {
    avoid: "An unsecured dresser that a child can pull or climb on.",
    safer:
      "Anchor top-heavy furniture using the manufacturer’s instructions and appropriate anti-tip fittings.",
    action:
      "Locate the anchoring instructions; get installation help if needed.",
    source: safetySources.furniture,
  },
  "nursery-sharing": {
    avoid: "Stepping away while your baby is on a raised changing surface.",
    safer:
      "Use a changing mat on the floor rather than leaving a baby on a bed or changing table.",
    action: "Choose the changing place and gather supplies first.",
    source: safetySources.nhs,
  },
  "kitchen-storage": {
    avoid: "Cleaning products or medicines in a reachable cupboard.",
    safer:
      "Keep them out of sight and reach, in original containers, ideally in a locked cabinet away from food.",
    action: "Review where these products are stored.",
    source: safetySources.home,
  },
  "kitchen-heat": {
    avoid: "Carrying your baby while holding a hot drink.",
    safer:
      "Keep hot drinks beyond your child’s reach; do not hold or prepare them while holding your child.",
    action: "Choose a place for hot drinks away from edges.",
    source: safetySources.water,
  },
  "kitchen-sharing": {
    avoid: "Leaving a baby to eat without an adult beside them.",
    safer:
      "Stay with your child while they eat, seated; keep small objects and older children’s toy parts away.",
    action: "Agree who will stay beside your child at meals.",
    source: safetySources.nhs,
  },
  "bath-water": {
    avoid:
      "Leaving a baby in the bath to fetch something, even in a bath seat.",
    safer:
      "Stay throughout the bath. Prepare supplies first; take your child with you if you must leave. Drain the bath afterward.",
    action: "Put the towel and supplies within reach before starting.",
    source: safetySources.water,
  },
  "bath-storage": {
    avoid: "Medicines or cleaning supplies within a child’s reach.",
    safer:
      "Store them out of sight and reach in original containers, ideally locked away.",
    action: "Check bathroom storage and visitors’ bags.",
    source: safetySources.home,
  },
  "bath-sharing": {
    avoid: "Putting your baby into bath water before checking it.",
    safer:
      "Add cold water first, then hot, and check the temperature with your elbow before your baby gets in.",
    action: "Make the water check part of every caregiver’s routine.",
    source: safetySources.nhs,
  },
  "living-furniture": {
    avoid: "An unanchored television with tempting toys on top.",
    safer:
      "Secure the television and furniture as instructed; keep tempting objects off high surfaces.",
    action: "Read the TV and furniture anchoring instructions together.",
    source: safetySources.furniture,
  },
  "living-cords": {
    avoid: "Looped blind cords beside a cot or climbable furniture.",
    safer:
      "Keep furniture away from blinds and secure cords using properly fitted safety devices following their instructions.",
    action: "Check where a child could reach cords, including by climbing.",
    source: safetySources.cords,
  },
  "living-entry": {
    avoid: "An infant seat on a table or a stairway within crawling reach.",
    safer:
      "Keep infant seats off raised surfaces. Fit gates as instructed; pressure-mounted gates are not suitable at the top of stairs.",
    action: "Review stair access before your child becomes mobile.",
    source: safetySources.home,
  },
};
