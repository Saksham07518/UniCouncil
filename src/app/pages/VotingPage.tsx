import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';
import { Modal } from '@/app/components/Modal';
import { candidates, positions, currentElection } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { AlertTriangle, Vote, Mail, ShieldCheck, Loader2 } from 'lucide-react';

export function VotingPage() {
  const navigate = useNavigate();
  const { user, markAsVoted } = useAuth();
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Email Verification State
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Redirect if already voted
  useEffect(() => {
    if (user?.hasVoted) {
      navigate('/dashboard');
    }
  }, [user?.hasVoted, navigate]);

  // Show message if election not ongoing
  if (currentElection.status !== 'ongoing') {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Card className="max-w-md text-center">
            <AlertTriangle className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="mb-2">Voting Not Available</h3>
            <p className="text-muted-foreground mb-4">
              The voting period has {currentElection.status === 'upcoming' ? 'not started yet' : 'ended'}.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleVoteSelect = (position: string, candidateId: string) => {
    setSelectedVotes(prev => ({
      ...prev,
      [position]: candidateId,
    }));
  };

  const handleSubmitVote = () => {
    // Check if all positions have votes
    const allPositionsVoted = positions.every(position => selectedVotes[position]);

    if (!allPositionsVoted) {
      alert('Please select a candidate for each position before submitting.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleProceedToVerify = () => {
    setShowConfirmModal(false);
    setShowEmailModal(true);
  };

  const handleSendEmailOTP = async () => {
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setIsSendingEmail(true);

    // Generate a 6 digit random number
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(generatedOtp);

    // Log OTP to browser console for easy local testing
    console.log('--- DEVELOPMENT MODE OTP ---');
    console.log(`Email: ${email} | OTP: ${generatedOtp}`);
    console.log('----------------------------');

    // Simulate network delay so the UI shows the loading state briefly
    setTimeout(() => {
      setOtpSent(true);
      setIsSendingEmail(false);
    }, 1000);
  };

  const verifyAndSubmitVote = async () => {
    if (enteredOtp !== expectedOtp) {
      setEmailError('Invalid OTP code. Please try again.');
      return;
    }

    try {
      // 1. Prepare the vote records to be inserted into the database
      const timestamp = new Date().toISOString();
      const voteRecords = Object.entries(selectedVotes).map(([position, candidateId]) => ({
        voter_id: user?.id,
        candidate_id: candidateId,
        position: position,
      }));

      // 2. Insert all votes into the 'votes' table at once
      const { error: insertError } = await supabase
        .from('votes')
        .insert(voteRecords);

      if (insertError) {
        // If they already voted (violated UNIQUE constraint), or RLS blocked them
        if (insertError.code === '23505') {
          throw new Error('You have already cast a vote for one or more of these positions.');
        }
        throw insertError;
      }

      // 3. OTP matched & votes stored successfully! Mark the user's profile as voted.
      setShowEmailModal(false);
      await markAsVoted();
      navigate('/vote-confirmation');

    } catch (err: any) {
      console.error('Failed to submit votes:', err);
      setEmailError(err.message || 'An error occurred while saving your vote. Please try again.');
    }
  };

  const getCandidatesByPosition = (position: string) => {
    return candidates.filter(c => c.position === position);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Cast Your Vote</h1>
            <p className="text-muted-foreground">Select one candidate for each position</p>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-destructive mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-foreground">Important: You can vote only once</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please review your selections carefully before submitting. Your vote cannot be changed after submission.
              </p>
            </div>
          </div>

          {/* Voting Form */}
          <div className="space-y-6 mb-8">
            {positions.map((position) => {
              const positionCandidates = getCandidatesByPosition(position);

              return (
                <Card key={position}>
                  <h3 className="mb-4">{position}</h3>

                  <div className="space-y-3">
                    {positionCandidates.map((candidate) => {
                      const isSelected = selectedVotes[position] === candidate.id;

                      return (
                        <label
                          key={candidate.id}
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 bg-muted'
                            }`}
                        >
                          <input
                            type="radio"
                            name={position}
                            value={candidate.id}
                            checked={isSelected}
                            onChange={() => handleVoteSelect(position, candidate.id)}
                            className="w-5 h-5 text-primary"
                          />

                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <p className="text-foreground">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {candidate.agenda}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Submit Button */}
          <Card className="sticky bottom-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">
                  Selected: {Object.keys(selectedVotes).length} / {positions.length} positions
                </p>
                <p className="text-sm text-muted-foreground">
                  Please select a candidate for all positions
                </p>
              </div>
              <Button
                onClick={handleSubmitVote}
                disabled={Object.keys(selectedVotes).length !== positions.length}
              >
                Submit Vote
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Your Vote"
      >
        <div className="mb-6">
          <div className="p-4 bg-muted rounded-lg mb-4">
            <p className="text-foreground mb-3">You have selected:</p>
            <ul className="space-y-2">
              {positions.map((position) => {
                const candidateId = selectedVotes[position];
                const candidate = candidates.find(c => c.id === candidateId);
                return (
                  <li key={position} className="text-sm">
                    <span className="text-muted-foreground">{position}:</span>{' '}
                    <span className="text-foreground">{candidate?.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="text-sm text-destructive">
            Are you sure you want to submit your vote? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleProceedToVerify}
          >
            Proceed to Verify
          </Button>
        </div>
      </Modal>

      {/* Email Verification Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setOtpSent(false);
          setEmail('');
          setEnteredOtp('');
          setEmailError('');
        }}
        title="Verify Identity to Vote"
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-primary" size={20} />
            </div>
            <p className="text-sm text-muted-foreground">
              To ensure election integrity, please verify your email address. You can only vote once.
            </p>
          </div>

          {!otpSent ? (
            <div className="space-y-4">
              <Input
                label="College Email Address"
                type="email"
                placeholder="student@unicouncil.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                disabled={isSendingEmail}
                fullWidth
              />
              <Button
                fullWidth
                onClick={handleSendEmailOTP}
                disabled={!email || isSendingEmail}
              >
                {isSendingEmail ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={16} className="animate-spin" /> Sending Code...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                <p className="text-sm text-center">
                  We sent a 6-digit code to <span className="font-semibold">{email}</span>
                </p>
              </div>

              {/* Mobile-friendly OTP Display for Development */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4 text-center">
                <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">On Screen OTP</p>
                <p className="text-sm text-yellow-800">Your verification code is:</p>
                <p className="text-3xl font-black text-yellow-900 mt-1 tracking-[0.5em]">{expectedOtp}</p>
              </div>
              <Input
                label="Enter Verification Code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                error={emailError}
                className="text-center text-2xl tracking-widest"
                fullWidth
              />
              <Button
                fullWidth
                onClick={verifyAndSubmitVote}
                disabled={enteredOtp.length !== 6}
              >
                Verify & Submit Vote
              </Button>
              <button
                className="w-full text-center text-sm text-primary hover:underline mt-2"
                onClick={() => setOtpSent(false)}
              >
                Change email address
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}