import React, { useEffect, useState } from 'react';
import { ITreeNode, Spinner, Tree, TreeEventHandler, TreeNode } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ICON_STANDARD } from '@blueprintjs/core/lib/esm/common/classes';

interface CategoryMember {
  pageid: number;
  ns: number;
  title: string;
  type: string;
}

function updateNodes(
  nodes: ITreeNode<CategoryMember>[],
  updatedNode: ITreeNode<CategoryMember>,
): any {
  const index = nodes.findIndex(x => x.id === updatedNode.id);
  console.log(index, nodes, updatedNode);

  if (index !== -1) {
    return [...nodes.slice(0, index), updatedNode, ...nodes.slice(index + 1)];
  } else {
    return nodes.map(node =>
      node.childNodes
        ? { ...node, childNodes: updateNodes(node.childNodes, updatedNode) }
        : node,
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

  // const ddd = data.query.query.categorymembers.map(
  //   (cm: any): ITreeNode => ({
  //     id: cm.pageid,
  //     nodeData: cm,
  //     label: cm.title,
  //     icon: cm.type === 'subcat' ? IconNames.FOLDER_CLOSE : IconNames.DOCUMENT,
  //     hasCaret: cm.type === 'subcat',
  //   }),
  // );

  useEffect(() => {
    if (!!expandedNode) {
      console.log(expandedNode, data);
      const expandedIndex = nodes.findIndex(({ id }) => id === expandedNode.id);
      //const updatedNodes = nodes.splice(expandedIndex, 1, 1111);
      //console.log('updatedNodes', updatedNodes);
      console.log({ data });
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
        console.log('updatedNodes', JSON.stringify(updatedNodes));
        setNodes(updatedNodes);
      }
    }
  }, [expandedNode, data]);

  const handleNodeClick: TreeEventHandler<CategoryMember> = React.useCallback(
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

  return (
    <>
      <Tree
        contents={nodes}
        onNodeClick={handleNodeClick}
        onNodeExpand={(node, nodePath, e) => {
          console.log(11111);
        }}
      />
    </>
  );
};

export default CategoryTree;
