export interface Project {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    branding_id: string | null;
    created_at: string;
    updated_at: string;
}
