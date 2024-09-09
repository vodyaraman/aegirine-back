import { assist } from './assist/assist.js'
import { create } from './create/create.js'
import { links } from './links/links.js'
export const services = (app) => {
  app.configure(assist)

  app.configure(create)

  app.configure(links)

  // All services will be registered here
}
