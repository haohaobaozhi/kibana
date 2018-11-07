/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { GraphQLResolveInfo } from 'graphql';
import { FrameworkRequest, internalFrameworkRequest } from '../../lib/framework';
import { Sources, SourcesAdapter } from '../../lib/sources';
import { createSourcesResolvers, SourcesResolversDeps } from './resolvers';
import { mockSourceData } from './source.mock';

const mockGetAll = jest.fn();
mockGetAll.mockResolvedValue({
  default: {
    ...mockSourceData.configuration,
  },
});
const mockSourcesAdapter: SourcesAdapter = {
  getAll: mockGetAll,
};
const mockLibs: SourcesResolversDeps = {
  sources: new Sources(mockSourcesAdapter),
};

const req: FrameworkRequest = {
  [internalFrameworkRequest]: {
    params: {},
    query: {},
    payload: {
      operationName: 'test',
    },
  },
  params: {},
  query: {},
  payload: {
    operationName: 'test',
  },
};

const context = { req };

describe('Test Source Resolvers', () => {
  test(`Make sure that getConfiguration have been called`, async () => {
    const data = await createSourcesResolvers(mockLibs).Query.source(
      null,
      { id: 'default' },
      context,
      {} as GraphQLResolveInfo
    );
    expect(mockSourcesAdapter.getAll).toHaveBeenCalled();
    expect(data).toEqual(mockSourceData);
  });
});