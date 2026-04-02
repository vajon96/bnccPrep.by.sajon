export interface QuestionAnswer {
  question: string;
  answer: string | string[];
  options?: string[]; 
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  content: QuestionAnswer[];
}

export const BNCC_HISTORY_DATA = {
  title: "বাংলাদেশ ন্যাশনাল ক্যাডেট কোর (BNCC)",
  description: "বাংলাদেশ ন্যাশনাল ক্যাডেট কোর (BNCC) হলো একটি ত্রি-সার্ভিস স্বেচ্ছাসেবী রিজার্ভ প্রতিরক্ষা বাহিনী, যেখানে স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের শিক্ষার্থীরা অংশগ্রহণ করে। এটি Bangladesh Armed Forces-এর সহযোগী প্রতিষ্ঠান এবং দেশের “দ্বিতীয় প্রতিরক্ষা লাইন” হিসেবে কাজ করে।",
  basicInfo: [
    { label: "প্রতিষ্ঠা", value: "২৩ মার্চ ১৯৭৯" },
    { label: "ধরণ", value: "সামরিক রিজার্ভ বাহিনী" },
    { label: "সদর দপ্তর", value: "Uttara, ঢাকা" },
    { label: "ভাষা", value: "বাংলা ও ইংরেজি" },
    { label: "বর্তমান মহাপরিচালক (DG)", value: "ব্রিগেডিয়ার জেনারেল আবু সঈদ আল মাসউদ" },
    { label: "সংযুক্তি", value: "বাংলাদেশ সেনাবাহিনী, নৌবাহিনী ও বিমান বাহিনী" }
  ],
  history: [
    "১৯২৭ সালে University of Dhaka-এ সামরিক প্রশিক্ষণের মাধ্যমে কার্যক্রম শুরু হয়",
    "১৯২৮ সালে “University Training Corps (UTC)” প্রতিষ্ঠা",
    "১৯৪৩ সালে নাম পরিবর্তন হয়ে “UOTC”",
    "১৯৭১ সালের Bangladesh Liberation War-এ সদস্যরা অংশগ্রহণ করে",
    "স্বাধীনতার পর বিভিন্ন ক্যাডেট সংগঠন গঠিত হয়",
    "১৯৭৯ সালে রাষ্ট্রপতি Ziaur Rahman সবগুলো সংগঠন একত্রিত করে BNCC প্রতিষ্ঠা করেন"
  ],
  organization: {
    wings: ["Army Wing", "Naval Wing", "Air Wing", "Air Defence Wing (Proposed)"],
    regiments: [
      { name: "Ramna Regiment", location: "ঢাকা" },
      { name: "Karnaphuli Regiment", location: "চট্টগ্রাম" },
      { name: "Moinamati Regiment", location: "কুমিল্লা" },
      { name: "Sundarban Regiment", location: "খুলনা" },
      { name: "Mohasthan Regiment", location: "রাজশাহী" }
    ],
    flotillas: ["Dhaka Flotilla", "Chattogram Flotilla", "Khulna Flotilla", "Barisal Flotilla (Proposed)"],
    squadrons: ["56 Squadron (ঢাকা)", "57 Squadron (চট্টগ্রাম)", "58 Squadron (যশোর)"]
  },
  ranks: ["Cadet", "Lance Corporal", "Corporal", "Sergeant", "Cadet Under Officer (CUO)"],
  objectives: [
    "তরুণদের শৃঙ্খলাবদ্ধ ও দেশপ্রেমিক নাগরিক হিসেবে গড়ে তোলা",
    "সামরিক সহায়ক বাহিনী তৈরি করা",
    "জাতীয় জরুরি পরিস্থিতিতে সহায়তা প্রদান"
  ]
};

