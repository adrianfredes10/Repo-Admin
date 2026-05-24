export type RolCodigo = "ADMIN" | "STOCK" | "PEDIDOS" | "CLIENT";

export interface Rol {
  id: number;
  codigo: RolCodigo;
  nombre: string;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  activo: boolean;
  roles: Rol[];
}
