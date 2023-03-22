import Fastify from 'fastify'
import axios from "axios";
import cors from '@fastify/cors'
import * as fs from 'fs';
import WebServer from "./WebServer";
import {statsRoute} from "./routes/stats/statsRoutes";

const cron = require('node-cron');

class Main {
    private webServer: WebServer;

    constructor() {
        this.webServer = new WebServer();
        this.webServer.addRoute(statsRoute());
    }

    public async start() {
        await this.webServer.start();
    }
}

const main = new Main();
main.start();

// cron.schedule('1 0 0 0 *', () => {
//     fs.writeFileSync('projectsCountMonth.txt', count.toString())
// })
//
//
