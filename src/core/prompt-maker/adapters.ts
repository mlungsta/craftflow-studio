import type { CompiledPromptOutput, ToolTarget } from "@/core/prompt-maker/compiler";

interface AdapterDirectives {
  systemStyle: string;
  formatting: string[];
  guardrails: string[];
}

const directivesByTarget: Record<ToolTarget, AdapterDirectives> = {
  chatgpt: {
    systemStyle: "Use crisp executive language with explicit action steps.",
    formatting: [
      "Use markdown headings and bullet lists.",
      "Include concise checklists and decision tables where useful."
    ],
    guardrails: [
      "Do not add filler text.",
      "Do not invent user inputs not provided in input snapshot."
    ]
  },
  claude: {
    systemStyle: "Use structured analytical reasoning with transparent assumptions.",
    formatting: [
      "Use markdown with section summaries and rationale.",
      "Add brief risk notes for each major recommendation."
    ],
    guardrails: [
      "State assumptions explicitly.",
      "Keep recommendations operationally grounded."
    ]
  },
  gemini: {
    systemStyle: "Use concise multimodal-ready instruction style and modular outputs.",
    formatting: [
      "Use markdown sections and compact numbered plans.",
      "Keep each section independently reusable."
    ],
    guardrails: [
      "Avoid redundancy across sections.",
      "Keep output directly execution-focused."
    ]
  }
};

function listLines(title: string, items: string[]): string {
  const body = items.map((item) => `- ${item}`).join("\n");
  return `## ${title}\n${body}`;
}

export function applyToolTargetAdapter(compiled: CompiledPromptOutput): CompiledPromptOutput {
  const directives = directivesByTarget[compiled.toolTarget];

  const adapterBlock = [
    `## Model Adapter (${compiled.toolTarget})`,
    `Style Directive: ${directives.systemStyle}`,
    listLines("Formatting Rules", directives.formatting),
    listLines("Guardrails", directives.guardrails)
  ].join("\n\n");

  return {
    ...compiled,
    prompt: [compiled.prompt, adapterBlock].join("\n\n---\n\n")
  };
}
