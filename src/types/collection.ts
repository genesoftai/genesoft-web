export interface Collection {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    web_project_id: string;
    backend_service_project_ids: string[];
    organization_id: string;
    created_at: string;
    updated_at: string;
}
