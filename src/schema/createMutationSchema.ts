import { arg, extendType, idArg, intArg, list, nonNull, stringArg } from 'nexus'
import {
  Address,
  Cart,
  CartProduct,
  Category,
  Order,
  Product,
  Seller,
  SubCategory,
  User,
} from 'nexus-prisma'
import {
  AddressInputType,
  OrderInputType,
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
            id: args.sellerInputType.id,
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

    t.field('addProductItemToCart', {
      type: CartProduct.$name,
      args: {
        cartId: nonNull(stringArg()),
        productId: nonNull(stringArg()),
        quantity: nonNull(
          intArg({
            default: 1,
          }),
        ),
      },
      resolve: async (parent, args, ctx) => {
        let cartItems = await ctx.prisma.cart.findFirst({
          where: {
            id: args.cartId,
          },
          include: {
            products: true,
          },
        })
        var cartProducts = cartItems?.products
        var existingProduct = cartProducts?.find(
          (e) => e.productId === args.productId,
        )
        if (existingProduct != undefined) {
          return ctx.prisma.cartProduct.update({
            where: {
              id: existingProduct.id,
            },
            data: {
              quantity: (existingProduct.quantity ?? 1) + args.quantity,
            },
          })
        } else {
          return ctx.prisma.cartProduct.create({
            data: {
              cartId: args.cartId ?? undefined,
              productId: args.productId,
              quantity: args.quantity ?? 1,
            },
          })
        }
      },
    })

    //* ---------------- create ORDER --------------

    t.field('createOrderForUser', {
      type: Order.$name,
      args: {
        orderUniqueInput: nonNull(
          arg({
            type: OrderInputType,
          }),
        ),
      },
      resolve: async (parent, args, ctx) => {
        var connectMap: { id: string }[] = []
        // creating a connect map to connect with all the cartProduct ids received from arg.
        args.orderUniqueInput.productIds.forEach((e) => {
          connectMap.push({ id: e })
        })

        // removing cartproducts from cart after order is placed
        // by setting cartId to -> null
        await ctx.prisma.cartProduct.updateMany({
          where: {
            id: {
              in: args.orderUniqueInput.productIds,
            },
          },
          data: {
            cartId: null,
          },
        })
        return ctx.prisma.order.create({
          data: {
            addresId: args.orderUniqueInput?.addresId,
            paymentMethod: args.orderUniqueInput?.paymentMethod,
            userId: args.orderUniqueInput?.userId,
            cartProducts: {
              connect: connectMap,
            },
          },
        })
      },
    })
  },
})
