import { TranslationResource } from './types';

const am: TranslationResource = {
  common: {
    appName: "ዘመናይ",
    loading: "በመጫን ላይ...",
    error: "ስህተት",
  },
  sidebar: {
    newChat: "አዲስ ውይይት",
    library: "የእውቀት ቤተ-መጽሀፍት",
    projects: "ፕሮጀክቶች",
    legacyWallet: "የቀድሞ ቦርሳ",
    wallet: "ቦርሳ",
    referrals: "ግብዣዎች",
    settings: "ቅንብሮች",
    recent: "የቅርብ ጊዜ",
    rename: "ስም ቀይር",
    delete: "ሰርዝ",
    deleteConfirm: "ይህንን የውይይት ክፍለ ጊዜ መሰረዝ ይፈልጋሉ? ይህ እርምጃ ሊቀለበስ አይችልም።",
  },
  chat: {
    welcomeTitle: "እንኳን ወደ ዘመናይ በደህና መጡ",
    welcomeSubtitle: "ለመጀመር በጎን ባኩ 'አዲስ ውይይት' የሚለውን ይጫኑ።",
    inputPlaceholder: "ጥያቄዎን እዚህ ያስገቡ...",
    listening: "በማዳመጥ ላይ...",
    disclaimer: "ዘመናይ ስህተት ሊሰራ ይችላል። እባክዎ ጠቃሚ መረጃዎችን ያረጋግጡ።",
    liveError: "የቀጥታ ስርጭት ስህተት",
    actions: {
      copy: "ቅዳ",
      readAloud: "አንብብ",
      goodResponse: "ጥሩ ነው",
      badResponse: "ጥሩ አይደለም",
      share: "አጋራ",
      more: "ተጨማሪ",
      report: "ሪፖርት አድርግ",
      reportSuccess: "መልዕክት ሪፖርት ተደርጓል",
    },
  },
  library: {
    title: "የእውቀት ቤተ-መጽሀፍት",
    description: "ፋይሎችን ይጫኑ፣ ይዘትዎን ያስተዳድሩ፣ መረጃን ወደ ግል ኤአይ እውቀት ይለውጡ።",
    searchPlaceholder: "ቤተ-መጽሀፍትን ይፈልጉ...",
    tabs: {
      all: "ሁሉም",
      documents: "ሰነዶች",
      articles: "ጽሁፎች",
      summaries: "ማጠቃለያዎች",
    },
    emptyState: "ምንም የተገኘ ነገር የለም።",
    actions: {
      open: "ክፈት",
      pin: "ለጥፍ",
      delete: "ሰርዝ",
      deleteConfirm: "ይህንን ፋይል መሰረዝ ይፈልጋሉ?",
      download: "አውርድ",
    },
    upload: {
      buttonLabel: "ፋይል ያያይዙ",
      dropLabel: "ፋይሎችን እዚህ ይጣሉ",
      status: {
        waiting: "በመጠበቅ ላይ...",
        uploading: "በመጫን ላይ...",
        processing: "ዳታሴት በማዘጋጀት ላይ...",
        training: "የግል ሞዴል በማሰልጠን ላይ...",
        complete: "ዝግጁ",
        failed: "መጫን አልተሳካም",
      },
      error: {
        retry: "እንደገና ሞክር",
        generic: "መጫን አልተሳካም - እንደገና ይሞክሩ",
      },
    },
  },
  projects: {
    title: "ፕሮጀክቶች",
    description: "ውይይቶችዎን፣ ፋይሎችዎን እና ተግባራትዎን በሙሉ የስራ ቦታዎች ያደራጁ।",
    newProject: "አዲስ ፕሮጀክት",
    createCard: "አዲስ ፕሮጀክት ይፍጠሩ",
    stats: {
      tasks: "ተግባራት",
      files: "ፋይሎች",
    },
    status: {
      active: "ንቁ",
      archived: "የተቀመጠ"
    }
  },
  wallet: {
    title: "የቦርሳ አጠቃላይ እይታ",
    balance: {
      available: "ያለውት ቀሪ ሂሳብ",
      equivalent: "≈ $42.60 USD"
    },
    actions: {
      send: "ላክ",
      receive: "ተቀበል",
      buy: "ZMX ይግዙ"
    },
    transactions: {
      title: "እንቅስቃሴዎች",
      filters: {
        all: "ሁሉም",
        incoming: "ገቢ",
        outgoing: "ወጪ",
        rewards: "ሽልማቶች"
      },
      empty: "ምንም እንቅስቃሴ የለም።",
      status: {
        completed: "ተጠናቀቀ",
        pending: "በመጠባበቅ ላይ",
        failed: "አልተሳካም"
      }
    },
    sendModal: {
      title: "ZMX ላክ",
      recipient: "የተቀባይ አድራሻ",
      amount: "መጠን (ZMX)",
      note: "ማስታወሻ (አማራጭ)",
      submit: "አሁን ላክ"
    },
    receiveModal: {
      title: "ZMX ተቀበል",
      addressLabel: "የቦርሳ አድራሻዎ",
      copy: "አድራሻ ቅዳ",
      share: "አድራሻ አጋራ",
      note: "ይህ የእርስዎ የግል የዘመናይ ቼይን ቦርሳ አድራሻ ነው።"
    }
  },
  referrals: {
    title: "የግብዣ ዳሽቦርድ",
    stats: {
      earnings: "ጠቅላላ ገቢ",
      active: "ንቁ ግብዣዎች",
      pending: "በመጠባበቅ ላይ ያሉ",
      rank: "ደረጃ"
    },
    linkBox: {
      label: "የእርስዎ የመጋበዣ ሊንክ",
      copy: "ሊንክ ቅዳ",
      copied: "ተቀድቷል!",
      share: "አጋራ",
      footer: "ሊንኩን ለስራ ምሥጥሮች እና ጓደኞች ያጋሩ።"
    },
    rewards: {
      title: "የሽልማት ደረጃዎች",
      signup: "ምዝገባ",
      pro: "Pro ሲገዙ",
      max: "Max ሲገዙ"
    },
    table: {
      title: "የግብዣ እንቅስቃሴ",
      cols: {
        friend: "ጓደኛ",
        date: "ቀን",
        plan: "ፕላን",
        reward: "ሽልማት",
        status: "ምናታ"
      }
    },
    cta: {
      text: "የአፍሪካን ኤአይ ወደፊት ለመቅረጽ ያግዙ። ለሚጋብዙት እያንዳንዱ ጓደኛ ZMX ያግኙ።",
      button: "ሊንክን አጋራ"
    }
  },
  settings: {
    title: "ቅንብሮች",
    sections: {
      general: "አጠቃላይ",
      model: "ሞዴል እና ብልህነት",
      data: "መረጃ እና ግላዊነት",
    },
    labels: {
      account: "መለያ",
      motherTongue: "የአፍ መፍቻ ቋንቋ",
      theme: "ገጽታ",
      language: "ቋንቋ",
      aiModel: "ኤአይ ሞዴል",
      memory: "የረጅም ጊዜ ማህደረ ትውስታ",
      notifications: "ማሳወቂያዎች",
      clearData: "ሁሉንም ውይይቶች አጽዳ",
      clearDataButton: "መረጃን አጽዳ",
    },
  },
  landing: {
    hero: {
      title: "ዘመናይ",
      subtitle: "የእርስዎ የአማርኛ ኤአይ ረዳት",
      cta: "በነጻ ይጀምሩ"
    },
    pricing: {
      title: "ከፍላጎትዎ ጋር የሚያድግ እሴት",
      subtitle: "ስራዎን የሚያጎለብት እቅድ ይምረጡ — ከቀላል ውይይት እስከ የላቀ ምርምር እና አውቶሜሽን",
      monthly: "በወር",
      yearly: "በዓመት",
      saveBadge: "17% ይቆጥቡ",
      billedMonthly: "በየወሩ የሚከፈል",
      billedAnnually: "በዓመቱ የሚከፈል",
      plan_free: {
        title: "ስታርተር",
        subtitle: "ከዘመናይ ጋር ይተዋወቁ",
        price: "$0",
        features: [
          "በድረ-ገጽ፣ iOS እና Android ከዘመናይ ጋር ይወያዩ",
          "ይጻፉ፣ ያርቅቁ እና ይፍጠሩ",
          "ጽሁፎችን ይተንትኑ እና ምስሎችን ይጫኑ",
          "ኮድ ያመንጩ እንዲሁም መረጃዎችን በምስል ይግለጹ",
          "በየቀኑ በመጠቀም ተጨማሪ ጥቅም ያግኙ",
          "ተግባራትን በማጠናቀቅ ትርፋማ ይሁኑ",
          "የእውቀት ቤተ-መጽሐፍትን በመጠቀም ይዘምኑ",
          "ሰዎችን በመጋበዝ ተጨማሪ ዕድሎችን ያግኙ"
        ],
        cta: "ስታርተርን ያግኙ"
      },
      plan_pro: {
        title: "ፕሮ",
        subtitle: "ምርምር፣ ኮድ እና ማደራጀት",
        monthlyPrice: "$12",
        yearlyPrice: "$9.96",
        features: [
          "በነጻ ውስጥ ካሉት እሴቶች በተጨማሪ የሚከተሉት ይኖሩታል",
          "ተጨማሪ የዘመናይ ሞዴሎችን ማግኘት",
          "ያልተገደቡ ፕሮጀክቶች ውይይቶችን ለማደራጀት",
          "ጥልቅ የምርምር መሳሪያዎችን ይክፈቱ",
          "ለተወሳሰቡ ስራዎች የተራዘመ ማሰብን ይጠቀሙ",
          "ከሩቅ MCP ጋር ውህደቶች",
          "የማጠናቀቂያ ማበረታቻዎች ያካትታል"
        ],
        cta: "ፕሮን ያግኙ"
      },
      plan_max: {
        title: "እንተርፕራይዝ",
        subtitle: "ከፍተኛ ገደቦች፣ ቅድሚያ ማግኘት",
        monthlyPrice: "ከ $60",
        yearlyPrice: "ከ $49.8",
        features: [
          "በፕሮ ውስጥ ካሉት እሴትቶች በተጨማሪ የሚከተሉት ይኖሩታል",
          "ለሁሉም ተግባራት ከፍተኛ የውጤት ገደቦች",
          "ለላቁ የዘመናይ ባህሪያት ቀድሞ ማግኘት",
          "ከፍተኛ ዋጋ ያላቸው የሽልማት ነጥቦች",
          "ትላልቅ ፋይሎችን ማስተዳደር",
          "የሪፈራል ሱፐር-ጉርሻ",
          "በትራፊክ መጨናነቅ ጊዜ ቅድሚያ ማግኘት",
          "10x የማጠናቀቂያ ማበረታቻዎች ያካትታል"
        ],
        cta: "እንተርፕራይዝ ያግኙ"
      }
    }
  },
  checkout: {
    title: "ክፍያ",
    back: "ተመለስ",
    orderSummary: "የክፍያ ማጠቃለያ",
    billedNow: "አሁን የሚከፈል",
    total: "ጠቅላላ ክፍያ",
    payWithCard: "በካርድ ይክፈሉ",
    emailLabel: "ኢሜይል",
    cardLabel: "የካርድ መረጃ",
    nameLabel: "የካርድ ስም",
    countryLabel: "ሀገር ወይም ክልል",
    payButton: "ይመዝገቡ",
    secure: "በ Stripe የተጠበቀ",
    success: "ክፍያ ተሳክቷል!",
    processing: "ክፍያ በመፈጸም ላይ...",
  },
  onboarding: {
    interests: {
      title: "እንኳን ወደ ዘመናይ በደህና መጡ",
      subtitle: "ልምድዎን ለእርስዎ ተስማሚ ለማድረግ 3 ፍላጎቶችን ይምረጡ።",
      items: {
        creative: "ምጥረ ጽሁፍ",
        business: "ቢዝነስ እና ስትራተጂ",
        education: "ትምህርት እና ጥናት",
        health: "ጤና እና ደህንነት",
        technology: "ቴክኖሎጂ እና ኮድ",
        history: "ታሪክ እና ቅርስ",
        culture: "ባህል እና ጥበብ",
        news: "ዜና እና ወቅታዊ መረጃ"
      }
    },
    intro: {
      title: "የዘመናይ መለያ ይፍጠሩ",
      blocks: {
        ask: { title: "የሆነ ነገር ማወቅ ይፈልጋሉ? ብቻ ይጠይቁ", description: "ስለ ማንኛውም ነገር ከእኔ ጋር ይወያዩ—ከቀላል ጥያቄዎች እስከ ውስብስብ ሀሳቦች። ሁሌም ለመርዳት ዝግጁ ነኝ።" },
        safety: { title: "እና ለመርዳት እንጂ ለመጉዳት አልተመረኩም", description: "ራስ-ሰር መከላከያዎች ንግግራቻችንን ከአደገኛ፣ ከስድብ ወይም ከአታላይ ይዘት ይጠብቃሉ።" },
        improve: { title: "ዘመናይን ለሁሉም የተሻለ እንዲሆን ያግዙ", description: "ዘመናይን ለማሰልጠን እና ለማሻሻል የእርስዎን ውይይቶች እንጠቀማለን። ይህንን ቅንብር በማንኛውም ጊዜ በግላዊነት ቅንብሮች ውስጥ መቀየር ይችላሉ።" }
      },
      toggleLabel: "ዘመናይን ማሻሻል ያግዙ",
      cta: "ተረድቻለሁ"
    },
    auth: {
      title: "መለያ ይፍጠሩ",
      subtitle: "ውይይቶችዎን ለማስቀመጥ እና ተጨማሪ ባህሪያትን ለማግኘት ዘመናይን ይቀላቀሉ።",
      google: "በ Google ይመዝገቡ",
      apple: "በ Apple ይመዝገቡ",
      facebook: "በ Facebook ይመዝገቡ",
      email: "በኢሜይል ይቀጥሉ",
      footer: "አካውንት አለዎት?",
      footerLink: "ይግቡ"
    }
  }
};

export default am;