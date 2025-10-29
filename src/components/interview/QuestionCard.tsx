/**
 * QuestionCard Component
 * Displays a single interview question with appropriate input type
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InterviewQuestion, InterviewAnswer } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";

interface QuestionCardProps {
  question: InterviewQuestion;
  answer?: InterviewAnswer;
  onAnswer: (answer: string | string[]) => void;
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const [selectedValue, setSelectedValue] = useState<string | string[]>(() => {
    return answer?.answer || (question.inputType === "multiple-choice" ? [] : "");
  });

  useEffect(() => {
    setSelectedValue(answer?.answer || (question.inputType === "multiple-choice" ? [] : ""));
  }, [question.id, answer]);

  const handleSingleChoice = (value: string) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  const handleMultipleChoice = (value: string) => {
    const currentValues = selectedValue as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    setSelectedValue(newValues);
    onAnswer(newValues);
  };

  const handleTextInput = (value: string) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {question.text}
          </CardTitle>
          {question.description && (
            <CardDescription className="text-base text-muted-foreground">
              {question.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Single Choice */}
          {question.inputType === "single-choice" && question.options && (
            <div className="grid gap-3">
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedValue === option.value ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-4 px-6"
                  onClick={() => handleSingleChoice(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          {/* Multiple Choice */}
          {question.inputType === "multiple-choice" && question.options && (
            <div className="grid gap-3">
              {question.options.map((option) => {
                const isSelected = (selectedValue as string[]).includes(option.value);
                return (
                  <Button
                    key={option.id}
                    variant={isSelected ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => handleMultipleChoice(option.value)}
                  >
                    <span className="mr-2">{isSelected ? "✓" : "○"}</span>
                    {option.label}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Text Input */}
          {question.inputType === "text" && (
            <textarea
              className="w-full min-h-[120px] p-4 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder={question.placeholder || "请输入你的答案..."}
              value={selectedValue as string}
              onChange={(e) => handleTextInput(e.target.value)}
              maxLength={500}
            />
          )}

          {/* Scale Input (for future use) */}
          {question.inputType === "scale" && (
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={selectedValue as string || "5"}
                onChange={(e) => handleTextInput(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span className="text-lg font-bold text-foreground">{selectedValue || 5}</span>
                <span>10</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

