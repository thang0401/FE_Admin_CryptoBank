export interface Employee {
  id: string;
  avatar: string;
  name: string;
  username: string;
  password: string;
  role: string;
  billing: string;
  email: string;
  status: string;
  employment_type: string;
  marital_status: string;
  hire_date: string;
  termination_date: string | null;
  salary: number;
  bonus: number;
  bank_account: string;
  bank_name: string;
  insurance_number: string;
  tax_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export interface NewEmployee {
  id: string;
  avatar: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
  billing: string;
  email: string;
  status: string;
  employment_type: string;
  marital_status: string;
  hire_date: string;
  termination_date: string | null;
  salary: number;
  bonus: number;
  bank_account: string;
  bank_name: string;
  insurance_number: string;
  tax_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export interface RoleConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}