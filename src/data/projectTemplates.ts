// data/projectTemplates.ts
import { ProjectTemplate } from '../types/agentTypes';

export const projectTemplates: ProjectTemplate[] = [
    {
        id: 'doc_translation',
        title: 'Document Translation',
        titleAm: 'የሰነድ ትርጉም',
        description: 'Translate documents between Amharic, English, and other languages with cultural context',
        descriptionAm: 'ሰነዶችን በአማርኛ፣ እንግሊዘኛ እና በሌሎች ቋንቋዎች መካከል በባህላዊ ትርጉም ይተርጉሙ',
        category: 'translation',
        estimatedDuration: '3-7 days',
        icon: '🌐',
        exampleGoal: 'Translate my 50-page business proposal from Amharic to English, maintaining professional tone',
        exampleGoalAm: 'የ50 ገጽ የንግድ ሀሳቤን ከአማርኛ ወደ እንግሊዘኛ በሙያዊ ቃና በመጠበቅ ተርጉም',
        suggestedMilestones: [
            'Document analysis complete',
            'Translation 50% done',
            'Cultural review complete',
            'Final delivery'
        ]
    },
    {
        id: 'business_plan',
        title: 'Business Plan Development',
        titleAm: 'የንግድ ዕቅድ ልማት',
        description: 'Create comprehensive business plans with market research, financials, and strategy',
        descriptionAm: 'የገበያ ምርምር፣ ፋይናንስ እና ስትራቴጂን የያዘ አጠቃላይ የንግድ ዕቅድ ይፍጠሩ',
        category: 'business',
        estimatedDuration: '2-4 weeks',
        icon: '📊',
        exampleGoal: 'Develop a complete business plan for my coffee export startup including market analysis and 3-year financial projections',
        exampleGoalAm: 'የገበያ ትንተና እና የ3 ዓመት የፋይናንስ ትንበያን ጨምሮ ለቡና ወደ ውጭ የማስወጣት ስራ ጅማሬ ሙሉ የንግድ ዕቅድ አዘጋጅ',
        suggestedMilestones: [
            'Market research complete',
            'Financial model done',
            'Draft plan ready',
            'Final review and polish'
        ]
    },
    {
        id: 'thesis_writing',
        title: 'Academic Thesis Writing',
        titleAm: 'የአካዳሚክ ጽሁፍ ጽሁፍ',
        description: 'Research, outline, and write academic papers with proper citations',
        descriptionAm: 'በትክክለኛ ማጣቀሻዎች ምርምር፣ ረቂቅ እና አካዳሚክ ወረቀቶችን ይጻፉ',
        category: 'academic',
        estimatedDuration: '1-3 months',
        icon: '🎓',
        exampleGoal: 'Write my master\'s thesis on sustainable agriculture in Ethiopia, including literature review and data analysis',
        exampleGoalAm: 'በኢትዮጵያ ዘላቂ ግብርና ላይ የማስተርስ ዲግሪ ወረቀቴን፣ የሥነ ጽሑፍ ዳሰሳ እና የመረጃ ትንተና ጨምሮ ጻፍ',
        suggestedMilestones: [
            'Literature review complete',
            'Research methodology defined',
            'Data collection finished',
            'Analysis complete',
            'Draft chapters ready',
            'Final thesis submitted'
        ]
    },
    {
        id: 'legal_docs',
        title: 'Legal Document Preparation',
        titleAm: 'የህግ ሰነድ ዝግጅት',
        description: 'Draft legal documents, contracts, and briefs with Ethiopian law context',
        descriptionAm: 'በኢትዮጵያ ህግ አውድ የህግ ሰነዶችን፣ ውሎችን እና አጭሮችን ረቂቅ',
        category: 'legal',
        estimatedDuration: '1-2 weeks',
        icon: '⚖️',
        exampleGoal: 'Prepare a comprehensive employment contract template compliant with Ethiopian labor law',
        exampleGoalAm: 'ከኢትዮጵያ የሰራተኛ ህግ ጋር የሚጣጣም አጠቃላይ የቅጥር ውል አብነት አዘጋጅ',
        suggestedMilestones: [
            'Legal research complete',
            'Draft document ready',
            'Review and compliance check',
            'Final delivery'
        ]
    },
    {
        id: 'content_localization',
        title: 'Content Localization',
        titleAm: 'የይዘት አካባቢያዊነት',
        description: 'Adapt websites, apps, or content for Ethiopian market with cultural relevance',
        descriptionAm: 'ድረገጾችን፣ መተግበሪያዎችን ወይም ይዘትን ለኢትዮጵያ ገበያ በባህላዊ ተገቢነት ያስማሙ',
        category: 'content',
        estimatedDuration: '2-3 weeks',
        icon: '🌍',
        exampleGoal: 'Localize my e-commerce website for Ethiopian users, including Amharic translation and cultural adaptations',
        exampleGoalAm: 'የእኔን የኢ-ኮሜርስ ድህረ ገጽ ለኢትዮጵያ ተጠቃሚዎች፣ የአማርኛ ትርጉም እና የባህል ማስተካከያዎችን ጨምሮ አካባቢያዊ አድርግ',
        suggestedMilestones: [
            'Content audit complete',
            'Translation finished',
            'Cultural adaptation done',
            'Testing and QA',
            'Launch ready'
        ]
    },
    {
        id: 'research_report',
        title: 'Research Report',
        titleAm: 'የምርምር ሪፖርት',
        description: 'Conduct research and compile comprehensive reports on any topic',
        descriptionAm: 'ምርምር ያድርጉ እና በማንኛውም ርዕስ ላይ አጠቃላይ ሪፖርቶችን ያቅርቡ',
        category: 'academic',
        estimatedDuration: '1-2 weeks',
        icon: '🔍',
        exampleGoal: 'Research and compile a report on renewable energy opportunities in Ethiopia',
        exampleGoalAm: 'በኢትዮጵያ ውስጥ ስለ ታዳሽ ኢነርጂ እድሎች ምርምር እና ሪፖርት አዘጋጅ',
        suggestedMilestones: [
            'Research plan defined',
            'Data collection complete',
            'Analysis finished',
            'Report draft ready',
            'Final report delivered'
        ]
    },
    {
        id: 'presentation_deck',
        title: 'Presentation Creation',
        titleAm: 'የአቀራረብ ፍጥረት',
        description: 'Design professional presentations for business, academic, or personal use',
        descriptionAm: 'ለንግድ፣ ለአካዳሚክ ወይም ለግል አጠቃቀም ሙያዊ አቀራረቦችን ዲዛይን ያድርጉ',
        category: 'business',
        estimatedDuration: '3-5 days',
        icon: '📽️',
        exampleGoal: 'Create a 20-slide investor pitch deck for my tech startup with data visualizations',
        exampleGoalAm: 'ለቴክኖሎጂ ጅማሬዬ የመረጃ ምስላዊነት ያለው የ20 ስላይድ የባለሃብት አቀራረብ መድረክ ፍጠር',
        suggestedMilestones: [
            'Content outline ready',
            'Slide design complete',
            'Data visualizations done',
            'Final review'
        ]
    },
    {
        id: 'custom_project',
        title: 'Custom Project',
        titleAm: 'ብጁ ፕሮጀክት',
        description: 'Define your own unique project goal and let the AI agent plan it',
        descriptionAm: 'የራስዎን ልዩ የፕሮጀክት ግብ ይግለጹ እና AI ወኪሉ እንዲያቅድበት ይፍቀዱ',
        category: 'other',
        estimatedDuration: 'Variable',
        icon: '✨',
        exampleGoal: 'I have a unique project in mind...',
        exampleGoalAm: 'አንድ ልዩ ፕሮጀክት በአእምሮዬ አለኝ...',
        suggestedMilestones: []
    }
];

export const getTemplateById = (id: string): ProjectTemplate | undefined => {
    return projectTemplates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: string): ProjectTemplate[] => {
    return projectTemplates.filter(t => t.category === category);
};