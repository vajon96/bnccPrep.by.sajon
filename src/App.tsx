import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  Globe, 
  Map, 
  Crosshair, 
  HeartPulse, 
  ChevronDown, 
  Search, 
  Menu, 
  X, 
  BookOpen, 
  Award,
  ShieldCheck,
  ArrowRight,
  Info,
  Trophy,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  History,
  Users,
  Target,
  Milestone,
  UserCheck,
  GraduationCap,
  Briefcase,
  Plane,
  Anchor,
  Shield,
  Calendar,
  MessageSquare,
  Send,
  Loader2,
  BrainCircuit,
  FileText,
  ListChecks
} from 'lucide-react';
import { BNCC_DATA, BNCC_HISTORY_DATA, BNCC_PERSONNEL_DATA, Section, QuestionAnswer } from './constants';

const IconMap: Record<string, any> = {
  Globe,
  Map,
  Crosshair,
  HeartPulse
};

type AppMode = 'study' | 'quiz' | 'about' | 'ai-quiz';

interface AIQuestion {
  type: 'short' | 'long' | 'mcq';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('study');
  const [activeSection, setActiveSection] = useState<string>(BNCC_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // AI Quiz State
  const [aiQuizType, setAiQuizType] = useState<'short' | 'long' | 'mcq' | null>(null);
  const [currentAIQuestion, setCurrentAIQuestion] = useState<AIQuestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUserAnswer, setAiUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiEvaluating, setAiEvaluating] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [aiTotalQuestions, setAiTotalQuestions] = useState(0);

  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (!aiRef.current && process.env.GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  const generateAIQuestion = async (type: 'short' | 'long' | 'mcq') => {
    if (!aiRef.current) return;
    
    setAiLoading(true);
    setAiFeedback(null);
    setAiUserAnswer('');
    setAiQuizType(type);
    
    const bnccContext = JSON.stringify({
      history: BNCC_HISTORY_DATA,
      personnel: BNCC_PERSONNEL_DATA,
      general: BNCC_DATA
    });

    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following BNCC (Bangladesh National Cadet Corps) data, generate a ${type} question for a promotion exam.
        
        Data: ${bnccContext}
        
        Requirements:
        - If type is 'mcq', provide 4 options and the correct answer.
        - If type is 'short', provide a question that can be answered in 1-2 sentences and the model answer.
        - If type is 'long', provide a descriptive question and a detailed model answer.
        - The question and answer should be in Bengali.
        - Return the response in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['short', 'long', 'mcq'] },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Only for mcq type"
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["type", "question", "correctAnswer"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setCurrentAIQuestion(data as AIQuestion);
      setAiTotalQuestions(prev => prev + 1);
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const evaluateAIAnswer = async () => {
    if (!aiRef.current || !currentAIQuestion || !aiUserAnswer) return;

    if (currentAIQuestion.type === 'mcq') {
      const isCorrect = aiUserAnswer === currentAIQuestion.correctAnswer;
      setAiFeedback(isCorrect ? "সঠিক উত্তর!" : `ভুল উত্তর। সঠিক উত্তর হলো: ${currentAIQuestion.correctAnswer}`);
      if (isCorrect) setAiScore(prev => prev + 1);
      return;
    }

    setAiEvaluating(true);
    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Evaluate the user's answer for the following BNCC question.
        
        Question: ${currentAIQuestion.question}
        Model Answer: ${currentAIQuestion.correctAnswer}
        User's Answer: ${aiUserAnswer}
        
        Provide feedback in Bengali, highlighting what was correct and what was missing. Rate the answer out of 10.
        Return the response in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.STRING },
              score: { type: Type.NUMBER, description: "Score out of 10" }
            },
            required: ["feedback", "score"]
          }
        }
      });

      const evaluation = JSON.parse(response.text || '{}');
      setAiFeedback(evaluation.feedback);
      if (evaluation.score >= 7) setAiScore(prev => prev + 1);
    } catch (error) {
      console.error("AI Evaluation Error:", error);
      setAiFeedback("মূল্যায়ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setAiEvaluating(false);
    }
  };

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<(QuestionAnswer & { sectionTitle: string })[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startQuiz = () => {
    const allQuestions = BNCC_DATA.flatMap(section => 
      section.content.map(q => ({ ...q, sectionTitle: section.title }))
    );
    // Shuffle and pick 10
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setMode('quiz');
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentQ = quizQuestions[currentQuizIndex];
    if (option === currentQ.answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const currentSection = BNCC_DATA.find(s => s.id === activeSection) || BNCC_DATA[0];

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-card border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 15 }}
                onClick={() => setMode('study')}
                className="p-2.5 joyful-gradient rounded-2xl text-white shadow-lg shadow-green-200 cursor-pointer"
              >
                <ShieldCheck size={28} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-black text-military-green tracking-tight leading-none">BNCC <span className="text-vibrant-orange">Prep</span></h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-1">Promotion Exam 2026</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setMode('study')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  mode === 'study' ? 'bg-white shadow-md text-military-green' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BookOpen size={18} /> পড়াশোনা
              </button>
              <button
                onClick={() => setMode('about')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  mode === 'about' ? 'bg-white shadow-md text-military-green' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <History size={18} /> পরিচিতি
              </button>
              <button
                onClick={() => setMode('ai-quiz')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  mode === 'ai-quiz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BrainCircuit size={18} /> AI কুইজ
              </button>
              <button
                onClick={startQuiz}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  mode === 'quiz' ? 'bg-vibrant-orange text-white shadow-lg shadow-orange-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Zap size={18} /> কুইজ টেস্ট
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="প্রশ্ন খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-2xl text-sm focus:border-military-green w-64 transition-all outline-none"
                />
              </div>
              <button 
                className="md:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setMode('study'); setIsMenuOpen(false); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl font-bold text-xs ${mode === 'study' ? 'bg-military-green/10 text-military-green border-2 border-military-green' : 'bg-slate-50 text-slate-500'}`}
                  >
                    <BookOpen size={20} /> পড়াশোনা
                  </button>
                  <button
                    onClick={() => { setMode('about'); setIsMenuOpen(false); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl font-bold text-xs ${mode === 'about' ? 'bg-blue-50 text-vibrant-blue border-2 border-vibrant-blue' : 'bg-slate-50 text-slate-500'}`}
                  >
                    <History size={20} /> পরিচিতি
                  </button>
                  <button
                    onClick={() => { setMode('ai-quiz'); setIsMenuOpen(false); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl font-bold text-xs ${mode === 'ai-quiz' ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-600' : 'bg-slate-50 text-slate-500'}`}
                  >
                    <BrainCircuit size={20} /> AI কুইজ
                  </button>
                  <button
                    onClick={() => { startQuiz(); setIsMenuOpen(false); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl font-bold text-xs ${mode === 'quiz' ? 'bg-vibrant-orange/10 text-vibrant-orange border-2 border-vibrant-orange' : 'bg-slate-50 text-slate-500'}`}
                  >
                    <Zap size={20} /> কুইজ
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {mode === 'study' ? (
            <motion.div
              key="study-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Hero Section */}
              <section className="relative py-12 md:py-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full joyful-gradient opacity-[0.03] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibrant-yellow/20 text-vibrant-yellow font-black text-xs uppercase tracking-widest mb-6 border border-vibrant-yellow/30"
                      >
                        <Sparkles size={14} />
                        Cadet Promotion Prep 2026
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6"
                      >
                        প্রস্তুতি নিন <br />
                        <span className="text-military-green">স্মার্টলি</span> ও <span className="text-vibrant-orange">আনন্দে!</span>
                      </motion.h2>
                      <p className="text-lg text-slate-600 mb-8 max-w-xl font-medium">
                        বিএনসিসি পদোন্নতি পরীক্ষার জন্য প্রয়োজনীয় সকল তথ্য এখন এক জায়গায়। পড়ুন, জানুন এবং কুইজ দিয়ে নিজেকে যাচাই করুন।
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <button 
                          onClick={startQuiz}
                          className="px-8 py-4 orange-gradient text-white rounded-2xl font-black shadow-xl shadow-orange-200 flex items-center gap-3 hover:scale-105 transition-transform"
                        >
                          কুইজ শুরু করুন <Zap size={20} />
                        </button>
                        <button 
                          onClick={() => setMode('about')}
                          className="px-8 py-4 bg-white text-military-green border-4 border-military-green rounded-2xl font-black hover:bg-military-green/5 transition-colors"
                        >
                          বিএনসিসি পরিচিতি
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 hidden md:block">
                      <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-vibrant-yellow/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-military-green/20 rounded-full blur-3xl" />
                        <motion.div 
                          animate={{ y: [0, -15, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="relative z-10 glass-card p-4 rounded-[2.5rem] rotate-3"
                        >
                          <img 
                            src="https://picsum.photos/seed/joy/800/600" 
                            alt="Joyful Learning" 
                            className="rounded-[2rem] w-full shadow-2xl"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Study Content */}
              <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4 space-y-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-4">ক্যাটাগরি</p>
                      {BNCC_DATA.map(section => {
                        const Icon = IconMap[section.icon];
                        return (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all card-hover ${
                              activeSection === section.id 
                                ? 'bg-white shadow-xl text-military-green ring-2 ring-military-green/20' 
                                : 'text-slate-500 hover:bg-white/50'
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl ${activeSection === section.id ? 'bg-military-green text-white shadow-lg' : 'bg-slate-100'}`}>
                              <Icon size={22} />
                            </div>
                            <span className="font-black text-sm">{section.title.split(' (')[0]}</span>
                          </button>
                        );
                      })}
                    </aside>

                    {/* Questions List */}
                    <div className="lg:w-3/4">
                      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100/50 border border-orange-100 overflow-hidden">
                        <div className="p-8 md:p-12 joyful-gradient text-white relative">
                          <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles size={120} />
                          </div>
                          <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-2">{currentSection.title}</h3>
                            <p className="text-white/80 font-medium">নিচের প্রশ্নগুলো মনোযোগ দিয়ে পড়ুন</p>
                          </div>
                        </div>

                        <div className="p-6 md:p-10 space-y-5">
                          {currentSection.content.map((item, idx) => {
                            const qId = `${currentSection.id}-${idx}`;
                            const isExpanded = expandedQuestions[qId];
                            return (
                              <motion.div 
                                key={qId}
                                layout
                                className={`group rounded-3xl transition-all border-2 ${isExpanded ? 'border-military-green bg-military-green/5' : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'}`}
                              >
                                <button
                                  onClick={() => toggleQuestion(qId)}
                                  className="w-full flex items-start justify-between p-6 text-left gap-4"
                                >
                                  <div className="flex gap-5">
                                    <span className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-colors ${isExpanded ? 'bg-military-green text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                      {idx + 1}
                                    </span>
                                    <h4 className="font-bold text-lg text-slate-800 pt-1.5 leading-snug">{item.question}</h4>
                                  </div>
                                  <div className={`mt-2 p-1 rounded-full transition-all duration-300 ${isExpanded ? 'rotate-180 bg-military-green text-white' : 'bg-slate-200 text-slate-400'}`}>
                                    <ChevronDown size={20} />
                                  </div>
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-8 pb-8 ml-14 border-t border-military-green/10 pt-6">
                                        <div className="text-slate-700 text-lg font-medium leading-relaxed">
                                          {Array.isArray(item.answer) ? (
                                            <ul className="space-y-3">
                                              {item.answer.map((line, i) => (
                                                <li key={i} className="flex gap-3">
                                                  <CheckCircle2 size={20} className="text-military-green flex-shrink-0 mt-1" />
                                                  <span>{line}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <div className="flex gap-3">
                                              <CheckCircle2 size={20} className="text-military-green flex-shrink-0 mt-1" />
                                              <p>{item.answer}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : mode === 'about' ? (
            <motion.div
              key="about-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 md:py-20"
            >
              <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                  <div className="p-12 blue-gradient text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <History size={160} />
                    </div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest mb-6">
                        <Info size={14} /> BNCC Overview
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black mb-4">{BNCC_HISTORY_DATA.title}</h2>
                      <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
                        {BNCC_HISTORY_DATA.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 mb-6">
                          <div className="p-2 bg-vibrant-blue/10 text-vibrant-blue rounded-xl">
                            <Milestone size={24} />
                          </div>
                          মৌলিক তথ্য
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {BNCC_HISTORY_DATA.basicInfo.map((info, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <span className="text-sm font-black text-slate-400 uppercase tracking-wider">{info.label}</span>
                              <span className="text-sm font-bold text-slate-800">{info.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 mb-6">
                          <div className="p-2 bg-vibrant-orange/10 text-vibrant-orange rounded-xl">
                            <History size={24} />
                          </div>
                          ইতিহাস (History)
                        </h3>
                        <div className="space-y-4">
                          {BNCC_HISTORY_DATA.history.map((h, i) => (
                            <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-vibrant-orange mt-2" />
                              <p className="text-slate-600 font-medium text-sm">{h}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 mb-6">
                          <div className="p-2 bg-military-green/10 text-military-green rounded-xl">
                            <Users size={24} />
                          </div>
                          সংগঠন (Organization)
                        </h3>
                        <div className="space-y-6">
                          <div className="p-6 bg-military-green/5 rounded-3xl border border-military-green/10">
                            <p className="text-xs font-black text-military-green uppercase tracking-widest mb-3">উইংসমূহ</p>
                            <div className="flex flex-wrap gap-2">
                              {BNCC_HISTORY_DATA.organization.wings.map((w, i) => (
                                <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm">{w}</span>
                              ))}
                            </div>
                          </div>
                          <div className="p-6 bg-vibrant-blue/5 rounded-3xl border border-vibrant-blue/10">
                            <p className="text-xs font-black text-vibrant-blue uppercase tracking-widest mb-3">রেজিমেন্টসমূহ (Army)</p>
                            <div className="grid grid-cols-2 gap-2">
                              {BNCC_HISTORY_DATA.organization.regiments.map((r, i) => (
                                <div key={i} className="p-2 bg-white rounded-lg shadow-sm">
                                  <p className="text-[10px] font-black text-slate-400">{r.location}</p>
                                  <p className="text-xs font-bold text-slate-800">{r.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 mb-6">
                          <div className="p-2 bg-vibrant-purple/10 text-vibrant-purple rounded-xl">
                            <Target size={24} />
                          </div>
                          উদ্দেশ্য
                        </h3>
                        <div className="space-y-3">
                          {BNCC_HISTORY_DATA.objectives.map((obj, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-vibrant-purple/5 rounded-2xl border border-vibrant-purple/10">
                              <CheckCircle2 size={18} className="text-vibrant-purple" />
                              <p className="text-sm font-bold text-slate-700">{obj}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leadership Section */}
                  <div className="p-12 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-black text-slate-900 mb-2">নেতৃত্ব ও প্রশাসন</h2>
                      <p className="text-slate-500 font-bold">বিএনসিসি-র বর্তমান উচ্চপদস্থ কর্মকর্তাবৃন্দ</p>
                    </div>

                    {/* DG Card */}
                    <div className="max-w-4xl mx-auto mb-16">
                      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3 joyful-gradient p-8 flex flex-col items-center justify-center text-white text-center">
                          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border-4 border-white/30">
                            <UserCheck size={64} />
                          </div>
                          <h3 className="text-xl font-black leading-tight mb-1">{BNCC_PERSONNEL_DATA.dg.name}</h3>
                          <p className="text-xs font-bold text-white/80">{BNCC_PERSONNEL_DATA.dg.rank}</p>
                        </div>
                        <div className="md:w-2/3 p-8 md:p-10 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">দায়িত্ব গ্রহণ</p>
                              <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Calendar size={14} className="text-vibrant-orange" /> {BNCC_PERSONNEL_DATA.dg.joined}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">জন্মস্থান</p>
                              <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Map size={14} className="text-vibrant-blue" /> {BNCC_PERSONNEL_DATA.dg.militaryInfo.birthplace}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <GraduationCap size={14} /> শিক্ষা ও প্রশিক্ষণ
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {BNCC_PERSONNEL_DATA.dg.education.map((edu, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-vibrant-blue rounded-lg text-[10px] font-bold border border-blue-100">{edu}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Briefcase size={14} /> কর্মজীবন ও মিশন
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {BNCC_PERSONNEL_DATA.dg.international.map((mission, i) => (
                                <span key={i} className="px-3 py-1 bg-military-green/10 text-military-green rounded-lg text-[10px] font-bold border border-military-green/10">{mission}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Army Wing */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-military-green text-white rounded-2xl shadow-lg shadow-green-100">
                            <Shield size={24} />
                          </div>
                          <h4 className="text-xl font-black text-slate-800">Army Wing</h4>
                        </div>
                        {BNCC_PERSONNEL_DATA.armyWing.map((reg, i) => (
                          <div key={i} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-black text-military-green uppercase tracking-widest mb-2">{reg.regiment}</p>
                            <p className="text-sm font-bold text-slate-800 mb-3">{reg.commander}</p>
                            <div className="pt-3 border-t border-slate-50">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Adjutants</p>
                              <div className="space-y-1">
                                {reg.adjutants.map((adj, j) => (
                                  <p key={j} className="text-[11px] font-medium text-slate-600">• {adj}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Naval Wing */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-vibrant-blue text-white rounded-2xl shadow-lg shadow-blue-100">
                            <Anchor size={24} />
                          </div>
                          <h4 className="text-xl font-black text-slate-800">Naval Wing</h4>
                        </div>
                        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                          <p className="text-xs font-black text-vibrant-blue uppercase tracking-widest mb-2">Deputy Director (Navy)</p>
                          <p className="text-sm font-bold text-slate-800">{BNCC_PERSONNEL_DATA.navalWing.deputyDirector}</p>
                        </div>
                        {BNCC_PERSONNEL_DATA.navalWing.commanders.map((flotilla, i) => (
                          <div key={i} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-xs font-black text-vibrant-blue uppercase tracking-widest mb-2">{flotilla.unit}</p>
                            <p className="text-sm font-bold text-slate-800">{flotilla.name}</p>
                          </div>
                        ))}
                      </div>

                      {/* Air Wing */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-vibrant-orange text-white rounded-2xl shadow-lg shadow-orange-100">
                            <Plane size={24} />
                          </div>
                          <h4 className="text-xl font-black text-slate-800">Air Wing</h4>
                        </div>
                        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                          <p className="text-xs font-black text-vibrant-orange uppercase tracking-widest mb-2">OC Wing</p>
                          <p className="text-sm font-bold text-slate-800">{BNCC_PERSONNEL_DATA.airWing.ocWing}</p>
                        </div>
                        {BNCC_PERSONNEL_DATA.airWing.squadrons.map((sq, i) => (
                          <div key={i} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-xs font-black text-vibrant-orange uppercase tracking-widest mb-2">{sq.unit}</p>
                            <p className="text-sm font-bold text-slate-800">{sq.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : mode === 'ai-quiz' ? (
            <motion.div
              key="ai-quiz-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 md:py-20"
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden">
                  <div className="p-8 md:p-12 bg-indigo-600 text-white text-center relative">
                    <div className="absolute top-4 left-8 text-white/50 font-black text-sm">
                      AI POWERED LEARNING
                    </div>
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                      <BrainCircuit size={48} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black leading-tight">
                      AI কুইজ মাস্টার
                    </h3>
                    <p className="text-indigo-100 font-medium mt-2">Gemini AI আপনার জন্য কাস্টম প্রশ্ন তৈরি করবে</p>
                  </div>

                  <div className="p-8 md:p-12">
                    {!currentAIQuestion && !aiLoading ? (
                      <div className="text-center space-y-8">
                        <p className="text-xl font-bold text-slate-700">কোন ধরনের প্রশ্ন জিজ্ঞেস করবে?</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <button
                            onClick={() => generateAIQuestion('mcq')}
                            className="p-8 rounded-3xl bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-600 transition-all group text-center"
                          >
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <ListChecks size={32} />
                            </div>
                            <h4 className="font-black text-indigo-900 text-lg">MCQ প্রশ্ন</h4>
                            <p className="text-indigo-600/60 text-xs mt-2 font-bold">বহুনির্বাচনী প্রশ্ন</p>
                          </button>
                          <button
                            onClick={() => generateAIQuestion('short')}
                            className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-100 hover:border-emerald-600 transition-all group text-center"
                          >
                            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <MessageSquare size={32} />
                            </div>
                            <h4 className="font-black text-emerald-900 text-lg">সংক্ষিপ্ত প্রশ্ন</h4>
                            <p className="text-emerald-600/60 text-xs mt-2 font-bold">১-২ লাইনের উত্তর</p>
                          </button>
                          <button
                            onClick={() => generateAIQuestion('long')}
                            className="p-8 rounded-3xl bg-amber-50 border-2 border-amber-100 hover:border-amber-600 transition-all group text-center"
                          >
                            <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <FileText size={32} />
                            </div>
                            <h4 className="font-black text-amber-900 text-lg">বড় প্রশ্ন</h4>
                            <p className="text-amber-600/60 text-xs mt-2 font-bold">বর্ণনামূলক উত্তর</p>
                          </button>
                        </div>
                      </div>
                    ) : aiLoading ? (
                      <div className="py-20 text-center space-y-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="inline-block p-4 bg-indigo-100 text-indigo-600 rounded-full"
                        >
                          <Loader2 size={48} />
                        </motion.div>
                        <h4 className="text-2xl font-black text-slate-800">AI প্রশ্ন তৈরি করছে...</h4>
                        <p className="text-slate-500 font-bold">একটু অপেক্ষা করুন, সেরা প্রশ্নটি খুঁজে বের করছি</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                              {currentAIQuestion?.type === 'mcq' ? 'MCQ' : currentAIQuestion?.type === 'short' ? 'Short' : 'Long'}
                            </span>
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Question {aiTotalQuestions}</span>
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 leading-tight">
                            {currentAIQuestion?.question}
                          </h4>
                        </div>

                        {currentAIQuestion?.type === 'mcq' ? (
                          <div className="grid grid-cols-1 gap-4">
                            {currentAIQuestion.options?.map((option, i) => {
                              const isCorrect = option === currentAIQuestion.correctAnswer;
                              const isSelected = aiUserAnswer === option;
                              let btnClass = "bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-600 hover:bg-indigo-50";
                              
                              if (aiFeedback) {
                                if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200";
                                else if (isSelected) btnClass = "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200";
                                else btnClass = "bg-white border-slate-100 text-slate-300 opacity-50";
                              }

                              return (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setAiUserAnswer(option);
                                    const correct = option === currentAIQuestion.correctAnswer;
                                    setAiFeedback(correct ? "সঠিক উত্তর!" : `ভুল উত্তর। সঠিক উত্তর হলো: ${currentAIQuestion.correctAnswer}`);
                                    if (correct) setAiScore(prev => prev + 1);
                                  }}
                                  disabled={!!aiFeedback}
                                  className={`w-full p-6 rounded-2xl text-left font-bold text-lg transition-all flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{option}</span>
                                  {aiFeedback && isCorrect && <CheckCircle2 size={24} />}
                                  {aiFeedback && isSelected && !isCorrect && <X size={24} />}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <textarea
                              value={aiUserAnswer}
                              onChange={(e) => setAiUserAnswer(e.target.value)}
                              disabled={!!aiFeedback || aiEvaluating}
                              placeholder="আপনার উত্তর এখানে লিখুন..."
                              className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-lg font-medium focus:border-indigo-600 outline-none transition-all resize-none"
                            />
                            {!aiFeedback && (
                              <button
                                onClick={evaluateAIAnswer}
                                disabled={!aiUserAnswer || aiEvaluating}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                {aiEvaluating ? (
                                  <>মূল্যায়ন করা হচ্ছে... <Loader2 className="animate-spin" /></>
                                ) : (
                                  <>উত্তর জমা দিন <Send size={24} /></>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {aiFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                          >
                            <div className={`p-8 rounded-3xl border-2 ${currentAIQuestion?.type === 'mcq' ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
                              <h5 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                <Sparkles className="text-indigo-600" size={20} /> AI ফিডব্যাক
                              </h5>
                              <div className="prose prose-slate max-w-none">
                                <div className="text-slate-700 font-medium leading-relaxed">
                                  <Markdown>{aiFeedback}</Markdown>
                                </div>
                              </div>
                              {currentAIQuestion?.type !== 'mcq' && (
                                <div className="mt-6 pt-6 border-t border-emerald-200">
                                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">মডেল উত্তর</p>
                                  <p className="text-slate-600 font-bold italic">{currentAIQuestion?.correctAnswer}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                              <button
                                onClick={() => generateAIQuestion(aiQuizType || 'mcq')}
                                className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3"
                              >
                                পরবর্তী প্রশ্ন <ArrowRight size={24} />
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentAIQuestion(null);
                                  setAiFeedback(null);
                                  setAiUserAnswer('');
                                }}
                                className="px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xl hover:bg-slate-200 transition-colors"
                              >
                                মেনুতে ফিরুন
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* AI Stats */}
                  <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">স্কোর</p>
                        <p className="text-xl font-black text-indigo-600">{aiScore}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">মোট প্রশ্ন</p>
                        <p className="text-xl font-black text-slate-800">{aiTotalQuestions}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAiScore(0);
                        setAiTotalQuestions(0);
                        setCurrentAIQuestion(null);
                        setAiFeedback(null);
                      }}
                      className="text-xs font-black text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={14} /> রিসেট
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 md:py-20"
            >
              <div className="max-w-3xl mx-auto px-4">
                {!quizFinished ? (
                  <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden">
                    <div className="p-8 md:p-12 joyful-gradient text-white text-center relative">
                      <div className="absolute top-4 left-8 text-white/50 font-black text-sm">
                        QUESTION {currentQuizIndex + 1} / {quizQuestions.length}
                      </div>
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                        <HelpCircle size={48} />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">{quizQuestions[currentQuizIndex]?.sectionTitle}</p>
                      <h3 className="text-2xl md:text-3xl font-black leading-tight">
                        {quizQuestions[currentQuizIndex]?.question}
                      </h3>
                    </div>

                    <div className="p-10 space-y-6">
                      {quizQuestions[currentQuizIndex]?.options ? (
                        <div className="grid grid-cols-1 gap-4">
                          {quizQuestions[currentQuizIndex].options?.map((option, i) => {
                            const isCorrect = option === quizQuestions[currentQuizIndex].answer;
                            const isSelected = selectedOption === option;
                            
                            let btnClass = "bg-slate-50 border-2 border-slate-100 text-slate-700 hover:border-vibrant-orange hover:bg-orange-50";
                            if (isAnswered) {
                              if (isCorrect) btnClass = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200";
                              else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200";
                              else btnClass = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                            }

                            return (
                              <button
                                key={i}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isAnswered}
                                className={`w-full p-5 rounded-2xl text-left font-bold text-lg transition-all flex items-center justify-between ${btnClass}`}
                              >
                                <span>{option}</span>
                                {isAnswered && isCorrect && <CheckCircle2 size={24} />}
                                {isAnswered && isSelected && !isCorrect && <X size={24} />}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-slate-400 font-bold mb-6">এই প্রশ্নটির কোনো অপশন নেই। উত্তরটি মনে মনে ভাবুন।</p>
                          {!isAnswered ? (
                            <button 
                              onClick={() => setIsAnswered(true)}
                              className="px-12 py-5 orange-gradient text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-200"
                            >
                              উত্তর দেখুন
                            </button>
                          ) : (
                            <div className="p-8 bg-green-50 rounded-[2rem] border-2 border-green-100 text-xl font-bold text-slate-800">
                              {quizQuestions[currentQuizIndex].answer}
                            </div>
                          )}
                        </div>
                      )}

                      {isAnswered && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-6"
                        >
                          <button 
                            onClick={nextQuizQuestion}
                            className="w-full py-5 blue-gradient text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                          >
                            পরবর্তী প্রশ্ন <ArrowRight size={24} />
                          </button>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-3 bg-slate-100 w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                        className="h-full joyful-gradient"
                      />
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl p-12 text-center border-8 border-vibrant-yellow/10"
                  >
                    <div className="w-32 h-32 bg-vibrant-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-200">
                      <Trophy size={64} className="text-white" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">চমৎকার!</h3>
                    <p className="text-slate-500 font-bold text-lg mb-8">আপনি কুইজটি সম্পন্ন করেছেন</p>
                    
                    <div className="bg-slate-50 rounded-[2rem] p-8 mb-10">
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">আপনার স্কোর</p>
                      <div className="text-7xl font-black text-military-green">
                        {quizScore}<span className="text-slate-300 text-4xl">/{quizQuestions.length}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={startQuiz}
                        className="px-10 py-4 orange-gradient text-white rounded-2xl font-black shadow-lg shadow-orange-100 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                      >
                        আবার চেষ্টা করুন <RotateCcw size={20} />
                      </button>
                      <button 
                        onClick={() => setMode('study')}
                        className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                      >
                        পড়াশোনায় ফিরে যান
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-black">BNCC Prep</h3>
              </div>
              <p className="text-slate-400 font-medium">ক্যাডেটদের পদোন্নতি পরীক্ষার চূড়ান্ত প্রস্তুতির বিশ্বস্ত সঙ্গী।</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => setMode('study')} className="hover:text-vibrant-orange transition-colors">পড়াশোনা</button>
              <button onClick={() => setMode('about')} className="hover:text-vibrant-orange transition-colors">পরিচিতি</button>
              <button onClick={startQuiz} className="hover:text-vibrant-orange transition-colors">কুইজ</button>
            </div>
            <div className="text-slate-500 text-xs font-bold">
              <p>© 2026 BNCC Cadet Portal</p>
              <p className="mt-1">Designed for Excellence</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
