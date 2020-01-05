import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { COUNTER } from 'components/Routes';
import { info } from 'electron-log';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Column, useExpanded, useTable } from 'react-table';
import {
  Alignment,
  Button,
  ButtonGroup,
  FocusStyleManager,
  Icon,
  Intent,
  Navbar,
  Popover,
  Menu,
  Position,
  MenuItem,
  MenuDivider,
  NonIdealState,
  Spinner, Colors,
} from '@blueprintjs/core';
import prettyBytes from 'pretty-bytes';
import { IconNames } from '@blueprintjs/icons';
import Diff from './Diff';

FocusStyleManager.onlyShowFocusOnTabs();

const Revisions = () => {
  useEffect(() => info('Rendering Revisions component'), []);
  const { t } = useTranslation();

  const { data } = useQuery(
    gql`
      query($params: any!) {
        query(params: $params)
          @rest(
            type: "Response"
            path: "/?{args.params}&format=json&formatversion=2"
            endpoint: "ru"
          ) {
          query @type(name: "Query") {
            pages @type(name: "Page") {
              pageid
              revisions @type(name: "Revision") {
                parsedcomment
                minor
                parentid
                revid
                size
                timestamp
                user
                userid
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        params: {
          action: 'query',
          titles: 'Камбоджа',
          prop: 'revisions',
          rvprop:
            'ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles',
          rvlimit: 'max',
          rvslots: '*',
        },

        // pathBuilder: (path: any) => {
        //   console.log('path', path);
        //   return path;
        // },
      },
    },
  );
  if (data && data.query) {
    console.log(data.query.query.pages[0].revisions);
  }

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }: any) => (
          // Use Cell to render an expander for each row.
          // We can use the getExpandedToggleProps prop-getter
          // to build the expander.
          <span {...row.getExpandedToggleProps()}>{row.isExpanded ? '👇' : '👉'}</span>
        ),
      },
      {
        Header: 'comment',
        accessor: 'parsedcomment',
        Cell: ({ cell: { value }, row }: any) => {
          console.log(1111, row);
          return (
            <span
              className="bp3-text-overflow-ellipsis"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          );
        },
      },
      {
        Header: 'user',
        accessor: 'user',
        Cell: ({ cell: { value }, row }: any) => {
          console.log(1111, row);
          return <a href="">{value}</a>;
        },
      },
      {
        Header: 'size',
        accessor: 'size',
        Cell: ({ cell: { value }, row }: any) => {
          console.log(1111, row);
          return prettyBytes(value, { locale: 'ru' });
        },
      },
      {
        Header: 'timestamp',
        accessor: 'timestamp',
      },
    ],
    [],
  );

  const { getTableProps, rows, prepareRow, headerGroups, flatColumns } = useTable(
    {
      data: data && data.query ? data.query.query.pages[0].revisions : [],
      columns,
      getRowId: (originalRow: any) => `${originalRow.revid}`,
    },
    useExpanded,
  );

  const renderRowSubComponent = React.useCallback(
    ({
      row: {
        original: { revid, parentid },
      },
    }) => {
      return <Diff fromRev={parentid} toRev={revid} />;
    },
    [],
  );

  if (!data) {
    return (
      <NonIdealState icon={<Spinner />} title="Загрузка" />
    );
  }

  return (
    <>
      <ButtonGroup minimal={true}>
        <Button text="File" />
        <Button text="Edit" />
        column-layout
        <Popover
          content={
            <Menu>
              <MenuItem text="Автор" />
              <MenuItem text="Дата" />
            </Menu>
          }
          position={Position.BOTTOM_LEFT}
        >
          <Icon
            icon={IconNames.GRAPH}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.PRIMARY}
          />
        </Popover>
      </ButtonGroup>
      <table
        className="bp3-html-table bp3-html-table-bordered bp3-interactive bp3-html-table-striped bp3-small"
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
              <React.Fragment {...row.getRowProps()}>
                <tr>
                  {row.cells.map((cell: any) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>

                {row.isExpanded ? (
                  <tr>
                    <td colSpan={flatColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Revisions;
