// The Cloudinary SDK returns "any" for most responses, so define the types manually

export interface CloudinaryResource
{
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
}

export interface CloudinaryDestroyResponse
{
    result: string;
}

export interface CloudinaryDeleteResourcesResponse
{
    deleted: Record<string, string>;
    partial: boolean;
}
