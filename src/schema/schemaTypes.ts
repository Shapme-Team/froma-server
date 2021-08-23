import {
  objectType,
  stringArg,
  asNexusMethod,
  extendType,
  nonNull,
  arg,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../context'
import {
  User,
  Address,
  Cart,
  Category,
  SubCategory,
  Product,
  Seller,
  Order,
  CartProduct,
} from 'nexus-prisma'
import {
  AddressInput,
  ProductInputType,
  SellerInputType,
  UserUniqueInput,
} from './inputSchema'
import { prisma } from '@prisma/client'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

// getAllProducts()

//* -------------------------------------------------   user
const UserTypes = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id)
    t.field(User.name)
    t.field(User.email)
    t.field(User.phoneNumber)

    t.list.field('address', {
      type: Address.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.address.findMany()
      },
    })
    t.list.field('orders', {
      type: Order.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.order.findMany()
      },
    })

    t.field('cart', {
      type: Cart.$name,
      resolve: (parent, _, ctx: Context) => {
        return ctx.prisma.cart.findFirst()
      },
    })
  },
})

//* -------------------------------------------------   Address

const AddressType = objectType({
  name: Address.$name,
  definition(t) {
    t.field(Address.id)
    t.field(Address.city)
    t.field(Address.phoneNumber)
    t.field(Address.state)
    t.field(Address.pincode)
    t.field(Address.nearBy)
    t.field(Address.mainAddress)
    t.field(Address.userId)

    t.field('user', {
      type: User.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findFirst({
          where: {
            id: parent.userId!,
          },
        })
      },
    })

    t.list.field('orders', {
      type: Order.$name,
      resolve: (parent, arg, ctx) => {
        return ctx.prisma.order.findMany({
          where: {
            addresId: parent.id,
          },
        })
      },
    })
  },
})

const CartType = objectType({
  name: 'Cart',
  definition(t) {
    t.field(Cart.id)
    t.field(Cart.userId)
    //*commented due to currently no use to fetch user from cart model
    t.field('user', {
      type: User.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findFirst()
      },
    })

    t.list.field('cartProducts', {
      type: CartProduct.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.cartProduct.findMany()
      },
    })
  },
})

const OrderType = objectType({
  name: 'Order',
  definition(t) {
    t.field(Order.id)
    t.field(Order.paymentMethod)
    t.field(Order.createdAt)

    t.field(Order.addresId)
    t.field(Order.userId)

    t.field('user', {
      type: User.$name,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findFirst({
          where: {
            id: parent.userId ?? undefined,
          },
        })
      },
    })
    t.list.field('cartProducts', {
      type: CartProduct.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.cartProduct.findMany()
      },
    })

    t.field('orderAddress', {
      type: Address.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.address.findFirst({
          where: {
            id: parent.addresId ?? undefined,
          },
        })
      },
    })
  },
})

const CartProductType = objectType({
  name: 'CartProduct',
  definition(t) {
    t.field(CartProduct.id)
    t.field(CartProduct.orderId)
    t.field(CartProduct.productId)

    t.field('order', {
      type: Order.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.order.findFirst({
          where: {
            id: parent.orderId ?? undefined,
          },
        })
      },
    })
    t.field('product', {
      type: Product.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.product.findFirst({
          where: {
            id: parent.productId ?? undefined,
          },
        })
      },
    })
  },
})

const SellerType = objectType({
  name: 'Seller',
  definition(t) {
    t.field(Seller.id)
    t.field(Seller.email)
    t.field(Seller.name)
    t.field(Seller.phoneNumber)

    t.list.field('products', {
      type: Product.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.product.findMany()
      },
    })
  },
})

const ProductType = objectType({
  name: 'Product',
  definition(t) {
    t.field(Product.id)
    t.field(Product.title)
    t.field(Product.description)
    t.field(Product.imageUrl)
    t.field(Product.unit)
    t.field(Product.quantity)
    t.field(Product.weight)

    t.field(Product.categoryId)
    t.field(Product.subCategoryId)

    t.field(Product.availability)
    t.field(Product.stockQuantity)
    t.field(Product.viewCount)
    t.field(Product.sellerId)

    t.field('seller', {
      type: Seller.$name,
      resolve(parent, arg, ctx: Context) {
        return ctx.prisma.seller.findUnique({
          where: {
            id: parent.sellerId || undefined,
          },
        })
      },
    })

    t.field('category', {
      type: Category.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.category.findFirst()
      },
    })

    t.field('subcategory', {
      type: SubCategory.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.subCategory.findFirst({
          where: {
            id: parent.subCategoryId ?? undefined,
          },
        })
      },
    })

    t.list.field('carts', {
      type: Cart.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.cart.findMany()
      },
    })

    t.list.field('orders', {
      type: Order.$name,
      resolve: (parent, arg, ctx: Context) => {
        return ctx.prisma.order.findMany()
      },
    })
  },
})

const CategoryType = objectType({
  name: 'Category',
  definition(t) {
    t.field(Category.id)
    t.field(Category.name)

    t.list.field('subcategories', {
      type: SubCategory.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.subCategory.findMany()
      },
    })
    t.list.field('products', {
      type: Product.$name,
      resolve: async (parent, _, ctx: Context) => {
        return ctx.prisma.product.findMany()
      },
    })
  },
})

const SubCategoryType = objectType({
  name: 'SubCategory',
  definition(t) {
    t.field(SubCategory.id)
    t.field(SubCategory.name)
    t.field(SubCategory.categoryid)

    t.field('category', {
      type: Category.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.category.findFirst({
          where: {
            id: parent.categoryid ?? undefined,
          },
        })
      },
    })
    t.list.field('products', {
      type: Product.$name,
      resolve(parent, arg, ctx: Context) {
        return ctx.prisma.product.findMany()
      },
    })
  },
})

// todo ----------- QUERIES AND MUTATIONS  --------------------
// todo ----------- QUERIES AND MUTATIONS  --------------------
const createMutation = extendType({
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
            type: AddressInput,
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
// todo ----------------------- QUERY ---------------
export const getUsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getAllUsers', {
      type: User.$name,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })
    t.list.field('getAllProducts', {
      type: Product.$name,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.product.findMany()
      },
    })
  },
})

export default {
  UserTypes,
  AddressType,
  SubCategoryType,
  CategoryType,
  ProductType,
  OrderType,
  CartType,
  SellerType,
  CartProductType,
  createMutation,
}
//* -------------------------------------------------   POST
