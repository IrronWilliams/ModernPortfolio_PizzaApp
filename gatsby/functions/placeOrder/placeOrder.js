
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






const nodemailer = require('nodemailer');

//function that generates email. takes in data and interpolates. this is not React so syntax is different.  
function generateOrderEmail({ order, total }) {
  return `<div>
    <h2>Your Recent Order for ${total}</h2>
    <p>Your order ready will be ready in 15 minutes.</p>
    <ul>
      ${order
        .map(
          (item) => `<li>
        <img src="${item.thumbnail}" alt="${item.name}"/>
        ${item.size} ${item.name} - ${item.price}
      </li>`
        )
        .join('')}
    </ul>
    <p>Your total is <strong>$${total}</strong> due at pickup</p>
    <style>
        ul {
          list-style: none;
        }
    </style>
  </div>`;
}

// create a transport for nodemailer
const transporter = nodemailer.createTransport({
    
    //authentication variables needed to connect. 
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

//Not using this function. When user submits button, Placing Order message will display for x seconds. 
function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context) => {
  //await wait(5000)  //calling wait function. delays processing for 5 seconds
  const body = JSON.parse(event.body);
  // Check if they have filled out the honeypot
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Think you maybe a BOT. Goodbye' }),
    };
  }
  // //validate data coming in is correct. rerun npm run netlify, submit order. results in console
  const requiredFields = ['email', 'name', 'order'];

  for (const field of requiredFields) {
    console.log(`Checking that ${field} is good`);
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `You are missing the ${field} field`,
        }),
      };
    }
  }

  // make sure order is not empty. 
  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Are you sure you do not want to order anything?`,
      }),
    };
  }

   //test send email.  rerun netlify, should see email in console and eventually get email in inbox 
  const info = await transporter.sendMail({
    from: "Slick's Slices <slick@example.com>",
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: 'New order!',
    html: generateOrderEmail({ order: body.order, total: body.total }),
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};



