export interface StaffMember {
    entity_uuid: string
    role_uuid: string
    user: Staffuser
}

export interface Staffuser {
    uuid: string
    email: string
    username: string
    image: string | null
    phone: string | null
    updated_at: string | null
    deleted_at: string | null
}

export interface StaffMemberInfo {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  branch_name?: string;
  role_uuid?: string;
  user_uuid?: string | undefined;
  is_active: string;
}

export interface Role {
    name: string
    value: string
}
export interface Roleshow {
    name: string
    status: string
}
export interface Roleshow {
  name: string;
  status: string;
}

export interface UserRole {
    uuid: string
    entity_type: string
    entity_uuid: string
    role_uuid: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    role_id: Roleshow
}

export type UserRolesArray = UserRole[]
