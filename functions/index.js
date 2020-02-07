
const functions = require('firebase-functions');
const Koa = require('koa');
const Router = require('koa-router');
// const koaBody = require('koa-body');
// app.use(koaBody());

//connect firebase
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

const app = new Koa();

const router = new Router();

router.get('/users', async (ctx) => {
    // const data = fs.readFileSync('./users.json', 'utf8');
    // const list = db.collection('users')
    try {

        //get 1
        // let doc = await db.collection('users').doc("6PGRvkjtCyxG9NVZEqRX").get();
        // if(!doc.exists){
        //     ctx.status = 404;
        //     return ctx.body = "not found loi"
        // }else{
        //     return ctx.body = doc.data(); 
        // }
        //------------get all-----------------
        let doc = await db.collection('users').get();
        if (doc.empty) {
            ctx.status = 404;
            return ctx.body = "not found loi"
        }
        else {
            const items = doc.docs.map((docItem) => {
                console.log('id item' + typeof docItem.id);
                docItem.data()
                const dataUser = { ...docItem.data(), id: docItem.id }
                return dataUser;
            });
            ctx.body = items;

        }
    } catch (e) {
        console.log(e);
    }

})

router.post('/users/create/', async (ctx) => {
    console.log("create");
    const data = ctx.req.body;
    // console.log(data);
    let addDoc = await db.collection('users').add(data);

    ctx.body = addDoc.id // Response
})
router.put('/users/:id', async (ctx) => {
    const data = ctx.req.body;
    const id = ctx.params.id.toString()
    await db.collection('users').doc(id).update(data);
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
        ctx.status = 404;
        return ctx.body = "not found loi"
    } else {
        const dataUser = {...doc.data(),id:id}
        return ctx.body = dataUser;
    }
})
router.del('/users/delete/:id', async (ctx) => {
    try {
        const data = ctx.params.id.toString()
        console.log(typeof data);
        await db.collection('users').doc(data).delete();
        ctx.body = data
    } catch (error) {
        console.log(error);

    }


})
router.get('/users/:id', async (ctx) => {
    const id = ctx.params.id.toString()

    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
        ctx.status = 404;
        return ctx.body = "not found loi"
    } else {
        return ctx.body = doc.data();
    }
});
app
    .use(router.routes())
    .use(router.allowedMethods());

// app.listen(3000);

exports.api = functions.https.onRequest(app.callback());


