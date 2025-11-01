/**
 * Interview State Management
 * Zustand store for interview flow state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { InterviewQuestion, InterviewAnswer, InterviewState } from "@/types/interview";
import { partnerMatchingQuestions as interviewQuestions } from "@/data/questions-partner-matching";

// Version for cache busting (increment when questions change)
const STORAGE_VERSION = 5; // v5: Revised questions to focus on user's own traits (not ideal partner), enhanced with more life details

interface InterviewStore extends InterviewState {
  // Actions
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  answerQuestion: (questionId: string, answer: string | string[]) => void;
  startInterview: () => void;
  completeInterview: () => void;
  resetInterview: () => void;
  
  // Computed
  isFirstQuestion: () => boolean;
  isLastQuestion: () => boolean;
  getProgress: () => number;
  canProceed: () => boolean;
  getCurrentQuestion: () => InterviewQuestion | undefined;
  getAnswerForQuestion: (questionId: string) => InterviewAnswer | undefined;
}

const initialState: InterviewState = {
  questions: interviewQuestions,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  completedAt: null,
};

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      // Always use fresh questions from source (never from cache)
      questions: interviewQuestions,

      // Set current question by index
      setCurrentQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      // Move to next question
      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      // Move to previous question
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      // Answer a question
      answerQuestion: (questionId: string, answer: string | string[]) => {
        const { answers } = get();
        const existingIndex = answers.findIndex((a: InterviewAnswer) => a.questionId === questionId);

        const newAnswer: InterviewAnswer = {
          questionId,
          answer,
          answeredAt: Date.now(),
        };

        if (existingIndex >= 0) {
          // Update existing answer
          const newAnswers = [...answers];
          newAnswers[existingIndex] = newAnswer;
          set({ answers: newAnswers });
        } else {
          // Add new answer
          set({ answers: [...answers, newAnswer] });
        }
      },

      // Start interview
      startInterview: () => {
        set({ startTime: Date.now(), currentQuestionIndex: 0 });
      },

      // Complete interview
      completeInterview: () => {
        set({ completedAt: Date.now() });
      },

      // Reset interview
      resetInterview: () => {
        set(initialState);
      },

      // Check if on first question
      isFirstQuestion: () => {
        return get().currentQuestionIndex === 0;
      },

      // Check if on last question
      isLastQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        return currentQuestionIndex === questions.length - 1;
      },

      // Get progress percentage (0-100)
      getProgress: () => {
        const { currentQuestionIndex, questions } = get();
        return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
      },

      // Check if can proceed to next question
      canProceed: () => {
        const { questions, currentQuestionIndex, answers } = get();
        const currentQuestion = questions[currentQuestionIndex];
        
        if (!currentQuestion || !currentQuestion.required) {
          return true;
        }

        const answer = answers.find((a: InterviewAnswer) => a.questionId === currentQuestion.id);
        
        if (!answer) {
          return false;
        }

        // Check if answer is valid
        if (Array.isArray(answer.answer)) {
          return answer.answer.length > 0;
        }

        return answer.answer.trim().length > 0;
      },

      // Get current question
      getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex];
      },

      // Get answer for specific question
      getAnswerForQuestion: (questionId: string) => {
        const { answers } = get();
        return answers.find((a: InterviewAnswer) => a.questionId === questionId);
      },
    }),
    {
      name: "echo-interview-storage",
      version: STORAGE_VERSION,
      // Only persist interview state, NOT questions (always load fresh from source)
      partialize: (state) => ({
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        startTime: state.startTime,
        completedAt: state.completedAt,
      } as Partial<InterviewStore>),
      // Clear old cache when version changes
      migrate: (persistedState: any, version: number) => {
        if (version < STORAGE_VERSION) {
          console.log(`Clearing old interview cache (v${version} -> v${STORAGE_VERSION})`);
          // Return partial state - persist middleware will merge with full state
          return {
            currentQuestionIndex: 0,
            answers: [],
            startTime: null,
            completedAt: null,
          };
        }
        return persistedState;
      },
    }
  )
);

