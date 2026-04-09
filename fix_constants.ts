import fs from 'fs';

const filePath = 'src/constants.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix Cotton corruption
content = content.replace(/description: { en: 'Major fiber crop, "White Gold" of India\.', hi: 'प्रमुख रेशा फसल, भारत का ".*?\n    id: 'barley',/s, 
`description: { en: 'Major fiber crop, "White Gold" of India.', hi: 'प्रमुख रेशा फसल, भारत का "सफेद सोना"।', bn: 'প্রধান তন্তু ফসল।', mr: 'प्रमुख तंतू पीक।', te: 'ప్రధాన పీచు పంట।', ta: 'முக்கிய நார் பயிர்।', gu: 'મુખ્ય રેસાવાળો પાક।', kn: 'ಪ್ರಮುಖ ನಾರು ಬೆಳೆ.' },
    soilType: { en: 'Deep Black Soil (Regur)', hi: 'गहरी काली मिट्टी (रेगुर)', bn: 'কালো মাটি।', mr: 'काळी माती।', te: 'నల్ల రేగడి మట్టి।', ta: 'கரிசல் மண்।', gu: 'કાળી માટી।', kn: 'ಕಪ್ಪು ಮಣ್ಣು.' },
    rotationGroup: 'fiber'
  },
  {
    id: 'barley',`);

// Fix Guava/Pomegranate corruption
content = content.replace(/id: 'guava',.*?id: 'rubber',/s,
`id: 'guava',
    name: { en: 'Guava', hi: 'अमरूद', bn: 'পেয়ারা', mr: 'पेरू', te: 'జామ', ta: 'கொய்யா', gu: 'જામફળ', kn: 'ಸೀಬೆಹಣ್ಣು' },
    minPh: 4.5, maxPh: 8.2, minTemp: 15, maxTemp: 30, waterRequirement: 'Medium', sowingMonths: [6, 7, 8, 2, 3],
    description: { en: 'Hardy fruit crop, rich in Vitamin C.', hi: 'कठोर फल फसल, विटामिन सी से भरपूर।', bn: 'পেয়ারা চাষ।', mr: 'पेरू लागवड।', te: 'జామ పంట।', ta: 'கொய்யா சாகுபடி।', gu: 'જામફળની ખેતી।', kn: 'ಸೀಬೆಹಣ್ಣು ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Alluvial to Clayey', hi: 'अच्छी जल निकासी वाली जلوढ़ से चिकनी', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'pomegranate',
    name: { en: 'Pomegranate', hi: 'अनार', bn: 'বেদানা', mr: 'डाळिंब', te: 'దానిమ్మ', ta: 'மாதுளை', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' },
    minPh: 5.5, maxPh: 7.5, minTemp: 10, maxTemp: 35, waterRequirement: 'Low', sowingMonths: [6, 7, 1, 2],
    description: { en: 'Drought-tolerant fruit crop.', hi: 'सूखा-सहिष्णु फल फसल।', bn: 'বেদানা চাষ।', mr: 'डाळिंब लागवड।', te: 'దానిమ్మ పంట।', ta: 'மாதுளை சாகுபடி।', gu: 'દાડમની ખેતી।', kn: 'ದಾಳಿಂಬೆ ಬೆಳೆ.' },
    soilType: { en: 'Well-drained Sandy/Clayey Loam', hi: 'अच्छी जल निकासी वाली रेतीली/चिकनी दोमट', bn: 'দোআঁশ মাটি।', mr: 'लोम माती।', te: 'లోమ్ మట్టి।', ta: 'வண்டல் மண்।', gu: 'ગોરાડુ માટી।', kn: 'ಲೋಮ್ ಮಣ್ಣು.' },
    rotationGroup: 'fruit'
  },
  {
    id: 'rubber',`);

// Fix Cotton Bacterial Blight corruption
content = content.replace(/id: 'cotton_bacterial_blight',.*?id: 'rice_blast',/s,
`id: 'cotton_bacterial_blight',
    name: { en: 'Bacterial Blight', hi: 'जीवाणु झुलसा', bn: 'ব্যাকটেরিয়াল ব্লাইট', mr: 'जीवाणूजन्य करपा', te: 'బ్యాక్టీరియా ఎండు తెగులు', ta: 'பாக்டீரியா வாடல் நோய்', gu: 'બેક્ટેરિયલ સુકારો', kn: 'ಹತ್ತಿ ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಬ್ಲೈಟ್' },
    crop: 'cotton',
    symptoms: { en: 'Angular leaf spots and boll rot.', hi: 'कोणीय पत्ती के धब्बे और डोडों का सड़ना।', bn: 'কৌণিক পাতার দাগ এবং বোল পচা।', mr: 'कोनीय पानांवरील ठिपके आणि बोंड सडणे।', te: 'కోణీయ ఆకు మచ్చలు మరియు కాయ కుళ్లు।', ta: 'கோண இலை புள்ளிகள் மற்றும் காய் அழுகல்।', gu: 'કોણીય પાંદડાના ડાઘ અને જીંડવા સડો।', kn: 'ಕೋನೀಯ ಎಲೆ ಕಲೆಗಳು ಮತ್ತು ಕಾಯಿ ಕೊಳೆತ.' },
    treatment: { en: 'Seed treatment and Copper Oxychloride.', hi: 'बीज उपचार और कॉपर ऑक्सीक्लोराइड।', bn: 'বীজ শোধন এবং কপার অক্সিক্লোরাইড।', mr: 'बीजप्रक्रिया आणि कॉपर ऑक्सीक्लोराइड।', te: 'విత్తన శుద్ధి మరియు కాపర్ ఆక్సిక్లోరైడ్।', ta: 'விதை నేர்த்தி மற்றும் காப்பர் ஆக்ஸிகுளோரைடு।', gu: 'બીજ માવજત અને కోపర్ ఆక్సిక్లోరైడ్।', kn: 'ಬೀಜೋಪಚಾರ ಮತ್ತು ಕಾಪರ್ ಆಕ್ಸಿಕ್లోరైడ్.' },
    steps: { en: ['Use resistant varieties', 'Clean cultivation', 'Spray bactericide'], hi: ['प्रतिरोधी किस्मों का प्रयोग करें', 'स्वच्छ खेती', 'जीवाणुनाशक का छिड़काव करें'], bn: ['প্রতিরোধী জাত ব্যবহার করুন', 'পরিচ্ছন্ন চাষাবাদ', 'ব্যাকটেরিয়া নাশক স্প্রে করুন'], mr: ['प्रतिकारक्षम वाण वापरा', 'स्वच्छ शेती', 'जीवाणूनाशकाची फवारणी करा'], te: ['వరదలను నివారించండి', 'పొటాష్ ఎరువును వాడండి', 'బాక్టీరిసైడ్ పిచికారీ చేయండి'], ta: ['வெள்ளத்தைத் தவிர்க்கவும்', 'பொட்டாஷ் உரத்தைப் பயன்படுத்தவும்', 'பாக்டீரியா கொல்லியைத் தெளிக்கவும்'], gu: ['પૂર ટાળો', 'પોટાશ ખાતર લગાવો', 'બેક્ટેરિસાઇડ છાંટો'], kn: ['ಪ್ರವಾಹವನ್ನು ತಪ್ಪಿಸಿ', 'ಪೊಟ್ಯಾಶ್ ಗೊಬ್ಬರವನ್ನು ಬಳಸಿ', 'ಬ್ಯಾಕ್ಟೀರಿಸೈಡ್ ಸಿಂಪಡಿಸಿ'] },
    dosage: { en: '3g per liter water', hi: '3 ग्राम प्रति लीटर पानी', bn: 'প্রতি লিটার জলে ৩ গ্রাম', mr: '३ ग्रॅम प्रति लिटर पाणी', te: 'లీటరు నీటికి 3 గ్రాములు', ta: 'ஒரு லிட்டர் தண்ணீருக்கு 3 கிராம்', gu: 'લિટર દીઠ ૩ ગ્રામ પાણી', kn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 3 ಗ್ರಾಂ' },
    application: { en: 'Foliar spray', hi: 'पत्तियों पर छिड़काव', bn: 'পাতায় স্প্রে', mr: 'फवारणी', te: 'పిచికారీ', ta: 'இலைத் தெளிப்பு', gu: 'છંટకાવ', kn: 'ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಣೆ' },
    severity: 'High'
  },
  {
    id: 'rice_blast',`);

fs.writeFileSync(filePath, content);
console.log('Fixed constants.ts');
