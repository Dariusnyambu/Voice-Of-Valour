export interface Attendee {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  county: string;
  town: string;
  churchName: string;
  churchLocation: string;
  position: string;
  attendanceType: string;
  notes?: string;
}

export interface Partner {
  id: string;
  timestamp: string;
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  category: string;
  description: string;
  amount?: string;
  message?: string;
}

export interface Analytics {
  totalAttendees: number;
  totalPartners: number;
  churchesRepresented: number;
  todayRegistrations: number;
  registrationsPerDay: { date: string; count: number }[];
  partnersPerDay: { date: string; count: number }[];
  positionDistribution: { name: string; value: number }[];
  churchRepresentation: { name: string; value: number }[];
}

export interface Minister {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}
