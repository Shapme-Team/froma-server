import { arg, extendType, idArg, intArg, nonNull, stringArg } from 'nexus'
import {
  Address,
  Cart,
  CartProduct,
  Category,
  Product,
  Seller,
  SubCategory,
  User,
} from 'nexus-prisma'
import {
  UpdateAddressInput,
  UpdateProductInput,
  UserUpdateInputType,
} from './inputSchema'

export const updateMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateCartProductQuantity', {
      type: CartProduct.$name,
      args: {
        id: nonNull(idArg()),
        quantity: nonNull(intArg()),
      },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.cartProduct.update({
          where: {
            id: args.id,
          },
          data: {
            quantity: args.quantity,
          },
        })
      },
    })
    t.field('updateUserInfo', {
      type: User.$name,
      args: {
        userUpdateInputType: nonNull(
          arg({
            type: UserUpdateInputType,
          }),
        ),
      },
      resolve: async (parent, args, ctx) => {
        var dataToUpdate = {
          ...(args.userUpdateInputType.name && {
            name: args.userUpdateInputType.name,
          }),
          ...(args.userUpdateInputType.phoneNumber && {
            phoneNumber: args.userUpdateInputType.phoneNumber,
          }),
        }
        return await ctx.prisma.user.update({
          where: {
            id: args.userUpdateInputType.id,
          },
          data: dataToUpdate,
        })
      },
    })

    t.field('updateUserAddress', {
      type: Address.$name,
      args: {
        addressArg: nonNull(
          arg({
            type: UpdateAddressInput,
          }),
        ),
      },
      resolve: (_, args, ctx) => {
        var addressUpdateData = {
          ...(args.addressArg.city && { city: args.addressArg.city }),
          ...(args.addressArg.mainAddress && {
            mainAddress: args.addressArg.mainAddress,
          }),
          ...(args.addressArg.nearBy && { nearBy: args.addressArg.nearBy }),
          ...(args.addressArg.state && { state: args.addressArg.state }),
          ...(args.addressArg.phoneNumber && {
            phoneNumber: args.addressArg.phoneNumber,
          }),
          ...(args.addressArg.pincode && { pincode: args.addressArg.pincode }),
        }
        return ctx.prisma.address.update({
          where: {
            id: args.addressArg.id,
          },
          data: addressUpdateData,
        })
      },
    })

    t.field('updateProductDetails', {
      type: Product.$name,
      args: {
        productId: nonNull(stringArg()),
        productArg: nonNull(
          arg({
            type: UpdateProductInput,
          }),
        ),
      },
      resolve: (_, args, ctx) => {
        var productUPdateData = {
          ...(args.productArg.availability && {
            availability: args.productArg.availability,
          }),
          ...(args.productArg.categoryId && {
            categoryId: args.productArg.categoryId,
          }),
          ...(args.productArg.subCategoryId && {
            subCategoryId: args.productArg.subCategoryId,
          }),

          ...(args.productArg.description && {
            description: args.productArg.description,
          }),
          ...(args.productArg.title && {
            title: args.productArg.title,
          }),
          ...(args.productArg.imageUrl && {
            imageUrl: args.productArg.imageUrl,
          }),

          ...(args.productArg.price && {
            price: args.productArg.price,
          }),
          ...(args.productArg.weight && {
            weight: args.productArg.weight,
          }),
          ...(args.productArg.unit && {
            unit: args.productArg.unit,
          }),
          ...(args.productArg.stockQuantity && {
            stockQuantity: args.productArg.stockQuantity,
          }),
        }

        return ctx.prisma.product.update({
          where: {
            id: args.productId,
          },
          data: productUPdateData,
        })
      },
    })

    t.field('updateCategoryName', {
      type: Category.$name,
      args: {
        categoryId: nonNull(stringArg()),
        categoryName: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        return ctx.prisma.category.update({
          where: {
            id: args.categoryId,
          },
          data:{
            name: args.categoryName
          } 
        })
      },
    })
    t.field('updateSubCategoryName', {
      type: SubCategory.$name,
      args: {
        subCategoryId: nonNull(stringArg()),
        subCategoryName: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        return ctx.prisma.subCategory.update({
          where: {
            id: args.subCategoryId,
          },
          data:{
            name: args.subCategoryName
          } 
        })
      },
    })
  },
})
