// Mock data storage
let mockWalletDataState = {
  balance: 5000,
  pendingBalance: 1200,
  bankAccounts: [
    {
      id: 'bank_1',
      bankName: 'Chase',
      accountType: 'checking',
      last4: '4567',
      routingNumber: '021000021',
      isDefault: true,
    },
    {
      id: 'bank_2',
      bankName: 'Bank of America',
      accountType: 'savings',
      last4: '7890',
      routingNumber: '026009593',
      isDefault: false,
    }
  ],
  cards: [
    {
      id: 'card_1',
      last4: '4242',
      brand: 'visa',
      expMonth: 12,
      expYear: 2024,
      isDefault: true,
    },
    {
      id: 'card_2',
      last4: '5555',
      brand: 'mastercard',
      expMonth: 8,
      expYear: 2025,
      isDefault: false,
    },
  ],
};

// Mock profile data
export const mockProfile = {
  id: '1',
  username: 'johndoe',
  full_name: 'John Doe',
  email: 'john@example.com',
  bio: 'Passionate about creating positive change through collective action.',
  website: 'https://example.com',
  avatar_url: null,
  created_at: '2024-01-22T00:00:00Z',
};

// Mock stats data
export const mockStats = {
  total: 5,
  active: 2,
  successful: 2,
  failed: 1,
  totalRaised: 250000,
};

// Mock campaigns data
export const mockCampaigns = [
  {
    id: 'clean-energy',
    title: 'Clean Energy Initiative',
    status: 'active',
    current_amount: 75000,
    funding_goal: 100000,
  },
  {
    id: 'education-reform',
    title: 'Education Reform',
    status: 'active',
    current_amount: 45000,
    funding_goal: 100000,
  },
  {
    id: 'healthcare-access',
    title: 'Healthcare Access',
    status: 'successful',
    current_amount: 100000,
    funding_goal: 100000,
  },
];

// Wallet data actions
export function getMockWalletData() {
  return mockWalletDataState;
}

export function updateMockWalletBalance(amount: number) {
  mockWalletDataState = {
    ...mockWalletDataState,
    balance: mockWalletDataState.balance + amount
  };
  return mockWalletDataState;
}

// Export wallet data for components that need the initial state
export const mockWalletData = mockWalletDataState;

