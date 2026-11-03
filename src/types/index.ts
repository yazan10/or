export type Language = 'ar' | 'en';

export type UserRole = 'user' | 'admin' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLang: Language;
  timezone: string;
  createdAt: string;
  avatarUrl?: string;
  instagramPurchasesCount: number;
  facebookPurchasesCount: number;
}

export type SocialPlatform = 'instagram' | 'facebook';

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  accountName: string;
  username: string;
  accountId: string;
  avatarUrl: string;
  accountType: 'business' | 'creator' | 'page';
  followersCount: number;
  postsCount: number;
  status: 'connected' | 'needs_reauth' | 'permissions_missing' | 'disconnected';
  grantedPermissions: string[];
  lastSyncedAt: string;
  recentMetrics?: {
    avgReach: number;
    avgEngagementRate: number;
    avgReelViews: number;
    postsLast30Days: number;
  };
}

export interface WalletBalances {
  instagramCredits: number;
  facebookCredits: number;
  instagramPurchasesCount: number;
  facebookPurchasesCount: number;
}

export interface CreditLedgerItem {
  id: string;
  userId: string;
  platform: SocialPlatform;
  amount: number;
  type: 'purchase' | 'analysis_consumption' | 'refund' | 'admin_adjustment';
  reason: string;
  timestamp: string;
  balanceAfter: number;
}

export interface PricingTier {
  id: string;
  platform: SocialPlatform;
  tierType: 'first_time' | 'subsequent';
  trialsCount: number;
  priceILS: number;
  descriptionAr: string;
  descriptionEn: string;
}

export interface TopPostMetric {
  id: string;
  title: string;
  type: 'reel' | 'carousel' | 'post' | 'story';
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  retentionNote: string;
  whyItWorked: string;
}

export interface GrowthScenario {
  scenario: 'conservative' | 'moderate' | 'optimistic';
  estimatedReachRange: string;
  estimatedFollowerGrowthRange: string;
  keyAssumptions: string[];
  uncertaintyNotes: string;
}

export interface AnalysisReport {
  id: string;
  userId: string;
  accountId: string;
  accountName: string;
  platform: SocialPlatform;
  performanceScore: number;
  scoreBreakdown: {
    engagementWeight: number; // e.g. 35%
    consistencyWeight: number; // e.g. 25%
    contentDiversityWeight: number; // e.g. 20%
    audienceRetentionWeight: number; // e.g. 20%
    explanation: string;
  };
  executiveSummary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    risks: string[];
  };
  contentMetrics: {
    reelsEngagement: number;
    carouselsEngagement: number;
    staticPostsEngagement: number;
    optimalPostingCadence: string;
    bestDaysAndTimes: string[];
  };
  topPosts: TopPostMetric[];
  bottomPosts: TopPostMetric[];
  actionableRecommendations: {
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    expectedImpact: string;
    targetMetric: string;
  }[];
  dataLimitations: string[];
  growthScenarios: GrowthScenario[];
  confidenceLevel: 'high' | 'medium' | 'low';
  confidenceReason: string;
  dataSourceDisclaimers: {
    metaApiIngested: string[];
    derivedCalculations: string[];
    aiHypotheses: string[];
  };
  createdAt: string;
}

export interface ContentPlanItem {
  day: number;
  dateStr: string;
  contentType: 'reel' | 'carousel' | 'post' | 'story';
  topic: string;
  marketingGoal: 'brand_awareness' | 'lead_generation' | 'community_engagement' | 'direct_sales' | 'retention';
  hook: string;
  scriptOrSlideOutline: string[];
  callToAction: string;
  captionProposal: string;
  suggestedHashtags: string[];
  rationaleFromAudit: string;
  productionNotes: string;
  suggestedTime: string;
}

export interface ContentPlan {
  id: string;
  reportId: string;
  userId: string;
  platform: SocialPlatform;
  monthTitle: string;
  items: ContentPlanItem[];
  createdAt: string;
}

export interface ReportDiscussion {
  reportId: string;
  followUpQuestion?: string;
  followUpAnswer?: string;
  followUpTimestamp?: string;
  chatMessages: {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
  }[];
  totalChatCharsUsed: number;
}

export interface PaymentOrder {
  id: string;
  orderId: string;
  userId: string;
  platform: SocialPlatform;
  tierType: 'first_time' | 'subsequent';
  trialsCount: number;
  amountILS: number;
  amountUSD: number;
  status: 'pending' | 'captured' | 'failed' | 'refunded';
  paypalPaymentId?: string;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  platform: 'all' | 'instagram' | 'facebook';
  type: 'audit_report' | 'content_calendar' | 'follow_up' | 'chat_advisory';
  systemInstruction: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetUserId?: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformName: string;
  defaultLang: Language;
  ilsToUsdRate: number;
  maintenanceMode: boolean;
  followUpMaxChars: number;
  chatMaxChars: number;
  metaAppId: string;
  supportEmail: string;
}
