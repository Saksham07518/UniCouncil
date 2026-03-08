export interface QAItem {
  id: string;
  candidateId: string;
  question: string;
  answer?: string;
  askedBy: string;
  askedAt: string;
  answeredAt?: string;
  status: 'pending' | 'answered';
  upvotes: number;
}

export const qaData: QAItem[] = [
  // Sarah Chen (President - ID: 1)
  {
    id: 'qa1',
    candidateId: '1',
    question: 'What specific initiatives will you implement to improve mental health support services on campus?',
    answer: 'I plan to establish peer support groups, extend counseling hours, and create a mental health awareness campaign. We\'ll also work with the administration to add two more full-time counselors and implement a 24/7 crisis hotline.',
    askedBy: 'Sarah M.',
    askedAt: 'Feb 10, 2026',
    answeredAt: 'Feb 11, 2026',
    status: 'answered',
    upvotes: 87
  },
  {
    id: 'qa2',
    candidateId: '1',
    question: 'How will you ensure transparency in student council budget spending?',
    answer: 'I will publish monthly financial reports accessible to all students through the portal, hold quarterly town halls to discuss budget allocations, and create a public dashboard showing real-time spending on major initiatives.',
    askedBy: 'John D.',
    askedAt: 'Feb 11, 2026',
    answeredAt: 'Feb 12, 2026',
    status: 'answered',
    upvotes: 65
  },

  // Marcus Rodriguez (President - ID: 2)
  {
    id: 'qa3',
    candidateId: '2',
    question: 'What is your plan to increase career development opportunities for students?',
    answer: 'I will partner with top employers to host quarterly career fairs, expand our internship database by 50%, and create a mentorship program connecting students with industry professionals. I\'ve already secured commitments from 15 companies.',
    askedBy: 'Emily R.',
    askedAt: 'Feb 9, 2026',
    answeredAt: 'Feb 10, 2026',
    status: 'answered',
    upvotes: 92
  },
  {
    id: 'qa4',
    candidateId: '2',
    question: 'How will you support students struggling academically?',
    answer: 'We\'ll triple the size of our peer tutoring program, offer free SAT/GRE prep courses, and create study groups for historically challenging courses. Every student deserves academic support regardless of their financial situation.',
    askedBy: 'Marco L.',
    askedAt: 'Feb 11, 2026',
    answeredAt: 'Feb 11, 2026',
    status: 'answered',
    upvotes: 71
  },

  // Jennifer Park (President - ID: 3)
  {
    id: 'qa5',
    candidateId: '3',
    question: 'How will you make our campus more inclusive for international students?',
    answer: 'I will establish cultural centers, provide translation services at major events, create an international student advisory board, and ensure diverse holidays are recognized. My own experience as an international student drives this commitment.',
    askedBy: 'Alex K.',
    askedAt: 'Feb 10, 2026',
    answeredAt: 'Feb 12, 2026',
    status: 'answered',
    upvotes: 78
  },
  {
    id: 'qa6',
    candidateId: '3',
    question: 'What steps will you take to address food insecurity on campus?',
    askedBy: 'Jennifer T.',
    askedAt: 'Feb 13, 2026',
    status: 'pending',
    upvotes: 54
  },

  // Emily Thompson (VP - ID: 4)
  {
    id: 'qa7',
    candidateId: '4',
    question: 'What is your timeline for making campus carbon neutral?',
    answer: 'My plan targets carbon neutrality by 2030. Year 1: solar panel installation on 3 buildings. Year 2: eliminate single-use plastics. Year 3: transition to electric shuttles. Year 4-6: comprehensive waste reduction and carbon offset programs.',
    askedBy: 'David W.',
    askedAt: 'Feb 8, 2026',
    answeredAt: 'Feb 9, 2026',
    status: 'answered',
    upvotes: 103
  },
  {
    id: 'qa8',
    candidateId: '4',
    question: 'How will you fund sustainability initiatives?',
    answer: 'I\'ve already secured $25,000 in grants and have applications pending for $100,000 more. I\'ll also partner with local environmental organizations and create a student green fee that\'s reinvested directly into campus sustainability.',
    askedBy: 'Lisa P.',
    askedAt: 'Feb 10, 2026',
    answeredAt: 'Feb 10, 2026',
    status: 'answered',
    upvotes: 68
  },

  // David Kim (VP - ID: 5)
  {
    id: 'qa9',
    candidateId: '5',
    question: 'When will you improve campus WiFi? It\'s terrible in the dorms.',
    answer: 'WiFi upgrades are my top priority. I\'ve already met with IT and have a plan to upgrade all residence halls by Fall 2026. We\'re adding 50 new access points and tripling bandwidth in high-traffic areas.',
    askedBy: 'Mike H.',
    askedAt: 'Feb 9, 2026',
    answeredAt: 'Feb 11, 2026',
    status: 'answered',
    upvotes: 156
  },
  {
    id: 'qa10',
    candidateId: '5',
    question: 'What will you do about parking issues on campus?',
    answer: 'I propose adding 200 spots in the north lot, implementing a carpool incentive program, and partnering with the city for satellite parking with free shuttle service. Construction can begin as early as Summer 2026.',
    askedBy: 'Rachel G.',
    askedAt: 'Feb 12, 2026',
    answeredAt: 'Feb 13, 2026',
    status: 'answered',
    upvotes: 89
  },

  // Alex Martinez (VP - ID: 6)
  {
    id: 'qa11',
    candidateId: '6',
    question: 'How will you make campus events more exciting and inclusive?',
    answer: 'I\'ll survey students monthly to understand their interests, bring diverse performers and speakers, and host events at various times to accommodate different schedules. I also plan to double our events budget through corporate sponsorships.',
    askedBy: 'Tom B.',
    askedAt: 'Feb 11, 2026',
    answeredAt: 'Feb 12, 2026',
    status: 'answered',
    upvotes: 72
  },
  {
    id: 'qa12',
    candidateId: '6',
    question: 'What type of events are you planning for next year?',
    askedBy: 'Nina S.',
    askedAt: 'Feb 13, 2026',
    status: 'pending',
    upvotes: 45
  },

  // Priya Patel (Secretary - ID: 7)
  {
    id: 'qa13',
    candidateId: '7',
    question: 'How will you improve communication between student government and students?',
    answer: 'I will publish meeting minutes within 48 hours, create a monthly newsletter, host weekly office hours, and develop a user-friendly website where all council documents are archived and searchable.',
    askedBy: 'Chris L.',
    askedAt: 'Feb 10, 2026',
    answeredAt: 'Feb 11, 2026',
    status: 'answered',
    upvotes: 58
  },
  {
    id: 'qa14',
    candidateId: '7',
    question: 'Will meeting minutes be accessible to all students?',
    answer: 'Absolutely! Every meeting minute will be published on our website within 48 hours, and I\'ll send summary emails to all students. Transparency is non-negotiable.',
    askedBy: 'Amanda K.',
    askedAt: 'Feb 12, 2026',
    answeredAt: 'Feb 12, 2026',
    status: 'answered',
    upvotes: 61
  },

  // Rachel Foster (Secretary - ID: 8)
  {
    id: 'qa15',
    candidateId: '8',
    question: 'What digital tools will you implement for student government?',
    answer: 'I plan to launch a mobile app for real-time updates, implement digital voting for council decisions, create automated report generation, and build a student feedback portal. All tools will be student-designed and user-tested.',
    askedBy: 'Kevin P.',
    askedAt: 'Feb 9, 2026',
    answeredAt: 'Feb 10, 2026',
    status: 'answered',
    upvotes: 83
  },
  {
    id: 'qa16',
    candidateId: '8',
    question: 'How soon can we expect the mobile app?',
    askedBy: 'Sophia R.',
    askedAt: 'Feb 13, 2026',
    status: 'pending',
    upvotes: 67
  },

  // Thomas Wright (Secretary - ID: 9)
  {
    id: 'qa17',
    candidateId: '9',
    question: 'How will you amplify student voices in decision-making?',
    answer: 'I\'ll conduct monthly campus-wide surveys with 80%+ response rates through incentives, host open mic sessions, grow our social media presence, and ensure every council meeting includes time for student concerns.',
    askedBy: 'Daniel M.',
    askedAt: 'Feb 11, 2026',
    answeredAt: 'Feb 11, 2026',
    status: 'answered',
    upvotes: 52
  },
  {
    id: 'qa18',
    candidateId: '9',
    question: 'Will you support multilingual communications for ESL students?',
    answer: 'Yes! I plan to translate all major announcements into the top 5 languages spoken on campus and provide interpretation services at important meetings.',
    askedBy: 'Maria G.',
    askedAt: 'Feb 12, 2026',
    answeredAt: 'Feb 13, 2026',
    status: 'answered',
    upvotes: 48
  },

  // James Wilson (Treasurer - ID: 10)
  {
    id: 'qa19',
    candidateId: '10',
    question: 'How will you ensure every dollar is spent responsibly?',
    answer: 'I will implement zero-based budgeting where every expense must be justified, publish monthly financial reports, conduct quarterly budget reviews, and create an emergency fund for unexpected student needs.',
    askedBy: 'Patricia H.',
    askedAt: 'Feb 10, 2026',
    answeredAt: 'Feb 11, 2026',
    status: 'answered',
    upvotes: 74
  },
  {
    id: 'qa20',
    candidateId: '10',
    question: 'What is your plan for the student emergency fund?',
    askedBy: 'Robert J.',
    askedAt: 'Feb 13, 2026',
    status: 'pending',
    upvotes: 56
  },

  // Maya Johnson (Treasurer - ID: 11)
  {
    id: 'qa21',
    candidateId: '11',
    question: 'How will you increase funding for student organizations?',
    answer: 'I will establish a corporate partnership program, apply for educational grants totaling $200,000+, launch alumni fundraising campaigns, and create a crowdfunding platform for student projects. I\'ve already raised $150,000 through similar initiatives.',
    askedBy: 'Lauren S.',
    askedAt: 'Feb 9, 2026',
    answeredAt: 'Feb 10, 2026',
    status: 'answered',
    upvotes: 95
  },
  {
    id: 'qa22',
    candidateId: '11',
    question: 'Which companies are you partnering with?',
    answer: 'I have commitments from 10 local and national companies including tech firms, financial institutions, and retail companies. I can\'t name them publicly yet, but announcements will come soon!',
    askedBy: 'Brandon T.',
    askedAt: 'Feb 12, 2026',
    answeredAt: 'Feb 12, 2026',
    status: 'answered',
    upvotes: 69
  },

  // Kevin Nguyen (Treasurer - ID: 12)
  {
    id: 'qa23',
    candidateId: '12',
    question: 'How will you ensure fair budget allocation across all student groups?',
    answer: 'I will implement a transparent allocation formula based on membership size, event impact, and historical needs. Every organization will have access to the same application process, and I\'ll create an appeal system for fairness.',
    askedBy: 'Jessica W.',
    askedAt: 'Feb 11, 2026',
    answeredAt: 'Feb 12, 2026',
    status: 'answered',
    upvotes: 63
  },
  {
    id: 'qa24',
    candidateId: '12',
    question: 'Will small clubs get fair funding compared to large organizations?',
    answer: 'Absolutely. I\'m creating a micro-grant program specifically for small and new organizations, ensuring they have the resources to grow and succeed.',
    askedBy: 'Tyler M.',
    askedAt: 'Feb 13, 2026',
    answeredAt: 'Feb 13, 2026',
    status: 'answered',
    upvotes: 71
  },
];
