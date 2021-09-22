import { objectType, asNexusMethod } from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

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

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

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
        return ctx.prisma.address.findMany({
          where: {
            userId: parent.id,
          },
        })
      },
    })
    t.list.field('orders', {
      type: Order.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.order.findMany({
          where: {
            userId: parent.id,
          },
        })
      },
    })

    t.field('cart', {
      type: Cart.$name,
      resolve: (parent, _, ctx: Context) => {
        return ctx.prisma.cart.findFirst({
          where:{
            userId: parent.id
          }
        })
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
    t.field(Address.landmark)
    t.field(Address.area)
    t.field(Address.fullName)
    t.field(Address.houseNumber)
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
        return ctx.prisma.user.findFirst({
          where:{
            id: parent.userId ?? undefined
          }
        })
      },
    })

    t.list.field('products', {
      type: CartProduct.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.cartProduct.findMany({
          where: {
            cartId: parent.id
          }
        })
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
    t.field(Order.paymentStatus)

    t.field(Order.addresId)
    t.field(Order.userId)
    t.field(Order.orderStatus)
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
    t.list.field('products', {
      type: CartProduct.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.cartProduct.findMany({
          where:{
            orderId: parent.id
          }
        })
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
    t.field(CartProduct.cartId)
    t.field(CartProduct.quantity)

    t.field('cart', {
      type: Cart.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.cart.findFirst({
          where: {
            id: parent.cartId ?? undefined,
          },
        })
      },
    })

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
        return ctx.prisma.product.findMany({
          where:{
            sellerId:parent.id
          }
        })
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
    // t.field(Product.quantity)
    t.field(Product.weight)
    t.field(Product.price)

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
        return ctx.prisma.category.findFirst({
          where: {
            id: parent.categoryId ?? undefined,
          },
        })
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

    t.list.field('cartProduct', {
      type: Cart.$name,
      resolve(parent, arg, ctx) {
        return ctx.prisma.cartProduct.findMany({
          where:{
            productId: parent.id
          }
        })
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
        return ctx.prisma.subCategory.findMany({
          where: {
            categoryid: parent.id,
          },
        })
      },
    })
    t.list.field('products', {
      type: Product.$name,
      resolve: async (parent, _, ctx: Context) => {
        return ctx.prisma.product.findMany({
          where: {
            categoryId: parent.id,
          },
        })
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
        return ctx.prisma.product.findMany({
          where: {
            subCategoryId: parent.id,
          },
        })
      },
    })
  },
})

// todo ----------- QUERIES AND MUTATIONS  --------------------
// todo ----------- QUERIES AND MUTATIONS  --------------------

// todo ----------------------- QUERY ---------------

export {
  UserTypes,
  AddressType,
  SubCategoryType,
  CategoryType,
  ProductType,
  OrderType,
  CartType,
  SellerType,
  CartProductType,
  // createMutation,
}
//* -------------------------------------------------   POST
