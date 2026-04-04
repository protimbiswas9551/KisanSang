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
    id: 'tomato', // fixed
    name: { 
      en: 'Tomato', hi: 'टमाटर', bn: 'টমেটো', mr: 'टोमॅटो', te: 'టమోటా', ta: 'தக்காளி', gu: 'ટમેટા', kn: 'ಟೊಮ್ಯಾಟೋ' 
    },
    minPh: 6.0,
    maxPh: 7.0,
    minTemp: 20,
    maxTemp: 30,
    waterRequirement: 'High',
    sowingMonths: [6, 7, 8, 11, 12],
    description: {
      en: 'Versatile fruit used as a vegetable in many cuisines.',
      hi: 'बहुमुखी फल जिसका उपयोग कई व्यंजनों में सब्जी के रूप में किया जाता है।',
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
      en: 'Potato', hi: 'आलू', bn: 'আलು', mr: 'बटाटा', te: 'బంగాళదుంప', ta: 'உருளைக்கிழங்கு', gu: 'બટાકા', kn: 'ಆಲೂಗಡ್ಡೆ'
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
  },
  {
    id: 'cotton',
    name: { en: 'Cotton', hi: 'कपास', bn: 'তুলা', mr: 'कापूस', te: 'పత్తి', ta: 'பருத்தி', gu: 'કપાસ', kn: 'ಹತ್ತಿ' },
    minPh: 5.5, maxPh: 8.5, minTemp: 21, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [4, 5, 6],
    description: { en: 'Major fiber crop, "White Gold" of India.', hi: 'प्रमुख रेशा फसल, भारत का "सफेद सोना"।', bn: 'প্রধান তন্তু ফসল।', mr: 'प्रमुख कापूस पीक।', te: 'ప్రధాన పీచు పంట।', ta: 'முக்கிய நார் பயிர்।', gu: 'મુખ્ય રેસા પાક।', kn: 'ಪ್ರಮುಖ ನಾರಿನ ಬೆಳೆ.' },
    soilType: { en: 'Black Soil (Regur)', hi: 'काली मिट्टी', bn: 'কালো মাটি', mr: 'काळी माती', te: 'నల్ల రేగడి మట్టి', ta: 'கரிசல் மண்', gu: 'કાળી માટી', kn: 'ಕಪ್ಪು ಮಣ್ಣು' },
    rotationGroup: 'fiber'
  },
  {
    id: 'sugarcane',
    name: { en: 'Sugarcane', hi: 'गन्ना', bn: 'আখ', mr: 'ऊस', te: 'చెరకు', ta: 'கரும்பு', gu: 'શેરડી', kn: 'ಕಬ್ಬು' },
    minPh: 6.5, maxPh: 7.5, minTemp: 20, maxTemp: 35, waterRequirement: 'High', sowingMonths: [1, 2, 3],
    description: { en: 'Major cash crop for sugar and ethanol.', hi: 'चीनी और इथेनॉल के लिए प्रमुख नकदी फसल।', bn: 'চিনি উৎপাদনের প্রধান উৎস।', mr: 'साखर उत्पादनासाठी प्रमुख पीक।', te: 'చక్కెర ఉత్పత్తికి ప్రధాన పంట।', ta: 'சர்க்கரை உற்பத்திக்கு முக்கிய பயிர்।', gu: 'ખાંડ માટે મુખ્ય રોકડિયો પાક।', kn: 'ಸಕ್ಕರೆ ಉತ್ಪಾದನೆಗೆ ಪ್ರಮುಖ ಬೆಳೆ.' },
    soilType: { en: 'Deep Rich Loamy', hi: 'गहरी उपजाऊ दोमट', bn: 'গভীর দোআঁশ মাটি', mr: 'खोल लोम माती', te: 'లోతైన లోమ్ మట్టి', ta: 'ஆழமான வண்டல் மண்', gu: 'ઊંડી ગોરાડુ માટી', kn: 'ಆಳವಾದ ಲೋಮ್ ಮಣ್ಣು' },
    rotationGroup: 'cash'
  },
  {
    id: 'tea',
    name: { en: 'Tea', hi: 'चाय', bn: 'চা', mr: 'चहा', te: 'టీ', ta: 'தேயிலை', gu: 'ચા', kn: 'ಚಹಾ' },
    minPh: 4.5, maxPh: 5.5, minTemp: 13, maxTemp: 35, waterRequirement: 'High', sowingMonths: [4, 5, 10, 11],
    description: { en: 'Important beverage crop grown on slopes.', hi: 'ढलानों पर उगाई जाने वाली महत्वपूर्ण पेय फसल।', bn: 'গুরুত্বপূর্ণ পানীয় ফসল।', mr: 'महत्वाचे पेय पीक।', te: 'ముఖ్యమైన పానీయ పంట।', ta: 'முக்கிய பானப் பயிர்।', gu: 'મહત્વનો પીણાનો પાક।', kn: 'ಪ್ರಮುಖ ಪಾನೀಯ ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Acidic Soil', hi: 'अच्छी जल निकासी वाली अम्लीय मिट्टी', bn: 'অম্লীয় মাটি।', mr: 'अम्लीय माती।', te: 'ఆమ్ల మట్టి।', ta: 'அமில மண்।', gu: 'એસિડિક માટી।', kn: 'ಆಮ್ಲೀಯ ಮಣ್ಣು.' },
    rotationGroup: 'beverage'
  },
  {
    id: 'coffee',
    name: { en: 'Coffee', hi: 'कॉफी', bn: 'কফি', mr: 'कॉफी', te: 'కాఫీ', ta: 'காபி', gu: 'કોફી', kn: 'ಕಾಫಿ' },
    minPh: 6.0, maxPh: 6.5, minTemp: 15, maxTemp: 28, waterRequirement: 'High', sowingMonths: [6, 7, 8],
    description: { en: 'Popular beverage crop, mainly in South India.', hi: 'लोकप्रिय पेय फसल, मुख्य रूप से दक्षिण भारत में।', bn: 'জনপ্রিয় পানীয় ফসল।', mr: 'लोकप्रिय पेय पीक।', te: 'ప్రసిద్ధ పానీయ పంట।', ta: 'பிரபலமான பானப் பயிர்।', gu: 'લોકપ્રિય પીણાનો પાક।', kn: 'ಜನಪ್ರಿಯ ಪಾನೀಯ ಬೆಳೆ.' },
    soilType: { en: 'Rich Well-drained Loam', hi: 'उपजाऊ अच्छी जल निकासी वाली दोमट', bn: 'উর্বর দোআঁশ মাটি।', mr: 'सुपीक लोम माती।', te: 'సారవంతమైన లోమ్ మట్టి।', ta: 'வளமான வண்டல் மண்।', gu: 'ફળદ્રુપ ગોરાડુ માટી।', kn: 'ಫಲವತ್ತಾದ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'beverage'
  },
  {
    id: 'bajra',
    name: { en: 'Bajra (Pearl Millet)', hi: 'बाजरा', bn: 'বাজরা', mr: 'बाजरी', te: 'సజ్జలు', ta: 'கம்பு', gu: 'બાજરી', kn: 'ಸಜ್ಜೆ' },
    minPh: 7.0, maxPh: 8.0, minTemp: 20, maxTemp: 35, waterRequirement: 'Low', sowingMonths: [6, 7],
    description: { en: 'Drought-tolerant millet, staple in dry areas.', hi: 'सूखा-सहिष्णु बाजरा, शुष्क क्षेत्रों में मुख्य भोजन।', bn: 'খরা সহনশীল শস্য।', mr: 'दुष्काळ सहन करणारे पीक।', te: 'కరువును తట్టుకునే పంట।', ta: 'வறட்சியைத் தாங்கும் பயிர்।', gu: 'દુષ્કાળ પ્રતિરોધક પાક।', kn: 'ಬರ ನಿರೋಧಕ ಬೆಳೆ.' },
    soilType: { en: 'Sandy, Shallow Black Soil', hi: 'रेतीली, उथली काली मिट्टी', bn: 'বেলে মাটি।', mr: 'रेताड माती।', te: 'ఇసుక మట్టి।', ta: 'மணல் மண்।', gu: 'રેતાળ માટી।', kn: 'ಮರಳು ಮಣ್ಣು.' },
    rotationGroup: 'millet'
  },
  {
    id: 'jowar',
    name: { en: 'Jowar (Sorghum)', hi: 'ज्वार', bn: 'জোয়ার', mr: 'ज्वारी', te: 'జొన్నలు', ta: 'சோளம்', gu: 'જુવાર', kn: 'ಜೋಳ' },
    minPh: 6.0, maxPh: 7.5, minTemp: 25, maxTemp: 32, waterRequirement: 'Low', sowingMonths: [6, 7, 10, 11],
    description: { en: 'Important food and fodder crop.', hi: 'महत्वपूर्ण भोजन और चारा फसल।', bn: 'খাদ্য ও পশুখাদ্য ফসল।', mr: 'महत्वाचे अन्न आणि चारा पीक।', te: 'ముఖ్యమైన ఆహార మరియు పశుగ్రాస పంట।', ta: 'முக்கிய உணவு மற்றும் தீவனப் பயிர்।', gu: 'મહત્વનો ખોરાક અને ઘાસચારો પાક।', kn: 'ಪ್ರಮುಖ ಆಹಾರ ಮತ್ತು ಮೇವಿನ ಬೆಳೆ.' },
    soilType: { en: 'Clayey or Loamy', hi: 'चिकनी या दोमट', bn: 'এঁটেল বা দোআঁশ মাটি।', mr: 'चिकणमाती किंवा लोम।', te: 'బంకమట్టి లేదా లోమ్।', ta: 'களிமண் அல்லது வண்டல் மண்।', gu: 'માટી અથવા ગોરાડુ।', kn: 'ಜಿಗುಟು ಅಥವಾ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'millet'
  },
  {
    id: 'ragi',
    name: { en: 'Ragi (Finger Millet)', hi: 'रागी', bn: 'রাগি', mr: 'नाचणी', te: 'రాగులు', ta: 'கேழ்வரகு', gu: 'રાગી', kn: 'ರಾಗಿ' },
    minPh: 5.0, maxPh: 8.0, minTemp: 20, maxTemp: 30, waterRequirement: 'Low', sowingMonths: [6, 7, 8],
    description: { en: 'Highly nutritious millet, rich in calcium.', hi: 'अत्यधिक पौष्टिक बाजरा, कैल्शियम से भरपूर।', bn: 'অত্যন্ত পুষ্টিকর শস্য।', mr: 'अत्यंत पौष्टिक पीक।', te: 'అధిక పోషక విలువలు గల పంట।', ta: 'அதிக சத்துக்கள் நிறைந்த பயிர்।', gu: 'ખૂબ જ પૌષ્ટિક પાક।', kn: 'ಅತ್ಯಂತ ಪೌಷ್ಟಿಕ ಬೆಳೆ.' },
    soilType: { en: 'Red, Light Black, Sandy Loam', hi: 'लाल, हल्की काली, रेतीली दोमट', bn: 'লাল মাটি।', mr: 'लाल माती।', te: 'ఎర్ర మట్టి।', ta: 'செம்மண்।', gu: 'લાલ માટી।', kn: 'ಕೆಂಪು ಮಣ್ಣು.' },
    rotationGroup: 'millet'
  },
  {
    id: 'barley',
    name: { en: 'Barley', hi: 'जौ', bn: 'যব', mr: 'जव', te: 'బార్లీ', ta: 'பார்லி', gu: 'જવ', kn: 'ಬಾರ್ಲಿ' },
    minPh: 6.0, maxPh: 8.0, minTemp: 12, maxTemp: 25, waterRequirement: 'Low', sowingMonths: [10, 11],
    description: { en: 'Cereal grain used for food and brewing.', hi: 'भोजन और ब्रूइंग के लिए उपयोग किया जाने वाला अनाज।', bn: 'খাদ্য শস্য।', mr: 'अन्नधान्य पीक।', te: 'ఆహార ధాన్యపు పంట।', ta: 'உணவு தானியப் பயிர்।', gu: 'અનાજ પાક।', kn: 'ಆಹಾರ ಧಾನ್ಯದ ಬೆಳೆ.' },
    soilType: { en: 'Sandy to Moderately Heavy Loam', hi: 'रेतीली से मध्यम भारी दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'cereal'
  },
  {
    id: 'gram',
    name: { en: 'Gram (Chickpea)', hi: 'चना', bn: 'ছোলা', mr: 'हरभरा', te: 'శనగలు', ta: 'கொண்டைக்கடலை', gu: 'ચણા', kn: 'ಕಡಲೆ' },
    minPh: 6.0, maxPh: 7.5, minTemp: 15, maxTemp: 25, waterRequirement: 'Low', sowingMonths: [10, 11],
    description: { en: 'Major pulse crop, rich in protein.', hi: 'प्रमुख दलहन फसल, प्रोटीन से भरपूर।', bn: 'প্রধান ডাল জাতীয় ফসল।', mr: 'प्रमुख कडधान्य पीक।', te: 'ప్రధాన పప్పుధాన్య పంట।', ta: 'முக்கிய பருப்பு வகை பயிர்।', gu: 'મુખ્ય કઠોળ પાક।', kn: 'ಪ್ರಮುಖ ಬೇಳೆಕಾಳು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Loam', hi: 'अच्छी जल निकासी वाली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'pulse'
  },
  {
    id: 'tur',
    name: { en: 'Tur (Pigeon Pea)', hi: 'अरहर', bn: 'অড়হর', mr: 'तूर', te: 'కందులు', ta: 'துவரை', gu: 'તુવેર', kn: 'ತೊಗರಿ' },
    minPh: 6.5, maxPh: 7.5, minTemp: 20, maxTemp: 30, waterRequirement: 'Low', sowingMonths: [6, 7],
    description: { en: 'Important pulse crop in India.', hi: 'भारत में महत्वपूर्ण दलहन फसल।', bn: 'গুরুত্বপূর্ণ ডাল ফসল।', mr: 'महत्वाचे कडधान्य पीक।', te: 'ముఖ్యమైన పప్పుధాన్య పంట।', ta: 'முக்கிய பருப்பு வகை பயிர்।', gu: 'મહત્વનો કઠોળ પાક।', kn: 'ಪ್ರಮುಖ ಬೇಳೆಕಾಳು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Alluvial or Black Soil', hi: 'अच्छी जल निकासी वाली जलोढ़ या काली मिट्टी', bn: 'দোআঁশ মাটি।', mr: 'काळी माती।', te: 'నల్ల రేगడి మట్టి।', ta: 'கரிசல் மண்।', gu: 'કાળી માટી।', kn: 'ಕಪ್ಪು ಮಣ್ಣು.' },
    rotationGroup: 'pulse'
  },
  {
    id: 'soyabean',
    name: { en: 'Soyabean', hi: 'सोयाबीन', bn: 'সয়াবিন', mr: 'सोयाबीन', te: 'సోయాబీన్', ta: 'சோயாபீன்', gu: 'સોયાબીન', kn: 'ಸೋಯಾಬೀನ್' },
    minPh: 6.0, maxPh: 7.5, minTemp: 20, maxTemp: 32, waterRequirement: 'Medium', sowingMonths: [6, 7],
    description: { en: 'Major oilseed and protein source.', hi: 'प्रमुख तिलहन और प्रोटीन स्रोत।', bn: 'প্রধান তৈলবীজ ফসল।', mr: 'प्रमुख तेलबिया पीक।', te: 'ప్రధాన నూనెగింజల పంట।', ta: 'முக்கிய எண்ணெய் வித்து பயிர்।', gu: 'મુખ્ય તેલીબિયાં પાક।', kn: 'ಪ್ರಮುಖ ಎಣ್ಣೆಕಾಳು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Loam', hi: 'अच्छी जल निकासी वाली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'oilseed'
  },
  {
    id: 'groundnut',
    name: { en: 'Groundnut', hi: 'मूंगफली', bn: 'চিনাবাদাম', mr: 'भुईमूग', te: 'వేరుశనగ', ta: 'நிலக்கடலை', gu: 'મગફળી', kn: 'ನೆಲಗಡಲೆ' },
    minPh: 6.0, maxPh: 6.5, minTemp: 20, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [6, 7, 1, 2],
    description: { en: 'Important oilseed and snack crop.', hi: 'महत्वपूर्ण तिलहन और स्नैक फसल।', bn: 'গুরুত্বপূর্ণ তৈলবীজ ফসল।', mr: 'महत्वाचे तेलबिया पीक।', te: 'ముఖ్యమైన నూనెగింజల పంట।', ta: 'முக்கிய எண்ணெய் வித்து பயிர்।', gu: 'મહત્વનો તેલીબિયાં પાક।', kn: 'ಪ್ರಮುಖ ಎಣ್ಣೆಕಾಳು ಬೆಳೆ.' },
    soilType: { en: 'Sandy Loam', hi: 'रेतीली दोमट', bn: 'বেলে দোআঁশ মাটি।', mr: 'रेताड लोम माती।', te: 'ఇసుక లోమ్ మట్టి।', ta: 'மணல் கலந்த வண்டல் மண்।', gu: 'રેતાળ ગોરાડુ માટી।', kn: 'ಮರಳು ಮಿಶ್ರಿತ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'oilseed'
  },
  {
    id: 'onion',
    name: { en: 'Onion', hi: 'प्याज', bn: 'পেঁয়াজ', mr: 'कांदा', te: 'ఉల్లిపాయ', ta: 'வெங்காயம்', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' },
    minPh: 6.0, maxPh: 7.0, minTemp: 15, maxTemp: 25, waterRequirement: 'Medium', sowingMonths: [10, 11, 12, 6, 7],
    description: { en: 'Essential vegetable used in most cuisines.', hi: 'अधिकांश व्यंजनों में उपयोग की जाने वाली आवश्यक सब्जी।', bn: 'প্রয়োজনীয় সবজি।', mr: 'अत्यावश्यक भाजी।', te: 'ముఖ్యమైన కూరగాయ।', ta: 'அத்தியாவசிய காய்கறி।', gu: 'જરૂરી શાકભાજી।', kn: 'ಅಗತ್ಯ ತರಕಾರಿ.' },
    soilType: { en: 'Sandy Loam to Clay Loam', hi: 'रेतीली दोमट से चिकनी दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'vegetable'
  },
  {
    id: 'chili',
    name: { en: 'Chili', hi: 'मिर्च', bn: 'লঙ্কা', mr: 'मिरची', te: 'మిరపకాయ', ta: 'மிளகாய்', gu: 'મરચું', kn: 'ಮೆಣಸಿನಕಾಯಿ' },
    minPh: 6.0, maxPh: 7.0, minTemp: 20, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [6, 7, 1, 2],
    description: { en: 'Popular spice used for heat and flavor.', hi: 'तीखेपन और स्वाद के लिए उपयोग किया जाने वाला लोकप्रिय मसाला।', bn: 'জনপ্রিয় মশলা।', mr: 'लोकप्रिय मसाला।', te: 'ప్రసిద్ధ మసాలా దినుసు।', ta: 'பிரபலமான மசாலா।', gu: 'લોકપ્રિય મસાલો।', kn: 'ಜನಪ್ರಿಯ ಸಾಂಬಾರ ಪದಾರ್ಥ.' },
    soilType: { en: 'Well-drained Loam', hi: 'अच्छी जल निकासी वाली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'spice'
  },
  {
    id: 'mango',
    name: { en: 'Mango', hi: 'आम', bn: 'আম', mr: 'आंबा', te: 'మామిడి', ta: 'மாம்பழம்', gu: 'કેરી', kn: 'ಮಾವಿನ ಹಣ್ಣು' },
    minPh: 5.5, maxPh: 7.5, minTemp: 24, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [6, 7, 8],
    description: { en: 'The "King of Fruits", major fruit crop.', hi: '"फलों का राजा", प्रमुख फल फसल।', bn: 'ফলের রাজা।', mr: 'फळांचा राजा।', te: 'పండ్లలో రాజు।', ta: 'கனிகளின் ராஜா।', gu: 'ફળોનો રાજા।', kn: 'ಹಣ್ಣುಗಳ ರಾಜ.' },
    soilType: { en: 'Deep Well-drained Alluvial/Loamy', hi: 'गहरी अच्छी जल निकासी वाली जलोढ़/दोमट', bn: 'দোআঁশ মাটি।', mr: 'खोल लोम माती।', te: 'లోతైన లోమ్ మట్టి।', ta: 'ஆழமான வண்டல் மண்।', gu: 'ઊંડી ગોરાડુ માટી।', kn: 'ಆಳವಾದ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'sunflower',
    name: { en: 'Sunflower', hi: 'सूरजमुखी', bn: 'সূর্যমুখী', mr: 'सूर्यफूल', te: 'పొద్దుతిరుగుడు', ta: 'சூரியகாந்தி', gu: 'સૂર્યમુખી', kn: 'ಸೂರ್ಯಕಾಂತಿ' },
    minPh: 6.0, maxPh: 7.5, minTemp: 20, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [1, 2, 6, 7],
    description: { en: 'Major oilseed crop with bright yellow flowers.', hi: 'चमकीले पीले फूलों वाली प्रमुख तिलहन फसल।', bn: 'তৈলবীজ ফসল।', mr: 'प्रमुख तेलबिया पीक।', te: 'ప్రధాన నూనెగింజల పంట।', ta: 'முக்கிய எண்ணெய் வித்து பயிர்।', gu: 'મુખ્ય તેલીબિયાં પાક।', kn: 'ಪ್ರಮುಖ ಎಣ್ಣೆಕಾಳು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Loam', hi: 'अच्छी जल निकासी वाली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'oilseed'
  },
  {
    id: 'coconut',
    name: { en: 'Coconut', hi: 'नारियल', bn: 'নারকেল', mr: 'नारळ', te: 'కొబ్బరి', ta: 'தேங்காய்', gu: 'નાળિયેર', kn: 'ತೆಂಗಿನಕಾಯಿ' },
    minPh: 5.2, maxPh: 8.0, minTemp: 20, maxTemp: 35, waterRequirement: 'High', sowingMonths: [6, 7, 8, 9],
    description: { en: 'Versatile palm tree, staple in coastal India.', hi: 'बहुमुखी ताड़ का पेड़, तटीय भारत में मुख्य।', bn: 'উপকূলীয় অঞ্চলের প্রধান ফসল।', mr: 'किनारपट्टीवरील मुख्य पीक।', te: 'తీరప్రాంత ప్రధాన పంట।', ta: 'கடலோரப் பகுதி முக்கிய பயிர்।', gu: 'દરિયાકાંઠાનો મુખ્ય પાક।', kn: 'ಕರಾವಳಿ ಪ್ರದೇಶದ ಪ್ರಮುಖ ಬೆಳೆ.' },
    soilType: { en: 'Sandy Loam to Alluvial', hi: 'रेतीली दोमट से जलोढ़', bn: 'বেলে দোআঁশ মাটি।', mr: 'रेताड लोम माती।', te: 'ఇసుక లోమ్ మట్టి।', ta: 'மணல் கலந்த வண்டல் மண்।', gu: 'રેતાળ ગોરાડુ માટી।', kn: 'ಮರಳು ಮಿಶ್ರಿತ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'garlic',
    name: { en: 'Garlic', hi: 'लहसुन', bn: 'রসুন', mr: 'लसूण', te: 'వెల్లుల్లి', ta: 'பூண்டு', gu: 'લસણ', kn: 'ಬೆಳ್ಳುಳ್ಳಿ' },
    minPh: 6.0, maxPh: 7.0, minTemp: 12, maxTemp: 25, waterRequirement: 'Medium', sowingMonths: [10, 11],
    description: { en: 'Pungent spice used for flavor and medicine.', hi: 'स्वाद और औषधि के लिए उपयोग किया जाने वाला तीखा मसाला।', bn: 'ভেষজ মশলা।', mr: 'औषधी मसाला।', te: 'మసాలా మరియు ఔషధ పంట।', ta: 'மருத்துவ குணமுள்ள மசாலா।', gu: 'ઔષધીય મસાલો।', kn: 'ಸಾಂಬಾರ ಮತ್ತು ಔಷಧೀಯ ಬೆಳೆ.' },
    soilType: { en: 'Rich Loamy Soil', hi: 'उपजाऊ दोमट मिट्टी', bn: 'উর্বর দোআঁশ মাটি।', mr: 'सुपीक लोम माती।', te: 'సారవంతమైన లోమ్ మట్టి।', ta: 'வளமான வண்டல் மண்।', gu: 'ફળદ્રુપ ગોરાડુ માટી।', kn: 'ಫಲವತ್ತಾದ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'spice'
  },
  {
    id: 'ginger',
    name: { en: 'Ginger', hi: 'अदरक', bn: 'আদা', mr: 'आले', te: 'అల్లం', ta: 'இஞ்சி', gu: 'આદુ', kn: 'ಶುಂಠಿ' },
    minPh: 6.0, maxPh: 6.5, minTemp: 20, maxTemp: 30, waterRequirement: 'High', sowingMonths: [5, 6],
    description: { en: 'Root spice used in tea and cooking.', hi: 'चाय और खाना पकाने में उपयोग किया जाने वाला जड़ मसाला।', bn: 'গুরুত্বপূর্ণ মশলা।', mr: 'महत्वाचा मसाला।', te: 'ముఖ్యమైన మసాలా దినుసు।', ta: 'முக்கிய மசாலா।', gu: 'મહત્વનો મસાલો।', kn: 'ಪ್ರಮುಖ ಸಾಂಬಾರ ಪದಾರ್ಥ.' },
    soilType: { en: 'Sandy Loam, Rich in Humus', hi: 'रेतीली दोमट, ह्यूमस से भरपूर', bn: 'উর্বর দোআঁশ মাটি।', mr: 'सुपीक लोम माती।', te: 'సారవంతమైన లోమ్ మట్టి।', ta: 'வளமான வண்டல் மண்।', gu: 'ફળદ્રુપ ગોરાડુ માટી।', kn: 'ಫಲವತ್ತಾದ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'spice'
  },
  {
    id: 'turmeric',
    name: { en: 'Turmeric', hi: 'हल्दी', bn: 'হলুদ', mr: 'हळद', te: 'పసుపు', ta: 'மஞ்சள்', gu: 'હળદર', kn: 'ಅರಿಶಿನ' },
    minPh: 5.5, maxPh: 7.5, minTemp: 20, maxTemp: 30, waterRequirement: 'High', sowingMonths: [5, 6],
    description: { en: 'Golden spice known for medicinal properties.', hi: 'औषधीय गुणों के लिए जाना जाने वाला सुनहरा मसाला।', bn: 'ভেষজ গুণসম্পন্ন মশলা।', mr: 'औषधी गुणधर्म असलेली हळद।', te: 'ఔషధ గుణాలు గల పసుపు।', ta: 'மருத்துவ குணமுள்ள மஞ்சள்।', gu: 'ઔષધીય ગુણો ધરાવતી હળદર।', kn: 'ಔಷಧೀಯ ಗುಣವುಳ್ಳ ಅರಿಶಿನ.' },
    soilType: { en: 'Well-drained Sandy/Clayey Loam', hi: 'अच्छी जल निकासी वाली रेतीली/चिकनी दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'spice'
  },
  {
    id: 'black_pepper',
    name: { en: 'Black Pepper', hi: 'काली मिर्च', bn: 'গোলমরিচ', mr: 'काळी मिरी', te: 'మిరియాలు', ta: 'மிளகு', gu: 'મરી', kn: 'ಕಾಳು ಮೆಣಸು' },
    minPh: 5.0, maxPh: 6.5, minTemp: 10, maxTemp: 40, waterRequirement: 'High', sowingMonths: [5, 6],
    description: { en: 'The "King of Spices", major export crop.', hi: '"मसालों का राजा", प्रमुख निर्यात फसल।', bn: 'মশলার রাজা।', mr: 'मसाल्यांचा राजा।', te: 'మసాలా దినుసుల రాజు।', ta: 'மிளகு - மசாலாக்களின் ராஜா।', gu: 'મસાલાનો રાજા।', kn: 'ಸಾಂಬಾರ ಪದಾರ್ಥಗಳ ರಾಜ.' },
    soilType: { en: 'Red Laterite or Alluvial', hi: 'लाल लैटेराइट या जलोढ़', bn: 'লাল মাটি।', mr: 'लाल माती।', te: 'ఎర్ర మట్టి।', ta: 'செம்மண்।', gu: 'લાલ માટી।', kn: 'ಕೆಂಪು ಮಣ್ಣು.' },
    rotationGroup: 'spice'
  },
  {
    id: 'banana',
    name: { en: 'Banana', hi: 'केला', bn: 'কলা', mr: 'केळी', te: 'అరటి', ta: 'வாழை', gu: 'કેળા', kn: 'ಬಾಳೆಹಣ್ಣು' },
    minPh: 6.5, maxPh: 7.5, minTemp: 15, maxTemp: 35, waterRequirement: 'High', sowingMonths: [6, 7, 8, 9, 2, 3],
    description: { en: 'Major tropical fruit crop.', hi: 'प्रमुख उष्णकटिबंधीय फल फसल।', bn: 'প্রধান ক্রান্তীয় ফল।', mr: 'प्रमुख उष्णकटिबंधीय फळ।', te: 'ప్రధాన ఉష్ణమండల పండు।', ta: 'முக்கிய வெப்பமண்டல கனி।', gu: 'મુખ્ય ઉષ્ણકટિબંધીય ફળ।', kn: 'ಪ್ರಮುಖ ಉಷ್ಣವಲಯದ ಹಣ್ಣು.' },
    soilType: { en: 'Rich Well-drained Loam', hi: 'उपजाऊ अच्छी जल निकासी वाली दोमट', bn: 'উর্বর দোআঁশ মাটি।', mr: 'सुपीक लोम माती।', te: 'సారవంతమైన లోమ్ మట్టి।', ta: 'வளமான வண்டல் மண்।', gu: 'ફળદ્રુપ ગોરાડુ માટી।', kn: 'ಫಲವತ್ತಾದ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'grapes',
    name: { en: 'Grapes', hi: 'अंगूर', bn: 'আঙুর', mr: 'द्राक्षे', te: 'ద్రాక్ష', ta: 'திராட்சை', gu: 'દ્રાક્ષ', kn: 'ದ್ರಾಕ್ಷಿ' },
    minPh: 6.5, maxPh: 7.5, minTemp: 15, maxTemp: 40, waterRequirement: 'Medium', sowingMonths: [10, 11, 1, 2],
    description: { en: 'Fruit crop used for table and wine.', hi: 'टेबल और वाइन के लिए उपयोग की जाने वाली फल फसल।', bn: 'আঙুর চাষ।', mr: 'द्राक्ष लागवड।', te: 'ద్రాక్ష పంట।', ta: 'திராட்சை சாகுபடி।', gu: 'દ્રાક્ષની ખેતી।', kn: 'ದ್ರಾಕ್ಷಿ ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Sandy Loam', hi: 'अच्छी जल निकासी वाली रेतीली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'apple',
    name: { en: 'Apple', hi: 'सेब', bn: 'আপেল', mr: 'सफरचंद', te: 'ఆపిల్', ta: 'ஆப்பிள்', gu: 'સફરજન', kn: 'ಸೇಬು' },
    minPh: 5.5, maxPh: 6.5, minTemp: -5, maxTemp: 25, waterRequirement: 'Medium', sowingMonths: [1, 2],
    description: { en: 'Major temperate fruit crop.', hi: 'प्रमुख समशीतोष्ण फल फसल।', bn: 'আপেল চাষ।', mr: 'सफरचंद लागवड।', te: 'ఆపిల్ పంట।', ta: 'ஆப்பிள் சாகுபடி।', gu: 'સફરજનની ખેતી।', kn: 'ಸೇಬು ಬೆಳೆ.' },
    soilType: { en: 'Deep Well-drained Loam', hi: 'गहरी अच्छी जल निकासी वाली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'guava',
    name: { en: 'Guava', hi: 'अमरूद', bn: 'পেয়ারা', mr: 'पेरू', te: 'జామ', ta: 'கொய்யா', gu: 'જામફળ', kn: 'ಸೀಬೆಹಣ್ಣು' },
    minPh: 4.5, maxPh: 8.2, minTemp: 15, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [6, 7, 8, 2, 3],
    description: { en: 'Hardy fruit crop, rich in Vitamin C.', hi: 'कठोर फल फसल, विटामिन सी से भरपूर।', bn: 'পেয়ারা চাষ।', mr: 'पेरू लागवड।', te: 'జామ పంట।', ta: 'கொய்யா சாகுபடி।', gu: 'જામફળની ખેતી।', kn: 'ಸೀಬೆಹಣ್ಣು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Alluvial to Clayey', hi: 'अच्छी जल निकासी वाली जलोढ़ से चिकनी', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'papaya',
    name: { en: 'Papaya', hi: 'पपीता', bn: 'পেঁপে', mr: 'पपई', te: 'బొప్పాయి', ta: 'பப்பாளி', gu: 'પપૈયું', kn: 'ಪಪ್ಪಾಯಿ' },
    minPh: 6.0, maxPh: 7.0, minTemp: 20, maxTemp: 35, waterRequirement: 'Medium', sowingMonths: [6, 7, 8, 9, 2, 3],
    description: { en: 'Fast-growing tropical fruit.', hi: 'तेजी से बढ़ने वाला उष्णकटिबंधीय फल।', bn: 'পেঁপে চাষ।', mr: 'पपई लागवड।', te: 'బొప్పాయి పంట।', ta: 'பப்பாளி சாகுபடி।', gu: 'પપૈયાની ખેતી।', kn: 'ಪಪ್ಪಾಯಿ ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Sandy Loam', hi: 'अच्छी जल निकासी वाली रेतीली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'pomegranate',
    name: { en: 'Pomegranate', hi: 'अनार', bn: 'বেদানা', mr: 'डाळिंब', te: 'దానిమ్మ', ta: 'மாதுளை', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' },
    minPh: 5.5, maxPh: 7.5, minTemp: 10, maxTemp: 38, waterRequirement: 'Low', sowingMonths: [6, 7, 1, 2],
    description: { en: 'Drought-tolerant fruit crop.', hi: 'सूखा-सहिष्णु फल फसल।', bn: 'বেদানা চাষ।', mr: 'डाळिंब लागवड।', te: 'దానిమ్మ పంట।', ta: 'மாதுளை சாகுபடி।', gu: 'દાડમની ખેતી।', kn: 'ದಾಳಿಂಬೆ ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Sandy/Clayey Loam', hi: 'अच्छी जल निकासी वाली रेतीली/चिकनी दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'rubber',
    name: { en: 'Rubber', hi: 'रबड़', bn: 'রবার', mr: 'रबर', te: 'రబ్బరు', ta: 'ரப்பர்', gu: 'રબર', kn: 'ರಬ್ಬರ್' },
    minPh: 4.5, maxPh: 6.0, minTemp: 20, maxTemp: 35, waterRequirement: 'High', sowingMonths: [6, 7, 8],
    description: { en: 'Major plantation crop for latex.', hi: 'लेटेक्स के लिए प्रमुख वृक्षारोपण फसल।', bn: 'রবার চাষ।', mr: 'रबर लागवड।', te: 'రబ్బరు పంట।', ta: 'ரப்பர் சாகுபடி।', gu: 'રબરની ખેતી।', kn: 'ರಬ್ಬರ್ ಬೆಳೆ.' },
    soilType: { en: 'Deep Well-drained Acidic Laterite', hi: 'गहरी अच्छी जल निकासी वाली अम्लीय लैटेराइट', bn: 'লাল মাটি।', mr: 'लाल माती।', te: 'ఎర్ర మట్టి।', ta: 'செம்மண்।', gu: 'લાલ માટી।', kn: 'ಕೆಂಪು ಮಣ್ಣು.' },
    rotationGroup: 'plantation'
  },
  {
    id: 'jute',
    name: { en: 'Jute', hi: 'जूट', bn: 'পাট', mr: 'ताग', te: 'జనపనార', ta: 'சணல்', gu: 'શણ', kn: 'ಸೆಣಬು' },
    minPh: 5.0, maxPh: 7.4, minTemp: 24, maxTemp: 35, waterRequirement: 'High', sowingMonths: [3, 4, 5],
    description: { en: 'The "Golden Fiber", major fiber crop.', hi: '"सुनहरा रेशा", प्रमुख रेशा फसल।', bn: 'সোনালী আঁশ।', mr: 'सोनेरी धागा।', te: 'బంగారు పీచు।', ta: 'தங்க நார்।', gu: 'સોનેરી રેસા।', kn: 'ಬಂಗಾರದ ನಾರು.' },
    soilType: { en: 'New Alluvial Soil', hi: 'नई जलोढ़ मिट्टी', bn: 'পলি মাটি।', mr: 'गाळाची माती।', te: 'ఒండ్రు మట్టి।', ta: 'வண்டல் மண்।', gu: 'કાંપવાળી માટી।', kn: 'ಪಲಿ ಮಣ್ಣು.' },
    rotationGroup: 'fiber'
  },
  {
    id: 'tobacco',
    name: { en: 'Tobacco', hi: 'तंबाकू', bn: 'তামাক', mr: 'तंबाखू', te: 'పొగాకు', ta: 'புகையிலை', gu: 'તમાકુ', kn: 'ತಂಬಾಕು' },
    minPh: 5.5, maxPh: 6.5, minTemp: 20, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [10, 11],
    description: { en: 'Major cash crop used for smoking and chewing.', hi: 'धूम्रपान और चबाने के लिए उपयोग की जाने वाली प्रमुख नकदी फसल।', bn: 'তামাক চাষ।', mr: 'तंबाखू लागवड।', te: 'పొగాకు పంట।', ta: 'புகையிலை சாகுபடி।', gu: 'તમાકુની ખેતી।', kn: 'ತಂಬಾಕು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Sandy Loam', hi: 'अच्छी जल निकासी वाली रेतीली दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'cash'
  },
  {
    id: 'cabbage',
    name: { en: 'Cabbage', hi: 'पत्ता गोभी', bn: 'বাঁধাকপি', mr: 'कोबी', te: 'క్యాబేజీ', ta: 'முட்டைக்கோஸ்', gu: 'કોબીજ', kn: 'ಕೋಸುಗಡ್ಡೆ' },
    minPh: 6.0, maxPh: 6.5, minTemp: 15, maxTemp: 20, waterRequirement: 'Medium', sowingMonths: [9, 10, 11],
    description: { en: 'Popular leafy vegetable.', hi: 'लोकप्रिय पत्तेदार सब्जी।', bn: 'বাঁধাকপি।', mr: 'कोबी।', te: 'క్యాబేజీ।', ta: 'முட்டைக்கோஸ்।', gu: 'કોબીજ।', kn: 'ಕೋಸುಗಡ್ಡೆ.' },
    soilType: { en: 'Well-drained Sandy/Clayey Loam', hi: 'अच्छी जल निकासी वाली रेतीली/चिकनी दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'vegetable'
  },
  {
    id: 'cauliflower',
    name: { en: 'Cauliflower', hi: 'फूलगोभी', bn: 'ফুলকপি', mr: 'फ्लॉवर', te: 'క్యాలీఫ్లవర్', ta: 'காலிஃபிளவர்', gu: 'ફૂલેવર', kn: 'ಹೂಕೋಸು' },
    minPh: 6.0, maxPh: 7.0, minTemp: 15, maxTemp: 20, waterRequirement: 'Medium', sowingMonths: [9, 10, 11],
    description: { en: 'Popular vegetable with edible white head.', hi: 'खाद्य सफेद सिर वाली लोकप्रिय सब्जी।', bn: 'ফুলকপি।', mr: 'फ्लॉवर।', te: 'క్యాలీఫ్లవర్।', ta: 'காலிஃபிளவர்।', gu: 'ફૂલેવર।', kn: 'ಹೂಕೋಸು.' },
    soilType: { en: 'Rich Well-drained Loam', hi: 'उपजाऊ अच्छी जल निकासी वाली दोमट', bn: 'উর্বর দোআঁশ মাটি।', mr: 'सुपीक लोम माती।', te: 'సారవంతమైన లోమ్ మట్టి।', ta: 'வளமான வண்டல் மண்।', gu: 'ફળદ્રુપ ગોરાડુ માટી।', kn: 'ಫಲವತ್ತಾದ ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'vegetable'
  }
];

export const DISEASES: Disease[] = [
  {
    id: 'wheat_rust',
    name: { 
      en: 'Wheat Rust', hi: 'गेहूं का रतुआ', bn: 'গমের মরিচা রোগ', mr: 'गव्हावरील तांबेरा',
      te: 'గోధుమ తుప్పు తెగులు', ta: 'கோதுமை துரு நோய்', gu: 'ઘઉંનો ગેરુ', kn: 'ಗೋಧಿ ತುಕ್ಕು ರೋಗ'
    },
    crop: 'wheat',
    symptoms: {
      en: 'Orange or brown pustules on leaves.',
      hi: 'पत्तियों पर नारंगी या भूरे रंग के धब्बे।',
      bn: 'পাতায় কমলা বা বাদামী রঙের দাগ।',
      mr: 'पानांवर नारंगी किंवा तपकिरी ठिपके।',      te: 'ఆకులపై నారింజ లేదా గోధుమ రంగు మచ్చలు।', ta: 'रเለuईເือુುॊုည०००።', gu: 'પાèદेฏ०००००००።', kn: 'ೆूुుು००००००००००።'
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
    language_name: 'English',
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
    home: 'Home',
    soil: 'Soil',
    crops: 'Crops',
    disease: 'Disease',
    weather: 'Weather',
    sand: 'Sand',
    silt: 'Silt',
    clay: 'Clay',
    soil_texture: 'Soil Texture',
  },
  hi: {
    language_name: 'हिंदी',
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
    home: 'होम',
    soil: 'मिट्टी',
    crops: 'फसल',
    disease: 'रोग',
    weather: 'मौसम',
    sand: 'रेत',
    silt: 'सिल्ट',
    clay: 'चिकनी मिट्टी',
    soil_texture: 'मिट्टी की बनावट',
  },
  bn: {
    language_name: 'বাংলা',
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
    home: 'হোম',
    soil: 'মাটি',
    crops: 'ফসল',
    disease: 'রোগ',
    weather: 'আবহাওয়া',
    sand: 'বালি',
    silt: 'পলি',
    clay: 'কাদা',
    soil_texture: 'মাটির গঠন',
  },
  mr: {
    language_name: 'मराठी',
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
    home: 'होम',
    soil: 'माती',
    crops: 'पीक',
    disease: 'रोग',
    weather: 'हवामान',
    sand: 'वाळू',
    silt: 'गाळ',
    clay: 'चिकणमाती',
    soil_texture: 'मातीचा पोत',
  },
  te: {
    language_name: 'తెలుగు',
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
    home: 'హోమ్',
    soil: 'మట్టి',
    crops: 'పంటలు',
    disease: 'వ్యాధి',
    weather: 'వాతావరణం',
    sand: 'ఇసుక',
    silt: 'సిల్ట్',
    clay: 'బంకమట్టి',
    soil_texture: 'మట్టి ఆకృతి',
  },
  ta: {
    language_name: 'தமிழ்',
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
    home: 'முகப்பு',
    soil: 'மண்',
    crops: 'பயிர்கள்',
    disease: 'நோய்',
    weather: 'வானிலை',
    sand: 'மணல்',
    silt: 'வண்டல்',
    clay: 'களிமண்',
    soil_texture: 'மண் அமைப்பு',
  },
  gu: {
    language_name: 'ગુજરાતી',
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
    home: 'હોમ',
    soil: 'જમીન',
    crops: 'પાક',
    disease: 'રોગ',
    weather: 'હવામાન',
    sand: 'રેતી',
    silt: 'કાંપ',
    clay: 'માટી',
    soil_texture: 'જમીનનું બંધારણ',
  },
  kn: {
    language_name: 'ಕನ್ನಡ',
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
    home: 'ಮುಖಪುಟ',
    soil: 'ಮಣ್ಣು',
    crops: 'ಬೆಳೆಗಳು',
    disease: 'ರೋಗ',
    weather: 'ಹವಾಮಾನ',
    sand: 'ಮರಳು',
    silt: 'ಹೂಳು',
    clay: 'ಜಿಗುಟು ಮಣ್ಣು',
    soil_texture: 'ಮಣ್ಣಿನ ವಿನ್ಯಾಸ',
  },
};
