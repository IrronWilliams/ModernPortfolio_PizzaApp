/*creating a handler. These are AWS Lambda functions under the hood.  */

exports.handler = async (event, context) =>{
    return{
        statusCode: 200,
        body: 'Hello',

    };
};