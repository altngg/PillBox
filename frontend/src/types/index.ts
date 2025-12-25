export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  username?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Medicine {
  id: number;
  name: string;
  form: string;
  purpose?: string;
  manufacture_date?: string; 
  expiry_date?: string;
  status: string;
}

export interface MedicineCreate {
  name: string;
  form: string;
  purpose?: string;
  manufacture_date?: string;
  expiry_date?: string;
}

export interface Reminder {
  id: number;
  dosage: string;
  times_per_day: number;
  course_days: number;
  medicine_id: number;
}

export interface ReminderCreate {
  dosage: string;
  times_per_day: number;
  course_days: number;
  medicine_id: number;
}

export interface ReminderUpdate {
  dosage?: string;
  times_per_day?: number;
  course_days?: number;
  medicine_id?: number;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string | null;
  is_active: boolean;
  is_superuser: boolean;
}