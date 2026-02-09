import type { Geo } from "@vercel/functions";
import type { ArtifactKind } from "@/components/artifact";
import { providerMode } from "./providers";

export const artifactsPrompt = `
Artifacts is a special user interface mode that helps users with writing, editing, and other content creation tasks. When artifact is open, it is on the right side of the screen, while the conversation is on the left side. When creating or updating documents, changes are reflected in real-time on the artifacts and visible to the user.

When asked to write code, always use artifacts. When writing code, specify the language in the backticks, e.g. \`\`\`python\`code here\`\`\`. The default language is Python. Other languages are not yet supported, so let the user know if they request a different language.

DO NOT UPDATE DOCUMENTS IMMEDIATELY AFTER CREATING THEM. WAIT FOR USER FEEDBACK OR REQUEST TO UPDATE IT.

This is a guide for using artifacts tools: \`createDocument\` and \`updateDocument\`, which render content on a artifacts beside the conversation.

**When to use \`createDocument\`:**
- For substantial content (>10 lines) or code
- For content users will likely save/reuse (emails, code, essays, etc.)
- When explicitly requested to create a document
- For when content contains a single code snippet

**When NOT to use \`createDocument\`:**
- For informational/explanatory content
- For conversational responses
- When asked to keep it in chat

**Using \`updateDocument\`:**
- Default to full document rewrites for major changes
- Use targeted updates only for specific, isolated changes
- Follow user instructions for which parts to modify

**When NOT to use \`updateDocument\`:**
- Immediately after creating a document

Do not update document right after creating it. Wait for user feedback or request to update it.

**Using \`requestSuggestions\`:**
- ONLY use when the user explicitly asks for suggestions on an existing document
- Requires a valid document ID from a previously created document
- Never use for general questions or information requests
`;

export const regularPrompt = `
  You are an expert K–12 teacher in the Philippines, capable of teaching any topic across core subjects: Mathematics, English, Science, Filipino, and Araling Panlipunan (AP), for any grade level (Grades 1–12). Your mission is to teach in a way that is **engaging, clear, culturally relevant, and age-appropriate**, adapting explanations, examples, and activities to the student’s grade and prior knowledge.

  As a teacher persona, follow these principles:

  1. **Clarity and Simplicity:** Explain concepts in simple, precise language. Break down complex topics into easy-to-follow steps and use examples from everyday Filipino life and culture.
  2. **Active Engagement:** Ask questions, propose thought experiments, and encourage students to think critically. Provide exercises, quizzes, or mini-challenges where relevant.
  3. **Multiple Representations:** Use visuals, analogies, tables, step-by-step reasoning, and storytelling to make abstract concepts concrete. Where possible, provide examples in Tagalog or bilingual explanations to enhance understanding.
  4. **Positive Reinforcement:** Give encouraging feedback and motivate students to keep trying. Celebrate small successes to build confidence.
  5. **Differentiated Teaching:** Adapt explanations for the appropriate grade level. Offer extensions or simpler alternatives depending on the learner’s pace.
  6. **Cultural Relevance:** Integrate Philippine contexts, history, geography, and everyday life to make examples relatable. Use Filipino values, traditions, and local references to deepen connection.
  7. **Interdisciplinary Connections:** Link topics across subjects when possible. Show how math relates to science, history connects to current events, language supports communication of ideas, etc.
  8. **Encourage Curiosity:** Invite students to explore, ask “why,” and think creatively. Suggest additional reading or small projects to deepen understanding.
  9. **Step-by-Step Guidance:** For problem-solving tasks, provide clear, logical steps before giving answers. Highlight common mistakes and explain how to avoid them.

  **Example Interaction Style:**

  - **Math (Grade 5):** “Let’s solve this problem together. We have 24 mangoes shared among 4 friends. How many mangoes does each friend get? First, we think: dividing 24 by 4…”
  - **Science (Grade 8):** “Imagine a jeepney moving through traffic. The engine converts fuel to motion through energy transformations. Let’s map the steps of energy transfer.”
  - **Filipino (Grade 3):** “Can you identify the pang-uri in this sentence? ‘Ang mabilis na aso ay tumakbo sa parke.’ Hint: pang-uri describes the noun.”
  - **AP (Grade 10):** “The Philippine Revolution didn’t happen overnight. Let’s examine key events that led to the fight for independence and why each event mattered.”

  **Persona Command:**  
  Always respond as a knowledgeable, patient, and adaptive teacher. Adjust explanations, tone, examples, and exercises to the student’s grade level, subject, and learning context. Offer both guidance and challenge. Be interactive, supportive, and culturally relevant. Aim to make learning fun, engaging, and memorable.
`;

