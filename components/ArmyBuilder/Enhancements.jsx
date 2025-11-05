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
    <div className='flex flex-wrap justify-center text-white mx-auto'>
      {split.map(e => (
        <div key={e[0]} className=''>
          {e[1].length === 4 && !chosen && (
            <button 
              onClick={() => chooseDetachment(e)}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                {e[0]}
              </span>
            </button>
          )}
        </div>
      ))}
      {chosen && !enhanceToggle && 
        <div>
          <button
            onClick={() => setEnhanceToggle(true)}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Show Enhancements</span></button>
        </div>}
      {chosenDetachment && enhanceToggle &&
       <div className="flex flex-col justify-center">
         <div className="flex flex-row justify-center">
           <button 
             onClick={() => removeDetachment()}
             className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800"
           >
             <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Change Detachment
             </span>
           </button>
           <button 
             onClick={() => setEnhanceToggle(false)}
             className="relative inline-flex items-center justify-center mx-1 p-0.5 mb-2 me-2 
              overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800"
           >
             <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
             Close Enhancements
             </span>
           </button>
         </div>
         <br />
         <h4 className='mx-auto m-3 text-xl font-semibold'>
           {chosenDetachment[0]}
         </h4>
         {chosenDetachment[1].map(d =>
           <div key={d.id} className="flex flex-col border-b border-gray-600 pb-4 mb-6">
             <span className='mx-auto font-semibold text-lg'>{d.name} - {d.cost}</span>
             <p className="text-center mx-auto px-2">{cleanDescription(d)}</p>
             <button
               onClick={() => addEnhancementToRoster(d.cost, d.name)}
               className="flex
                items-center justify-center mx-auto p-0.5 mt-4 mb-2 text-md font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800" 
             >
               <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Add/Remove</span></button>
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