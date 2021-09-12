import { extendType, nonNull, stringArg } from 'nexus'
import {
  Address,
  Cart,
  Category,
  Product,
  SubCategory,
  User,
} from 'nexus-prisma'

export const deleteMutation = extendType({
  type: 'Mutation',
  
  definition(t) {
    t.field('deleteUserAddress', {
      type: Address.$name,
      args: {
        addressId: nonNull(stringArg()),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.address.delete({
          where: {
            id: args.addressId,
          },
        })
      },
    }),

      t.field('deleteUser', {
        type: User.$name,
        args: {
          userId: nonNull(stringArg()),
        },
        resolve: (parent, args, ctx) => {
          return ctx.prisma.user.delete({
            where: {
              id: args.userId,
            },
          })
        },
      })
    t.field('deleteCartProduct', {
      type: Cart.$name,
      args: {
        cartProudctId: nonNull(stringArg()),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.cartProduct.delete({
          where: {
            id: args.cartProudctId,
          },
        })
      },
    })
    t.field('deleteSubCategory', {
      type: SubCategory.$name,
      args: {
        subCategoryId: nonNull(stringArg()),
      },
      resolve: async (parent, args, ctx) => {
        var productsData = await ctx.prisma.product.findFirst({
          where: {
            subCategoryId: args.subCategoryId,
          },
        })

        if (productsData!) {
          throw new Error(
            'Some products have this subcategory linked, first update those products and try again !',
          )
        }

        return ctx.prisma.subCategory.delete({
          where: {
            id: args.subCategoryId,
          },
        })
      },
    })

    t.field('deleteCategory', {
      type: Category.$name,
      args: {
        categoryId: nonNull(stringArg()),
      },
      resolve: async (parent, args, ctx) => {
        var categoryData = await ctx.prisma.category.findFirst({
          where: {
            id: args.categoryId,
          },
          include: {
            product: true,
            subcategories: true,
          },
        })
        var hasSubcategories: boolean = !(
          categoryData?.subcategories == undefined ||
          categoryData.subcategories.length == 0
        )

        var hasProudcts: boolean = !(
          categoryData?.product == undefined ||
          categoryData?.product.length == 0
        )
        if (!hasSubcategories) {
          // if has no subcategories
          console.log('no subcategories')
          if (!hasProudcts) {
            console.log('no products')
            // if category has no products linked
            return ctx.prisma.category.delete({
              where: {
                id: args.categoryId,
              },
            })
          } else {
            console.log('has products')
            throw new Error(
              'Some products have this Category linked, first update those products and then try again !',
            )
          }
        } else {
          console.log('has subcategories')

          throw new Error(
            'Category has some subcategories, delete them or unlink them first and then try again !',
          )
        }
      },
    })

    t.field('deleteProductById', {
      type: Product.$name,
      args: {
        productId: nonNull(stringArg()),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.product.delete({
          where: {
            id: args.productId,
          },
        })
      },
    })
  },
})
