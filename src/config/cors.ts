import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    // origin is the FRONNTEND URL
    // callback is what will allow the request
    origin: function(origin, callback) {

        // this code prints an array like the following, which I can only access with --api
        // if I start the server with npm run dev:api, which is configured in package.json
        // console.log(process.argv);
        // [
        //     'C:\\Users\\ingbv\\Escritorio\\UpTask_MERN\\uptask_backend\\node_modules\\ts-node\\dist\\bin.js',
        //     'C:\\Users\\ingbv\\Escritorio\\UpTask_MERN\\uptask_backend\\src\\index.ts',
        //     // Allow this API in Postman
        //     '--api'
        // ]

        const whitelist = [process.env.FRONTEND_URL]

        // If in the startup array with npm run dev:api it exists in the array ['--api'] at position 2, add it to the whitelist
        if (process.argv[2] === '--api') {
            whitelist.push(undefined)
        }

        if (whitelist.includes(origin)) {
            // First parameter is an error, second is true if we want to allow the connection
            callback(null, true)
        } else {
            callback(new Error('CORS Error'))
        }
    }
}
