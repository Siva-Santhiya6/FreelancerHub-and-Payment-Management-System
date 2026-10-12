import { useSelector } from 'react-redux';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'English', native: 'English', desc: 'Global Standard', locale: 'en-US', dir: 'ltr' },
  { code: 'ta', flag: '🇮🇳', label: 'Tamil', native: 'தமிழ்', desc: 'தமிழ்நாடு & இலங்கை', locale: 'ta-IN', dir: 'ltr' },
  { code: 'hi', flag: '🇮🇳', label: 'Hindi', native: 'हिंदी', desc: 'भारत & प्रांतीय', locale: 'hi-IN', dir: 'ltr' },
  { code: 'te', flag: '🇮🇳', label: 'Telugu', native: 'తెలుగు', desc: 'ఆంధ్రప్రదేశ్ & తెలంగాణ', locale: 'te-IN', dir: 'ltr' },
  { code: 'kn', flag: '🇮🇳', label: 'Kannada', native: 'ಕನ್ನಡ', desc: 'ಕರ್ನಾಟಕ', locale: 'kn-IN', dir: 'ltr' },
  { code: 'ml', flag: '🇮🇳', label: 'Malayalam', native: 'മലയാളം', desc: 'കേരളം & ഗൾഫ്', locale: 'ml-IN', dir: 'ltr' },
  { code: 'bn', flag: '🇮🇳', label: 'Bengali', native: 'বাংলা', desc: 'পশ্চিমবঙ্গ & বাংলাদেশ', locale: 'bn-IN', dir: 'ltr' },
  { code: 'mr', flag: '🇮🇳', label: 'Marathi', native: 'मराठी', desc: 'महाराष्ट्र', locale: 'mr-IN', dir: 'ltr' },
  { code: 'gu', flag: '🇮🇳', label: 'Gujarati', native: 'ગુજરાતી', desc: 'ગુજરાત', locale: 'gu-IN', dir: 'ltr' },
  { code: 'es', flag: '🇪🇸', label: 'Spanish', native: 'Español', desc: 'España y Latinoamérica', locale: 'es-ES', dir: 'ltr' },
  { code: 'fr', flag: '🇫🇷', label: 'French', native: 'Français', desc: 'France et Francophonie', locale: 'fr-FR', dir: 'ltr' },
  { code: 'de', flag: '🇩🇪', label: 'German', native: 'Deutsch', desc: 'Deutschland & Europa', locale: 'de-DE', dir: 'ltr' },
  { code: 'ar', flag: '🇸🇦', label: 'Arabic', native: 'العربية', desc: 'الشرق الأوسط والعالم', locale: 'ar-SA', dir: 'rtl' },
  { code: 'ja', flag: '🇯🇵', label: 'Japanese', native: '日本語', desc: '日本 & アジア', locale: 'ja-JP', dir: 'ltr' },
  { code: 'zh', flag: '🇨🇳', label: 'Chinese', native: '简体中文', desc: '中国 & 亚太', locale: 'zh-CN', dir: 'ltr' },
  { code: 'ru', flag: '🇷🇺', label: 'Russian', native: 'Русский', desc: 'Россия и СНГ', locale: 'ru-RU', dir: 'ltr' },
];

