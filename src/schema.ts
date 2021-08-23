import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  queryType,
  interfaceType,
} from 'nexus'
import  * as AllSchemas from './schema/schemaTypes';
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

export const schema = makeSchema({
  types: [AllSchemas],

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
