import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, ButtonGroup, Classes, Divider, Tree } from '@blueprintjs/core';
import CategoriesTable from './CategoriesTable';
import TemplatesTable from './TemplatesTable';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';

function onChange(newValue: any) {
  console.log('change', newValue);
}

const Editor = () => {
  const { data } = useQuery(
    gql`
      query($params: any!) {
        query(params: $params)
          @rest(
            type: "Response"
            path: "/?{args.params}&format=json&formatversion=2"
            endpoint: "ru"
          ) {
          parse
        }
      }
    `,
    {
      variables: {
        params: {
          action: 'parse',
          page: 'Музыка Камбоджи',
          prop: 'wikitext',
        },
      },
    },
  );
  //console.log(data);
  return (
    <>
      {/*<CategoriesTable data={[]} />*/}
      {/*<TemplatesTable />*/}
      <Tree
        contents={[
          {
            id: 0,
            hasCaret: true,
            icon: 'add-to-folder',
            label: 'Категории',
          },
          {
            id: 0,
            hasCaret: true,
            icon: 'media',
            label: 'Изображения',
          },
          {
            id: 0,
            hasCaret: true,
            icon: 'cog',
            label: 'Шаблоны',
          },
        ]}
      />
      <ButtonGroup>
        <ButtonGroup>
          <Button icon={IconNames.BOLD} />
          <Button icon={IconNames.ITALIC} />
          <Button icon={IconNames.UNDERLINE} />
        </ButtonGroup>
        <Divider />
        <ButtonGroup>
          <Button>{'{{ }}'}</Button>
          <Button>{'[[ ]]'}</Button>
          <Button>{'[ ]'}</Button>
          <Button>{'[[|]]'}</Button>
          <Button>{'{{|}}'}</Button>
          <Button><span className={classNames([Classes.MONOSPACE_TEXT, Classes.TEXT_MUTED])}>{'{{DEFAULTSORT:}}'}</span></Button>
        </ButtonGroup>
      </ButtonGroup>

      <AceEditor
        mode="java"
        theme="github"
        onChange={onChange}
        value={data?.query?.parse?.wikitext}
        name="UNIQUE_ID_OF_DIV"
        width="100%"
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
};

export default Editor;
