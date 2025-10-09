import ModelContext from "../../contexts/modelContext"
import { useContext, useEffect, useState } from 'react'
import modelService from '../../requests/models'
import { useMutation } from "@tanstack/react-query"
import React from 'react'
import PropTypes from "prop-types"
import ExtraRules from "../Fight/ExtraRules"
import ModelProfile from "../Models/ModelProfiles"


const ModelWargear = () => {
  const [model] = useContext(ModelContext)
  const [atkWargear, setAtkWargear] = useState(null)
  const [, setDefWargear] = useState(null)
  const [chosenWargear, setChosenWargear] = useState(null)

  const attacker = model.attack
  const defender = model.defence
 
  const attackerWargearMutation = useMutation({
    mutationFn: (id) => modelService.getWargear(id),
    onSuccess: (wargear) => {
      setAtkWargear(wargear)
    },
    onError: (error) => {
      console.error('failed to retrieve wargear:', error)
    }
  })

  const defenderWargearMutation = useMutation({
    mutationFn: (id) => modelService.getWargear(id),
    onSuccess: (wargear) => {
      setDefWargear(wargear)
    },
    onError: (error) => {
      console.error('failed to retrieve wargear:', error)
    }
  })
  
  useEffect(() => {
    attackerWargearMutation.mutate(attacker.datasheet_id)
    defenderWargearMutation.mutate(defender.datasheet_id)
  }, [model])

  const chooseWargear = (wargear) => {
    setChosenWargear(wargear)
  }

  return (
    <div>
      <div className='flex flex-col justify-center text-center border border-white'>
        <h1 className='text-xl my-2 text-white'>Select a weapon profile</h1>
      </div>
      <div>
        {atkWargear && atkWargear.length > 0 &&
        <div className='flex lg:flex-row lg:flex-wrap justify-center text-white'>
          <ul className="">
            {atkWargear.map(item => (
              <li key={item.id} className=""> 
                <button
                  onClick={() => chooseWargear(item)}
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                    group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                    focus:ring-pink-200"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    {item.name} - {item.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        }
      </div>
      <div>
        {atkWargear && chosenWargear &&
        <div className="mt-4">
          <ModelProfile 
            wargear={chosenWargear}
          />
          <ExtraRules 
            className='extraRules' 
            wargear={chosenWargear}
          />
        </div>
        }
      </div>
    </div>
  ) 
}

ExtraRules.propTypes = {
  wargear: PropTypes.node.isRequired,
};

export default ModelWargear