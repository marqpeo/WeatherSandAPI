import Fastify from "fastify";
import routes from "./lib/routes/index.js";

const port = process.env.DEV_MODE ? 4000 : 3000;

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


fastify.listen({ port }, function(err, address){
  if(err){
    fastify.log.error(err);
    process.exit(1);
  }
})