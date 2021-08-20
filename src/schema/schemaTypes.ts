import { objectType, stringArg, asNexusMethod } from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { context } from '../context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

//* -------------------------------------------------   user
const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.nonNull.string('cartId')
    t.int('phoneNumber')
    t.list.field('address', {
      type: 'Address',
    })
    t.field('cart', {
      type: 'Cart',
    })
  },
})

//* -------------------------------------------------   Address

const AddressType = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('city')
    t.nonNull.string('state')
    t.nonNull.int('phoneNumber')
    t.nonNull.string('mainAddress')
    t.nonNull.string('userId')

    t.field('user', {
      type: 'User',
    })
    t.list.field('orders', {
      type: 'Order',
    })
  },
})

const CartType = objectType({
  name: 'Cart',
  definition(t) {
    t.id('id')
    t.nonNull.string('userId')
    t.nonNull.field('user', {
      type: 'User',
    }),
      t.list.field('products', {
        type: 'Product',
      })
  },
})

const OrderType = objectType({
  name: 'Order',
  definition(t) {
    t.id('id')
    t.nonNull.string('paymentMethod')
    t.nonNull.string('addressId')

    t.nonNull.list.field('products', {
      type: 'Product',
    })
    t.nonNull.field('address',{
      type:'Address'
      
    })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
  },
})

const SellerType = objectType({
  name: 'Seller',
  definition(t) {
    t.id('id')
    t.nonNull.string('email')
    t.nonNull.string('name')
    t.int('phoneNumber')
    t.list.field('products', {
      type: 'Product',
      resolve(parent, arg, ctx) {},
    })
  },
})

const ProductType = objectType({
  name: 'Product',
  definition(t) {
    t.id('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('name')
    t.string('description')
    t.nonNull.string('imageUrl')
    t.nonNull.string('unit')
    t.nonNull.int('quantity')
    t.nonNull.string('weight')

    //todo ->  make it non null
    t.nonNull.string('categoryId')
    t.nonNull.string('subCategoryId')

    t.boolean('availability')
    t.int('stockQuantity')
    t.int('viewCount')

    //todo ->  make it non null
    t.string('sellerId')

    t.nonNull.field('seller', {
      type: 'Seller',
      // resolve(parent, arg, ctx) {},
    })
    t.field('category', {
      type: 'Category',
      resolve(parent, arg, ctx) {
        return ctx.prisma.categorie.findFirst()
      },
    })
    t.nonNull.field('subCategory', {
      type: 'SubCategory',
      resolve(parent, arg, ctx) {},
    })
    t.nonNull.field('subCategory', {
      type: 'SubCategory',
      resolve(parent, arg, ctx) {},
    })

    t.list.field('carts', {
      type: 'Cart',
      resolve(parent, arg, ctx) {},
    })
    t.list.field('orders', {
      type: 'Order',
      resolve(parent, arg, ctx) {},
    })
  },
})

const CategoryType = objectType({
  name: 'Category',
  definition(t) {
    t.id('id')
    t.nonNull.string('name')
    t.list.field('subcategories', {
      type: 'SubCategory',
      resolve(parent, arg, ctx) {},
    })
    t.list.field('products', {
      type: 'Product',
      resolve(parent, arg, ctx) {},
    })
  },
})

const SubCategoryType = objectType({
  name: 'SubCategory',
  definition(t) {
    t.id('id')
    t.nonNull.string('name')
    t.field('category', {
      type: 'Category',
      resolve(parent, arg, ctx) {},
    })
    t.list.field('products', {
      type: 'Product',
      resolve(parent, arg, ctx) {},
    })
  },
})

export default {
  UserType,
  AddressType,
  SubCategoryType,
  CategoryType,
  ProductType,
  SellerType,
  OrderType,
  CartType,
}
//* -------------------------------------------------   POST
