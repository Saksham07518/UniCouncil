import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { useAuth } from '@/app/context/AuthContext';
import { User, Phone, Hash, CheckCircle2, XCircle } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Profile</h1>
            <p className="text-muted-foreground">Your account information</p>
          </div>

          {/* Profile Information */}
          <Card className="mb-6">
            <h3 className="mb-6">Personal Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="text-foreground">{user.name || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="text-foreground">+{user.phone || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Hash className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="text-foreground">{user.rollNumber || 'Not set'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Voting Status */}
          <Card>
            <h3 className="mb-6">Voting Status</h3>

            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${user.hasVoted ? 'bg-primary/10' : 'bg-destructive/10'
                }`}>
                {user.hasVoted ? (
                  <CheckCircle2 className="text-primary" size={20} />
                ) : (
                  <XCircle className="text-destructive" size={20} />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vote Status</p>
                <p className="text-foreground">
                  {user.hasVoted ? 'Vote Submitted' : 'Not Voted Yet'}
                </p>
              </div>
            </div>

            {user.hasVoted && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground">
                  Your vote has been recorded securely. Thank you for participating in the election!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
