import type { GenerationRequestInput, NormalizedGenerationResult } from "@/core/domain/generation";
import type { LlmProvider } from "@/core/providers/types";

function buildWebsiteMakerPackage(input: GenerationRequestInput): string {
  const ctx = input.inputContext ?? {};
  const storeName = String(ctx.store_name ?? "CraftFlow Store");
  const audience = String(ctx.audience ?? "General Audience");
  const productType = String(ctx.product_type ?? "Digital Product");
  const colorTheme = String(ctx.color_theme ?? "Blue");

  return JSON.stringify(
    {
      package_type: "shopify_storefront_mvp",
      store_profile: {
        store_name: storeName,
        audience,
        product_type: productType,
        color_theme: colorTheme
      },
      content_blocks: {
        hero: {
          headline: `${storeName}: Practical ${productType} for ${audience}`,
          subheadline: `Accelerate results with a focused ${productType} system tailored to ${audience}.`,
          cta_primary: "Get the Starter Pack",
          cta_secondary: "View Sample"
        },
        product_section: {
          title: "What You Get",
          bullets: [
            "Ready-to-use digital assets",
            "Step-by-step implementation guidance",
            "Update-ready templates"
          ]
        },
        faq: [
          { q: "Who is this for?", a: audience },
          { q: "How fast can I start?", a: "You can launch in under 24 hours with the starter templates." }
        ]
      },
      style_tokens: {
        palette: colorTheme,
        typography: "Geist Sans + Geist Mono",
        tone: "Professional, practical, conversion-focused"
      },
      image_prompt_pack: [
        `Hero banner for ${storeName}, ${colorTheme} accents, clean SaaS aesthetic`,
        `Product mockup for ${productType}, premium digital template presentation`,
        `Testimonial card visuals targeting ${audience}`
      ],
      setup_checklist: [
        "Create Shopify store and choose base theme",
        "Apply style tokens to brand settings",
        "Publish content blocks and FAQ",
        "Upload product assets and connect checkout",
        "Test mobile responsiveness and launch"
      ]
    },
    null,
    2
  );
}

export class OpenAiProvider implements LlmProvider {
  public async generate(input: GenerationRequestInput): Promise<NormalizedGenerationResult> {
    const outputText =
      input.requestType === "website_maker"
        ? buildWebsiteMakerPackage(input)
        : `Generated ${input.requestType} output for ${input.toolTarget ?? "chatgpt"}.\n\n${input.prompt.slice(0, 1200)}`;

    return {
      outputText,
      inputTokens: Math.ceil(input.prompt.length / 4),
      outputTokens: Math.ceil(outputText.length / 4),
      totalTokens: Math.ceil(input.prompt.length / 4) + Math.ceil(outputText.length / 4),
      latencyMs: 250,
      providerName: "openai",
      modelName: process.env.OPENAI_MODEL ?? "gpt-5.2",
      finishReason: "stop"
    };
  }
}
