import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Colors,
  Divider,
  ITreeNode,
  Spinner,
  Tree,
  TreeEventHandler,
  TreeNode,
  IBreadcrumbProps,
  Breadcrumbs,
  Breadcrumb,
  Icon,
  Navbar,
  NavbarHeading,
  Alignment,
  NavbarDivider,
  Classes,
  Card,
  NavbarGroup,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ICON_STANDARD } from '@blueprintjs/core/lib/esm/common/classes';
import { DateTime } from 'luxon';

import GridLayout from 'react-grid-layout';
import { useTable } from 'react-table';
import CategoryMember from '../category-member';
import CategoryMembersTable from './CategoryMembersTable';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { remote, dialog } = require('electron');
const { Menu, MenuItem } = remote;

const layout = [
  { i: 'a', x: 0, y: 0, w: 3, h: 2 },
  { i: 'b', x: 3, y: 0, w: 9, h: 2, minW: 2, maxW: 9 },
];

const BREADCRUMBS: IBreadcrumbProps[] = [
  { href: '/users', icon: 'folder-close', text: 'Users' },
  { href: '/users/janet', icon: 'folder-close', text: 'Janet' },
  { icon: 'document', text: 'image.jpg' },
];

function updateNodes(
  nodes: ITreeNode<CategoryMember>[],
  updatedNode: ITreeNode<CategoryMember>,
): any {
  const index = nodes.findIndex(x => x.id === updatedNode.id);
  //console.log(index, nodes, updatedNode);

  if (index !== -1) {
    return [...nodes.slice(0, index), updatedNode, ...nodes.slice(index + 1)];
  } else {
    return (
      nodes
        .filter(({ childNodes }) => childNodes?.length)
        // @ts-ignore
        .map(node => ({ ...node, childNodes: updateNodes(node.childNodes, updatedNode) }))
    );
  }
}

const CategoryTree: React.FC = () => {
  const [getCategoryMembers, { data, loading, called }] = useLazyQuery(
    gql`
      query categoryMembers($params: any!) {
        query(params: $params)
          @rest(
            type: "Response"
            path: "/?{args.params}&format=json&formatversion=2"
            endpoint: "ru"
          ) {
          query @type(name: "Query") {
            categorymembers
          }
        }
      }
    `,
  );

  const [expandedNode, setExpandedNode] = useState<ITreeNode<CategoryMember> | null>(
    null,
  );
  const [nodes, setNodes] = useState<ITreeNode<CategoryMember>[]>([
    {
      id: 11732,
      icon: IconNames.FOLDER_CLOSE,
      label: 'Камбоджа',
      hasCaret: true,
      nodeData: {
        pageid: 11732,
        title: '',
        type: 'subcat',
        ns: 1,
      },
    },
  ]);

  useEffect(() => {
    if (!!expandedNode) {
      const expandedIndex = nodes.findIndex(({ id }) => id === expandedNode.id);
      //const updatedNodes = nodes.splice(expandedIndex, 1, 1111);
      //console.log('updatedNodes', updatedNodes);
      //console.log({ data });
      // setNodes([
      //   ...nodes.slice(0, expandedIndex),
      //   {
      //     ...expandedNode,
      //     disabled: true,
      //   },
      //   ...nodes.slice(expandedIndex + 1),
      // ]);

      if (data) {
        const updatedNodes = updateNodes(nodes, {
          ...expandedNode,
          icon: !expandedNode.isExpanded ? IconNames.FOLDER_OPEN : IconNames.FOLDER_CLOSE,
          isExpanded: !expandedNode.isExpanded,
          childNodes: data.query.query.categorymembers.map(
            (cm: CategoryMember): ITreeNode => ({
              id: cm.pageid,
              label: cm.title,
              nodeData: cm,
              icon: cm.type === 'subcat' ? IconNames.FOLDER_CLOSE : IconNames.DOCUMENT,
              hasCaret: cm.type === 'subcat',
            }),
          ),
        });
        //console.log('updatedNodes', JSON.stringify(updatedNodes));
        setNodes(updatedNodes);
      }
    }
  }, [expandedNode, data]);

  const handleNodeExpand: TreeEventHandler<CategoryMember> = React.useCallback(
    (node, nodePath, e) => {
      if (node.nodeData?.type === 'subcat') {
        setExpandedNode(node);
        getCategoryMembers({
          variables: {
            params: {
              action: 'query',
              list: 'categorymembers',
              cmpageid: node.id,
              cmprop: 'ids|title|sortkey|sortkeyprefix|type|timestamp',
              cmlimit: 'max',
            },
          },
        });
      }
    },
    [],
  );

  const handleNodeCollapse: TreeEventHandler<CategoryMember> = React.useCallback(
    (node, nodePath, e) => {
      if (node.nodeData?.type === 'subcat') {
        setExpandedNode(node);
      }
    },
    [],
  );

  const handleNodeClick: TreeEventHandler<CategoryMember> = React.useCallback(
    (node, nodePath, e) => {
      console.log({ e });
      // console.log(
      //   remote.dialog.showMessageBox({
      //     message: 'rewrwerwer',
      //     type: 'question',
      //     title: 'sdsds',
      //   }),
      // );
      // console.log(node);
      // setNodes(updateNodes(nodes, { ...node, isSelected: !node.isSelected }));
    },
    [],
  );

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'MenuItem1',
      sublabel: 'ddddd',
      enabled: false,
      click() {
        console.log('item 1 clicked');
      },
    }),
  );
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

  window.addEventListener(
    'contextmenu',
    e => {
      e.preventDefault();
      menu.popup({ window: remote.getCurrentWindow() });
    },
    false,
  );

  return (
    <>
      {/*<Breadcrumbs*/}
      {/*  currentBreadcrumbRenderer={({ text, ...restProps }: IBreadcrumbProps) => {*/}
      {/*    // customize rendering of last breadcrumb*/}
      {/*    return <Breadcrumb {...restProps}>{text} <Icon icon="star" /></Breadcrumb>;*/}
      {/*  }}*/}
      {/*  items={BREADCRUMBS}*/}
      {/*/>*/}
      {/*<ButtonGroup minimal={true}>*/}
      {/*  <Button icon={IconNames.COG} rightIcon="caret-down" small />*/}
      {/*  <Button icon={IconNames.EYE_OPEN} />*/}
      {/*</ButtonGroup>*/}
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Button icon="chevron-left" />
          <Button icon="chevron-right" />
        </NavbarGroup>
      </Navbar>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="a">
          <div
            style={{
              backgroundColor: Colors.BLACK,
              height: '100%',
              position: 'relative',
              width: '300px',
            }}
          >
            <div
              style={{
                overflowY: 'scroll',
                overflowX: 'auto',
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            >
              <Tree
                contents={nodes}
                onNodeClick={handleNodeClick}
                onNodeExpand={handleNodeExpand}
                onNodeCollapse={handleNodeCollapse}
              />
            </div>
          </div>
        </div>
        <div key="b">
          <ButtonGroup minimal>
            <Button icon={IconNames.LIST} />
            <Button icon={IconNames.LIST_COLUMNS} />
          </ButtonGroup>
          <CategoryMembersTable data={data?.query?.query?.categorymembers || []} />
        </div>
      </GridLayout>
    </>
  );
};

export default CategoryTree;
