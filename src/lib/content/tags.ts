// The fixed tag vocabulary for digest issues (CONTRACT, pinned conventions).
// To add a tag: add it here, add a label below, and mention it in your pull request.

export const DIGEST_TAGS = [
  "hardware",
  "algorithms",
  "error-correction",
  "industry",
  "india",
  "policy",
  "education",
  "research",
] as const;

export type DigestTag = (typeof DIGEST_TAGS)[number];

export const TAG_LABELS: Record<DigestTag, string> = {
  hardware: "Hardware",
  algorithms: "Algorithms",
  "error-correction": "Error correction",
  industry: "Industry",
  india: "India",
  policy: "Policy",
  education: "Education",
  research: "Research",
};
