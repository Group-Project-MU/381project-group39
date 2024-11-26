const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://admin:admin@admin.aah7d.mongodb.net/GroupProjectData?retryWrites=true&w=majority&appName=admin';

const express = require('express');
const app = express();
const session = require('cookie-session');
//const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const fs = require('node:fs/promises');
const fileUpload = require('express-fileupload');

//Data
const accountSchema = require('./models/account');
const new_account = mongoose.model('account', accountSchema);
const RequestSchema = require('./models/request');
const new_request = mongoose.model('request', RequestSchema);


app.set('view engine', 'ejs');
app.use(formidable());
app.use(express.static("public"));


//Cache
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

//Cookie session
app.use(session({
    name: 'login',
    keys: ['IfItWorksDontTouch']
}));

const CheckVerify = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        console.log("User doesn't login yet!");
        return res.redirect('/login');
    }
}

const CheckId = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        return req.session.name, next();
    } else {
        console.log("User doesn't login yet!");
        return next();
    }
}

app.get('/', CheckVerify, async (req, res) => {
    console.log(req.session);
    const allRequest = await new_request.find();
    //Check login
    if (req.session.views) {
        res.status(200).render('profile', {
            message: 'Welcome back! ',
            username: req.session.name,
            allRequest
        });
    } else {
        req.session.views = 1;
        res.status(200).render('profile', {
            message: 'Welcome! ',
            username: req.session.name,
            allRequest
        });
    }
});

app.get('/map', async (req, res) => {
    await mongoose.connect(uri);
    const totalMark = await new_request.find();
    res.status(200).render('map', {
        locMark: totalMark
    });
});

app.get('/register', (req, res) => {
    const error = false
    res.status(200).render('register', {
        error
    });
});

app.post('/register', async (req, res) => {

    await mongoose.connect(uri);
    //check duplicated username
    const repeatedAcc = await new_account.findOne({
        userid: req.fields.username
    });
    try {
        if (!repeatedAcc) {
            //create account
            console.log('New user trying to register a account');
            let accountObj = new new_account({
                username: req.fields.username.toLowerCase(),
                password: req.fields.password1,
                email: req.fields.email,
                phonenum: req.fields.pnum
            });
            await accountObj.save();
            await accountObj.validate();
            console.log(`New user: ${req.fields.username.toLowerCase()}`);
            res.redirect('/login');
        } else {
            console.error('Username already exist!');
            res.render('register', {
                error: 'Username already exist!'
            });
        }
    } catch (err) {
        console.error('Unexcepted error occur!');
        res.status(500).send('Internal Server error').end();
    }
});

app.get('/login', (req, res) => {
    const error = false;
    res.status(200).render('login', {
        error
    });
});

