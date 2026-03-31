'use client';
import { trpc } from '@/trpc/client';
import { useState } from 'react';

export default function WorkflowsPage() {
    const utils = trpc.useUtils();
    const {data: workflows, isLoading, refetch} = trpc.workflow.list.useQuery({limit: undefined, offset: undefined});

    const executeWorkflowMutation = trpc.workflow.execute.useMutation({
        onSuccess: (data) => {
            alert(`Workflow triggered successfully! Execution ID: ${data.id}`);
            utils.execution.list.invalidate();
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const toggleMutation = trpc.workflow.toggle.useMutation({
        onSuccess: () => refetch(),
    });

    const snoozeMutation = trpc.workflow.snooze.useMutation({
        onSuccess: () => {
            utils.workflow.list.invalidate();
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    const [triggerValues, setTriggerValues] = useState<Record<string, number>>({});

    const handleTrigger = async (workflowId: string) => {
        const value = triggerValues[workflowId];
        if (value === undefined) return alert('Please enter a value');

        executeWorkflowMutation.mutate({
            workflowId,
            values: value,
        })
    };

    const handleSnooze = (id: string) => {
        const minutes = prompt('Enter snooze time in minutes:', '1');
        if (minutes) {
            snoozeMutation.mutate({id, minutes: parseInt(minutes, 10)});
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Workflows</h1>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
                {workflows?.map((w) => {
                    const arrayAttributes = w.attributes ? Object.keys(w.attributes) : [];
                    const isSnoozed = w.snoozedUntil && new Date(w.snoozedUntil) > new Date();
                    return (
                        <div key={w.id} style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            borderRadius: '8px',
                            opacity: w.active ? 1 : 0.6
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <h2>{w.name}</h2>
                                {isSnoozed && <span style={{
                                    background: '#ffd700',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                }}>Snoozed</span>}
                            </div>
                            <p><strong>Type:</strong> {w.type}</p>
                            <p><strong>Status:</strong> {w.active ? 'Active' : 'Inactive'}</p>
                            <p><strong>Attributes:</strong> {arrayAttributes.join(', ')}</p>

                            <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap'}}>
                                <button onClick={() => toggleMutation.mutate({id: w.id, active: !w.active})}>
                                    {w.active ? 'Deactivate' : 'Activate'}
                                </button>

                                {w.active && (
                                    <button onClick={() => handleSnooze(w.id)}>
                                        Snooze
                                    </button>
                                )}

                                <div style={{marginLeft: 'auto', display: 'flex', gap: '0.2rem'}}>
                                    <input
                                        type="number"
                                        placeholder="Value"
                                        style={{width: '60px'}}
                                        onChange={(e) => setTriggerValues({
                                            ...triggerValues,
                                            [w.id]: parseFloat(e.target.value)
                                        })}
                                    />
                                    <button onClick={() => handleTrigger(w.id)} disabled={!w.active}>Simulate</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