// Master Dictionary covering all platform pages & features
export const dictionary = {
  // Navigation & Core Menu
  dashboard: {
    en: 'Dashboard', ta: 'டாஷ்போர்டு', hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', ml: 'ഡാഷ്‌ബോർഡ്',
    bn: 'ড্যাশবোর্ড', mr: 'डॅशबोर्ड', gu: 'ડેશબોર્ડ', es: 'Panel de Control', fr: 'Tableau de bord', de: 'Dashboard',
    ar: 'لوحة التحكم', ja: 'ダッシュボード', zh: '控制面板', ru: 'Панель управления'
  },
  marketplace: {
    en: 'Marketplace', ta: 'திட்டச் சந்தை', hi: 'मार्केटप्लेस', te: 'మార్కెట్‌ప్లేస్', kn: 'ಮಾರುಕಟ್ಟೆ', ml: 'മാർക്കറ്റ്‌പ്ലേസ്',
    bn: 'মার্কেটপ্লেস', mr: 'मार्केटप्लेस', gu: 'માર્કેટપ્લેસ', es: 'Mercado', fr: 'Place de marché', de: 'Marktplatz',
    ar: 'سوق المشاريع', ja: 'マーケットプレイス', zh: '项目广场', ru: 'Биржа проектов'
  },
  myProjects: {
    en: 'My Projects', ta: 'என் திட்டங்கள்', hi: 'मेरे प्रोजेक्ट्स', te: 'నా ప్రాజెక్ట్‌లు', kn: 'ನನ್ನ ಯೋಜನೆಗಳು', ml: 'എന്റെ പ്രോജക്ടുകൾ',
    bn: 'আমার প্রজেক্ট', mr: 'माझे प्रकल्प', gu: 'મારા પ્રોજેક્ટ્સ', es: 'Mis Proyectos', fr: 'Mes projets', de: 'Meine Projekte',
    ar: 'مشاريعي', ja: 'マイプロジェクト', zh: '我的项目', ru: 'Мои проекты'
  },
  postProject: {
    en: 'Post Project', ta: 'திட்டம் உருவாக்கு', hi: 'प्रोजेक्ट बनाएं', te: 'ప్రాజెక్ట్ పోస్ట్ చేయండి', kn: 'ಯೋಜನೆ ಪೋಸ್ಟ್ ಮಾಡಿ', ml: 'പ്രോജക്റ്റ് ചേർക്കുക',
    bn: 'প্রজেক্ট তৈরি করুন', mr: 'प्रकल्प पोस्ट करा', gu: 'પ્રોજેક્ટ પોસ્ટ કરો', es: 'Publicar Proyecto', fr: 'Publier un projet', de: 'Projekt erstellen',
    ar: 'نشر مشروع', ja: '案件を掲載', zh: '发布项目', ru: 'Опубликовать проект'
  },
  myProposals: {
    en: 'My Proposals', ta: 'என் விண்ணப்பங்கள்', hi: 'मेरे प्रस्ताव', te: 'నా ప్రతిపాదనలు', kn: 'ನನ್ನ ಪ್ರಸ್ತಾಪಗಳು', ml: 'എന്റെ നിർദ്ദേശങ്ങൾ',
    bn: 'আমার প্রস্তাবসমূহ', mr: 'माझे प्रस्ताव', gu: 'મારા પ્રસ્તાવો', es: 'Mis Propuestas', fr: 'Mes propositions', de: 'Meine Angebote',
    ar: 'عروضي', ja: 'マイ提案', zh: '我的提案', ru: 'Мои заявки'
  },
  paymentsAndEscrow: {
    en: 'Payments & Escrow', ta: 'கட்டணங்கள் & எஸ்க்ரோ', hi: 'भुगतान और एस्क्रो', te: 'చెల్లింపులు & ఎస్క్రో', kn: 'ಪಾವತಿಗಳು ಮತ್ತು ಎಸ್ಕ್ರೋ', ml: 'പേയ്‌മെന്റുകൾ & എസ്ക്രോ',
    bn: 'পেমেন্ট ও এসক্রো', mr: 'पेमेंट्स आणि एस्क्रो', gu: 'ચૂકવણીઓ અને એસ્ક્રો', es: 'Pagos y Custodia', fr: 'Paiements & Séquestre', de: 'Zahlungen & Treuhand',
    ar: 'المدفوعات والضمان', ja: '決済＆エスクロー', zh: '支付与托管', ru: 'Платежи и эскроу'
  },
  invoicesAndBilling: {
    en: 'Invoices & Billing', ta: 'ரசீதுகள் & பில்லிங்', hi: 'इनवॉइस व बिलिंग', te: 'ఇన్‌వాయిస్‌లు & బిల్లింగ్', kn: 'ಇನ್‌ವಾಯ್ಸ್‌ಗಳು ಮತ್ತು ಬಿಲ್ಲಿಂಗ್', ml: 'ഇൻവോയ്സുകൾ & ബില്ലിംഗ്',
    bn: 'ইনভয়েস ও বিলিং', mr: 'इनव्हॉइस आणि बिलिंग', gu: 'ઇનવોઇસ અને બિલિંગ', es: 'Facturas y Facturación', fr: 'Factures & Facturation', de: 'Rechnungen & Abrechnung',
    ar: 'الفواتير والتحصيل', ja: '請求＆支払い', zh: '账单与发票', ru: 'Счета и биллинг'
  },
  disputesAndClaims: {
    en: 'Disputes & Claims', ta: 'சர்ச்சைகள் & கோரிக்கைகள்', hi: 'विवाद और दावे', te: 'వివాదాలు & క్లెయిమ్‌లు', kn: 'ವಿವಾದಗಳು ಮತ್ತು ಹಕ್ಕುಗಳು', ml: 'തർക്കങ്ങളും അവകാശവാദങ്ങളും',
    bn: 'বিরোধ ও দাবি', mr: 'वाद आणि दावे', gu: 'વિવાદો અને દાવાઓ', es: 'Disputas y Reclamos', fr: 'Litiges & Réclamations', de: 'Streitfälle & Ansprüche',
    ar: 'النزاعات والمطالبات', ja: '紛争＆申し立て', zh: '争议与申诉', ru: 'Споры и претензии'
  },
  revenueAnalytics: {
    en: 'Revenue Analytics', ta: 'வருமான பகுப்பாய்வு', hi: 'राजस्व एनालिटिक्स', te: 'ఆదాయ విశ్లేషణ', kn: 'ಆದಾಯ ವಿಶ್ಲೇಷಣೆ', ml: 'വരുമാന വിശകലനം',
    bn: 'রাজস্ব বিশ্লেষণ', mr: 'महसूल विश्लेषण', gu: 'આવક વિશ્લેષણ', es: 'Análisis de Ingresos', fr: 'Analyse des revenus', de: 'Umsatzanalysen',
    ar: 'تحليلات الإيرادات', ja: '売上・収益分析', zh: '收入数据分析', ru: 'Аналитика доходов'
  },
  contractsAndNda: {
    en: 'Contracts & NDA', ta: 'ஒப்பந்தங்கள் & NDA', hi: 'अनुबंध और एनडीए', te: 'ఒప్పందాలు & NDA', kn: 'ಒಪ್ಪಂದಗಳು ಮತ್ತು NDA', ml: 'കരാറുകൾ & എൻ‌ഡി‌എ',
    bn: 'চুক্তি ও এনডিএ', mr: 'करार आणि NDA', gu: 'કરારો અને એનડીએ', es: 'Contratos y NDA', fr: 'Contrats & NDA', de: 'Verträge & NDA',
    ar: 'العقود واتفاقية السرية', ja: '契約＆NDA', zh: '合同与保密协议', ru: 'Договоры и NDA'
  },
  profileAndKyc: {
    en: 'Profile & KYC', ta: 'சுயவிவரம் & KYC', hi: 'प्रोफाइल और केवाईसी', te: 'ప్రొఫైల్ & KYC', kn: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು KYC', ml: 'പ്രൊഫൈൽ & കെ‌വൈ‌സി',
    bn: 'প্রোফাইল ও কেওয়াইসি', mr: 'प्रोफाइल आणि केवायसी', gu: 'પ્રોફાઇલ અને કેવાયસી', es: 'Perfil y KYC', fr: 'Profil & KYC', de: 'Profil & KYC',
    ar: 'الملف الشخصي وKYC', ja: 'プロフィール＆KYC', zh: '个人资料与KYC', ru: 'Профиль и KYC'
  },
  platformSettings: {
    en: 'Platform Settings', ta: 'தள அமைப்புகள்', hi: 'प्लेटफ़ॉर्म सेटिंग्स', te: 'ప్లాట్‌ఫారమ్ సెట్టింగ్‌లు', kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', ml: 'പ്ലാറ്റ്ഫോം ക്രമീകരണങ്ങൾ',
    bn: 'প্ল্যাটফর্ম সেটিংস', mr: 'प्लॅटफॉर्म सेटिंग्ज', gu: 'પ્લેટફોર્મ સેટિંગ્સ', es: 'Ajustes de Plataforma', fr: 'Paramètres de plateforme', de: 'Plattformeinstellungen',
    ar: 'إعدادات المنصة', ja: 'プラットフォーム設定', zh: '系统设置', ru: 'Настройки платформы'
  },
  agencyStudio: {
    en: 'Agency Studio', ta: 'ஏஜென்சி ஸ்டுடியோ', hi: 'एजेंसी स्टूडियो', te: 'ఏజెన్సీ స్టూడియో', kn: 'ಏಜೆನ್ಸಿ ಸ್ಟುಡಿಯೋ', ml: 'ഏജൻസി സ്റ്റുഡിയോ',
    bn: 'এজেন্সি স্টুডিও', mr: 'एजन्सी स्टुडिओ', gu: 'એજન્સી સ્ટુડિયો', es: 'Estudio de Agencia', fr: 'Studio Agence', de: 'Agentur-Studio',
    ar: 'استوديو الوكالة', ja: 'エージェンシースタジオ', zh: '机构工作室', ru: 'Студия агентства'
  },
  adminMasterPanel: {
    en: 'Admin Master Panel', ta: 'நிர்வாக முதன்மை குழு', hi: 'एडमिन मास्टर पैनल', te: 'అడ్మిన్ మాస్టర్ ప్యానెల్', kn: 'ಅಡ್ಮಿನ್ ಮಾಸ್ಟರ್ ಪ್ಯಾನೆಲ್', ml: 'അഡ്മിൻ മാസ്റ്റർ പാനൽ',
    bn: 'অ্যাডমিন মাস্টার প্যানেল', mr: 'अ‍ॅडमिन मास्टर पॅनेल', gu: 'એડમિન માસ્ટર પેનલ', es: 'Panel Maestro Admin', fr: 'Panneau d’administration', de: 'Admin-Hauptpanel',
    ar: 'لوحة تحكم المسؤول', ja: '管理者マスターパネル', zh: '管理员总控面板', ru: 'Панель администратора'
  },
  timesheetsTracking: {
    en: 'Timesheets & Tracking', ta: 'காலஅளவு & நேரப்பதிவு', hi: 'टाइमशीट और ट्रैकिंग', te: 'టైమ్‌షీట్‌లు & ట్రాకింగ్', kn: 'ಟೈಮ್‌ಶೀಟ್‌ಗಳು ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್', ml: 'ടൈംഷീറ്റുകളും ട്രാക്കിംഗും',
    bn: 'টাইমশীট ও ট্র্যাকিং', mr: 'टाइमशीट आणि ट्रॅकिंग', gu: 'ટાઇમશીટ્સ અને ટ્રેકિંગ', es: 'Hojas de Horas y Rastreo', fr: 'Feuilles de temps & Suivi', de: 'Stundenzettel & Zeiterfassung',
    ar: 'الجداول الزمنية والتتبع', ja: 'タイムシート＆稼働記録', zh: '工时单与实时追踪', ru: 'Табели учета и тайм-трекинг'
  },
  skillsAssessment: {
    en: 'Skills Assessment', ta: 'திறன் மதிப்பீடு', hi: 'कौशल मूल्यांकन', te: 'నైపుణ్యాల అంచనా', kn: 'ಕೌಶಲ್ಯ ಮೌಲ್ಯಮಾಪನ', ml: 'നൈപുണ്യ വിലയിരുത്തൽ',
    bn: 'দক্ষতা মূল্যায়ন', mr: 'कौशल्य मूल्यांकन', gu: 'કૌશલ્ય મૂલ્યાંકન', es: 'Evaluación de Habilidades', fr: 'Évaluation des compétences', de: 'Kompetenzbewertung',
    ar: 'تقييم المهارات', ja: 'スキル評価テスト', zh: '技能认证与评估', ru: 'Оценка навыков'
  },
  communityForum: {
    en: 'Community & Network', ta: 'சமூக வலைப்பின்னல்', hi: 'कम्युनिटी नेटवर्क', te: 'కమ్యూనిటీ & నెట్‌వర్క్', kn: 'ಸಮುದಾಯ ಮತ್ತು ನೆಟ್‌ವರ್ಕ್', ml: 'കമ്മ്യൂണിറ്റി നെറ്റ്‌വർക്ക്',
    bn: 'কমিউনিটি ও নেটওয়ার্ক', mr: 'समुदाय आणि नेटवर्क', gu: 'સમુદાય અને નેટવર્ક', es: 'Comunidad y Red', fr: 'Communauté & Réseau', de: 'Community & Netzwerk',
    ar: 'المجتمع والشبكة', ja: 'コミュニティ＆ネットワーク', zh: '技术社区与交流', ru: 'Сообщество и сеть'
  },
  escrowGovernance: {
    en: 'Escrow Governance', ta: 'எஸ்க்ரோ ஆளுகை', hi: 'एस्क्रो गवर्नेंस', te: 'ఎస్క్రో గవర్నెన్స్', kn: 'ಎಸ್ಕ್ರೋ ಆಡಳಿತ', ml: 'എസ്ക്രോ ഗവേണൻസ്',
    bn: 'এসক্রো গভর্নেন্স', mr: 'एस्क्रो गव्हर्नन्स', gu: 'એસ્ક્રો ગવર્નન્સ', es: 'Gobernanza de Custodia', fr: 'Gouvernance du séquestre', de: 'Treuhand-Governance',
    ar: 'حوكمة الضمان المالي', ja: 'エスクロー統治・監査', zh: '智能托管合规治理', ru: 'Управление эскроу'
  },
  messagesChat: {
    en: 'Messages & Chat', ta: 'செய்திகள் & உரையாடல்', hi: 'संदेश और चैट', te: 'సందేశాలు & చాట్', kn: 'ಸಂದೇಶಗಳು ಮತ್ತು ಚಾಟ್', ml: 'സന്ദേശങ്ങളും ചാറ്റും',
    bn: 'মেসেজ ও চ্যাট', mr: 'संदेश आणि चॅट', gu: 'સંદેશાઓ અને ચેટ', es: 'Mensajes y Chat', fr: 'Messages & Discussion', de: 'Nachrichten & Chat',
    ar: 'الرسائل والمحادثة', ja: 'メッセージ＆チャット', zh: '即时消息与沟通', ru: 'Сообщения и чат'
  },

  // Admin Master Control Panel Specifics
  platformGovernance: {
    en: 'Global Platform Governance', ta: 'உலகளாவிய தள ஆளுகை', hi: 'वैश्विक प्लेटफ़ॉर्म गवर्नेंस', te: 'గ్లోబల్ ప్లాట్‌ఫారమ్ గవర్నెన్స్',
    kn: 'ಜಾಗತಿಕ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಡಳಿತ', ml: 'ആഗോള പ്ലാറ്റ്ഫോം ഗവേണൻസ്', bn: 'গ্লোবাল প্ল্যাটফর্ম গভর্নেন্স', mr: 'ग्लोबल प्लॅटफॉर्म गव्हर्नन्स',
    gu: 'ગ્લોબલ પ્લેટફોર્મ ગવર્નન્સ', es: 'Gobernanza Global de Plataforma', fr: 'Gouvernance globale de la plateforme', de: 'Globale Plattform-Governance',
    ar: 'حوكمة المنصة العالمية', ja: 'プラットフォーム全体統治', zh: '全球平台统一治理', ru: 'Глобальное управление платформой'
  },
  adminTitle: {
    en: 'Admin Master Control Panel', ta: 'நிர்வாக முதன்மை கட்டுப்பாட்டு குழு', hi: 'एडमिन मास्टर कंट्रोल पैनल',
    te: 'అడ్మిన్ మాస్టర్ కంట్రోల్ ప్యానెల్', kn: 'ಅಡ್ಮಿನ್ ಮಾಸ್ಟರ್ ನಿಯಂತ್ರಣ ಫಲಕ', ml: 'അഡ്മിൻ മാസ്റ്റർ കൺട്രോൾ പാനൽ',
    bn: 'অ্যাডমিন মাস্টার কন্ট্রোল প্যানেল', mr: 'अ‍ॅडमिन मास्टर कंट्रोल पॅनेल', gu: 'એડમિન માસ્ટર કંટ્રોલ પેનલ',
    es: 'Panel de Control Maestro de Administración', fr: 'Panneau de contrôle d’administration', de: 'Admin-Hauptkontrollpanel',
    ar: 'لوحة التحكم الرئيسية للمسؤول', ja: '管理者マスターコントロールパネル', zh: '管理员主控面板', ru: 'Главная панель управления администратора'
  },
  adminSubtitle: {
    en: 'Manage user directory, system disputes, verification queue, and platform health',
    ta: 'பயனர் பட்டியல், சர்ச்சை தீர்வுகள், சரிபார்ப்பு வரிசை மற்றும் தள ஆரோக்கியத்தை நிர்வகிக்கவும்',
    hi: 'उपयोगकर्ता निर्देशिका, सिस्टम विवाद, सत्यापन कतार और प्लेटफ़ॉर्म स्थिति का प्रबंधन करें',
    te: 'వినియోగదారు డైరెక్టరీ, సిస్టమ్ వివాదాలు, ధృవీకరణ క్యూ మరియు ప్లాట్‌ఫారమ్ ఆరోగ్యాన్ని నిర్వహించండి',
    kn: 'ಬಳಕೆದಾರ ಡೈರೆಕ್ಟರಿ, ಸಿಸ್ಟಮ್ ವಿವಾದಗಳು, ಪರಿಶೀಲನೆ ಸರದಿ ಮತ್ತು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆರೋಗ್ಯವನ್ನು ನಿರ್ವಹಿಸಿ',
    ml: 'ഉപയോക്തൃ ഡയറക്ടറി, തർക്കങ്ങൾ, സ്ഥിരീകരണ ക്യൂ, പ്ലാറ്റ്ഫോം ആരോഗ്യം എന്നിവ കൈകാര്യം ചെയ്യുക',
    bn: 'ব্যবহারকারী ডিরেক্টরি, বিরোধ, যাচাইকরণ কিউ এবং প্ল্যাটফর্ম স্বাস্থ্য পরিচালনা করুন',
    mr: 'वापरकर्ता निर्देशिका, वाद, पडताळणी रांग आणि प्लॅटफॉर्म आरोग्य व्यवस्थापित करा',
    gu: 'વપરાશકર્તા ડિરેક્ટરી, વિવાદો, ચકાસણી કતાર અને પ્લેટફોર્મ આરોગ્યનું સંચાલન કરો',
    es: 'Administre el directorio de usuarios, disputas del sistema, cola de verificación y estado de la plataforma',
    fr: 'Gérer le répertoire des utilisateurs, les litiges, la file de vérification et l’état du système',
    de: 'Verwalten Sie Benutzerverzeichnis, Streitigkeiten, Verifizierungs-Warteschlange und Plattformstatus',
    ar: 'إدارة دليل المستخدمين والنزاعات وقائمة التحقق وصحة المنصة العامة',
    ja: 'ユーザーディレクトリ、紛争管理、本人確認キュー、プラットフォーム稼働状態を管理',
    zh: '管理用户名录、系统争议仲裁、实名审核队列以及平台运行健康状态',
    ru: 'Управление каталогом пользователей, спорами, очередью верификации и здоровьем платформы'
  },
  totalUsers: {
    en: 'Total Users', ta: 'மொத்த பயனர்கள்', hi: 'कुल उपयोगकर्ता', te: 'మొత్తం వినియోగదారులు', kn: 'ಒಟ್ಟು ಬಳಕೆದಾರರು', ml: 'ആകെ ഉപയോക്താക്കൾ',
    bn: 'মোট ব্যবহারকারী', mr: 'एकूण वापरकर्ते', gu: 'કુલ વપરાશકર્તાઓ', es: 'Usuarios Totales', fr: 'Utilisateurs totaux', de: 'Gesamte Benutzer',
    ar: 'إجمالي المستخدمين', ja: '総ユーザー数', zh: '用户总数', ru: 'Всего пользователей'
  },
  activePlatformMembers: {
    en: 'Active Platform Members', ta: 'செயலில் உள்ள பயனர்கள்', hi: 'सक्रिय प्लेटफ़ॉर्म सदस्य', te: 'క్రియాశీల ప్లాట్‌ఫారమ్ సభ్యులు',
    kn: 'ಸಕ್ರಿಯ ಸದಸ್ಯರು', ml: 'സജീവ അംഗങ്ങൾ', bn: 'সক্রিয় সদস্যরা', mr: 'सक्रिय सदस्य', gu: 'સક્રિય સભ્યો',
    es: 'Miembros Activos de Plataforma', fr: 'Membres actifs', de: 'Aktive Plattform-Mitglieder',
    ar: 'أعضاء المنصة النشطون', ja: 'アクティブ会員', zh: '活跃平台成员', ru: 'Активные участники'
  },
  totalProjects: {
    en: 'Total Projects', ta: 'மொத்த திட்டங்கள்', hi: 'कुल प्रोजेक्ट्स', te: 'మొత్తం ప్రాజెక్ట్‌లు', kn: 'ಒಟ್ಟು ಯೋಜನೆಗಳು', ml: 'ആകെ പ്രോജക്ടുകൾ',
    bn: 'মোট প্রজেক্ট', mr: 'एकूण प्रकल्प', gu: 'કુલ પ્રોજેક્ટ્સ', es: 'Proyectos Totales', fr: 'Projets totaux', de: 'Gesamte Projekte',
    ar: 'إجمالي المشاريع', ja: '総案件数', zh: '项目总数', ru: 'Всего проектов'
  },
  inEscrowAndBidding: {
    en: 'In Escrow & Bidding', ta: 'எஸ்க்ரோ மற்றும் ஏலத்தில்', hi: 'एस्क्रो और बोली में', te: 'ఎస్క్రో & బిడ్డింగ్‌లో',
    kn: 'ಎಸ್ಕ್ರೋ ಮತ್ತು ಬಿಡ್ಡಿಂಗ್‌ನಲ್ಲಿ', ml: 'എസ്ക്രോയിലും ലേലത്തിലും', bn: 'এসক্রো ও বিডিংয়ে', mr: 'एस्क्रो आणि बिडिंगमध्ये',
    gu: 'એસ્ક્રો અને બિડિંગમાં', es: 'En Custodia y Licitación', fr: 'En séquestre et enchères', de: 'In Treuhand & Versteigerung',
    ar: 'في الضمان والمناقصة', ja: 'エスクロー＆入札中', zh: '托管与竞标中', ru: 'В эскроу и на торгах'
  },
  platformVolume: {
    en: 'Platform Volume', ta: 'தள பணப்பரிவர்த்தனை', hi: 'प्लेटफ़ॉर्म वॉल्यूम', te: 'ప్లాట్‌ఫారమ్ వాల్యూమ్', kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರಮಾಣ', ml: 'പ്ലാറ്റ്ഫോം വോളിയം',
    bn: 'প্ল্যাটফর্ম ভলিউম', mr: 'प्लॅटफॉर्म व्हॉल्यूम', gu: 'પ્લેટફોર્મ વોલ્યુમ', es: 'Volumen de Plataforma', fr: 'Volume de la plateforme', de: 'Plattform-Volumen',
    ar: 'حجم تداولات المنصة', ja: '取引総額', zh: '平台交易总量', ru: 'Объем платформы'
  },
  protectedEscrowTotal: {
    en: 'Protected Escrow Total', ta: 'பாதுகாக்கப்பட்ட எஸ்க்ரோ நிதி', hi: 'संरक्षित एस्क्रो कुल', te: 'రక్షిత ఎస్క్రో మొత్తం',
    kn: 'ರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ಒಟ್ಟು', ml: 'സംരക്ഷിത എസ്ക്രോ ആകെ', bn: 'সুরক্ষিত এসক্রো মোট', mr: 'सुरक्षित एस्क्रो एकूण',
    gu: 'સુરક્ષિત એસ્ક્રો કુલ', es: 'Total Protegido en Custodia', fr: 'Total protégé en séquestre', de: 'Geschütztes Treuhandvolumen',
    ar: 'إجمالي الضمان المحمي', ja: '保護済みエスクロー総額', zh: '智能托管资金总计', ru: 'Защищено в эскроу'
  },
  freelancersVsClients: {
    en: 'Freelancers / Clients', ta: 'பணியாளர்கள் / வாடிக்கையாளர்கள்', hi: 'फ्रीलांसर / क्लाइंट', te: 'ఫ్రీలాన్సర్లు / క్లయింట్లు', kn: 'ಫ್ರೀಲ್ಯಾನ್ಸರ್‌ಗಳು / ಕ್ಲೈಂಟ್‌ಗಳು', ml: 'ഫ്രീലാൻസർമാർ / ക്ലയന്റുകൾ',
    bn: 'ফ্রিল্যান্সার / ক্লায়েন্ট', mr: 'फ्रीलान्सर / क्लायंट', gu: 'ફ્રીલાન્સર્સ / ક્લાયન્ટ્સ', es: 'Freelancers / Clientes', fr: 'Freelances / Clients', de: 'Freelancer / Kunden',
    ar: 'المستقلون / العملاء', ja: 'フリーランス / クライアント比', zh: '自由职业者 / 雇主比例', ru: 'Исполнители / Заказчики'
  },
  balancedRatio: {
    en: 'Balanced Ratio', ta: 'சமநிலையான விகிதம்', hi: 'संतुलित अनुपात', te: 'సమతుల్య నిష్పత్తి', kn: 'ಸಮತೋಲಿತ ಅನುಪಾತ',
    ml: 'സന്തുലിത അനുപാതം', bn: 'ভারসাম্য অনুপাত', mr: 'संतुलित प्रमाण', gu: 'સંતુલિત ગુણોત્તર', es: 'Proporción Equilibrada',
    fr: 'Ratio équilibré', de: 'Ausgewogenes Verhältnis', ar: 'نسبة متوازنة', ja: '安定した需給比率', zh: '健康供需平衡', ru: 'Сбалансированное соотношение'
  },
  provisionNewUser: {
    en: '+ Provision New User', ta: '+ புதிய பயனர் சேர்க்க', hi: '+ नया उपयोगकर्ता जोड़ें', te: '+ కొత్త వినియోగదారుని సృష్టించండి', kn: '+ ಹೊಸ ಬಳಕೆದಾರರನ್ನು ಸೇರಿಸಿ', ml: '+ പുതിയ ഉപയോക്താവിനെ ചേർക്കുക',
    bn: '+ নতুন ব্যবহারকারী তৈরি করুন', mr: '+ नवीन वापरकर्ता जोडा', gu: '+ નવો વપરાશકર્તા ઉમેરો', es: '+ Crear Nuevo Usuario', fr: '+ Créer un utilisateur', de: '+ Neuen Benutzer anlegen',
    ar: '+ إضافة مستخدم جديد', ja: '+ 新規ユーザー作成', zh: '+ 录入新用户', ru: '+ Добавить пользователя'
  },
  userDirectoryTab: {
    en: 'User Directory CRUD', ta: 'பயனர் பட்டியல் CRUD', hi: 'उपयोगकर्ता निर्देशिका CRUD', te: 'వినియోగదారు డైరెక్టరీ CRUD', kn: 'ಬಳಕೆದಾರ ಡೈರೆಕ್ಟರಿ CRUD', ml: 'ഉപയോക്തൃ ഡയറക്ടറി CRUD',
    bn: 'ব্যবহারকারী ডিরেক্টরি CRUD', mr: 'वापरकर्ता निर्देशिका CRUD', gu: 'વપરાશકર્તા ડિરેક્ટરી CRUD', es: 'Directorio de Usuarios CRUD', fr: 'Répertoire Utilisateurs CRUD', de: 'Benutzerverzeichnis CRUD',
    ar: 'دليل المستخدمين CRUD', ja: 'ユーザー名簿 CRUD', zh: '用户管理名录 CRUD', ru: 'Каталог пользователей CRUD'
  },
  kycVerificationsTab: {
    en: 'KYC & Verifications', ta: 'KYC & சரிபார்ப்புகள்', hi: 'केवाईसी व सत्यापन', te: 'KYC & ధృవీకరణలు', kn: 'KYC ಮತ್ತು ಪರಿಶೀಲನೆಗಳು', ml: 'കെ‌വൈ‌സി & സ്ഥിരീകരണങ്ങൾ',
    bn: 'কেওয়াইসি ও যাচাইকরণ', mr: 'KYC आणि पडताळणी', gu: 'KYC અને ચકાસણીઓ', es: 'KYC y Verificaciones', fr: 'KYC & Vérifications', de: 'KYC & Verifizierungen',
    ar: 'التحقق وKYC', ja: 'KYC＆本人確認', zh: '实名KYC认证审核', ru: 'Верификация и KYC'
  },
  escrowDisputesTab: {
    en: 'Escrow Disputes', ta: 'எஸ்க்ரோ சர்ச்சைகள்', hi: 'एस्क्रो विवाद', te: 'ఎస్క్రో వివాదాలు', kn: 'ಎಸ್ಕ್ರೋ ವಿವಾದಗಳು', ml: 'എസ്ക്രോ തർക്കങ്ങൾ',
    bn: 'এসক্রো বিরোধ', mr: 'एस्क्रो वाद', gu: 'એસ્ક્રો વિવાદો', es: 'Disputas de Custodia', fr: 'Litiges de séquestre', de: 'Treuhand-Streitigkeiten',
    ar: 'نزاعات الضمان', ja: 'エスクロー紛争仲裁', zh: '托管争议仲裁', ru: 'Споры по эскроу'
  },
  searchUserPlaceholder: {
    en: 'Search user by name, email, or role...', ta: 'பெயர், மின்னஞ்சல் அல்லது பொறுப்பு மூலம் தேடுங்கள்...',
    hi: 'नाम, ईमेल या भूमिका से खोजें...', te: 'పేరు, ఇమెయిల్ లేదా పాత్ర ద్వారా వెతకండి...',
    kn: 'ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಪಾತ್ರದ ಮೂಲಕ ಹುಡುಕಿ...', ml: 'പേര്, ഇമെയിൽ അല്ലെങ്കിൽ റോൾ പ്രകാരം തിരയുക...',
    bn: 'নাম, ইমেল বা ভূমিকা দ্বারা খুঁজুন...', mr: 'नाव, ईमेल किंवा भूमिकेनुसार शोधा...',
    gu: 'નામ, ઇમેઇલ અથવા ભૂમિકા દ્વારા શોધો...', es: 'Buscar usuario por nombre, correo o rol...',
    fr: 'Rechercher un utilisateur par nom, email ou rôle...', de: 'Benutzer nach Name, E-Mail oder Rolle suchen...',
    ar: 'ابحث عن مستخدم بالاسم أو البريد أو الدور...', ja: '名前、メールアドレス、役割で検索...',
    zh: '按姓名、邮箱或系统角色搜索用户...', ru: 'Поиск по имени, email или роли...'
  },
  allRoles: {
    en: 'All Roles', ta: 'அனைத்து பொறுப்புகள்', hi: 'सभी भूमिकाएँ', te: 'అన్ని పాత్రలు', kn: 'ಎಲ್ಲಾ ಪಾತ್ರಗಳು', ml: 'എല്ലാ റോളുകളും',
    bn: 'সমস্ত ভূমিকা', mr: 'सर्व भूमिका', gu: 'તમામ ભૂમિકાઓ', es: 'Todos los Roles', fr: 'Tous les rôles', de: 'Alle Rollen',
    ar: 'جميع الأدوار', ja: 'すべての権限・役割', zh: '所有角色', ru: 'Все роли'
  },
  newestFirst: {
    en: 'Newest First', ta: 'புதியது முதலில்', hi: 'नवीनतम पहले', te: 'కొత్తవి మొదట', kn: 'ಹೊಸದು ಮೊದಲು', ml: 'ഏറ്റവും പുതിയത് ആദ്യം',
    bn: 'নতুনগুলি আগে', mr: 'नवीनतम प्रथम', gu: 'નવીનતમ પ્રથમ', es: 'Más Nuevos Primero', fr: 'Plus récents d’abord', de: 'Neueste zuerst',
    ar: 'الأحدث أولاً', ja: '新しい順', zh: '按最新注册排序', ru: 'Сначала новые'
  },
  refreshBtn: {
    en: 'Refresh', ta: 'புதுப்பி', hi: 'रिफ्रेश', te: 'రిఫ్రెష్ చేయండి', kn: 'ರಿಫ್ರೆಶ್ ಮಾಡಿ', ml: 'പുതുക്കുക',
    bn: 'রিফ্রেশ করুন', mr: 'रिफ्रेश करा', gu: 'રીફ્રેશ કરો', es: 'Actualizar', fr: 'Actualiser', de: 'Aktualisieren',
    ar: 'تحديث', ja: '再読み込み', zh: '刷新数据', ru: 'Обновить'
  },
  userProfileHeader: {
    en: 'USER PROFILE', ta: 'பயனர் சுயவிவரம்', hi: 'उपयोगकर्ता प्रोफाइल', te: 'వినియోగదారు ప్రొఫైల్', kn: 'ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್', ml: 'ഉപയോക്തൃ പ്രൊഫൈൽ',
    bn: 'ব্যবহারকারী প্রোফাইল', mr: 'वापरकर्ता प्रोफाइल', gu: 'વપરાશકર્તા પ્રોફાઇલ', es: 'PERFIL DE USUARIO', fr: 'PROFIL UTILISATEUR', de: 'BENUTZERPROFIL',
    ar: 'الملف الشخصي', ja: 'ユーザー情報', zh: '用户基本信息', ru: 'ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ'
  },
  roleHeader: {
    en: 'ROLE', ta: 'பொறுப்பு', hi: 'भूमिका', te: 'పాత్ర', kn: 'ಪಾತ್ರ', ml: 'റോൾ',
    bn: 'ভূমিকা', mr: 'भूमिका', gu: 'ભૂમિકા', es: 'ROL', fr: 'RÔLE', de: 'ROLLE',
    ar: 'الدور', ja: '役割', zh: '系统角色', ru: 'РОЛЬ'
  },
  trustScoreHeader: {
    en: 'TRUST SCORE', ta: 'நம்பிக்கை மதிப்பெண்', hi: 'विश्वास स्कोर', te: 'ట్రస్ట్ స్కోర్', kn: 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್', ml: 'ട്രസ്റ്റ് സ്കോർ',
    bn: 'ট্রাস্ট স্কোর', mr: 'ट्रस्ट स्कोअर', gu: 'ટ્રસ્ટ સ્કોર', es: 'PUNTUACIÓN DE CONFIANZA', fr: 'SCORE DE CONFIANCE', de: 'VERTRAUENSWERT',
    ar: 'معدل الثقة', ja: '信用スコア', zh: '信誉评分', ru: 'РЕЙТИНГ ДОВЕРИЯ'
  },
  verificationHeader: {
    en: 'VERIFICATION', ta: 'சரிபார்ப்பு நிலை', hi: 'सत्यापन स्थिति', te: 'ధృవీకరణ', kn: 'ಪರಿಶೀಲನೆ', ml: 'സ്ഥിരീകരണം',
    bn: 'যাচাইকরণ', mr: 'पडताळणी', gu: 'ચકાસણી', es: 'VERIFICACIÓN', fr: 'VÉRIFICATION', de: 'VERIFIZIERUNG',
    ar: 'حالة التحقق', ja: '本人確認', zh: '认证状态', ru: 'ВЕРИФИКАЦИЯ'
  },
  memberSinceHeader: {
    en: 'MEMBER SINCE', ta: 'சேர்ந்த நாள்', hi: 'सदस्यता तिथि', te: 'చేరిన తేదీ', kn: 'ಸದಸ್ಯರಾದ ದಿನಾಂಕ', ml: 'അംഗമായ തീയതി',
    bn: 'সদস্যপদ তারিখ', mr: 'सदस्यता तारीख', gu: 'સભ્યપદ તારીખ', es: 'MIEMBRO DESDE', fr: 'MEMBRE DEPUIS', de: 'MITGLIED SEIT',
    ar: 'عضو منذ', ja: '登録年月日', zh: '注册日期', ru: 'ЗАРЕГИСТРИРОВАН'
  },
  actionsHeader: {
    en: 'ACTIONS', ta: 'செயல்கள்', hi: 'क्रियाएँ', te: 'చర్యలు', kn: 'ಕ್ರಮಗಳು', ml: 'പ്രവർത്തനങ്ങൾ',
    bn: 'পদক্ষেপ', mr: 'कृती', gu: 'ક્રિયાઓ', es: 'ACCIONES', fr: 'ACTIONS', de: 'AKTIONEN',
    ar: 'الإجراءات', ja: '操作', zh: '快捷操作', ru: 'ДЕЙСТВИЯ'
  },
  verifiedBadge: {
    en: 'Verified', ta: 'சரிபார்க்கப்பட்டது', hi: 'सत्यापित', te: 'ధృవీకరించబడింది', kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ', ml: 'സ്ഥിരീകരിച്ചു',
    bn: 'যাচাইকৃত', mr: 'सत्यापित', gu: 'ચકાસાયેલ', es: 'Verificado', fr: 'Vérifié', de: 'Verifiziert',
    ar: 'موثق', ja: '認証済み', zh: '已认证', ru: 'Подтвержден'
  },
  unverifiedBadge: {
    en: 'Unverified', ta: 'சரிபார்க்கப்படவில்லை', hi: 'असत्यापित', te: 'ధృవీకరించబడలేదు', kn: 'ಪರಿಶೀಲಿಸಿಲ್ಲ', ml: 'സ്ഥിരീകരിച്ചിട്ടില്ല',
    bn: 'অযাচাইকৃত', mr: 'अपुष्ट', gu: 'અચકાસાયેલ', es: 'Sin Verificar', fr: 'Non vérifié', de: 'Nicht verifiziert',
    ar: 'غير موثق', ja: '未認証', zh: '未认证', ru: 'Не подтвержден'
  },

  // Agency & Team Management Specifics
  enterpriseWorkspace: {
    en: 'Enterprise Agency Workspace', ta: 'நிறுவன ஏஜென்சி பணியிடம்', hi: 'एंटरप्राइज एजेंसी वर्कस्पेस', te: 'ఎంటర్‌ప్రైజ్ ఏజెన్సీ వర్క్‌స్పేస్',
    kn: 'ಎಂಟರ್‌ಪ್ರೈಸ್ ಏಜೆನ್ಸಿ ಕಾರ್ಯಕ್ಷೇತ್ರ', ml: 'എന്റർപ്രൈസ് ഏജൻസി വർക്ക്‌സ്‌പേസ്', bn: 'এন্টারপ্রাইজ এজেন্সি ওয়ার্কস্পেস', mr: 'एंटरप्राइज एजन्सी वर्कस्पेस',
    gu: 'એન્ટરપ્રાઇઝ એજન્સી વર્કસ્પેસ', es: 'Espacio de Trabajo Empresarial', fr: 'Espace d’agence entreprise', de: 'Enterprise-Agentur-Arbeitsbereich',
    ar: 'مساحة عمل وكالة المؤسسات', ja: '企業向けエージェンシー・ワークスペース', zh: '企业级机构工作空间', ru: 'Корпоративное рабочее пространство'
  },
  agencyTitle: {
    en: 'Agency & Team Management', ta: 'ஏஜென்சி & குழு மேலாண்மை', hi: 'एजेंसी और टीम प्रबंधन',
    te: 'ఏజెన్సీ & బృంద నిర్వహణ', kn: 'ಏಜೆನ್ಸಿ ಮತ್ತು ತಂಡದ ನಿರ್ವಹಣೆ', ml: 'ഏജൻസി & ടീം മാനേജ്മെന്റ്',
    bn: 'এজেন্সি ও টিম ম্যানেজমেন্ট', mr: 'एजन्सी आणि टीम व्यवस्थापन', gu: 'એજન્સી અને ટીમ મેનેજમેન્ટ',
    es: 'Gestión de Agencia y Equipos', fr: 'Gestion de l’agence et des équipes', de: 'Agentur- & Teammanagement',
    ar: 'إدارة الوكالة وفرق العمل', ja: 'エージェンシー＆チーム管理', zh: '机构团队与人才管理', ru: 'Управление агентством и командой'
  },
  agencySubtitle: {
    en: 'Manage agency talent, allocate enterprise contracts, and track revenue splits',
    ta: 'திறமையான பணியாளர்களை நிர்வகிக்கவும், திட்டங்களை ஒதுக்கவும், வருமான பகிர்வைக் கண்காணிக்கவும்',
    hi: 'एजेंसी प्रतिभा का प्रबंधन करें, अनुबंध आवंटित करें और राजस्व विभाजन को ट्रैक करें',
    te: 'ఏజెన్సీ ప్రతిభను నిర్వహించండి, ఎంటర్‌ప్రైజ్ ఒప్పందాలను కేటాయించండి మరియు ఆదాయ విభజనను ట్రాక్ చేయండి',
    kn: 'ಏಜೆನ್ಸಿ ಪ್ರತಿಭೆಯನ್ನು ನಿರ್ವಹಿಸಿ, ಉದ್ಯಮ ಒಪ್ಪಂದಗಳನ್ನು ಹಂಚಿಕೆ ಮಾಡಿ ಮತ್ತು ಆದಾಯ ವಿಭಜನೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    ml: 'ഏജൻസി പ്രതിഭകളെ കൈകാര്യം ചെയ്യുക, കരാറുകൾ അനുവദിക്കുക, വരുമാന വിഹിതം നിരീക്ഷിക്കുക',
    bn: 'এজেন্সি প্রতিভা পরিচালনা করুন, চুক্তি বরাদ্দ করুন এবং রাজস্ব বিভাজন ট্র্যাক করুন',
    mr: 'एजन्सी प्रतिभेचे व्यवस्थापन करा, करार वाटप करा आणि महसूल विभागणीचा मागोवा घ्या',
    gu: 'એજન્સી પ્રતિભાનું સંચાલન કરો, કરારો ફાળવો અને આવક વિભાજનને ટ્રૅક કરો',
    es: 'Gestione el talento de la agencia, asigne contratos y controle la distribución de ingresos',
    fr: 'Gérer les talents de l’agence, allouer les contrats et suivre la répartition des revenus',
    de: 'Verwalten Sie Agenturtalente, weisen Sie Verträge zu und verfolgen Sie Umsatzaufteilungen',
    ar: 'إدارة مواهب الوكالة وتوزيع عقود الشركات وتتبع تقاسم الإيرادات',
    ja: 'エージェンシー所属タレントの管理、大口案件のアサイン、売上分配を追跡',
    zh: '管理机构专业人才库、分配企业级智能合约并追踪团队收益分成',
    ru: 'Управление специалистами агентства, распределение контрактов и отслеживание доходов'
  },
  addAgencyTalent: {
    en: '+ Add Agency Talent', ta: '+ புதிய திறமையாளர் சேர்', hi: '+ एजेंसी प्रतिभा जोड़ें', te: '+ ఏజెన్సీ ప్రతిభను జోడించండి', kn: '+ ಏಜೆನ್ಸಿ ಪ್ರತಿಭೆಯನ್ನು ಸೇರಿಸಿ', ml: '+ പുതിയ പ്രതിഭയെ ചേർക്കുക',
    bn: '+ নতুন প্রতিভা যোগ করুন', mr: '+ नवीन प्रतिभा जोडा', gu: '+ નવી પ્રતિભા ઉમેરો', es: '+ Agregar Talento de Agencia', fr: '+ Ajouter un talent', de: '+ Agenturtalent hinzufügen',
    ar: '+ إضافة متخصص للوكالة', ja: '+ チームメンバー追加', zh: '+ 添加机构专业人才', ru: '+ Добавить специалиста'
  },
  agencyTalentRoster: {
    en: 'AGENCY TALENT ROSTER', ta: 'ஏஜென்சி பணியாளர் பட்டியல்', hi: 'एजेंसी प्रतिभा रोस्टर', te: 'ఏజెన్సీ ప్రతిభ జాబితా', kn: 'ಏಜೆನ್ಸಿ ಪ್ರತಿಭಾ ಪಟ್ಟಿ', ml: 'ഏജൻസി പ്രതിഭാ പട്ടിക',
    bn: 'এজেন্সি প্রতিভা রোস্টার', mr: 'एजन्सी टॅलेंट रोस्टर', gu: 'એજન્સી ટેલેન્ટ રોસ્ટર', es: 'LISTA DE TALENTOS DE AGENCIA', fr: 'RÉPERTOIRE DES TALENTS', de: 'AGENTUR-TALENTVERZEICHNIS',
    ar: 'قائمة مواهب الوكالة', ja: '所属スペシャリスト名簿', zh: '机构人才名册', ru: 'СПИСОК СПЕЦИАЛИСТОВ АГЕНТСТВА'
  },
  members: {
    en: 'Members', ta: 'உறுப்பினர்கள்', hi: 'सदस्य', te: 'సభ్యులు', kn: 'ಸದಸ್ಯರು', ml: 'അംഗങ്ങൾ',
    bn: 'সদস্য', mr: 'सदस्य', gu: 'સભ્યો', es: 'Miembros', fr: 'Membres', de: 'Mitglieder',
    ar: 'أعضاء', ja: '名', zh: '名成员', ru: 'участников'
  },
  verifiedSpecialists: {
    en: 'Verified Specialists', ta: 'சரிபார்க்கப்பட்ட வல்லுநர்கள்', hi: 'सत्यापित विशेषज्ञ', te: 'ధృవీకరించబడిన నిపుణులు', kn: 'ಪರಿಶೀಲಿಸಿದ ತಜ್ಞರು', ml: 'സ്ഥിരീകരിച്ച വിദഗ്ദ്ധർ',
    bn: 'যাচাইকৃত বিশেষজ্ঞ', mr: 'सत्यापित तज्ञ', gu: 'ચકાસાયેલ નિષ્ણાતો', es: 'Especialistas Verificados', fr: 'Spécialistes vérifiés', de: 'Verifizierte Spezialisten',
    ar: 'متخصصون موثقون', ja: '認証済みエキスパート', zh: '认证专业人才', ru: 'Проверенные специалисты'
  },
  activeAgencyContracts: {
    en: 'ACTIVE AGENCY CONTRACTS', ta: 'செயலில் உள்ள ஒப்பந்தங்கள்', hi: 'सक्रिय एजेंसी अनुबंध', te: 'క్రియాశీల ఒప్పందాలు', kn: 'ಸಕ್ರಿಯ ಒಪ್ಪಂದಗಳು', ml: 'സജീവ കരാറുകൾ',
    bn: 'সক্রিয় চুক্তি', mr: 'सक्रिय करार', gu: 'સક્રિય કરારો', es: 'CONTRATOS ACTIVOS DE AGENCIA', fr: 'CONTRATS ACTIFS D’AGENCE', de: 'AKTIVE AGENTURVERTRÄGE',
    ar: 'عقود الوكالة النشطة', ja: '進行中の受託契約数', zh: '执行中机构合同', ru: 'АКТИВНЫЕ КОНТРАКТЫ АГЕНТСТВА'
  },
  projects: {
    en: 'Projects', ta: 'திட்டங்கள்', hi: 'प्रोजेक्ट्स', te: 'ప్రాజెక్ట్‌లు', kn: 'ಯೋಜನೆಗಳು', ml: 'പ്രോജക്ടുകൾ',
    bn: 'প্রজেক্ট', mr: 'प्रकल्प', gu: 'પ્રોજેક્ટ્સ', es: 'Proyectos', fr: 'Projets', de: 'Projekte',
    ar: 'مشاريع', ja: '件の案件', zh: '个项目', ru: 'проектов'
  },
  contractValue: {
    en: 'Contract Value', ta: 'ஒப்பந்த மதிப்பு', hi: 'अनुबंध मूल्य', te: 'ఒప్పందం విలువ', kn: 'ಒಪ್ಪಂದ ಮೌಲ್ಯ', ml: 'കരാർ മൂല്യം',
    bn: 'চুক্তি মূল্য', mr: 'करार मूल्य', gu: 'કરાર મૂલ્ય', es: 'Valor del Contrato', fr: 'Valeur du contrat', de: 'Vertragswert',
    ar: 'قيمة العقود', ja: '契約総額', zh: '合同估值', ru: 'Сумма контрактов'
  },
  totalAgencyRevenue: {
    en: 'TOTAL AGENCY REVENUE', ta: 'மொத்த ஏஜென்சி வருமானம்', hi: 'कुल एजेंसी राजस्व', te: 'మొత్తం ఏజెన్సీ ఆదాయం', kn: 'ಒಟ್ಟು ಏಜೆನ್ಸಿ ಆದಾಯ', ml: 'ആകെ ഏജൻസി വരുമാനം',
    bn: 'মোট এজেন্সি রাজস্ব', mr: 'एकूण एजन्सी महसूल', gu: 'કુલ એજન્સી આવક', es: 'INGRESOS TOTALES DE AGENCIA', fr: 'REVENUS TOTAUX D’AGENCE', de: 'GESAMTER AGENTURUMSATZ',
    ar: 'إجمالي إيرادات الوكالة', ja: 'エージェンシー総収益', zh: '机构累计总营收', ru: 'ОБЩИЙ ДОХОД АГЕНТСТВА'
  },
  growthThisMonth: {
    en: 'Growth this month', ta: 'இந்த மாத வளர்ச்சி', hi: 'इस महीने की वृद्धि', te: 'ఈ నెలలో వృద్ధి', kn: 'ಈ ತಿಂಗಳ ಬೆಳವಣಿಗೆ', ml: 'ഈ മാസത്തെ വളർച്ച',
    bn: 'এই মাসের বৃদ্ধি', mr: 'या महिन्यातील वाढ', gu: 'આ મહિનાની વૃદ્ધિ', es: 'Crecimiento este mes', fr: 'Croissance ce mois-ci', de: 'Wachstum diesen Monat',
    ar: 'النمو هذا الشهر', ja: '今月の成長率', zh: '本月环比增长', ru: 'Рост в этом месяце'
  },
  agencyTrustRating: {
    en: 'AGENCY TRUST RATING', ta: 'ஏஜென்சி நம்பிக்கை மதிப்பீடு', hi: 'एजेंसी ट्रस्ट रेटिंग', te: 'ఏజెన్సీ ట్రస్ట్ రేటింగ్', kn: 'ಏಜೆನ್ಸಿ ವಿಶ್ವಾಸಾರ್ಹತೆ ರೇಟಿಂಗ್', ml: 'ഏജൻസി ട്രസ്റ്റ് റേറ്റിംഗ്',
    bn: 'এজেন্সি ট্রাস্ট রেটিং', mr: 'एजन्सी ट्रस्ट रेटिंग', gu: 'એજન્સી ટ્રસ્ટ રેટિંગ', es: 'CALIFICACIÓN DE CONFIANZA', fr: 'NOTE DE CONFIANCE D’AGENCE', de: 'AGENTUR-VERTRAUENSBEWERTUNG',
    ar: 'تقييم ثقة الوكالة', ja: 'エージェンシー信頼格付け', zh: '机构信誉评级', ru: 'РЕЙТИНГ ДОВЕРИЯ АГЕНТСТВА'
  },
  tier1TopRated: {
    en: 'Top Rated Enterprise', ta: 'உயர்தர முன்னணி நிறுவனம்', hi: 'शीर्ष रेटेड एंटरप्राइज', te: 'టాప్ రేటెడ్ ఎంటర్‌ప్రైజ్', kn: 'ಉನ್ನತ ಶ್ರೇಣಿಯ ಎಂಟರ್‌ಪ್ರೈಸ್', ml: 'ടോപ്പ് റേറ്റഡ് എന്റർപ്രൈസ്',
    bn: 'শীর্ষ রেটেড এন্টারপ্রাইজ', mr: 'टॉप रेटेड एंटरप्राइज', gu: 'ટોપ રેટેડ એન્ટરપ્રાઇઝ', es: 'Empresa Mejor Valorada', fr: 'Entreprise la mieux notée', de: 'Bestbewertetes Unternehmen',
    ar: 'مؤسسة الأعلى تقييماً', ja: '最高ランク認定企業', zh: '顶级认证服务商', ru: 'Высокорейтинговое агентство'
  },
  agencyTableTitle: {
    en: 'Agency Specialists & Deliverable Leads', ta: 'ஏஜென்சி வல்லுநர்கள் & திட்டத் தலைவர்கள்', hi: 'एजेंसी विशेषज्ञ और परियोजना प्रमुख',
    te: 'ఏజెన్సీ నిపుణులు & డెలివరీ లీడ్స్', kn: 'ಏಜೆನ್ಸಿ ತಜ್ಞರು ಮತ್ತು ವಿತರಣಾ ಮುಖಂಡರು', ml: 'ഏജൻസി വിദഗ്ധരും പ്രോജക്റ്റ് ലീഡുകളും',
    bn: 'এজেন্সি বিশেষজ্ঞ ও প্রকল্প প্রধান', mr: 'एजन्सी तज्ञ आणि प्रकल्प प्रमुख', gu: 'એજન્સી નિષ્ણાતો અને પ્રોજેક્ટ લીડ્સ',
    es: 'Especialistas de Agencia y Líderes de Entrega', fr: 'Spécialistes d’agence et responsables de livrables', de: 'Agentur-Spezialisten & Projektleiter',
    ar: 'متخصصو الوكالة وقادة التسليمات', ja: 'エージェンシー専門家＆デリバリーリード一覧', zh: '机构专家名录与项目交付主管', ru: 'Специалисты агентства и руководители проектов'
  },
  specialistHeader: {
    en: 'SPECIALIST', ta: 'வல்லுநர்', hi: 'विशेषज्ञ', te: 'నిపుణుడు', kn: 'ತಜ್ಞ', ml: 'വിദഗ്ദ്ധൻ',
    bn: 'বিশেষজ্ঞ', mr: 'तज्ञ', gu: 'નિષ્ણાત', es: 'ESPECIALISTA', fr: 'SPÉCIALISTE', de: 'SPEZIALIST',
    ar: 'المتخصص', ja: 'スペシャリスト', zh: '专业人才', ru: 'СПЕЦИАЛИСТ'
  },
  roleFocusHeader: {
    en: 'ROLE / FOCUS', ta: 'பொறுப்பு / பணிப்பிரிவு', hi: 'भूमिका / फोकस', te: 'పాత్ర / విభాగం', kn: 'ಪಾತ್ರ / ಕ್ಷೇತ್ರ', ml: 'റോൾ / ഫോക്കസ്',
    bn: 'ভূমিকা / ফোকাস', mr: 'भूमिका / फोकस', gu: 'ભૂમિકા / ફોકસ', es: 'ROL / ESPECIALIDAD', fr: 'RÔLE / SPÉCIALITÉ', de: 'ROLLE / SCHWERPUNKT',
    ar: 'الدور / التخصص', ja: '担当分野 / 役割', zh: '岗位定位与方向', ru: 'РОЛЬ / СПЕЦИАЛИЗАЦИЯ'
  },
  coreStackHeader: {
    en: 'CORE STACK', ta: 'முக்கிய திறன்கள்', hi: 'कोर स्टैक', te: 'కోర్ స్టాక్', kn: 'ಕೋರ್ ಕೌಶಲ್ಯಗಳು', ml: 'കോർ സ്റ്റാക്ക്',
    bn: 'কোর স্ট্যাক', mr: 'कोर स्टॅक', gu: 'મુખ્ય કુશળતા', es: 'TECNOLOGÍAS PRINCIPALES', fr: 'STACK TECHNIQUE', de: 'KERN-STACK',
    ar: 'المهارات الأساسية', ja: '主要技術スタック', zh: '核心技术栈', ru: 'ОСНОВНОЙ СТЕК'
  },
  activeProjectsHeader: {
    en: 'ACTIVE PROJECTS', ta: 'செயலில் உள்ள திட்டங்கள்', hi: 'सक्रिय प्रोजेक्ट्स', te: 'క్రియాశీల ప్రాజెక్ట్‌లు', kn: 'ಸಕ್ರಿಯ ಯೋಜನೆಗಳು', ml: 'സജീവ പ്രോജക്ടുകൾ',
    bn: 'সক্রিয় প্রজেক্ট', mr: 'सक्रिय प्रकल्प', gu: 'સક્રિય પ્રોજેક્ટ્સ', es: 'PROYECTOS ACTIVOS', fr: 'PROJETS ACTIFS', de: 'AKTIVE PROJEKTE',
    ar: 'المشاريع النشطة', ja: '担当案件数', zh: '当前在研项目', ru: 'АКТИВНЫЕ ПРОЕКТЫ'
  },
  revenueGeneratedHeader: {
    en: 'REVENUE GENERATED', ta: 'ஈட்டிய வருமானம்', hi: 'उत्पन्न राजस्व', te: 'ఆర్జించిన ఆదాయం', kn: 'ಗಳಿಸಿದ ಆದಾಯ', ml: 'നേടിയ വരുമാനം',
    bn: 'অর্জিত রাজস্ব', mr: 'मिळवलेला महसूल', gu: 'કમાયેલ આવક', es: 'INGRESOS GENERADOS', fr: 'REVENUS GÉNÉRÉS', de: 'GENERIERTER UMSATZ',
    ar: 'الإيرادات المحققة', ja: '累計売上貢献額', zh: '创造收益额', ru: 'ПРИНЕСЕННЫЙ ДОХОД'
  },
  ratingHeader: {
    en: 'RATING', ta: 'மதிப்பீடு', hi: 'रेटिंग', te: 'రేటింగ్', kn: 'ರೇಟಿಂಗ್', ml: 'റേറ്റിംഗ്',
    bn: 'রেটিং', mr: 'रेटिंग', gu: 'રેટિંગ', es: 'VALORACIÓN', fr: 'ÉVALUATION', de: 'BEWERTUNG',
    ar: 'التقييم', ja: '評価レート', zh: '综合评分', ru: 'РЕЙТИНГ'
  },
  statusHeader: {
    en: 'STATUS', ta: 'நிலை', hi: 'स्थिति', te: 'స్థితి', kn: 'ಸ್ಥಿತಿ', ml: 'നില',
    bn: 'অবস্থা', mr: 'स्थिती', gu: 'સ્થિતિ', es: 'ESTADO', fr: 'STATUT', de: 'STATUS',
    ar: 'الحالة', ja: '稼働状態', zh: '当前状态', ru: 'СТАТУС'
  },
  activeStatus: {
    en: 'Active', ta: 'செயலில் உள்ளது', hi: 'सक्रिय', te: 'క్రియాశీల', kn: 'ಸಕ್ರಿಯ', ml: 'സജീവം',
    bn: 'সক্রিয়', mr: 'सक्रिय', gu: 'સક્રિય', es: 'Activo', fr: 'Actif', de: 'Aktiv',
    ar: 'نشط', ja: '稼働中', zh: '活跃执行中', ru: 'Активен'
  },
  availableStatus: {
    en: 'Available', ta: 'கிடைக்கக்கூடியவர்', hi: 'उपलब्ध', te: 'అందుబాటులో ఉంది', kn: 'ಲಭ್ಯವಿದೆ', ml: 'ലഭ്യമാണ്',
    bn: 'উপলব্ধ', mr: 'उपलब्ध', gu: 'ઉપલબ્ધ', es: 'Disponible', fr: 'Disponible', de: 'Verfügbar',
    ar: 'متاح', ja: 'アサイン可能', zh: '可立即接单', ru: 'Доступен'
  },

  // Dispute & Mediation Center
  disputesTitle: {
    en: 'Dispute & Mediation Center', ta: 'சர்ச்சை & சமரச மையம்', hi: 'विवाद और मध्यस्थता केंद्र', te: 'వివాద & మధ్యవర్తిత్వ కేంద్రం',
    kn: 'ವಿವಾದ ಮತ್ತು ಮಧ್ಯಸ್ಥಿಕೆ ಕೇಂದ್ರ', ml: 'തർക്ക പരിഹാര കേന്ദ്രം', bn: 'বিরোধ ও সালিশ কেন্দ্র', mr: 'वाद आणि लवाद केंद्र',
    gu: 'વિવાદ અને મધ્યસ્થતા કેન્દ્ર', es: 'Centro de Disputas y Mediación', fr: 'Centre de litiges et médiation', de: 'Streitbeilegungs- und Mediationszentrum',
    ar: 'مركز النزاعات والوساطة', ja: '紛争仲裁＆調停センター', zh: '争议调解与仲裁中心', ru: 'Центр разрешения споров и медиации'
  },
  disputesSubtitle: {
    en: 'Impartial contract arbitration, evidence investigation, and escrow dispute resolutions',
    ta: 'நடுநிலையான ஒப்பந்த மத்தியஸ்தம், சான்றுகள் ஆய்வு மற்றும் எஸ்க்ரோ சர்ச்சை தீர்வுகள்',
    hi: 'निष्पक्ष अनुबंध मध्यस्थता, साक्ष्य जांच और एस्क्रो विवाद समाधान',
    te: 'నిష్పాక్షిక ఒప్పంద మధ్యవర్తిత్వం, ఆధారాల పరిశోధన మరియు ఎస్క్రో వివాద పరిష్కారాలు',
    kn: 'ನಿಷ್ಪಕ್ಷಪಾತ ಒಪ್ಪಂದ ಮಧ್ಯಸ್ಥಿಕೆ, ಸಾಕ್ಷ್ಯ ತನಿಖೆ ಮತ್ತು ಎಸ್ಕ್ರೋ ವಿವಾದ ಪರಿಹಾರಗಳು',
    ml: 'നിഷ്പക്ഷ കരാർ മധ്യസ്ഥത, തെളിവ് പരിശോധന, എസ്ക്രോ തർക്ക പരിഹാരങ്ങൾ',
    bn: 'নিরপেক্ষ চুক্তি সালিশ, প্রমাণ তদন্ত এবং এসক্রো বিরোধ নিষ্পত্তি',
    mr: 'निःपक्षपाती करार लवाद, पुरावा तपास आणि एस्क्रो वाद निराकरण',
    gu: 'નિષ્પક્ષ કરાર લવાદ, પુરાવા તપાસ અને એસ્ક્રો વિવાદ ઉકેલો',
    es: 'Arbitraje imparcial de contratos, investigación de pruebas y resolución de disputas de custodia',
    fr: 'Arbitrage impartial des contrats, examen des preuves et résolution des litiges de séquestre',
    de: 'Unparteiische Vertragsschlichtung, Beweisprüfung und Beilegung von Treuhandstreitigkeiten',
    ar: 'تحكيم عقود محايد، وتحقيق في الأدلة، وحلول لنزاعات الضمان المالي',
    ja: '中立的な契約仲裁、証拠調査、エスクロー資金の公正な返還・解除',
    zh: '中立透明的智能合约仲裁、双方举证审查与智能托管纠纷妥善裁决',
    ru: 'Беспристрастный арбитраж контрактов, проверка доказательств и разрешение споров по эскроу'
  },
  fileDisputeBtn: {
    en: 'File Escrow Dispute', ta: 'எஸ்க்ரோ சர்ச்சையைப் பதிவுசெய்', hi: 'एस्क्रो विवाद दर्ज करें', te: 'ఎస్క్రో వివాదాన్ని నమోదు చేయండి',
    kn: 'ಎಸ್ಕ್ರೋ ವಿವಾದ ದಾಖಲಿಸಿ', ml: 'എസ്ക്രോ തർക്കം ഫയൽ ചെയ്യുക', bn: 'এসক্রো বিরোধ দায়ের করুন', mr: 'एस्क्रो वाद दाखल करा',
    gu: 'એસ્ક્રો વિવાદ દાખલ કરો', es: 'Presentar Disputa de Custodia', fr: 'Déposer un litige', de: 'Treuhand-Streitfall melden',
    ar: 'رفع نزاع ضمان', ja: 'エスクロー紛争を申し立てる', zh: '发起智能托管争议仲裁', ru: 'Открыть спор по эскроу'
  },

  // Smart Contracts & NDA
  contractsTitle: {
    en: 'Smart Contracts & NDA Agreements', ta: 'ஸ்மார்ட் ஒப்பந்தங்கள் & NDA உடன்படிக்கைகள்', hi: 'स्मार्ट अनुबंध और एनडीए समझौते',
    te: 'స్మార్ట్ కాంట్రాక్టులు & NDA ఒప్పందాలు', kn: 'ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು ಮತ್ತು NDA', ml: 'സ്മാർട്ട് കരാറുകളും എൻ‌ഡി‌എയും',
    bn: 'স্মার্ট চুক্তি ও এনডিএ চুক্তি', mr: 'स्मार्ट करार आणि NDA करार', gu: 'સ્માર્ટ કરારો અને એનડીએ કરારો',
    es: 'Contratos Inteligentes y Acuerdos NDA', fr: 'Contrats intelligents & Accords NDA', de: 'Smart Contracts & NDA-Vereinbarungen',
    ar: 'العقود الذكية واتفاقيات عدم الإفصاح', ja: 'スマートコントラクト＆NDA秘密保持契約', zh: '智能合约与保密协议 (NDA)', ru: 'Смарт-контракты и соглашения о неразглашении'
  },
  contractsSubtitle: {
    en: 'Manage legally binding freelance service agreements, NDAs, and digital signatures',
    ta: 'சட்டப்பூர்வ சேவை ஒப்பந்தங்கள், NDA மற்றும் டிஜிட்டல் கையொப்பங்களை நிர்வகிக்கவும்',
    hi: 'कानूनी रूप से बाध्यकारी फ्रीलांस सेवा समझौतों, एनडीए और डिजिटल हस्ताक्षरों का प्रबंधन करें',
    te: 'చట్టబద్ధమైన ఫ్రీలాన్స్ సేవా ఒప్పందాలు, NDAలు మరియు డిజిటల్ సంతకాలను నిర్వహించండి',
    kn: 'ಕಾನೂನುಬದ್ಧ ಒಪ್ಪಂದಗಳು, NDA ಮತ್ತು ಡಿಜಿಟಲ್ ಸಹಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    ml: 'നിയമപരമായി ബാധ്യതയുള്ള ഫ്രീലാൻസ് കരാറുകളും ഡിജിറ്റൽ ഒപ്പുകളും കൈകാര്യം ചെയ്യുക',
    bn: 'আইনগতভাবে বাধ্যতামূলক ফ্রিল্যান্স পরিষেবা চুক্তি, এনডিএ এবং ডিজিটাল স্বাক্ষর পরিচালনা করুন',
    mr: 'कायदेशीररित्या बंधनकारक फ्रिलांस सेवा करार, NDA आणि डिजिटल स्वाक्षऱ्या व्यवस्थापित करा',
    gu: 'કાયદેસર રીતે બંધનકર્તા ફ્રીલાન્સ સેવા કરારો, એનડીએ અને ડિજિટલ સહીઓનું સંચાલન કરો',
    es: 'Gestione contratos legales de servicios independientes, acuerdos de confidencialidad y firmas digitales',
    fr: 'Gérer les contrats de service juridiquement contraignants, les accords de confidentialité et les signatures',
    de: 'Verwalten Sie rechtsverbindliche Freelance-Verträge, Geheimhaltungsvereinbarungen und digitale Signaturen',
    ar: 'إدارة اتفاقيات الخدمة المستقلة الملزمة قانونياً واتفاقيات السرية والتوقيعات الرقمية',
    ja: '法的拘束力のある業務委託契約、秘密保持契約書、および暗号電子署名の管理',
    zh: '全面管理具备法律效力的自由职业服务协议、保密协议及区块链存证电子签名',
    ru: 'Управление юридически обязывающими договорами, соглашениями о конфиденциальности и ЭЦП'
  },

  // Analytics & Reports
  analyticsTitle: {
    en: 'Platform Revenue & Financial Telemetry', ta: 'தள வருமானம் & நிதி பகுப்பாய்வு', hi: 'प्लेटफ़ॉर्म राजस्व और वित्तीय टेलीमेट्री',
    te: 'ప్లాట్‌ఫారమ్ ఆదాయం & ఆర్థిక విశ్లేషణ', kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆದಾಯ ಮತ್ತು ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ', ml: 'പ്ലാറ്റ്ഫോം വരുമാനവും സാമ്പത്തിക വിശകലനവും',
    bn: 'প্ল্যাটফর্ম রাজস্ব ও আর্থিক বিশ্লেষণ', mr: 'प्लॅटफॉर्म महसूल आणि आर्थिक विश्लेषण', gu: 'પ્લેટફોર્મ આવક અને નાણાકીય ટેલિમેટ્રી',
    es: 'Ingresos de Plataforma y Telemetría Financiera', fr: 'Revenus de la plateforme et télémétrie financière', de: 'Plattformeinnahmen & Finanztriangulation',
    ar: 'إيرادات المنصة والقياسات المالية الحية', ja: 'プラットフォーム売上＆財務テレメトリ', zh: '平台营收与财务深度数据分析', ru: 'Доходы платформы и финансовая телеметрия'
  },
  analyticsSubtitle: {
    en: 'Live escrow volume, financial metrics, and multi-quarter platform growth telemetry',
    ta: 'நேரலை எஸ்க்ரோ அளவு, நிதி அளவீடுகள் மற்றும் வளர்ச்சி பகுப்பாய்வு',
    hi: 'लाइव एस्क्रो वॉल्यूम, वित्तीय मेट्रिक्स और प्लेटफ़ॉर्म विकास दर',
    te: 'ప్రత్యక్ష ఎస్క్రో వాల్యూమ్, ఆర్థిక కొలమానాలు మరియు ప్లాట్‌ఫారమ్ వృద్ధి గణాంకాలు',
    kn: 'ಲೈವ್ ಎಸ್ಕ್ರೋ ಪ್ರಮಾಣ, ಹಣಕಾಸು ಮಾಪನಗಳು ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಅಂಕಿಅಂಶಗಳು',
    ml: 'തത്സമയ എസ്ക്രോ വോളിയം, സാമ്പത്തിക അളവുകൾ, വളർച്ചാ സ്ഥിതിവിവരക്കണക്കുകൾ',
    bn: 'লাইভ এসক্রো ভলিউম, আর্থিক মেট্রিক্স এবং প্ল্যাটফর্ম বৃদ্ধির পরিসংখ্যান',
    mr: 'थेट एस्क्रो व्हॉल्यूम, आर्थिक मेट्रिक्स आणि प्लॅटफॉर्म वाढीची आकडेवारी',
    gu: 'લાઇવ એસ્ક્રો વોલ્યુમ, નાણાકીય મેટ્રિક્સ અને પ્લેટફોર્મ વૃદ્ધિ ટેલિમેટ્રી',
    es: 'Volumen en vivo de custodia, métricas financieras y telemetría de crecimiento',
    fr: 'Volume de séquestre en direct, indicateurs financiers et télémétrie de croissance',
    de: 'Echtzeit-Treuhandvolumen, Finanzkennzahlen und Wachstumsberichte',
    ar: 'حجم الضمان الحي والمؤشرات المالية ونمو المنصة عبر الفصول',
    ja: 'リアルタイム・エスクロー残高、主要財務指標、および四半期ごとの成長推移',
    zh: '实时智能托管总额、全周期财务关键指标与季度平台复合增长趋势',
    ru: 'Объем эскроу в реальном времени, финансовые метрики и динамика роста платформы'
  },

  // Public Profile & Trust
  profileTitle: {
    en: 'Public Profile & Identity Settings', ta: 'பொது சுயவிவரம் & அடையாள அமைப்புகள்', hi: 'सार्वजनिक प्रोफ़ाइल और पहचान सेटिंग्स',
    te: 'పబ్లిక్ ప్రొఫైల్ & గుర్తింపు సెట్టింగ్‌లు', kn: 'ಸಾರ್ವಜನಿಕ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಗುರುತಿನ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', ml: 'പബ്ലിക് പ്രൊഫൈലും ഐഡന്റിറ്റി ക്രമീകരണങ്ങളും',
    bn: 'পাবলিক প্রোফাইল ও পরিচয় সেটিংস', mr: 'सार्वजनिक प्रोफाइल आणि ओळख सेटिंग्ज', gu: 'જાહેર પ્રોફાઇલ અને ઓળખ સેટિંગ્સ',
    es: 'Perfil Público y Configuración de Identidad', fr: 'Profil public et paramètres d’identité', de: 'Öffentliches Profil & Identitätseinstellungen',
    ar: 'الملف الشخصي العام وإعدادات الهوية', ja: '公開プロフィール＆本人確認設定', zh: '公开主页与实名身份设置', ru: 'Публичный профиль и настройки личности'
  },
  profileSubtitle: {
    en: 'Showcase your technical capabilities and build verified escrow credibility',
    ta: 'உங்கள் திறமைகளை வெளிப்படுத்தி, நம்பகமான எஸ்க்ரோ நற்பெயரை உருவாக்குங்கள்',
    hi: 'अपनी तकनीकी क्षमताओं का प्रदर्शन करें और सत्यापित विश्वसनीयता बनाएं',
    te: 'మీ సాంకేతిక నైపుణ్యాలను ప్రదర్శించండి మరియు ధృవీకరించబడిన విశ్వసనీయతను నిర్మించుకోండి',
    kn: 'ನಿಮ್ಮ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ಪ್ರದರ್ಶಿಸಿ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಿ',
    ml: 'നിങ്ങളുടെ സാങ്കേതിക കഴിവുകൾ പ്രദർശിപ്പിക്കുകയും വിശ്വാസ്യത വളർത്തുകയും ചെയ്യുക',
    bn: 'আপনার প্রযুক্তিগত দক্ষতা প্রদর্শন করুন এবং যাচাইকৃত বিশ্বাসযোগ্যতা তৈরি করুন',
    mr: 'तुमची तांत्रिक कौशल्ये प्रदर्शित करा आणि विश्वासार्हता निर्माण करा',
    gu: 'તમારી તકનીકી ક્ષમતાઓનું પ્રદર્શન કરો અને વિશ્વસનીયતા બનાવો',
    es: 'Muestre sus habilidades técnicas y construya una reputación verificada',
    fr: 'Mettez en valeur vos compétences techniques et renforcez votre crédibilité',
    de: 'Präsentieren Sie Ihre Fähigkeiten und bauen Sie verifizierte Glaubwürdigkeit auf',
    ar: 'اعرض قدراتك التقنية واكتسب مصداقية موثقة في عمليات الضمان المالي',
    ja: '保有技術スタックをアピールし、検証済みのエスクロー信用スコアを構築',
    zh: '全方位展示您的专业技能组合，积累经智能合约验证的卓越信誉资产',
    ru: 'Продемонстрируйте свои навыки и создайте безупречную репутацию'
  },

  // General Action Buttons & Common Words
  saveChanges: {
    en: 'Save Changes', ta: 'மாற்றங்களைச் சேமி', hi: 'बदलाव सहेजें', te: 'మార్పులను సేవ్ చేయండి', kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ', ml: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക',
    bn: 'পরিবর্তন সংরক্ষণ করুন', mr: 'बदल जतन करा', gu: 'ફેરફારો સાચવો', es: 'Guardar Cambios', fr: 'Enregistrer', de: 'Änderungen speichern',
    ar: 'حفظ التغييرات', ja: '変更を保存', zh: '保存更改', ru: 'Сохранить изменения'
  },
  applyNow: {
    en: 'Apply Now / Bid', ta: 'விண்ணப்பிக்க / ஏலம்', hi: 'आवेदन करें / बोली लगाएं', te: 'ఇప్పుడే దரఖాస్తు చేసుకోండి', kn: 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ', ml: 'ഇപ്പോൾ അപേക്ഷിക്കുക',
    bn: 'আবেদন করুন / বিড', mr: 'अर्ज करा / बोली लावा', gu: 'અરજી કરો / બિડ', es: 'Postularse / Ofertar', fr: 'Postuler / Proposer', de: 'Jetzt bewerben / Bieten',
    ar: 'قدم عرضك الآن', ja: '今すぐ応募・提案', zh: '立即投递提案', ru: 'Подать заявку'
  },
  viewWorkspace: {
    en: 'View Workspace', ta: 'பணியிடம் காண்க', hi: 'वर्कस्पेस देखें', te: 'వర్క్‌స్పేస్ చూడండి', kn: 'ಕಾರ್ಯಕ್ಷೇತ್ರ ನೋಡಿ', ml: 'വർക്ക്‌സ്‌പേസ് കാണുക',
    bn: 'ওয়ার্কস্পেস দেখুন', mr: 'वर्कस्पेस पहा', gu: 'વર્કસ્પેસ જુઓ', es: 'Ver Espacio de Trabajo', fr: 'Voir l’espace', de: 'Arbeitsbereich anzeigen',
    ar: 'عرض مساحة العمل', ja: 'ワークスペースを開く', zh: '进入协同工作台', ru: 'Открыть рабочее место'
  },
  submitWork: {
    en: 'Submit Work', ta: 'பணியைச் சமர்ப்பி', hi: 'काम सबमिट करें', te: 'పనిని సమర్పించండి', kn: 'ಕೆಲಸ ಸಲ್ಲಿಸಿ', ml: 'ജോലി സമർപ്പിക്കുക',
    bn: 'কাজ জমা দিন', mr: 'काम सबमिट करा', gu: 'કામ સબમિટ કરો', es: 'Entregar Trabajo', fr: 'Soumettre le travail', de: 'Arbeit einreichen',
    ar: 'تسليم العمل', ja: '成果物を提出する', zh: '提交交付成果', ru: 'Сдать работу'
  },
  activeMilestonesAndContracts: {
    en: 'Active Milestones & Escrow Contracts', ta: 'செயலில் உள்ள மைல்கற்கள் & எஸ்க்ரோ ஒப்பந்தங்கள்', hi: 'सक्रिय माइलस्टोन्स और एस्क्रो अनुबंध',
    te: 'యాక్టివ్ మైలురాళ్లు & ఎస్క్రో కాంట్రాక్ట్‌లు', kn: 'ಸಕ್ರಿಯ ಮೈಲಿಗಲ್ಲುಗಳು ಮತ್ತು ಎಸ್ಕ್ರೋ ಒಪ್ಪಂದಗಳು', ml: 'സജീവ നാഴികക്കല്ലുകളും കരാറുകളും',
    bn: 'সক্রিয় মাইলফলক ও এসক্রো চুক্তি', mr: 'सक्रिय टप्पे आणि एस्क्रो करार', gu: 'સક્રિય માઇલસ્ટોન્સ અને એસ્ક્રો કરારો',
    es: 'Hitos Activos y Contratos de Custodia', fr: 'Jalons actifs & Contrats de séquestre', de: 'Aktive Meilensteine & Treuhandverträge',
    ar: 'المراحل النشطة وعقود الضمان المالي', ja: '進行中のマイルストーン＆エスクロー契約', zh: '执行中里程碑与智能托管合约', ru: 'Активные этапы и смарт-контракты эскроу'
  },
  smartContractsProtection: {
    en: 'Smart contracts protected with cryptographic security', ta: 'கிரிப்டோகிராஃபிக் பாதுகாப்புடன் கூடிய ஸ்மார்ட் ஒப்பந்தங்கள்',
    hi: 'क्रिप्टोग्राफिक सुरक्षा के साथ सुरक्षित स्मार्ट अनुबंध', te: 'క్రిప్టోగ్రాఫిక్ రక్షణతో ప్రత్యక్ష స్మార్ట్ కాంట్రాక్ట్‌లు',
    kn: 'ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಭದ್ರತೆಯೊಂದಿಗೆ ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು', ml: 'ക്രിപ്റ്റോഗ്രാഫിക് സുരക്ഷയോടെയുള്ള സ്മാർട്ട് കരാറുകൾ',
    bn: 'ক্রিপ্টোগ্রাফিক সুরক্ষা সহ স্মার্ট চুক্তি', mr: 'क्रिप्टोग्राफिक सुरक्षेसह स्मार्ट करार',
    gu: 'ક્રિપ્ટોગ્રાફિક સુરક્ષા સાથે સુરક્ષિત સ્માર્ટ કરારો', es: 'Contratos inteligentes con seguridad criptográfica',
    fr: 'Contrats intelligents sécurisés cryptographiquement', de: 'Kryptografisch geschützte Smart Contracts',
    ar: 'عقود ذكية محمية بالتشفير الرقمي المتقدم', ja: '暗号化技術によって保護されたスマートコントラクト',
    zh: '全程受密码学与智能合约严格保护的资金安全体系', ru: 'Смарт-контракты с криптографической защитой'
  },
  milestoneProgress: {
    en: 'Sprint Progress', ta: 'ஸ்பிரிண்ட் முன்னேற்றம்', hi: 'स्प्रिंट प्रगति', te: 'స్ప్రింట్ పురోగతి',
    kn: 'ಪ್ರಗತಿ', ml: 'പുരോഗതി', bn: 'অগ্রগতি', mr: 'प्रगती', gu: 'પ્રગતિ',
    es: 'Progreso del Sprint', fr: 'Progression du sprint', de: 'Sprint-Fortschritt',
    ar: 'تقدم المرحلة', ja: 'スプリント進捗率', zh: '阶段交付进度', ru: 'Прогресс спринта'
  },
  activeMilestoneLabel: {
    en: 'Active Milestone', ta: 'செயலில் உள்ள மைல்கல்', hi: 'सक्रिय माइलस्टोन', te: 'యాక్టివ్ మైలురాయి',
    kn: 'ಸಕ್ರಿಯ ಮೈಲಿಗಲ್ಲು', ml: 'സജീവ നാഴികക്കല്ല്', bn: 'সক্রিয় মাইলফলক', mr: 'सक्रिय टप्पा',
    gu: 'સક્રિય માઇલસ્ટોન', es: 'Hito Activo', fr: 'Jalon actif', de: 'Aktiver Meilenstein',
    ar: 'المرحلة النشطة', ja: '現在のマイルストーン', zh: '当前执行里程碑', ru: 'Текущий этап'
  },
  verifiedEscrowBadge: {
    en: 'Verified Escrow', ta: 'சரிபார்க்கப்பட்ட எஸ்க்ரோ', hi: 'सत्यापित एस्क्रो', te: 'ధృవీకరించబడిన ఎస్క్రో',
    kn: 'ಪರಿಶೀಲಿಸಿದ ಎಸ್ಕ್ರೋ', ml: 'സ്ഥിരീകരിച്ച എസ്ക്രോ', bn: 'যাচাইকৃত এসক্রো', mr: 'सत्यापित एस्क्रो',
    gu: 'ચકાસાયેલ એસ્ક્રો', es: 'Custodia Verificada', fr: 'Séquestre vérifié', de: 'Verifizierte Treuhand',
    ar: 'ضمان مالي موثق', ja: 'エスクロー担保済み', zh: '已全额托管担保', ru: 'Эскроу подтвержден'
  },
  // All Navigation Items across all 5 roles
  findWork: {
    en: 'Find Work', ta: 'வேலை தேடு', hi: 'काम खोजें', te: 'పనిని కనుగొనండి', kn: 'ಕೆಲಸ ಹುಡುಕಿ', ml: 'ജോലി കണ്ടെത്തുക',
    bn: 'কাজ খুঁজুন', mr: 'काम शोधा', gu: 'કામ શોધો', es: 'Buscar Trabajo', fr: 'Trouver un travail', de: 'Arbeit finden',
    ar: 'البحث عن عمل', ja: '仕事を探す', zh: '寻找项目', ru: 'Найти работу'
  },
  activeProjects: {
    en: 'Active Projects', ta: 'செயலில் உள்ள திட்டங்கள்', hi: 'सक्रिय प्रोजेक्ट्स', te: 'క్రియాశీల ప్రాజెక్ట్‌లు', kn: 'ಸಕ್ರಿಯ ಯೋಜನೆಗಳು', ml: 'സജീവ പ്രോജക്ടുകൾ',
    bn: 'সক্রিয় প্রজেক্ট', mr: 'सक्रिय प्रकल्प', gu: 'સક્રિય પ્રોજેક્ટ્સ', es: 'Proyectos Activos', fr: 'Projets actifs', de: 'Aktive Projekte',
    ar: 'المشاريع النشطة', ja: '進行中のプロジェクト', zh: '进行中项目', ru: 'Активные проекты'
  },
  contractsAndESign: {
    en: 'Contracts & E-Sign', ta: 'ஒப்பந்தங்கள் & மின்னணு கையொப்பம்', hi: 'अनुबंध और ई-हस्ताक्षर', te: 'ఒప్పందాలు & ఇ-సంతకం', kn: 'ಒಪ್ಪಂದಗಳು ಮತ್ತು ಇ-ಸಹಿ', ml: 'കരാറുകളും ഇ-സൈനും',
    bn: 'চুক্তি ও ই-স্বাক্ষর', mr: 'करार आणि ई-स्वाक्षरी', gu: 'કરારો અને ઇ-સાઇન', es: 'Contratos y Firma Digital', fr: 'Contrats & Signature électronique', de: 'Verträge & E-Signatur',
    ar: 'العقود والتوقيع الإلكتروني', ja: '契約＆電子署名', zh: '电子合同与签署', ru: 'Договоры и ЭЦП'
  },
  timesheetsAndHours: {
    en: 'Timesheets & Hours', ta: 'நேர அட்டவணை & மணிகள்', hi: 'टाइमशीट और घंटे', te: 'టైమ్‌షీట్‌లు & గంటలు', kn: 'ಟೈಮ್‌ಶೀಟ್‌ಗಳು ಮತ್ತು ಗಂಟೆಗಳು', ml: 'ടൈംഷീറ്റുകളും മണിക്കൂറുകളും',
    bn: 'টাইমশীট ও কাজের সময়', mr: 'टाइमशीट आणि तास', gu: 'ટાઇમશીટ્સ અને કલાકો', es: 'Hojas de Horas y Tiempo', fr: 'Feuilles de temps & Heures', de: 'Stundenzettel & Stunden',
    ar: 'ساعات العمل والجداول', ja: '稼働記録＆時間', zh: '工时单与记录', ru: 'Табели и часы'
  },
  escrowPayouts: {
    en: 'Escrow Payouts', ta: 'எஸ்க்ரோ பணம் வழங்கல்', hi: 'एस्क्रो भुगतान', te: 'ఎస్క్రో చెల్లింపులు', kn: 'ಎಸ್ಕ್ರೋ ಪಾವತಿಗಳು', ml: 'എസ്ക്രോ പേഔട്ടുകൾ',
    bn: 'এসক্রো পেআউট', mr: 'एस्क्रो पेआउट्स', gu: 'એસ્ક્રો ચૂકવણીઓ', es: 'Pagos de Custodia', fr: 'Paiements séquestre', de: 'Treuhand-Auszahlungen',
    ar: 'دفعات الضمان', ja: 'エスクロー出金', zh: '托管结算打款', ru: 'Выплаты из эскроу'
  },
  taxAndInvoices: {
    en: 'Tax & Invoices', ta: 'வரி & ரசீதுகள்', hi: 'टैक्स और इनवॉइस', te: 'పన్ను & ఇన్‌వాయిస్‌లు', kn: 'ತೆರಿಗೆ ಮತ್ತು ಇನ್‌ವಾಯ್ಸ್‌ಗಳು', ml: 'നികുതിയും ഇൻവോയ്സുകളും',
    bn: 'ট্যাক্স ও ইনভয়েস', mr: 'कर आणि इनव्हॉइस', gu: 'ટેક્સ અને ઇનવોઇસ', es: 'Impuestos y Facturas', fr: 'Taxes & Factures', de: 'Steuern & Rechnungen',
    ar: 'الضرائب والفواتير', ja: '税務＆請求書', zh: '税务与发票', ru: 'Налоги и счета'
  },
  skillCredentials: {
    en: 'Skill Credentials', ta: 'திறன் சான்றிதழ்கள்', hi: 'कौशल प्रमाण पत्र', te: 'నైపుణ్య ధృవపత్రాలు', kn: 'ಕೌಶಲ್ಯ ಪ್ರಮಾಣಪತ್ರಗಳು', ml: 'നൈപുണ്യ സർട്ടിഫിക്കറ്റുകൾ',
    bn: 'দক্ষতা শংসাপত্র', mr: 'कौशल्य प्रमाणपत्रे', gu: 'કૌશલ્ય પ્રમાણપત્રો', es: 'Credenciales de Habilidad', fr: 'Certifications de compétences', de: 'Kompetenzzertifikate',
    ar: 'شهادات المهارات', ja: 'スキル認定バッジ', zh: '专业技能证书', ru: 'Сертификаты навыков'
  },
  clientMessages: {
    en: 'Client Messages', ta: 'வாடிக்கையாளர் செய்திகள்', hi: 'क्लाइंट संदेश', te: 'క్లయింట్ సందేశాలు', kn: 'ಕ್ಲೈಂಟ್ ಸಂದೇಶಗಳು', ml: 'ക്ലയന്റ് സന്ദേശങ്ങൾ',
    bn: 'ক্লায়েন্ট মেসেজ', mr: 'क्लायंट संदेश', gu: 'ક્લાયન્ટ સંદેશાઓ', es: 'Mensajes del Cliente', fr: 'Messages des clients', de: 'Kunden-Nachrichten',
    ar: 'رسائل العملاء', ja: 'クライアント連絡', zh: '雇主客户私信', ru: 'Сообщения клиентов'
  },
  communityFeed: {
    en: 'Community Feed', ta: 'சமூகப் பதிவுகள்', hi: 'कम्युनिटी फ़ीड', te: 'కమ్యూనిటీ ఫీడ్', kn: 'ಸಮುದಾಯ ಫೀಡ್', ml: 'കമ്മ്യൂണിറ്റി ഫീഡ്',
    bn: 'কমিউনিটি ফিড', mr: 'समुदाय फीड', gu: 'સમુદાય ફીડ', es: 'Muro de la Comunidad', fr: 'Fil de la communauté', de: 'Community-Feed',
    ar: 'خلاصة المجتمع', ja: 'コミュニティタイムライン', zh: '社区动态广场', ru: 'Лента сообщества'
  },
  workspaceAndJobs: {
    en: 'WORKSPACE & JOBS', ta: 'பணியிடம் & வேலைகள்', hi: 'कार्यक्षेत्र और नौकरियां', te: 'వర్క్‌స్పేస్ & ఉద్యోగాలు', kn: 'ಕೆಲಸದ ಸ್ಥಳ ಮತ್ತು ಉದ್ಯೋಗಗಳು', ml: 'വർക്ക്‌സ്‌പേസും ജോലികളും',
    bn: 'ওয়ার্কস্পেস ও কাজ', mr: 'कार्यक्षेत्र आणि नोकऱ्या', gu: 'કાર્યક્ષેત્ર અને નોકરીઓ', es: 'ESPACIO DE TRABAJO Y EMPLEOS', fr: 'ESPACE DE TRAVAIL & EMPLOIS', de: 'ARBEITSBEREICH & AUFTRÄGE',
    ar: 'مساحة العمل والوظائف', ja: 'ワークスペース＆案件', zh: '工作台与任务', ru: 'РАБОЧЕЕ ПРОСТРАНСТВО'
  },
  financeAndMilestones: {
    en: 'FINANCE & MILESTONES', ta: 'நிதி & மைல்கற்கள்', hi: 'वित्त और माइलस्टोन्स', te: 'ఫైనాన్స్ & మైలురాళ్లు', kn: 'ಹಣಕಾಸು ಮತ್ತು ಮೈಲಿಗಲ್ಲುಗಳು', ml: 'ധനകാര്യവും നാഴികക്കല്ലുകളും',
    bn: 'অর্থ ও মাইলফলক', mr: 'वित्त आणि टप्पे', gu: 'નાણાં અને માઇલસ્ટોન્સ', es: 'FINANZAS E HITOS', fr: 'FINANCES & JALONS', de: 'FINANZEN & MEILENSTEINE',
    ar: 'المالية والمراحل', ja: '財務＆マイルストーン', zh: '财务与结算阶段', ru: 'ФИНАНСЫ И ЭТАПЫ'
  },
  collaboration: {
    en: 'COLLABORATION', ta: 'கூட்டுப்பணி', hi: 'सहयोग', te: 'సహకారం', kn: 'ಸಹಯೋಗ', ml: 'സഹകരണം',
    bn: 'সহযোগিতা', mr: 'सहकार्य', gu: 'સહયોગ', es: 'COLABORACIÓN', fr: 'COLLABORATION', de: 'ZUSAMMENARBEIT',
    ar: 'التعاون والتواصل', ja: 'コラボレーション', zh: '协同沟通', ru: 'СОТРУДНИЧЕСТВО'
  },
  agencyWorkspace: {
    en: 'AGENCY WORKSPACE', ta: 'ஏஜென்சி பணியிடம்', hi: 'एजेंसी कार्यक्षेत्र', te: 'ఏజెన్సీ వర్క్‌స్పేస్', kn: 'ಏಜೆನ್ಸಿ ಕಾರ್ಯಕ್ಷೇತ್ರ', ml: 'ഏജൻസി വർക്ക്‌സ്‌പേസ്',
    bn: 'এজেন্সি ওয়ার্কস্পেস', mr: 'एजन्सी कार्यक्षेत्र', gu: 'એજન્સી કાર્યક્ષેત્ર', es: 'ESPACIO DE AGENCIA', fr: 'ESPACE AGENCE', de: 'AGENTUR-BEREICH',
    ar: 'مساحة عمل الوكالة', ja: 'エージェンシー業務スペース', zh: '机构协同工作空间', ru: 'ПРОСТРАНСТВО АГЕНТСТВА'
  },
  financeAndBilling: {
    en: 'FINANCE & BILLING', ta: 'நிதி & பில்லிங்', hi: 'वित्त और बिलिंग', te: 'ఫైనాన్స్ & బిల్లింగ్', kn: 'ಹಣಕಾಸು ಮತ್ತು ಬಿಲ್ಲಿಂಗ್', ml: 'ധനകാര്യവും ബില്ലിംഗും',
    bn: 'অর্থ ও বিলিং', mr: 'वित्त आणि बिलिंग', gu: 'નાણાં અને બિલિંગ', es: 'FINANZAS Y FACTURACIÓN', fr: 'FINANCES & FACTURATION', de: 'FINANZEN & ABRECHNUNG',
    ar: 'المالية والفواتير', ja: '財務＆請求管理', zh: '财务与开票结算', ru: 'ФИНАНСЫ И БИЛЛИНГ'
  },
  teamProjects: {
    en: 'Team Projects', ta: 'குழு திட்டங்கள்', hi: 'टीम प्रोजेक्ट्स', te: 'టీమ్ ప్రాజెక్ట్‌లు', kn: 'ತಂಡದ ಯೋಜನೆಗಳು', ml: 'ടീം പ്രോജക്ടുകൾ',
    bn: 'টিম প্রজেক্ট', mr: 'संघ प्रकल्प', gu: 'ટીમ પ્રોજેક્ટ્સ', es: 'Proyectos de Equipo', fr: 'Projets d’équipe', de: 'Team-Projekte',
    ar: 'مشاريع الفريق', ja: 'チームプロジェクト', zh: '团队协同项目', ru: 'Проекты команды'
  },
  enterpriseContracts: {
    en: 'Enterprise Contracts', ta: 'கார்ப்பரேட் ஒப்பந்தங்கள்', hi: 'एंटरप्राइज अनुबंध', te: 'ఎంటర్‌ప్రైజ్ ఒప్పందాలు', kn: 'ಎಂಟರ್‌ಪ್ರೈಸ್ ಒಪ್ಪಂದಗಳು', ml: 'എന്റർപ്രൈസ് കരാറുകൾ',
    bn: 'এন্টারপ্রাইজ চুক্তি', mr: 'एंटरप्राइझ करार', gu: 'એન્ટરપ્રાઇઝ કરારો', es: 'Contratos Empresariales', fr: 'Contrats entreprise', de: 'Unternehmensverträge',
    ar: 'عقود المؤسسات والشركات', ja: 'エンタープライズ契約', zh: '企业级合作合同', ru: 'Корпоративные контракты'
  },
  teamTimesheets: {
    en: 'Team Timesheets', ta: 'குழு நேர அட்டவணைகள்', hi: 'टीम टाइमशीट', te: 'టీమ్ టైమ్‌షీట్‌లు', kn: 'ತಂಡದ ಟೈಮ್‌ಶೀಟ್‌ಗಳು', ml: 'ടീം ടൈംഷീറ്റുകൾ',
    bn: 'টিম টাইমশীট', mr: 'संघ टाइमशीट', gu: 'ટીમ ટાઇમશીટ્સ', es: 'Hojas de Horas de Equipo', fr: 'Feuilles de temps d’équipe', de: 'Team-Stundenzettel',
    ar: 'جداول عمل الفريق', ja: 'チーム工数記録', zh: '团队工时汇总', ru: 'Табели команды'
  },
  escrowSettlements: {
    en: 'Escrow Settlements', ta: 'எஸ்க்ரோ தீர்வுகள்', hi: 'एस्क्रो निपटान', te: 'ఎస్క్రో పరిష్కారాలు', kn: 'ಎಸ್ಕ್ರೋ ಇತ್ಯರ್ಥಗಳು', ml: 'എസ്ക്രോ സെറ്റിൽമെന്റുകൾ',
    bn: 'এসক্রো নিষ্পত্তি', mr: 'एस्क्रो सेटलमेंट्स', gu: 'એસ્ક્રો પતાવટ', es: 'Liquidaciones de Custodia', fr: 'Règlements du séquestre', de: 'Treuhand-Abrechnungen',
    ar: 'تسويات الضمان المالي', ja: 'エスクロー決済・精算', zh: '托管资金清算结算', ru: 'Расчеты по эскроу'
  },
  escrowAndTreasury: {
    en: 'ESCROW & TREASURY', ta: 'எஸ்க்ரோ & கருவூலம்', hi: 'एस्क्रो और ट्रेजरी', te: 'ఎస్క్రో & ట్రెజరీ', kn: 'ಎಸ್ಕ್ರೋ ಮತ್ತು ಖಜಾನೆ', ml: 'എസ്ക്രോയും ട്രഷറിയും',
    bn: 'এসক্রো ও ট্রেজারি', mr: 'एस्क्रो आणि तिजोरी', gu: 'એસ્ક્રો અને ટ્રેઝરી', es: 'CUSTODIA Y TESORERÍA', fr: 'SÉQUESTRE & TRÉSORERIE', de: 'TREUHAND & SCHATZKAMMER',
    ar: 'الضمان المالي والخزينة', ja: 'エスクロー＆トレジャリー', zh: '托管结算与资金国库', ru: 'ЭСКРОУ И КАЗНАЧЕЙСТВО'
  },
  treasuryDashboard: {
    en: 'Treasury Dashboard', ta: 'கருவூல டாஷ்போர்டு', hi: 'ट्रेजरी डैशबोर्ड', te: 'ట్రెజరీ డాష్‌బోర్డ్', kn: 'ಖಜಾನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', ml: 'ട്രഷറി ഡാഷ്‌ബോർഡ്',
    bn: 'ট্রেজারি ড্যাশবোর্ড', mr: 'तिजोरी डॅशबोर्ड', gu: 'ટ્રેઝરી ડેશબોર્ડ', es: 'Panel de Tesorería', fr: 'Tableau de bord de trésorerie', de: 'Treasury-Dashboard',
    ar: 'لوحة الخزينة المالية', ja: 'トレジャリーダッシュボード', zh: '资金国库总控面板', ru: 'Панель казначейства'
  },
  escrowVaults: {
    en: 'Escrow Vaults', ta: 'எஸ்க்ரோ பெட்டகங்கள்', hi: 'एस्क्रो वॉल्ट्स', te: 'ఎస్క్రో వాల్ట్‌లు', kn: 'ಎಸ್ಕ್ರೋ ವಾಲ್ಟ್‌ಗಳು', ml: 'എസ്ക്രോ വോൾട്ടുകൾ',
    bn: 'এসক্রো ভল্ট', mr: 'एस्क्रो वॉल्ट्स', gu: 'એસ્ક્રો વૉલ્ટ્સ', es: 'Bóvedas de Custodia', fr: 'Coffres-forts de séquestre', de: 'Treuhand-Tresore',
    ar: 'خزائن الضمان المالي', ja: 'エスクロー金庫', zh: '智能托管资金金库', ru: 'Хранилища эскроу'
  },
  disbursements: {
    en: 'Disbursements', ta: 'பணம் வழங்கல்கள்', hi: 'संवितरण', te: 'పంపిణీలు', kn: 'ವಿತರಣೆಗಳು', ml: 'വിതരണങ്ങൾ',
    bn: 'বিতরণ', mr: 'वितरण', gu: 'વિતરણ', es: 'Desembolsos', fr: 'Décaissements', de: 'Auszahlungen',
    ar: 'صرف المدفوعات', ja: '資金支払い・送金', zh: '资金划拨打款', ru: 'Выплаты'
  },
  taxLedger: {
    en: 'Tax Ledger', ta: 'வரி கணக்கு ஏடு', hi: 'टैक्स लेजर', te: 'పన్ను లెడ్జర్', kn: 'ತೆರಿಗೆ ಲೆಡ್ಜರ್', ml: 'നികുതി ലെഡ്ജർ',
    bn: 'ট্যাক্স লেজার', mr: 'कर लेझर', gu: 'ટેક્સ લેજર', es: 'Libro de Impuestos', fr: 'Grand livre fiscal', de: 'Steuerbuch',
    ar: 'دفتر الضرائب المالي', ja: '税務元帳', zh: '税务结算账本', ru: 'Налоговый реестр'
  },
  arbitrationAndStats: {
    en: 'ARBITRATION & STATS', ta: 'மத்தியஸ்தம் & புள்ளிவிவரங்கள்', hi: 'मध्यस्थता और सांख्यिकी', te: 'ఆర్బిట్రేషన్ & గణాంకాలు', kn: 'ಮಧ್ಯಸ್ಥಿಕೆ ಮತ್ತು ಅಂಕಿಅಂಶಗಳು', ml: 'മധ്യസ്ഥതയും സ്ഥിതിവിവരക്കണക്കുകളും',
    bn: 'সালিশ ও পরিসংখ্যান', mr: 'लवाद आणि आकडेवारी', gu: 'મધ્યસ્થી અને આંકડા', es: 'ARBITRAJE Y ESTADÍSTICAS', fr: 'ARBITRAGE & STATISTIQUES', de: 'SCHLICHTUNG & STATISTIKEN',
    ar: 'التحكيم والإحصاءات', ja: '紛争仲裁＆統計データ', zh: '争议仲裁与数据统计', ru: 'АРБИТРАЖ И СТАТИСТИКА'
  },
  disputeArbitration: {
    en: 'Escrow Arbitration', ta: 'எஸ்க்ரோ மத்தியஸ்தம்', hi: 'एस्क्रो मध्यस्थता', te: 'ఎస్క్రో ఆర్బిట్రేషన్', kn: 'ಎಸ್ಕ್ರೋ ಮಧ್ಯಸ್ಥಿಕೆ', ml: 'എസ്ക്രോ മധ്യസ്ഥത',
    bn: 'এসক্রো সালিশ', mr: 'एस्क्रो लवाद', gu: 'એસ્ક્રો મધ્યસ્થી', es: 'Arbitraje de Custodia', fr: 'Arbitrage de séquestre', de: 'Treuhand-Schlichtung',
    ar: 'التحكيم في أموال الضمان', ja: 'エスクロー紛争仲裁', zh: '托管资金争议仲裁', ru: 'Арбитраж эскроу'
  },
  platformReserves: {
    en: 'Platform Reserves', ta: 'தள இருப்பு நிதி', hi: 'प्लेटफ़ॉर्म रिज़र्व', te: 'ప్లాట్‌ఫారమ్ నిల్వలు', kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಮೀಸಲು', ml: 'പ്ലാറ്റ്ഫോം കരുതൽ ശേഖരം',
    bn: 'প্ল্যাটফর্ম রিজার্ভ', mr: 'प्लॅटफॉर्म राखीव निधी', gu: 'પ્લેટફોર્મ અનામત', es: 'Reservas de Plataforma', fr: 'Réserves de la plateforme', de: 'Plattform-Reserven',
    ar: 'احتياطيات المنصة', ja: 'プラットフォーム準備金', zh: '平台风险准备金', ru: 'Резервы платформы'
  },
  executiveCockpit: {
    en: 'Executive Cockpit', ta: 'நிர்வாக கட்டுப்பாட்டகம்', hi: 'एग्जीक्यूटिव कॉकपिट', te: 'ఎగ్జిక్యూటివ్ కాక్‌పిట్', kn: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಕಾಕ್‌ಪಿಟ್', ml: 'എക്സിക്യൂട്ടീവ് കോക്ക്പിറ്റ്',
    bn: 'এক্সিকিউটিভ ককপিট', mr: 'कार्यकारी कॉकपिट', gu: 'એક્ઝિક્યુટિવ કોકપિટ', es: 'Cabina Ejecutiva', fr: 'Poste de commandement', de: 'Vorstands-Cockpit',
    ar: 'لوحة القيادة التنفيذية', ja: 'エグゼクティブコックピット', zh: '高管总控驾驶舱', ru: 'Панель руководителя'
  },
  agencyNetwork: {
    en: 'Agency Network', ta: 'ஏஜென்சி வலைப்பின்னல்', hi: 'एजेंसी नेटवर्क', te: 'ఏజెన్సీ నెట్‌వర్క్', kn: 'ಏಜೆನ್ಸಿ ನೆಟ್‌ವರ್ಕ್', ml: 'ಏജൻസി നെറ്റ്‌വർക്ക്',
    bn: 'এজেন্সি নেটওয়ার্ক', mr: 'एजन्सी नेटवर्क', gu: 'એજન્સી નેટવર્ક', es: 'Red de Agencias', fr: 'Réseau d’agences', de: 'Agentur-Netzwerk',
    ar: 'شبكة الوكالات المعتمدة', ja: 'エージェンシーネットワーク', zh: '认证机构服务网络', ru: 'Сеть агентств'
  },
  auditAndCompliance: {
    en: 'AUDIT & COMPLIANCE', ta: 'தணிக்கை & இணக்கம்', hi: 'ऑडिट और अनुपालन', te: 'ఆడిట్ & సమ్మతి', kn: 'ಆಡಿಟ್ ಮತ್ತು ಅನುಸರಣೆ', ml: 'ഓഡിറ്റും പാലിക്കലും',
    bn: 'অডিট ও সম্মতি', mr: 'ऑडिट आणि अनुपालन', gu: 'ઓડિટ અને અનુપાલન', es: 'AUDITORÍA Y CUMPLIMIENTO', fr: 'AUDIT & CONFORMITÉ', de: 'AUDIT & COMPLIANCE',
    ar: 'التدقيق والامتثال', ja: '監査＆コンプライアンス', zh: '审计监管与合规', ru: 'АУДИТ И СООТВЕТСТВИЕ'
  },
  contractAudits: {
    en: 'Contract Audits', ta: 'ஒப்பந்த தணிக்கைகள்', hi: 'अनुबंध ऑडिट', te: 'కాంట్రాక్ట్ ఆడిట్లు', kn: 'ಒಪ್ಪಂದದ ಆಡಿಟ್‌ಗಳು', ml: 'കരാർ ഓഡിറ്റുകൾ',
    bn: 'চুক্তি অডিট', mr: 'करार ऑडिट', gu: 'કરાર ઓડિટ', es: 'Auditorías de Contratos', fr: 'Audits de contrats', de: 'Vertragsprüfungen',
    ar: 'تدقيق العقود الرقمية', ja: 'スマートコントラクト監査', zh: '电子合约合规审计', ru: 'Аудит контрактов'
  },
  globalSettlements: {
    en: 'Global Settlements', ta: 'உலகளாவிய தீர்வுகள்', hi: 'ग्लोबल सेटलमेंट्स', te: 'గ్లోబల్ సెటిల్‌మెంట్లు', kn: 'ಜಾಗತಿಕ ಇತ್ಯರ್ಥಗಳು', ml: 'ആഗോള സെറ്റിൽമെന്റുകൾ',
    bn: 'গ্লোবাল সেটেলমেন্ট', mr: 'ग्लोबल सेटलमेंट्स', gu: 'વૈશ્વિક પતાવટ', es: 'Liquidaciones Globales', fr: 'Règlements mondiaux', de: 'Globale Abrechnungen',
    ar: 'التسويات المالية العالمية', ja: 'グローバル清算', zh: '全球跨境外汇结算', ru: 'Международные расчеты'
  },
  ecosystemAnalytics: {
    en: 'Ecosystem Analytics', ta: 'சுற்றுச்சூழல் பகுப்பாய்வு', hi: 'इकोसिस्टम एनालिटिक्स', te: 'పర్యావరణ వ్యవస్థ విశ్లేషణ', kn: 'ಪರಿಸರ ವ್ಯವಸ್ಥೆ ವಿಶ್ಲೇಷಣೆ', ml: 'ആവാസവ്യവസ്ഥ വിശകലനം',
    bn: 'ইকোসিস্টেম বিশ্লেষণ', mr: 'इकोसिस्टम विश्लेषण', gu: 'ઇકોસિસ્ટમ એનાલિટિક્સ', es: 'Análisis del Ecosistema', fr: 'Analytique de l’écosystème', de: 'Ökosystem-Analysen',
    ar: 'تحليلات النظام البيئي', ja: 'エコシステム全体分析', zh: '全生态综合数据分析', ru: 'Аналитика экосистемы'
  },
  directMessages: {
    en: 'Direct Messages', ta: 'நேரடி செய்திகள்', hi: 'डायरेक्ट संदेश', te: 'ప్రత్యక్ష సందేశాలు', kn: 'ನೇರ ಸಂದೇಶಗಳು', ml: 'നേരിട്ടുള്ള സന്ദേശങ്ങൾ',
    bn: 'সরাসরি বার্তা', mr: 'थेट संदेश', gu: 'સીધા સંદેશાઓ', es: 'Mensajes Directos', fr: 'Messages directs', de: 'Direktnachrichten',
    ar: 'الرسائل المباشرة', ja: 'ダイレクトメッセージ', zh: '直接私信', ru: 'Личные сообщения'
  },
  communityHub: {
    en: 'Community Hub', ta: 'சமூக மையம்', hi: 'कम्युनिटी हब', te: 'కమ్యూనిటీ హబ్', kn: 'ಸಮುದಾಯ ಕೇಂದ್ರ', ml: 'കമ്മ്യൂണിറ്റി ഹബ്',
    bn: 'কমিউনিটি হাব', mr: 'समुदाय केंद्र', gu: 'સમુદાય હબ', es: 'Centro Comunitario', fr: 'Pôle communautaire', de: 'Community-Hub',
    ar: 'مركز المجتمع', ja: 'コミュニティハブ', zh: '开发者社区中心', ru: 'Центр сообщества'
  },
  // Dashboard Specific Titles & Dynamic Greetings
  goodMorning: {
    en: 'Good morning', ta: 'காலை வணக்கம்', hi: 'शुभ प्रभात', te: 'శుభోదయం', kn: 'ಶುಭೋದಯ', ml: 'സുപ്രഭാതം',
    bn: 'সুপ্রভাত', mr: 'शुभ प्रभात', gu: 'શુભ સવાર', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen',
    ar: 'صباح الخير', ja: 'おはようございます', zh: '早上好', ru: 'Доброе утро'
  },
  goodAfternoon: {
    en: 'Good afternoon', ta: 'மதிய வணக்கம்', hi: 'शुभ दोपहर', te: 'శుభ మధ్యాహ్నం', kn: 'ಶುಭ ಮಧ್ಯಾಹ್ನ', ml: 'ശുഭ ഉച്ചതിരിഞ്ഞ്',
    bn: 'শুভ অপরাহ্ন', mr: 'शुभ दुपार', gu: 'શુભ બપોર', es: 'Buenas tardes', fr: 'Bon après-midi', de: 'Guten Tag',
    ar: 'مساء الخير', ja: 'こんにちは', zh: '下午好', ru: 'Добрый день'
  },
  goodEvening: {
    en: 'Good evening', ta: 'மாலை வணக்கம்', hi: 'शुभ संध्या', te: 'శుభ సాయంత్రம்', kn: 'ಶುಭ ಸಂಜೆ', ml: 'ശുഭ സായാഹ്നം',
    bn: 'শুভ সন্ধ্যা', mr: 'शुभ संध्याकाळ', gu: 'શુભ સાંજ', es: 'Buenas noches', fr: 'Bonsoir', de: 'Guten Abend',
    ar: 'مساء الخير', ja: 'こんばんは', zh: '晚上好', ru: 'Добрый вечер'
  },
  managedContracts: {
    en: 'MANAGED CONTRACTS', ta: 'நிர்வகிக்கப்பட்ட ஒப்பந்தங்கள்', hi: 'प्रबंधित अनुबंध', te: 'నిర్వహించబడే ఒప్పందాలు', kn: 'ನಿರ್ವಹಿಸಿದ ಒಪ್ಪಂದಗಳು', ml: 'കൈകാര്യം ചെയ്ത കരാറുകൾ',
    bn: 'পরিচালিত চুক্তি', mr: 'व्यवस्थापित करार', gu: 'સંચાલિત કરારો', es: 'CONTRATOS GESTIONADOS', fr: 'CONTRATS GÉRÉS', de: 'VERWALTETE VERTRÄGE',
    ar: 'العقود المدارة', ja: '管理契約数', zh: '已签约合约', ru: 'УПРАВЛЯЕМЫЕ ДОГОВОРЫ'
  },
  inProgressSprints: {
    en: 'IN-PROGRESS SPRINTS', ta: 'செயலில் உள்ள ஸ்பிரிண்ட்கள்', hi: 'प्रगति पर स्प्रिंट्स', te: 'పురోగతిలో ఉన్న స్ప్రింట్లు', kn: 'ಪ್ರಗತಿಯಲ್ಲಿರುವ ಸ್ಪ್ರಿಂಟ್‌ಗಳು', ml: 'പുരോഗതിയിലുള്ള സ്പ്രിന്റുകൾ',
    bn: 'চলমান স্প্রিন্ট', mr: 'प्रगतीपथावरील स्प्रिंट्स', gu: 'ચાલુ સ્પ્રિન્ટ્સ', es: 'SPRINTS EN CURSO', fr: 'SPRINTS EN COURS', de: 'LAUFENDE SPRINTS',
    ar: 'مراحل قيد التنفيذ', ja: '進行中スプリント', zh: '执行中冲刺', ru: 'АКТИВНЫЕ СПРИНТЫ'
  },
  securedInSmartEscrow: {
    en: 'SECURED IN SMART ESCROW', ta: 'ஸ்மார்ட் எஸ்க்ரோவில் பாதுகாக்கப்பட்டது', hi: 'स्मार्ट एस्क्रो में सुरक्षित', te: 'స్మార్ట్ ఎస్క్రోలో సురక్షితం', kn: 'ಸ್ಮಾರ್ಟ್ ಎಸ್ಕ್ರೋದಲ್ಲಿ ಸುರಕ್ಷಿತ', ml: 'സ്മാർട്ട് എസ്ക്രോയിൽ സുരക്ഷിതം',
    bn: 'স্মার্ট এসক্রোতে সুরক্ষিত', mr: 'स्मार्ट एस्क्रोमध्ये सुरक्षित', gu: 'સ્માર્ટ એસ્ક્રોમાં સુરક્ષિત', es: 'PROTEGIDO EN CUSTODIA', fr: 'SÉCURISÉ EN SÉQUESTRE', de: 'IN SMART TREUHAND GESICHERT',
    ar: 'مضمون في الضمان الذكي', ja: 'スマートエスクロー担保額', zh: '智能托管资金总额', ru: 'ЗАЩИЩЕНО В ЭСКРОУ'
  },
  trustScoreAndKyc: {
    en: 'TRUST SCORE & KYC', ta: 'நம்பகத்தன்மை & KYC', hi: 'ट्रस्ट स्कोर और केवाईसी', te: 'ట్రస్ట్ స్కోర్ & KYC', kn: 'ವಿಶ್ವಾಸಾರ್ಹತೆ & KYC', ml: 'ട്രസ്റ്റ് സ്കോറും കെ‌വൈ‌സിയും',
    bn: 'ট্রাস্ট স্কোর ও কেওয়াইসি', mr: 'विश्वास स्कोअर आणि केवायसी', gu: 'ટ્રસ્ટ સ્કોર અને કેવાયસી', es: 'PUNTUACIÓN DE CONFIANZA Y KYC', fr: 'SCORE DE CONFIANCE & KYC', de: 'VERTRAUENSWERT & KYC',
    ar: 'مؤشر الثقة والتحقق', ja: '信頼スコア＆KYC', zh: '信誉评分与KYC认证', ru: 'РЕЙТИНГ ДОВЕРИЯ И KYC'
  },
  financialVelocityAndEscrowGrowth: {
    en: 'Financial Velocity & Escrow Growth', ta: 'நிதி வேகம் மற்றும் எஸ்க்ரோ வளர்ச்சி', hi: 'वित्तीय गति और एस्क्रो विकास', te: 'ఆర్థిక వేగం & ఎస్క్రో వృద్ధి', kn: 'ಹಣಕಾಸು ವೇಗ ಮತ್ತು ಎಸ್ಕ್ರೋ ಬೆಳವಣಿಗೆ', ml: 'ധനകാര്യ വേഗതയും എസ്ക്രോ വളർച്ചയും',
    bn: 'আর্থিক গতি এবং এসক্রো বৃদ্ধি', mr: 'वित्तीय गती आणि एस्क्रो वाढ', gu: 'નાણાકીય ગતિ અને એસ્ક્રો વૃદ્ધિ', es: 'Velocidad Financiera y Crecimiento de Custodia', fr: 'Vélocité financière & Croissance du séquestre', de: 'Finanzdynamik & Treuhand-Wachstum',
    ar: 'السرعة المالية ونمو الضمان', ja: '財務成長スピード＆エスクロー推移', zh: '资金流转速度与托管增长曲线', ru: 'Финансовая динамика и рост эскроу'
  },
  trackGuaranteedEscrow: {
    en: 'Track guaranteed escrow growth and milestone settlement velocity', ta: 'உத்தரவாதமளிக்கப்பட்ட எஸ்க்ரோ வளர்ச்சி மற்றும் மைல்கல் தீர்வு வேகத்தைக் கண்காணிக்கவும்', hi: 'गारंटीकृत एस्क्रो वृद्धि और माइलस्टोन निपटान गति ट्रैक करें', te: 'హామీ ఇవ్వబడిన ఎస్క్రో వృద్ధి మరియు మైలురాయి పరిష్కార వేగాన్ని ట్రాక్ చేయండి', kn: 'ಖಾತರಿಯ ಎಸ್ಕ್ರೋ ಬೆಳವಣಿಗೆ ಮತ್ತು ಮೈಲಿಗಲ್ಲು ಇತ್ಯರ್ಥ ವೇಗವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', ml: 'ഗ്യാരണ്ടീഡ് എസ്ക്രോ വളർച്ചയും സെറ്റിൽമെന്റ് വേഗതയും ട്രാക്ക് ചെയ്യുക',
    bn: 'গ্যারান্টিযুক্ত এসক্রো বৃদ্ধি এবং মাইলফলক নিষ্পত্তি ট্র্যাক করুন', mr: 'हमी दिलेली एस्क्रो वाढ आणि टप्पा पूर्तता गती ट्रॅक करा', gu: 'ગેરંટીવાળી એસ્ક્રો વૃદ્ધિ અને માઇલસ્ટોન પતાવટ ગતિ ટ્રેક કરો', es: 'Rastree el crecimiento garantizado de custodia y la velocidad de liquidación de hitos', fr: 'Suivez la croissance garantie du séquestre et la vitesse de règlement des jalons', de: 'Verfolgen Sie garantiertes Treuhand-Wachstum und Meilenstein-Abrechnungsgeschwindigkeit',
    ar: 'تتبع نمو أموال الضمان وسرعة تسوية المراحل التعاقدية', ja: '保証されたエスクロー資産の成長とマイルストーン決済速度を追跡', zh: '实时追踪智能托管资金增长曲线与各阶段结算履约效率', ru: 'Отслеживайте гарантированный рост эскроу и скорость закрытия этапов'
  },
  escrowVaultSecurity: {
    en: 'Escrow Vault Security', ta: 'எஸ்க்ரோ வால்ட் பாதுகாப்பு', hi: 'एस्क्रो वॉल्ट सुरक्षा', te: 'ఎస్క్రో వాల్ట్ భద్రత', kn: 'ಎಸ್ಕ್ರೋ ವಾಲ್ಟ್ ಭದ್ರತೆ', ml: 'എസ്ക്രോ വോൾട്ട് സുരക്ഷ',
    bn: 'এসক্রো ভল্ট নিরাপত্তা', mr: 'एस्क्रो वॉल्ट सुरक्षा', gu: 'એસ્ક્રો વૉલ્ટ સુરક્ષા', es: 'Seguridad de la Bóveda de Custodia', fr: 'Sécurité du coffre-fort de séquestre', de: 'Treuhand-Tresorsicherheit',
    ar: 'أمان خزينة الضمان', ja: 'エスクロー保管庫セキュリティ', zh: '托管资金金库安全保障', ru: 'Безопасность хранилища эскроу'
  },
  distributionOfProtectedCollateral: {
    en: 'Distribution of protected collateral funds', ta: 'பாதுகாக்கப்பட்ட பிணைய நிதிகளின் விநியோகம்', hi: 'संरक्षित संपार्श्विक फंड का वितरण', te: 'రక్షిత అనుషంగిక నిధుల పంపిణీ', kn: 'ರಕ್ಷಿತ ಮೇಲಾಧಾರ ನಿಧಿಗಳ ವಿತರಣೆ', ml: 'പരിരക്ഷിത കൊളാറ്ററൽ ഫണ്ടുകളുടെ വിതരണം',
    bn: 'সুরক্ষিত জামানত তহবিলের বণ্টন', mr: 'संरक्षित तारण निधीचे वितरण', gu: 'સુરક્ષિત કોલેટરલ ફંડ્સનું વિતરણ', es: 'Distribución de fondos colaterales protegidos', fr: 'Répartition des fonds de garantie protégés', de: 'Verteilung der geschützten Sicherheitenfonds',
    ar: 'توزيع أموال الضمانات المحمية', ja: '保護担保資金の配分状況', zh: '智能托管风险抵押金分布占比', ru: 'Распределение защищенных залоговых средств'
  },
  fundEscrow: {
    en: 'Fund Escrow', ta: 'எஸ்க்ரோவில் நிதி சேர்', hi: 'एस्क्रो में फंड डालें', te: 'ఎస్క్రోలో నిధులు జోడించండి', kn: 'ಎಸ್ಕ್ರೋಗೆ ಹಣ ಜಮೆ ಮಾಡಿ', ml: 'എസ്ക്രോയിൽ ഫണ്ട് ചേർക്കുക',
    bn: 'এসক্রোতে ফান্ড জমা দিন', mr: 'एस्क्रोमध्ये निधी जमा करा', gu: 'એસ્ક્રોમાં ફંડ ઉમેરો', es: 'Depositar en Custodia', fr: 'Approvisionner le séquestre', de: 'Treuhand auffüllen',
    ar: 'تمويل الضمان', ja: 'エスクローに入金', zh: '注资托管资金', ru: 'Пополнить эскроу'
  },
  exploreProjects: {
    en: 'Explore Projects', ta: 'திட்டங்களை ஆராயுங்கள்', hi: 'प्रोजेक्ट्स देखें', te: 'ప్రాజెక్ట్‌లను అన్వేషించండి', kn: 'ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', ml: 'പ്രോജക്റ്റുകൾ പര്യവേക്ഷണം ചെയ്യുക',
    bn: 'প্রজেক্ট দেখুন', mr: 'प्रकल्प एक्सप्लोर करा', gu: 'પ્રોજેક્ટ્સ અન્વેષણ કરો', es: 'Explorar Proyectos', fr: 'Explorer les projets', de: 'Projekte erkunden',
    ar: 'استكشاف المشاريع', ja: '案件を探す', zh: '探索所有项目', ru: 'Смотреть проекты'
  },
  newSubmissions: {
    en: '+2 New Submissions', ta: '+2 புதிய சமர்ப்பிப்புகள்', hi: '+2 नए सबमिशन', te: '+2 కొత్త సమర్పణలు', kn: '+2 ಹೊಸ ಸಲ್ಲಿಕೆಗಳು', ml: '+2 புதிய സമർപ്പണങ്ങൾ',
    bn: '+2 নতুন জমা', mr: '+2 नवीन सबमिशन', gu: '+2 નવી સબમિશન', es: '+2 Nuevas Entregas', fr: '+2 Nouvelles soumissions', de: '+2 Neue Einreichungen',
    ar: '+2 تسليمات جديدة', ja: '+2件の新規提出', zh: '+2 份新提交', ru: '+2 новые заявки'
  },
  allVerified: {
    en: 'All Verified', ta: 'அனைத்தும் சரிபார்க்கப்பட்டது', hi: 'सभी सत्यापित', te: 'అన్నీ ధృవీకరించబడ్డాయి', kn: 'ಎಲ್ಲವೂ ಪರಿಶೀಲಿಸಲಾಗಿದೆ', ml: 'എല്ലാം സ്ഥിരീകരിച്ചു',
    bn: 'সব যাচাইকৃত', mr: 'सर्व सत्यापित', gu: 'બધા ચકાસાયેલ', es: 'Todo Verificado', fr: 'Tous vérifiés', de: 'Alle verifiziert',
    ar: 'تم التحقق من الكل', ja: 'すべて認証済み', zh: '全部已认证', ru: 'Все проверено'
  },
  milestoneActive: {
    en: 'Milestone Active', ta: 'செயலில் உள்ள மைல்கல்', hi: 'सक्रिय माइलस्टोन', te: 'మైలురాయి యాక్టివ్‌గా ఉంది', kn: 'ಮೈಲಿಗಲ್ಲು ಸಕ್ರಿಯವಾಗಿದೆ', ml: 'നാഴികക്കല്ല് സജീവമാണ്',
    bn: 'মাইলফলক সক্রিয়', mr: 'सक्रिय टप्पा', gu: 'માઇલસ્ટોન સક્રિય છે', es: 'Hito Activo', fr: 'Jalon actif', de: 'Meilenstein aktiv',
    ar: 'المرحلة نشطة', ja: 'マイルストーン進行中', zh: '阶段进行中', ru: 'Этап активен'
  },
  dueInDays: {
    en: 'Due in 16 Days', ta: '16 நாட்களில் முடிவடைகிறது', hi: '16 दिनों में देय', te: '16 రోజుల్లో గడువు', kn: '16 ದಿನಗಳಲ್ಲಿ ಮುಕ್ತಾಯ', ml: '16 ദിവസത്തിനുള്ളിൽ അവസാനിക്കുന്നു',
    bn: '১৬ দিনে বকেয়া', mr: '16 दिवसांत मुदत', gu: '16 દિવસમાં બાકી', es: 'Vence en 16 Días', fr: 'Échéance dans 16 jours', de: 'Fällig in 16 Tagen',
    ar: 'يستحق خلال 16 يوماً', ja: '残り16日で完了予定', zh: '16 天后到期结算', ru: 'Срок через 16 дней'
  },
  guaranteed100: {
    en: '100% Guaranteed', ta: '100% உத்தரவாதம்', hi: '100% गारंटीकृत', te: '100% హామీ', kn: '100% ಖಾತರಿ', ml: '100% ഗ്യാരണ്ടി',
    bn: '100% গ্যারান্টি', mr: '100% हमी', gu: '100% ખાતરીપૂર્વક', es: '100% Garantizado', fr: '100% Garanti', de: '100% Garantiert',
    ar: '100% مضمون بالكامل', ja: '100% 安全保証', zh: '100% 履约担保', ru: '100% Гарантия'
  },
  zeroRisk: {
    en: 'Zero Risk', ta: 'பூஜ்ஜிய ஆபத்து', hi: 'शून्य जोखिम', te: 'సున్నా రిస్క్', kn: 'ಶೂನ್ಯ ಅಪಾಯ', ml: 'പൂജ്യം റിസ്ക്',
    bn: 'জিরো রিস্ক', mr: 'शून्य धोका', gu: 'શૂન્ય જોખમ', es: 'Cero Riesgo', fr: 'Zéro risque', de: 'Null Risiko',
    ar: 'بدون أي مخاطر', ja: 'ノーリスク', zh: '零资金风险', ru: 'Нулевой риск'
  },
  identityVerified: {
    en: 'Identity Verified', ta: 'அடையாளம் சரிபார்க்கப்பட்டது', hi: 'पहचान सत्यापित', te: 'గుర్తింపు ధృవీకరించబడింది', kn: 'ಗುರುತು ಪರಿಶೀಲಿಸಲಾಗಿದೆ', ml: 'തിരിച്ചറിയൽ സ്ഥിരീകരിച്ചു',
    bn: 'পরিচয় যাচাইকৃত', mr: 'ओळख सत्यापित', gu: 'ઓળખ ચકાસાયેલ', es: 'Identidad Verificada', fr: 'Identité vérifiée', de: 'Identität verifiziert',
    ar: 'الهوية موثقة', ja: '本人確認完了', zh: '实名身份已认证', ru: 'Личность подтверждена'
  },
  topRatedVerifiedPro: {
    en: 'Top Rated Verified Pro', ta: 'உயர்தர சரிபார்க்கப்பட்ட நிபுணர்', hi: 'शीर्ष रेटेड सत्यापित विशेषज्ञ', te: 'టాప్ రేటెడ్ ధృవీకరించబడిన ప్రో', kn: 'ಟಾಪ್ ರೇಟೆಡ್ ಪರಿಶೀಲಿಸಿದ ತಜ್ಞ', ml: 'ടോപ്പ് റേറ്റഡ് വെരിഫൈഡ് പ്രോ',
    bn: 'শীর্ষ রেটযুক্ত যাচাইকৃত বিশেষজ্ঞ', mr: 'टॉप रेटेड सत्यापित तज्ञ', gu: 'ટોચનું રેટિંગ ધરાવતા ચકાસાયેલ પ્રો', es: 'Profesional Verificado de Alto Nivel', fr: 'Professionnel vérifié d’élite', de: 'Top-bewerteter verifizierter Experte',
    ar: 'محترف معتمد عالي التقييم', ja: '最高評価・認証済みプロフェッショナル', zh: '官方认证顶级专家', ru: 'Сертифицированный специалист высшего уровня'
  },
  mainnetEscrowSecurity: {
    en: 'Mainnet Escrow Smart Contracts • 100% Cryptographic Security',
    ta: 'மெயின்நெட் எஸ்க்ரோ ஸ்மார்ட் ஒப்பந்தங்கள் • 100% கிரிப்டோகிராஃபிக் பாதுகாப்பு',
    hi: 'मेननेट एस्क्रो स्मार्ट अनुबंध • 100% क्रिप्टोग्राफिक सुरक्षा',
    te: 'మెయిన్‌నెట్ ఎస్క్రో స్మార్ట్ కాంట్రాక్ట్‌లు • 100% క్రిప్టోగ్రాఫిక్ భద్రత',
    kn: 'ಮೇನ್‌ನೆಟ್ ಎಸ್ಕ್ರೋ ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು • 100% ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಭದ್ರತೆ',
    ml: 'മെയിൻനെറ്റ് എസ്ക്രോ സ്മാർട്ട് കരാറുകൾ • 100% ക്രിപ്റ്റോഗ്രാഫിക് സുരക്ഷ',
    bn: 'মেইননেট এসক্রো স্মার্ট চুক্তি • ১০০% ক্রিপ্টোগ্রাফিক সুরক্ষা',
    mr: 'मेननेट एस्क्रो स्मार्ट करार • 100% क्रिप्टोग्राफिक सुरक्षा',
    gu: 'મેઇનનેટ એસ્ક્રો સ્માર્ટ કરારો • 100% ક્રિપ્ટોગ્રાફિક સુરક્ષા',
    es: 'Contratos Inteligentes de Custodia Mainnet • 100% Seguridad Criptográfica',
    fr: 'Smart Contracts de séquestre Mainnet • Sécurité cryptographique à 100%',
    de: 'Mainnet-Treuhand-Smart-Contracts • 100% Kryptografische Sicherheit',
    ar: 'عقود الضمان الذكية على الشبكة الرئيسية • أمان تشفيري 100%',
    ja: 'メインネット・エスクロースマートコントラクト • 100%暗号化セキュリティ',
    zh: '主网智能托管合约 • 100% 密码学级资金安全',
    ru: 'Смарт-контракты эскроу Mainnet • 100% Криптографическая безопасность'
  }
};

