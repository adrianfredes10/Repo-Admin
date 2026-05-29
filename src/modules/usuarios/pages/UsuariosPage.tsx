import { useState } from 'react';
import { useUsuarios, useModificarRoles, useDesactivarUsuario, useRegistrarUsuario } from '../hooks/useUsuarios';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Toast } from '../../../components/ui/Toast';
import type { Usuario, RolCodigo } from '../types';

const ROLES_DISPONIBLES: { codigo: RolCodigo; label: string }[] = [
  { codigo: 'ADMIN', label: 'Admin' },
  { codigo: 'STOCK', label: 'Stock' },
  { codigo: 'PEDIDOS', label: 'Pedidos' },
  { codigo: 'CLIENT', label: 'Cliente' },
];

const FILTROS_ROL: { codigo: RolCodigo | ''; label: string }[] = [
  { codigo: '', label: 'Todos' },
  { codigo: 'ADMIN', label: 'Admin' },
  { codigo: 'STOCK', label: 'Stock' },
  { codigo: 'PEDIDOS', label: 'Pedidos' },
  { codigo: 'CLIENT', label: 'Clientes' },
];

const FORM_VACIO = { nombre: '', apellido: '', email: '', password: '', telefono: '' };

export const UsuariosPage = () => {
  const [rolFiltro, setRolFiltro] = useState<RolCodigo | ''>('');
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [confirmDesactivar, setConfirmDesactivar] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showCrear, setShowCrear] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);

  const { data: usuarios, isLoading, error } = useUsuarios(rolFiltro ? { rol: rolFiltro } : {});
  const modificarRoles = useModificarRoles();
  const desactivar = useDesactivarUsuario();
  const registrar = useRegistrarUsuario();

  const handleToggleRol = async (usuario: Usuario, rolCodigo: RolCodigo) => {
    const tieneRol = usuario.roles.some((r) => r.codigo === rolCodigo);
    try {
      if (tieneRol) {
        await modificarRoles.mutateAsync({ usuarioId: usuario.id, quitar: [rolCodigo] });
        setSelectedUsuario((prev) =>
          prev ? { ...prev, roles: prev.roles.filter((r) => r.codigo !== rolCodigo) } : null
        );
      } else {
        await modificarRoles.mutateAsync({ usuarioId: usuario.id, agregar: [rolCodigo] });
        setSelectedUsuario((prev) =>
          prev
            ? { ...prev, roles: [...prev.roles, { id: Date.now(), codigo: rolCodigo, nombre: rolCodigo }] }
            : null
        );
      }
      setToast({ message: `Rol ${rolCodigo} ${tieneRol ? 'quitado' : 'asignado'} correctamente`, type: 'success' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Error desconocido', type: 'error' });
    }
  };

  const handleDesactivar = async () => {
    if (!confirmDesactivar) return;
    try {
      await desactivar.mutateAsync(confirmDesactivar);
      setConfirmDesactivar(null);
      if (selectedUsuario?.id === confirmDesactivar) setSelectedUsuario(null);
      setToast({ message: 'Usuario desactivado', type: 'success' });
    } catch (err) {
      setConfirmDesactivar(null);
      setToast({ message: err instanceof Error ? err.message : 'Error desconocido', type: 'error' });
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registrar.mutateAsync({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        telefono: form.telefono || undefined,
      });
      setShowCrear(false);
      setForm(FORM_VACIO);
      setToast({ message: 'Usuario creado correctamente', type: 'success' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Error desconocido', type: 'error' });
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {usuarios ? `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''}` : 'Cargando...'}
          </p>
        </div>
        <button
          onClick={() => setShowCrear(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Crear usuario
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTROS_ROL.map(({ codigo, label }) => (
          <button
            key={codigo}
            onClick={() => setRolFiltro(codigo)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
              rolFiltro === codigo
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : usuarios && usuarios.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roles</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                        selectedUsuario?.id === usuario.id ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => setSelectedUsuario(usuario)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{usuario.nombre} {usuario.apellido}</p>
                        <p className="text-xs text-gray-400">{usuario.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {usuario.roles.map((r) => (
                            <span key={r.codigo} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                              {r.codigo}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${usuario.activo ? 'text-green-600' : 'text-red-500'}`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setSelectedUsuario(usuario)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            Roles
                          </button>
                          {usuario.activo && (
                            <button
                              onClick={() => setConfirmDesactivar(usuario.id)}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              Desactivar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500 font-medium">No hay usuarios</p>
            </div>
          )}
        </div>

        {selectedUsuario && (
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{selectedUsuario.nombre} {selectedUsuario.apellido}</p>
                  <p className="text-xs text-gray-400">{selectedUsuario.email}</p>
                </div>
                <button onClick={() => setSelectedUsuario(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Roles asignados</p>
              <div className="space-y-2">
                {ROLES_DISPONIBLES.map(({ codigo, label }) => {
                  const tieneRol = selectedUsuario.roles.some((r) => r.codigo === codigo);
                  const isPending = modificarRoles.isPending;
                  return (
                    <label
                      key={codigo}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        tieneRol ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <input
                        type="checkbox"
                        checked={tieneRol}
                        disabled={isPending}
                        onChange={() => handleToggleRol(selectedUsuario, codigo)}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                    </label>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </div>

      {showCrear && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Crear usuario</h2>
              <button onClick={() => { setShowCrear(false); setForm(FORM_VACIO); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    required
                    value={form.apellido}
                    onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pérez"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono <span className="text-gray-400">(opcional)</span></label>
                <input
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowCrear(false); setForm(FORM_VACIO); }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registrar.isPending}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {registrar.isPending ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDesactivar && (
        <ConfirmDialog
          message="¿Desactivar este usuario? Ya no podrá iniciar sesión."
          onConfirm={handleDesactivar}
          onCancel={() => setConfirmDesactivar(null)}
          isPending={desactivar.isPending}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
