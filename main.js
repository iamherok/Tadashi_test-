require('dotenv').config();
require('./config.js')
let { WAConnection: _WAConnection } = require('@adiwajshing/baileys')
let { generate } = require('qrcode-terminal')
let syntaxerror = require('syntax-error')
let simple = require('./lib/simple')
let qrcode = require('qrcode')
//  let logs = require('./lib/logs')
let { promisify } = require('util')
let yargs = require('yargs/yargs')
let Readline = require('readline')
let cp = require('child_process')
let path = require('path')
let fs = require('fs')
const {session} = require('./Database/models')
let rl = Readline.createInterface(process.stdin, process.stdout)
let WAConnection = simple.WAConnection(_WAConnection)
const mongoose = require('mongoose');
const db = mongoose.connection

mongoose.connect(encodeURI(process.env.MONGO_URI)), {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}
// global.LOGGER = logs()
const PORT = process.env.PORT || 3000
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.prefix = new RegExp('^[' + (opts['prefix'] || '‎/').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
const ID = process.env.ID;//'nekoda'//

global.DATABASE = new (require('./lib/database'))(`${ID || opts._[0] ?  ID + '_' || opts._[0]  + '_' : ''}database.json`, null, 2)
if (!global.DATABASE.data.users) global.DATABASE.data = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
}
if (!global.DATABASE.data.chats) global.DATABASE.data.chats = {}
if (!global.DATABASE.data.stats) global.DATABASE.data.stats = {}
if (!global.DATABASE.data.stats) global.DATABASE.data.msgs = {}
global.conn = new WAConnection()

let authFile = `${opts._[0] ||ID || 'session'}.data.json`
if (fs.existsSync(authFile)) conn.loadAuthInfo(authFile)
if (opts['trace']) conn.logger.level = 'trace'
if (opts['debug']) conn.logger.level = 'debug'
if (opts['big-qr'] || opts['server']) conn.on('qr', qr => generate(qr, { small: false }))
let lastJSON = JSON.stringify(global.DATABASE.data)
if (!opts['test']) setInterval(() => {
  conn.logger.info('Saving database . . .')
  if (JSON.stringify(global.DATABASE.data) == lastJSON) conn.logger.info('Database is up to date')
  else {
    global.DATABASE.save()
    conn.logger.info('Done saving database!')
    lastJSON = JSON.stringify(global.DATABASE.data)
  }
},480* 1000) // Save every minute
if(opts['scan'])    conn.on('qr',qr => qrcode.toFile('./public/QR.png',qr))
if(opts['scan']) require('./scan') (global.conn, PORT)
if (opts['server']) require('./server')(global.conn, PORT)
// db.once('open',async ()=>{
//   console.log('Connected to database')

// const find = await session.findOne({ID})
// if (find===null) {
// console.log('id nahi mili ok')
// } else {
// fs.writeFileSync(`./${ID}.data.json`,JSON.stringify(find.session,null,'\t'))
// }
// })