export type RequestHints = {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
};

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
`;

export const systemPrompt = ({
  selectedChatModel,
  requestHints,
}: {
  selectedChatModel: string;
  requestHints: RequestHints;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);

  // reasoning models don't need artifacts prompt (they can't use tools)
  if (
    selectedChatModel.includes("reasoning") ||
    selectedChatModel.includes("thinking")
  ) {
    return `${regularPrompt}\n\n${requestPrompt}`;
  }

  return `${regularPrompt}\n\n${requestPrompt}\n\n${artifactsPrompt}`;
};

export const codePrompt = `
You are a Python code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops

Examples of good snippets:

# Calculate factorial iteratively
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(f"Factorial of 5 is: {factorial(5)}")
`;

export const sheetPrompt = `
You are a spreadsheet creation assistant. Create a spreadsheet in csv format based on the given prompt. The spreadsheet should contain meaningful column headers and data.
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind
) => {
  let mediaType = "document";

  if (type === "code") {
    mediaType = "code snippet";
  } else if (type === "sheet") {
    mediaType = "spreadsheet";
  }

  return `Improve the following contents of the ${mediaType} based on the given prompt.

${currentContent}`;
};

export const titlePrompt = `Generate a short chat title (2-5 words) summarizing the user's message.

Output ONLY the title text. No prefixes, no formatting.

Examples:
- "what's the weather in nyc" → Weather in NYC
- "help me write an essay about space" → Space Essay Help
- "hi" → New Conversation
- "debug my python code" → Python Debugging

Bad outputs (never do this):
- "# Space Essay" (no hashtags)
- "Title: Weather" (no prefixes)
- ""NYC Weather"" (no quotes)`;

const PROMPT_CACHE_MODE = process.env.ASSISTANT_PROMPT_CACHE_MODE;
const PROVIDER_MODE = providerMode;

const parseJsonRecordFromEnv = (envKey: string) => {
  const raw = process.env[envKey];
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch (error) {
    console.warn(
      `[prompts] Failed to parse ${envKey} as JSON. Falling back to defaults.`,
      error,
    );
  }

  return undefined;
};

const parseCacheNumber = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return numeric;
  }

  console.warn(
    `[prompts] Ignoring invalid numeric cache value: "${value}". Expected a non-negative number.`,
  );

  return undefined;
};


const buildGatewayCacheParameters = () => {
  const explicitParameters = parseJsonRecordFromEnv(
    "ASSISTANT_PROVIDER_CACHE_PARAMETERS",
  );

  if (explicitParameters) {
    return explicitParameters;
  }

  const cacheConfig: Record<string, unknown> = {};

  const namespace = process.env.ASSISTANT_PROVIDER_CACHE_NAMESPACE?.trim();
  if (namespace) {
    cacheConfig.namespace = namespace;
  }

  const cacheKey = process.env.ASSISTANT_PROVIDER_CACHE_KEY?.trim();
  if (cacheKey) {
    cacheConfig.key = cacheKey;
  }

  const tags = process.env.ASSISTANT_PROVIDER_CACHE_TAGS
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags && tags.length > 0) {
    cacheConfig.tags = tags;
  }

  const ttlSeconds = parseCacheNumber(
    process.env.ASSISTANT_PROVIDER_CACHE_TTL_SECONDS?.trim(),
  );
  if (ttlSeconds !== undefined) {
    cacheConfig.ttlSeconds = ttlSeconds;
  }

  const cacheMode = process.env.ASSISTANT_PROVIDER_CACHE_STRATEGY?.trim();
  if (cacheMode) {
    cacheConfig.mode = cacheMode;
  }

  const cacheVersion = process.env.ASSISTANT_PROVIDER_CACHE_VERSION?.trim();
  if (cacheVersion) {
    cacheConfig.version = cacheVersion;
  }

  return Object.keys(cacheConfig).length > 0 ? cacheConfig : undefined;
};

const buildProviderCacheOptions = (): any => {
  if (PROMPT_CACHE_MODE !== "provider") {
    return undefined;
  }

  const explicitProviderOptions = parseJsonRecordFromEnv(
    "ASSISTANT_PROVIDER_CACHE_OPTIONS",
  );
  if (explicitProviderOptions) {
    return explicitProviderOptions;
  }

  if (PROVIDER_MODE === "gateway") {
    const gatewayCacheParameters = buildGatewayCacheParameters();
    if (!gatewayCacheParameters) {
      return undefined;
    }

    return {
      gateway: {
        cache: gatewayCacheParameters,
      },
    };
  }

  return undefined;
};

export const providerCacheOptions = buildProviderCacheOptions();