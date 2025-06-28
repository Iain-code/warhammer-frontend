import ModelContext from "../../modelContext"
import { useContext, useEffect, useState } from 'react'
import modelService from '../../requests/models'
import { useMutation } from "@tanstack/react-query"
import React from 'react'
import Select from 'react-select'
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#2b2a2a',
      borderColor: 'orangered',
      borderRadius: '8px',
      padding: '4px',
      boxShadow: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isFocused ? 'orangered' : 'antiquewhite',
      backgroundColor: state.isFocused ? 'white' : '#2b2a2a',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#2b2a2a',
      width: 'inherit',
      minWidth: '100%',
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: '#2b2a2a',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'antiquewhite',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'AntiqueWhite'
    })
  }

  return (
    <div className="modelWargear">
      <Select className="modelWargear-select"
        styles={customStyles}
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