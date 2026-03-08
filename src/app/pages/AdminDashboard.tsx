import { useState } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';
import { currentElection, candidates, results, positions } from '@/app/data/mockData';
import { Users, Vote, TrendingUp, Settings, Calendar, UserPlus, BarChart } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'elections' | 'candidates' | 'monitoring'>('overview');

  const votingPercentage = ((currentElection.votedCount / currentElection.totalVoters) * 100).toFixed(1);

  // Calculate winners
  const winners = positions.map(position => {
    const positionCandidates = candidates.filter(c => c.position === position);
    const positionResults = positionCandidates.map(candidate => {
      const result = results.find(r => r.candidateId === candidate.id);
      return { ...candidate, votes: result?.votes || 0 };
    }).sort((a, b) => b.votes - a.votes);
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
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'elections'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Manage Elections
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'candidates'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Manage Candidates
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'monitoring'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Live Monitoring
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
                      <p className="text-foreground">{currentElection.totalVoters}</p>
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
                      <p className="text-foreground">{currentElection.votedCount}</p>
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
                      <p className="text-foreground">{candidates.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Current Leaders */}
              <Card>
                <h3 className="mb-4">Current Leaders (Live Results)</h3>
                <div className="space-y-3">
                  {winners.map(({ position, winner }) => (
                    <div key={position} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-4">
                        <img
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
                        <p className="text-foreground">{results.find(r => r.candidateId === winner.id)?.votes || 0} votes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

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
                <div className="flex items-center justify-between mb-6">
                  <h3>Current Election</h3>
                  <Button variant="outline">
                    <Settings size={16} className="mr-2" />
                    Edit Election
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Election Name</p>
                      <p className="text-foreground">{currentElection.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                        {currentElection.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                      <p className="text-foreground">{currentElection.startDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">End Date</p>
                      <p className="text-foreground">{currentElection.endDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
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
                  <h3>All Candidates</h3>
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
                      {candidates.map((candidate) => {
                        const candidateVotes = results.find(r => r.candidateId === candidate.id)?.votes || 0;
                        return (
                          <tr key={candidate.id} className="border-b border-border last:border-0">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
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
                                <Button variant="outline" className="text-sm py-1 px-3">
                                  Edit
                                </Button>
                                <Button variant="outline" className="text-sm py-1 px-3 text-destructive">
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Live Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart className="text-primary" size={20} />
                    <h3>Voter Turnout by Hour</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { hour: '9 AM - 10 AM', votes: 234 },
                      { hour: '10 AM - 11 AM', votes: 312 },
                      { hour: '11 AM - 12 PM', votes: 389 },
                      { hour: '12 PM - 1 PM', votes: 456 },
                      { hour: '1 PM - 2 PM', votes: 432 },
                    ].map((data, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{data.hour}</span>
                          <span className="text-foreground">{data.votes} votes</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(data.votes / 500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-accent" size={20} />
                    <h3>Live Statistics</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Average voting time</p>
                      <p className="text-foreground">2 minutes 34 seconds</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Peak voting hour</p>
                      <p className="text-foreground">12 PM - 1 PM</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Remaining voters</p>
                      <p className="text-foreground">{currentElection.totalVoters - currentElection.votedCount}</p>
                    </div>
                  </div>
                </Card>
              </div>

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
                    <p className="text-sm text-muted-foreground mb-2">API Response</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-foreground">45ms</span>
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
