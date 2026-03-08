import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { candidates, currentElection } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';
import { 
  ArrowLeft, Target, CheckCircle2, ChevronDown, ChevronUp, Users, 
  Presentation, Quote, Sparkles, TrendingUp, Heart, Lightbulb, 
  Shield, Zap, BookOpen, DollarSign, Leaf, Home, Award, Star, Mail 
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

// Hardcoded campaign images for visual variety
const campaignImages = [
  'https://images.unsplash.com/photo-1762158007836-25d13ab34c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGNhbXBhaWduJTIwbWVldGluZ3xlbnwxfHx8fDE3NzEwNjM3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1632834380561-d1e05839a33a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzcxMDQ3NTAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1759922378187-11a435837df8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhZGVyc2hpcCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzcxMDYzNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1646369505567-3a9cbb052342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZ2l2aW5nJTIwc3BlZWNofGVufDF8fHx8MTc3MTA2Mzc4MHww&ixlib=rb-4.1.0&q=80&w=1080',
];

// Icon mapping for different types of goals
const getGoalIcon = (goalText: string, index: number) => {
  const text = goalText.toLowerCase();
  
  if (text.includes('mental health') || text.includes('wellness')) return Heart;
  if (text.includes('funding') || text.includes('budget') || text.includes('financial')) return DollarSign;
  if (text.includes('app') || text.includes('mobile') || text.includes('tech')) return Zap;
  if (text.includes('forum') || text.includes('communication')) return Users;
  if (text.includes('career') || text.includes('internship') || text.includes('job')) return TrendingUp;
  if (text.includes('tutoring') || text.includes('academic') || text.includes('study')) return BookOpen;
  if (text.includes('research') || text.includes('symposium')) return Lightbulb;
  if (text.includes('sustainability') || text.includes('green') || text.includes('environment')) return Leaf;
  if (text.includes('safety') || text.includes('security')) return Shield;
  if (text.includes('housing') || text.includes('facility') || text.includes('building')) return Home;
  
  // Default icons based on index
  const defaultIcons = [Target, Sparkles, CheckCircle2, TrendingUp];
  return defaultIcons[index % defaultIcons.length];
};

const goalColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
  { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
  { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-600' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600' },
];

export function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFullPlatform, setShowFullPlatform] = useState(false);
  
  const candidate = candidates.find(c => c.id === id);

  if (!candidate) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Candidate not found</p>
            <Button onClick={() => navigate('/candidates')} className="mt-4">
              Back to Candidates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canVote = !user?.hasVoted && currentElection.status === 'ongoing';
  
  // Select images based on ID to be deterministic but different for each
  const galleryImages = [
    campaignImages[parseInt(candidate.id) % campaignImages.length],
    campaignImages[(parseInt(candidate.id) + 1) % campaignImages.length],
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto h-screen">
        {/* Hero Section with Large Image Background */}
        <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
           <div className="absolute inset-0 opacity-50">
             <ImageWithFallback 
               src={galleryImages[1]} 
               alt="Campaign Background" 
               className="w-full h-full object-cover blur-sm"
             />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
           
           <div className="absolute bottom-0 left-0 right-0 p-8 max-w-6xl mx-auto flex items-end">
             <button
                onClick={() => navigate('/candidates')}
                className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
           </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 -mt-20 relative z-10 pb-20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Profile Image & Quick Actions */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white p-2 rounded-2xl shadow-xl mb-6">
                <ImageWithFallback
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
              </div>
              
              {canVote ? (
                <Button onClick={() => navigate('/vote')} fullWidth className="h-12 text-lg shadow-lg shadow-primary/20">
                  Vote for {candidate.name.split(' ')[0]}
                </Button>
              ) : user?.hasVoted ? (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">You have voted</span>
                </div>
              ) : (
                <div className="text-center p-3 bg-muted rounded-xl text-muted-foreground">
                  Voting is currently closed
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 pt-4">
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full mb-3 shadow-sm">
                  Running for {candidate.position}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{candidate.name}</h1>
                <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                  "{candidate.agenda}"
                </p>
              </div>

              {/* Vision Card (Visual) */}
              <div className="grid grid-cols-1 gap-6 mb-10">
                <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border border-primary/10 relative overflow-hidden">
                  <Quote className="absolute top-6 left-6 text-primary/10" size={80} />
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <Target size={20} />
                      Vision Statement
                    </h3>
                    <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic mb-8">
                      "{candidate.vision}"
                    </p>
                    
                    <div className="flex justify-end">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-primary/20 hover:bg-white/80 transition-colors shadow-sm">
                        <Mail size={16} className="text-primary" />
                        <span className="text-sm text-muted-foreground mr-1">Contact:</span>
                        <a href={`mailto:${candidate.email}`} className="text-sm font-semibold text-primary hover:underline">
                          {candidate.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Past Achievements - NEW */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award className="text-yellow-600" />
                  Proven Track Record
                </h3>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
                  <div className="space-y-4">
                    {candidate.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                          <Star size={20} fill="currentColor" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {achievement}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Goals Grid - ENHANCED */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="text-yellow-600" />
                  Key Campaign Promises
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  {candidate.goals.map((goal, index) => {
                    const Icon = getGoalIcon(goal, index);
                    const colors = goalColors[index % goalColors.length];
                    
                    return (
                      <div 
                        key={index} 
                        className={`group relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon Circle */}
                          <div className={`w-14 h-14 rounded-full bg-white border-2 ${colors.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className={colors.icon} size={28} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Promise #{index + 1}
                              </span>
                              <CheckCircle2 className={`${colors.icon} opacity-60`} size={20} />
                            </div>
                            <p className={`font-semibold text-lg leading-relaxed ${colors.text}`}>
                              {goal}
                            </p>
                          </div>
                        </div>
                        
                        {/* Decorative element */}
                        <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${colors.icon} opacity-5 rounded-full`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Gallery */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-orange-600" />
                  Campaign Moments
                </h3>
                <div className="grid grid-cols-2 gap-4 h-64">
                  <div className="rounded-xl overflow-hidden shadow-sm relative group">
                    <ImageWithFallback 
                      src={galleryImages[0]} 
                      alt="Campaign Event" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium">Student Town Hall</p>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-sm relative group">
                     <ImageWithFallback 
                      src={galleryImages[1]} 
                      alt="Community Meeting" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium">Community Outreach</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Detailed Platform */}
              <div className="bg-muted/30 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setShowFullPlatform(!showFullPlatform)}
                  className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Presentation size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Detailed Action Plan</h3>
                      <p className="text-sm text-muted-foreground">Read the full breakdown of proposed policies</p>
                    </div>
                  </div>
                  {showFullPlatform ? <ChevronUp /> : <ChevronDown />}
                </button>
                
                {showFullPlatform && (
                  <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="prose prose-blue max-w-none text-muted-foreground">
                      <p className="leading-relaxed whitespace-pre-line">
                        {candidate.actionPlan}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}