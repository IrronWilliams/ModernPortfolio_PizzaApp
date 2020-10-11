/*Serverless Functions

When building with Gatsby, just kicks out html pages, CSS files and JS in order to handle page 
transitions, custom functionality. Sanity handles almost all use cases for creating, updating and 
pulling in data. Can't really do much on the backend with Gatsby. Say for example, to send an email
do something with a contact form, must occur on the server side. Can't manage this backend stuff with 
Gatsby. However, Gatsby works very well with serverless functions. A serverless function are similar
to running a node server. But instead of running a node server that does lots of stuff, a serverless 
functions does 1 thing and then shuts itself off. Will be using Netlify. 

Will be creating a serverless function called placeOrder and will use node mailer to hook up to an 
external email service and send emails out. Creating a package.json for the placeOder function. 
Open another console, CD into folder  and run 'npm init' (no need to answer questions, enter until created)
After package.json created, run 'npm i nodemailer'. The nodemailer dependency will allow me to send email
via JavaScript. 

Need to require nodeMailer. Cannot use the import syntax so using older JS syntax. Using ethereal.email
because it allows me to setup a temporary testing email account. In production this email info shouldn't
be hardcoded and will likely change when switching to Postmark. Can put info into .env file because 
these are variables that can be changed based upon their environment. 

SendGrid & Postmark are email companies that require credit card info. 

exports.handler will validate the data, send the email, send the success or error message. Will loop 
over name, email, order. These are required and if any are missing will send an error back for this 
info. Will typically use a forEach() but because returning from the async function, will not
be able to use forEach() because forEach() will return another function scope. And cannot return an 
inner scope from an outer scope. So will use a 'for of' loop. 

*/

const nodemailer = require('nodemailer') 

//function that generates email. takes in data and interpolates. this is not React so syntax is different.  
function generateOrderEmail({order, total}){
    return `<div>
        <h2>Your Recent Order For ${total}</h2>
        <p>Your Order Will Be Ready In 15 Minutes!</p>
        <ul>
            ${order.map(
                (item) => `<li>
                <img src="${item.thumbnail}" alt="${item.name}"
                ${item.size} ${item.name} - ${item.price}
                </li>`
            )}
        </ul>
        <p>Your total is $${total} due at pickup</p>    
    </div>`
}

const transporter = nodemailer.createTransport({
    
    //authentication variables needed to connect. 
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})
//Step1. create a handler 
exports.handler = async (event, context) =>{

    const body = JSON.parse(event.body)
    console.log(body)

    //validate data coming in is correct. rerun npm run netlify, submit order. results in console
    const requiredFields = ['email', 'name', 'order']

    for(const field of requiredFields) {
        console.log(`Checking that ${field} is good`)
        if(!body[field]){
            return{
                statusCode: 400,
                body: JSON.stringify({
                    message: `You are missing the ${field} field.`
                })
            }
        }
    }
    
    //test send email.  rerun netlify, should see email in console and eventually get email in inbox 
    const info = await transporter.sendMail({
        from: "Slick's Slices <slick@example.com>",
        //to: "orders@example.com",
        to: `${body.name} <${body.email}>, orders@example.com`,
        subject: "New Order",
        //html: `<p>Your Pizza Order Is Here!</p>`
        html: generateOrderEmail({order: body.order, total: body.total})
    })
    //console.log(info)
    return{
        statusCode: 200,
        //body: JSON.stringify(info)
        body: JSON.stringify({message: 'Success'})
    }

}
