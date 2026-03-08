import { useNavigate } from 'react-router';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { CheckCircle } from 'lucide-react';

export function VoteConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="max-w-lg text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="text-primary" size={48} />
          </div>
          
          <h1 className="mb-3">Vote Submitted Successfully</h1>
          
          <p className="text-muted-foreground mb-6">
            Your vote has been recorded securely. Thank you for participating in the Student Council Election 2026.
          </p>

          <div className="p-4 bg-muted rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              Your vote is anonymous and has been encrypted. You can view the election results once the voting period ends on February 5, 2026.
            </p>
          </div>
        </div>

        <Button onClick={() => navigate('/dashboard')} fullWidth>
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
}
