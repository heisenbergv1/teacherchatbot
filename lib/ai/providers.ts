import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import { createAnthropic } from '@ai-sdk/anthropic';

const THINKING_SUFFIX_REGEX = /-thinking$/;

type ProviderMode = "gateway" | "anthropic";

const desiredProviderMode =
  process.env.ASSISTANT_PROVIDER?.toLowerCase() === "anthropic"
    ? "anthropic"
    : "gateway";

const createAnthropicProvider = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const chatModelId = process.env.ASSISTANT_ANTHROPIC_CHAT_MODEL?.trim() ?? "claude-3-5-sonnet-latest";
  const reasoningModelId = process.env.ASSISTANT_ANTHROPIC_REASONING_MODEL?.trim() ?? chatModelId;
  const titleModelId = process.env.ASSISTANT_ANTHROPIC_TITLE_MODEL?.trim() ?? "claude-3-5-haiku-latest";
  const artifactModelId = process.env.ASSISTANT_ANTHROPIC_ARTIFACT_MODEL?.trim() ?? titleModelId;

  if (!apiKey) {
    console.warn(
      "[providers] ANTHROPIC_API_KEY is not set. Falling back to the AI Gateway provider.",
    );
    return null;
  }

  const anthropic = createAnthropic({
    apiKey,
  });

  return customProvider({
    languageModels: {
      "chat-model": anthropic.languageModel(chatModelId),
      "chat-model-reasoning": wrapLanguageModel({
        model: anthropic.languageModel(reasoningModelId),
        middleware: extractReasoningMiddleware({ tagName: "thinking" }),
      }),
      "title-model": anthropic.languageModel(titleModelId),
      "artifact-model": anthropic.languageModel(artifactModelId),
    },
  });
};

const createGatewayProvider = () =>
  customProvider({
    languageModels: {
      "chat-model": gateway.languageModel("xai/grok-2-vision-1212"),
      "chat-model-reasoning": wrapLanguageModel({
        model: gateway.languageModel("xai/grok-3-mini"),
        middleware: extractReasoningMiddleware({ tagName: "think" }),
      }),
      "title-model": gateway.languageModel("xai/grok-2-1212"),
      "artifact-model": gateway.languageModel("xai/grok-2-1212"),
    },
  });

const resolveProvider = () => {
  if (isTestEnvironment) {
    const {
      artifactModel,
      chatModel,
      reasoningModel,
      titleModel,
    } = require("./models.mock");
    return {
      provider: customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      }),
      mode: "gateway" as ProviderMode,
    };
  }

  if (desiredProviderMode === "anthropic") {
    const anthropicProvider = createAnthropicProvider();
    if (anthropicProvider) {
      return { provider: anthropicProvider, mode: "anthropic" as ProviderMode };
    }
  }

  return { provider: createGatewayProvider(), mode: "gateway" as ProviderMode };
};

const { provider: resolvedProvider, mode: resolvedMode } = resolveProvider();
export const providerMode: ProviderMode = resolvedMode;
export const myProvider = resolvedProvider;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  const isReasoningModel =
    modelId.includes("reasoning") || modelId.endsWith("-thinking");

  if (isReasoningModel) {
    const gatewayModelId = modelId.replace(THINKING_SUFFIX_REGEX, "");

    return wrapLanguageModel({
      model: gateway.languageModel(gatewayModelId),
      middleware: extractReasoningMiddleware({ tagName: "thinking" }),
    });
  }

  return myProvider.languageModel('chat-model');
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return myProvider.languageModel("title-model");
}

export function getArtifactModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("artifact-model");
  }
  return myProvider.languageModel("artifact-model");
}
