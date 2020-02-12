const inq = require ('inquirer');
const electron_pdf = require ('electron-pdf');

function fillData(username) {
    
}

inq.prompt(
    {
        message: 'github username?',
        name: 'username'
    },
    {
        message: 'favorite color?',
        name: 'color'
    }
).then( (questions) => {

})