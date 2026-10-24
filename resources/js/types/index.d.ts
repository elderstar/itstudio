export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar_url?: string | null;
    roles?: string[];
    is_approved_coder?: boolean;
    unread_notifications?: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash?: {
        lead_status?: string | null;
        status?: string | null;
    };
};
