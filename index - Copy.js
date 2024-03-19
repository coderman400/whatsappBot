const {
    default:
        makeWASocket,
        MessageOptions,
        isJidgroup,
        useMultiFileAuthState,
        BufferJSON,
        delay,
        AnyMessageContent,
        makeInMemoryStore,
        msgRetryCounterMap,
        DisconnectReason,
        MimeType,
        fetchLatestBaileysVersion,
        makeCacheableSignalKeyStore,
        makeBusinessSocket
    } = require("@whiskeysockets/baileys");
    const {
        Boom
    } = require('@hapi/boom');
    const fs = require('fs');
    const P = require('pino');
    const NodeCache = require('node-cache');
    const request = require('request');
    const mime = require('mime');
    //Capitalize function for prettiness
    
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    //Logger inititalization.
    
    const log = P({
        timestamp: () => `,"time":"${new Date().toJSON()}"`,
        //transport: {
            //target: 'pino-pretty'
        //}
    });
    
    //Changing log levels controls what logs are printed to the console. log levels are as follows: trace, debug, info, warn, error, and fatal.
    
    const logger = log.child({});
    logger.level = 'warn';
    
    // const WA_ID = process.argv.slice(2)[0] + '@s.whatsapp.net';
    // const JSON_PATH = process.argv.slice(2)[1];
    
    //Cache for messages to retry send if send fails
    const msgRetryCounterCache = new NodeCache()
    
        async function startSock() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('auth_state')
            //Socket initialization
            const sock = makeWASocket({
                printQRInTerminal: true,
                logger: logger,
                msgRetryCounterCache,
                auth: state,
            });
        sock.ev.on('connection.update', async(update) => {
        
            //if(update.qr) {
            //	console.log('QR:',update.qr);
            //}
        
            const {
                connection,
                lastDisconnect
            } = update
                if (connection === 'close') {
    
                    //If connection closes unexpectedly, we try reconnecting
    
                    const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                    console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
                    // reconnect if not logged out
                    if (shouldReconnect) {
                        startSock();
                    }
                } else if (connection === 'open') {
    
                    //Once connection is established we iteratively send messages depending on the message type.
                        const [result] = await sock.onWhatsApp(WA_ID)
                        if (!result) {
                            console.log(`❌ ${process.argv.slice(2)[0]} is not a valid WhatsApp number`);
                            console.log('Please enter valid mobile number in the format <country-code><phone-number>');
                            process.exit();
                        }
                        console.log('Connection successful 🟢');
                    
                }
        });
        sock.ev.on('creds.update', saveCreds);
    }
    async function send(sock){
        //moved everything from under connection = open
        console.log('-'.repeat(process.stdout.columns));
    for await(var obj of json_data) {
        switch (obj.type) {
        case 'text': {
                console.log('Sending text message:');
                console.log(obj.text);
                console.log('-'.repeat(process.stdout.columns));
                const msg = await sock.sendMessage(WA_ID, {
                    text: obj.text
                });
                break;
            }
        case 'document': {
                console.log('Sending document:');
                console.log('link:', obj.link);
                console.log('-'.repeat(process.stdout.columns));
                const fileName = obj.link.split('\\').pop().split('/').pop();
                const msg = await sock.sendMessage(WA_ID, {
                    document: {
                        url: obj.link
                    },
                    mimetype: mime.getType(obj.link),
                    fileName: fileName
                });
                break;
            }
        case 'audio': {
                console.log('Sending audio:');
                console.log('link:', obj.link);
                console.log('-'.repeat(process.stdout.columns));
                const msg = await sock.sendMessage(WA_ID, {
                    audio: {
                        url: obj.link
                    }
                });
                break;
            }
        case 'image': {
                console.log('Sending image:');
                console.log('link:', obj.link);
                console.log('-'.repeat(process.stdout.columns));
                const msg = await sock.sendMessage(WA_ID, {
                    image: {
                        url: obj.link
                    },
                    caption: obj.caption
                });
                break;
            }
        case 'video': {
                console.log('Sending video:');
                console.log('link:', obj.link);
                console.log('-'.repeat(process.stdout.columns));
                const msg = await sock.sendMessage(WA_ID, {
                    video: {
                        url: obj.link
                    },
                    caption: obj.caption
                });
                break;
            }
        }

    }
    console.log('All messages sent ✅')
    process.exit();}
    var json_data;
    
    //reading json file and starting socket in the callback function
    
    // fs.readFile('./json/' + JSON_PATH, (err, data) => {
    
    //     if (err) {
    //         console.log('❌ Json file not found. Ensure file exists in json folder and try again.');
    //         return;
    //     }
    //     json_data = JSON.parse(data);
    
    //     //Checking if json is valid (all file links exist).If doesnt exist in fs, we do http request and check too so that remote files pass the test.
    //     for (obj of json_data) {
    //         if (obj.type != 'text') {
    //             if (fs.existsSync(obj.link)) {
    //                 continue;
    //             } else {
    //                 request(obj.link, function (err, resp) {
    //                     if (resp === undefined) {
    //                         console.log('❌', capitalize(obj.type), "\x1b[1m", obj.link, "\x1b[0m", 'does not exist');
    //                         console.log('Please fix the json file and try again');
    //                         process.exit();
    //                     }
    //                     if (resp.statusCode === 200) {
    //                         return
    //                     }
    //                 })
    //             }
    //         }
    //     }
    
    // });
    

const express = require('express')
const app = express()
const port = 3000
WA_ID = "916238009381@s.whatsapp.net"
const sock = startSock();
app.use(express.json())
app.get('/', (req, res) =>{
    res.send('hello world')
})
app.post('/', (req,res) => {
    json_data= req.body
    send(sock)
})
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})