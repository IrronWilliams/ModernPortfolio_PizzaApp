import React from 'react'
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event'

/*This section creates a custom CMS input. 
Take what user has typed in the input box, pass value to createPatchFrom(). If that value is nothing
or empty, then unset/remove the value. Otherwise, if not empty, then set the value the user has entered. 
Sanity will then take the value and 'Patch' it to itself for things like live updating and live preview. 
Sanity uses its own internal API to set or unset value. 

ref={inputComponent} tells Sanity this is the actual input where the changing of value happens. The h2
and p tags do not have anything to do with the data that is saved or unsaved. 

The set and unset functions allows me to set a value or remove the value if it is empty. 

Intl.NumberFormat() is built in the browser and is a way to format money based upon the user local. 
Using function to display total amount of pizza(s).

GETTING THE FOLLOWING WARNING IN THE CONSOLE:
Warning: Function components cannot be given refs. Attempts to access this ref will fail. 
Did you mean to use React.forwardRef()?
*/

function createPatchFrom(value) {
    //console.log('working???')
    return PatchEvent.from(value === '' ? unset() : set(Number(value)))
}

const formatMoney = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).format


export default function PriceInput({type, value, onChange, inputComponent}){
    return(
        <div>
            <h2>{type.title} - {value ? formatMoney(value/100) : ''}</h2>
            <p>{type.description}</p>
            <input
                type={type.name}
                value={value}
                onChange={event => onChange(createPatchFrom(event.target.value))}
                ref={inputComponent}
                //forwardRef={inputComponent}
            />
        </div>
    )
}

/*Adding a focus state to PriceInput. This allows Sanity to focus the input if it needs to. This
exposes a focus function for Sanity to run it need be. */
// PriceInput.focus = function() {
//     this._inputElement.focus()
// }