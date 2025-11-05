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
    mutationFn: async (faction) => await modelService.getModelsForFaction(faction, true),
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
    mutationFn: async (faction) => await modelService.getModelsForFaction(faction, true),
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
    control: (provided, state) => ({
      ...provided,
      border: "none",
      borderRadius: "0.5rem",
      padding: "2px",
      minHeight: 44,
      background: "linear-gradient(to bottom right, #ec4899, #f97316)",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(236,72,153,.3)" : provided.boxShadow,
      alignItems: "center",
    }),
    valueContainer: (provided) => ({
      ...provided,
      backgroundColor: "#2b2a2a",
      borderRadius: "0.375rem",
      padding: "0.5rem 1rem",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",                // typing color
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",                // selected value color
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",                // placeholder color
      opacity: 0.9,
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      marginTop: 2,
      backgroundColor: "#2b2a2a",
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "pink" : 'white',        // text color on hover vs normal
      backgroundColor: state.isFocused ? "white" : "transparent", 
      cursor: "pointer",
    }),
  }

  return (
    <div 
      className="lg:w-1/2 mx-auto" 
      style={{
        '--ffa-image': selectedAttackImage ? `url(${selectedAttackImage})` : 'none',
        '--ffb-image': selectedDefenceImage ? `url(${selectedDefenceImage})` : 'none'
      }}>
      <div className="my-5">
        <h1 className="text-center text-white my-2 text-xl">Attacking Models Faction</h1>
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
        <h1 className="text-center text-white my-2 text-xl">Defending Models Faction</h1>
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
