import { useNavigate } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import { Button } from '@/app/components/Button';
import { candidates, positions } from '@/app/data/mockData';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import type { QuizResult } from '@/app/data/quizData';

export function CandidatesPage() {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('quizResults');
      if (stored) {
        setQuizResults(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const getMatchInfo = (candidateId: string) => {
    const result = quizResults.find(r => r.candidateId === candidateId);
    return result ?? null;
  };

  const getBarColor = (pct: number) => {
    if (pct >= 70) return 'bg-emerald-500';
    if (pct >= 40) return 'bg-amber-400';
    return 'bg-slate-400';
  };

  const getLabelColor = (pct: number) => {
    if (pct >= 70) return 'text-emerald-600';
    if (pct >= 40) return 'text-amber-600';
    return 'text-slate-500';
  };

  const filteredCandidates = selectedPosition === 'all'
    ? candidates
    : candidates.filter(c => c.position === selectedPosition);

  const hasQuizResults = quizResults.length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Meet Your Candidates</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the vision and goals of the students running to represent you.
            </p>
          </div>

          {/* Quiz match banner */}
          {hasQuizResults ? (
            <div className="mb-8 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 max-w-xl mx-auto">
              <Sparkles size={18} className="text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 text-sm">
                Showing your quiz match scores. <button onClick={() => { localStorage.removeItem('quizResults'); setQuizResults([]); }} className="underline font-medium hover:text-emerald-600">Clear results</button> or <button onClick={() => navigate('/quiz')} className="underline font-medium hover:text-emerald-600">retake the quiz</button>.
              </p>
            </div>
          ) : (
            <div className="mb-8 flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 max-w-xl mx-auto">
              <Sparkles size={18} className="text-primary flex-shrink-0" />
              <p className="text-primary/80 text-sm">
                Want to see your match score?{' '}
                <button onClick={() => navigate('/quiz')} className="underline font-medium hover:text-primary">
                  Take the quiz
                </button>
                {' '}to find your best candidates.
              </p>
            </div>
          )}

          {/* Filter */}
          <div className="mb-10 flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedPosition('all')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                selectedPosition === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-white text-muted-foreground hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Positions
            </button>
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedPosition === position
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-white text-muted-foreground hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {position}
              </button>
            ))}
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCandidates.map((candidate) => {
              const match = getMatchInfo(candidate.id);
              return (
                <div
                  key={candidate.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white font-medium">View detailed platform &rarr;</p>
                    </div>
                    <div className="absolute top-4 right-4">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {candidate.position}
                      </span>
                    </div>
                    {/* Top match badge */}
                    {match && match.matchPercentage >= 70 && (
                      <div className="absolute top-4 left-4">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                          <Sparkles size={11} />
                          Top Match
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Recommendation bar */}
                    {match ? (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                            <Sparkles size={11} className={getLabelColor(match.matchPercentage)} />
                            Quiz Match
                          </span>
                          <span className={`text-sm font-bold ${getLabelColor(match.matchPercentage)}`}>
                            {match.matchPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${getBarColor(match.matchPercentage)}`}
                            style={{ width: `${match.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Quiz Match
                          </span>
                          <span className="text-xs text-muted-foreground italic">Not taken</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-0 rounded-full bg-gray-300" />
                        </div>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{candidate.name}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2 flex-1">
                      "{candidate.agenda}"
                    </p>
                    
                    <Button
                      variant="outline"
                      fullWidth
                      className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all mt-auto"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-20 bg-muted/30 rounded-3xl">
              <p className="text-xl text-muted-foreground">No candidates found for this position.</p>
              <button 
                onClick={() => setSelectedPosition('all')}
                className="mt-4 text-primary font-medium hover:underline"
              >
                View all candidates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}