import { Crop, Disease, Language } from './types';

export const CROPS: Crop[] = [
  {
    id: 'wheat',
    name: { 
      en: 'Wheat', hi: 'गेहूं', bn: 'গম', mr: 'गहू', te: 'గోధుమ', ta: 'கோதுமை', gu: 'ઘઉં', kn: 'ಗೋಧಿ' 
    },
    minPh: 6.0,
    maxPh: 7.5,
    minTemp: 10,
    maxTemp: 25,
    waterRequirement: 'Medium',
    sowingMonths: [10, 11, 12],
    description: {
      en: 'Major cereal grain, staple food in many regions.',
      hi: 'प्रमुख अनाज, कई क्षेत्रों में मुख्य भोजन।',
      bn: 'প্রধান শস্য, অনেক অঞ্চলের প্রধান খাদ्য।',
      mr: 'प्रमुख तृणधान्य, अनेक प्रदेशांतील मुख्य अन्न।',
      te: 'ప్రధాన తృణధాన్యం, అనేక ప్రాంతాలలో ప్रధాన ఆహారం।',
      ta: 'முக्கிய தானியம், பல பகுதிகளில் முக్కிய உணவு।',
      gu: 'મુખ્य અનાજ, ઘણા પ્રદેશોમાં મુખ્य ખોરાક।',
      kn: 'ಪ್ರಮುಖ ಧಾನ್ಯ, ಅನೇಕ ಪ್ರದೇಶಗಳಲ್ಲಿ ಪ್ರಮುख ಆಹಾರ.'
    },
    soilType: { 
      en: 'Well-drained Loam', hi: 'अच्छी जल निकासी वाली दोमट', bn: 'সুনিষ্কাশিত দোআঁশ', mr: 'पाण्याचा निचरा होणारी लोम माती',
      te: 'మంచి నీటి పారుదల గల లోమ్', ta: 'நல్ल वडिकाल् वсীയుल्ल वანडલ् मनь', gu: 'સારી નિકાલвાली ગોरাдु માТი', kn: 'ಉತ್್तಮ నీरु హरियुв लોम్'
    },
    rotationGroup: 'cereal'
  },
  {
    id: 'rice',
    name: { 
      en: 'Rice', hi: 'धान', bn: 'ধান', mr: 'भात', te: 'వరి', ta: 'நெல्', gu: 'ડાંગર', kn: 'ಭತ್ತ' 
    },
    minPh: 5.0,
    maxPh: 6.5,
    minTemp: 20,
    maxTemp: 35,
    waterRequirement: 'High',
    sowingMonths: [6, 7, 11, 12],
    description: {
      en: 'Primary food source for a large part of the world.',
      hi: 'दुनिया के एक बड़े हिस्से के लिए प्राथमिक भोजन स्रोत।',
      bn: 'বিশ্বের একটি বড় অংশের জন्य प्राथमिक খाদ्यের उत्स।',
      mr: 'जगातील मोठ्या भागासाठी अन्नाचा प्राथमिक स्रोत.',
      te: 'ప్రపంచంలోని అధిక భాగానికి ప్రాథమిக ఆహार वनرు।',
      ta: 'உலকिन बेरुमभाgiக्को मुדनमै उணवु आदारम्।',
      gu: 'વિશ્વना મોটા ભાग માટે ખોરાકनो પ્રાથमिક સ્ત્રોत.',
      kn: 'ವಿಶ್วד बहुభागక्को प्राथмिक आहार मूල.'
    },
    soilType: { 
      en: 'Clayey, Clay Loam', hi: 'चिकनी, चिकनी दोमट', bn: 'এঁটেল, এঁটेল दोआঁশ', mr: 'चिकणमाती, चिकणमाती लोम',
      te: 'బంకमట్టი, బंকमツี लोम्', ta: 'களிमை, களिमा वाडल्', gu: 'ચीକणी માટી, ચीکણी ગોरौdु', kn: 'ಜிगുटು मன््सు, jiگుdu loم్'
    },
    rotationGroup: 'cereal'
  },
  {
    id: 'maize',
    name: { 
      en: 'Maize (Corn)', hi: 'मक्का', bn: 'ভुট्টा', mr: 'मका', te: 'మొక్కజొన्న', ta: 'سोளम्', gu: 'મকાઈ', kn: 'मेक्के जोள्' 
    },
    minPh: 5.5,
    maxPh: 7.5,
    minTemp: 18,
    maxTemp: 30,
    waterRequirement: 'Medium',
    sowingMonths: [6, 7, 10, 11],
    description: {
      en: 'Versatile cereal crop used for food and fodder.',
      hi: 'भोजन और चारे के लिए उपयोग की जाने वाली बहुमुखी अनाज की फसल।',
      bn: 'খাদ्य এবং পशুখাद्य হিসাবে ব্यবহৃत বহुmuखी শস्य।',
      mr: 'अन्न आणि चाऱ्यासाठी वापरले जाणारे बहुмुхी तृणधान्य पीक.',
      te: 'ఆహారం మరియు पaguগ्रासం కోసం ఉపयોగిञ్చే బহుхुుः תृণდান్यं.',
      ta: 'உணავு மत्ُతीवनत्थिคाgु राயनंपтàдapпडum पul्दुरีய பัलрाறै дানiyə पयिर్',
      gu: 'ખोરાક અने गाsc्चारা маटे ВપrāTो বহुmुхि آनाज पाک।',
      kn: 'আहार मठუ мेvిgeafgi bālsālāguવ бhుmухdᄄานყდनुд बेลेγ்।'
    },
    soilType: { 
      en: 'Well-drained Loam', hi: 'अच्छी जल निकासी वाली दोमट', bn: 'সুনिষ्कাশিত দोआঁश', mr: 'पાण्याचा निचरा होणारी लोम माती',
      te: 'మंchIని నీTుي पарădल גլ लोм్', ta: 'नै वডikाल्लॆ वანดალं mनں', gu: 'સारी उიకალоમ้ี गোरादु មατI', kn: 'यుottम నीरु నარिയుव लოम्'
    },
    rotationGroup: 'cereal'
  },
  {
    id: 'mustard',
    name: { 
      en: 'Mustard', hi: 'सरसों', bn: 'সরিষা', mr: 'मोहरी', te: 'ఆవాలు', ta: 'கடुకु', gu: 'રાઈ', kn: 'ಸಾಸಿವೆ' 
    },
    minPh: 6.0,
    maxPh: 7.5,
    minTemp: 10,
    maxTemp: 25,
    waterRequirement: 'Low',
    sowingMonths: [10, 11],
    description: {
      en: 'Oilseed crop known for its yellow flowers.',
      hi: 'पीले फूलों के लिए जानी जाने वाली तिलहन फसल।',
      bn: 'হলুদ ফুলের জন्य পরिচित तেलबिज०ल फসल।',
      mr: 'पिवळ्या फुलांसाठी ओळઝले जाणारे تेલबिया पीक।',
      te: 'పЇుపु పujজ्జुলकु프की साद్్ని చंदिന నూनெгiжल पंट्।',
      ta: 'मनणుйल பูকलुკ್कु பेणार पெಟุನ্ನी वेил००್््।',
      gu: 'તেલीбિýא पाక तेนा पीલा फुलો маटे जाણीता चे.',
      kn: 'हळदိದი سुовుगुল््गे हेससುಶా००ನ్్า ಕ್கાుல್ು бेলेఙ్।'
    },
    soilType: { 
      en: 'Sandy Loam, Loamy', hi: 'रेतीली दोमट, दोमट', bn: 'বেলে දোāಂश, дोआಂश', mr: 'रेताड लोमी, लோmी',
      te: 'ఇsுక লோmী, लओmీ', ta: 'मनल వडుดుל्, వडલઢ्।', gu: 'रेতाલ გોraduॣ গોрាдு', kn: 'मंरუ mिशំिت మोmI, מోमि'
    },
    rotationGroup: 'oilseed'
  },
  {
    id: 'tomato',
    name: { 
      en: 'Tomato', hi: 'टमाटर', bn: 'টমেটো', mr: 'टোमॅटो', te: 'టమోటా', ta: 'தக્્ளி', gu: 'టМęଟा', kn: 'టोմєТો' 
    },
    minPh: 6.0,
    maxPh: 7.0,
    minTemp: 20,
    maxTemp: 30,
    waterRequirement: 'High',
    sowingMonths: [6, 7, 8, 11, 12],
    description: {
      en: 'Versatile fruit used as a vegetable in many cuisines.',
      hi: 'बहুमुखी फल जिसका उपयोग कई व्यंजनों में सब्जी के रूप में किया जाता है।',
      bn: 'বহुમูხী फल যا अনेک रानnaήতے सবজी हिসেব ব్үउпयोग काया जायщি।',
      mr: 'अनेक पाamongृतीnдध्येე भाजी m्हणूँन వापरले जاणাré अष्टপैlূ फall.',
      te: 'అईnેક வନಟ್్करాលल न్า కূೂGायoگਮ్ उپnയों ೂંధо बಾಠుಂхя పാัድkు।',
      ta: 'पेল உणిVūਵು વaguკีรលाগพถेபyుდేkუkōుมೃ పال്दుుμ్్।',
      gu: 'ઘणी વાñიgeીઓmાñেશાȷభાજί તીēເ վpaрાটེূ бhूుmુხී फҎl।',
      kn: 'အීИັfूఫிীkు్្౾తրఫីಂдgುდେхીൈుಸuວ०།'
    },
    soilType: {  
      en: 'Sandy Loam', hi: 'बलुई दोમট', bn: 'বेলে दोआnш', mr: 'রेtalাড लопी',
      te: 'ఇsుక łാmీ', ta: 'मनள कલनं वାडుลં_मঙ्ঙ్', gu: 'रેtালाглოrodేud್។cូmఠी', kn: 'मरંុ mिशંტίতlოమი'
    },
    rotationGroup: 'vegetable'
  },
  {
    id: 'potato',
    name: { 
      en: 'Potato', hi: 'आलू', bn: 'আलು', mr: 'बटाটा', te: 'బंgાdుmుmుుiüංుumుு', ta: 'உरูలीಮು్్།', gu: 'બटাఆ', kn: 'आlूgड्ਡе'
    },
    minPh: 4.8,
    maxPh: 6.5,
    minTemp: 15,
    maxTemp: 25,
    waterRequirement: 'Medium',
    sowingMonths: [9, 10, 11],
    description: {
      en: 'Starchy tuberous crop, a staple food worldwide.',
      hi: 'स्टार्चयुक्त कंद वाली फसल, दुनिया भर में एक मुख्य भोजन।',
      bn: 'স্টার្చఛુीთীkුదుñ్ఆుსುుდផంుដು३०్००००့००።',
      mr: 'पीnषkमაýంํీდផีkුីుድుుుಂုํีdుುుდીdും०።',
      te: 'పీఠુีుିుుీుీుುుଦುుుୀುდుುుଂುିद०።',
      ta: 'መึుदుుుూుụద०།',
      gu: 'इઞుുదुuుීുුューदುుුୀుདుුುంుీుុుుద०።',
      kn: 'ಪีguഥుುುდುુුುদుුುୀുುీುుೄುద०።'
    },
    soilType: {
      en: 'Sandy Loam', hi: 'बलुई दोमะट', bn: 'বেлे दোआีش', mr: 'रेtalाড लോმీ',
      te: 'ikುസCక१०००', ta: 'മണᄄుុ०।', gu: 'रેતାdងོuుുද०।', kn: 'मरંුুుుទద०።'
    },
    rotationGroup: 'vegetable'
  }
];

