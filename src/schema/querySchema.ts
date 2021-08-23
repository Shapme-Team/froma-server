// import { extendType, queryField } from 'nexus'
// import { context } from '../context'
// import { User } from 'nexus-prisma'
// import { extendSchema } from 'graphql'

// export const querySchemaModel = extendType({
//   type: 'Query',
//   definition(t) {
//     t.field('getUsers', {
//       type: User.$name,
//       resolve: (parent, arg, ctx) => {
//         return ctx.prisma.user.findMany()
//       },
//     })
//   },
// })

// export const getUserDataQuery = queryField('getUsers', {
//   type: User.$name,
//   resolve: (parent, arg, ctx) => {
//     return ctx.prisma.user.findMany()
//   },
// })
