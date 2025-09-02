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

  console.log('atkwargear', atkWargear)

  return (
    <div>
      <div>
        {atkWargear && atkWargear.length > 0 &&
        <div  className='flex justify-center text-white'>
          <ul className="flex w-3/4 gap-3">
            {atkWargear.map(item =>
              <li key={item.id} className="flex flex-1">
                <button
                  onClick={() => chooseWargear(item)}
                  className="
              flex-1 rounded-2xl border border-white/10 bg-white/5
              shadow-lg lg:px-4 lg:py-6 lg:mb-5 lg:gap-2
              hover:bg-white/10 hover:shadow-xl
              transition-all duration-200 ease-in-out
            "
                >{item.name} <br /> {item.type}</button>
              </li>
            )}
          </ul>
        </div>
        }
      </div>
      <div>
        {atkWargear && chosenWargear &&
        <div  className="">
          <ModelProfile 
            wargear={chosenWargear}
          />
          <ExtraRules 
            className='extraRules' 
            wargear={chosenWargear} 
            defender={defender}
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