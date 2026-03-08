import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { Card } from '@/app/components/Card';
import { candidates, currentElection, positions } from '@/app/data/mockData';
import { supabase } from '@/app/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { Trophy, AlertCircle, Download, PieChart as PieChartIcon, TrendingUp, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#1e3a8a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// Mock data for voting trends
const turnoutData = [
  { time: 'Day 1', votes: 350 },
  { time: 'Day 2', votes: 720 },
  { time: 'Day 3', votes: 1150 },
  { time: 'Day 4', votes: 1480 },
  { time: 'Day 5', votes: 1650 },
  { time: 'Day 6', votes: 1780 },
  { time: 'Day 7', votes: 1823 },
];

export function ResultsPage() {
  const [realResults, setRealResults] = useState<{ candidateId: string, votes: number }[]>([]);
  const [votedCount, setVotedCount] = useState<number>(0);
  const [totalVoters, setTotalVoters] = useState<number>(currentElection.totalVoters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data: voteData, error: voteError } = await supabase.rpc('get_vote_counts');
        if (voteError) throw voteError;

        const { data: turnoutData, error: turnoutError } = await supabase.rpc('get_voter_turnout');
        if (turnoutError) throw turnoutError;

        if (voteData) {
          setRealResults(voteData.map((v: any) => ({
            candidateId: v.candidate_id,
            votes: Number(v.vote_count)
          })));
        }
        if (turnoutData !== null) {
          setVotedCount(Number(turnoutData));
        }
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Loading live election results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate results by position from REAL data
  const resultsByPosition = positions.map(position => {
    const positionCandidates = candidates.filter(c => c.position === position);
    const positionResults = positionCandidates.map(candidate => {
      const result = realResults.find(r => r.candidateId === candidate.id);
      return {
        ...candidate,
        votes: result?.votes || 0,
      };
    }).sort((a, b) => b.votes - a.votes);

    return {
      position,
      candidates: positionResults,
      winner: positionResults[0],
    };
  });

  const handleDownload = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Navy blue
    doc.text('Student Council Election 2026', 14, 22);

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text('Official Results Report', 14, 30);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);

    // Summary Table
    const summaryData = [
      ['Total Voters', totalVoters],
      ['Votes Cast', votedCount],
      ['Voter Turnout', `${((votedCount / totalVoters) * 100).toFixed(1)}%`]
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      styles: { fontSize: 12 },
    });

    let currentY = (doc as any).lastAutoTable.finalY + 20;

    // Detailed Results
    resultsByPosition.forEach(({ position, candidates, winner }) => {
      // Check for page break
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      // Position Header
      doc.setFontSize(16);
      doc.setTextColor(30, 58, 138);
      doc.text(position, 14, currentY);

      // Winner
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74); // Green
      doc.text(`Winner: ${winner.name}`, 14, currentY + 7);

      const tableData = candidates.map(c => {
        const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0);
        const pct = ((c.votes / totalVotes) * 100).toFixed(1) + '%';
        return [c.name, c.votes, pct];
      });

      autoTable(doc, {
        startY: currentY + 12,
        head: [['Candidate', 'Votes', 'Percentage']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 11 },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' },
          2: { halign: 'right' },
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
      doc.text('Official UniCouncil Election Platform', 14, doc.internal.pageSize.height - 10);
    }

    doc.save('election-results-2026.pdf');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="mb-2">Election Results</h1>
              <p className="text-muted-foreground">Final results for Student Council Election 2026</p>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
            >
              <Download size={20} />
              Download Report
            </button>
          </div>

          {/* Results by Position */}
          <div className="space-y-8">
            {resultsByPosition.map(({ position, candidates: positionCandidates, winner }) => (
              <Card key={position}>
                <div className="flex items-center justify-between mb-6">
                  <h2>{position}</h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg">
                    <Trophy size={20} />
                    <span>Winner: {winner.name}</span>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Bar Chart */}
                  <div>
                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Vote Distribution</h4>
                    <div className="h-64 border rounded-xl p-4 bg-white/50">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={positionCandidates}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                            {positionCandidates.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? '#1e3a8a' : '#94a3b8'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Vote Share</h4>
                    <div className="h-64 border rounded-xl p-4 bg-white/50 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={positionCandidates}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="votes"
                          >
                            {positionCandidates.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-sm text-slate-600 ml-1">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-3">
                  {positionCandidates.map((candidate, index) => {
                    const totalVotes = positionCandidates.reduce((sum, c) => sum + c.votes, 0);
                    const percentage = ((candidate.votes / totalVotes) * 100).toFixed(1);

                    return (
                      <div
                        key={candidate.id}
                        className={`p-4 rounded-lg ${index === 0 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {index === 0 && (
                              <Trophy className="text-primary" size={20} />
                            )}
                            <span className="text-foreground">{candidate.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-foreground">{candidate.votes} votes</p>
                            <p className="text-sm text-muted-foreground">{percentage}%</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-accent'
                              }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>

          {/* Election Summary & Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card>
              <h3 className="mb-6 flex items-center gap-2">
                <PieChartIcon className="text-primary" size={24} />
                Election Summary
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium mb-1">Total Voters</p>
                    <p className="text-3xl font-bold text-blue-900">{totalVoters.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-sm text-green-600 font-medium mb-1">Votes Cast</p>
                    <p className="text-3xl font-bold text-green-900">{votedCount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-end mb-2">
                    <p className="font-medium text-slate-700">Voter Turnout</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" size={24} />
                Voting Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={turnoutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="votes"
                      stroke="#1e3a8a"
                      strokeWidth={3}
                      dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Cumulative votes cast over the 7-day election period
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