if (opts['test']) {
  conn.user = {
    jid: '2219191@s.whatsapp.net',
    name: 'test',
    phone: {}
  }
  conn.chats
  conn.prepareMessageMedia = (buffer, mediaType, options = {}) => {
    return {
      [mediaType]: {
        url: '',
        mediaKey: '',
        mimetype: options.mimetype,
        fileEncSha256: '',
        fileSha256: '',
        fileLength: buffer.length,
        seconds: options.duration,
        fileName: options.filename || 'file',
        gifPlayback: options.mimetype == 'image/gif' || undefined,
        caption: options.caption,
        ptt: options.ptt
      }
    }
  }

  conn.sendMessage = async (chatId, content, type, opts = {}) => {
    let message = await conn.prepareMessageContent(content, type, opts)
    let waMessage = conn.prepareMessageFromContent(chatId, message, opts)
    if (type == 'conversation') waMessage.key.id = require('crypto').randomBytes(16).toString('hex').toUpperCase()
    conn.emit('chat-update', {
      jid: conn.user.jid,
      messages: {
        all() {
          return [waMessage]
        }
      }
    })
  }
  rl.on('line', line => conn.sendMessage('123@s.whatsapp.net', line.trim(), 'conversation'))
} else {
  rl.on('line', line => {
    global.DATABASE.save()
    process.send(line.trim())
  })

//   db.once('open',async ()=>{
//     console.log('Connected to database')

// const find = await session.findOne({ID})
// // console.log(find)
// if (find===null) {
//   console.log('id nahi mili ok')
// } else {
//   fs.writeFileSync(`./${ID}.data.json`,JSON.stringify(find.session,null,'\t'))
// }


//   //  if(find===null) await new session({ID, session : conn.base64EncodedAuthInfo }).save() //.then(s => console.log(s)).catch(e=> console.error(e));
//   // else fs.writeFileSync(`./${ID}.data.json`,JSON.stringify(find.session,null,'\t'))
// })
// console.log(conn.base64EncodedAuthInfo())
conn.connect().then(async() => {
    fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
    // console.log(conn.base64EncodedAuthInfo())
try {
  const search = await session.findOne({ID})
  if(search === null) await session({ID,session : conn.base64EncodedAuthInfo()}).save()
} catch (e) {
  console.error(e)
}
    global.timestamp.connect = new Date
    console.log('pehle me db open toh karu bahi')

  })
} 
/*console.log(conn.base64EncodedAuthInfo())
db.once('open',async ()=>{
  try {
    console.log('again connected to db')
    const search = await session.findOne({ID})
    if(search === null){
      console.log('id nahi mili toh naya bana raha hu me')
      await new session({ID,session :conn.base64EncodedAuthInfo()}).save()
    }
   else {
    console.log('ID mil gayi ab update kar deta hu')
     await session.updateOne({ID},{$set : {session : conn.base64EncodedAuthInfo()}})
   }   
  } catch (error) {
    console.error(error)
  }
 
})*/ 
process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
global.reloadHandler = function () {
  let handler = require('./handler')
  if (!isInit) {
    conn.off('chat-update', conn.handler)
    conn.off('message-delete', conn.onDelete)
    conn.off('group-participants-update', conn.onParticipantsUpdate)
  }
  conn.welcome = 'Hai, @user!\nSelamat datang di grup @subject'
  conn.bye = 'Selamat tinggal @user!'
  conn.spromote = '@user sekarang admin!'
  conn.sdemote = '@user sekarang bukan admin!'
  conn.handler = handler.handler
  conn.onDelete = handler.delete
  conn.onParticipantsUpdate = handler.participantsUpdate
  conn.on('chat-update', conn.handler)
  conn.on('message-delete', conn.onDelete)
  conn.on('group-participants-update', conn.onParticipantsUpdate)
  if (isInit) {
    conn.on('error', conn.logger.error)
    conn.on('close', () => {
      setTimeout(async () => {
        try {
          if (conn.state === 'close') {
            if (fs.existsSync(authFile)) await conn.loadAuthInfo(authFile)
            await conn.connect()
            fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
            global.timestamp.connect = new Date
          }
        } catch (e) {
          conn.logger.error(e)
        }
      }, 5000)
    })
  }
  isInit = false
  return true
}

// Plugin Loader
let pluginFolder = path.join(__dirname, 'plugins')
let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
  try {
    global.plugins[filename] = require(path.join(pluginFolder, filename))
  } catch (e) {
    conn.logger.error(e)
    delete global.plugins[filename]
  }
}
console.log(Object.keys(global.plugins))
global.reload = (_event, filename) => {
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, filename)
    if (dir in require.cache) {
      delete require.cache[dir]
      if (fs.existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(fs.readFileSync(dir), filename)
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`)
    else try {
      global.plugins[filename] = require(dir)
    } catch (e) {
      conn.logger.error(e)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
fs.watch(path.join(__dirname, 'plugins'), global.reload)
global.reloadHandler()
process.on('exit', () => global.DATABASE.save())



// Quick Test
async function _quickTest() {
  let spawn = promisify(cp.spawn).bind(cp)
  let [ffmpeg, ffmpegWebp, convert] = await Promise.all([
    spawn('ffmpeg', [], {}),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-'], {}),
    spawn('convert', [], {})
  ]).catch(conn.logger.error)
  global.support = {
    ffmpeg: ffmpeg.status,
    ffmpegWebp: ffmpeg.status && ffmpegWebp.stderr.length == 0 && ffmpegWebp.stdout.length > 0,
    convert: convert.status
  }
  Object.freeze(global.support)

  if (!global.support.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (!global.support.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!global.support.convert) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}



/*_quickTest()
  .then(() => conn.logger.info('Quick Test Done'))
  .catch(console.error)*/
