
import {useState, useEffect} from 'react'
const gql = String.raw  
const deets = `
    name
    _id
    image {
      asset {
        url
        metadata {
          lqip
        }
      }
    }
`;



export default function useLatestData(){

    const [hotSlices, setHotSlices] = useState()

    const [slicemasters, setSliceMasters] = useState()

  useEffect(function () {

    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemaster {
                ${deets}
              }
              hotslices {
                ${deets}
              }
            }
          }
        `,
      }),


    })
      .then((res) => res.json())
      .then((res) => {
        setHotSlices(res.data.StoreSettings.hotslices);
        setSliceMasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log('Error from querying endpoint for main page:');
        console.log(err);
      });
  }, []);
  return {
    hotSlices,
    slicemasters,
  };

}