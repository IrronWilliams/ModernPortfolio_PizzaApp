
import React, {useState} from 'react'

export default function useForm(defaults){
    const [values, setValues] = useState(defaults)

    function updateValue(e){

        //let value = e.target.value
        let {value} = e.target //destructuring value 
        if (value === typeof(Number)){
            //value = parseInt(e.target.value) 
            value = parseInt(value)
        }
        
        setValues({
           ...values,
            [e.target.name]: value
        })   
    }

    return { values, updateValue }

}