export interface GenesoftOrganization {
    id: string;
    name: string;
    description: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
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
