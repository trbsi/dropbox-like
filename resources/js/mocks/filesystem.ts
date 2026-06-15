/**
 * Filesystem mock — intercepts fetch calls to /api/filesystem/* and returns
 * realistic Response objects from an in-memory store. Remove this import
 * (and the initFilesystemMock() call) once a real backend exists.
 */

import type { Breadcrumb, FsNode, NodeType } from '@/api/filesystem';

// ─── In-memory store ──────────────────────────────────────────────────────────

let nextId = 1;
const store = new Map<number, FsNode>();

function add(parentId: number | null, name: string, type: NodeType): FsNode {
    const node: FsNode = {
        id: nextId++,
        parent_id: parentId,
        name,
        type,
        created_at: new Date().toISOString(),
    };
    store.set(node.id, node);
    return node;
}

function seed() {
    const docs = add(null, 'Documents', 'folder');
    const pics = add(null, 'Pictures', 'folder');
    add(null, 'readme.txt', 'file');

    const work = add(docs.id, 'Work', 'folder');
    const personal = add(docs.id, 'Personal', 'folder');
    add(docs.id, 'notes.txt', 'file');

    add(work.id, 'report_q1.pdf', 'file');
    add(work.id, 'report_q2.pdf', 'file');
    add(work.id, 'budget_2024.xlsx', 'file');

    add(personal.id, 'diary.txt', 'file');

    add(pics.id, 'vacation_2024.jpg', 'file');
    add(pics.id, 'profile.png', 'file');
}
seed();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ok(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function err(message: string, status = 422): Response {
    return new Response(JSON.stringify({ message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function sortNodes(nodes: FsNode[]): FsNode[] {
    return [...nodes].sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

function descendants(id: number): number[] {
    const ids: number[] = [];
    const queue = [id];
    while (queue.length) {
        const cur = queue.shift()!;
        for (const n of store.values()) {
            if (n.parent_id === cur) {
                ids.push(n.id);
                if (n.type === 'folder') queue.push(n.id);
            }
        }
    }
    return ids;
}

// ─── Route handler ────────────────────────────────────────────────────────────

async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url, location.origin);
    const path = url.pathname;
    const method = request.method.toUpperCase();

    // GET /api/filesystem/nodes
    if (method === 'GET' && path === '/api/filesystem/nodes') {
        const raw = url.searchParams.get('parent_id');
        const parentId = raw != null ? Number(raw) : null;
        const children = [...store.values()].filter(n => n.parent_id === parentId);
        return ok(sortNodes(children));
    }

    // POST /api/filesystem/nodes
    if (method === 'POST' && path === '/api/filesystem/nodes') {
        const { parent_id, name, type } = (await request.json()) as {
            parent_id: number | null;
            name: string;
            type: NodeType;
        };

        if (!name?.trim()) return err('Name is required.');
        if (!['file', 'folder'].includes(type)) return err('Invalid type.');

        const duplicate = [...store.values()].some(
            n => n.parent_id === parent_id && n.name === name,
        );
        if (duplicate) return err(`A ${type} named "${name}" already exists here.`);

        return ok(add(parent_id, name, type), 201);
    }

    // DELETE /api/filesystem/nodes/:id
    const deleteMatch = path.match(/^\/api\/filesystem\/nodes\/(\d+)$/);
    if (method === 'DELETE' && deleteMatch) {
        const id = Number(deleteMatch[1]);
        if (!store.has(id)) return err('Not found.', 404);
        [id, ...descendants(id)].forEach(d => store.delete(d));
        return new Response(null, { status: 204 });
    }

    // GET /api/filesystem/search
    if (method === 'GET' && path === '/api/filesystem/search') {
        const q = url.searchParams.get('q') ?? '';
        if (!q) return err('Search query is required.');

        const rawParent = url.searchParams.get('parent_id');
        const parentId = rawParent != null ? Number(rawParent) : null;
        const lower = q.toLowerCase();

        let results = [...store.values()].filter(
            n => n.type === 'file' && n.name.toLowerCase().startsWith(lower),
        );
        if (rawParent != null) results = results.filter(n => n.parent_id === parentId);
        results.sort((a, b) => a.name.localeCompare(b.name));
        return ok(results.slice(0, 10));
    }

    // GET /api/filesystem/nodes/:id/ancestors
    const ancestorsMatch = path.match(/^\/api\/filesystem\/nodes\/(\d+)\/ancestors$/);
    if (method === 'GET' && ancestorsMatch) {
        const id = Number(ancestorsMatch[1]);
        if (!store.has(id)) return err('Not found.', 404);

        const path_: Breadcrumb[] = [];
        let cursor = store.get(id)?.parent_id ?? null;
        while (cursor != null) {
            const node = store.get(cursor);
            if (!node) break;
            path_.unshift({ id: node.id, name: node.name });
            cursor = node.parent_id;
        }
        return ok(path_);
    }

    return err('Not found.', 404);
}

// ─── FetchNode interceptor ────────────────────────────────────────────────────────

export function initFilesystemMock(): void {
    const _fetch = window.fetch.bind(window);

    window.fetch = function (input, init) {
        const url =
            input instanceof Request
                ? input.url
                : input instanceof URL
                  ? input.href
                  : String(input);

        if (url.includes('/api/filesystem')) {
            const req = input instanceof Request ? input : new Request(url, init);
            return handle(req);
        }

        return _fetch(input, init);
    };
}
