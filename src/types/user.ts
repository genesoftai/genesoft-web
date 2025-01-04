import { GenesoftOrganization } from "./organization";

export interface GenesoftUser {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    organization: GenesoftOrganization | null;
    organization_id: string | null;
    created_at: string;
    updated_at: string;
}
