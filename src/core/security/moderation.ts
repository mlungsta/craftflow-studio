const blockedTerms = ["credit card dump", "malware", "ransomware", "exploit kit"];

export interface ModerationResult {
  status: "approved" | "blocked";
  reason?: string;
}

export function moderatePrompt(prompt: string): ModerationResult {
  const lower = prompt.toLowerCase();
  const hit = blockedTerms.find((term) => lower.includes(term));

  if (hit) {
    return { status: "blocked", reason: `Blocked term detected: ${hit}` };
  }

  return { status: "approved" };
}
