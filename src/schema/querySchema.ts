import { extendType, nonNull, queryField, stringArg } from 'nexus'
import { context } from '../context'
import { Cart, Category, Order, Product, Seller, SubCategory, User } from 'nexus-prisma'
import { extendSchema } from 'graphql'

export const getUsersQuery = extendType({
  type: 'Query',
  definition(t) {
    //* ---------------------------- SINGLE Query
      t.field('getUserByUserId',{
        type: User.$name,
        args: {
          userId: nonNull(stringArg())
        },
        resolve: (parent, args, ctx) => {
          return ctx.prisma.user.findFirst({
            where: {
              id: args.userId
            }
          })
        },
      })
      t.field('getOrderByOrderId', {
        type: Order.$name,
        args: {
          orderId: nonNull(stringArg()),
        },
  
        resolve: (parent, args, ctx) => {
          return ctx.prisma.order.findFirst({
            where: {
              id: args.orderId,
            }
          })
        },
      })
      t.field('getProductByProductId',{
        type: Product.$name,
        args: {
          productId: nonNull(stringArg())
        },
        resolve: (parent, args, ctx) => {
          return ctx.prisma.product.findFirst({
            where: {
              id: args.productId
            }
          })
        },
      })
      t.field('getCartByUserId',{
        type: Cart.$name,
        args: {
          userId: nonNull(stringArg())
        },
        resolve: (parent, args, ctx) => {
          return ctx.prisma.cart.findFirst({
            where: {
              userId: args.userId
            }
          })
        },
      })
      t.field('getSellerBySellerId',{
        type: Seller.$name,
        args: {
          sellerId: nonNull(stringArg())
        },
        resolve: (parent, args, ctx) => {
          return ctx.prisma.seller.findFirst({
            where: {
              id: args.sellerId
            }
          })
        },
      })




    //* ---------------------------- MULTI QUERIES
    //* ---------------------------- with conditions 



    t.list.field('getOrdersByUserId', {
      type: Order.$name,
      args: {
        userId: nonNull(stringArg())
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.order.findMany({
          where: {
            userId: args.userId 
          }
        })
      },
    })
    t.field('getProductsOfCart', {
      type: Cart.$name,
      args: {
        cartId: nonNull(stringArg()),
      },

      resolve: (parent, args, ctx) => {
        return ctx.prisma.cart.findFirst({
          where: {
            id: args.cartId,
          }
        })
      },
    })
    t.list.field('getProductOfSellerBySellerId', {
      type: Product.$name,
      args: {
        sellerId: nonNull(stringArg())
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.product.findMany({
          where: {
            sellerId: args.sellerId
          }
        })
      },
    })
    
    t.list.field('getProdutsByCategoryIds', {
      type: Product.$name,
      args: {
        categoryId: nonNull(stringArg())
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.product.findMany({
          where: {
            categoryId: args.categoryId
          }
        })
      },
    })
    t.list.field('getProdutsBySubCategoryId', {
      type: Product.$name,
      args: {
        subCategoryId: nonNull(stringArg())
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.product.findMany({
          where: {
            subCategoryId: args.subCategoryId
          }
        })
      },
    })
    t.list.field('getSubCategoriesByCategoryId', {
      type: SubCategory.$name,
      args: {
        categoryId: nonNull(stringArg())
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.subCategory.findMany({
          where: {
            categoryid: args.categoryId
          }
        })
      },
    })

//* ---------------------- without condition -------- 

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
    t.list.field('getAllCategory', {
      type: Category.$name,
      resolve: (parent, arg, ctx) => {
        return ctx.prisma.category.findMany()
      },
    })
    
  },
})
