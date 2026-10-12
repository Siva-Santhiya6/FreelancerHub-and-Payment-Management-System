// Intelligent Multilingual NLP Engine for FreelancerHub
// Full Support: English, Tamil (தமிழ்), Tanglish, Hindi (हिंदी), Hinglish

const AI_PROVIDER = process.env.AI_PROVIDER || 'demo';

// Dynamic Knowledge Bank & Contextual Generators
const tamilProjectExplainer = `🚀 **திட்டங்களின் முழு விவரம் மற்றும் வழிகாட்டுதல் (Project Explanations & Architecture)**:

1. **E-Commerce Platform with React & Node.js** (பட்ஜெட்: ₹5,000)
   - **விளக்கம்**: நவீன மின்வணிக தளம் (E-Commerce). இதில் பொருட்கள் பட்டியல் (Catalog), ஷாப்பிங் கார்ட் (Cart), எஸ்க்ரோ கட்டண இணைப்பு மற்றும் வாடிக்கையாளர் நிர்வாகப் பகுதி (Admin Dashboard) அடங்கும்.
   - **தேவையான திறன்கள்**: React.js, Node.js, MongoDB, Redux.
   - **மைல்ஸ்டோன்கள்**: 
     - நிலை 1: அங்கீகாரம் & முகப்பு பக்க அமைப்பு (₹1,000)
     - நிலை 2: தயாரிப்பு பட்டியல் & கார்ட் (₹2,000)
     - நிலை 3: கட்டணம் & ஆர்டர் சரிபார்ப்பு (₹2,000)

2. **AI Chatbot for Customer Support** (பட்ஜெட்: ₹8,000)
   - **விளக்கம்**: தமிழ் மற்றும் ஆங்கிலத்தில் வாடிக்கையாளர் வினாக்களுக்கு பதிலளிக்கும் அறிவார்ந்த AI அரட்டை பொறி (NLP Engine).
   - **தேவையான திறன்கள்**: Python, Machine Learning, NLP, FastAPI/Express.

3. **Fintech Mobile App UI/UX Design** (பட்ஜெட்: ₹2,500)
   - **விளக்கம்**: நிதி சார்ந்த மொபைல் செயலிகளுக்கான நவீன Figma வடிவமைப்பு மற்றும் பயனர் இடைமுக அனுபவம் (UI/UX).

💡 **நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?**
- குறிப்பிட்ட திட்டத்திற்கு விண்ணப்பிக்க: *'சந்தைக்கு போ'* அல்லது *'Marketplace'* செல்லுங்கள்.
- புதிய திட்டம் பதிவு செய்ய: *'திட்டம் உருவாக்கு'* என்று கூறுங்கள்.`;

const englishProjectExplainer = `🚀 **Platform Active Projects & Scope Breakdown**:

1. **E-Commerce Platform with React & Node.js** (Budget: ₹5,000)
   - **Scope**: Full-featured e-commerce system with catalog, shopping cart, escrow gateway, order tracking, and administrative dashboard.
   - **Tech Stack**: React 18, Node.js, Express, MongoDB, Redux Toolkit.
   - **Milestones**: Auth & Setup (₹1,000) ➔ Catalog & Cart (₹2,000) ➔ Payment & Escrow Release (₹2,000).

2. **Multilingual AI Chatbot (NLP)** (Budget: ₹8,000)
   - **Scope**: Intelligent conversational assistant supporting Tamil & English customer support automation.
   - **Tech Stack**: Python, NLP, Express API integration.

3. **Fintech Mobile App UI/UX Design** (Budget: ₹2,500)
   - **Scope**: High-fidelity Figma prototype with interactive screens, dark mode design system, and micro-animations.

💡 *To browse or submit proposals, type 'Go to marketplace' or 'Create project'.*`;

const hindiProjectExplainer = `🚀 **सक्रिय प्रोजेक्ट्स और कार्य विवरण (Project Details)**:

1. **E-Commerce Platform with React** (बजट: ₹5,000)
   - **विवरण**: आधुनिक ई-कॉमर्स वेबसाइट - कार्ट, चेकआउट और सुरक्षित एस्क्रो भुगतान के साथ।
   - **आवश्यक कौशल**: React.js, Node.js, MongoDB, Redux.

2. **AI Chatbot for Customer Support** (बजट: ₹8,000)
   - **विवरण**: हिंदी और अंग्रेजी में स्वचालित ग्राहक सहायता चैटबॉट।

3. **Mobile App UI/UX Design** (बजट: ₹2,500)
   - **विवरण**: फिनटेक ऐप के लिए पूर्ण Figma प्रोटोटाइप और यूजर इंटरफेस।`;

