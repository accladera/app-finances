import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';


// import numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
// import calendarData from 'cldr-data/main/es-BO/ca-gregorian.json';
// import enNumberData from 'cldr-data/main/es-BO/numbers.json';
// import enTimeZoneData from 'cldr-data/main/es-BO/timeZoneNames.json';
// import weekData from 'cldr-data/supplemental/weekData.json';
//
// loadCldr(enNumberData, enTimeZoneData, numberingSystems, calendarData, weekData);
// setCulture('es-BO');
declare var require: any;

// loadCldr(
//   require('cldr-data/supplemental/numberingSystems.json'),
//   require('cldr-data/main/es-BO/ca-gregorian.json'),
//   require('cldr-data/main/es-BO/numbers.json'),
//   require('cldr-data/main/es-BO/timeZoneNames.json'),
// require('cldr-data/supplemental/weekData.json' )
//
// );
// setCulture('es-BO');


// setCulture('es-BO');
// L10n.load({
//   'es-BO': {
//
//   }
// });


export function setLocalization(): void {
  // loadCldr(enNumberData, enTimeZoneData, numberingSystems, calendarData, weekData);
  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/es-BO/ca-gregorian.json'),
    require('cldr-data/main/es-BO/numbers.json'),
    require('cldr-data/main/es-BO/timeZoneNames.json'),
    require('cldr-data/supplemental/weekData.json')
  );

  setCulture('es-BO');
  L10n.load({
    'es-BO': {
      'dropdowns': {
        noRecordsTemplate: 'No hay opciones coincidentes.',
        actionFailureTemplate: 'Está ocurriendo un fallo.'
      },
      'datepicker': {
        placeholder: 'Selecciona una fecha.',
        today: 'Hoy'
      },
      'daterangepicker': {
        placeholder: 'Rango de fechas.',
        today: 'Hoy',
        startLabel: 'Desde',
        endLabel: 'Hasta',
        applyText: 'Aplicar',
        cancelText: 'Cancelar',
        selectedDays: 'Días seleccionados',
        days: 'Días',
        customRange: 'Rango de fechas'
      },
      'dialog': {
        close: 'Cerrar',
        Close: 'Cerrar'
      },
      'grid': {
        EmptyRecord: 'No tienes items disponibles.',
        'PagerInfo': '{0} de {1} página ({2} ítems)',
        True: 'Verdadero',
        False: 'Falso',
        InvalidFilterMessage: 'Datos del filtro no válidos',
        FilterbarTitle: 'Barra de filtro',
        EmptyDataSourceError: 'La fuente de datos no  debería estar vacía.',
        Add: 'Agregar',
        Edit: 'Editar',
        Cancel: 'Cancelar',
        Update: 'Actualizar',
        Delete: 'Eliminar',
        Print: 'Imprimir',
        Pdfexport: 'Exportar en un archivo PDF',
        Excelexport: 'Exportar en Excel',
        Wordexport: 'Exportar  Word',
        Csvexport: 'Exportar  CSV',
        Search: 'Buscar',
        Columnchooser: 'Columnas',
        Save: 'Guardar',
        Item: 'Ítem',
        Items: 'Ítems',
        EditOperationAlert: 'No se seleccionó un registro para la edición',
        DeleteOperationAlert: 'No se seleccionó un registro para eliminar',
        SaveButton: 'Guardar',
        OKButton: 'Confirmar',
        CancelButton: 'Cancelar',
        EditFormTitle: 'Detalles',
        AddFormTitle: 'Agregar nuevo registro',
        BatchSaveConfirm: '¿Estás seguro de guardar los cambios?',
        BatchSaveLostChanges: '¿Estás seguro de descartar los cambios?',
        ConfirmDelete: '¿Estás seguro de eliminar el registro?',
        CancelEdit: '¿Estás seguro de descartar los cambios?',
        ChooseColumns: 'Escoge una columna',
        SearchColumns: 'Buscar columnas',
        Matchs: 'No se encontraron resultados.',
        FilterButton: 'Filtrar',
        ClearButton: 'Limpiar',
        StartsWith: 'Comienza con',
        NotStartsWith: 'No comienza con',
        EndsWith: 'Termina con',
        NotEndsWith: 'No termina con',
        Contains: 'Contiene',
        NotContains: 'No contiene',
        Equal: 'Igual a',
        NotEqual: 'No es igual a',
        LessThan: 'Menor que',
        LessThanOrEqual: 'Menor o igual a ',
        GreaterThan: 'Mayor que',
        GreaterThanOrEqual: 'Mayor o igual que',
        ChooseDate: 'Seleccioná una fecha',
        EnterValue: 'Ingresa un valor',
        Copy: 'Copiar',
        Group: 'Agrupar por esta columna',
        Ungroup: 'Desagrupar por esta columna',
        autoFitAll: 'Autoajustar todas las columnas',
        autoFit: 'Autoajustar esta columna',
        Export: 'Exportar',
        FirstPage: 'Primer página',
        LastPage: 'Última página',
        PreviousPage: 'Página previa',
        NextPage: 'Siguiente página',
        SortAscending: 'Ordenar Ascendentemente',
        SortDescending: 'Ordenar Descendentemente',
        EditRecord: 'Editar registro',
        DeleteRecord: 'Eliminar registro',
        FilterMenu: 'Filtro',
        SelectAll: 'Seleccionar todos',
        Blanks: 'Vacíos',
        FilterTrue: 'Verdadero',
        FilterFalse: 'Falso',
        NoResult: 'No se encontraron resultados.',
        ClearFilter: 'Limpiar filtros',
        NumberFilter: 'Filtro numérico',
        TextFilter: 'Filtro de texto',
        DateFilter: 'Filtro de fechas',
        MatchCase: 'Coincidencia',
        Between: 'Entre',
        CustomFilter: 'Filtro personalizados',
        CustomFilterPlaceHolder: 'Ingrese el valor',
        CustomFilterDatePlaceHolder: 'Escoge una fecha',
        AND: 'y',
        OR: 'o',
        ShowRowsWhere: 'Mostrar filas donde ',
        currentPageInfo: '{0} de {1} páginas',
        totalItemsInfo: '({0} ítems)',
        totalItemInfo: '({0} ítem)',
        firstPageTooltip: 'Ir a la primera página',
        lastPageTooltip: 'Ir a la última página',
        nextPageTooltip: 'Ir a la siguiente página',
        previousPageTooltip: 'Ir a la página anterior',
        pagerDropDown: 'Ítems por página',
        pagerAllDropDown: 'Ítems',
        All: 'Todo',
        IsEmpty: 'Vacío',
        IsNull: 'Nulo',
        NotNull: 'No es nulo'
      },
      'pager': {
        'currentPageInfo': '{0} de {1} páginas',
        'totalItemsInfo': '({0} ítems)',
        'firstPageTooltip': 'Ir a la primera página',
        'lastPageTooltip': 'Ir a la última página',
        'nextPageTooltip': 'Ir a la siguiente página',
        'previousPageTooltip': 'Ir a la página anterior'
      },
      'uploader': {
        'invalidMinFileSize': 'El archivo no cumple con el tamaño mínimo establecido.',
        'invalidMaxFileSize': 'El archivo no cumple con el tamaño máximo establecido.',
        'invalidFileType': 'El tipo de formato del archivo es inválido.',
        'Browse': 'Buscar',
        'Clear': 'Limpiar',
        'Upload': 'Subir',
        'dropFilesHint': 'Arrastra un archivo.',
        'uploadFailedMessage': 'Hubo un fallo en subir el archivo.',
        'uploadSuccessMessage': 'El archivo se subió exitosamente.',
        'removedSuccessMessage': 'Fichier supprimé avec succès',
        'removedFailedMessage': 'El archivo se removió exitosamente',
        'inProgress': 'El archivo se está procesando.',
        'readyToUploadMessage': 'Sube un archivo.',
        'remove': 'Remover',
        'cancel': 'Cancelar',
        'delete': 'Suprimir archivo'
      }
    }
  });
}
