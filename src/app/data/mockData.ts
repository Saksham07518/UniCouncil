export interface Candidate {
  id: string;
  name: string;
  position: string;
  photo: string;
  agenda: string;
  vision: string;
  goals: string[];
  actionPlan: string;
  achievements: string[];
  email: string;
}

export const positions = ['President', 'Vice President', 'Secretary', 'Treasurer'];

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    position: 'President',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    agenda: 'Enhance student engagement and strengthen university-student communication',
    vision: 'To create a more inclusive and vibrant campus community where every student voice is heard and valued. I envision a student council that serves as a true bridge between students and administration.',
    goals: [
      'Establish monthly open forums with university leadership',
      'Launch a mobile app for student feedback and announcements',
      'Increase funding for student organizations by 30%',
      'Implement a student wellness program with mental health resources',
    ],
    actionPlan: 'In my first 100 days, I will conduct a comprehensive survey to understand student priorities, form working committees for each major initiative, and establish regular communication channels with administration. I will work to secure additional funding through alumni engagement and present a detailed roadmap for all proposed initiatives.',
    achievements: [
      'Led successful campaign to extend library hours, resulting in 24/7 access during finals week',
      'Founded the Student Wellness Initiative, providing free counseling to 200+ students',
      'Organized 5 town halls with 1,500+ total attendees over the past year',
      'Secured $50,000 grant for student mental health programs',
      'President of Student Government Association (2024-2025)'
    ],
    email: 'sarah.chen@university.edu'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    position: 'President',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    agenda: 'Focus on academic excellence and career development opportunities',
    vision: 'A student council that prioritizes academic support and career readiness. I believe in preparing students not just for exams, but for successful careers and meaningful lives beyond university.',
    goals: [
      'Expand peer tutoring programs across all departments',
      'Organize quarterly career fairs with top employers',
      'Create a student-run research symposium',
      'Develop partnerships with industry for internship opportunities',
    ],
    actionPlan: 'I will immediately reach out to academic departments to identify support gaps, connect with career services to plan enhanced programming, and leverage my network to bring industry leaders to campus. Each initiative will have clear metrics and quarterly progress reports.',
    achievements: [
      'Founded the Peer Academic Mentorship Program, helping 300+ students improve their GPAs',
      'Coordinated 3 career fairs bringing 50+ employers to campus',
      'Published research in undergraduate journal on educational equity',
      'Dean\'s List for 6 consecutive semesters',
      'Vice President of Engineering Student Council (2023-2024)'
    ],
    email: 'marcus.rodriguez@university.edu'
  },
  {
    id: '3',
    name: 'Jennifer Park',
    position: 'President',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    agenda: 'Champion diversity, inclusion, and equitable access to resources',
    vision: 'A campus where every student, regardless of background, has equal opportunity to succeed and feels genuinely represented in student leadership.',
    goals: [
      'Create diversity scholarships for student organization leaders',
      'Establish cultural centers for underrepresented communities',
      'Implement bias training for all student leaders',
      'Launch mentorship program connecting diverse students with alumni',
    ],
    actionPlan: 'I will form a diversity task force in my first month, conduct listening sessions with marginalized student groups, and work with administration to allocate resources for inclusion initiatives. Success will be measured by increased participation from diverse student populations.',
    achievements: [
      'Co-founded International Student Alliance serving 400+ students',
      'Led successful campaign for Halal and Kosher dining options on campus',
      'Organized campus-wide Diversity Week with 2,000+ participants',
      'Recipient of Chancellor\'s Award for Diversity Leadership',
      'Cultural Affairs Director, Student Union (2024-2025)'
    ],
    email: 'jennifer.park@university.edu'
  },
  {
    id: '4',
    name: 'Emily Thompson',
    position: 'Vice President',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    agenda: 'Promote sustainability and environmental awareness on campus',
    vision: 'To transform our university into a leader in campus sustainability. Every student should have the opportunity to contribute to environmental initiatives and learn about sustainable practices.',
    goals: [
      'Reduce campus waste by 50% through comprehensive recycling programs',
      'Install solar panels on student buildings',
      'Launch a campus-wide composting initiative',
      'Organize monthly sustainability workshops and events',
    ],
    actionPlan: 'Working closely with facilities management, I will conduct an environmental audit, form a green task force of student volunteers, and develop a phased implementation plan. I will seek grants and partnerships to fund sustainability projects.',
    achievements: [
      'Led campus-wide plastic reduction campaign, eliminating 10,000+ single-use bottles',
      'Established student-run community garden feeding 100+ students',
      'Coordinated Earth Week events with 1,200+ participants',
      'Secured $25,000 grant from environmental foundation',
      'President of Environmental Action Coalition (2023-2025)'
    ],
    email: 'emily.thompson@university.edu'
  },
  {
    id: '5',
    name: 'David Kim',
    position: 'Vice President',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    agenda: 'Strengthen student services and campus facilities',
    vision: 'A campus where facilities meet modern standards and student services are accessible, efficient, and student-centered. Every student deserves a comfortable and supportive environment.',
    goals: [
      'Extend library hours during exam periods',
      'Improve campus Wi-Fi infrastructure',
      'Add more study spaces and collaboration rooms',
      'Enhance campus safety with better lighting and emergency systems',
    ],
    actionPlan: 'I will create a comprehensive facilities improvement plan based on student feedback, work with administration to prioritize critical upgrades, and establish a transparent timeline for implementations. Regular updates will be provided to the student body.',
    achievements: [
      'Successfully lobbied for renovation of 3 outdated study lounges',
      'Led initiative to add 50 new charging stations across campus',
      'Coordinated with IT to upgrade Wi-Fi in 10 academic buildings',
      'Implemented student feedback system for facility improvements',
      'Chair of Facilities Committee, Student Senate (2024-2025)'
    ],
    email: 'david.kim@university.edu'
  },
  {
    id: '6',
    name: 'Alex Martinez',
    position: 'Vice President',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    agenda: 'Enhance student life through events, activities, and community building',
    vision: 'Creating a vibrant campus culture where students form lasting connections, discover new passions, and build a strong sense of community that extends beyond graduation.',
    goals: [
      'Double the number of large-scale campus events annually',
      'Create a centralized events calendar accessible to all students',
      'Increase student organization budgets by 40%',
      'Launch late-night programming for students living on campus',
    ],
    actionPlan: 'I will establish an events planning committee, survey students on their interests, partner with local businesses for sponsorships, and create themed event series. Monthly community-building events will be held across all residence halls.',
    achievements: [
      'Organized 15+ major campus events with 5,000+ total attendance',
      'Founded "Midnight Movies" program serving 800+ students monthly',
      'Increased student event attendance by 60% over two years',
      'Coordinated campus-wide Spring Festival with 3,000+ participants',
      'Director of Student Activities, Campus Programming Board (2023-2025)'
    ],
    email: 'alex.martinez@university.edu'
  },
  {
    id: '7',
    name: 'Priya Patel',
    position: 'Secretary',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    agenda: 'Improve transparency and communication in student government',
    vision: 'A student council that operates with complete transparency and keeps students informed about every decision and initiative. Trust is built through clear, consistent communication.',
    goals: [
      'Publish detailed meeting minutes within 48 hours',
      'Create a monthly newsletter highlighting council activities',
      'Develop an accessible archive of all council documents',
      'Host weekly office hours for student inquiries',
    ],
    actionPlan: 'I will implement a documentation system on day one, establish communication protocols, and create a user-friendly website for all council information. Every decision will be communicated clearly with rationale and impact.',
    achievements: [
      'Digitized 5 years of student government archives',
      'Created student government newsletter reaching 2,000+ subscribers',
      'Improved meeting attendance tracking by 100%',
      'Streamlined document approval process, reducing time by 40%',
      'Recording Secretary, Student Senate (2023-2025)'
    ],
    email: 'priya.patel@university.edu'
  },
  {
    id: '8',
    name: 'Rachel Foster',
    position: 'Secretary',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    agenda: 'Modernize student government operations with digital solutions',
    vision: 'Bringing student government into the digital age with efficient systems that make information accessible, processes streamlined, and student voices easily heard.',
    goals: [
      'Launch a mobile app for student government communications',
      'Implement digital voting system for council decisions',
      'Create automated report generation for all committees',
      'Build a student feedback portal with real-time responses',
    ],
    actionPlan: 'I will audit current systems, identify inefficiencies, and partner with computer science students to develop custom solutions. All digital tools will prioritize user experience and accessibility.',
    achievements: [
      'Developed automated attendance tracking system used by 20+ organizations',
      'Created digital petition platform with 1,500+ signatures collected',
      'Led migration of all student government documents to cloud storage',
      'Built student feedback dashboard with 95% satisfaction rating',
      'Technology Coordinator, Student Government (2024-2025)'
    ],
    email: 'rachel.foster@university.edu'
  },
  {
    id: '9',
    name: 'Thomas Wright',
    position: 'Secretary',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    agenda: 'Amplify student voices through effective communication strategies',
    vision: 'Ensuring every student feels their voice matters by creating multiple channels for feedback and making student government truly representative of the entire student body.',
    goals: [
      'Establish student voice surveys with 80%+ response rates',
      'Create social media presence with daily engagement',
      'Host monthly open mic sessions for student concerns',
      'Develop multilingual communications for international students',
    ],
    actionPlan: 'I will create a comprehensive communication strategy, train all council members in effective outreach, and establish metrics to measure engagement. Student feedback will directly inform policy decisions.',
    achievements: [
      'Grew student government social media following by 300%',
      'Launched podcast series on student issues with 10,000+ downloads',
      'Conducted campus-wide survey with 2,500+ responses',
      'Created video series explaining student government initiatives',
      'Communications Director, Campus Media (2023-2025)'
    ],
    email: 'thomas.wright@university.edu'
  },
  {
    id: '10',
    name: 'James Wilson',
    position: 'Treasurer',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    agenda: 'Ensure responsible budget management and financial transparency',
    vision: 'To manage student funds with integrity and accountability, ensuring every dollar is spent wisely to maximize student benefit. Financial transparency should be a cornerstone of student government.',
    goals: [
      'Publish monthly financial reports accessible to all students',
      'Implement zero-based budgeting for student initiatives',
      'Create an emergency fund for unexpected student needs',
      'Develop a student grant program for innovative projects',
    ],
    actionPlan: 'I will conduct a complete financial review, establish clear accounting procedures, and create a transparent budget dashboard. I will hold quarterly budget town halls and ensure all expenditures are justified and documented.',
    achievements: [
      'Managed $500,000 student activities budget with zero discrepancies',
      'Saved $75,000 through strategic vendor negotiations',
      'Created emergency fund that helped 50+ students in crisis',
      'Increased budget transparency with monthly public reports',
      'Treasurer, Business Student Association (2023-2025)'
    ],
    email: 'james.wilson@university.edu'
  },
  {
    id: '11',
    name: 'Maya Johnson',
    position: 'Treasurer',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    agenda: 'Maximize student funding through strategic fundraising and partnerships',
    vision: 'Growing the student budget through innovative fundraising, corporate partnerships, and grant writing to provide more resources for student initiatives and organizations.',
    goals: [
      'Increase student budget by 25% through external fundraising',
      'Establish corporate partnership program for student funding',
      'Apply for educational grants totaling $200,000+',
      'Create crowdfunding platform for student projects',
    ],
    actionPlan: 'I will develop a fundraising strategy, build relationships with alumni and local businesses, and train committee members in grant writing. Every funding stream will be diversified to ensure financial stability.',
    achievements: [
      'Raised $150,000 through alumni fundraising campaign',
      'Secured 10 corporate sponsorships totaling $80,000',
      'Won 5 educational grants for student programming',
      'Launched successful crowdfunding campaign raising $25,000',
      'Fundraising Chair, Student Foundation (2023-2025)'
    ],
    email: 'maya.johnson@university.edu'
  },
  {
    id: '12',
    name: 'Kevin Nguyen',
    position: 'Treasurer',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    agenda: 'Equitable budget allocation ensuring fair distribution of student funds',
    vision: 'Creating a fair, data-driven budget process that ensures all student groups have access to funding, with special attention to supporting underrepresented and emerging organizations.',
    goals: [
      'Implement transparent budget allocation formula',
      'Create micro-grant program for new student organizations',
      'Establish budget appeal process for fairness',
      'Provide financial literacy workshops for student leaders',
    ],
    actionPlan: 'I will review historical spending patterns, identify inequities, and develop an objective allocation system. Regular budget workshops will empower student organizations to effectively manage their funds.',
    achievements: [
      'Redesigned budget allocation system used by 100+ organizations',
      'Distributed $200,000 in student organization funding equitably',
      'Conducted 20+ financial literacy workshops for student leaders',
      'Reduced budget disputes by 70% through improved processes',
      'Budget Director, Student Funding Board (2024-2025)'
    ],
    email: 'kevin.nguyen@university.edu'
  },
];

