import { arg, extendType, nonNull } from 'nexus'
import { User } from 'nexus-prisma'
import { UserUniqueInput } from './inputSchema'

// export const createMutation = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('createUserData', {
//       type: User.name,
//       args: {
//         userUniqueInput: nonNull(
//           arg({
//             type: UserUniqueInput,
//           }),
//         ),
//       },
//       resolve(parent, args, ctx) {
//         return ctx.prisma.user.create({
//           data: {
//             phoneNumber: args.userUniqueInput.phoneNumber,
//             email: args.userUniqueInput.email,
//             name: args.userUniqueInput.name,
//           },
//         })
//       },
//     })
//   },
// })