// Mock transactions data
export const mockTransactions = [
  {
    id: 'txn_1',
    type: 'deposit',
    amount: 15000,
    status: 'completed',
    date: '2024-01-22T15:30:00Z',
    description: 'Campaign success payout: Clean Energy Initiative',
  },
  {
    id: 'txn_2',
    type: 'withdrawal',
    amount: 12000,
    status: 'completed',
    date: '2024-01-21T10:00:00Z',
    description: 'ACH transfer to Chase ****4567',
  },
  {
    id: 'txn_3',
    type: 'deposit',
    amount: 8500,
    status: 'completed',
    date: '2024-01-20T09:15:00Z',
    description: 'Charity redirect: Education Reform (Failed Campaign)',
  },
  {
    id: 'txn_4',
    type: 'withdrawal',
    amount: 5000,
    status: 'completed',
    date: '2024-01-19T14:20:00Z',
    description: 'Partial refund distribution: Healthcare Access',
  },
  {
    id: 'txn_5',
    type: 'deposit',
    amount: 2500,
    status: 'completed',
    date: '2024-01-18T15:30:00Z',
    description: 'Stretch goal bonus: Renewable Energy Project',
  },
  {
    id: 'txn_6',
    type: 'deposit',
    amount: 7500,
    status: 'completed',
    date: '2024-01-17T11:45:00Z',
    description: 'Campaign success payout: Urban Gardens Initiative',
  },
  {
    id: 'txn_7',
    type: 'withdrawal',
    amount: 6000,
    status: 'completed',
    date: '2024-01-16T16:20:00Z',
    description: 'Withdrawal to Visa ****4242',
  },
  {
    id: 'txn_8',
    type: 'deposit',
    amount: 4200,
    status: 'completed',
    date: '2024-01-15T13:10:00Z',
    description: 'Community reward distribution: Local Schools Project',
  },
  {
    id: 'txn_9',
    type: 'withdrawal',
    amount: 3500,
    status: 'completed',
    date: '2024-01-14T10:30:00Z',
    description: 'Challenge completion payout: Public Transit Campaign',
  },
  {
    id: 'txn_10',
    type: 'deposit',
    amount: 9000,
    status: 'completed',
    date: '2024-01-13T09:45:00Z',
    description: 'Campaign success payout: Green Infrastructure',
  },
  {
    id: 'txn_11',
    type: 'withdrawal',
    amount: 7800,
    status: 'completed',
    date: '2024-01-12T14:15:00Z',
    description: 'ACH transfer to Bank of America ****7890',
  },
  {
    id: 'txn_12',
    type: 'deposit',
    amount: 3300,
    status: 'pending',
    date: '2024-01-11T16:30:00Z',
    description: 'Pending success payout: Climate Action Initiative',
  },
  {
    id: 'txn_13',
    type: 'withdrawal',
    amount: 2800,
    status: 'pending',
    date: '2024-01-10T11:20:00Z',
    description: 'Pending refund distribution: Youth Programs',
  },
  {
    id: 'txn_14',
    type: 'withdrawal',
    amount: 4500,
    status: 'pending',
    date: '2024-01-09T15:45:00Z',
    description: 'Pending charity transfer: Environmental Fund',
  },
  {
    id: 'txn_15',
    type: 'deposit',
    amount: 6200,
    status: 'pending',
    date: '2024-01-08T10:10:00Z',
    description: 'Pending stretch goal: Public Parks Project',
  },
  {
    id: 'txn_16',
    type: 'withdrawal',
    amount: 5500,
    status: 'pending',
    date: '2024-01-07T13:25:00Z',
    description: 'Pending withdrawal to Mastercard ****5555',
  },
  {
    id: 'txn_17',
    type: 'deposit',
    amount: 8800,
    status: 'pending',
    date: '2024-01-06T16:50:00Z',
    description: 'Pending community reward: Bike Lane Network',
  },
  {
    id: 'txn_18',
    type: 'withdrawal',
    amount: 7200,
    status: 'pending',
    date: '2024-01-05T09:30:00Z',
    description: 'Pending challenge completion: Zero Waste Program',
  },
  {
    id: 'txn_19',
    type: 'deposit',
    amount: 4800,
    status: 'pending',
    date: '2024-01-04T14:40:00Z',
    description: 'Pending success payout: Urban Forest Initiative',
  },
  {
    id: 'txn_20',
    type: 'withdrawal',
    amount: 3900,
    status: 'pending',
    date: '2024-01-03T11:55:00Z',
    description: 'Pending refund: Solar Panel Project',
  },
  {
    id: 'txn_21',
    type: 'deposit',
    amount: 5000,
    status: 'completed',
    date: '2024-01-02T14:30:00Z',
    description: 'Added Visa card ****4242',
  },
  {
    id: 'txn_22',
    type: 'deposit',
    amount: 2500,
    status: 'completed',
    date: '2024-01-01T16:45:00Z',
    description: 'Added Mastercard ****5555',
  }
];

