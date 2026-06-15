// ─── Shared types ─────────────────────────────────────────────────────────────

export type NodeType = 'file' | 'folder';

export interface FsNode {
    id: number;
    parent_id: number | null;
    name: string;
    type: NodeType;
    created_at: string;
}

export interface Breadcrumb {
    id: number;
    name: string;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function send<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        ...init,
    });
    if (res.status === 204) return undefined as T;
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message ?? `HTTP ${res.status}`);
    return body as T;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * GET /api/filesystem/nodes?parent_id={id}
 * Lists the direct children of a folder.
 * Omit parent_id to list root-level nodes.
 */
export function listNodes(parentId: number | null): Promise<FsNode[]> {
    const qs = parentId != null ? `?parent_id=${parentId}` : '';
    return send(`/api/filesystem/nodes${qs}`);
}

/**
 * POST /api/filesystem/nodes
 * Creates a new file or folder inside the given parent.
 */
export function createNode(
    name: string,
    type: NodeType,
    parentId: number | null,
): Promise<FsNode> {
    return send('/api/filesystem/nodes', {
        method: 'POST',
        body: JSON.stringify({ parent_id: parentId, name, type }),
    });
}

/**
 * DELETE /api/filesystem/nodes/:id
 * Deletes a node. If it is a folder, all descendants are deleted too.
 */
export function deleteNode(id: number): Promise<void> {
    return send(`/api/filesystem/nodes/${id}`, { method: 'DELETE' });
}

/**
 * GET /api/filesystem/search?q={query}&parent_id={id}
 * Returns the top 10 files whose names start with `q`.
 * Omit parent_id to search across all files.
 */
export function searchNodes(q: string, parentId?: number | null): Promise<FsNode[]> {
    const params = new URLSearchParams({ q });
    if (parentId != null) params.set('parent_id', String(parentId));
    return send(`/api/filesystem/search?${params}`);
}

/**
 * GET /api/filesystem/nodes/:id/ancestors
 * Returns the ordered chain of ancestor folders from root down to
 * the direct parent of the given node. Used to restore breadcrumbs
 * after navigating to a search result.
 */
export function getAncestors(id: number): Promise<Breadcrumb[]> {
    return send(`/api/filesystem/nodes/${id}/ancestors`);
}
