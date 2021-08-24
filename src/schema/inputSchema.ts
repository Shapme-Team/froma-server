import { inputObjectType } from 'nexus'
import { User, Address, Product } from 'nexus-prisma'
// import SchemaTypes from './schemaTypes'

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
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
export const SellerUniqueInput = inputObjectType({
  name: 'SellerUniqueInput',
  definition(t) {
    t.field(User.name)
    t.field(User.email)
    t.field(User.phoneNumber)
  },
})
export const AddressInputType = inputObjectType({
  name: 'AddressInputType',
  definition(t) {
    t.field(Address.city)
    t.field(Address.phoneNumber)
    t.field(Address.state)
    t.field(Address.pincode)
    t.field(Address.nearBy)
    t.field(Address.mainAddress)
    t.field(Address.userId)
  },
})


export const ProductInputType = inputObjectType({
  name: 'ProductInputType',
  definition(t) {
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
  },
})


// export const c = inputObjectType({
//   name: 'AddressInputType',
//   definition(t) {
//     t.field(Address.city)
//     t.field(Address.phoneNumber)
//     t.field(Address.state)
//     t.field(Address.pincode)
//     t.field(Address.nearBy)
//     t.field(Address.mainAddress)
    
//     t.field(Address.userId)
//   },
// })


// export const OrderInputType = inputObjectType({
//   name: 'OrderInputType',
//   definition(t) {
//     t.field(User.name)
//     t.field(User.email)
//     t.field(User.phoneNumber)

//     t.string('addressId')
//     t.string('userId')
//     t.string('paymentMethod')
    
    
//   },
// })