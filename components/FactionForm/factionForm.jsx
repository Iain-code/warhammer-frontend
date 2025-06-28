import React, { useEffect } from "react";
import { useContext, useState } from "react";
import modelService from "../../requests/models";
import Select from 'react-select';
import AttackerContext from "../../attackerContext";
import DefenderContext from "../../defenderContext";
import { useMutation } from '@tanstack/react-query'
import PropTypes from "prop-types";

const options = [
  { value: 'AdM', label: 'Ad Mech', img: '/AdM.webp' },
  { value: 'AC', label: 'Adeptus Custodes', img: '/custodes.jpg' },
  { value: 'AE', label: 'Aeldari', img: '/AE.jpg' },
  { value: 'AM', label: 'Astra Militarum', img: '/AM.jpg' },
  { value: 'AS', label: 'Adepta Soroitas', img: '/sisters.jpg' },
  { value: 'AoI', label: 'Agents of the Imperium', img: '/AoI.jpg' },
  { value: 'CD', label: 'Chaos Daemons', img: '/CD.jpg' },
  { value: 'QT', label: 'Chaos Knights', img: '/QT.webp' },
  { value: 'CSM', label: 'Chaos Space Marines', img: '/CSM.jpg' },
  { value: 'DG', label: 'Death Guard', img: '/DG.jpg' },
  { value: 'DRU', label: 'Drukari', img: '/DRU.webp' },
  { value: 'GC', label: 'Genestealer Cults', img: '/gsc.jpg' },
  { value: 'GK', label: 'Grey Knights', img: '/GK.webp' },
  { value: 'QI', label: 'Imperial Knights', img: '/Imperial_Knights.webp' },
  { value: 'LoV', label: 'Leagues of Votaan', img: '/LoV.webp' },
  { value: 'NEC', label: 'Necrons', img: '/NEC.jpg' },
  { value: 'ORK', label: 'Orks', img: '/Orks.webp' },
  { value: 'SM', label: 'Space Marines', img: '/SpaceMarines.jpeg' },
  { value: 'TS', label: 'Thousand Sons', img: '/TSONS.png' },
  { value: 'TAU', label: 'Tau Empire', img: '/tau.jpg' },
  { value: 'TYR', label: 'Tyranids', img: '/TYR.jpg' },
  { value: 'WE', label: 'World Eaters', img: '/WE.jpg' },
];

const FactionForm = ({ visibility }) => {
  const [attack, setAttack] = useState(null)
  const [defend, setDefend] = useState(null)
  const [attacker, attackerDispatch] = useContext(AttackerContext)
  const [defender, defenderDispatch] = useContext(DefenderContext)
  const [selectedAttackImage, setSelectedAttackImage] = useState(null);
  const [selectedDefenceImage, setSelectedDefenceImage] = useState(null);

  useEffect(() => {
    if (attacker === null || defender === null) {
      visibility(false)
    } else {
      visibility(true)
    }
  }, [attacker, defender, visibility])

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
          options={options}
          onChange={handleAttackerChange}
          placeholder="Select an attacker..."
          isSearchable
          maxMenuHeight={200}
        />
        <button className='factionFormButton' type='submit'>Get Models</button>
        <Select
          styles={customStyles}
          className="factionForm-selectB"
          options={options} 
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
  visibility: PropTypes.func.isRequired,
}

export default FactionForm;