// Intelligent intent detection
const detectIntent = (rawMessage) => {
  const msg = (rawMessage || '').trim().toLowerCase();

  // 1. UI Themes
  if (
    msg.includes('dark mode') || msg.includes('dark theme') || msg.includes('night mode') ||
    msg.includes('டார்க்') || msg.includes('இருண்ட') || msg.includes('dark pannu') || msg.includes('dark karo')
  ) {
    return { intent: 'theme_dark', action: 'theme', target: 'dark' };
  }

  if (
    msg.includes('light mode') || msg.includes('light theme') || msg.includes('day mode') ||
    msg.includes('லைட்') || msg.includes('வெளிச்ச') || msg.includes('light pannu') || msg.includes('light karo')
  ) {
    return { intent: 'theme_light', action: 'theme', target: 'light' };
  }

  // 2. Font Zoom
  if (
    msg.includes('increase font') || msg.includes('bigger font') || msg.includes('zoom in') ||
    msg.includes('எழுத்துரு கூட்டு') || msg.includes('பெரிய எழுத்து') || msg.includes('font perusu') || msg.includes('font badhao')
  ) {
    return { intent: 'font_increase', action: 'font', target: 'increase' };
  }

  if (
    msg.includes('decrease font') || msg.includes('smaller font') || msg.includes('zoom out') ||
    msg.includes('எழுத்துரு குறை') || msg.includes('சிறிய எழுத்து') || msg.includes('font chinnathu') || msg.includes('font ghatao')
  ) {
    return { intent: 'font_decrease', action: 'font', target: 'decrease' };
  }

  // 3. Project Explanation Requests (Tamil, Tanglish, English, Hindi)
  if (
    msg.includes('explain') || msg.includes('explanation') || msg.includes('kudu') || msg.includes('sollu') ||
    msg.includes('விளக்கம்') || msg.includes('சொல்லு') || msg.includes('திட்டம் பற்றி') || msg.includes('project pathi') ||
    msg.includes('project details') || msg.includes('details kudu') || msg.includes('kya hai project') || msg.includes('batao')
  ) {
    return { intent: 'project_explanation', action: null, target: null };
  }

  // 4. Navigation: Marketplace (including typos like சண்டைக்கு போ / சந்தைக்கு போ / market ku po)
  if (
    msg.includes('marketplace') || msg.includes('market place') || msg.includes('சந்தை') || msg.includes('சண்டை') ||
    msg.includes('market ku') || msg.includes('jobs') || msg.includes('find work') || msg.includes('browse') ||
    msg.includes('வேலை தேடு') || msg.includes('मार्केटप्लेस') || msg.includes('काम खोज')
  ) {
    return { intent: 'nav_marketplace', action: 'navigate', target: '/marketplace' };
  }

  // 5. Navigation: Post Project / Create Project
  if (
    msg.includes('create project') || msg.includes('post project') || msg.includes('new project') ||
    msg.includes('திட்டம் உருவாக்கு') || msg.includes('புதிய திட்டம்') || msg.includes('project podu') ||
    msg.includes('project create') || msg.includes('प्रोजेक्ट बनाओ') || msg.includes('नया प्रोजेक्ट')
  ) {
    return { intent: 'nav_create_project', action: 'navigate', target: '/projects/create' };
  }

  // 6. Navigation: My Projects / Workroom
  if (
    msg.includes('my project') || msg.includes('my projects') || msg.includes('என் திட்டம்') || msg.includes('என் திட்டங்கள்') ||
    msg.includes('my work') || msg.includes('मेरे प्रोजेक्ट') || msg.includes('active project')
  ) {
    return { intent: 'nav_my_projects', action: 'navigate', target: '/my-projects' };
  }

  // 7. Navigation: Proposals / Bids
  if (
    msg.includes('proposal') || msg.includes('proposals') || msg.includes('bid') || msg.includes('bids') ||
    msg.includes('விண்ணப்பம்') || msg.includes('முன்மொழிவு') || msg.includes('proposal ku') || msg.includes('प्रस्ताव')
  ) {
    return { intent: 'nav_proposals', action: 'navigate', target: '/proposals' };
  }

  // 8. Navigation: Payments / Escrow Vault
  if (
    msg.includes('payment') || msg.includes('payments') || msg.includes('escrow') || msg.includes('wallet') ||
    msg.includes('கட்டணம்') || msg.includes('பணம்') || msg.includes('வாலட்') || msg.includes('भुगतान') || msg.includes('वॉलेट')
  ) {
    return { intent: 'nav_payments', action: 'navigate', target: '/payments' };
  }

  // 9. Navigation: Invoices
  if (
    msg.includes('invoice') || msg.includes('invoices') || msg.includes('bill') || msg.includes('billing') ||
    msg.includes('இன்வாய்ஸ்') || msg.includes('ரசீது') || msg.includes('बिल')
  ) {
    return { intent: 'nav_invoices', action: 'navigate', target: '/invoices' };
  }

  // 10. Navigation: Agency Management
  if (
    msg.includes('agency') || msg.includes('team') || msg.includes('enterprise') ||
    msg.includes('ஏஜென்சி') || msg.includes('குழு') || msg.includes('एजेंसी') || msg.includes('टीम')
  ) {
    return { intent: 'nav_agency', action: 'navigate', target: '/agency' };
  }

  // 11. Navigation: Disputes & Mediation
  if (
    msg.includes('dispute') || msg.includes('disputes') || msg.includes('mediation') || msg.includes('issue') ||
    msg.includes('சர்ச்சை') || msg.includes('புகார்') || msg.includes('विवाद')
  ) {
    return { intent: 'nav_disputes', action: 'navigate', target: '/disputes' };
  }

  // 12. Navigation: Skills Assessment
  if (
    msg.includes('skill') || msg.includes('assessment') || msg.includes('test') || msg.includes('badge') ||
    msg.includes('திறன்') || msg.includes('தேர்வு') || msg.includes('कौशल')
  ) {
    return { intent: 'nav_skills', action: 'navigate', target: '/skills-assessment' };
  }

  // 13. Navigation: Analytics & Revenue
  if (
    msg.includes('analytic') || msg.includes('analytics') || msg.includes('revenue') || msg.includes('stats') ||
    msg.includes('வருமானம்') || msg.includes('பகுப்பாய்வு') || msg.includes('एनालिटिक्स')
  ) {
    return { intent: 'nav_analytics', action: 'navigate', target: '/analytics' };
  }

  // 14. Navigation: Contracts & Agreements
  if (
    msg.includes('contract') || msg.includes('contracts') || msg.includes('agreement') || msg.includes('nda') ||
    msg.includes('ஒப்பந்தம்') || msg.includes('अनुबंध')
  ) {
    return { intent: 'nav_contracts', action: 'navigate', target: '/contracts' };
  }

  // 15. Navigation: Timesheets & Time Tracker
  if (
    msg.includes('timesheet') || msg.includes('timesheets') || msg.includes('time track') || msg.includes('hours') ||
    msg.includes('டைம்ஷீட்') || msg.includes('நேரக் கணக்கு') || msg.includes('टाइमशीट')
  ) {
    return { intent: 'nav_timesheets', action: 'navigate', target: '/timesheets' };
  }

  // 16. Navigation: Community Forum
  if (
    msg.includes('community') || msg.includes('forum') || msg.includes('discussion') ||
    msg.includes('சமூகம்') || msg.includes('மன்றம்') || msg.includes('कम्युनिटी')
  ) {
    return { intent: 'nav_community', action: 'navigate', target: '/community' };
  }

  // 17. Navigation: Profile
  if (
    msg.includes('profile') || msg.includes('my profile') || msg.includes('சுயவிவரம்') || msg.includes('என் விவரம்') ||
    msg.includes('प्रोफाइल')
  ) {
    return { intent: 'nav_profile', action: 'navigate', target: '/profile' };
  }

  // 18. Navigation: Settings
  if (
    msg.includes('setting') || msg.includes('settings') || msg.includes('அமைப்புகள்') || msg.includes('सेटिंग्स')
  ) {
    return { intent: 'nav_settings', action: 'navigate', target: '/settings' };
  }

  // 19. Proposal Writing / Bidding Assistance
  if (
    msg.includes('write proposal') || msg.includes('how to bid') || msg.includes('proposal ezhudha') ||
    msg.includes('விண்ணப்பம் எழுத') || msg.includes('பிட் செய்வது எப்படி') || msg.includes('प्रपोजल लिखना')
  ) {
    return { intent: 'how_to_proposal', action: null, target: null };
  }

  // 20. Escrow Knowledge
  if (
    msg.includes('escrow') || msg.includes('safe') || msg.includes('security') ||
    msg.includes('எஸ்க்ரோ') || msg.includes('பாதுகாப்பு') || msg.includes('एस्क्रो')
  ) {
    return { intent: 'how_escrow_works', action: null, target: null };
  }

  // 21. Greetings
  if (
    msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('vanakkam') || msg.includes('namaste') ||
    msg.includes('வணக்கம்') || msg.includes('नमस्ते')
  ) {
    return { intent: 'greeting', action: null, target: null };
  }

  // 22. Thank you
  if (
    msg.includes('thank') || msg.includes('thx') || msg.includes('nandri') || msg.includes('dhanyavad') ||
    msg.includes('நன்றி') || msg.includes('धन्यवाद')
  ) {
    return { intent: 'thanks', action: null, target: null };
  }

  return { intent: 'general_qa', action: null, target: null };
};

