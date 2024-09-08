import { links } from './links/links.js'
export const services = (app) => {
  app.configure(links)

  // All services will be registered here
}