// Mock campaigns data storage
const mockCampaignsState = {
  'ceo-climate-action': {
    id: 'ceo-climate-action',
    title: 'CEO Pay Cut for Climate Action',
    description: 'Challenge a major airline CEO to take a 50% pay cut until the company achieves specific climate goals, including a 30% reduction in carbon emissions and substantial investment in sustainable aviation fuel.',
    type: 'corporate_advocacy',
    current_amount: 125000,
    funding_goal: 250000,
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-04-15T23:59:59Z',
    target: 'SkyHigh Airlines',
    success_type: 'reward',
    success_description: 'When the CEO accepts the challenge and the company commits to our climate goals, 50% of the funds will be donated to Climate Action Now, while the remainder will fund independent emissions monitoring.',
    failure_type: 'challenge',
    failure_description: 'If the company refuses or fails to meet the goals, funds will launch a high-impact awareness campaign including billboard advertising near their headquarters, targeted digital campaigns, and a documentary exposing corporate climate inaction.',
    creator: {
      username: 'climatejustice',
      avatar_url: null,
      reputation: {
        score: 92,
        successful_campaigns: 3,
        total_raised: 750000,
        total_backers: 8500,
        achievements: [
          {
            id: 'change-maker',
            name: 'Change Maker',
            description: 'Successfully influenced 3 corporate policies',
            icon: 'Target',
            unlockedAt: '2023-12-01T00:00:00Z'
          }
        ]
      }
    },
    pledges: 2156,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Initial Shareholder Engagement',
        description: 'Present proposal at shareholder meeting and secure support from major institutional investors',
        target_date: '2024-02-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-2',
        title: 'Media Campaign Launch',
        description: 'Launch coordinated media campaign highlighting the challenge and building public support',
        target_date: '2024-03-01T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        title: 'Employee Support',
        description: 'Secure support from employee unions and environmental groups within the company',
        target_date: '2024-03-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-4',
        title: 'Board Presentation',
        description: 'Present detailed climate action plan to the board of directors',
        target_date: '2024-04-01T00:00:00Z',
        status: 'pending'
      }
    ],
    votes: 1823,
    hasVoted: false
  },
  'fact-checker': {
    id: 'fact-checker',
    title: 'Fund a Fact-Checker',
    description: 'Support independent fact-checking by funding a dedicated professional to investigate and debunk viral misinformation. Help combat the spread of false information with rigorous, transparent fact-checking.',
    type: 'fail_forward',
    current_amount: 65000,
    funding_goal: 150000,
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-05-01T23:59:59Z',
    target: 'Online Misinformation',
    success_type: 'community',
    success_description: 'When funded, we\'ll hire a professional fact-checker who will publish verified findings on a dedicated platform, overseen by our expert review board.',
    failure_type: 'charity',
    failure_description: 'If the funding goal isn\'t met, funds will be distributed to organizations promoting media literacy and critical thinking skills, as determined by our expert board.',
    creator: {
      username: 'truthseeker',
      avatar_url: null,
      reputation: {
        score: 87,
        successful_campaigns: 2,
        total_raised: 280000,
        total_backers: 3800,
        achievements: [
          {
            id: 'community-builder',
            name: 'Community Builder',
            description: 'Built a strong community of truth advocates',
            icon: 'Users',
            unlockedAt: '2023-11-15T00:00:00Z'
          }
        ]
      }
    },
    pledges: 1245,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Expert Board Formation',
        description: 'Establish review board of subject matter experts across key fields',
        target_date: '2024-03-01T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-2',
        title: 'Platform Development',
        description: 'Create transparent fact-checking platform with methodology documentation',
        target_date: '2024-03-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        title: 'Fact-Checker Selection',
        description: 'Hire qualified fact-checker through rigorous selection process',
        target_date: '2024-04-01T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-4',
        title: 'Operations Launch',
        description: 'Begin regular fact-checking operations with public tracking',
        target_date: '2024-04-15T00:00:00Z',
        status: 'pending'
      }
    ],
    votes: 892,
    hasVoted: false
  },
  'public-apology': {
    id: 'public-apology',
    title: 'The Ultimate Public Apology',
    description: 'Campaign to secure a genuine, meaningful apology from TechCorp\'s CEO for the recent data privacy scandal. Push for real accountability and concrete changes in corporate behavior.',
    type: 'corporate_advocacy',
    current_amount: 85000,
    funding_goal: 200000,
    start_date: '2024-02-10T00:00:00Z',
    end_date: '2024-04-10T23:59:59Z',
    target: 'TechCorp CEO',
    success_type: 'community',
    success_description: 'If a genuine apology meeting our criteria is issued, funds will support privacy advocacy organizations and establish an independent oversight committee.',
    failure_type: 'challenge',
    failure_description: 'If no satisfactory apology is made, funds will create a powerful awareness campaign including affected users\' stories, expert analysis, and creative public installations.',
    creator: {
      username: 'privacymatters',
      avatar_url: null,
      reputation: {
        score: 91,
        successful_campaigns: 3,
        total_raised: 420000,
        total_backers: 5600,
        achievements: [
          {
            id: 'change-maker',
            name: 'Change Maker',
            description: 'Successfully influenced corporate behavior',
            icon: 'Target',
            unlockedAt: '2023-12-01T00:00:00Z'
          }
        ]
      }
    },
    pledges: 1678,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Criteria Definition',
        description: 'Establish clear criteria for what constitutes a genuine apology',
        target_date: '2024-02-25T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-2',
        title: 'Story Collection',
        description: 'Gather and verify stories from affected users',
        target_date: '2024-03-10T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        title: 'Public Pressure',
        description: 'Launch coordinated media and social campaign',
        target_date: '2024-03-25T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-4',
        title: 'Creative Response',
        description: 'Develop impactful public art installation concepts',
        target_date: '2024-04-05T00:00:00Z',
        status: 'pending'
      }
    ],
    votes: 1456,
    hasVoted: false
  },
  'voter-pledge': {
    id: 'voter-pledge',
    title: 'Climate Action Voter Pledge',
    description: 'Build a powerful voting bloc committed to removing climate change deniers from office. We\'re organizing voters to pledge their support for candidates who commit to aggressive climate action policies in the upcoming local elections.',
    type: 'government',
    current_amount: 95000,
    funding_goal: 200000,
    start_date: '2024-02-15T00:00:00Z',
    end_date: '2024-05-15T23:59:59Z',
    target: 'District 7 City Council',
    success_type: 'community',
    success_description: 'When pro-climate candidates commit to our platform and win with pledged voter support, campaign funds will support their climate initiatives and community organizing efforts.',
    failure_type: 'challenge',
    failure_description: 'If no candidates align with our goals or none win, funds will support grassroots climate advocacy groups and opposition campaigns against climate deniers in the next election cycle.',
    creator: {
      username: 'voteforchange',
      avatar_url: null,
      reputation: {
        score: 95,
        successful_campaigns: 4,
        total_raised: 850000,
        total_backers: 12500,
        achievements: [
          {
            id: 'policy-shifter',
            name: 'Policy Shifter',
            description: 'Successfully influenced government policy through campaign action',
            icon: 'Building',
            unlockedAt: '2023-10-01T00:00:00Z'
          }
        ]
      }
    },
    pledges: 3245,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Voter Registration Drive',
        description: 'Register 5,000 new voters in target districts',
        target_date: '2024-03-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-2',
        title: 'Candidate Commitments',
        description: 'Secure public climate action commitments from candidates',
        target_date: '2024-04-01T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        title: 'Community Forums',
        description: 'Host climate policy forums in each target district',
        target_date: '2024-04-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-4',
        title: 'Get Out The Vote',
        description: 'Launch coordinated GOTV campaign for aligned candidates',
        target_date: '2024-05-01T00:00:00Z',
        status: 'pending'
      }
    ],
    votes: 2876,
    hasVoted: false
  },
  'insulin-challenge': {
    id: 'insulin-challenge',
    title: 'The Open-Source Insulin Challenge',
    description: 'A groundbreaking initiative to develop open-source, affordable insulin manufacturing processes. We\'re bringing together researchers, scientists, and pharmaceutical experts to create a publicly available blueprint for low-cost insulin production.',
    type: 'competitive_innovation',
    current_amount: 185000,
    funding_goal: 500000,
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-08-01T23:59:59Z',
    target: 'Global Research Community',
    success_type: 'reward',
    success_description: 'The winning team will receive $400,000 to implement their open-source insulin manufacturing solution, with the remaining funds supporting documentation and distribution of the research.',
    failure_type: 'charity',
    failure_description: 'If no viable solution is presented, funds will be distributed to organizations providing insulin assistance to low-income individuals and diabetes research institutions.',
    creator: {
      username: 'openscience',
      avatar_url: null,
      reputation: {
        score: 88,
        successful_campaigns: 2,
        total_raised: 450000,
        total_backers: 3200,
        achievements: [
          {
            id: 'innovation-pioneer',
            name: 'Innovation Pioneer',
            description: 'Successfully led multiple innovation challenges',
            icon: 'Lightbulb',
            unlockedAt: '2023-11-15T00:00:00Z'
          }
        ]
      }
    },
    pledges: 1567,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Research Teams Registration',
        description: 'Open registration for research teams and establish expert review panel',
        target_date: '2024-03-01T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-2',
        title: 'Initial Proposals',
        description: 'Teams submit detailed proposals and preliminary research plans',
        target_date: '2024-04-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        title: 'Prototype Development',
        description: 'Selected teams develop and test initial manufacturing processes',
        target_date: '2024-06-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-4',
        title: 'Final Submissions',
        description: 'Teams submit final solutions with comprehensive documentation',
        target_date: '2024-07-15T00:00:00Z',
        status: 'pending'
      }
    ],
    votes: 2134,
    hasVoted: false
  },
  'ceo-climate-action': {
    id: 'ceo-climate-action',
    title: 'CEO Pay Cut for Climate Action',
    description: 'Challenge a major airline CEO to take a 50% pay cut until the company achieves specific climate goals, including a 30% reduction in carbon emissions and substantial investment in sustainable aviation fuel.',
    type: 'corporate_advocacy',
    current_amount: 125000,
    funding_goal: 250000,
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-04-15T23:59:59Z',
    target: 'SkyHigh Airlines',
    success_type: 'reward',
    success_description: 'When the CEO accepts the challenge and the company commits to our climate goals, 50% of the funds will be donated to Climate Action Now, while the remainder will fund independent emissions monitoring.',
    failure_type: 'challenge',
    failure_description: 'If the company refuses or fails to meet the goals, funds will launch a high-impact awareness campaign including billboard advertising near their headquarters, targeted digital campaigns, and a documentary exposing corporate climate inaction.',
    creator: {
      username: 'climatejustice',
      avatar_url: null,
      reputation: {
        score: 92,
        successful_campaigns: 3,
        total_raised: 750000,
        total_backers: 8500,
        achievements: [
          {
            id: 'change-maker',
            name: 'Change Maker',
            description: 'Successfully influenced 3 corporate policies',
            icon: 'Target',
            unlockedAt: '2023-12-01T00:00:00Z'
          }
        ]
      }
    },
    pledges: 2156,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Initial Shareholder Engagement',
        description: 'Present proposal at shareholder meeting and secure support from major institutional investors',
        target_date: '2024-02-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-2',
        title: 'Media Campaign Launch',
        description: 'Launch coordinated media campaign highlighting the challenge and building public support',
        target_date: '2024-03-01T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        title: 'Employee Support',
        description: 'Secure support from employee unions and environmental groups within the company',
        target_date: '2024-03-15T00:00:00Z',
        status: 'pending'
      },
      {
        id: 'milestone-4',
        title: 'Board Presentation',
        description: 'Present detailed climate action plan to the board of directors',
        target_date: '2024-04-01T00:00:00Z',
        status: 'pending'
      }
    ],
    votes: 1823,
    hasVoted: false
  },
  'clean-energy': {
    id: 'clean-energy',
    title: 'Clean Energy Initiative',
    description: 'Support the transition to 100% renewable energy in our city by 2030.',
    type: 'government',
    current_amount: 75000,
    funding_goal: 100000,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-03-31T23:59:59Z',
    target: 'City Council',
    success_type: 'reward',
    success_description: 'When we reach our goal, we will fund the installation of solar panels on public buildings.',
    failure_type: 'refund',
    failure_description: 'If we don\'t reach our goal, all contributors will receive an 80% refund.',
    creator: {
      username: 'energyadvocate',
      avatar_url: null,
    },
    pledges: 1234,
  },
  'education-reform': {
    id: 'education-reform',
    title: 'Education Reform',
    description: 'Push for comprehensive education reform in underserved communities.',
    type: 'innovation',
    current_amount: 45000,
    funding_goal: 100000,
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-04-15T23:59:59Z',
    target: 'School Board',
    success_type: 'community',
    success_description: 'When we reach our goal, we will implement after-school programs in 10 schools.',
    failure_type: 'charity',
    failure_description: 'If we don\'t reach our goal, funds will be donated to local education charities.',
    creator: {
      username: 'educhange',
      avatar_url: null,
    },
    pledges: 856,
  },
  'healthcare-access': {
    id: 'healthcare-access',
    title: 'Healthcare Access',
    description: 'Expand healthcare access to rural communities through mobile clinics.',
    type: 'government',
    current_amount: 60000,
    funding_goal: 100000,
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-05-01T23:59:59Z',
    target: 'County Health Department',
    success_type: 'stretch',
    success_description: 'When we reach our goal, we will fund two mobile health clinics.',
    failure_type: 'challenge',
    failure_description: 'If we don\'t reach our goal, campaign creators will volunteer 100 hours at local clinics.',
    creator: {
      username: 'healthaccess',
      avatar_url: null,
    },
    pledges: 967,
  },
};

// Campaign data actions
export function getMockCampaigns() {
  return mockCampaignsState;
}

export function updateMockCampaignAmount(campaignId: string, amount: number) {
  const campaign = mockCampaignsState[campaignId as keyof typeof mockCampaignsState];
  if (campaign) {
    campaign.current_amount += amount;
    campaign.pledges += 1;
    // Calculate new progress
    const progress = (campaign.current_amount / campaign.funding_goal) * 100;
    // Update campaign status if needed
    if (progress >= 100) {
      campaign.status = 'successful';
    }
  }
  return campaign;
}