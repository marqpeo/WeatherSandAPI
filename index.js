import Fastify from "fastify";
import routes from "./lib/routes/index.js";

const port = process.env.DEV_MODE ? 4000 : 3000;
const host = process.env.DEV_MODE ? localhost : '0.0.0.0'

const fastify = Fastify({
  logger: true
});

fastify.addHook('preHandler', (req,reply, done) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'OPTIONS, GET');
  reply.header('Access-Control-Max-Age', 2592000);
  done();
})

fastify.register(routes);


fastify.listen({ port, host }, function(err, address){
  if(err){
    fastify.log.error(err);
    process.exit(1);
  }
})