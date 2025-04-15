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
    branding: Branding;
    project_template_type: string;
    backend_requirements: string;
}

export interface Page {
    id?: string;
    name: string;
    description: string;
    references: PageReference[];
    files: PageFile[];
}
export interface PagefromDb {
    project_id: string;
    id: string;
    name: string;
    description: string;
    reference_link_ids: string[];
    file_ids: string[];
    created_at: string;
    updated_at: string;
}

export interface FileWithUrlFromDb {
    id: string;
    name: string;
    description: string;
    type: string;
    bucket: string;
    path: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface ReferenceFromDb {
    id: string;
    name: string;
    description: string;
    url: string;
    created_at: string;
    updated_at: string;
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
    id?: string;
    name: string;
    description: string;
    references?: FeatureReference[];
    files?: FeatureFile[];
}

export interface FeatureReference {
    id?: string;
    name: string;
    url: string;
    context: string;
}

export interface FeatureFile {
    id?: string;
    url: string;
    name: string;
    context: string;
}

export interface FeaturefromDb {
    id: string;
    project_id: string;
    name: string;
    description: string;
    file_ids: string[];
    reference_link_ids: string[];
    created_at: string;
    updated_at: string;
}

export interface CreateProjectRequest {
    organization_id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    branding?: {
        logo_url?: string;
        color?: string;
        theme?: string;
        perception?: string;
    };
    pages?: {
        name: string;
        description: string;
        file_ids?: string[];
        reference_link_ids?: string[];
    }[];
    features?: {
        name: string;
        description: string;
        file_ids?: string[];
        reference_link_ids?: string[];
    }[];
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    purpose?: string;
    target_audience?: string;
    backend_requirements?: string;
    branding?: {
        logo_url?: string;
        color?: string;
        theme?: string;
        perception?: string;
    };
    pages?: {
        name: string;
        description: string;
        file_ids?: string[];
        reference_link_ids?: string[];
    }[];
    features?: {
        name: string;
        description: string;
        file_ids?: string[];
        reference_link_ids?: string[];
    }[];
}

export interface UpdateProjectBrandingDto {
    logo_url: string;
    color: string;
    theme: string;
    perception: string;
}

export type AddPageRequest = {
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

export type AddFeatureRequest = {
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

export type EditPageRequest = {
    name?: string;
    description?: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

export type EditFeatureRequest = {
    name?: string;
    description?: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};
