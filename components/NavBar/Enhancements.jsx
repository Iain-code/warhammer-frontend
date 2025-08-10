import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import RosterContext from '../../contexts/rosterContext'
import parse, { domToReact } from 'html-react-parser'

const Enhancements = ({ enhancements, faction }) => {
  const [chosen, setChosen] = useState(false)
  const [chosenDetachment, setChosenDetatchment] = useState(null)
  const [roster, rosterDispatch] = useContext(RosterContext)
  const [enhanceToggle, setEnhanceToggle] = useState(true)
  
  if (!enhancements) return

  const armyEnhance = enhancements.filter(e => e.faction_id === faction)

  const detachments = armyEnhance.reduce((object, enhance) => {
    if (!object[enhance.detachment]) {
      object[enhance.detachment] = []
    }

    object[enhance.detachment].push(enhance)
    return object
  }, {})

  const split = Object.entries(detachments)

  const chooseDetachment = (detachmentObj) => {
    setChosenDetatchment(detachmentObj)
    setChosen(true)
    setEnhanceToggle(true)
  }
  
  const removeDetachment = () => {
    setChosenDetatchment(null)
    setChosen(false)

    const e = chosenDetachment[1].filter(item => {
      return roster.enhancement.includes(item.name)
    })

    const cost = e.reduce((total, item) => total + item.cost, 0)

    rosterDispatch({
      type: 'removeEnhancements',
      payload: {
        cost: cost,
        enhancements: []
      }
    })
  }

  const addEnhancementToRoster = (cost, name) => {
    
    if (roster.enhancement && roster.enhancement.includes(name)) {
      rosterDispatch({
        type: 'remove',
        payload: {
          cost: cost,
          enhancement: name
        }
      })
      return
    }

    rosterDispatch({
      type: 'add',
      payload: cost
    })
    rosterDispatch({
      type: 'enhancement',
      payload: name
    })
  }

  const cleanDescription = (d) => {
    return parse(d.description, {
      replace: domNode => {
        if (domNode.name === 'a') {
          return <span>{domToReact(domNode.children)}</span>;
        }
      }
    })
  }
 
  return (
    <div className='flex lg:flex-row flex-wrap justify-center text-white'>
      {split.map(e => (
        <div key={e[0]}>
          {e[1].length === 4 && !chosen && (
            <button 
              onClick={() => chooseDetachment(e)}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >
              {e[0]}
            </button>
          )}
        </div>
      ))}
      {chosen && !enhanceToggle && 
        <div>
          <button
            onClick={() => setEnhanceToggle(true)}
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
          >Show Enhancements</button>
        </div>}
      {chosenDetachment && enhanceToggle &&
       <div className="flex flex-col justify-center">
         <div className="flex flex-row justify-center">
           <button 
             onClick={() => removeDetachment()}
             className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 mx-auto"
           >Change Detachment</button>
           <button 
             onClick={() => setEnhanceToggle(false)}
             className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 mx-auto"
           >Close Enhancements</button>
         </div>
         <br />
         <h4 className='mx-auto m-3 text-xl font-semibold'>
           {chosenDetachment[0]}
         </h4>
         {chosenDetachment[1].map(d =>
           <div key={d.id} className="border-b border-gray-600 pb-4 mb-6 w-3/4 mx-auto">
             <span className='flex justify-center mx-auto font-semibold text-lg'>{d.name} - {d.cost}</span>
             <br />
             <p className="text-center mx-auto px-2">{cleanDescription(d)}</p>
             <br />
             <button
               onClick={() => addEnhancementToRoster(d.cost, d.name)}
               className="flex text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 mx-auto"  
             >Add/Remove</button>
           </div>
         )}
       </div>
      }
    </div>
  )
}

Enhancements.propTypes = {
  enhancements: PropTypes.object,
  faction: PropTypes.string,
  changeEnhanceToggle: PropTypes.func,
  enhanceToggle: PropTypes.bool
}

export default Enhancements