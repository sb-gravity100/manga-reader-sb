const Datastore = require('nedb-promises');
const _ = require('lodash');
const { randomBytes, randomInt } = require('crypto');
const db = Datastore.create('./test.db');

async function boot() {
   // const docs = _.times(10, (n) => ({
   //    username: `User${n + 1}`,
   //    password: randomBytes(64).toString('base64'),
   // }));
   // // console.log(docs);
   // const data = await db.insert(docs);
   // console.log(data);
   const regex = new RegExp(`^user${randomInt(1, 10)}$`, 'i');
   const user = await db.update(
      { username: { $regex: regex } },
      { $set: { password: randomBytes(64).toString('base64') } },
      { returnUpdatedDocs: true, multi: false }
   );
   console.log(user);
}

boot().catch(console.log);