/**
 * Generate intelligent multilingual response
 */
const generateResponse = (message, requestedLang = 'en') => {
  const isTamil = requestedLang === 'ta' || /[\u0B80-\u0BFF]/.test(message) || message.toLowerCase().includes('kudu') || message.toLowerCase().includes('sollu') || message.toLowerCase().includes('pannu') || message.toLowerCase().includes('ezhudha');
  const isHindi = requestedLang === 'hi' || /[\u0900-\u097F]/.test(message) || message.toLowerCase().includes('karo') || message.toLowerCase().includes('batao');
  
  const lang = isTamil ? 'ta' : isHindi ? 'hi' : (requestedLang || 'en');
  const { intent, action, target } = detectIntent(message);

  let replyText = '';

  if (intent === 'project_explanation') {
    replyText = isTamil ? tamilProjectExplainer : isHindi ? hindiProjectExplainer : englishProjectExplainer;
  } else if (intent === 'theme_dark') {
    replyText = isTamil ? "🌙 **டார்க் மோட் (Dark Mode)** மாற்றப்பட்டது!" : isHindi ? "🌙 **डार्क मोड** सक्रिय कर दिया गया है!" : "🌙 Switched interface to **Dark Mode**.";
  } else if (intent === 'theme_light') {
    replyText = isTamil ? "☀️ **லைட் மோட் (Light Mode)** மாற்றப்பட்டது!" : isHindi ? "☀️ **लाइट मोड** सक्रिय कर दिया गया है!" : "☀️ Switched interface to **Light Mode**.";
  } else if (intent === 'font_increase') {
    replyText = isTamil ? "🔍 எழுத்துரு அளவு பெரிதாக்கப்பட்டது (Zoom In)." : isHindi ? "🔍 फ़ॉन्ट साइज बढ़ा दिया गया है।" : "🔍 Increased font size for enhanced clarity.";
  } else if (intent === 'font_decrease') {
    replyText = isTamil ? "🔍 எழுத்துரு அளவு குறைக்கப்பட்டது (Zoom Out)." : isHindi ? "🔍 फ़ॉन्ट साइज घटा दिया गया है।" : "🔍 Decreased font size.";
  } else if (intent === 'nav_marketplace') {
    replyText = isTamil ? "🚀 திட்டங்கள் மற்றும் பணிகளைக் காண **சந்தை பக்கத்திற்கு (Marketplace)** தானாக செல்கிறோம்..." : isHindi ? "🚀 **मार्केटप्लेस (Marketplace)** खोला जा रहा है..." : "🚀 Navigating automatically to **Marketplace**...";
  } else if (intent === 'nav_create_project') {
    replyText = isTamil ? "📝 புதிய திட்டம் பதிவு செய்யும் பக்கத்திற்கு (**Post Project**) செல்கிறோம்..." : isHindi ? "📝 नया प्रोजेक्ट पोस्ट करने का पेज (**Post Project**) खोला जा रहा है..." : "📝 Opening **Post Project** builder wizard...";
  } else if (intent === 'nav_my_projects') {
    replyText = isTamil ? "📁 உங்கள் திட்டங்கள் மற்றும் பணி முன்னேற்ற பக்கத்திற்கு (**My Projects**) செல்கிறோம்..." : isHindi ? "📁 **My Projects** पेज खोला जा रहा है..." : "📁 Opening **My Projects & Workspaces**...";
  } else if (intent === 'nav_proposals') {
    replyText = isTamil ? "📄 உங்கள் விண்ணப்பங்கள் (**Proposals**) பக்கத்திற்கு செல்கிறோம்..." : isHindi ? "📄 **Proposals** पेज पर ले जाया जा रहा है..." : "📄 Opening **Proposals & Bids** management center...";
  } else if (intent === 'nav_payments') {
    replyText = isTamil ? "💳 எஸ்க்ரோ கட்டணங்கள் மற்றும் வாலட் பக்கத்திற்கு (**Payments & Escrow**) செல்கிறோம்..." : isHindi ? "💳 **Payments & Escrow** पेज खोला जा रहा है..." : "💳 Navigating to **Payments & Escrow Vault**...";
  } else if (intent === 'nav_invoices') {
    replyText = isTamil ? "🧾 ரசீதுகள் மற்றும் பில்லிங் பக்கத்திற்கு (**Invoices & Billing**) செல்கிறோம்..." : isHindi ? "🧾 **Invoices & Billing** पेज खोला जा रहा है..." : "🧾 Opening **Invoices & Billing Center**...";
  } else if (intent === 'nav_agency') {
    replyText = isTamil ? "👥 ஏஜென்சி மற்றும் குழு நிர்வாக பக்கத்திற்கு (**Agency & Team Hub**) செல்கிறோம்..." : isHindi ? "👥 **Agency & Team** हब खोला जा रहा है..." : "👥 Navigating to **Agency & Team Management**...";
  } else if (intent === 'nav_disputes') {
    replyText = isTamil ? "⚖️ சர்ச்சை தீர்வு மற்றும் நடுவர் மையத்திற்கு (**Dispute & Mediation Center**) செல்கிறோம்..." : isHindi ? "⚖️ **Dispute & Mediation** केंद्र खोला जा रहा है..." : "⚖️ Opening **Dispute & Mediation Center**...";
  } else if (intent === 'nav_skills') {
    replyText = isTamil ? "🎯 திறன் மதிப்பீடு மற்றும் சான்றிதழ் பக்கத்திற்கு (**Skills Assessment**) செல்கிறோம்..." : isHindi ? "🎯 **Skills Assessment** टेस्ट पेज खोला जा रहा है..." : "🎯 Opening **Skill Assessment & Verification Center**...";
  } else if (intent === 'nav_analytics') {
    replyText = isTamil ? "📊 வருமானம் மற்றும் புள்ளிவிவரங்கள் பக்கத்திற்கு (**Analytics & Revenue**) செல்கிறோம்..." : isHindi ? "📊 **Analytics & Revenue** इंटेलिजेंस खोला जा रहा है..." : "📊 Opening **Analytics & Financial Intelligence**...";
  } else if (intent === 'nav_contracts') {
    replyText = isTamil ? "📜 மின்னணு ஒப்பந்தங்கள் மற்றும் NDA பக்கத்திற்கு (**Contracts & E-Sign**) செல்கிறோம்..." : isHindi ? "📜 **Contracts & Agreements** पेज खोला जा रहा है..." : "📜 Opening **Contracts & E-Signature Suite**...";
  } else if (intent === 'nav_timesheets') {
    replyText = isTamil ? "⏱️ நேரக் கண்காணிப்பு மற்றும் டைம்ஷீட் பக்கத்திற்கு (**Timesheets**) செல்கிறோம்..." : isHindi ? "⏱️ **Timesheets & Time Tracker** खोला जा रहा है..." : "⏱️ Opening **Timesheets & Live Time Tracker**...";
  } else if (intent === 'nav_community') {
    replyText = isTamil ? "🌐 சமூக மன்றம் மற்றும் கலந்துரையாடல் பக்கத்திற்கு (**Community Forum**) செல்கிறோம்..." : isHindi ? "🌐 **Community Forum** खोला जा रहा है..." : "🌐 Opening **Community & Discussion Forum**...";
  } else if (intent === 'nav_profile') {
    replyText = isTamil ? "👤 உங்கள் சுயவிவரப் பக்கத்திற்கு (**Profile**) செல்கிறோம்..." : isHindi ? "👤 **Profile** पेज खोला जा रहा है..." : "👤 Opening your **User Profile & Trust Dashboard**...";
  } else if (intent === 'nav_settings') {
    replyText = isTamil ? "⚙️ அமைப்புகள் பக்கத்திற்கு (**Settings**) செல்கிறோம்..." : isHindi ? "⚙️ **Settings** पेज खोला जा रहा है..." : "⚙️ Opening **Settings & Preferences**...";
  } else if (intent === 'how_to_proposal') {
    if (isTamil) {
      replyText = `💼 **வெற்றிகரமான விண்ணப்பம் (Winning Proposal) எழுதுவது எப்படி?**

1. **வாடிக்கையாளர் தேவையை புரிந்து கொள்ளுங்கள்**: திட்டத்தின் முக்கிய இலக்கு, தொழில்நுட்பம் மற்றும் காலக்கெடுவை மதிப்பாய்வு செய்யுங்கள்.
2. **நேரடி அணுகுமுறை (Custom Pitch)**: பொதுவான உரையை தவிர்க்கவும். உங்கள் அனுபவம் எவ்வாறு இத்திட்டத்திற்கு உதவும் என்பதை 3-4 வரிகளில் சுருக்கமாக விளக்குங்கள்.
3. **மைல்ஸ்டோன் வாரியான மதிப்பீடு**: திட்டத்தை மைல்ஸ்டோன்களாக பிரித்து நியாயமான தொகையை குறிப்பிடவும்.
4. **மாதிரி வேலைகள் (Portfolio Links)**: நீங்கள் முன்பு முடித்த தொடர்புடைய திட்டங்களை இணைக்கவும்.

💡 *'சந்தைக்கு போ' என்று கூறினால் உடனே பொருத்தமான திட்டங்களை தேர்வு செய்யலாம்.*`;
    } else {
      replyText = `💼 **How to Craft a High-Converting Proposal**:
1. **Analyze Requirements**: Deeply inspect client deliverables and timeline.
2. **Tailored Pitch**: Avoid generic copy-paste. Explain your exact solution architecture in the first 2 sentences.
3. **Structured Milestones**: Offer progressive delivery stages with clear escrow milestones.
4. **Showcase Proof**: Attach verified skill badges and portfolio links.`;
    }
  } else if (intent === 'how_escrow_works') {
    if (isTamil) {
      replyText = `🔐 **எஸ்க்ரோ (Escrow) பாதுகாப்பு எவ்வாறு இயங்குகிறது?**

1. **வைப்புத்தொகை (Deposit)**: வாடிக்கையாளர் திட்டத்தை தொடங்கும் போது தொகை எஸ்க்ரோவில் பூட்டப்படும்.
2. **பணி முன்னேற்றம் (Work in Progress)**: பணியாளர் பணிகளை முடிக்கும் வரை நிதி எஸ்க்ரோவில் முழுமையாக பாதுகாப்பாக இருக்கும்.
3. **சரிபார்ப்பு & விடுவிப்பு (Milestone Approval)**: மைல்ஸ்டோன் பணிகளை வாடிக்கையாளர் சரிபார்த்து ஒப்புதல் அளித்தவுடன் பணம் நேரடியாக பணியாளரின் கணக்கிற்கு விடுவிக்கப்படும்.
4. **சர்ச்சை பாதுகாப்பு (Dispute Resolution)**: ஏதேனும் கருத்து வேறுபாடு ஏற்பட்டால் நடுவர் மூலம் நியாயமான தீர்வு வழங்கப்படும்.`;
    } else {
      replyText = `🔐 **How Autonomous Smart Escrow Operates**:
1. **Client Funds Escrow**: Deposit is locked safely in the smart escrow contract prior to work initiation.
2. **Protected Execution**: Freelancer develops deliverables with 100% payment guarantee.
3. **Milestone Review & Release**: Client inspects deliverables and releases payout directly to freelancer wallet.
4. **Dispute Mediation**: Unresolved disagreements are arbitrated impartially.`;
    }
  } else if (intent === 'greeting') {
    replyText = isTamil
      ? "வணக்கம்! நான் உங்கள் HubAI உதவியாளர். திட்ட விளக்கம், எஸ்க்ரோ தகவல்கள், விண்ணப்பம் எழுதுதல் அல்லது பக்கங்களுக்கு செல்ல என்னிடம் எதை வேண்டுமானாலும் கேட்கலாம் (எ.கா: *'project explanation kudu'*, *'சந்தைக்கு போ'*, *'டார்க் மோட்'*)."
      : isHindi
      ? "नमस्ते! मैं आपका HubAI सहायक हूँ। आप मुझसे प्रोजेक्ट विवरण, एस्क्रो भुगतान, या किसी भी पेज पर जाने के लिए कह सकते हैं।"
      : "Hello! I am HubAI, your intelligent freelance ecosystem assistant. Ask me anything about projects, escrow, proposal strategies, or platform navigation!";
  } else if (intent === 'thanks') {
    replyText = isTamil
      ? "மிக்க மகிழ்ச்சி மற்றும் நன்றி! வேறு ஏதேனும் உதவி தேவைப்பட்டால் சொல்லுங்கள்."
      : isHindi
      ? "आपका बहुत-बहुत धन्यवाद! किसी भी सहायता के लिए कभी भी पूछें।"
      : "You're very welcome! Let me know whenever you need guidance, calculations, or page navigation.";
  } else {
    // Dynamic Intelligent fallback that addresses query in context
    if (isTamil) {
      replyText = `நான் உங்களுக்கு உதவ தயாராக உள்ளேன்! 

நீங்கள் செய்யக்கூடிய சில முக்கிய செயல்பாடுகள்:
- **திட்ட விளக்கம்**: *'project explanation kudu'* அல்லது *'திட்டங்களை விளக்கு'*
- **பக்கங்களுக்கு செல்ல**: *'சந்தைக்கு போ'*, *'திட்டம் உருவாக்கு'*, *'கட்டணப் பக்கம்'*, *'இன்வாய்ஸ்'*
- **வடிவமைப்பு கட்டுப்பாடு**: *'டார்க் மோட்'*, *'லைட் மோட்'*, *'எழுத்துரு கூட்டு'*
- **ஆலோசனை**: *'விண்ணப்பம் எழுதுவது எப்படி'*, *'எஸ்க்ரோ முறை பற்றி சொல்'*

உங்களின் கேள்வியை அல்லது பணியை எனக்கு தெரிவிக்கவும்!`;
    } else if (isHindi) {
      replyText = `मैं आपकी सहायता के लिए तैयार हूँ!
- **प्रोजेक्ट विवरण**: *'प्रोजेक्ट्स के बारे में बताओ'*
- **पेज नेविगेशन**: *'मार्केटप्लेस खोलो'*, *'पेमेंट पेज'*, *'नया प्रोजेक्ट'*
- **थीम व फ़ॉन्ट**: *'डार्क मोड'*, *'फ़ॉन्ट बढ़ाओ'*
- **सहायता**: *'प्रपोजल कैसे लिखें'*, *'एस्क्रो कैसे काम करता है'*`;
    } else {
      replyText = `I am here to assist you with everything across FreelancerHub!

Try asking me:
- **Project Breakdown**: *"Explain available projects"* or *"Project explanation kudu"*
- **Quick Navigation**: *"Go to marketplace"*, *"Open payments"*, *"Post project"*, *"View invoices"*
- **Theme & Display**: *"Dark mode"*, *"Light mode"*, *"Increase font"*
- **Guidance**: *"How does escrow work?"*, *"How to write a winning proposal?"*`;
    }
  }

  return { message: replyText, language: lang, action, target, intent };
};

/**
 * Main chat handler
 */
const chat = async ({ message, language, userRole, context }) => {
  return generateResponse(message, language);
};

module.exports = { chat };
