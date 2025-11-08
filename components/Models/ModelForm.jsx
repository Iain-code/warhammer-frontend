import React from 'react'
import { useContext, useMemo } from 'react'
import Select from 'react-select'
import AttackerContext from '../../contexts/attackerContext';
import DefenderContext from '../../contexts/defenderContext';
import ModelContext from '../../contexts/modelContext'
import { ClipLoader } from 'react-spinners'


const ModelForm = () => {
  const [attacker] = useContext(AttackerContext)
  const [defender] = useContext(DefenderContext)
  const [model, modelDispatch] = useContext(ModelContext)

  console.log('model', model)
  console.log('def', defender)
  console.log('atk', attacker)

  const groupedDefendingUnits = useMemo(() => {
    if (!defender || defender?.length === 0 ) return null

    const groups = {
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

    for (const item of defender) {

      let keywordArr = []

      if (item?.keywords?.length > 0) {
        keywordArr.concat(item.keywords.map(i => i.toLowerCase()))
      }

      if (keywordArr?.includes('epic hero')) {
        groups.epicHero = groups.epicHero.concat(item)
      } else if (keywordArr?.includes('character')) {
        groups.character = groups.character.concat(item)
      } else if (keywordArr?.includes('battleline')) {
        groups.battleline = groups.battleline.concat(item)
      } else if (keywordArr?.includes('transport')) {
        groups.transport = groups.transport.concat(item)
      } else if (keywordArr?.includes('mounted')) {
        groups.mounted = groups.mounted.concat(item)
      } else if (keywordArr?.includes('aircraft')) {
        groups.aircraft = groups.aircraft.concat(item)
      } else if (keywordArr?.includes('monster')) {
        groups.monster = groups.monster.concat(item)
      } else if (keywordArr?.includes('vehicle')) {
        groups.vehicle = groups.vehicle.concat(item)
      } else if (keywordArr?.includes('infantry')) {
        groups.infantry = groups.infantry.concat(item)
      }
    }
    return groups
  }, [defender])


  const groupedAttackingUnits = useMemo(() => {

    if (!attacker || attacker.length === 0) return null

    const groups = {
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
    
    for (let item of attacker) {

      let keywordArr = []

      if (item?.keywords?.length > 0) {
        keywordArr.concat(item.keywords.map(i => i.toLowerCase()).trim())
      }

      if (keywordArr?.includes('epic hero')) {
        groups.epicHero = groups.epicHero.concat(item)
      } else if (item.keywords?.includes('character')) {
        groups.character = groups.character.concat(item)
      } else if (keywordArr?.includes('battleline')) {
        groups.battleline = groups.battleline.concat(item)
      } else if (keywordArr?.includes('transport')) {
        groups.transport = groups.transport.concat(item)
      } else if (keywordArr?.includes('mounted')) {
        groups.mounted = groups.mounted.concat(item)
      } else if (keywordArr?.includes('aircraft')) {
        groups.aircraft = groups.aircraft.concat(item)
      } else if (keywordArr?.includes('monster')) {
        groups.monster = groups.monster.concat(item)
      } else if (keywordArr?.includes('vehicle')) {
        groups.vehicle = groups.vehicle.concat(item)
      } else if (keywordArr?.includes('infantry')) {
        groups.infantry = groups.infantry.concat(item)
      }
    }
    return groups
  }, [attacker])

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

  const optionsAttacking = [
    {
      label: 'Epic Heroes',
      options: (groupedAttackingUnits?.epicHero || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Characters',
      options: (groupedAttackingUnits?.character || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Battleline',
      options: (groupedAttackingUnits?.battleline || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Transports',
      options: (groupedAttackingUnits?.transport || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Mounted',
      options: (groupedAttackingUnits?.mounted || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Aircraft',
      options: (groupedAttackingUnits?.aircraft || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Monsters',
      options: (groupedAttackingUnits?.monster || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Vehicles',
      options: (groupedAttackingUnits?.vehicle || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Infantry',
      options: (groupedAttackingUnits?.infantry || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
  ]

  const optionsDefending = [
    {
      label: 'Epic Heroes',
      options: (groupedDefendingUnits?.epicHero || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Characters',
      options: (groupedDefendingUnits?.character || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Battleline',
      options: (groupedDefendingUnits?.battleline || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Transports',
      options: (groupedDefendingUnits?.transport || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Mounted',
      options: (groupedDefendingUnits?.mounted || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Aircraft',
      options: (groupedDefendingUnits?.aircraft || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Monsters',
      options: (groupedDefendingUnits?.monster || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Vehicles',
      options: (groupedDefendingUnits?.vehicle || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
    {
      label: 'Infantry',
      options: (groupedDefendingUnits?.infantry || []).sort((a,b) => a.name.localeCompare(b.name)),
    },
  ]

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

  if (groupedAttackingUnits === null || groupedDefendingUnits === null) return <ClipLoader />

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