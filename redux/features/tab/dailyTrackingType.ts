export interface EnergyAndWellBeing {
  energyLevel: number;
  stressLevel: number;
  muscelLevel: number;
  mood: number;
  motivation: number;
  bodyTemperature: string | number;
}

export interface Training {
  trainingCompleted: boolean;
  trainingPlan: string[];
  cardioCompleted: boolean;
  cardioType: string;
  duration: string;
}

export interface Nutrition {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  hungerLevel: number;
  digestionLevel: number;
  salt: number;
}

export interface BloodPressure {
  systolic: string | number;
  diastolic: string | number;
  restingHeartRate: string | number;
  bloodGlucose: string | number;
}

export interface Ped {
  dailyDosage: string;
  sideEffect: string;
}

export interface Woman {
  cyclePhase: string;
  cycleDay: string;
  pmsSymptoms: number;
  cramps: number;
  symptoms: string[];
}

export interface WeekItem {
  _id: string;
  date: string;
  userId: string;
  weight: number;
  sleepHour: number;
  sleepQuality: string;
  sick: boolean;
  water: string;
  energyAndWellBeing: EnergyAndWellBeing;
  training: Training;
  activityStep: number;
  nutrition: Nutrition;
  woman: Woman;
  bloodPressure: BloodPressure;
  ped: Ped;
  dailyNotes: string;
  day: string;
}

export interface Averages {
  weight: number;
  sleepHour: number;
  sleepQuality: number;
  activityStep: number;
  energyAndWellBeing: EnergyAndWellBeing;
  nutrition: Nutrition;
  training: {
    cardioDuration: number;
  };
  woman: {
    pmsSymptoms: number;
    cramps: number;
  };
  bloodPressure: BloodPressure;
}

export interface WeekApiResponse {
  weekData: WeekItem[];
  averages: Averages;
}
