
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export default {

    siteMetadata: { 
        title: 'Slicks Slices',
        siteURL: 'https://gatsby.pizza',
        description: 'The Best Pizza Ever!',
        twitter: '@slicksSlices',
    },

    plugins: [
        'gatsby-plugin-styled-components',
        'gatsby-plugin-react-helmet',  

        {
            resolve: 'gatsby-source-sanity',
            options: {
                projectId: '5nrbsmkg',
                dataset: 'production',
                watchMode: true,
                token: process.env.SANITY_TOKEN,
            }
        }

    ]

}
