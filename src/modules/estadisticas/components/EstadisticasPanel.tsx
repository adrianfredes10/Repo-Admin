import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEstadisticas } from '../hooks/useEstadisticas';
import type { ResumenResponse } from '../types';

// color por estado del pedido (para el PieChart)
const COLOR_ESTADO: Record<string, string> = {
  PENDIENTE: '#eab308',
  CONFIRMADO: '#2563eb',
  EN_PREP: '#f97316',
  ENTREGADO: '#10b981',
  CANCELADO: '#ef4444',
};

const money = (v: string | number) =>
  Number(v).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

// --- KPI cards ---

const KpiCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const KpiCards = ({ data }: { data: ResumenResponse }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard label="Ventas hoy" value={money(data.ventas_hoy)} color="text-blue-700" />
    <KpiCard label="Ticket promedio" value={money(data.ticket_promedio)} color="text-purple-700" />
    <KpiCard label="Pedidos activos" value={String(data.pedidos_activos)} color="text-orange-700" />
    <KpiCard label="Ventas del mes" value={money(data.ventas_mes)} color="text-emerald-700" />
  </div>
);

// --- contenedor de cada gráfico ---

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

const Vacio = () => (
  <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
    Sin datos para mostrar
  </div>
);

export const EstadisticasPanel = ({ enabled }: { enabled: boolean }) => {
  const { resumen, productosTop, pedidosPorEstado } = useEstadisticas({ enabled });

  if (!enabled) return null;

  const cargando = resumen.isLoading || productosTop.isLoading || pedidosPorEstado.isLoading;

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // datos casteados a número para los charts
  const dataTop = (productosTop.data ?? []).map((p) => ({
    nombre: p.nombre.length > 14 ? `${p.nombre.slice(0, 13)}…` : p.nombre,
    ingresos: Number(p.ingresos),
    cantidad: p.cantidad_vendida,
  }));
  const dataEstados = (pedidosPorEstado.data ?? []).map((e) => ({
    name: e.estado_codigo,
    value: e.cantidad,
  }));

  return (
    <div className="space-y-6">
      {resumen.data && <KpiCards data={resumen.data} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productos — BarChart */}
        <ChartCard title="Top productos por ingresos">
          {dataTop.length === 0 ? (
            <Vacio />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dataTop}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="nombre" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="ingresos" name="Ingresos $" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Distribución por estado — PieChart */}
        <ChartCard title="Pedidos por estado">
          {dataEstados.length === 0 ? (
            <Vacio />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={dataEstados} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {dataEstados.map((e) => (
                    <Cell key={e.name} fill={COLOR_ESTADO[e.name] ?? '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
};
