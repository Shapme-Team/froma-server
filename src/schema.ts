import { makeSchema } from 'nexus'
// import  * as AllSchemas from './schema/schemaTypes';
import * as allqueries from './schema/index'

// import { DateTimeResolver } from 'graphql-scalars'
// import { Context } from './context'

export const schema = makeSchema({
  types: [allqueries],

  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
