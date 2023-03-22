import axios from "axios";
import {RouteOptions} from "fastify";
import * as fs from "fs";


export function statsRoute(): RouteOptions {
    return {
        method: "GET",
        url: "/stats",
        handler: async (request, reply) => {
            return {
                isCoding: await isCoding(),
                stats: await stats(),
                projects: await projects()
            }
        }
    }
}

async function isCoding() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const today = `${year}-${month}-${day}`
    const secondsDate = date.getTime() / 1000
    try {
        const response = await axios.get(`https://wakatime.com/api/v1/users/current/heartbeats?date=${today}`, {
            headers: {
                // @ts-ignore
                Authorization: `Basic ${btoa(process.env.WAKATIME_API_KEY)}`,
            }
        })
        const data = response.data.data[response.data.data.length - 1].time
        const compareDate = secondsDate - data
        return compareDate < 300;
    } catch (error) {
        return error
    }
}

async function stats() {
    try {
        const response = await axios.get('https://wakatime.com/api/v1/users/current/stats/all_time', {
            headers: {
                // @ts-ignore
                Authorization: `Basic ${btoa(process.env.WAKATIME_API_KEY)}`,
            }
        })
        const bestDay = response.data.data.best_day.total_seconds.toFixed(0)
        const totalCoding = response.data.data.total_seconds.toFixed(0)
        return {bestDay, totalCoding}
    } catch (error) {
        return error
    }
}

async function projects() {
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
        const lastMonthlyCount = fs.readFileSync('projectsCountMonth.txt').toString()
        const differenceBetweenMonth = count - parseInt(lastMonthlyCount)

        return {count, differenceBetweenMonth}

    } catch (error) {
        return error
    }
}

