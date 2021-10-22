let PhoneNumber = require('awesome-phonenumber')
let handler  = async (m, { conn, usedPrefix }) => {
  conn.reply(m.chat, `
*Konnichiwa I am Cara-Chan 👋(❤w❤) at your service*

🔰 *Prefix - [ ! ]*

*― ⌞ 🄱🄾🅃 💾 ⌝ ―*

*❁* Menu
*❁* Daily 
*❁* Ping
*❁* Delete 
*❁* Leaderboard 
*❁* Levelup 
*❁* Leavegc
*❁* Setwelcome/bye _<text>_
*❁* Lockcmd
*❁* Unlockcmd
*❁* Setcmd
*❁* Ban
*❁* Unban
*❁* Owner

*― ⌞ 🄶🅁🄾🅄🄿 🎍⌝ ―*

*❁* Enable/disable 
*❁* Remove _@user_
*❁* Add _98755*****_
*❁* Here
*❁* Profile 
*❁* Tagall
*❁* Hidetag _<text>_
*❁* Revoke

*― ⌞ 🅄🅃🄸🄻🅂 🏮 ⌝ ―*

*❁* Sticker 
*❁* Toimg
*❁* Translate _<lan>_ _<text>_
*❁* Google _<text>_
*❁* Goimg _<text>_
*❁* Wiki _<text>_
*❁* Kanji _<text>_
*❁* Ninjaname _<text>_
*❁* Ss _<link>_
*❁* Weather _<state>_
*❁* Wallpaperq _<keywords>_
*❁* Lyrics _<song name>_
*❁* Meme
*❁* Whatmusic _<tag the music>_
*❁* Steal _<packname>|<author>_
*❁* Tts _<text>_
*❁* Attp _<text>_

*― ⌞ 🄼🄴🄳🄸🄰 💿 ⌝ ―*

*❁* Yts _<link>_
*❁* Yta _<link>_
*❁* Ytv _<link>_
*❁* Play _<song name>_
*❁* Spotify _<song name>_

*― ⌞ 🄰🄽🄸🄼🄴 🇯🇵⌝ ―*

*❁* Anime _<name>_
*❁* Manga _<name>_
*❁* Character _<name>_
*❁* Waifu
*❁* Neko
*❁* Loli
*❁* Ameme
*❁* Mp
*❁* Pokemon _<name>_
*❁* Gchara  _<name>_

*― ⌞ 🅁🄴🄰🄲🅃🄸🄾🄽 😗 ⌝ ―*

*❁* Punch
*❁* Slap
*❁* Kiss
*❁* Hug
*❁* Cry
*❁* Blush

*― ⌞ 🄷🄴🄽🅃🄰🄸 🔞 ⌝ ―*

*❁* nh _<text>_

*― ⌞ 🄸🄼🄰🄶🄴  ⌝ ―*



_Made By Quantum world_

*If you find any bug feel free to report us by using _!report <text>_*
`.trim(), m)
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
