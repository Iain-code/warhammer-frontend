import React, { useEffect } from "react";
import { useContext, useState } from "react";
import modelService from "../../requests/models";
import Select from 'react-select';
import AttackerContext from "../../contexts/attackerContext";
import DefenderContext from "../../contexts/defenderContext";
import { useMutation } from '@tanstack/react-query'
import PropTypes from "prop-types";
import factionList from './FactionList'

const FactionForm = ({ setShowForm }) => {
  const [attacker, attackerDispatch] = useContext(AttackerContext)
  const [defender, defenderDispatch] = useContext(DefenderContext)
  const [selectedAttackImage, setSelectedAttackImage] = useState(null);
  const [selectedDefenceImage, setSelectedDefenceImage] = useState(null);

  useEffect(() => {
    if (attacker === null || defender === null) {
      setShowForm(false)
    } else {
      setShowForm(true)
    }
  }, [attacker, defender, setShowForm])

  const handleAttackerChange = (faction) => {
    setSelectedAttackImage(faction.img)
    attackerMutation.mutate(faction.value)
  }

  const handleDefenderChange = (faction) => {
    setSelectedDefenceImage(faction.img)
    defenderMutation.mutate(faction.value)
  }

  const defenderMutation = useMutation({
    mutationFn: async (faction) => await modelService.getModelsForFaction(faction),
    onSuccess: (models) => {
      defenderDispatch({
        type: 'model',
        payload: models
      })
    },
    onError: (error) => {
      console.error('failed to fetch models:', error)
    }
  })

  const attackerMutation = useMutation({
    mutationFn: async (faction) => await modelService.getModelsForFaction(faction),
    onSuccess: (models) => {
      attackerDispatch({
        type: 'model',
        payload: models
      })
    },
    onError: (error) => {
      console.error('failed to fetch models:', error)
    }
  })

  const customStyles = {
    menuPortal: (base) => ({ 
      ...base, zIndex: 5000 
    }),
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
      zIndex: 5000
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
    <div 
      className="pt-[120px] w-1/2 mx-auto" 
      style={{
        '--ffa-image': selectedAttackImage ? `url(${selectedAttackImage})` : 'none',
        '--ffb-image': selectedDefenceImage ? `url(${selectedDefenceImage})` : 'none'
      }}>
      <div className="my-5">
        <h1 className="text-center text-white">Attacker</h1>
        <Select
          styles={customStyles}
          className="factionForm-selectA"
          options={factionList}
          onChange={handleAttackerChange}
          placeholder="Select an attacker..."
          isSearchable
          menuPosition="fixed"
        />
      </div>
      <div>
        <h1 className="text-center text-white">Defender</h1>
        <Select
          styles={customStyles}
          className="factionForm-selectB"
          options={factionList} 
          onChange={handleDefenderChange}
          placeholder='Select a defender...'
          isSearchable
          menuPosition="fixed"
        />
      </div>
    </div>
  );
}

FactionForm.propTypes = {
  setShowForm: PropTypes.func.isRequired,
}

export default FactionForm;
