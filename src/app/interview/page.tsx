/**
 * Interview Page
 * Soul Interview Flow - Main questionnaire page
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useInterviewStore } from "@/store/interview";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { ProgressBar } from "@/components/interview/ProgressBar";
import { NavigationButtons } from "@/components/interview/NavigationButtons";
import { fadeIn } from "@/lib/animations";

export default function InterviewPage() {
  const router = useRouter();
  
  const {
    currentQuestionIndex,
    questions,
    answers,
    startTime,
    startInterview,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    completeInterview,
    isFirstQuestion,
    isLastQuestion,
    getProgress,
    canProceed,
    getCurrentQuestion,
    getAnswerForQuestion,
  } = useInterviewStore();

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = currentQuestion ? getAnswerForQuestion(currentQuestion.id) : undefined;
  const progress = getProgress();
  
  // Debug: Log current question and questions array
  useEffect(() => {
    if (currentQuestion) {
      console.log('Current Question Index:', currentQuestionIndex);
      console.log('Current Question ID:', currentQuestion.id);
      console.log('Current Question:', currentQuestion.text);
      console.log('Total Questions in Store:', questions.length);
      console.log('First 3 Question IDs:', questions.slice(0, 3).map(q => q.id).join(', '));
    }
  }, [currentQuestionIndex, currentQuestion, questions]);

  // Add mounted state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Force clear corrupted storage on mount (one-time fix)
  useEffect(() => {
    const storageKey = "echo-interview-storage";
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if questions array is corrupted (all same ID)
        if (parsed.state?.questions) {
          const firstId = parsed.state.questions[0]?.id;
          const allSameId = parsed.state.questions.every((q: any) => q.id === firstId);
          if (allSameId && parsed.state.questions.length > 1) {
            console.warn("Detected corrupted questions cache, clearing...");
            localStorage.removeItem(storageKey);
            window.location.reload();
            return;
          }
        }
      } catch (e) {
        console.error("Error checking storage:", e);
      }
    }
  }, []);

  // Start interview on mount
  useEffect(() => {
    if (!startTime) {
      startInterview();
    }
  }, [startTime, startInterview]);

  // Handle answer change
  const handleAnswer = (answer: string | string[]) => {
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, answer);
    }
  };

  // Handle next button
  const handleNext = () => {
    if (isLastQuestion()) {
      // Complete interview and navigate to generation page
      completeInterview();
      router.push("/generate");
    } else {
      nextQuestion();
    }
  };

  // Handle back button
  const handleBack = () => {
    previousQuestion();
  };

  // Emergency reset function
  const handleEmergencyReset = () => {
    if (confirm("确定要重置访谈吗？所有进度将丢失。")) {
      localStorage.removeItem("echo-interview-storage");
      window.location.reload();
    }
  };

  // Prevent hydration mismatch
  if (!isMounted || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 py-6"
      >
        <div className="container mx-auto px-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              问题 {currentQuestionIndex + 1} / {questions.length} - ID: {currentQuestion.id}
            </div>
            <button
              onClick={handleEmergencyReset}
              className="text-xs text-red-500 hover:text-red-400 underline"
            >
              重置访谈
            </button>
          </div>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
            percentage={progress}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Question Card with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`question-${currentQuestionIndex}-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                answer={currentAnswer}
                onAnswer={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            canGoBack={!isFirstQuestion()}
            canGoNext={canProceed()}
            isLastQuestion={isLastQuestion()}
          />
        </div>
      </main>

      {/* Footer Hint */}
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="fixed bottom-0 left-0 right-0 p-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          请真诚回答，没有对错之分
        </p>
      </motion.footer>
    </div>
  );
}

