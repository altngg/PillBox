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
    photo_url?: string;  
    status: string;
    owner_id: number;    
}

export interface MedicineCreate {
    name: string;
    form: string;
    purpose?: string;
    manufacture_date?: string;
    expiry_date?: string;
    photo_url?: string;  
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    name?: string;
    purpose?: string;
    form?: string;
    date_from?: string;
    date_to?: string;
    status?: 'expired' | 'expiring_soon' | 'valid' | 'unknown';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
}
 
export interface FileUploadResponse {
    photo_url: string;
}

export interface FileUploadError {
    detail: string;
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

export interface AdminReminderRaw {
  id: number;
  dosage: string;
  times_per_day: number;
  course_days: number;
  medicine_id: number;
  owner_id: number;
}