// Fast Case-Insensitive Phrase Mapping Engine
const phraseMap = {};

Object.keys(dictionary).forEach(key => {
  const item = dictionary[key];
  const englishPhrase = (item.en || '').trim().toLowerCase();
  SUPPORTED_LANGUAGES.forEach(lang => {
    if (!phraseMap[lang.code]) phraseMap[lang.code] = {};
    if (item[lang.code]) {
      // Direct dictionary key match
      phraseMap[lang.code][key.toLowerCase()] = item[lang.code];
      // English sentence/phrase match
      if (englishPhrase) {
        phraseMap[lang.code][englishPhrase] = item[lang.code];
      }
    }
  });
});

/**
 * Universal Translation Engine
 * Works with both named keys (e.g., 'totalUsers') and raw English phrases (e.g., 'Admin Master Control Panel')
 */
export const getTranslation = (keyOrPhrase, lang = 'en', fallback = '') => {
  if (!keyOrPhrase) return fallback || '';
  const clean = String(keyOrPhrase).trim();
  const lower = clean.toLowerCase();

  // 1. Direct key match in dictionary
  if (dictionary[clean] && dictionary[clean][lang]) {
    return dictionary[clean][lang];
  }

  // 2. Normalized lookup in phraseMap
  if (phraseMap[lang] && phraseMap[lang][lower]) {
    return phraseMap[lang][lower];
  }

  // 3. Normalized fallback lookup
  if (fallback) {
    const lowerFallback = String(fallback).trim().toLowerCase();
    if (phraseMap[lang] && phraseMap[lang][lowerFallback]) {
      return phraseMap[lang][lowerFallback];
    }
  }

  // 4. Fallback greeting matcher (e.g., "Good evening, Raj Freelancer!")
  if (lower.startsWith('good evening') || lower.startsWith('good morning') || lower.startsWith('good afternoon')) {
    const greetingKey = lower.startsWith('good morning') ? 'goodMorning' : (lower.startsWith('good afternoon') ? 'goodAfternoon' : 'goodEvening');
    const greetingTrans = dictionary[greetingKey]?.[lang] || (greetingKey === 'goodMorning' ? 'Good morning' : (greetingKey === 'goodAfternoon' ? 'Good afternoon' : 'Good evening'));
    const parts = clean.split(',');
    if (parts.length > 1) {
      return `${greetingTrans}, ${parts.slice(1).join(',').trim()}`;
    }
    return greetingTrans;
  }

  // 5. Default return
  return fallback || (dictionary[clean]?.en || clean);
};

export const t = (keyOrPhrase, lang = 'en', fallback = '') => getTranslation(keyOrPhrase, lang, fallback);

export const useTranslation = () => {
  const language = useSelector(s => s.ui?.language) || localStorage.getItem('language') || 'en';
  return {
    t: (keyOrPhrase, fallback = '') => getTranslation(keyOrPhrase, language, fallback),
    language,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};

export default dictionary;
