
import { NewsItem, NewsSource } from './types';

export const dummySources: NewsSource[] = [
  {
    id: 'corriere',
    name: 'Corriere della Sera',
    url: 'https://www.corriere.it',
    reliability: 8
  },
  {
    id: 'repubblica',
    name: 'La Repubblica',
    url: 'https://www.repubblica.it',
    reliability: 8
  },
  {
    id: 'ilsole24ore',
    name: 'Il Sole 24 Ore',
    url: 'https://www.ilsole24ore.com',
    reliability: 9
  },
  {
    id: 'ansa',
    name: 'ANSA',
    url: 'https://www.ansa.it',
    reliability: 9
  },
  {
    id: 'wired',
    name: 'Wired Italia',
    url: 'https://www.wired.it',
    reliability: 7
  }
];

// Function to get current date and previous days
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

const getTwoDaysAgoDate = () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return twoDaysAgo.toISOString().split('T')[0];
};

export const dummyNews: NewsItem[] = [
  {
    id: '1',
    title: 'ChatGPT e il dibattito sull\'etica dell\'AI generativa',
    url: 'https://www.corriere.it/tecnologia/ai-ethics',
    date: getCurrentDate(),
    sourceId: 'corriere',
    category: 'ai',
    summary: 'Esperti discutono i limiti etici dell\'intelligenza artificiale generativa e le potenziali conseguenze sociali.'
  },
  {
    id: '2',
    title: 'Robot chirurgici: nuove linee guida per la responsabilità medica',
    url: 'https://www.repubblica.it/salute/robot-chirurgici',
    date: getCurrentDate(),
    sourceId: 'repubblica',
    category: 'robotics',
    summary: 'Pubblicate nuove linee guida sulla responsabilità medica nell\'utilizzo di robot chirurgici.'
  },
  {
    id: '3',
    title: 'Editing genetico: la comunità scientifica italiana chiede regole più chiare',
    url: 'https://www.ilsole24ore.com/biotech/crispr',
    date: getCurrentDate(),
    sourceId: 'ilsole24ore',
    category: 'biotech',
    summary: 'Gli scienziati italiani chiedono una regolamentazione più chiara per l\'uso delle tecniche CRISPR.'
  },
  {
    id: '4',
    title: 'Riconoscimento facciale nelle città italiane: il Garante della Privacy interviene',
    url: 'https://www.ansa.it/privacy/facial-recognition',
    date: getYesterdayDate(),
    sourceId: 'ansa',
    category: 'ai',
    summary: 'Il Garante della Privacy esprime preoccupazioni sull\'uso di tecnologie di riconoscimento facciale nelle città italiane.'
  },
  {
    id: '5',
    title: 'Droni autonomi per il monitoraggio ambientale: quali rischi?',
    url: 'https://www.wired.it/droni-ambiente',
    date: getYesterdayDate(),
    sourceId: 'wired',
    category: 'robotics',
    summary: 'Un\'analisi dei potenziali rischi legati all\'utilizzo di droni autonomi per il monitoraggio ambientale.'
  },
  {
    id: '6',
    title: 'Biobanche e consenso informato: il dibattito sulla proprietà dei dati biologici',
    url: 'https://www.corriere.it/salute/biobanche',
    date: getYesterdayDate(),
    sourceId: 'corriere',
    category: 'biotech',
    summary: 'Si riaccende il dibattito sulla proprietà dei dati biologici conservati nelle biobanche italiane.'
  },
  {
    id: '7',
    title: 'Algoritmi di assunzione: discriminazione invisibile nel mercato del lavoro',
    url: 'https://www.repubblica.it/economia/lavoro-algoritmi',
    date: getTwoDaysAgoDate(),
    sourceId: 'repubblica',
    category: 'ai',
    summary: 'Uno studio rivela potenziali discriminazioni negli algoritmi usati per la selezione del personale.'
  },
  {
    id: '8',
    title: 'Esoscheletri in fabbrica: nuove questioni di sicurezza sul lavoro',
    url: 'https://www.ilsole24ore.com/industria/esoscheletri',
    date: getTwoDaysAgoDate(),
    sourceId: 'ilsole24ore',
    category: 'robotics',
    summary: 'L\'introduzione degli esoscheletri nelle fabbriche italiane solleva nuove questioni sulla sicurezza dei lavoratori.'
  },
  {
    id: '9',
    title: 'Neurotecnologie: il confine tra cura e potenziamento umano',
    url: 'https://www.ansa.it/scienza/neurotecnologie',
    date: getTwoDaysAgoDate(),
    sourceId: 'ansa',
    category: 'biotech',
    summary: 'Esperti di bioetica discutono il sottile confine tra applicazioni terapeutiche e potenziamento delle capacità umane.'
  }
];

export const defaultAppSettings = {
  backgroundColor: '#f8fafc',
  textColor: '#1e293b',
  accentColor: '#3B82F6',
  emailSettings: {
    smtp: {
      host: 'smtp.ergonet.it',
      port: 587,
      secure: false,
      user: 'luca@trasformazioneconsapevole.it',
      password: '',
    },
    recipientEmail: 'trasformazionelf@gmail.com',
    senderEmail: 'luca@trasformazioneconsapevole.it',
    weeklyDigestDay: 1, // Monday
  },
  emailNotificationsEnabled: false,
};