export const BNCC_PERSONNEL_DATA = {
  dg: {
    name: "ব্রিগেডিয়ার জেনারেল আবু সঈদ আল মাসউদ",
    rank: "Director General (DG), Bangladesh National Cadet Corps",
    joined: "১৬ জানুয়ারি ২০২৫",
    militaryInfo: {
      commissioned: "১৬ ডিসেম্বর ১৯৯৩",
      course: "২৯তম লং কোর্স",
      institution: "Bangladesh Military Academy",
      birthplace: "Jashore"
    },
    education: [
      "Defence Services Command and Staff College (DSCSC)",
      "National Defence College (NDC)",
      "Masters in Defence Studies (National University)",
      "Masters in Security & Development (BUP)"
    ],
    career: [
      "17, 27, 1, 9 East Bengal Regiment",
      "29 Bangladesh Infantry Regiment (BIR)",
      "NCO’s Academy (NCOA)",
      "Special Security Force (SSF)",
      "Grade-1 Staff Officer, Army HQ",
      "Deputy Director General, Border Guard Bangladesh (BGB)",
      "Commander, 101 Infantry Brigade (Cumilla Cantonment)"
    ],
    international: [
      "Operation Kuwait Punorgothon (OKP-7)",
      "UN Peacekeeping Mission (UNMIS) – Sudan"
    ]
  },
  armyWing: [
    {
      regiment: "Ramna Regiment (ঢাকা)",
      commander: "Lt Col Muhammed Ishaque, BGBM, psc",
      adjutants: ["Maj Md Shahriar Kabir", "Maj Kamrul Hasan", "Maj Mst. Nashreen Mustary", "Maj Md Mursalin Ibne Siddique, psc", "Maj Abu Rifat Md Motaleb, psc"]
    },
    {
      regiment: "Karnaphuli Regiment (চট্টগ্রাম)",
      commander: "Lt Col Mohammad Sadiqur Rahman, PPMS, psc",
      adjutants: ["Maj Md Rafiqul Hasan Rafi"]
    },
    {
      regiment: "Moinamati Regiment (কুমিল্লা)",
      commander: "Lt Col Rashedul Hasan Prince, Inf",
      adjutants: ["Maj Muntasir Arafat"]
    },
    {
      regiment: "Sundarban Regiment (খুলনা)",
      commander: "Lt Col Masud Rayhan",
      adjutants: ["Maj Polash Kummer Biswas"]
    },
    {
      regiment: "Mohasthan Regiment (রাজশাহী)",
      commander: "Lt Col Golam Kabir, psc",
      adjutants: ["Maj Md Mashkurur Rahman Rawnak, psc", "Maj M A Rakib"]
    }
  ],
  navalWing: {
    deputyDirector: "Lt Cdr M Rakibul Islam",
    commanders: [
      { unit: "Khulna Flotilla", name: "Lt Tanzim Zaman Tayin" },
      { unit: "Chattogram Flotilla", name: "Lt Md Shafiul Islam" }
    ]
  },
  airWing: {
    ocWing: "Sqn Ldr Shaikh Zillur Rahaman",
    squadrons: [
      { unit: "56 Squadron (Dhaka)", name: "Flt Lt Iftekhar Uddin Leemon" },
      { unit: "57 Squadron (Chattogram)", name: "Flt Lt Nahid Hasan Shuvo" },
      { unit: "58 Squadron (Jashore)", name: "Flt Lt Md Al Nafiur Rahman" }
    ]
  }
};

