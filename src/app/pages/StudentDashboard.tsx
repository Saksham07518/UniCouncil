import { useNavigate } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { currentElection, announcements } from '@/app/data/mockData';
import { Clock, Users, Vote, AlertCircle, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = currentElection.endDate;
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Voting has ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    const statusColors = {
      upcoming: 'bg-muted text-muted-foreground',
      ongoing: 'bg-accent text-accent-foreground',
      completed: 'bg-primary text-primary-foreground',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusColors[currentElection.status]}`}>
        {currentElection.status.charAt(0).toUpperCase() + currentElection.status.slice(1)}
      </span>
    );
  };

  const votingPercentage = (currentElection.votedCount / currentElection.totalVoters) * 100;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Track the election and cast your vote</p>
          </div>

          {/* Voting Status Alert */}
          {!user?.hasVoted && currentElection.status === 'ongoing' && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-accent mt-0.5 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-foreground">You haven't voted yet!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Don't miss your chance to make your voice heard. Voting ends on {currentElection.endDate.toLocaleDateString()}.
                </p>
              </div>
            </div>
          )}

          {user?.hasVoted && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
              <Vote className="text-primary mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-foreground">Vote Recorded Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Thank you for participating in the election!
                </p>
              </div>
            </div>
          )}

          {/* Election Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Remaining</p>
                  <p className="text-foreground">{timeRemaining}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Voter Turnout</p>
                  <p className="text-foreground">{votingPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Vote className="text-foreground" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Election Status</p>
                  <div className="mt-1">{getStatusBadge()}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/quiz')}
                className="justify-center flex items-center gap-2"
              >
                <Brain size={20} />
                Find Right Candidate
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/candidates')}
                className="justify-center"
              >
                View Candidates
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/vote')}
                disabled={user?.hasVoted || currentElection.status !== 'ongoing'}
                className="justify-center"
              >
                {user?.hasVoted ? 'Vote Already Cast' : 'Cast Your Vote'}
              </Button>
            </div>
          </Card>

          {/* Announcements */}
          <Card>
            <h3 className="mb-4">Election Announcements</h3>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-foreground">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}