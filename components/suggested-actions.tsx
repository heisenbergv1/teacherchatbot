"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";
import type { VisibilityType } from "./visibility-selector";
import { cn } from "@/lib/utils";
import classNames from "classnames";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
};

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  const suggestedActions = [
    // Math
    "Show me how to find the area of a triangle",
    // English
    "Give me tips to improve my essay introduction",
    // Science
    "Explain how photosynthesis works in simple terms",
    // Araling Panlipunan (AP)
    "Tell me about the Philippine Revolution in 3 sentences",
  ];

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={suggestedAction}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className={cn(
              "group w-full h-auto whitespace-normal p-3 rounded-lg font-medium " +
              "bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 " +
              "hover:from-teal-400 hover:via-green-400 hover:to-yellow-300 " +
              "shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer",
              classNames
            )}
            onClick={(suggestion) => {
              window.history.pushState({}, "", `/chat/${chatId}`);
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestion }],
              });
            }}
            suggestion={suggestedAction}
          >
            <span className="font-medium text-white dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {suggestedAction}
            </span>
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }

    return true;
  }
);
