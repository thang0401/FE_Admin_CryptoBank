export interface Employee {
    id: string;
    avatar: string;
    name: string;
    username: string;
    password: string;
    role: string;
    billing: string;
    status: "Active" | "Terminated" | "Suspended";
    employment_type: "Full-time" | "Part-time" | "Contract";
    marital_status: "Single" | "Married" | "Divorced" | "Widowed";
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
    name: string;
    icon: React.ReactNode;
    color: string;
  }