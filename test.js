const nhentai = require('nhentai');
const fs = require('fs');
const api = new nhentai.API();

api.randomDoujin().then(e => {
   console.log(e.pages[0])
})
