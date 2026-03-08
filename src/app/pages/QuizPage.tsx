import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { quizQuestions, calculateQuizResults } from '../data/quizData';
import { candidates } from '../data/mockData';
import { CheckCircle2, Brain, ArrowRight, Award, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const categoryIcons = {
  academic: '📚',
  facilities: '🏛️',
  social: '👥',
  environmental: '🌱',
  financial: '💰'
};

const categoryColors = {
  academic: 'bg-purple-100 text-purple-800 border-purple-300',
  facilities: 'bg-blue-100 text-blue-800 border-blue-300',
  social: 'bg-pink-100 text-pink-800 border-pink-300',
  environmental: 'bg-green-100 text-green-800 border-green-300',
  financial: 'bg-orange-100 text-orange-800 border-orange-300'
};

export function QuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = { ...answers, [question.id]: selectedOption };
      setAnswers(newAnswers);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        const quizResults = calculateQuizResults(newAnswers);
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[quizQuestions[currentQuestion - 1].id] ?? null);
    }
  };

  const results = showResults ? calculateQuizResults(answers) : [];
  const topMatches = results.slice(0, 3);

  if (showResults) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Award className="text-primary" size={40} />
              </div>
              <h1 className="text-4xl font-bold mb-4">Your Top Candidate Matches!</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Based on your responses, here are the candidates whose platforms align most closely with your priorities.
              </p>
            </div>

            {/* Top Matches */}
            <div className="space-y-6 mb-12">
              {topMatches.map((result, index) => {
                const candidate = candidates.find(c => c.id === result.candidateId);
                if (!candidate) return null;

                return (
                  <Card key={candidate.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Rank Badge */}
                      <div className="absolute top-4 left-4 md:relative md:top-0 md:left-0 md:flex md:items-start">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          'bg-orange-300 text-orange-900'
                        }`}>
                          #{index + 1}
                        </div>
                      </div>

                      {/* Candidate Image */}
                      <div className="w-full md:w-32 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0 mt-12 md:mt-0">
                        <ImageWithFallback
                          src={candidate.photo}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="text-2xl font-bold mb-1">{candidate.name}</h2>
                            <p className="text-primary font-medium">{candidate.position}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="text-green-600" size={20} />
                              <span className="text-3xl font-bold text-green-600">{result.matchPercentage}%</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Match</p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 italic">"{candidate.agenda}"</p>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => navigate(`/candidates/${candidate.id}`)}
                            variant="primary"
                          >
                            View Full Profile
                          </Button>
                          <Button
                            onClick={() => navigate('/vote')}
                            variant="outline"
                          >
                            Vote Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* All Candidates */}
            {results.length > 3 && (
              <Card>
                <h3 className="mb-4">Other Candidates</h3>
                <div className="space-y-3">
                  {results.slice(3).map(result => {
                    const candidate = candidates.find(c => c.id === result.candidateId);
                    if (!candidate) return null;

                    return (
                      <div key={candidate.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-muted-foreground">{result.matchPercentage}%</span>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/candidates/${candidate.id}`)}
                            className="text-sm py-2 px-4"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                Retake Quiz
              </Button>
              <Button onClick={() => navigate('/candidates')} variant="primary">
                Browse All Candidates
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Brain className="text-primary" size={32} />
            </div>
            <h1 className="mb-2">Find Right Candidate</h1>
            <p className="text-muted-foreground">
              Answer a few questions to discover which candidates align with your priorities
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-3 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm border mb-4 ${categoryColors[question.category]}`}>
                {categoryIcons[question.category]} {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
              </span>
              <h2 className="text-2xl">{question.question}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`relative group overflow-hidden border-2 rounded-xl text-left transition-all h-64 ${
                    selectedOption === index
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={option.image}
                      alt={option.text}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${
                      selectedOption === index ? 'opacity-90' : 'opacity-80 group-hover:opacity-90'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedOption === index
                          ? 'border-primary bg-primary'
                          : 'border-white/50 bg-black/20 group-hover:border-primary/50'
                      }`}>
                        {selectedOption === index && (
                          <CheckCircle2 className="text-primary-foreground" size={14} />
                        )}
                      </div>
                      <span className={`text-lg font-semibold leading-tight ${
                        selectedOption === index ? 'text-white' : 'text-white/90'
                      }`}>
                        {option.text}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="flex items-center gap-2"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next Question'}
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}