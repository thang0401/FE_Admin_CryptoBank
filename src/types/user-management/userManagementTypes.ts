// types.ts

export type User = {
  id: string
  avatar: string
  name: string
  username: string
  password: string
  role: string
  billing: string
  status: "Active" | "Inactive" | "Pending"
}

export type StatCardProps = {
  title: string
  value: string | number
  change: {
    isPositive: boolean
    value: string
  }
  subtitle: string
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
}

export type UserFilterProps =  {
  selectedRole: string
  selectedStatus: string
  onRoleChange: (role: string) => void
  onStatusChange: (status: string) => void
}

export type UserRole = {
  role: string
  label: string
}

export type RoleConfig  = {
  
    name: string
    icon: React.ReactNode
    color: string
  
}
 