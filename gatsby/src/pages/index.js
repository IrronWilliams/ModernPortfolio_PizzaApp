

import React from 'react'
import useLatestData from '../utils/useLatestData'
import {HomePageGrid} from '../styles/Grids'
import LoadingGrid from '../components/LoadingGrid'
import ItemGrid from '../components/ItemGrid'

function CurrentlySlicing({slicemasters}){
    
    return(
        <div>
            <h2 className='center'>
                <span className='mark tilt'>Slicemasters On</span>
            </h2>
            <p>Our Exceptional Slice Masters Are Here For You</p>
            {!slicemasters && <LoadingGrid count={4}/>}
            {slicemasters && !slicemasters?.length && (
                <p>No one is working at the moment</p>
            )}
            {slicemasters?.length && <ItemGrid items={slicemasters} />}
        </div>
    )
} 

function HotSlices({hotSlices}){
    return(
        <div>
            <h2 className='center'>
                <span className='mark tilt'>Hot Slices On</span>
            </h2>
            <p>Here Are Our Available Fresh Slices</p>
            {!hotSlices && <LoadingGrid count={4}/>}
            {hotSlices && !hotSlices?.length && (
                <p>No slices available at the moment</p>
            )}
            {hotSlices?.length && <ItemGrid items={hotSlices} />}
        </div>
    )
} 

export default function HomePage() {
    
    const {hotSlices, slicemasters} = useLatestData()
    
    return (
        
        <div className='center'>
            <h1>The Best Pizza In Town</h1>
            <p>Open 11-11 Everyday</p>
            <HomePageGrid>
                <CurrentlySlicing slicemasters={slicemasters}/>
                <HotSlices hotSlices={hotSlices}/>
            </HomePageGrid>
        </div>
        
    )
}