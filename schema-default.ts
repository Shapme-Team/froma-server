/*
import {
    intArg,
    makeSchema,
    nonNull,
    objectType,
    stringArg,
    inputObjectType,
    arg,
    asNexusMethod,
    enumType,
    queryType,
    interfaceType,
  } from 'nexus'
  
  import { DateTimeResolver } from 'graphql-scalars'
import { Context } from 'vm'
  
  export const DateTime = asNexusMethod(DateTimeResolver, 'date')
  
  
  const Query = objectType({
    name: 'Query',
  
    definition(t) {
      t.nonNull.list.nonNull.field('allUsers', {
        type: 'User',
        resolve: (_parent, _args, context: Context) => {
          return context.prisma.user.findMany()
        },
      })
  
      t.field('hello', {
        type: 'String',
        resolve: (_parent, arg, context) => {
          return 'hello world my friend'
        },
      })
  
      t.nullable.field('postById', {
        type: 'Post',
        args: {
          id: intArg(),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.post.findUnique({
            where: { id: args.id || undefined },
          })
        },
      })
  
      t.nonNull.list.nonNull.field('feed', {
        type: 'Post',
        args: {
  
          searchString: stringArg(),
          skip: intArg(),
          take: intArg(),
          orderBy: arg({
            type: 'PostOrderByUpdatedAtInput',
          }),
        },
        resolve: (_parent, args, context: Context) => {
          const or = args.searchString
            ? {
                OR: [
                  { title: { contains: args.searchString } },
                  { content: { contains: args.searchString } },
                ],
              }
            : {}
  
          return context.prisma.post.findMany({
            where: {
              published: true,
              ...or,
            },
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: args.orderBy || undefined,
          })
        },
      })
  
      t.list.field('draftsByUser', {
        type: 'Post',
        args: {
          userUniqueInput: nonNull(
            arg({
              type: 'UserUniqueInput',
            }),
          ),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.user
            .findUnique({
              where: {
                id: args.userUniqueInput.id || undefined,
                email: args.userUniqueInput.email || undefined,
              },
            })
            .posts({
              where: {
                published: false,
              },
            })
        },
      })
    },
  })
  //todo ----------------------------------------------- MUTATION
  const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
      t.nonNull.field('signupUser', {
        type: 'User',
        args: {
          data: nonNull(
            arg({
              type: 'UserCreateInput',
            }),
          ),
        },
        resolve: (_, args, context: Context) => {
          const postData = args.data.posts?.map((post) => {
            return { title: post.title, content: post.content || undefined }
          })
  
          return context.prisma.user.create({
            data: {
              name: args.data.name,
              email: args.data.email,
              gender: args.data.gender,
              posts: {
                create: postData,
              },
            },
          })
        },
      })
  
      t.field('createDraft', {
        type: 'Post',
        args: {
          data: nonNull(
            arg({
              type: 'PostCreateInput',
            }),
          ),
          authorEmail: nonNull(stringArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.post.create({
            data: {
              title: args.data.title,
              content: args.data.content,
              author: {
                connect: { email: args.authorEmail },
              },
            },
          })
        },
      })
  
      t.field('togglePublishPost', {
        type: 'Post',
        args: {
          id: nonNull(intArg()),
        },
        resolve: async (_, args, context: Context) => {
          try {
            const post = await context.prisma.post.findUnique({
              where: { id: args.id || undefined },
              select: {
                published: true,
              },
            })
            return context.prisma.post.update({
              where: { id: args.id || undefined },
              data: { published: !post?.published },
            })
          } catch (e) {
            throw new Error(
              `Post with ID ${args.id} does not exist in the database.`,
            )
          }
        },
      })
  
      t.field('incrementPostViewCount', {
        type: 'Post',
        args: {
          id: nonNull(intArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.post.update({
            where: { id: args.id || undefined },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          })
        },
      })
  
      t.field('deletePost', {
        type: 'Post',
        args: {
          id: nonNull(intArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.post.delete({
            where: { id: args.id },
          })
        },
      })
    },
  })
  //todo -------------------------------------------------   USER
  const User = objectType({
    name: 'User',
    definition(t) {
      t.nonNull.int('id')
      t.string('name')
      t.string('gender')
      t.nonNull.string('email')
      t.nonNull.list.nonNull.field('posts', {
        type: 'Post',
        resolve: (parent, _, context: Context) => {
          return context.prisma.user
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .posts()
        },
      })
    },
  })
  //todo -------------------------------------------------   POST
  
  const Post = objectType({
    name: 'Post',
    definition(t) {
      t.nonNull.int('id')
      t.nonNull.field('createdAt', { type: 'DateTime' })
      t.nonNull.field('updatedAt', { type: 'DateTime' })
      t.nonNull.string('title')
      t.string('content')
      t.nonNull.boolean('published')
      t.nonNull.int('viewCount')
      t.field('author', {
        type: 'User',
        resolve: (parent, _, context: Context) => {
          return context.prisma.post
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .author()
        },
      })
    },
  })
  
  const SortOrder = enumType({
    name: 'SortOrder',
    members: ['asc', 'desc'],
  })
  
  const PostOrderByUpdatedAtInput = inputObjectType({
    name: 'PostOrderByUpdatedAtInput',
    definition(t) {
      t.nonNull.field('updatedAt', { type: 'SortOrder' })
    },
  })
  
  const UserUniqueInput = inputObjectType({
    name: 'UserUniqueInput',
    definition(t) {
      t.int('id')
      t.string('email')
    },
  })
  
  const PostCreateInput = inputObjectType({
    name: 'PostCreateInput',
    definition(t) {
      t.nonNull.string('title')
      t.string('content')
    },
  })
  
  const UserCreateInput = inputObjectType({
    name: 'UserCreateInput',
    definition(t) {
      t.nonNull.string('email')
      t.string('name')
      t.string('gender')
  
      t.list.nonNull.field('posts', { type: 'PostCreateInput' })
    },
  })
  
  export const schema = makeSchema({
    types: [
      Query,
      Mutation,
      Post,
      User,
      UserUniqueInput,
      UserCreateInput,
      PostCreateInput,
      SortOrder,
      PostOrderByUpdatedAtInput,
      DateTime,
    ],
    outputs: {
      schema: __dirname + '/../schema.graphql',
      typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
      module: require.resolve('./context'),
      export: 'Context',
    },
    sourceTypes: {
      modules: [
        {
          module: '@prisma/client',
          alias: 'prisma',
        },
      ],
    },
  })

  */
  // todo ---------------------- raw schema

  /*
  
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
import { User, Address } from 'nexus-prisma'
import { AddressInput, UserUniqueInput } from './inputSchema'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

// getAllProducts()

//* -------------------------------------------------   user
const UserTypes = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id)
    t.field(User.name)
    t.field(User.email)
    t.field(User.cartId)
    t.field(User.phoneNumber)

    t.list.field('address', {
      type: Address.$name,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.address.findMany()
      },
    })

    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.string('cartId')
    t.int('phoneNumber')
    t.list.field('address', {
      type: Address,
      resolve: (parent, _, ctx: Context) => ctx.prisma.address.findMany(),
    })
    t.nullable.field('cart', {
      type: 'Cart',
      resolve: (parent, _, ctx: Context) => {
        return ctx.prisma.cart.findFirst({
          where: {
            id: parent.cartId ?? undefined,
          },
        })
      },
    })
  },
})

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
      resolve(parent, args, ctx) {
        return ctx.prisma.user.create({
          data: {
            phoneNumber: args.userUniqueInput.phoneNumber,
            email: args.userUniqueInput.email,
            name: args.userUniqueInput.name,
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
  },
})

export const getUsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getAllUsers', {
      type: User.$name,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
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

    // t.nonNull.string('id')
    // t.nonNull.string('city')
    // t.nonNull.int('phoneNumber')
    // t.nonNull.string('state')
    // t.nonNull.int('pincode')

    // t.string('nearBy')
    // t.nonNull.string('mainAddress')
    // t.string('userId')

    // t.field('user', {
    //   type: User.$name,
    //   resolve: (parent, _, ctx) => {
    //     return ctx.prisma.user.findFirst({
    //       where: {
    //         id: parent.userId ?? undefined,
    //       },
    //     })
    //   },
    // })
    // t.list.field('orders', {
    //   type: Order,
    //   resolve: (parent, arg, ctx) => {
    //     return ctx.prisma.order.findMany({
    //       where: {
    //         addresId: parent.id
    //       }
    //     })
    //   },
    // })
  },
})

// const Cart = objectType({
//   name: 'Cart',
//   definition(t) {
//     t.id('id')
//     t.string('userId')
//     t.field('user', {
//       type: User,
//       resolve: (parent, _, ctx) => {
//         return ctx.prisma.user.findFirst({
//           where: {
//             id: parent.userId ?? undefined,
//           },
//         })
//       },
//     })
//     t.nullable.list.field('products', {
//       type: Product,
//       resolve: (parent, _, ctx) => {
//         return ctx.prisma.product.findMany()
//       },
//     })
//   },
// })

// const Order = objectType({
//   name: 'Order',
//   definition(t) {
//     t.string('id')
//     t.nonNull.string('paymentMethod')
//     t.string('addresId')
//     t.nonNull.field('createdAt', { type: 'DateTime' })

//     t.list.field('products', {
//       type: 'Product',
//       resolve: (parent, args, ctx) => {
//         return ctx.prisma.product.findMany()
//       },
//     })

//     t.field('orderAddress', {
//       type: 'Address',
//       resolve: (parent, _, ctx) => {
//         return ctx.prisma.address.findFirst({
//           where: {
//             id: parent.addresId ?? undefined,
//           },
//         })
//       },
//     })
//     t.nonNull.field('createdAt', { type: 'DateTime' })
//     t.nonNull.field('updatedAt', { type: 'DateTime' })
//   },
// })

// // const Seller = objectType({
// //   name: 'Seller',
// //   definition(t) {
// //     t.id('id')
// //     t.nonNull.string('email')
// //     t.nonNull.string('name')
// //     t.int('phoneNumber')
// //     t.list.field('products', {
// //       type: 'Product',
// //       resolve(parent, arg, ctx) {
// //       return  ctx.prisma.product.findMany()
// //       },
// //     })
// //   },
// // })

// const Product = objectType({
//   name: 'Product',
//   definition(t) {
//     t.nonNull.id('id')
//     t.nonNull.field('createdAt', { type: 'DateTime' })
//     t.nonNull.field('updatedAt', { type: 'DateTime' })
//     t.nonNull.string('name')
//     t.string('description')
//     t.nonNull.string('imageUrl')
//     t.nonNull.string('unit')
//     t.nonNull.int('quantity')
//     t.nonNull.string('weight')

//     //todo ->  make it non null
//     t.nonNull.string('categoryId')
//     t.nonNull.string('subCategoryId')

//     t.boolean('availability')
//     t.int('stockQuantity')
//     t.int('viewCount')

//     //todo ->  make it non null
//     t.string('sellerId')

//     // t.field('seller', {
//     //   type: Seller,
//     //   resolve(parent, arg, ctx: Context) {
//     //     return ctx.prisma.seller.findUnique({
//     //       where: {
//     //         id: parent.id || undefined,
//     //       },
//     //     })
//     //   },
//     // })
//     t.field('category', {
//       type: Category,
//       resolve(parent, arg, ctx) {
//         return ctx.prisma.categorie.findFirst()
//       },
//     })

//     t.field('subCategory', {
//       type: SubCategory,
//       resolve(parent, arg, ctx) {
//         return ctx.prisma.subCategories.findFirst({
//           where: {
//             id: parent.subCategoryId,
//           },
//         })
//       },
//     })

//     t.list.field('carts', {
//       type: Cart,
//       resolve(parent, arg, ctx) {
//         return ctx.prisma.cart.findMany()
//       },
//     })

//     t.list.field('orders', {
//       type: Order,
//       resolve: (parent, arg, ctx: Context) => {
//         return ctx.prisma.order.findMany()
//       },
//     })
//   },
// })

// const Category = objectType({
//   name: 'Category',
//   definition(t) {
//     t.id('id')
//     t.nonNull.string('name')
//     t.list.field('subcategories', {
//       type: SubCategory,
//       resolve(parent, arg, ctx) {
//         return ctx.prisma.subCategories.findMany()
//       },
//     })
//     t.list.field('products', {
//       type: Product,
//       resolve: async (parent, _, ctx: Context) => {
//         return ctx.prisma.product.findMany()
//       },
//     })
//   },
// })

// const SubCategory = objectType({
//   name: 'SubCategory',
//   definition(t) {
//     t.id('id')
//     t.nonNull.string('name')
//     t.string('categoryId')
//     t.field('category', {
//       type: Category,
//       resolve(parent, arg, ctx) {
//         return ctx.prisma.categorie.findFirst({
//           where: {
//             id: parent.categoryId ?? undefined,
//           },
//         })
//       },
//     })
//     t.list.field('products', {
//       type: Product,
//       resolve(parent, arg, ctx: Context) {
//         return ctx.prisma.product.findMany()
//       },
//     })
//   },
// })

// todo ----------- test code --------------------

export default {
  UserTypes,
  AddressType,
  // SubCategory,
  // Category,
  // Product,
  // Order,
  // Cart,
  // Seller,
}
//* -------------------------------------------------   POST

  
  */

