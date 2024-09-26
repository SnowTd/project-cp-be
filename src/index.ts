import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
const client = new PrismaClient()

const app = new Elysia()
  .use(cors())
  .decorate('db', client)

  .get('/', () => `Hello Elysia ${new Date()}`)
  .post(
    '/createsub',
    async ({ body, db }) => {
      const { userID } = await body
      try {
        const newSubscription = await db.subscription.create({
          data: {
            startAt: new Date(),
            endAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            isActive: true,
            userID: userID,
          },
        })
        const res = newSubscription.userID
        return { res, create: 'success' }
      } catch (err) {
        console.error(err)
      }

      return {}
    },
    {
      body: t.Object({
        userID: t.String(),
      }),
    }
  )
  .get('/user', async ({ db }) => {
    const check = await db.subscription.updateMany({
      where: {
        endAt: { lt: new Date() },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })
    const users = await db.user.findMany({
      include: {
        subscription: {
          where: { isActive: true },
        },
      },
    })
    const response = users.map((user) => ({
      id: user.userID,
      profile: user.pictureUrl,
      name: user.name,
      subscription: user.subscription.length > 0 ? 'true' : 'false',
      role: user.role,
      date: user.createAt,
    }))
    return { response }
  })
  .post(
    '/user',
    async ({ body, db }) => {
      const { userId, pictureUrl, displayName } = await body
      if (!userId || !pictureUrl || !displayName) {
        return 'sss'
      }

      console.log(userId)
      const existingUser = await db.user.findFirst({
        where: {
          userID: userId,
        },
      })
      console.log(existingUser?.userID)
      if (existingUser) {
        return {
          data: 'already register',
        }
      }

      const createAcc = await db.user.create({
        data: { userID: userId, name: displayName, pictureUrl: pictureUrl },
      })
      if (createAcc) {
        return {
          data: 'register new success',
        }
      }
    },
    {
      body: t.Object({
        userId: t.String(),
        pictureUrl: t.String(),
        displayName: t.String(),
      }),
    }
  )
  .get('/order', async ({ db }) => {
    const getOrder = await db.order.findMany({
      include: {
        userIDregister: true,
        user: {
          include: {
            subscription: true,
          },
        },
        typeShirt: true,
      },
    })

    const response = getOrder.map((user) => ({
      uid: user.userID,
      profile: user.user.pictureUrl,
      name: user.user.name,
      subscription: user.user.subscription.length > 0 ? true : false,
      date: user.createAt,
      address: user.userIDregister.Address,
      status: user.status,
      skull: user.typeShirt,
      order: user.id,
    }))
    return { response }
  })
  .post(
    '/type/:id',
    async ({ params: { id }, db, body }) => {
      const orderId = Number(id)
      const { type, amount } = await body
      const InsertType = await db.typeShirt.create({
        data: {
          type: type,
          amount: amount,
          orderID: orderId,
        },
      })
    },
    {
      body: t.Object({
        type: t.String(),
        amount: t.Number(),
      }),
    }
  )
  .get('/type/:id', async ({ params: { id }, db }) => {
    const orderId = Number(id)
    const getTypeShirt = await db.typeShirt.findMany({
      where: {
        orderID: orderId,
      },
    })
    return { getTypeShirt }
  })
  .delete(
    '/type/:id',
    async ({ params: { id }, db, body }) => {
      const { typeid } = await body
      const orderId = Number(id)
      const deleteTypeShirt = await db.typeShirt.deleteMany({
        where: {
          orderID: orderId,
          id: typeid,
        },
      })
      return { deleteTypeShirt }
    },
    {
      body: t.Object({
        typeid: t.Number(),
      }),
    }
  )
  .post(
    '/order',
    async ({ body, db }) => {
      const { userID, userRegister } = await body
      const createOrder = await db.order.create({
        data: {
          userID,
          userRegister,
        },
      })
      return { message: 'success', createOrder: userID }
    },
    {
      body: t.Object({
        userID: t.String(),
        userRegister: t.Number(),
      }),
    }
  )
  .post(
    '/linehook',
    async ({ body, db }) => {
      const { destination, events } = await body
      console.log(events)

      const userID: string = events[0].source.userId
      console.log(userID)
      if (events[0].type === 'message') {
        const messageRaw: string = events[0].message.text
        const message = messageRaw.toLowerCase().trim()
        console.log(message)
        if (message === 'order') {
          const userReg = await db.userRegister.findFirst({
            where: {
              userID: userID,
            },
          })
          console.log(userReg)

          if (!userReg) {
            console.log('กรุณาสมัครก่อนครับ')

            return { message: 'กรุณาสมัครก่อนครับ' }
          }
          const userRegId = userReg?.id
          const createOrder = await db.order.create({
            data: {
              userID: userID,
              userRegister: userRegId,
            },
          })
          console.log('success')
          return { status: true, message: 'create success' }
        }
      }
      return { status: true }
    },
    {
      body: t.Object({
        destination: t.String(),
        events: t.Any(),
      }),
    }
  )
  .post(
    '/register',
    async ({ body, db }) => {
      const { userID, phone, address, name } = await body
      console.log('user register', userID)
      const registerUser = await db.userRegister.create({
        data: {
          userID: userID,
          phoneNumber: phone,
          Address: address,
          name: name,
        },
      })
      return { data: 'success' }
    },
    {
      body: t.Object({
        userID: t.String(),
        phone: t.String(),
        address: t.String(),
        name: t.String(),
      }),
    }
  )
  .get('/register/:id', async ({ params: { id }, db }) => {
    const checkRegister = await db.userRegister.findFirst({
      where: {
        userID: id,
      },
    })

    if (checkRegister) return { data: true, id }

    return { data: false, id }
  })
  .listen(3001)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