app.post('/login', async (req, res) => {

    await mongoose.connect(uri);
    const user = await new_account.findOne({
        username: req.fields.name
    });
    try {
        if (user) {
            const matchpassword = req.fields.password === user.password;
            try {
                if (matchpassword) {
                    req.session.authenticated = true;
                    req.session.name = req.fields.name;
                    res.redirect('/');
                } else {
                    console.error('Incorrect Password!');
                    res.render('login', {
                        error: 'Incorrect Password!'
                    });
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error('User not found!');
            res.render('login', {
                error: 'User not found!'
            });
        }
    } catch (err) {
        console.error('Unexcepted error occur!');
        res.status(500).send('Internal Server error').end();
    }
});

//app.get('/create', CheckVerify, async (req, res) => {
app.get('/create', CheckId, async (req, res) => {
    try {
        await mongoose.connect(uri);
        const user = await new_account.findOne({
            username: req.session.name
        });
        if (user) {
            let error = false;
            res.status(200).render('CreateRequest', {
                tel: user.phonenum,
                username: req.session.name,
                error
            });
        } else {
            let error = false;
            res.status(200).render('CreateRequest', {
                tel: "Please enter a phone number",
                username: "guest",
                error
            });
        }
    } catch (err) {
        console.error(err);
    }
});

//app.post('/create', CheckVerify, async (req, res) => {
app.post('/create', CheckId, async (req, res) => {
    try {
        await mongoose.connect(uri);
        const checkcode = await new_request.findOne({
            postcode: req.fields.postcode
        });
        if (!checkcode) {
            console.log(req.fields.locx, req.fields.locy);
            let createObj = new new_request({
                userid: req.fields.username,
                postcode: req.fields.postcode,
                date: req.fields.date,
                name: req.fields.name,
                age: req.fields.age,
                num: req.fields.tele,
                comment: req.fields.com,
                location: [req.fields.locx, req.fields.locy],
                message: []
            });
            console.log(createObj);
            if (req.files.uploadf && req.files.uploadf.size > 0) {
                const data = await fs.readFile(req.files.uploadf.path);
                createObj.file = Buffer.from(data).toString('base64');
                console.log(createObj);
            }
            await createObj.validate();
            await createObj.save();
            res.redirect('/');
        } else {
            const user = await new_account.findOne({
                username: req.session.name
            });
            if (user) {
                res.status(200).render('CreateRequest', {
                    tel: user.phonenum,
                    username: req.session.name,
                    error: "Post code already exist"
                });
            } else {
                res.status(200).render('CreateRequest', {
                    tel: "",
                    username: "guest",
                    error: "Post code already exist"
                });
                res.render('CreateRequest', {
                    tel: "Please enter a phone number",
                    username: "guest",
                    error: "Post code already exist"
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server error').end();
        S
    }
});

app.get('/edit', CheckVerify, async (req, res) => {
    try {
        await mongoose.connect(uri);
        const match = await new_request.find({
            postcode: req.query.postcode
        });
        console.log(match);
        if (match) {
            let error = false;
            res.render('edit', {
                data: match[0],
                error
            });
        }
    } catch (err) {
        console.error(err);
    }
});

app.post('/edit', CheckVerify, async (req, res) => {
    try {
        await mongoose.connect(uri);
        const checkcode = await new_request.find({
            postcode: req.fields.postcode
        });
        if (checkcode) {
            let photo;
            if (req.files.uploadf && req.files.uploadf.size > 0) {
                const data = await fs.readFile(req.files.uploadf.path);
                photo = Buffer.from(data).toString('base64');
            } else {
                photo = checkcode.file;
            }
            const update = await new_request.findOneAndUpdate({
                postcode: req.fields.postcode
            }, {
                date: req.fields.date,
                name: req.fields.name,
                age: req.fields.age,
                num: req.fields.tele,
                comment: req.fields.com,
                file: photo,
                location: [req.fields.locx, req.fields.locy]
            }, {
                new: true,
                runValidators: true
            });

            if (update) {
                res.status(200).send('Updated<a href="/">Back to home</a>').end();
                console.log(req.fields.username, 'updated a request');
            } else {
                res.status(500).send('Internal server error').end();
            }
        } else {
            res.render('edit', {
                error: "Post code already exist"
            }).end();
        }
    } catch (err) {
        console.error(err);
    }
});

app.get('/details', CheckId, async (req, res) => {

    try {
        await mongoose.connect(uri);
        console.log("check postcode ", req.query.postcode);
        const match = await new_request.find({
            postcode: req.query.postcode
        });
        if (match) {
            if ( req.session.name ) {
                res.status(200).render('detail', {
                    info: match[0],
                    user: req.session.name
                });
            } else {
                    res.status(200).render('detail', {
                    info: match[0],
                    user: "guest"
                    });
                }
        }
    } catch (err) {
        res.status(400).send("Bad request<a href="/">Back to home</a>").end();
    }
});

app.post('/details', CheckId, async (req, res) => {
    console.log(req.fields.pcode);
    console.log(req.fields.username);
    try {
        await mongoose.connect(uri);
        if (req.fields.username && req.fields.username !== "guest") {
            const update = await new_request.findOneAndUpdate({
                postcode: req.fields.pcode
            }, {
                $push: {
                    message: {
                        locx: req.fields.locx,
                        locy: req.fields.locy,
                        rad: req.fields.rad,
                        msg: req.fields.msg
                    }
                }
            }, {
                new: true,
                runValidators: true
            });
            console.log(req.session.name + " left a message in request " + req.fields.pcode);
            console.log(update.message);
            res.status(200).send('Posted a message<br><a href="/map">Back to map</a>').end();
        } else {
            res.status(400).send('Only authorized user can use this function!<br><a href="/map">Back to map</a>').end();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server error').end();
    }
});

app.get('/search', async (req, res) => {

    try {
        await mongoose.connect(uri);
        console.log("connected to server");
        const allRequest = await new_request.find();
        res.status(200).render('search', {
            allRequest
        });
    } catch (err) {
        console.error(err);
    }

});

app.get('/delete', CheckVerify, async (req, res) => {
    try {
        await mongoose.connect(uri);
        console.log("check postcode ", req.query.postcode);
        const match = await new_request.find({
            postcode: req.query.postcode
        });
        if (match) {
            res.status(200).render('delete', {
                info: match[0],
                user: req.session.name
            });
        }
    } catch (err) {
        res.status(400).send("Bad request<a href="/">Back to home</a>").end();
    }
});

app.post('/delete', async (req, res) => {
    try {
        await mongoose.connect(uri);
        console.log(req.fields.postcode);
        const deldoc = await new_request.findOneAndDelete({
            postcode: req.fields.postcode
        });
        if (deldoc) {
            console.log("Deleted a request");
            res.status(200).send(`Deleted a request: ${req.fields.postcode}<br><a href="/">Back to home</a>`).end();
        }
    } catch (err) {
        res.status(400).send("Bad request<a href="/">Back to home</a>").end();
    }
});


//////////////////////////////////////////RESTFUL//////////////////////////////////////////////////////////

app.get('/api/postcode/:code', async (req, res) => {

    try {
        await mongoose.connect(uri);
        const results = await new_request.find({
            postcode: req.params.code
        });
        if (results) {
            res.status(200).json({
                "Result": results
            });
            console.log("Read a request");
        } else {
            res.status(400).json({
                "Error": "Not match"
            });
            console.log("Result not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            "Error": "Internal Server Error"
        });
    }
});

app.post('/api/postcode/:code', async (req, res) => {

 try {
                await mongoose.connect(uri);
                console.log("Connected to server");
                const checkcode = await new_request.find({postcode:req.params.code});
                //check if exists
                if ( checkcode.length === 0 ) {
                    const cdt1 = req.params.code !== "" && req.fields.name !== "";
                    const cdt2 = req.fields.age !== "" && req.fields.num !== "";
                    const cdt3 = req.fields.lat !== "" && req.fields.lng !== "";
                    if ( cdt1 && cdt2 && cdt3 ) {
                        let newrequest = {date: req.fields.date,
                                    postcode: req.params.code,
                                    name: req.fields.name,
                                    age: req.fields.age,
                                    num: req.fields.num,
                                    comment: req.fields.com,
                                    location: [req.fields.lat, req.fields.lng]
                                    }
                        const quest = new new_request(newrequest);
                        await quest.validate();
                        await quest.save();
                        console.log("Created a new request");
                        console.log(quest);
                        return res.status(200).json({"Created a new request":quest});
                    } else {
                        return res.status(400).json({"Error":"Invalid input"});
                        throw Error("Invalid input");
                        }
                } else {
                    return res.status(400).json({"Error":"Invalid input"});
                    throw Error("Invalid input");
                    }
            } catch(err) {
                return res.status(500).json({"Error":"Internal Server Error"});
                console.error(err);
                }       
});

app.put('/api/postcode/:code', async (req, res) => {
    try{
        await mongoose.connect(uri);
        const checkcode = await new_request.find({postcode : req.params.code});
        //check if exists
        if (checkcode) {
            const update = await new_request.findOneAndUpdate(
                            {postcode: req.params.code},{
                            date: req.fields.date,
                            name: req.fields.name,
                            age: req.fields.age,
                            num: req.fields.num,
                            comment: req.fields.comment,
                            location: [req.fields.lat, req.fields.lng]
                            }, {new: true, runValidators: true});
            if ( update ) {
                console.log("Updated",req.params.code);
                res.status(200).json({"Updated": update});
                }
        } else {
                res.status(400).json({"Error": "Bad Request"});
            }
    } catch(err) {
        console.error(err);
        res.status(500).json({"Error": "Internal Error"});
    }
});

app.delete('/api/postcode/:code', async (req, res) => {

    try {
        await mongoose.connect(uri);
        const del = await new_request.find({
            postcode: req.params.code
        });
        //check if exists
        if (del) {
            const results = await new_request.findOneAndDelete({
                postcode: req.params.code
            });
            res.status(200).json({
                "Removed": del
            });
            console.log("Removed a data");
        } else {
            res.status(400).json({
                "Error": "Not match"
            });
            console.log("Result not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            "Error": "Internal Server Error"
        });
    }
});

app.get('/logout', (req, res) => {
    req.session = null;
    console.log('Session: ' + req.session);
    res.redirect('/map');
});

app.get('/*', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.status(404).end("404 Not Found");
});

app.listen(process.env.PORT || 3000);
console.log('Running at http://localhost:3000/map');



