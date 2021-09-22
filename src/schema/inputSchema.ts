import { inputObjectType, list, stringArg } from 'nexus'
import { User, Address, Product, Order } from 'nexus-prisma'
// import SchemaTypes from './schemaTypes'

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.field(User.id)
    t.field(User.name)
    t.field(User.email)
    t.field(User.phoneNumber)
  },
})
export const SellerInputType = inputObjectType({
  name: 'SellerInputType',
  definition(t) {
    t.nonNull.field(User.id)
    t.nonNull.field(User.name)
    t.nonNull.field(User.email)
    t.nonNull.field(User.phoneNumber)
  },
})

export const AddressInputType = inputObjectType({
  name: 'AddressInputType',
  definition(t) {
    t.field(Address.city)
    t.field(Address.phoneNumber)
    t.field(Address.state)
    t.field(Address.pincode)
    t.field(Address.fullName)
    t.field(Address.landmark)
    t.field(Address.houseNumber)
    t.field(Address.area)
    t.field(Address.userId)
  },
})

export const ProductInputType = inputObjectType({
  name: 'ProductInputType',
  definition(t) {
    t.field(Product.title)
    t.field(Product.description)
    t.field(Product.imageUrl)
    t.field(Product.price)
    t.field(Product.unit)
    // t.field(Product.quantity)
    t.field(Product.weight)

    t.field(Product.categoryId)
    t.field(Product.subCategoryId)

    t.field(Product.availability)
    t.field(Product.stockQuantity)
    t.field(Product.viewCount)
    t.field(Product.sellerId)
    t.field(Product.price)
  },
})

export const OrderInputType = inputObjectType({
  name: 'OrderInputType',
  definition(t) {
    t.nonNull.field(Order.id)
    t.nonNull.field(Order.paymentMethod)
    t.field(Order.addresId)
    t.field(Order.userId)
    t.field(Order.paymentStatus)
    t.field(Order.orderStatus)
    t.nonNull.list.nonNull.field('productIds',{
      type: 'String'
    })
  },
})
// * ---------------------------- update inputs ---------- 

export const UserUpdateInputType = inputObjectType({
  name: 'UserUpdateInputType',
  definition(t) {
    t.nonNull.field(User.id)
    t.string(User.name.name)
    t.int(User.phoneNumber.name)
  },
})
export const UpdateAddressInput = inputObjectType({
  name: 'UpdateAddressInput',
  definition(t) {
    t.nonNull.field(Address.id)
    t.string(Address.city.name)
    t.string(Address.state.name)
    t.string(Address.landmark.name)
    t.string(Address.fullName.name)
    t.string(Address.area.name)
    t.string(Address.houseNumber.name)
    t.int(Address.pincode.name)
    t.int(Address.phoneNumber.name)

  },
})
export const UpdateProductInput = inputObjectType({
  name: 'UpdateProductInput', 
  definition(t) {
    t.string(Product.title.name)
    t.string(Product.description.name)
    t.string(Product.imageUrl.name)

    t.string(Product.unit.name)
    t.int(Product.weight.name)
    t.int(Product.price.name)

    t.string(Product.categoryId.name)
    t.string(Product.subCategoryId.name)

    t.int(Product.stockQuantity.name)
    t.boolean(Product.availability.name)
    
  },
})