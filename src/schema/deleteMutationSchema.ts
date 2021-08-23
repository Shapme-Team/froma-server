import { extendType, nonNull, stringArg } from 'nexus'
import {User} from 'nexus-prisma'

export const deleteMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteUser',{
    type: User.$name,
    args: {
        userId: nonNull(stringArg())
    },
    resolve: (parent,args,ctx) =>{
        return ctx.prisma.user.delete({
            where:{
                id: args
            }
        });
    }
    })
  },
})
