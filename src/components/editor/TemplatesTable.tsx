import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTable } from 'react-table';
import CategoryMember from '../category-member';
import { DateTime } from 'luxon';
import classNames from 'classnames';
import { Classes } from '@blueprintjs/core';

const TemplatesTable: React.FC<any> = () => {
  const { data } = useQuery(
    gql`
      query($params: any!) {
        query(params: $params)
          @rest(
            type: "Response"
            path: "/?{args.params}&format=json&formatversion=2"
            endpoint: "ru"
          ) {
          query
        }
      }
    `,
    {
      variables: {
        params: {
          action: 'query',
          titles: 'Музыка Камбоджи',
          prop: 'templates',
        },
      },
    },
  );
  console.log('templates', data);
  const { getTableProps, headerGroups, rows, prepareRow } = useTable<CategoryMember>({
    columns: [
      {
        Header: 'Название',
        accessor: 'title',
      },
    ],
    data: data?.query?.query?.pages[0]?.templates || [],
  });
  return (
    <>
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
    </>
  );
};

export default TemplatesTable;
