export interface MovimientosFilter {
  usuarioId: string;
  fromDate: Date | null;
  toDate: Date | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  cuentaId: string| null;
  categoriaId: string| null;

}
