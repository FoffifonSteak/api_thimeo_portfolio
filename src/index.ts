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
        await this.checkRepoMonthlyTask()
    }

    public async checkRepoMonthlyTask() {
        cron.schedule('0 0 1 * 0', async () => {
            try {
                const response = await axios.get('https://api.github.com/user/repos', {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                    }
                })
                const data = response.data
                const projects = []
                for (let i = 0; i < data.length; i++) {
                    const project = {
                        name: data[i].name
                    }
                    projects.push(project)
                }
                const count = projects.length
                fs.writeFileSync('projectsCountMonth.txt', count.toString())
            } catch (error) {
                throw error
            }
        })

    }
}

const main = new Main();
main.start();


