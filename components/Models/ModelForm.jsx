import React from 'react'
import { useContext, useState, useEffect } from 'react'
import Select from 'react-select'
import AttackerContext from '../../contexts/attackerContext';
import DefenderContext from '../../contexts/defenderContext';
import ModelContext from '../../contexts/modelContext'
import { ClipLoader } from 'react-spinners'

const ModelForm = () => {
  const [attacker] = useContext(AttackerContext)
  const [defender] = useContext(DefenderContext)
  const [, modelDispatch] = useContext(ModelContext)
  const [atkGroups, setAtkGroups] = useState({
    epicHero: [],
    character: [],
    battleline: [],
    transport: [],
    mounted: [],
    aircraft: [],
    monster: [],
    vehicle: [],
    infantry: []
  })
  const [defGroups, setDefGroups] = useState({
    epicHero: [],
    character: [],
    battleline: [],
    transport: [],
    mounted: [],
    aircraft: [],
    monster: [],
    vehicle: [],
    infantry: []
  })

  let optionsAttacking = []
  let optionsDefending = []

  console.log('def', defender)
  console.log('atk', attacker)

  useEffect(() => {
    
    const newGroupsDef = {
      epicHero: [],
      character: [],
      battleline: [],
      transport: [],
      mounted: [],
      aircraft: [],
      monster: [],
      vehicle: [],
      infantry: []
    }
    const newGroups = {
      epicHero: [],
      character: [],
      battleline: [],
      transport: [],
      mounted: [],
      aircraft: [],
      monster: [],
      vehicle: [],
      infantry: []
    }

    for (const item of attacker) {

      let keywordArr = []

      if (item?.keywords?.length > 0) {
        keywordArr = (item?.keywords || []).map(k => k.toLowerCase().trim());
      }

      if (keywordArr?.includes('epic hero')) {
        newGroups.epicHero.push(item)
      } else if (keywordArr?.includes('character')) {
        newGroups.character.push(item)
      } else if (keywordArr?.includes('battleline')) {
        newGroups.battleline.push(item)
      } else if (keywordArr?.includes('transport')) {
        newGroups.transport.push(item)
      } else if (keywordArr?.includes('mounted')) {
        newGroups.mounted.push(item)
      } else if (keywordArr?.includes('aircraft')) {
        newGroups.aircraft.push(item)
      } else if (keywordArr?.includes('monster')) {
        newGroups.monster.push(item)
      } else if (keywordArr?.includes('vehicle')) {
        newGroups.vehicle.push(item)
      } else if (keywordArr?.includes('infantry')) {
        newGroups.infantry.push(item)
      }
    }
    setAtkGroups(newGroups)


    for (let item of defender) {

      let keywordArr = []

      if (item?.keywords?.length > 0) {
        keywordArr = (item?.keywords || []).map(k => k.toLowerCase().trim());
      }

      if (keywordArr?.includes('epic hero')) {
        newGroupsDef.epicHero.push(item)
      } else if (keywordArr?.includes('character')) {
        newGroupsDef.character.push(item)
      } else if (keywordArr?.includes('battleline')) {
        newGroupsDef.battleline.push(item)
      } else if (keywordArr?.includes('transport')) {
        newGroupsDef.transport.push(item)
      } else if (keywordArr?.includes('mounted')) {
        newGroupsDef.mounted.push(item)
      } else if (keywordArr?.includes('aircraft')) {
        newGroupsDef.aircraft.push(item)
      } else if (keywordArr?.includes('monster')) {
        newGroupsDef.monster.push(item)
      } else if (keywordArr?.includes('vehicle')) {
        newGroupsDef.vehicle.push(item)
      } else if (keywordArr?.includes('infantry')) {
        newGroupsDef.infantry.push(item)
      }
    }
    setDefGroups(newGroupsDef)

    optionsAttacking = [
      {
        label: 'Epic Heroes',
        options: ([...(atkGroups?.epicHero || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Characters',
        options: ([...(atkGroups?.character || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Battleline',
        options: ([...(atkGroups?.battleline || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Transports',
        options: ([...(atkGroups?.transport || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Mounted',
        options: ([...(atkGroups?.mounted || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Aircraft',
        options: ([...(atkGroups?.aircraft || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Monsters',
        options: ([...(atkGroups?.monster || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Vehicles',
        options: ([...(atkGroups?.vehicle || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Infantry',
        options: ([...(atkGroups?.infantry || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
    ]

    optionsDefending = [
      {
        label: 'Epic Heroes',
        options: ([...(defGroups?.epicHero || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Characters',
        options: ([...(defGroups?.character || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Battleline',
        options: ([...(defGroups?.battleline || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Transports',
        options: ([...(defGroups?.transport || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Mounted',
        options: ([...(defGroups?.mounted || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Aircraft',
        options: ([...(defGroups?.aircraft || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Monsters',
        options: ([...(defGroups?.monster || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Vehicles',
        options: ([...(defGroups?.vehicle || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
      {
        label: 'Infantry',
        options: ([...(defGroups?.infantry || [])]).sort((a,b) => a.name.localeCompare(b.name)),
      },
    ]
  }, [attacker, defender])

  const handleAttackerModel = (modelObject) => {
    modelDispatch({
      type: 'attacker',
      payload: modelObject
    })
  }

  const handleDefenderModel = (modelObject) => {
    modelDispatch({
      type: 'defender',
      payload: modelObject
    })
  }


  console.log('atk options', optionsAttacking)
  console.log('def options', optionsDefending)
  console.log('attacker len', Array.isArray(attacker) ? attacker.length : attacker);
  console.log('defender len', Array.isArray(defender) ? defender.length : defender);
  console.log('first attacker', attacker?.[0]);
  console.log('first defender', defender?.[0]);

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
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white", 
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
      color: state.isFocused ? "pink" : 'white',
      backgroundColor: state.isFocused ? "white" : "transparent", 
      cursor: "pointer",
    }),
    groupHeading: (provided) => ({
      ...provided,
      color: "#f97316",
      fontWeight: "bold",
      fontSize: "0.9rem",
      textTransform: "uppercase",
      padding: "6px 12px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "#1e1e1e",
      letterSpacing: "0.05em",
    }),
  }

  if (!attacker || !defender || !defGroups || !atkGroups) return (<ClipLoader />)

  return (
    <div>
      <div className='flex flex-col lg:flex-row justify-center my-3 w-5/6 mx-auto lg:gap-10'>
        <Select
          styles={customStyles}
          className='lg:w-1/4 lg:flex-col my-1'
          options={optionsAttacking}
          onChange={(model) => handleAttackerModel(model)}
          placeholder="Select an attacker..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
        />
        <Select
          styles={customStyles}
          className='lg:w-1/4 my-1'
          options={optionsDefending}
          onChange={(model) => handleDefenderModel(model)}
          placeholder="Select a defender..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
        />
      </div>
    </div>
  )
}

export default ModelForm