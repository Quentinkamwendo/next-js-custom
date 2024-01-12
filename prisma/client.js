// import PrismaClient from "@prisma/client";
const {PrismaClient} = require('@prisma/client');


// const client = globalThis.prisma || new PrismaClient()
// // const client = new PrismaClient()

// if (process.env.NODE_ENV !== "production") globalThis.prisma = client

// export default client

const prisma = new PrismaClient();

export default prisma;
