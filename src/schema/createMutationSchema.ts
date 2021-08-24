import { arg, extendType, nonNull, stringArg } from 'nexus'
import {
  Address,
  Category,
  Product,
  Seller,
  SubCategory,
  User,
} from 'nexus-prisma'
import {
  AddressInputType,
  ProductInputType,
  SellerInputType,
  UserUniqueInput,
} from './inputSchema'

export const createMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUserData', {
      type: User.$name,
      args: {
        userUniqueInput: nonNull(
          arg({
            type: UserUniqueInput,
          }),
        ),
      },
      async resolve(parent, args, ctx) {
        var userModel = await ctx.prisma.user.create({
          data: {
            phoneNumber: args.userUniqueInput.phoneNumber,
            email: args.userUniqueInput.email,
            name: args.userUniqueInput.name,
          },
        })
        //* a cart model will be created when user model is created
        await ctx.prisma.cart.create({
          data: {
            userId: userModel.id,
          },
        })
        return userModel
      },
    })
    t.field('createSellerData', {
      type: Seller.$name,
      args: {
        sellerInputType: nonNull(
          arg({
            type: SellerInputType,
          }),
        ),
      },
      resolve(parent, args, ctx) {
        return ctx.prisma.seller.create({
          data: {
            phoneNumber: args.sellerInputType.phoneNumber,
            email: args.sellerInputType.email,
            name: args.sellerInputType.name,
          },
        })
      },
    })

    t.field('addAddressToUser', {
      type: Address.$name,
      args: {
        userId: nonNull(stringArg()),
        addressInputSchema: nonNull(
          arg({
            type: AddressInputType,
          }),
        ),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.address.create({
          data: { ...args.addressInputSchema, userId: args.userId },
        })
      },
    })

    t.field('createCategory', {
      type: Category.$name,
      args: {
        name: nonNull(stringArg()),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.category.create({
          data: {
            name: args.name,
          },
        })
      },
    })
    t.field('createSubCategory', {
      type: SubCategory.$name,
      args: {
        name: nonNull(stringArg()),
        categoryId: nonNull(stringArg()),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.subCategory.create({
          data: {
            name: args.name,
            categoryid: args.categoryId,
          },
        })
      },
    })
    t.field('createProduct', {
      type: Product.$name,
      args: {
        productInput: nonNull(
          arg({
            type: ProductInputType,
          }),
        ),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.product.create({
          data: args.productInput,
        })
      },
    })
  },
})
