import './DeviationsTable.css';
import { useMemo } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type Deviation = {
  time: string;
  reason: string;
  duration: string;
  measures: string;
  status: 'В работе' | 'Завершено' | 'Отменено';
};

const data: Deviation[] = [
  {
    time: '12:15',
    reason: 'Отсутствие сырья на складе',
    duration: '15 мин',
    measures: 'Заказана экстренная поставка',
    status: 'В работе',
  },
  {
    time: '14:45',
    reason: 'Поломка оборудования №3',
    duration: '30 мин',
    measures: 'Ремонтная бригада на месте',
    status: 'В работе',
  },
  {
    time: '15:10',
    reason: 'Ошибка оператора',
    duration: '11 мин',
    measures: 'Проведён инструктаж',
    status: 'Завершено',
  },
];

export default function DeviationsTable() {
  const columns = useMemo<ColumnDef<Deviation>[]>(
    () => [
      {
        accessorKey: 'time',
        header: 'Время',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'reason',
        header: 'Причина',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'duration',
        header: 'Длительность',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'measures',
        header: 'Принятые меры',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        cell: info => {
          const status = info.getValue() as Deviation['status'];
          return (
            <span
              className={`deviations-table-status ${status === 'Завершено' ? 'deviations-table-status--completed' : status === 'В работе' 
                ? 'deviations-table-status--in-progress' : 'deviations-table-status--cancelled'}`}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='deviations-table-container'>
      <h2 className='deviations-table-container--header'>
        Последние отклонения
      </h2>

      <table className='deviations-table'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getRowModel().rows.length === 0 && (
        <div className='empty-deviations-table'>
          Нет данных об отклонениях
        </div>
      )}
    </div>
  );
}