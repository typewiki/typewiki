import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react';

const Diff: React.FC<any> = ({ fromRev, toRev }) => {
  const { data } = useQuery(
    gql`
      query($params: any!) {
        query(params: $params)
          @rest(
            type: "Response"
            path: "/?{args.params}&format=json&formatversion=2"
            endpoint: "ru"
          ) {
          compare @type(name: "Compare") {
            body
          }
        }
      }
    `,
    {
      variables: {
        params: {
          action: 'compare',
          fromrev: fromRev,
          torev: toRev,
        },
      },
    },
  );
  console.log(data);
  if (data && data.query.compare) {
    console.log(data.query.compare.body);
    return (
      <table
        style={{ border: 'none' }}
        dangerouslySetInnerHTML={{ __html: data.query.compare.body }}
      />
    );
  }
  return null;
};

export default Diff;
