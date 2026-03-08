import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { candidates } from '../data/mockData';
import { qaData } from '../data/qaData';
import { Send, ThumbsUp, CheckCircle, Clock, MessageSquare, Filter, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export default function QAPage() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<string>('all');
  const [questionText, setQuestionText] = useState('');
  const [targetCandidate, setTargetCandidate] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim() && targetCandidate) {
      setShowSuccessMessage(true);
      setQuestionText('');
      setTargetCandidate('');
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const filteredQuestions = selectedCandidate === 'all' 
    ? qaData 
    : qaData.filter(q => q.candidateId === selectedCandidate);

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.upvotes - a.upvotes;
    }
    return 0; // Keep original order for 'recent'
  });

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate ? candidate.name : 'Unknown';
  };

  const getCandidatePosition = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate ? candidate.position : '';
  };

  const getCandidatePhoto = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate ? candidate.photo : '';
  };

  const answeredCount = filteredQuestions.filter(q => q.status === 'answered').length;
  const pendingCount = filteredQuestions.filter(q => q.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-10 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={40} />
              <h1 className="text-4xl font-bold">Student Council Q&A</h1>
            </div>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              Ask questions directly to candidates and read their responses. Engage with your future student leaders!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold">{qaData.length}</p>
                <p className="text-sm text-primary-foreground/80">Total Questions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold">{answeredCount}</p>
                <p className="text-sm text-primary-foreground/80">Answered</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-primary-foreground/80">Pending</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3 animate-in slide-in-from-top shadow-lg">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-green-800 font-semibold">Question submitted successfully!</p>
                <p className="text-sm text-green-700">The candidate will be notified and will respond soon.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Question Submission Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Send className="text-primary" size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Ask a Question</h2>
                </div>

                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div>
                    <label htmlFor="targetCandidate" className="block text-sm font-semibold text-foreground mb-2">
                      Select Candidate
                    </label>
                    <select
                      id="targetCandidate"
                      value={targetCandidate}
                      onChange={(e) => setTargetCandidate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                      required
                    >
                      <option value="">Choose a candidate...</option>
                      {candidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} - {candidate.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="question" className="block text-sm font-semibold text-foreground mb-2">
                      Your Question
                    </label>
                    <textarea
                      id="question"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-background"
                      placeholder="What would you like to ask?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit Question
                  </button>
                </form>

                {/* Filter Section */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="text-muted-foreground" size={20} />
                    <h3 className="font-semibold">Filters</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="filterCandidate" className="block text-sm font-semibold text-foreground mb-2">
                        Filter by Candidate
                      </label>
                      <select
                        id="filterCandidate"
                        value={selectedCandidate}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      >
                        <option value="all">All Candidates</option>
                        {candidates.map((candidate) => (
                          <option key={candidate.id} value={candidate.id}>
                            {candidate.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Sort by
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => setSortBy('recent')}
                          className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                            sortBy === 'recent'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            Most Recent
                          </div>
                        </button>
                        <button
                          onClick={() => setSortBy('popular')}
                          className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                            sortBy === 'popular'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp size={16} />
                            Most Popular
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Questions & Answers */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {sortedQuestions.length} {sortedQuestions.length === 1 ? 'Question' : 'Questions'}
                </h2>
              </div>

              <div className="space-y-6">
                {sortedQuestions.length === 0 ? (
                  <Card className="text-center py-16">
                    <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={64} />
                    <h3 className="text-xl font-bold mb-2">No questions yet</h3>
                    <p className="text-muted-foreground">Be the first to ask a question!</p>
                  </Card>
                ) : (
                  sortedQuestions.map((qa) => (
                    <Card key={qa.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Candidate Header */}
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                        <ImageWithFallback
                          src={getCandidatePhoto(qa.candidateId)}
                          alt={getCandidateName(qa.candidateId)}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{getCandidateName(qa.candidateId)}</h3>
                          <p className="text-sm text-muted-foreground">{getCandidatePosition(qa.candidateId)}</p>
                        </div>
                        {qa.status === 'answered' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Answered</span>
                          </div>
                        )}
                        {qa.status === 'pending' && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                            <Clock size={16} />
                            <span className="text-sm font-medium">Pending</span>
                          </div>
                        )}
                      </div>

                      {/* Question */}
                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary font-bold text-sm">Q</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-lg leading-relaxed">{qa.question}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Asked by {qa.askedBy} • {qa.askedAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Answer */}
                      {qa.answer && (
                        <div className="bg-primary/5 rounded-xl p-5 border-l-4 border-primary">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-primary-foreground font-bold text-sm">A</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-foreground leading-relaxed mb-2">{qa.answer}</p>
                              <p className="text-xs text-muted-foreground">
                                Answered on {qa.answeredAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Upvotes */}
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors group">
                          <ThumbsUp className="text-muted-foreground group-hover:text-primary transition-colors" size={18} />
                          <span className="font-semibold text-muted-foreground group-hover:text-primary">
                            {qa.upvotes} {qa.upvotes === 1 ? 'upvote' : 'upvotes'}
                          </span>
                        </button>
                        <button
                          onClick={() => navigate(`/candidates/${qa.candidateId}`)}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View candidate profile →
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
