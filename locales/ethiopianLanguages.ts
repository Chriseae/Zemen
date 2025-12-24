// locales/ethiopianLanguages.ts

export interface Language {
    code: string;
    nativeName: string;
    englishName: string;
    family: 'Semitic' | 'Cushitic' | 'Omotic' | 'Nilo-Saharan';
    supportStatus: 'full' | 'partial' | 'planned';
    defaultFallback: 'en' | 'am';
}

export const ETHIOPIAN_LANGUAGES = [
    // SEMITIC LANGUAGES
    // Amharic - Full support
    {
        code: 'am',
        nativeName: 'አማርኛ',
        englishName: 'Amharic',
        family: 'Semitic',
        supportStatus: 'full',
        defaultFallback: 'en'
    },
    // Tigrinya
    {
        code: 'ti',
        nativeName: 'ትግርኛ',
        englishName: 'Tigrinya',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    // Tigre
    {
        code: 'tig',
        nativeName: 'ትግረ',
        englishName: 'Tigre',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    // Geʽez
    {
        code: 'gez',
        nativeName: 'ግእዝ',
        englishName: 'Geʽez',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },

    // GURAGE LANGUAGES
    {
        code: 'sgw',
        nativeName: 'ጫሃ',
        englishName: 'Chaha',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'ior',
        nativeName: 'እንኖር',
        englishName: 'Inor',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'mvz',
        nativeName: 'መስቃን',
        englishName: 'Mesqan',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'muz',
        nativeName: 'ሙሄር',
        englishName: 'Muher',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'stv',
        nativeName: 'ስልጠኛ',
        englishName: 'Siltʼe',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'wle',
        nativeName: 'ወላነ',
        englishName: 'Wolane',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'zwa',
        nativeName: 'ዘይ',
        englishName: 'Zay',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },

    // OTHER SEMITIC
    {
        code: 'agj',
        nativeName: 'አርጎባ',
        englishName: 'Argobba',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'har',
        nativeName: 'ሀረሪ',
        englishName: 'Harari',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'gft',
        nativeName: 'ጋፋት',
        englishName: 'Gafat',
        family: 'Semitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },

    // CUSHITIC LANGUAGES
    {
        code: 'om',
        nativeName: 'Afaan Oromoo',
        englishName: 'Afaan Oromo',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'so',
        nativeName: 'Soomaali',
        englishName: 'Somali',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'aa',
        nativeName: 'Qafar',
        englishName: 'Afar',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'sid',
        nativeName: 'Sidaamu Afoo',
        englishName: 'Sidama',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'hdy',
        nativeName: 'Hadiyyisa',
        englishName: 'Hadiyya',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'ktb',
        nativeName: 'Kambaatissa',
        englishName: 'Kambaata',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'alw',
        nativeName: 'Alaabissa',
        englishName: 'Alaaba',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'drs',
        nativeName: 'Gedeo',
        englishName: 'Gedeo',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'kxc',
        nativeName: 'Konso',
        englishName: 'Konso',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'bji',
        nativeName: 'Burji',
        englishName: 'Burji',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'liq',
        nativeName: 'Libido',
        englishName: 'Libido',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'ssy',
        nativeName: 'Saho',
        englishName: 'Saho',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'byn',
        nativeName: 'ብሊና',
        englishName: 'Bilin',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'ahg',
        nativeName: 'Qimant',
        englishName: 'Qimant',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'am'
    },
    {
        code: 'rel',
        nativeName: 'Rendille',
        englishName: 'Rendille',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'dsh',
        nativeName: 'Dasenech',
        englishName: 'Dasenech',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'arb',
        nativeName: 'Arbore',
        englishName: 'Arbore',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'bsn',
        nativeName: 'Bayso',
        englishName: 'Bayso',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'tsb',
        nativeName: 'Tsʼamai',
        englishName: 'Tsʼamai',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'gwd',
        nativeName: 'Gawwada',
        englishName: 'Gawwada',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'amf',
        nativeName: 'Hamar',
        englishName: 'Hamar',
        family: 'Cushitic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },

    // OMOTIC LANGUAGES
    {
        code: 'wal',
        nativeName: 'Wolaytta',
        englishName: 'Wolaytta (Welaytigna)',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'gmv',
        nativeName: 'Gamo',
        englishName: 'Gamo',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'gof',
        nativeName: 'Gofa',
        englishName: 'Gofa',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'dwr',
        nativeName: 'Dawro',
        englishName: 'Dawro',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'kbr',
        nativeName: 'Kafa',
        englishName: 'Kafa',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'bcq',
        nativeName: 'Bench',
        englishName: 'Bench',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'she',
        nativeName: 'Sheko',
        englishName: 'Sheko',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'bwo',
        nativeName: 'Anfillo',
        englishName: 'Anfillo',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'mdx',
        nativeName: 'Dizi',
        englishName: 'Dizi',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'noz',
        nativeName: 'Nayi',
        englishName: 'Nayi',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'aiw',
        nativeName: 'Aari',
        englishName: 'Aari',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'mdy',
        nativeName: 'Male',
        englishName: 'Male',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'xky',
        nativeName: 'Koyra',
        englishName: 'Koyra',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'zay',
        nativeName: 'Zayse',
        englishName: 'Zayse',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'oyd',
        nativeName: 'Oyda',
        englishName: 'Oyda',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'kxh',
        nativeName: 'Kara',
        englishName: 'Kara',
        family: 'Omotic',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },

    // NILO-SAHARAN LANGUAGES
    {
        code: 'nus',
        nativeName: 'Thok Naath',
        englishName: 'Nuer',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'anu',
        nativeName: 'Anuak',
        englishName: 'Anuak',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'mpe',
        nativeName: 'Majang',
        englishName: 'Majang',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'muz',
        nativeName: 'Mursi',
        englishName: 'Mursi',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'suq',
        nativeName: 'Surma',
        englishName: 'Surma (Suri)',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'mym',
        nativeName: 'Meʼen',
        englishName: 'Meʼen',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'bod',
        nativeName: 'Bodi',
        englishName: 'Bodi',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'yat',
        nativeName: 'Kwegu',
        englishName: 'Kwegu',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'xom',
        nativeName: 'Komo',
        englishName: 'Komo',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'opo',
        nativeName: 'Opo',
        englishName: 'Opo',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'guk',
        nativeName: 'Gumuz',
        englishName: 'Gumuz',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'kun',
        nativeName: 'Kunama',
        englishName: 'Kunama',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    },
    {
        code: 'nnj',
        nativeName: 'Nyangatom',
        englishName: 'Nyangatom',
        family: 'Nilo-Saharan',
        supportStatus: 'planned',
        defaultFallback: 'en'
    }
] as const satisfies readonly Language[]; // Sort alphabetically by native name

// Helper functions
export const getLanguageByCode = (code: string): Language | undefined => {
    return ETHIOPIAN_LANGUAGES.find(lang => lang.code === code) as Language | undefined;
};

export const getLanguagesByFamily = (family: Language['family']): Language[] => {
    return ETHIOPIAN_LANGUAGES.filter(lang => lang.family === family) as Language[];
};

export const getSupportedLanguages = (): Language[] => {
    return ETHIOPIAN_LANGUAGES.filter(lang => lang.supportStatus === 'full' || lang.supportStatus === 'partial') as Language[];
};

export const getStatusIcon = (status: Language['supportStatus']): string => {
    switch (status) {
        case 'full': return '🟢';
        case 'partial': return '🟡';
        case 'planned': return '⚪';
    }
};

export const getStatusLabel = (status: Language['supportStatus']): string => {
    switch (status) {
        case 'full': return 'Full Support';
        case 'partial': return 'Partial Support';
        case 'planned': return 'Planned';
    }
};