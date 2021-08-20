import { queryField } from 'nexus'
import { context } from "../context";
import {User} from 'nexus-prisma'


export const getUserDataQuery = queryField('getUser', {
  type: 'User',
  
  resolve(parent,arg,ctx) {
      return ctx.prisma.user.findMany()
  },
})

