import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';
import { supabase } from '@/app/lib/supabase';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { currentElection, candidates as mockCandidates, results as mockResults, positions, Candidate } from '@/app/data/mockData';
import { Users, Vote, TrendingUp, Settings, Calendar, UserPlus, BarChart, Loader2, Edit, X, Trash2, Save, Check } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'elections' | 'candidates' | 'monitoring' | 'voters'>('overview');
  const [votedCount, setVotedCount] = useState<number>(0);
  const [totalVoters, setTotalVoters] = useState<number>(currentElection.totalVoters);
  const [searchQuery, setSearchQuery] = useState('');
  const [votersList, setVotersList] = useState<any[]>([]);
  const [realResults, setRealResults] = useState<{ candidateId: string, votes: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hourlyVotes, setHourlyVotes] = useState<{ hour: string, votes: number }[]>([]);
  const [peakHour, setPeakHour] = useState<string>('N/A');
  const [totalVotesToday, setTotalVotesToday] = useState(0);
  const [firstVoteTime, setFirstVoteTime] = useState<Date | null>(null);
  const [lastVoteTime, setLastVoteTime] = useState<Date | null>(null);

  // Election editing state
  const [electionData, setElectionData] = useState({
    name: currentElection.name,
    status: currentElection.status,
    startDate: currentElection.startDate,
    endDate: currentElection.endDate,
  });
  const [isEditingElection, setIsEditingElection] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('ongoing');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // Candidate management state
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([...mockCandidates]);
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);
  const [editCandidateName, setEditCandidateName] = useState('');
  const [editCandidatePosition, setEditCandidatePosition] = useState('');
  const [editCandidateEmail, setEditCandidateEmail] = useState('');

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        setIsLoading(true);

        const { data: votesData, error: votesError } = await supabase.from('votes').select('candidate_id, voter_id, created_at');
        if (votesError) throw votesError;

        // Fetch total eligible registered count
        const { count } = await supabase
          .from('registered_students')
          .select('*', { count: 'exact', head: true });
        if (count !== null) setTotalVoters(count);

        // Fetch actual user profiles for the voters list
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('id, name, roll_number, phone, has_voted')
          .neq('role', 'admin')
          .order('name');
        if (studentsData) setVotersList(studentsData);

        if (votesData) {
          const counts: Record<string, number> = {};
          const uniqueVoters = new Set<string>();
          const hourMap: Record<string, number> = {};
          const timestamps: Date[] = [];

          votesData.forEach(vote => {
            counts[vote.candidate_id] = (counts[vote.candidate_id] || 0) + 1;
            if (vote.voter_id) uniqueVoters.add(vote.voter_id);

            // Process timestamps for hourly breakdown
            if (vote.created_at) {
              const voteDate = new Date(vote.created_at);
              timestamps.push(voteDate);
              const hourNum = voteDate.getHours();
              const hourLabel = hourNum === 0 ? '12 AM' : hourNum < 12 ? `${hourNum} AM` : hourNum === 12 ? '12 PM' : `${hourNum - 12} PM`;
              const nextHourNum = (hourNum + 1) % 24;
              const nextHourLabel = nextHourNum === 0 ? '12 AM' : nextHourNum < 12 ? `${nextHourNum} AM` : nextHourNum === 12 ? '12 PM' : `${nextHourNum - 12} PM`;
              const key = `${hourLabel} - ${nextHourLabel}`;
              hourMap[key] = (hourMap[key] || 0) + 1;
            }
          });

          setRealResults(Object.entries(counts).map(([id, c]) => ({
            candidateId: id,
            votes: c
          })));

          setVotedCount(uniqueVoters.size);

          // Build sorted hourly data
          const hourlyData = Object.entries(hourMap)
            .map(([hour, v]) => ({ hour, votes: v }))
            .sort((a, b) => b.votes - a.votes);
          setHourlyVotes(hourlyData);

          // Set peak hour
          if (hourlyData.length > 0) {
            setPeakHour(hourlyData[0].hour);
          }

          // Set timestamps for today
          const today = new Date();
          const todayVotes = timestamps.filter(t =>
            t.getDate() === today.getDate() &&
            t.getMonth() === today.getMonth() &&
            t.getFullYear() === today.getFullYear()
          );
          setTotalVotesToday(todayVotes.length);

          // First and last vote times
          if (timestamps.length > 0) {
            timestamps.sort((a, b) => a.getTime() - b.getTime());
            setFirstVoteTime(timestamps[0]);
            setLastVoteTime(timestamps[timestamps.length - 1]);
          }
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();
  }, []);

  const votingPercentage = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : "0.0";

  const handleRevote = async (voterId: string) => {
    if (!window.confirm("Are you sure you want to let this user revote? Their previous votes will be deleted forever.")) return;
    
    setIsLoading(true);
    try {
      // 1. Delete all votes by this user
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('voter_id', voterId);
      
      if (deleteError) throw deleteError;

      // 2. Set has_voted to false in profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ has_voted: false })
        .eq('id', voterId);

      if (updateError) throw updateError;

      // 3. Update local state
      setVotersList(prev => prev.map(v => v.id === voterId ? { ...v, has_voted: false } : v));
      setVotedCount(prev => Math.max(0, prev - 1));
      
      // Refresh the real results
      const { data: votesData } = await supabase.from('votes').select('candidate_id, voter_id');
      if (votesData) {
        const counts: Record<string, number> = {};
        votesData.forEach(vote => {
          counts[vote.candidate_id] = (counts[vote.candidate_id] || 0) + 1;
        });
        setRealResults(Object.entries(counts).map(([id, c]) => ({
          candidateId: id,
          votes: c
        })));
      }
    } catch (err: any) {
      console.error('Error allowing revote:', err);
      alert('Failed to process revote. Ensure you have run the update-roles-votes.sql script. Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Election editing handlers
  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  const handleEditElection = () => {
    setEditName(electionData.name);
    setEditStatus(electionData.status);
    setEditStartDate(formatDateForInput(electionData.startDate));
    setEditEndDate(formatDateForInput(electionData.endDate));
    setIsEditingElection(true);
  };

  const handleSaveElection = () => {
    if (!editName.trim()) return alert('Election name is required.');
    if (!editStartDate || !editEndDate) return alert('Start and end dates are required.');
    if (new Date(editEndDate) <= new Date(editStartDate)) return alert('End date must be after start date.');

    setElectionData({
      name: editName.trim(),
      status: editStatus,
      startDate: new Date(editStartDate),
      endDate: new Date(editEndDate),
    });
    setIsEditingElection(false);
  };

  const handleCancelEdit = () => {
    setIsEditingElection(false);
  };

  // Candidate editing handlers
  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidateId(candidate.id);
    setEditCandidateName(candidate.name);
    setEditCandidatePosition(candidate.position);
    setEditCandidateEmail(candidate.email);
  };

  const handleSaveCandidate = () => {
    if (!editCandidateName.trim()) return alert('Candidate name is required.');
    if (!editCandidatePosition) return alert('Position is required.');
    if (!editCandidateEmail.trim()) return alert('Email is required.');

    setCandidatesList(prev => prev.map(c =>
      c.id === editingCandidateId
        ? { ...c, name: editCandidateName.trim(), position: editCandidatePosition, email: editCandidateEmail.trim() }
        : c
    ));
    setEditingCandidateId(null);
  };

  const handleCancelCandidateEdit = () => {
    setEditingCandidateId(null);
  };

  const handleRemoveCandidate = (candidateId: string, candidateName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${candidateName}? This action cannot be undone.`)) return;
    setCandidatesList(prev => prev.filter(c => c.id !== candidateId));
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredVoters = votersList.filter((voter: any) => 
    (voter.name || '').toLowerCase().includes(searchLower) || 
    (voter.roll_number || '').toLowerCase().includes(searchLower) || 
    (voter.phone || '').toLowerCase().includes(searchLower)
  );

  // Calculate winners based on REAL results
  const winners = positions.map(position => {
    const positionCandidates = mockCandidates.filter((c: any) => c.position === position);
    const positionResults = positionCandidates.map((candidate: any) => {
      const result = realResults.find(r => r.candidateId === candidate.id);
      return { ...candidate, votes: result?.votes || 0 };
    }).sort((a: any, b: any) => b.votes - a.votes);
    return { position, winner: positionResults[0] };
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage elections and monitor voting activity</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'elections'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Manage Elections
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'candidates'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Manage Candidates
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'monitoring'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Live Monitoring
            </button>
            <button
              onClick={() => setActiveTab('voters')}
              className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'voters'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Voters List
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Voters</p>
                      <p className="text-foreground">{totalVoters}</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Vote className="text-accent" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Votes Cast</p>
                      <p className="text-foreground">{votedCount}</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-foreground" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Turnout</p>
                      <p className="text-foreground">{votingPercentage}%</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <UserPlus className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Candidates</p>
                      <p className="text-foreground">{mockCandidates.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Current Leaders */}
                  <Card>
                    <h3 className="mb-4">Current Leaders (Live Results)</h3>
                    <div className="space-y-3">
                      {winners.map(({ position, winner }: any) => (
                        <div key={position} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={winner.photo}
                              alt={winner.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-foreground">{winner.name}</p>
                              <p className="text-sm text-muted-foreground">{position}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-foreground">
                              {realResults.find((r: any) => r.candidateId === winner.id)?.votes || 0} votes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* Recent Activity */}
              <Card>
                <h3 className="mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <p className="text-sm text-muted-foreground">147 votes cast in the last hour</p>
                    <span className="text-sm text-muted-foreground ml-auto">5 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <p className="text-sm text-muted-foreground">Voter turnout reached 50%</p>
                    <span className="text-sm text-muted-foreground ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <p className="text-sm text-muted-foreground">Election announcement published</p>
                    <span className="text-sm text-muted-foreground ml-auto">3 hours ago</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Manage Elections Tab */}
          {activeTab === 'elections' && (
            <div className="space-y-6">
              <Card>
                {isEditingElection ? (
                  /* ── Edit Mode ── */
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3>Edit Election</h3>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Cancel"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Election Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="e.g., Student Council Election 2026"
                        fullWidth
                      />

                      <div>
                        <label className="block mb-2 text-foreground">Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as 'upcoming' | 'ongoing' | 'completed')}
                          className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="date"
                          value={editStartDate}
                          onChange={(e) => setEditStartDate(e.target.value)}
                          fullWidth
                        />
                        <Input
                          label="End Date"
                          type="date"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                          fullWidth
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleSaveElection}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── View Mode ── */
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3>Current Election</h3>
                      <Button variant="outline" onClick={handleEditElection}>
                        <Edit size={16} className="mr-2" />
                        Edit Election
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Election Name</p>
                          <p className="text-foreground">{electionData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${
                            electionData.status === 'ongoing'
                              ? 'bg-accent text-accent-foreground'
                              : electionData.status === 'upcoming'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {electionData.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                          <p className="text-foreground">{electionData.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">End Date</p>
                          <p className="text-foreground">{electionData.endDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              <Card>
                <h3 className="mb-4">Create New Election</h3>
                <form className="space-y-4">
                  <Input
                    label="Election Name"
                    placeholder="e.g., Student Council Election 2027"
                    fullWidth
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      fullWidth
                    />
                    <Input
                      label="End Date"
                      type="date"
                      fullWidth
                    />
                  </div>
                  <Button>
                    <Calendar size={16} className="mr-2" />
                    Create Election
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {/* Manage Candidates Tab */}
          {activeTab === 'candidates' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3>All Candidates ({candidatesList.length})</h3>
                  <Button>
                    <UserPlus size={16} className="mr-2" />
                    Add Candidate
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Position</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Votes</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidatesList.map((candidate) => {
                        const candidateVotes = realResults.find((r: any) => r.candidateId === candidate.id)?.votes || 0;
                        const isEditing = editingCandidateId === candidate.id;

                        if (isEditing) {
                          return (
                            <tr key={candidate.id} className="border-b border-border last:border-0 bg-muted/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <ImageWithFallback
                                    src={candidate.photo}
                                    alt={candidate.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                  <input
                                    type="text"
                                    value={editCandidateName}
                                    onChange={(e) => setEditCandidateName(e.target.value)}
                                    className="px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm w-full max-w-[180px]"
                                    placeholder="Candidate name"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={editCandidatePosition}
                                  onChange={(e) => setEditCandidatePosition(e.target.value)}
                                  className="px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                                >
                                  {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3 px-4 text-foreground">{candidateVotes}</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button variant="primary" className="text-sm py-1 px-3" onClick={handleSaveCandidate}>
                                    <Check size={14} className="mr-1" />
                                    Save
                                  </Button>
                                  <Button variant="outline" className="text-sm py-1 px-3" onClick={handleCancelCandidateEdit}>
                                    Cancel
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={candidate.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <ImageWithFallback
                                  src={candidate.photo}
                                  alt={candidate.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <span className="text-foreground">{candidate.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-foreground">{candidate.position}</td>
                            <td className="py-3 px-4 text-foreground">{candidateVotes}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => handleEditCandidate(candidate)}>
                                  <Edit size={14} className="mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" className="text-sm py-1 px-3 text-destructive" onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}>
                                  <Trash2 size={14} className="mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {candidatesList.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No candidates found. Add a candidate to get started.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Voters List Tab */}
          {activeTab === 'voters' && (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h3>Voters List</h3>
                    <div className="text-sm text-muted-foreground">Total Active Users: {votersList.length}</div>
                  </div>
                  <Input 
                    type="text" 
                    placeholder="Search by name, roll no, or phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Roll Number</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Phone Number</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVoters.map((voter: any) => (
                        <tr key={voter.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-foreground font-medium">{voter.name}</td>
                          <td className="py-3 px-4 text-foreground">{voter.roll_number}</td>
                          <td className="py-3 px-4 text-foreground">{voter.phone}</td>
                          <td className="py-3 px-4">
                            {voter.has_voted ? (
                              <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">Voted</span>
                            ) : (
                              <span className="inline-block px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs font-semibold">Pending</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {voter.has_voted ? (
                              <Button variant="outline" size="sm" onClick={() => handleRevote(voter.id)} disabled={isLoading}>
                                Revote
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredVoters.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      No voters found matching your search.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Live Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Votes Cast</p>
                    <p className="text-2xl font-bold text-foreground">{votedCount}</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Voter Turnout</p>
                    <p className="text-2xl font-bold text-primary">{votingPercentage}%</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Votes Today</p>
                    <p className="text-2xl font-bold text-foreground">{totalVotesToday}</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Remaining Voters</p>
                    <p className="text-2xl font-bold text-foreground">{totalVoters - votedCount}</p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart className="text-primary" size={20} />
                    <h3>Voter Turnout by Hour</h3>
                  </div>
                  {hourlyVotes.length > 0 ? (
                    <div className="space-y-3">
                      {hourlyVotes.map((data, i) => {
                        const maxVotes = Math.max(...hourlyVotes.map(h => h.votes));
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{data.hour}</span>
                              <span className="text-foreground">{data.votes} votes</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${i === 0 ? 'bg-accent' : 'bg-primary'}`}
                                style={{ width: `${(data.votes / maxVotes) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No voting data available yet.
                    </div>
                  )}
                </Card>

                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-accent" size={20} />
                    <h3>Live Statistics</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Peak Voting Hour</p>
                      <p className="text-foreground font-medium">{peakHour}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">First Vote Cast</p>
                      <p className="text-foreground font-medium">
                        {firstVoteTime ? firstVoteTime.toLocaleString() : 'No votes yet'}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Latest Vote Cast</p>
                      <p className="text-foreground font-medium">
                        {lastVoteTime ? lastVoteTime.toLocaleString() : 'No votes yet'}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Remaining Voters</p>
                      <p className="text-foreground font-medium">{totalVoters - votedCount}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Results by Position */}
              <Card>
                <h3 className="mb-4">Votes by Position</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {positions.map(position => {
                    const positionCandidates = candidatesList
                      .filter(c => c.position === position)
                      .map(c => ({
                        ...c,
                        votes: realResults.find(r => r.candidateId === c.id)?.votes || 0
                      }))
                      .sort((a, b) => b.votes - a.votes);
                    const maxVotes = Math.max(...positionCandidates.map(c => c.votes), 1);

                    return (
                      <div key={position}>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{position}</h4>
                        <div className="space-y-2">
                          {positionCandidates.map((c, i) => (
                            <div key={c.id}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-foreground">{c.name}</span>
                                <span className="text-muted-foreground">{c.votes} votes</span>
                              </div>
                              <div className="w-full bg-border rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                  style={{ width: `${(c.votes / maxVotes) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <h3 className="mb-4">System Health</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Server Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-foreground">Online</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Database</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-foreground">Healthy</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Total Positions</p>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">{positions.length}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