export interface Election {
  id: string;
  name: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: Date;
  endDate: Date;
  totalVoters: number;
  votedCount: number;
}

export const currentElection: Election = {
  id: 'election-2026',
  name: 'Student Council Election 2026',
  status: 'ongoing',
  startDate: new Date('2026-01-28'),
  endDate: new Date('2026-02-05'),
  totalVoters: 3456,
  votedCount: 1823,
};

// Results data (only visible after election ends)
export interface Result {
  candidateId: string;
  votes: number;
  // Percentage is calculated dynamically
}

export const results: Result[] = [
  { candidateId: '1', votes: 892 },
  { candidateId: '2', votes: 756 },
  { candidateId: '3', votes: 634 },
  { candidateId: '4', votes: 634 },
  { candidateId: '5', votes: 521 },
  { candidateId: '6', votes: 668 },
  { candidateId: '7', votes: 945 },
  { candidateId: '8', votes: 534 },
  { candidateId: '9', votes: 344 },
  { candidateId: '10', votes: 878 },
  { candidateId: '11', votes: 623 },
  { candidateId: '12', votes: 322 },
];

export const announcements = [
  {
    id: '1',
    title: 'Voting Opens Today',
    date: '2026-01-28',
    content: 'The Student Council Election voting period has officially begun. Cast your vote before February 5th.',
  },
  {
    id: '2',
    title: 'Candidate Debate Recording Available',
    date: '2026-01-25',
    content: 'Watch the full recording of the candidate debate on UniCouncil.',
  },
  {
    id: '3',
    title: 'Election Guidelines',
    date: '2026-01-20',
    content: 'Please review the election code of conduct and voting procedures before casting your vote.',
  },
];