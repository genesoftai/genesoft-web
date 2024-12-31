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

export interface Page {
    name: string;
    description: string;
    references: PageReference[];
    files: PageFile[];
}

export interface PageReference {
    id?: string;
    name: string;
    url: string;
    context: string;
}

export interface PageFile {
    id?: string;
    url: string;
    name: string;
    context: string;
}

export interface Branding {
    logo_url?: string;
    color?: string;
    theme?: string;
    perception?: string;
}

export interface Feature {
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
}
