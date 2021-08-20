import { extendType, mutationField } from 'nexus'
import { context } from '../context'
import { User } from 'nexus-prisma'

export const createUserMutation = mutationField('createUser', {
  type: 'User',

  resolve() {},
})

export const createMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args:{},
      resolve(parent, args, ctx) {
        ctx.prisma.user.create({
            data: args
        })
      },
    })
  },
})
