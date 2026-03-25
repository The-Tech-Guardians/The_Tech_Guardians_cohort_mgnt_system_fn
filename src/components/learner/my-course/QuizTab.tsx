'use client';

import type { Assessment } from '@/types/assessment';
import type { AssessmentQuestion } from '@/services/assessmentService';

type QuizWithQuestions = {
  assessment: Assessment;
  questions: AssessmentQuestion[];
};

interface QuizTabProps {
  quizzes: Assessment[];
  quizDetails: QuizWithQuestions[];
}

export default function QuizTab({ quizzes, quizDetails }: QuizTabProps) {
  if (quizzes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Quiz</h2>
        <p className="text-gray-600">No quiz available for this module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Quizzes</h2>
      {quizzes.map((quiz) => {
        const details = quizDetails.find((item) => item.assessment.id === quiz.id);
        const questionCount = details?.questions.length || 0;

        return (
          <div key={quiz.id} className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{quiz.description || 'No description provided.'}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Quiz
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
              <span>Questions: {questionCount}</span>
              {quiz.passMark !== undefined && <span>Pass mark: {quiz.passMark}%</span>}
              {quiz.timeLimitMinutes !== undefined && <span>Time: {quiz.timeLimitMinutes} min</span>}
            </div>

            {details && details.questions.length > 0 && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">Preview Questions</h4>
                <div className="space-y-2">
                  {details.questions.map((question, index) => (
                    <div key={question.id} className="text-sm text-gray-700">
                      {index + 1}. {question.questionText}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