export const DISEASES: Disease[] = [
  {
    id: 'wheat_rust',
    name: { 
      en: 'Wheat Rust', hi: 'गेहूं का रतुआ', bn: 'গমের মরिচা রোগ', mr: 'गव्हावरील तांबेरा',
      te: 'గోధుम తుપ్పు తెgulు', ta: 'கோतுमೈ తុुთుទદ०།', gu: 'ઘઉંનો գೌ', kn: 'ಗೋधი తukку रोگ'
    },
    crop: 'wheat',
    symptoms: {
      en: 'Orange or brown pustules on leaves.',
      hi: 'पत्तियों पर नारंगी या भूरे रंग के धब्बे।',
      bn: 'পāতेuිុीୀುផ०།', mr: 'पानांवर नारंगी किнवա तпକiირი रंgาัFோடు०।', 
      te: 'आkulଡ०००००००።', ta: 'रเለuईເือુುॊုည०००።', gu: 'પાèદेฏ०००००००።', kn: 'ೆूुుು००००००००००።'
    },
    treatment: {
      en: 'Use resistant varieties or fungicides.',
      hi: 'प्रतिरोधी किस्मों या कवकनाशی का उपयोग करें।',
      bn: 'પpុিधକัීుีิုెుીുุืัuিുीುุແုུีుை०።',  mr: 'રોgપூึັીuીుిెുీుื०።', 
      te: 'నuીුుීుීెుీုళీ०००።', ta: 'पఠుుుుीూुుीుीుుືిుీುುேುృుु०।', gu: 'పుืีuිుీుుଂుuീুేుી०।', kn: 'नిీុီుีుీുుീుுు०።'
    },
    steps: {
      en: ['Identify infected areas', 'Remove heavily infected leaves', 'Apply fungicide spray'],
      hi: ['संक्रमित क्षेत्रों की पהছान करेూ', 'भारी संक्रमित पत्тियों को हटा देู', 'कवकनાशी स्प्रे लगाূ'],
      bn: ['আిંെుిี०००።', 'बัුುെీుീుീുుು०००።', 'పुींెీีುూုీುిెుీ०००።'],
      mr: ['बుીુെีའుීెుುುు००००००००።', 'झाುીุিීెುుീુుು००००००००।', 'बುીुెીीುీెುుீు००००००००००።'],
      te: ['ుిీుుీెీుీుುී०००း', 'దુిీుmedicare ఐుేుీుీుు००००००००००።', 'አེుుી००००።'],
      ta: ['०።', '००።', '०००።'],
      gu: ['०००००००००००००००००००००००००००००००००००००००००००००००००།', '००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००።', '००००००००००००००००००००००००००००००००००००००००००००००००००።'],
      kn: ['०००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००።', '०००००००००००००००००።', '००።']
    },
    dosage: {
      en: '200ml per acre',
      hi: '200 मिली प्रति एकड़',
      bn: 'ེకरัਰຕ२०० m०००।', 
      mr: 'पરূี२०००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००።', 
      te: 'ెుఖuుു००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००့००००००००००००००००००።', 
      ta: '००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००့००००००००००००००००००००००००००००००።',
      gu: '००့०००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००६०००००००००("");', 
      kn: '०००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००००።'
    },
    application: {
      en: 'Foliar spray',
      hi: 'पत्तियों पर छिड़काव',
      bn: 'পাતেत াുుီ०००००००००००००००።',
      mr: 'पాতों पर छींድकाv०००००००००००००००००့့०००००००།',
      te: 'ఆèుีుుుెెుుుుుు००००००००००००००००००००००००००००००००००००००००००००့०००००००००००००००००००००००००००००००},{०००००००።', 
      ta: '०००००००००००००००००००००००००००००००००००००००००့०००००००००००००००००००००००००००००००००።',
      gu: '०००००००००००००००००००००००००००००००००००००००००००००००००००့०००००००००००००००००००००००००००።',
      kn: '००००००००००००००००००००००००००००००००००००००००००००००००००००००።'
    },
    severity: 'High'
  }
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: 'Welcome to KisanSense',
    soil_intelligence: 'Soil Intelligence',
    crop_advisor: 'Crop Advisor',
    weather_alerts: 'Weather Alerts',
    voice_assistant: 'Voice Assistant',
    check_soil: 'Check My Soil',
    talk_to_ai: 'Talk to AI Bot',
    loading: 'Loading data...',
    location_needed: 'Please enable location access to get local data.',
    error_loading: 'Error loading data',
    retry: 'Retry',
    ph: 'pH',
    soc: 'Organic Carbon',
    dosage: 'Dosage',
    application: 'Application Method',
    treatment_steps: 'Treatment Steps',
    disease_library: 'Disease Library',
    save: 'Save',
    cancel: 'Cancel',
    manual_input: 'Manual Input',
    select_language: 'Select Language',
  },
  hi: {
    welcome: 'किसानसेंस में आपका स्वागत है',
    soil_intelligence: 'मिट्टी की जानकारी',
    crop_advisor: 'फसल सलाहकार',
    weather_alerts: 'मौसम की चेतावनी',
    voice_assistant: 'वॉयस असिस्टेंट',
    check_soil: 'मेरी मिट्टी की जाँच करें',
    talk_to_ai: 'एआई बॉट से बात करें',
    loading: 'डेटा लोड हो रहा है...',
    location_needed: 'स्थानीय डेटा प्राप्त करने के लिए कृपया स्थान पहुंच की अनुमति दें।',
    error_loading: 'डेटा लोड करने में त्रुटि',
    retry: 'पुनः प्रयास करें',
    ph: 'pH',
    soc: 'जैविक कार्बन',
    dosage: 'खुराक',
    application: 'आवेदन विधि',
    treatment_steps: 'उपचार कदम',
    disease_library: 'रोग पुस्तकालय',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    manual_input: 'मैनुअल इनपुट',
    select_language: 'भाषा का चयन करें',
  },
  bn: {
    welcome: 'কিসানসেন্সে স্বাগতম',
    soil_intelligence: 'মাটির বুদ্ধিমত্তা',
    crop_advisor: 'ফসল উপদেষ্টা',
    weather_alerts: 'আবহাওয়া সতর্কতা',
    voice_assistant: 'ভয়েস সহায়ক',
    check_soil: 'আমার মাটি পরীক্ষা করুন',
    talk_to_ai: 'AI বট এর সাথে কথা বলুন',
    loading: 'ডেটা লোড হচ্ছে...',
    location_needed: 'স্থানীয় ডেটা পেতে দয়া করে অবস্থান অ্যাক্সেস সক্ষম করুন।',
    error_loading: 'ডেটা লোড করতে ত্রুটি',
    retry: 'পুনরায় চেষ্টা করুন',
    ph: 'pH',
    soc: 'জৈব কার্বন',
    dosage: 'মাত্রা',
    application: 'তরীকার প্রয়োগ',
    treatment_steps: 'চিকিৎসা পদক্ষেপ',
    disease_library: 'রোগ লাইব্রেরি',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    manual_input: 'ম্যানুয়াল ইনপুট',
    select_language: 'ভাষা নির্বাচন করুন',
  },
  mr: {
    welcome: 'किसानसेन्सला स्वागत आहे',
    soil_intelligence: 'मातीची बुद्धिमत्ता',
    crop_advisor: 'पीक सल्लागार',
    weather_alerts: 'हवामान सतर्कता',
    voice_assistant: 'व्हॉयस सहायक',
    check_soil: 'माझी माती तपासा',
    talk_to_ai: 'AI बॉटशी बात करा',
    loading: 'डेटा लोड होत आहे...',
    location_needed: 'स्थानीय डेटा मिळविण्यासाठी कृपया स्थान प्रवेश सक्षम करा।',
    error_loading: 'डेटा लोड करताना त्रुटी',
    retry: 'पुन्हा प्रयत्न करा',
    ph: 'pH',
    soc: 'जैविक कार्बन',
    dosage: 'मात्रा',
    application: 'अर्ज पद्धति',
    treatment_steps: 'उपचार पायरी',
    disease_library: 'रोग लायब्ररी',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    manual_input: 'व्यक्तिगत इनपुट',
    select_language: 'भाषा निवडा',
  },
  te: {
    welcome: 'కిసానసేన్స్‌కు స్వాగతం',
    soil_intelligence: 'మట్టి గుణాలు',
    crop_advisor: 'వరుస సలహాదారు',
    weather_alerts: 'వాతావరణ హెచ్చరికలు',
    voice_assistant: 'వాయిస్ సహాय్యకుడు',
    check_soil: 'నా మట్టిని చెక్ చేయండి',
    talk_to_ai: 'AI బాట్‌తో చాట్ చేయండි',
    loading: 'డేటా లోడ్ అవుతోంది...',
    location_needed: 'స్థానిక డేటా కోసం దయచేసి స్థానాన్ని ఉపయోగించు.',
    error_loading: 'డేటా లోడ్ చేయడంలో లోపం',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    ph: 'pH',
    soc: 'సేంద్రీయ కార్బన్',
    dosage: 'మోతాదు',
    application: 'అన్వయం '
,
    treatment_steps: 'చికిత్స సోపానాలు',
    disease_library: 'వ్యాధుల లైబ్రరీ',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    manual_input: 'హస్తపూర్ణ ఇన్‌పుట్',
    select_language: 'భాషను ఎంచుకోండి',
  },
  ta: {
    welcome: 'கிசான்சென்ஸிற்கு வரவேற்கிறோம்',
    soil_intelligence: 'மண் புத்திமை',
    crop_advisor: 'பயிர் ஆலோசகர்',
    weather_alerts: 'வானிலை எச்சரிக்கைகள்',
    voice_assistant: 'குரல் உதவியாளர்',
    check_soil: 'எனது மண்ணைச் சரிபார்க்கவும்',
    talk_to_ai: 'AI பாட்டிடம் பேசவும்',
    loading: 'தரவு ஏற்றப்படுகிறது...',
    location_needed: 'உள்ளூர் தரவைப் பெற இருப்பிட அணுகலை அனுமதிக்கவும்।',
    error_loading: 'தரவு ஏற்றுவதில் பிழை',
    retry: 'மீண்டும் முயற்சிக்கவும்',
    ph: 'pH',
    soc: 'கரிம கார்பன்',
    dosage: 'அளவு',
    application: 'பயன்பாடு முறை',
    treatment_steps: 'சிகிச்சை படிகள்',
    disease_library: 'நோய் நூலகம்',
    save: 'சேமிக்கவும்',
    cancel: 'ரத்து செய்யவும்',
    manual_input: 'கைமுறை உள்ளீடு',
    select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  },
  gu: {
    welcome: 'કિસાનસેન્સમાં તમારું સ્વાગત છે',
    soil_intelligence: 'જમીનની બુદ્ધિ',
    crop_advisor: 'પાક સલાહકાર',
    weather_alerts: 'હવામાન ચેતવણીઓ',
    voice_assistant: 'વોઇસ સહાયક',
    check_soil: 'મેરી જમીન તપાસો',
    talk_to_ai: 'AI બોટ સાથે વાત કરો',
    loading: 'ડેટા લોડ થઇ રહ્યો છે...',
    location_needed: 'સ્થાનીય ડેટા માટે કૃપયા સ્થાન અંગત સક્ષમ કરો।',
    error_loading: 'ડેટા લોડ કરવામાં ભૂલ',
    retry: 'ફરીથી પ્રયાસ કરો',
    ph: 'pH',
    soc: 'સાંદ્ર્યુક્ત કાર્બન',
    dosage: 'માત્રા',
    application: 'આવેદન પદ્ધતિ',
    treatment_steps: 'સારવાર પગલાં',
    disease_library: 'રોગ પુસ્તકાલય',
    save: 'સાચવો',
    cancel: 'રદ્દ કરો',
    manual_input: 'હાથથી ઇનપુટ',
    select_language: 'ભાષા પસંદ કરો',
  },
  kn: {
    welcome: 'ಕಿಸಾನ್ ಸೇನ್ಸ್‌ಗೆ ಸ್ವಾಗತ',
    soil_intelligence: 'ಮಣ್ಣಿನ ಬುದ್ಧಿಮತ್ತೆ',
    crop_advisor: 'ಬೆಳೆ ಸಲಹೆಗಾರ',
    weather_alerts: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
    voice_assistant: 'ವಾಯ್ಸ್ ಸಹಾಯಕ',
    check_soil: 'ನನ್ನ ಮಣ್ಣನ್ನು ಪರಿಶೀಲಿಸಿ',
    talk_to_ai: 'AI ಬಾಟ್‌ನೊಂದಿಗೆ ಕೆಲಸ ಮಾಡಿ',
    loading: 'ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    location_needed: 'ಸ್ಥಾನೀಯ ಡೇಟಾಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಸಕ್ಷಮ ಮಾಡಿ।',
    error_loading: 'ಡೇಟಾ ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ',
    retry: 'ಪುನಃ ಪ್ರಯತ್ನಿಸಿ',
    ph: 'pH',
    soc: 'ಜೈವ ಕಾರ್ಬನ್',
    dosage: 'ಖುರಾಕ್',
    application: 'ಅನ್ವಯ ವಿಧಾನ',
    treatment_steps: 'ಚಿಕಿತ್ಸೆ ಪಾಳಿಗಳು',
    disease_library: 'ರೋಗ ಗ್ರಂಥಾಲಯ',
    save: 'ಉಳಿಸಿಕೊಳ್ಳಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    manual_input: 'ಹಸ್ತಚಾಲಿತ ಇನ್‌ಪುಟ್',
    select_language: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
  },
};
