import { GenesoftUser } from "./user";

export interface GenesoftOrganization {
    id: string;
    name: string;
    description: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    users: GenesoftUser[];
    owner_id: string;
}
export interface CreateOrganization {
    name: string;
    description: string;
    image?: string;
    email: string;
}

export interface UpdateOrganization {
    id: string;
    name?: string;
    description?: string;
    image?: string;
}

export interface OrganizationUser {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    organization_id: string | null;
    created_at: string;
    updated_at: string;
    customer_id: string | null;
    organization_ids: string[];
    role: string;
}
