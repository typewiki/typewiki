import React from 'react';
import { Classes, Icon } from '@blueprintjs/core';
import classNames from 'classnames';
import { useTable } from 'react-table';
import { IconNames } from '@blueprintjs/icons';
import { DateTime } from 'luxon';
import CategoryMember from '../category-member';

const CategoryMembersTable: React.FC<{ data: any[] }> = ({ data }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable<CategoryMember>({
    columns: [
      {
        Header: 'name',
        accessor: 'title',
        Cell: ({ cell: { value }, row }) => {
          console.log(1111, row.original.type);
          let icon;
          switch (row.original.type) {
            case 'subcat':
              icon = IconNames.FOLDER_CLOSE;
              break;
            case 'page':
              icon = IconNames.DOCUMENT;
              break;
            case 'file':
              icon = IconNames.DOWNLOAD;
              break;
          }

          return (
            <span>
              <Icon
                // @ts-ignore
                icon={icon}
                style={{ marginRight: 3 }}
              />{' '}
              {value}
            </span>
          );
        },
      },
      {
        Header: 'Тип',
        accessor: 'type',
        Cell: ({ cell: { value }, row }: any) => {
          switch (value) {
            case 'subcat':
              return 'Подкатегория';
            case 'page':
              return 'Страница';
            case 'file':
              return 'Файл';
            default:
              return 'Неизвестно';
          }
        },
      },
      {
        Header: 'Дата',
        accessor: 'timestamp',
        Cell: ({ cell: { value } }) =>
          DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED),
      },
    ],
    data,
    getRowId: (originalRow: CategoryMember) => `${originalRow.pageid}`,
  });
  return (
    <table
      style={{ width: '100%' }}
      className={classNames([
        Classes.HTML_TABLE,
        Classes.HTML_TABLE_CONDENSED,
        Classes.HTML_TABLE_BORDERED,
        Classes.HTML_TABLE_STRIPED,
        Classes.INTERACTIVE,
      ])}
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row: any, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CategoryMembersTable;
