'use client';
import { trpc } from '@/trpc/client';
import { useState } from 'react';
import { ExecutionStatus } from "@/app/types";

export default function HistoryPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<ExecutionStatus | undefined>(undefined);

    const utils = trpc.useUtils();

    const {data: executions, isLoading} = trpc.execution.list.useQuery({
        status: statusFilter === ExecutionStatus.ALL ? undefined : statusFilter,
        limit: 10,
        offset: (page - 1) * 10,
    });

    const resolveMutation = trpc.execution.resolve.useMutation({
        onSuccess: () => {
            utils.execution.list.invalidate()
        },
    });

    const handleResolve = (id: string) => {
        resolveMutation.mutate({id});
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value as ExecutionStatus);
    };

    if (isLoading && !executions) return <div>Loading...</div>;

    return (
        <div>
            <h1>Execution History</h1>

            <div style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    style={{padding: '8px', fontSize: '1rem'}}
                >
                    {Object.values(ExecutionStatus).map(status => (
                        <option key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
            </div>

            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
                    <th>Timestamp</th>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {executions?.map((execution) => {
                    return (
                        <tr key={execution.id} style={{borderBottom: '1px solid #eee'}}>
                            <td>{new Date(execution.createdAt).toLocaleString()}</td>
                            <td>{execution.workflow.name}</td>
                            <td>
                  <span style={{
                      color: execution.status === 'OPEN' ? 'red' : 'green',
                      fontWeight: 'bold'
                  }}>
                    {execution.status}
                  </span>
                            </td>
                            <td>
                                {execution.status === 'OPEN' && (
                                    <button onClick={() => handleResolve(execution.id)}>Resolve</button>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {executions?.length === 0 && <p>No hay ejecuciones que coincidan con el filtro seleccionado.</p>}

            <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={(executions?.length || 0) < 10}>Next</button>
            </div>
        </div>
    );
}
