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
        <div className='flex justify-center text-white border border-red'>
          <ul className="
            grid w-full max-w-5xl gap-3
            grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6
          ">
            {atkWargear.map(item => (
              <li key={item.id} className="aspect-[2/1] border border-blue"> 
                <button
                  onClick={() => chooseWargear(item)}
                  className="
                    h-full w-full
                    rounded-2xl border border-white/10 bg-white/5
                    shadow-lg px-4 py-4
                    hover:bg-white/10 hover:shadow-xl
                    transition-all duration-200 ease-in-out
                    flex flex-col items-center justify-center text-center
                  "
                >
                  <p className="font-semibold truncate w-full">{item.name}</p>
                  <p className="truncate w-full">{item.type}</p>
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