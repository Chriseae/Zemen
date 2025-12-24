
import { TranslationResource } from './types';

const en: TranslationResource = {
  common: {
    appName: "ZemenAI",
    loading: "Loading...",
    error: "Error",
  },
  sidebar: {
    newChat: "New Chat",
    library: "Knowledge Library",
    projects: "Projects",
    legacyWallet: "Legacy Wallet",
    wallet: "Wallet",
    referrals: "Referrals",
    settings: "Settings",
    recent: "Recent",
    rename: "Rename",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this chat session? This action cannot be undone.",
  },
  chat: {
    welcomeTitle: "Welcome to ZemenAI",
    welcomeSubtitle: "Click 'New Chat' on the sidebar to start.",
    inputPlaceholder: "Type your message here...",
    listening: "Listening...",
    disclaimer: "ZemenAI may make mistakes. Please check important information.",
    liveError: "Live Error",
    actions: {
      copy: "Copy",
      readAloud: "Read Aloud",
      goodResponse: "Good response",
      badResponse: "Bad response",
      share: "Share",
      more: "More",
      report: "Report",
      reportSuccess: "Message reported",
    },
  },
  library: {
    title: "Knowledge Library",
    description: "Upload files, manage your content, and transform your data into personalized AI intelligence.",
    searchPlaceholder: "Search library...",
    tabs: {
      all: "All",
      documents: "Documents",
      articles: "Articles",
      summaries: "Summaries",
    },
    emptyState: "No items found.",
    actions: {
      open: "Open",
      pin: "Pin",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this file?",
      download: "Download",
    },
    upload: {
      buttonLabel: "Attach File",
      dropLabel: "Drop files here",
      status: {
        waiting: "Waiting...",
        uploading: "Uploading...",
        processing: "Processing dataset...",
        training: "Training personal model...",
        complete: "Ready",
        failed: "Upload failed",
      },
      error: {
        retry: "Retry",
        generic: "Upload failed — try again",
      },
    },
  },
  projects: {
    title: "Projects",
    description: "Organize your chats, files, and tasks into dedicated workspaces.",
    newProject: "New Project",
    createCard: "Create New Project",
    stats: {
      tasks: "Tasks",
      files: "Files",
    },
    status: {
      active: "Active",
      archived: "Archived"
    }
  },
  wallet: {
    title: "Wallet Overview",
    balance: {
      available: "Available Balance",
      equivalent: "≈ $42.60 USD (Soft Peg)"
    },
    actions: {
      send: "Send",
      receive: "Receive",
      buy: "Buy ZMX"
    },
    transactions: {
      title: "Transactions",
      filters: {
        all: "All",
        incoming: "Incoming",
        outgoing: "Outgoing",
        rewards: "Rewards"
      },
      empty: "No transactions yet.",
      status: {
        completed: "Completed",
        pending: "Pending",
        failed: "Failed"
      }
    },
    sendModal: {
      title: "Send ZMX",
      recipient: "Recipient Address",
      amount: "Amount (ZMX)",
      note: "Note (Optional)",
      submit: "Send Now"
    },
    receiveModal: {
      title: "Receive ZMX",
      addressLabel: "Your Wallet Address",
      copy: "Copy Address",
      share: "Share Address",
      note: "This is your personal ZemenAI chain wallet address."
    }
  },
  referrals: {
    title: "Referral Dashboard",
    stats: {
      earnings: "Total Earnings",
      active: "Active Referrals",
      pending: "Pending Rewards",
      rank: "Rank"
    },
    linkBox: {
      label: "Your Referral Link",
      copy: "Copy Link",
      copied: "Copied!",
      share: "Share",
      footer: "Share your link with entrepreneurs, creators, and founders."
    },
    rewards: {
      title: "Reward Tiers",
      signup: "Sign-up",
      pro: "Buy Pro",
      max: "Buy Max"
    },
    table: {
      title: "Referral Activity",
      cols: {
        friend: "Friend",
        date: "Date",
        plan: "Plan",
        reward: "Reward",
        status: "Status"
      }
    },
    cta: {
      text: "Help shape the future of African AI. Earn ZMX for every friend you bring into the ecosystem.",
      button: "Share My Link"
    }
  },
  settings: {
    title: "Settings",
    sections: {
      general: "General",
      model: "Model & Intelligence",
      data: "Data & Privacy",
    },
    labels: {
      account: "Account",
      motherTongue: "Mother Tongue",
      theme: "Theme",
      language: "Language",
      aiModel: "AI Model",
      memory: "Long-term Memory",
      notifications: "Notifications",
      clearData: "Clear All Conversations",
      clearDataButton: "Clear Data",
    },
  },
  landing: {
    hero: {
      title: "ZemenAI",
      subtitle: "Your Amharic AI Assistant",
      cta: "Strat For Free"
    },
    pricing: {
      title: "Pricing that grows with your needs.",
      subtitle: "Choose the plan that empowers your work — from simple chat to advanced research and automation.",
      monthly: "Monthly",
      yearly: "Yearly",
      saveBadge: "Save 17%",
      billedMonthly: "billed monthly",
      billedAnnually: "billed annually",
      plan_free: {
        title: "Starter",
        subtitle: "Meet ZemenAI",
        price: "$0",
        features: [
          "Chat with ZemenAI on web, iOS, and Android",
          "Write, edit, and create content",
          "Analyze text and upload images",
          "Generate code and visualize data",
          "Maintain consistency and earn ZMX by using it daily",
          "Earn by completing tasks",
          "Stay updated by using the knowledge library",
          "Get more opportunities by inviting people"
        ],
        cta: "Launch Starter"
      },
      plan_pro: {
        title: "Pro",
        subtitle: "Research, code, and organize",
        monthlyPrice: "$12",
        yearlyPrice: "$9.96",
        features: [
          "In addition to the features in the Starter plan, you will also have:",
          "Access more ZemenAI models",
          "Unlimited Projects to organize chats",
          "Unlock advanced research tools",
          "Utilize extended reasoning for complex tasks",
          "Connect Google Workspace: email, calendar, and docs",
          "Integrations with remote MCP",
          "Includes completion boosts"
        ],
        cta: "Go Pro"
      },
      plan_max: {
        title: "Enterprise",
        subtitle: "Higher limits, priority access",
        monthlyPrice: "From $60",
        yearlyPrice: "From $49.8",
        features: [
          "In addition to the features in Pro, you will have:",
          "Higher output limits for all tasks",
          "Early access to advanced ZemenAI features",
          "Priority access at high traffic times",
          "Higher value reward points",
          "Manage larger files",
          "Referral super-bonus",
          "Priority access during traffic congestion",
          "Includes 10x Completion Boosts"
        ],
        cta: "Go Enterprise"
      }
    }
  },
  checkout: {
    title: "Checkout",
    back: "Back",
    orderSummary: "Order Summary",
    billedNow: "Billed now",
    total: "Total due today",
    payWithCard: "Pay with Card",
    emailLabel: "Email",
    cardLabel: "Card Information",
    nameLabel: "Name on card",
    countryLabel: "Country or region",
    payButton: "Subscribe",
    secure: "Secured by Stripe",
    success: "Payment Successful!",
    processing: "Processing payment...",
  },
  onboarding: {
    interests: {
      title: "Welcome to ZemenAI?",
      subtitle: "Select 3 interests to help us personalize your experience.",
      items: {
        creative: "Creative Writing",
        business: "Business & Strategy",
        education: "Learning & Education",
        health: "Health & Wellness",
        technology: "Technology & Code",
        history: "History & Heritage",
        culture: "Culture & Art",
        news: "News & Current Events"
      }
    },
    intro: {
      title: "Hey there, I’m ZemenAI.",
      blocks: {
        ask: { title: "Curious? Just ask", description: "Chat with me about anything—from quick questions to complex ideas. I’m always ready to help (literally)." },
        safety: { title: "I’m built to help, never harm", description: "Automated safeguards protect our conversations from generating violent, abusive, or deceptive content." },
        improve: { title: "Help ZemenAI improve for everyone", description: "We use your chats and coding sessions to train and improve ZemenAI. You can change this setting anytime in your Privacy Settings." }
      },
      toggleLabel: "Help Improve ZemenAI",
      cta: "I Understand"
    },
    auth: {
      title: "Create your account",
      subtitle: "Join ZemenAI to save your chats and access more features.",
      google: "Sign up with Google",
      apple: "Sign up with Apple",
      facebook: "Sign up with Facebook",
      email: "Continue with Email",
      footer: "Already have an account?",
      footerLink: "Sign In"
    }
  }
};

export default en;
