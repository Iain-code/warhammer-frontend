import React, { useEffect } from "react";
import { useContext, useState } from "react";
import modelService from "../../requests/models";
import Select from 'react-select';
import AttackerContext from "../../attackerContext";
import DefenderContext from "../../defenderContext";
import { useMutation } from '@tanstack/react-query'
import PropTypes from "prop-types";
import factionList from './FactionList'

const FactionForm = ({ setShowForm }) => {
  const [attack, setAttack] = useState(null)
  const [defend, setDefend] = useState(null)
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
    setAttack(faction.value)
    setSelectedAttackImage(faction.img)
  };

  const handleDefenderChange = (faction) => {
    setDefend(faction.value)
    setSelectedDefenceImage(faction.img)
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

  const findFaction = (attack, defend) => {
    attackerMutation.mutate(attack)
    defenderMutation.mutate(defend)
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
    <div 
      className="factionForm" 
      style={{
        '--ffa-image': selectedAttackImage ? `url(${selectedAttackImage})` : 'none',
        '--ffb-image': selectedDefenceImage ? `url(${selectedDefenceImage})` : 'none'
      }}>
      <form onSubmit={(event) => {event.preventDefault(), findFaction(attack, defend)}}>
        <Select
          styles={customStyles}
          className="factionForm-selectA"
          options={factionList}
          onChange={handleAttackerChange}
          placeholder="Select an attacker..."
          isSearchable
          maxMenuHeight={200}
        />
        <button className='factionFormButton' type='submit'>Get Models</button>
        <Select
          styles={customStyles}
          className="factionForm-selectB"
          options={factionList} 
          onChange={handleDefenderChange}
          placeholder='Select a defender...'
          isSearchable
          maxMenuHeight={200}
        />
      </form>
    </div>
  );
}

FactionForm.propTypes = {
  setShowForm: PropTypes.func.isRequired,
}

export default FactionForm;
