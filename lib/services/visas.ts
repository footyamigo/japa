/**
 * Firestore service for visa data (Web version)
 * Matches the mobile app's visa service structure
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Visa {
  id: string;
  visaName: string;
  visaType: string;
  countryCode: string;
  countryName: string;
  minAge: number | null;
  maxAge: number | null;
  educationLevels: string[];
  isStudyRoute: boolean;
  isWorkRoute: boolean;
  isFamilyRoute: boolean;
  applicationFee: number;
  currency: string;
  healthSurcharge: number | null;
  totalEstimatedCost: number;
  processingTime: string;
  processingTimeWeeks: number | null;
  description: string;
  eligibilityCriteria: string;
  requiredDocuments: string[];
  steps: VisaStep[];
  benefits: string[];
  restrictions: string[];
  tags: string[];
  difficulty: string;
  successRate: string | null;
  videoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisaStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  requiredDocuments: string[];
  whereToDoIt?: string;
  fees?: string | null;
  subSteps?: Array<{
    subStepNumber: number;
    title: string;
    description: string;
  }>;
}

/**
 * Get all visas for a specific country
 * Supports multiple country code variations (UK/GB for United Kingdom)
 */
export async function getVisasByCountry(countryCode: string): Promise<Visa[]> {
  try {
    const visasRef = collection(db, 'visas');
    
    // For UK, try both 'UK' and 'GB' codes
    const codesToTry = countryCode === 'UK' ? ['UK', 'GB'] : [countryCode];
    
    let allVisas: Visa[] = [];
    
    for (const code of codesToTry) {
      const q = query(visasRef, where('countryCode', '==', code));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allVisas.push({
          id: doc.id,
          ...data,
        } as Visa);
      });
    }
    
    // Remove duplicates by ID (in case both UK and GB codes exist)
    const uniqueVisas = allVisas.filter((visa, index, self) => 
      index === self.findIndex((v) => v.id === visa.id)
    );
    
    console.log(`Found ${uniqueVisas.length} unique visas for country code ${countryCode} (tried: ${codesToTry.join(', ')})`);
    
    return uniqueVisas;
  } catch (error) {
    console.error('Error fetching visas by country:', error);
    throw error;
  }
}

/**
 * Get visas filtered by type (Study, Work, Family, etc.)
 */
export async function getVisasByType(visaType: string, countryCode: string): Promise<Visa[]> {
  try {
    const visasRef = collection(db, 'visas');
    const q = query(
      visasRef,
      where('countryCode', '==', countryCode),
      where('visaType', '==', visaType)
    );
    const querySnapshot = await getDocs(q);
    
    const visas: Visa[] = [];
    querySnapshot.forEach((doc) => {
      visas.push({
        id: doc.id,
        ...doc.data(),
      } as Visa);
    });
    
    return visas;
  } catch (error) {
    console.error('Error fetching visas by type:', error);
    throw error;
  }
}

/**
 * Get a specific visa by ID
 */
export async function getVisaById(visaId: string): Promise<Visa | null> {
  try {
    const visaRef = doc(db, 'visas', visaId);
    const visaSnap = await getDoc(visaRef);
    
    if (visaSnap.exists()) {
      return {
        id: visaSnap.id,
        ...visaSnap.data(),
      } as Visa;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching visa by ID:', error);
    throw error;
  }
}

/**
 * Get visas by route type (Study, Work, Family)
 */
export async function getVisasByRouteType(
  routeType: 'study' | 'work' | 'family',
  countryCode: string
): Promise<Visa[]> {
  try {
    const visasRef = collection(db, 'visas');
    const fieldName = routeType === 'study' ? 'isStudyRoute' : 
                     routeType === 'work' ? 'isWorkRoute' : 'isFamilyRoute';
    
    const q = query(
      visasRef,
      where('countryCode', '==', countryCode),
      where(fieldName, '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    const visas: Visa[] = [];
    querySnapshot.forEach((doc) => {
      visas.push({
        id: doc.id,
        ...doc.data(),
      } as Visa);
    });
    
    return visas;
  } catch (error) {
    console.error('Error fetching visas by route type:', error);
    throw error;
  }
}

