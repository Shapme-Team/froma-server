import { extendType, queryField } from 'nexus'
import { context } from '../context'
import { Category, Product, Seller, User } from 'nexus-prisma'
import { extendSchema } from 'graphql'


export const getUsersQuery = extendType({
    type: 'Query',
    definition(t) {
      t.list.field('getAllUsers', {
        type: User.$name,
        resolve: (parent, args, ctx) => {
          return ctx.prisma.user.findMany()
        },
      })
      t.list.field('getAllSellers', {
        type: Seller.$name,
        resolve: (parent, args, ctx) => {
          return ctx.prisma.seller.findMany()
        },
      })
      t.list.field('getAllProducts', {
        type: Product.$name,
        resolve: (parent, args, ctx) => {
          return ctx.prisma.product.findMany()
        },
      })
      t.list.field('getAllCategory',{
          type: Category.$name,
          resolve: (parent,arg,ctx) => {
              return ctx.prisma.category.findMany()
          }
      })
    },
  })
  