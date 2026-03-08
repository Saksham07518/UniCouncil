export interface QuizQuestion {
  id: string;
  question: string;
  category: 'academic' | 'facilities' | 'social' | 'environmental' | 'financial';
  options: {
    text: string;
    image: string;
    candidateIds: string[]; // Candidates who align with this answer
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What should be the top priority for the Student Council?',
    category: 'social',
    options: [
      {
        text: 'Mental health support and student wellness programs',
        image: 'https://images.unsplash.com/photo-1613618958001-ee9ad8f01f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBzdHVkZW50JTIwc3VwcG9ydHxlbnwxfHx8fDE3NzE3NzA0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '4']
      },
      {
        text: 'Career development and internship opportunities',
        image: 'https://images.unsplash.com/photo-1640163561337-b0d4161f7ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcm5zaGlwfGVufDF8fHx8MTc3MTc3MDQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['2']
      },
      {
        text: 'Diversity, inclusion, and cultural representation',
        image: 'https://images.unsplash.com/photo-1760883344496-080500945e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNpdHklMjBpbmNsdXNpb24lMjBwZW9wbGV8ZW58MXx8fHwxNzcxNzAzMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['3']
      },
      {
        text: 'Campus events and community building',
        image: 'https://images.unsplash.com/photo-1758850891011-1089de343ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wdXMlMjBldmVudCUyMHBhcnR5fGVufDF8fHx8MTc3MTc3MDQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['6']
      }
    ]
  },
  {
    id: 'q2',
    question: 'How should student council communicate with students?',
    category: 'social',
    options: [
      {
        text: 'Regular open forums and town halls',
        image: 'https://images.unsplash.com/photo-1761714994809-fd89944324f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duJTIwaGFsbCUyMG1lZXRpbmclMjBzcGVha2luZ3xlbnwxfHx8fDE3NzE3NzA0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '3', '10']
      },
      {
        text: 'Digital platforms, mobile apps, and social media',
        image: 'https://images.unsplash.com/photo-1669311540088-8d44f4ab2cd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwaG9uZSUyMHNvY2lhbCUyMG1lZGlhfGVufDF8fHx8MTc3MTc3MDQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['8', '9']
      },
      {
        text: 'Published reports and detailed documentation',
        image: 'https://images.unsplash.com/photo-1712812824597-1781d19a2acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHJlcG9ydCUyMHBhcGVyfGVufDF8fHx8MTc3MTc3MDQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['7']
      },
      {
        text: 'Direct surveys and feedback portals',
        image: 'https://images.unsplash.com/photo-1650046825506-8901c4b837b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2ZXklMjBmZWVkYmFjayUyMGZvcm0lMjBjaGVja2xpc3R8ZW58MXx8fHwxNzcxNzcwNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['9', '8']
      }
    ]
  },
  {
    id: 'q3',
    question: 'What environmental initiative is most important?',
    category: 'environmental',
    options: [
      {
        text: 'Solar panels and renewable energy',
        image: 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHJvb2Z8ZW58MXx8fHwxNzcxNzcwNDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['4']
      },
      {
        text: 'Comprehensive recycling and composting programs',
        image: 'https://images.unsplash.com/photo-1650112274147-03a2dba421c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBiaW5zJTIwY29sb3JlZHxlbnwxfHx8fDE3NzE3NzA0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['4']
      },
      {
        text: 'Carbon neutrality and waste reduction',
        image: 'https://images.unsplash.com/photo-1672887928631-4b8f2d0abef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZXJvJTIwd2FzdGUlMjBncmVlbnxlbnwxfHx8fDE3NzE3NzA0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['4']
      },
      {
        text: 'Not my top priority right now',
        image: 'https://images.unsplash.com/photo-1687709644302-8eceed73f2dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZ2VuZXJpY3xlbnwxfHx8fDE3NzE3NzA0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '2', '3', '5', '6', '7', '8', '9', '10', '11', '12']
      }
    ]
  },
  {
    id: 'q4',
    question: 'How should the student budget be allocated?',
    category: 'financial',
    options: [
      {
        text: 'Increase funding for student organizations',
        image: 'https://images.unsplash.com/photo-1728404059704-d4232080b338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY2x1YiUyMGdyb3VwfGVufDF8fHx8MTc3MTc3MDQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '6', '11']
      },
      {
        text: 'Invest in academic support programs',
        image: 'https://images.unsplash.com/photo-1706528010331-0f12582db334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBzdHVkeXxlbnwxfHx8fDE3NzE2NjM2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['2']
      },
      {
        text: 'Improve campus facilities and infrastructure',
        image: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBidWlsZGluZyUyMHJlbm92YXRpb258ZW58MXx8fHwxNzcxNzcwNDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['5']
      },
      {
        text: 'Create emergency funds and equitable distribution',
        image: 'https://images.unsplash.com/photo-1599585183326-87b1fff61c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBmdW5kJTIwbW9uZXl8ZW58MXx8fHwxNzcxNzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['10', '12']
      }
    ]
  },
  {
    id: 'q5',
    question: 'What academic improvement is most needed?',
    category: 'academic',
    options: [
      {
        text: 'Peer tutoring and study support programs',
        image: 'https://images.unsplash.com/photo-1589995635011-078e0bb91d11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXRvciUyMHRlYWNoaW5nfGVufDF8fHx8MTc3MTc3MDQ5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['2']
      },
      {
        text: 'Extended library hours during exams',
        image: 'https://images.unsplash.com/photo-1718327453695-4d32b94c90a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzcxNzcwNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['5', '1']
      },
      {
        text: 'Diverse curriculum and inclusive education',
        image: 'https://images.unsplash.com/photo-1627288912905-3245a1a6585b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MTc3MDQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['3']
      },
      {
        text: 'Research opportunities and career preparation',
        image: 'https://images.unsplash.com/photo-1707944746058-4da338d0f827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFiJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzcxNzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['2']
      }
    ]
  },
  {
    id: 'q6',
    question: 'What facility improvement is most urgent?',
    category: 'facilities',
    options: [
      {
        text: 'Better Wi-Fi and tech infrastructure',
        image: 'https://images.unsplash.com/photo-1610571648632-7500e6e7c0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWZpJTIwaW50ZXJuZXQlMjB0ZWNofGVufDF8fHx8MTc3MTc3MDQ5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['5', '8']
      },
      {
        text: 'More study spaces and collaboration rooms',
        image: 'https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkeSUyMHJvb218ZW58MXx8fHwxNzcxNzQzOTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['5']
      },
      {
        text: 'Improved campus safety and lighting',
        image: 'https://images.unsplash.com/photo-1764955210511-64fa119fe0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wdXMlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzE3NzA0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['5']
      },
      {
        text: 'Cultural centers and inclusive spaces',
        image: 'https://images.unsplash.com/photo-1680264370818-659352fa16f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbG91bmdlfGVufDF8fHx8MTc3MTc3MDQ5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['3']
      }
    ]
  },
  {
    id: 'q7',
    question: 'How important is transparency in student government?',
    category: 'social',
    options: [
      {
        text: 'Extremely important - publish all decisions and budgets',
        image: 'https://images.unsplash.com/photo-1750935578389-6e1445f5fd8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjByZXBvcnQlMjBkb2N1bWVudHxlbnwxfHx8fDE3NzE3NzA1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['7', '10', '12']
      },
      {
        text: 'Very important - digital tools for accountability',
        image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBzY3JlZW58ZW58MXx8fHwxNzcxNzcwNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['8']
      },
      {
        text: 'Important - regular communication and surveys',
        image: 'https://images.unsplash.com/photo-1762340275877-32d64414d8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2ZXklMjBwb2xsJTIwY2hlY2tsaXN0fGVufDF8fHx8MTc3MTc3MDUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '9']
      },
      {
        text: 'Important - but focus more on results',
        image: 'https://images.unsplash.com/photo-1633431303895-8236f0a04b46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0YWJsZXxlbnwxfHx8fDE3NzE3NzA1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['2', '3', '4', '5', '6', '11']
      }
    ]
  },
  {
    id: 'q8',
    question: 'What type of events should the council prioritize?',
    category: 'social',
    options: [
      {
        text: 'Career fairs and networking events',
        image: 'https://images.unsplash.com/photo-1561489422-45de3d015e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJlZXIlMjBmYWlyfGVufDF8fHx8MTc3MTc3MDUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['2']
      },
      {
        text: 'Cultural celebrations and diversity events',
        image: 'https://images.unsplash.com/photo-1767127465486-c0a63236374a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwcGFyYWRlfGVufDF8fHx8MTc3MTc3MDUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['3']
      },
      {
        text: 'Large-scale campus events and entertainment',
        image: 'https://images.unsplash.com/photo-1723743809746-15c7b0e7bcf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBzdGFnZXxlbnwxfHx8fDE3NzE3NDA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['6']
      },
      {
        text: 'Sustainability workshops and community service',
        image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwcGxhbnRpbmclMjB0cmVlc3xlbnwxfHx8fDE3NzE3NzA1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['4']
      }
    ]
  },
  {
    id: 'q9',
    question: 'What is your view on student organization funding?',
    category: 'financial',
    options: [
      {
        text: 'Increase through fundraising and partnerships',
        image: 'https://images.unsplash.com/photo-1769867626569-e61d02806e69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdW5kcmFpc2luZyUyMGV2ZW50JTIwc2lnbnxlbnwxfHx8fDE3NzE3NzA1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['11']
      },
      {
        text: 'Ensure fair and equitable distribution',
        image: 'https://images.unsplash.com/photo-1760089449852-e8cade7feb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxhbmNlJTIwc2NhbGVzJTIwanVzdGljZXxlbnwxfHx8fDE3NzE3NzA1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['12']
      },
      {
        text: 'Focus on financial transparency and reporting',
        image: 'https://images.unsplash.com/photo-1762279389020-eeeb69c25813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydCUyMGdyYXBofGVufDF8fHx8MTc3MTc3MDUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['10']
      },
      {
        text: 'Significantly increase overall budget',
        image: 'https://images.unsplash.com/photo-1766399654246-af81527574a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25leSUyMGJ1ZGdldCUyMGluY3JlYXNlfGVufDF8fHx8MTc3MTc3MDUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '6']
      }
    ]
  },
  {
    id: 'q10',
    question: 'What leadership quality is most important to you?',
    category: 'social',
    options: [
      {
        text: 'Innovation and modernization',
        image: 'https://images.unsplash.com/photo-1770632067760-70ac2cb9ec3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMGJ1bGJ8ZW58MXx8fHwxNzcxNzcwNTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['8']
      },
      {
        text: 'Proven track record of results',
        image: 'https://images.unsplash.com/photo-1759701546980-1211be084c70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBhd2FyZCUyMHdpbm5lcnxlbnwxfHx8fDE3NzE3NTM4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['1', '2', '4', '5', '10']
      },
      {
        text: 'Commitment to diversity and inclusion',
        image: 'https://images.unsplash.com/photo-1655720359248-eeace8c709c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNpdHklMjBoYW5kcyUyMGNpcmNsZXxlbnwxfHx8fDE3NzE3NzA1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['3']
      },
      {
        text: 'Strong communication and engagement',
        image: 'https://images.unsplash.com/photo-1764874299006-bf4266427ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBzcGVha2luZyUyMHBvZGl1bXxlbnwxfHx8fDE3NzE3NzA1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        candidateIds: ['7', '9']
      }
    ]
  }
];

export interface QuizResult {
  candidateId: string;
  score: number;
  matchPercentage: number;
}

export function calculateQuizResults(answers: Record<string, number>): QuizResult[] {
  const candidateScores: Record<string, number> = {};
  
  // Count total possible matches
  const totalQuestions = Object.keys(answers).length;
  
  // Calculate scores for each candidate
  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question && question.options[optionIndex]) {
      const matchingCandidates = question.options[optionIndex].candidateIds;
      matchingCandidates.forEach(candidateId => {
        candidateScores[candidateId] = (candidateScores[candidateId] || 0) + 1;
      });
    }
  });
  
  // Convert to results with percentages
  const results: QuizResult[] = Object.entries(candidateScores).map(([candidateId, score]) => ({
    candidateId,
    score,
    matchPercentage: Math.round((score / totalQuestions) * 100)
  }));
  
  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  return results;
}
