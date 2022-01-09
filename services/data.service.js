const jwt = require('jsonwebtoken')
const db = require('./db')
const { v4: uuidv4 } = require('uuid')

const register = (name, uname, password) => {

    return db.User.findOne({ uname }).then(user => {
        if (user) {
            return {
                statuscode: 422,
                status: false,
                message: "Username Already Exist!!!"
            }
        }
        else {
            //Creating the db model with new user
            const newUser = new db.User({
                name,
                uname,
                password
            })
            newUser.save() //Saving the newuser into the db
            return {
                statuscode: 200,
                status: true,
                message: "Successfully registered....."
            };
        }
    })
}

const login = (uname, password) => {
    return db.User.findOne({ uname, password }).then(user => {
        if (user) {
            const token = jwt.sign({
                currentNo: uname
            }, 'supersecretkey123')

            return {
                statuscode: 200,
                status: true,
                message: "Successfully Logined.....",
                token,
                currentUser: user.name
            };
        }
        else {
            return {
                statuscode: 422,
                status: false,
                message: "invalid credentials!!!!"
            }
        }
    })
}


const getAlldata = (req) => {
    let uname = req.currentuname;
    return db.User.findOne({ uname })
        .then(user => {
            if (user) {
                return {
                    statuscode: 200,
                    status: true,
                    lists: user.lists
                }
            }
            else {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid user!!!!"
                };
            }
        })
}


// const createnewlist = (req, listname) => {
//     listname=listname.toLowerCase();
//     let uname = req.currentuname;
//     return db.User.findOne({uname},{"lists":{"$elemMatch":{"listname":listname}} }).then(user => {
//         if (user.lists.length!=0) {
//             console.log(user);
//             return {
//                 statuscode: 422,
//                 status: false,
//                 message: "List name already exist"
//             }
//         }
//         else {
//             const data={
//                 listname,
//                 tasks:[]
//             }
//             console.log(user);
//             user.lists.push(data)
//             user.save()
//             return {
//                 statuscode: 200,
//                 status: true,
//                 message: "List Added Successfully"
//             }
//         }
//     })
// }


// { $addToSet: { tags: "accessories" } }


const createnewlist = (req, listname) => {
    listname = listname.toLowerCase();
    let uname = req.currentuname;
    const data = {
        listname,
        tasks: []
    }
    return db.User.updateOne({ uname }, { $addToSet: { lists: data } }).then(user => {
        if (!user) {
            return {
                statuscode: 422,
                status: false,
                message: "invalid"
            }
        }
        else {
            if (user.modifiedCount == 0) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "List name already exist"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    message: "List Added Successfully"
                }
            }
        }
    })
}


const checklistname = (req, listname) => {
    listname = listname.toLowerCase();
    let uname = req.currentuname;
    return db.User.findOne({ uname }, { "lists": { "$elemMatch": { "listname": listname } } }).then(user => {
        if (user.lists.length != 0) {
            return {
                statuscode: 422,
                status: false,
                message: "List name already exist"
            }
        }
        else {
            return {
                statuscode: 200,
                status: true,
                message: "List Doesnt Exist"
            }
        }
    })
}


const editListName = (req, oldlistname, newlistname) => {
    let uname = req.currentuname;
    return db.User.updateOne(
        { uname, "lists": { "$elemMatch": { "listname": oldlistname } } },
        { $set: { "lists.$.listname": newlistname } }
    )
        .then(user => {
            console.log(user);
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    message: "List Name Edited Successfully"
                }
            }
        })
}


// deleteList

const deleteList = (req, listname) => {
    let uname = req.currentuname;
    return db.User.updateOne(
        { uname},
        { $pull: {lists:{listname}}}
    )
        .then(user => {
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    message: "List Deleted Successfully"
                }
            }
        })
}

const createnewtask = (req, listname, task) => {
    let uno = uuidv4();
    let uname = req.currentuname;
    const data = {
        uid: uno,
        taskname: task,
        completed: false
    }
    return db.User.updateOne({ uname, "lists": { "$elemMatch": { "listname": listname } } },
        { $push: { "lists.$.tasks": data } }
    )
        .then(user => {
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    message: "Task Added Successfully"
                }
            }
        })
}



const editTask = (req, listname, task) => {
    let uname = req.currentuname;
    return db.User.updateOne(
        { uname, "lists": { "$elemMatch": { "listname": listname } } },
        { $set: { "lists.$.tasks": task } }
    )
        .then(user => {
            console.log(user);
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    message: "Task Edited Successfully"
                }
            }
        })
}


const deleteTask = (req, listname, task) => {
    let uname = req.currentuname;
    return db.User.updateOne(
        { uname, "lists": { "$elemMatch": { "listname": listname } } },
        { $set: { "lists.$.tasks": task } }
    )
        .then(user => {
            console.log(user);
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    message: "Task Deleted Successfully"
                }
            }
        })
}


// const deleteEvent = (req, uid) => {
//     let uname = req.currentuname;
//     return db.User.updateOne(
//         { uname }, { $pull: {reminders:{uid}}})
//         .then(user => {
//             if (!user) {
//                 return {
//                     statuscode: 422,
//                     status: false,
//                     message: "invalid!!!!"
//                 }
//             }
//             else {
//                 return {
//                     statuscode: 200,
//                     status: true,
//                     reminders: user.reminders,
//                     message: "Event deleted Successfully"
//                 }
//             }
//         })
// }

module.exports = {
    register,
    login,
    createnewlist,
    getAlldata,
    createnewtask,
    editTask,
    deleteTask,
    checklistname,
    editListName,
    deleteList
}