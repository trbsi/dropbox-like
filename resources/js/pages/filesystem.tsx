import { useCallback, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Breadcrumb, FsNode, NodeType } from '@/api/filesystem';
import * as api from '@/api/filesystem';

// ─── Component ───────────────────────────────────────────────────────────────

export default function FileSystem() {
    const [nodes, setNodes] = useState<FsNode[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create form
    const [createType, setCreateType] = useState<NodeType | null>(null);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const createInputRef = useRef<HTMLInputElement>(null);

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchScope, setSearchScope] = useState<'all' | 'current'>('all');
    const [searchResults, setSearchResults] = useState<FsNode[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const currentFolderId: number | null = breadcrumbs.length
        ? breadcrumbs[breadcrumbs.length - 1].id
        : null;

    // Load folder contents
    const loadFolder = useCallback(async (folderId: number | null) => {
        setLoading(true);
        setError(null);
        try {
            setNodes(await api.listNodes(folderId));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFolder(currentFolderId);
    }, [currentFolderId, loadFolder]);

    useEffect(() => {
        if (createType) setTimeout(() => createInputRef.current?.focus(), 0);
    }, [createType]);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        const tid = setTimeout(async () => {
            const parentId =
                searchScope === 'current' ? currentFolderId : undefined;
            const results = await api.searchNodes(searchQuery.trim(), parentId);
            setSearchResults(results);
            setShowDropdown(true);
        }, 150);
        return () => clearTimeout(tid);
    }, [searchQuery, searchScope, currentFolderId]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const openFolder = (node: FsNode) => {
        setBreadcrumbs((prev) => [...prev, { id: node.id, name: node.name }]);
    };

    const navigateToBreadcrumb = (index: number) => {
        setBreadcrumbs((prev) => prev.slice(0, index));
    };

    const openCreateForm = (type: NodeType) => {
        setCreateType(type);
        setNewName('');
    };

    const cancelCreate = () => {
        setCreateType(null);
        setNewName('');
    };

    const handleCreate = async () => {
        if (!newName.trim() || !createType) return;
        setCreating(true);
        try {
            const node = await api.createNode(
                newName.trim(),
                createType,
                currentFolderId,
            );
            setNodes((prev) =>
                [...prev, node].sort((a, b) => {
                    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                    return a.name.localeCompare(b.name);
                }),
            );
            cancelCreate();
        } catch (e) {
            alert((e as Error).message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (node: FsNode) => {
        const label =
            node.type === 'folder'
                ? `folder "${node.name}" and all its contents`
                : `file "${node.name}"`;
        if (!confirm(`Delete ${label}?`)) return;
        await api.deleteNode(node.id);
        setNodes((prev) => prev.filter((n) => n.id !== node.id));
    };

    const handleSearchSelect = async (result: FsNode) => {
        setShowDropdown(false);
        setSearchQuery('');
        const ancestors = await api.getAncestors(result.id);
        setBreadcrumbs(ancestors);
    };

    // ─── Breadcrumb label helpers ─────────────────────────────────────────────

    const crumbLabel = (idx: number): string => {
        if (idx === 0) return 'Home';
        return breadcrumbs[idx - 1].name;
    };

    // We render N+1 crumbs: [Home, ...breadcrumbs]
    // index 0 = Home (folderId=null), index k = breadcrumbs[k-1]
    const totalCrumbs = breadcrumbs.length + 1;

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <>
            <Head title="File System" />

            <div style={{ padding: '24px', maxWidth: '960px' }}>
                {/* ── Search ── */}
                <div
                    ref={searchContainerRef}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() =>
                                searchResults.length > 0 &&
                                setShowDropdown(true)
                            }
                            placeholder="Search files…"
                            style={s.searchInput}
                        />
                        {showDropdown && (
                            <div style={s.dropdown}>
                                {searchResults.length === 0 ? (
                                    <div style={s.dropdownEmpty}>
                                        No files found
                                    </div>
                                ) : (
                                    searchResults.map((r) => (
                                        <div
                                            key={r.id}
                                            onMouseDown={() =>
                                                handleSearchSelect(r)
                                            }
                                            style={s.dropdownItem}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background =
                                                    '#f0f0f0')
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background =
                                                    '')
                                            }
                                        >
                                            <span style={{ marginRight: 6 }}>
                                                📄
                                            </span>
                                            {r.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <label style={s.radioLabel}>
                        <input
                            type="radio"
                            name="scope"
                            checked={searchScope === 'all'}
                            onChange={() => setSearchScope('all')}
                        />
                        &nbsp;All files
                    </label>
                    <label style={s.radioLabel}>
                        <input
                            type="radio"
                            name="scope"
                            checked={searchScope === 'current'}
                            onChange={() => setSearchScope('current')}
                        />
                        &nbsp;Current folder
                    </label>
                </div>

                {/* ── Breadcrumbs ── */}
                <nav
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexWrap: 'wrap',
                        marginBottom: '16px',
                        fontSize: '14px',
                    }}
                >
                    {Array.from({ length: totalCrumbs }, (_, idx) => {
                        const isLast = idx === totalCrumbs - 1;
                        return (
                            <span
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                {idx > 0 && (
                                    <span style={{ color: '#aaa' }}>/</span>
                                )}
                                {isLast ? (
                                    <strong>{crumbLabel(idx)}</strong>
                                ) : (
                                    <button
                                        onClick={() =>
                                            navigateToBreadcrumb(
                                                idx === 0 ? 0 : idx,
                                            )
                                        }
                                        style={s.crumbBtn}
                                    >
                                        {crumbLabel(idx)}
                                    </button>
                                )}
                            </span>
                        );
                    })}
                </nav>

                {/* ── Toolbar ── */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px',
                    }}
                >
                    <button
                        onClick={() => openCreateForm('folder')}
                        style={s.btn}
                    >
                        ＋ New Folder
                    </button>
                    <button
                        onClick={() => openCreateForm('file')}
                        style={s.btn}
                    >
                        ＋ New File
                    </button>
                </div>

                {/* ── Create form ── */}
                {createType && (
                    <div style={s.createForm}>
                        <span
                            style={{
                                fontSize: '13px',
                                color: '#555',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            New {createType}:
                        </span>
                        <input
                            ref={createInputRef}
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') cancelCreate();
                            }}
                            placeholder={
                                createType === 'folder'
                                    ? 'Folder name'
                                    : 'File name'
                            }
                            style={{ ...s.input, flex: 1, maxWidth: 300 }}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={creating || !newName.trim()}
                            style={{
                                ...s.btnPrimary,
                                opacity: creating || !newName.trim() ? 0.5 : 1,
                            }}
                        >
                            Create
                        </button>
                        <button onClick={cancelCreate} style={s.btn}>
                            Cancel
                        </button>
                    </div>
                )}

                {/* ── File listing ── */}
                {loading ? (
                    <div
                        style={{
                            color: '#888',
                            fontSize: '14px',
                            padding: '24px 0',
                        }}
                    >
                        Loading…
                    </div>
                ) : error ? (
                    <div style={{ color: 'red', fontSize: '14px' }}>
                        Error: {error}
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr style={s.theadRow}>
                                <th style={{ ...s.th, width: '55%' }}>Name</th>
                                <th style={{ ...s.th, width: '15%' }}>Type</th>
                                <th style={{ ...s.th, width: '20%' }}>
                                    Created
                                </th>
                                <th style={{ ...s.th, width: '10%' }} />
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        style={{
                                            padding: '32px 12px',
                                            textAlign: 'center',
                                            color: '#aaa',
                                            fontSize: '14px',
                                        }}
                                    >
                                        This folder is empty
                                    </td>
                                </tr>
                            ) : (
                                nodes.map((node) => (
                                    <tr
                                        key={node.id}
                                        style={s.row}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                '#fafafa')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                '')
                                        }
                                    >
                                        <td style={s.td}>
                                            {node.type === 'folder' ? (
                                                <button
                                                    onClick={() =>
                                                        openFolder(node)
                                                    }
                                                    style={s.folderBtn}
                                                >
                                                    <span>📁</span>
                                                    <span
                                                        style={{
                                                            color: '#1a6bcc',
                                                        }}
                                                    >
                                                        {node.name}
                                                    </span>
                                                </button>
                                            ) : (
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                    }}
                                                >
                                                    <span>📄</span>
                                                    <span>{node.name}</span>
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ ...s.td, color: '#777' }}>
                                            {node.type}
                                        </td>
                                        <td
                                            style={{
                                                ...s.td,
                                                color: '#aaa',
                                                fontSize: '12px',
                                            }}
                                        >
                                            {new Date(
                                                node.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td style={s.td}>
                                            <button
                                                onClick={() =>
                                                    handleDelete(node)
                                                }
                                                style={s.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

FileSystem.layout = {
    breadcrumbs: [{ title: 'File System', href: '/filesystem' }],
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
    searchInput: {
        padding: '7px 12px',
        width: 280,
        border: '1px solid #ccc',
        borderRadius: 4,
        fontSize: 14,
        outline: 'none',
    } as React.CSSProperties,

    dropdown: {
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        marginTop: 2,
        width: 280,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 50,
        maxHeight: 220,
        overflowY: 'auto' as const,
    },

    dropdownItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: 13,
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
    } as React.CSSProperties,

    dropdownEmpty: {
        padding: '10px 12px',
        fontSize: 13,
        color: '#aaa',
    } as React.CSSProperties,

    radioLabel: {
        fontSize: 13,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    } as React.CSSProperties,

    crumbBtn: {
        background: 'none',
        border: 'none',
        color: '#1a6bcc',
        cursor: 'pointer',
        padding: 0,
        fontSize: 14,
        fontFamily: 'inherit',
    } as React.CSSProperties,

    btn: {
        padding: '6px 14px',
        border: '1px solid #ccc',
        borderRadius: 4,
        background: '#f8f8f8',
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'inherit',
    } as React.CSSProperties,

    btnPrimary: {
        padding: '6px 14px',
        border: 'none',
        borderRadius: 4,
        background: '#1a6bcc',
        color: '#fff',
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'inherit',
    } as React.CSSProperties,

    input: {
        padding: '6px 10px',
        border: '1px solid #ccc',
        borderRadius: 4,
        fontSize: 13,
        fontFamily: 'inherit',
        outline: 'none',
    } as React.CSSProperties,

    createForm: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        border: '1px solid #e0e0e0',
        borderRadius: 4,
        background: '#fafafa',
        marginBottom: 16,
        flexWrap: 'wrap' as const,
    } as React.CSSProperties,

    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: 14,
    } as React.CSSProperties,

    theadRow: {
        borderBottom: '2px solid #e8e8e8',
    } as React.CSSProperties,

    th: {
        padding: '8px 12px',
        fontWeight: 600,
        color: '#555',
        textAlign: 'left' as const,
    } as React.CSSProperties,

    td: {
        padding: '8px 12px',
    } as React.CSSProperties,

    row: {
        borderBottom: '1px solid #f0f0f0',
    } as React.CSSProperties,

    folderBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'inherit',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    } as React.CSSProperties,

    deleteBtn: {
        background: 'none',
        border: '1px solid #e04040',
        borderRadius: 3,
        color: '#e04040',
        cursor: 'pointer',
        padding: '2px 8px',
        fontSize: 12,
        fontFamily: 'inherit',
    } as React.CSSProperties,
};