export const BNCC_DATA: Section[] = [
  {
    id: "general-knowledge",
    title: "সাধারণ জ্ঞান (General Knowledge)",
    icon: "Globe",
    content: [
      {
        question: "বিএনসিসি (BNCC) কোন মন্ত্রণালয়ের অধীনে?",
        answer: "প্রতিরক্ষা মন্ত্রণালয়।",
        options: ["শিক্ষা মন্ত্রণালয়", "প্রতিরক্ষা মন্ত্রণালয়", "স্বরাষ্ট্র মন্ত্রণালয়", "মুক্তিযুদ্ধ বিষয়ক মন্ত্রণালয়"]
      },
      {
        question: "বিএনসিসি (BNCC)-র মূলমন্ত্র কয়টি?",
        answer: "৩ টি (জ্ঞান ও শৃঙ্খলা)।",
        options: ["১ টি", "২ টি", "৩ টি", "৪ টি"]
      },
      {
        question: "বাংলাদেশ ন্যাশনাল ক্যাডেট কোর সেনা শাখায় সর্বমোট কতটি ব্যাটালিয়ন আছে?",
        answer: "২৫ টি।",
        options: ["২০ টি", "২২ টি", "২৫ টি", "৩০ টি"]
      },
      {
        question: "সশস্ত্র বাহিনী দিবস কবে পালিত হয়?",
        answer: "২১শে নভেম্বর।",
        options: ["১৬ই ডিসেম্বর", "২৬শে মার্চ", "২১শে নভেম্বর", "৭ই নভেম্বর"]
      },
      {
        question: "১৯৭১ সালে মুক্তিযুদ্ধের সময় চট্টগ্রাম কত নম্বর সেক্টরের অধীনে ছিল?",
        answer: "১ নং সেক্টরের অধীনে।",
        options: ["১ নং", "২ নং", "৯ নং", "১১ নং"]
      },
      {
        question: "BNCC কবে প্রতিষ্ঠিত হয়?",
        answer: "২৩ মার্চ ১৯৭৯",
        options: ["১৯৭১", "১৯৭৫", "১৯৭৯", "১৯৮২"]
      },
      {
        question: "BNCC-র বর্তমান মহাপরিচালক কে?",
        answer: "ব্রিগেডিয়ার জেনারেল আবু সঈদ আল মাসউদ",
        options: ["মেজর জেনারেল আজিজ আহমেদ", "ব্রিগেডিয়ার জেনারেল আবু সঈদ আল মাসউদ", "লেঃ কর্ণেল সাদিক", "মেজর রফিকুল হাসান"]
      },
      {
        question: "BNCC-র সদর দপ্তর কোথায়?",
        answer: "উত্তরা, ঢাকা",
        options: ["সাভার, ঢাকা", "উত্তরা, ঢাকা", "মিরপুর, ঢাকা", "মতিঝিল, ঢাকা"]
      },
      {
        question: "BNCC-র কয়টি উইং রয়েছে?",
        answer: "৩টি",
        options: ["২টি", "৩টি", "৪টি", "৫টি"]
      },
      {
        question: "কর্ণফুলী রেজিমেন্ট কোথায় অবস্থিত?",
        answer: "চট্টগ্রাম",
        options: ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী"]
      },
      {
        question: "ময়নামতি রেজিমেন্ট কোথায় অবস্থিত?",
        answer: "কুমিল্লা",
        options: ["ঢাকা", "চট্টগ্রাম", "খুলনা", "কুমিল্লা"]
      },
      {
        question: "সুন্দরবন রেজিমেন্ট কোথায় অবস্থিত?",
        answer: "খুলনা",
        options: ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী"]
      },
      {
        question: "মহাস্থান রেজিমেন্ট কোথায় অবস্থিত?",
        answer: "রাজশাহী",
        options: ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী"]
      },
      {
        question: "রমনা রেজিমেন্ট কোথায় অবস্থিত?",
        answer: "ঢাকা",
        options: ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী"]
      },
      {
        question: "BNCC-র মূলমন্ত্র কী?",
        answer: "জ্ঞান ও শৃঙ্খলা",
        options: ["একতা ও শক্তি", "জ্ঞান ও শৃঙ্খলা", "সেবা ও ত্যাগ", "সাহস ও দেশপ্রেম"]
      },
      {
        question: "BNCC-র বর্তমান মহাপরিচালক (DG) কবে দায়িত্ব গ্রহণ করেন?",
        answer: "১৬ জানুয়ারি ২০২৫",
        options: ["১ জানুয়ারি ২০২৫", "১৬ জানুয়ারি ২০২৫", "২৬ মার্চ ২০২৪", "১৬ ডিসেম্বর ২০২৪"]
      },
      {
        question: "ব্রিগেডিয়ার জেনারেল আবু সঈদ আল মাসউদ কততম লং কোর্সের মাধ্যমে কমিশন লাভ করেন?",
        answer: "২৯তম লং কোর্স",
        options: ["২৫তম", "২৭তম", "২৯তম", "৩১তম"]
      },
      {
        question: "BNCC মহাপরিচালকের জন্মস্থান কোথায়?",
        answer: "যশোর",
        options: ["ঢাকা", "চট্টগ্রাম", "যশোর", "কুমিল্লা"]
      },
      {
        question: "BNCC মহাপরিচালক কোন প্রতিষ্ঠানের গ্র্যাজুয়েট?",
        answer: "DSCSC ও NDC",
        options: ["BMA ও DSCSC", "NDC ও BUP", "DSCSC ও NDC", "National University ও BMA"]
      },
      {
        question: "BNCC মহাপরিচালক কোন আন্তর্জাতিক মিশনে অংশগ্রহণ করেছেন?",
        answer: "সুদান ও কুয়েত",
        options: ["সুদান ও কঙ্গো", "কুয়েত ও মালি", "সুদান ও কুয়েত", "হাইতি ও সুদান"]
      },
      {
        question: "রমনা রেজিমেন্টের বর্তমান কমান্ডার কে?",
        answer: "লেঃ কর্ণেল মুহাম্মদ ইসহাক",
        options: ["লেঃ কর্ণেল গোলাম কবির", "লেঃ কর্ণেল মুহাম্মদ ইসহাক", "লেঃ কর্ণেল রাশেদুল হাসান", "লেঃ কর্ণেল মাসুদ রায়হান"]
      },
      {
        question: "কর্ণফুলী রেজিমেন্টের বর্তমান কমান্ডার কে?",
        answer: "লেঃ কর্ণেল মোহাম্মদ সাদিকুর রহমান",
        options: ["লেঃ কর্ণেল গোলাম কবির", "লেঃ কর্ণেল মুহাম্মদ ইসহাক", "লেঃ কর্ণেল মোহাম্মদ সাদিকুর রহমান", "লেঃ কর্ণেল মাসুদ রায়হান"]
      },
      {
        question: "ময়নামতি রেজিমেন্টের বর্তমান কমান্ডার কে?",
        answer: "লেঃ কর্ণেল রাশেদুল হাসান প্রিন্স",
        options: ["লেঃ কর্ণেল গোলাম কবির", "লেঃ কর্ণেল রাশেদুল হাসান প্রিন্স", "লেঃ কর্ণেল মোহাম্মদ সাদিকুর রহমান", "লেঃ কর্ণেল মাসুদ রায়হান"]
      },
      {
        question: "সুন্দরবন রেজিমেন্টের বর্তমান কমান্ডার কে?",
        answer: "লেঃ কর্ণেল মাসুদ রায়হান",
        options: ["লেঃ কর্ণেল গোলাম কবির", "লেঃ কর্ণেল রাশেদুল হাসান প্রিন্স", "লেঃ কর্ণেল মোহাম্মদ সাদিকুর রহমান", "লেঃ কর্ণেল মাসুদ রায়হান"]
      },
      {
        question: "মহাস্থান রেজিমেন্টের বর্তমান কমান্ডার কে?",
        answer: "লেঃ কর্ণেল গোলাম কবির",
        options: ["লেঃ কর্ণেল গোলাম কবির", "লেঃ কর্ণেল রাশেদুল হাসান প্রিন্স", "লেঃ কর্ণেল মোহাম্মদ সাদিকুর রহমান", "লেঃ কর্ণেল মাসুদ রায়হান"]
      },
      {
        question: "নৌ উইং-এর ডেপুটি ডিরেক্টর কে?",
        answer: "লেঃ কমান্ডার এম রাকিবুল ইসলাম",
        options: ["লেঃ কমান্ডার এম রাকিবুল ইসলাম", "স্কোয়াড্রন লিডার শেখ জিল্লুর রহমান", "লেঃ তানজিম জামান তাইন", "লেঃ মোঃ শফিউল ইসলাম"]
      },
      {
        question: "এয়ার উইং-এর ওসি উইং কে?",
        answer: "স্কোয়াড্রন লিডার শেখ জিল্লুর রহমান",
        options: ["লেঃ কমান্ডার এম রাকিবুল ইসলাম", "স্কোয়াড্রন লিডার শেখ জিল্লুর রহমান", "ফ্লাইট লেঃ ইফতেখার উদ্দিন লিমন", "ফ্লাইট লেঃ নাহিদ হাসান শুভ"]
      },
      {
        question: "৫৬ স্কোয়াড্রন (ঢাকা) এর অধিনায়ক কে?",
        answer: "ফ্লাইট লেঃ ইফতেখার উদ্দিন লিমন",
        options: ["ফ্লাইট লেঃ ইফতেখার উদ্দিন লিমন", "ফ্লাইট লেঃ নাহিদ হাসান শুভ", "ফ্লাইট লেঃ মোঃ আল নাফিউর রহমান", "স্কোয়াড্রন লিডার শেখ জিল্লুর রহমান"]
      },
      {
        question: "৫৭ স্কোয়াড্রন (চট্টগ্রাম) এর অধিনায়ক কে?",
        answer: "ফ্লাইট লেঃ নাহিদ হাসান শুভ",
        options: ["ফ্লাইট লেঃ ইফতেখার উদ্দিন লিমন", "ফ্লাইট লেঃ নাহিদ হাসান শুভ", "ফ্লাইট লেঃ মোঃ আল নাফিউর রহমান", "স্কোয়াড্রন লিডার শেখ জিল্লুর রহমান"]
      },
      {
        question: "৫৮ স্কোয়াড্রন (যশোর) এর অধিনায়ক কে?",
        answer: "ফ্লাইট লেঃ মোঃ আল নাফিউর রহমান",
        options: ["ফ্লাইট লেঃ ইফতেখার উদ্দিন লিমন", "ফ্লাইট লেঃ নাহিদ হাসান শুভ", "ফ্লাইট লেঃ মোঃ আল নাফিউর রহমান", "স্কোয়াড্রন লিডার শেখ জিল্লুর রহমান"]
      },
      {
        question: "BNCC-র দ্বিতীয় প্রতিরক্ষা লাইন (Second Line of Defence) বলা হয় কেন?",
        answer: "সশস্ত্র বাহিনীর সহযোগী রিজার্ভ ফোর্স হিসেবে",
        options: ["পুলিশের সহযোগী হিসেবে", "সশস্ত্র বাহিনীর সহযোগী রিজার্ভ ফোর্স হিসেবে", "সীমান্ত রক্ষার জন্য", "আইন শৃঙ্খলা রক্ষার জন্য"]
      },
      {
        question: "BNCC-র সদর দপ্তরের অবস্থান কোথায়?",
        answer: "উত্তরা, ঢাকা",
        options: ["সাভার", "উত্তরা", "মিরপুর", "বনানী"]
      }
    ]
  },
  {
    id: "fieldcraft-tactics",
    title: "ফিল্ডক্র্যাফট ও রণকৌশল (Fieldcraft & Tactics)",
    icon: "Map",
    content: [
      {
        question: "সঠিক দূরত্ব নির্ণয়ের পদ্ধতি কয়টি?",
        answer: "৫টি।",
        options: ["৩টি", "৪টি", "৫টি", "৬টি"]
      },
      {
        question: "ছদ্মবেশ ও গোপনীয়তার নীতিমালা কয়টি?",
        answer: "০২ টি।",
        options: ["০২ টি", "০৩ টি", "০৪ টি", "০৫ টি"]
      },
      {
        question: "সামরিক ভাষায় চাল কত প্রকার?",
        answer: "০৪ প্রকার।",
        options: ["০২ প্রকার", "০৩ প্রকার", "০৪ প্রকার", "০৫ প্রকার"]
      }
    ]
  }
];
