import OrderTabs from '@/Components/Cabinet/OrderTabs';
import CabinetLayout from '@/Layouts/CabinetLayout';
import {
    Background,
    Controls,
    MarkerType,
    MiniMap,
    ReactFlow,
    type Edge,
    type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Head, router } from '@inertiajs/react';
import { useMemo } from 'react';

/*
 * TODO(cabinet-stages): для клиента — «текущий шаг / что согласовать» рядом с графом.
 * docs/CABINET_UX.md#stages-clarity--cabinet-stages
 */

type Stage = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    position: { x: number; y: number };
};

export default function OrderStages({
    order,
    stages,
    edges,
    can_approve_stages,
}: {
    order: { id: number; title: string; stages_approved_at: string | null };
    stages: Stage[];
    edges: { id: string; source: string; target: string }[];
    can_approve_stages: boolean;
}) {
    const nodes: Node[] = useMemo(
        () =>
            stages.map((stage, index) => ({
                id: stage.id,
                position: {
                    x: stage.position.x || index * 220,
                    y: stage.position.y || 80,
                },
                data: {
                    label: `${stage.title}\n(${stage.status})`,
                },
                style: {
                    border:
                        stage.status === 'completed'
                            ? '2px solid #16a34a'
                            : stage.status === 'in_progress'
                              ? '2px solid #2563eb'
                              : '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 12,
                    whiteSpace: 'pre-line',
                    background: '#fff',
                    width: 180,
                },
            })),
        [stages],
    );

    const flowEdges: Edge[] = useMemo(
        () =>
            edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                markerEnd: { type: MarkerType.ArrowClosed },
            })),
        [edges],
    );

    return (
        <CabinetLayout header={<h2 className="text-xl font-semibold">{order.title} — этапы</h2>}>
            <Head title={`Этапы · ${order.title}`} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <OrderTabs orderId={order.id} active="stages" />

                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">
                        {order.stages_approved_at
                            ? 'Схема этапов согласована клиентом.'
                            : 'Схема ожидает согласования клиента.'}
                    </p>
                    {can_approve_stages && !order.stages_approved_at && (
                        <button
                            type="button"
                            className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                            onClick={() =>
                                router.post(route('cabinet.orders.approve-stages', order.id))
                            }
                        >
                            Согласовать этапы
                        </button>
                    )}
                </div>

                <div className="h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <ReactFlow nodes={nodes} edges={flowEdges} fitView nodesDraggable={false}>
                        <Background />
                        <MiniMap />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </CabinetLayout>
    );
}
