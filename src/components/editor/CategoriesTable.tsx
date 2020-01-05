import React from 'react';
import { useTable } from 'react-table';
import CategoryMember from '../category-member';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { Card, Classes, Elevation, Tag, TagInput } from '@blueprintjs/core';
import { DateTime } from 'luxon';
import { IconNames } from '@blueprintjs/icons';

const CategoriesTable: React.FC<{ data: any[] }> = ({}) => {
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
          prop: 'categories',
          clprop: 'sortkey|timestamp|hidden',
        },
      },
    },
  );
  console.log(data);
  const { getTableProps, headerGroups, rows, prepareRow } = useTable<CategoryMember>({
    columns: [
      {
        Header: 'Название',
        accessor: 'title',
      },
      {
        Header: 'Дата',
        accessor: 'timestamp',
        Cell: ({ cell: { value } }) =>
          DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED),
      },
    ],
    data: data?.query?.query?.pages[0]?.categories || [],
  });
  const categories = data?.query?.query?.pages[0]?.categories || [];
  return (
    <>
      {/*<TagInput*/}
      {/*  leftIcon={IconNames.FOLDER_SHARED}*/}
      {/*  placeholder="Separate values with commas..."*/}
      {/*  values={[]}*/}
      {/*/>*/}
      {/*{categories.map((cat: any) => (*/}
      {/*  <Tag title={cat.title} minimal>*/}
      {/*    {cat.title}*/}
      {/*  </Tag>*/}
      {/*))}*/}
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

export default CategoriesTable;
