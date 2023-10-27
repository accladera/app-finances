export interface Movimiento {
  id: string;
  tipo: number;
  monto: number;
  fecha: Date;
  descripcion: string;
  cuentaId: string; //GUID
  categoriaId: string; //GUID
  usuarioId: string; //GUID
  movimientoRefId: string| null; //GUID
  cuenta: string,
  categoria: string
}
