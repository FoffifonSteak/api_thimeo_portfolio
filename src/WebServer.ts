import Fastify, {FastifyInstance, RouteHandler, RouteOptions} from "fastify";
import cors from "@fastify/cors";



export default class WebServer {
    private routes: RouteOptions[] = [];
    private fastify: FastifyInstance;

    constructor() {
        this.fastify = Fastify(
            {
                logger: true
            }
        );
        this.fastify.register(cors)
    }

    public addRoute(route: RouteOptions) {
        this.routes.push(route);
    }

    public async start() {
        this.routes.forEach((route) => {
            this.fastify.route(route);
        });

        await this.fastify.listen(3000);
    }

}

