import type { Elysia } from 'elysia'
import { t } from 'elysia'
import axios from 'axios'
const linehook = (app: Elysia) =>
  app.group('/linehook', (app) =>
    app
      .get('/', () => 'hello linehook')
      .post(
        '/',
        async ({ body, set }) => {
          const { destination, events } = await body
          console.log(events)
          if (!events) {
            console.error('No events in the request body')
            set.status = 400
            return { message: 'error' } // Bad Request if no events found
          }
          events.forEach((event: any) => {
            const replyToken = event.replyToken || ''
            const userMessage = event.message ? event.message.text : ''

            console.log('User Message:', userMessage)
            console.log('Reply Token:', replyToken)

            // Handle 'เลือกแพ็กเกจ' message
            if (userMessage === 'เลือกแพ็กเกจ') {
              axios({
                method: 'post',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer luweEYMNBdyQohMF7DjYxRFUSkJjz79QjNcoiugaz8QppZ3gT1hOkmHVnnWfG/kFpswKoEC0FxcFOkSx4aVFFxYOPBwSlmU1dHiYp02dP+bOWBJUOLX2qXTY01xDukWHvtOzjS06It+kHP1kWFWlngdB04t89/1O/w1cDnyilFU=`,
                },
                data: {
                  replyToken: replyToken,
                  messages: [
                    {
                      type: 'flex',
                      altText: 'เลือกแพ็กเกจ',
                      contents: {
                        type: 'bubble',
                        body: {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: 'เลือกแพ็กเกจรายเดือน',
                              weight: 'bold',
                              size: 'lg',
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              margin: 'lg',
                              spacing: 'sm',
                              contents: [
                                {
                                  type: 'button',
                                  action: {
                                    type: 'message',
                                    label: '60 ชิ้น 375 บาท',
                                    text: 'เลือกแพ็กเกจ 60 ชิ้น 375 บาท',
                                  },
                                  style: 'primary',
                                },
                                {
                                  type: 'button',
                                  action: {
                                    type: 'message',
                                    label: '80 ชิ้น 500 บาท',
                                    text: 'เลือกแพ็กเกจ 80 ชิ้น 500 บาท',
                                  },
                                  style: 'primary',
                                },
                                {
                                  type: 'button',
                                  action: {
                                    type: 'message',
                                    label: '120 ชิ้น 750 บาท',
                                    text: 'เลือกแพ็กเกจ 120 ชิ้น 750 บาท',
                                  },
                                  style: 'primary',
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              })
                .then(() => {
                  set.status = 200
                })
                .catch((err) => {
                  console.error('Error in Flex message Axios call:', err)
                  set.status = 500
                })
            }
            // Handle 'เลือกวันรับผ้า' message
            else if (userMessage === 'order') {
              axios({
                method: 'post',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer luweEYMNBdyQohMF7DjYxRFUSkJjz79QjNcoiugaz8QppZ3gT1hOkmHVnnWfG/kFpswKoEC0FxcFOkSx4aVFFxYOPBwSlmU1dHiYp02dP+bOWBJUOLX2qXTY01xDukWHvtOzjS06It+kHP1kWFWlngdB04t89/1O/w1cDnyilFU=`,
                },
                data: {
                  replyToken: replyToken,
                  messages: [
                    {
                      type: 'template',
                      altText: 'เลือกวันที่สำหรับรับและส่งผ้า',
                      template: {
                        type: 'buttons',
                        title: 'เลือกวัน',
                        text: 'กรุณาเลือกวันที่คุณต้องการ',
                        actions: [
                          {
                            type: 'datetimepicker',
                            label: 'เลือกวัน',
                            data: 'storeId=12345',
                            mode: 'date',
                          },
                        ],
                      },
                    },
                  ],
                },
              })
                .then(() => {
                  set.status = 200
                })
                .catch((err) => {
                  console.error('Error in date selection Axios call:', err)
                  set.status = 500
                })
            }
            // Handle 'สถานะการส่งผ้า' message
            else if (userMessage === 'สถานะผ้า') {
              axios({
                method: 'post',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer luweEYMNBdyQohMF7DjYxRFUSkJjz79QjNcoiugaz8QppZ3gT1hOkmHVnnWfG/kFpswKoEC0FxcFOkSx4aVFFxYOPBwSlmU1dHiYp02dP+bOWBJUOLX2qXTY01xDukWHvtOzjS06It+kHP1kWFWlngdB04t89/1O/w1cDnyilFU=`,
                },
                data: {
                  replyToken: replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ผ้าของคุณอยู่ในสถานะ: กำลังจัดส่ง',
                    },
                  ],
                },
              })
                .then(() => {
                  set.status = 200
                })
                .catch((err) => {
                  console.error('Error in status update Axios call:', err)
                  set.status = 500
                })
            }
            // Handle 'ยอดคงเหลือ' message
            else if (userMessage === 'ยอดคงเหลือ') {
              const remainingItems = 40 // ตัวอย่าง mock data

              axios({
                method: 'post',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer luweEYMNBdyQohMF7DjYxRFUSkJjz79QjNcoiugaz8QppZ3gT1hOkmHVnnWfG/kFpswKoEC0FxcFOkSx4aVFFxYOPBwSlmU1dHiYp02dP+bOWBJUOLX2qXTY01xDukWHvtOzjS06It+kHP1kWFWlngdB04t89/1O/w1cDnyilFU=`,
                },
                data: {
                  replyToken: replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: `ยอดคงเหลือของคุณคือ: ${remainingItems} ชิ้น`,
                    },
                  ],
                },
              })
                .then(() => {
                  set.status = 200
                })
                .catch((err) => {
                  console.error('Error in remaining items Axios call:', err)
                  set.status = 500
                })
            }
            // Handle 'รีวิว' message
            else if (userMessage === 'รีวิว') {
              axios({
                method: 'post',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer luweEYMNBdyQohMF7DjYxRFUSkJjz79QjNcoiugaz8QppZ3gT1hOkmHVnnWfG/kFpswKoEC0FxcFOkSx4aVFFxYOPBwSlmU1dHiYp02dP+bOWBJUOLX2qXTY01xDukWHvtOzjS06It+kHP1kWFWlngdB04t89/1O/w1cDnyilFU=`,
                },
                data: {
                  replyToken: replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'กรุณาให้คะแนนบริการของเรา \n(น้อยมาก)',
                      quickReply: {
                        items: [
                          {
                            type: 'action',
                            action: {
                              type: 'message',
                              label: '⭐',
                              text: '⭐',
                            },
                          },
                          {
                            type: 'action',
                            action: {
                              type: 'message',
                              label: '⭐',
                              text: '⭐⭐',
                            },
                          },
                          {
                            type: 'action',
                            action: {
                              type: 'message',
                              label: '⭐',
                              text: '⭐⭐⭐',
                            },
                          },
                          {
                            type: 'action',
                            action: {
                              type: 'message',
                              label: '⭐',
                              text: '⭐⭐⭐⭐',
                            },
                          },
                          {
                            type: 'action',
                            action: {
                              type: 'message',
                              label: '⭐',
                              text: '⭐⭐⭐⭐',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              })
                .then(() => {
                  set.status = 200
                })
                .catch((err) => {
                  console.error('Error in review Axios call:', err)
                  set.status = 500
                })
            }
            // Default reply for any other messages
            else {
              axios({
                method: 'post',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer luweEYMNBdyQohMF7DjYxRFUSkJjz79QjNcoiugaz8QppZ3gT1hOkmHVnnWfG/kFpswKoEC0FxcFOkSx4aVFFxYOPBwSlmU1dHiYp02dP+bOWBJUOLX2qXTY01xDukWHvtOzjS06It+kHP1kWFWlngdB04t89/1O/w1cDnyilFU=`,
                },
                data: {
                  replyToken: replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: `คุณส่งข้อความว่า: ${userMessage}`,
                    },
                  ],
                },
              })
                .then(() => {
                  set.status = 200
                })
                .catch((err) => {
                  console.error('Error in text message Axios call:', err)
                  set.status = 500
                })
            }
          })
        },
        {
          body: t.Object({
            destination: t.String(),
            events: t.Any(),
          }),
        }
      )
  )

export default linehook
