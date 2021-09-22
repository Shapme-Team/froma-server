import { ApolloServer } from 'apollo-server-express'
import { schema } from './schema'
import { context } from './context'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import PaymentRoute from './expressRoutes/payment'
const app = express()
app.use(express.json())
app.use(cors())

const router = express.Router()

router.use('/payments',PaymentRoute)
app.use(router)



// const app = express()
const server = new ApolloServer({
  schema: schema,
  context: context,
})

app.get('/',(req,res)=>{
  res.send('rest/express is working')
})

async function startApolloServer() {
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    schema: schema,
    context: context,
  })
  await server.start()
  server.applyMiddleware({ app })

  await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, () => {
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
      )
    }),
  )
}

startApolloServer()
