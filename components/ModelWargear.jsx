import ModelContext from "../modelContext"
import { useContext, useEffect, useState } from 'react'
import modelService from '../requests/models'
import { useMutation } from "@tanstack/react-query"
import React from 'react'
import Select from 'react-select'
import PropTypes from "prop-types"
import ExtraRules from "./ExtraRules"
import ModelProfile from "./ModelProfiles"


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
    <div className="modelWargear">
      <Select className="modelWargear-select"
        options={atkWargear}
        onChange={(wargear) => chooseWargear(wargear)}
        placeholder='Choose your weapon...'
        isSearchable
        getOptionLabel={(option) => option.name.String}
        getOptionValue={(option) => option.FIELD2}
        maxMenuHeight={150}
      />

      {atkWargear && chosenWargear &&
      <div>
        {console.log('chosen wargear --- ', chosenWargear)}
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
  ) 
}

ExtraRules.propTypes = {
  wargear: PropTypes.node.isRequired,
};

export default ModelWargear