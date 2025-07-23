import React from "react"
import { useContext, useState, useEffect } from "react"
import Select from 'react-select'
import UserContext from "../../userContext"
import './armybuilder.css'
import { useQuery } from "@tanstack/react-query"
import modelService from '../../requests/models'
import factionList from '../FactionForm/FactionList'
import UnitTable from "./UnitTable"

const ArmyBuilder = () => {
  const [user] = useContext(UserContext)
  const [faction, setFaction] = useState(null)
  const [, setFactionImage] = useState(null)
  const [groupedUnits, setGroupedUnits] = useState({
    characters: [],
    battleline: [],
    transports: [],
    vehicles: [],
    monsters: [],
    mounted: [],
    aircraft: []
  })
  const [tableBool, setTableBool] = useState({
    characters: false,
    battleline: false,
    transports: false,
    vehicles: false,
    monsters: false,
    mounted: false,
    aircraft: false
  })
  
  const units = useQuery({
    queryKey: ['faction', faction],
    queryFn: () => modelService.getModelsForFaction(faction),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const keywords = useQuery({
    queryKey: ['keyword', faction],
    queryFn: () => modelService.getKeywordsForFaction(faction),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const wargear = useQuery({
    queryKey: ['wargear', faction],
    queryFn: () => getWargearForModels(),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const points = useQuery({
    queryKey: ['points', faction],
    queryFn: () => sortUnitsAndFetchData(),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const sortUnitsAndFetchData = async () => {
    const IDs = units.data.map(unit => unit.datasheet_id)
    console.log('IDs:', IDs)
    const response = await modelService.getPointsForID(IDs)
    return response
  }
  console.log('Points', points.data)

  const getWargearForModels = async () => {
  }

  useEffect(() => {
    if (!units.data || !keywords.data) return

    const keywordMap = keywords.data.reduce((object, keyword) => {
      if (!object[keyword.datasheet_id]) {
        object[keyword.datasheet_id] = []
      }
      object[keyword.datasheet_id].push(keyword.keyword)
      return object
    }, {})

    const initialGroups = {
      characters: [],
      battleline: [],
      transports: [],
      vehicles: [],
      monsters: [],
      mounted: [],
      aircraft: [],
    }

    for (const unit of units.data) {
      const unitKeywords = keywordMap[unit.datasheet_id] || []
      const added = { ...unit, keywords: unitKeywords }

      if (unitKeywords.includes('Character')) {
        initialGroups.characters.push(added)
      } else if (unitKeywords.includes('Battleline')) {
        initialGroups.battleline.push(added)
      } else if (unitKeywords.includes('Transport')) {
        initialGroups.transports.push(added)
      } else if (unitKeywords.includes('Aircraft')) {
        initialGroups.aircraft.push(added)
      } else if (unitKeywords.includes('Monster')) {
        initialGroups.monsters.push(added)
      } else if (unitKeywords.includes('Mounted')) {
        initialGroups.mounted.push(added)
      } else if (unitKeywords.includes('Vehicle')) {
        initialGroups.vehicles.push(added)
      }
    }

    setGroupedUnits(initialGroups)
  }, [units.data, keywords.data])

  const handleFactionChange = (faction) => {
    setFaction(faction)
    setFactionImage(faction.img)
  };

  if (!user) {
    return <div className="builderError">Please login to use the army builder</div>
  }

  const tableHelper = (unitType) => {
    setTableBool(object => ({ ...object, [unitType]: !object[unitType] }))
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
    <div className="armyBuilder">
      <h4>Army Builder</h4>
      <Select
        styles={customStyles}
        options={factionList}
        onChange={(faction) => handleFactionChange(faction.value)}
        placeholder="Select a faction..."
        isSearchable
        maxMenuHeight={200}
      />
      <div className="armyList">
        {units.isLoading && <div>Loading data...</div>}
        {units.isError && <div>Error loading data...</div>}
        {units.data &&
        <div>
          <button onClick={() => tableHelper('characters')}>Characters</button>
          <UnitTable groupedUnits={groupedUnits.characters} toShow={tableBool.characters} />
          <button onClick={() => tableHelper('battleline')}>BattleLine</button>
          <UnitTable groupedUnits={groupedUnits.battleline} toShow={tableBool.battleline} />
          <button onClick={() => tableHelper('transports')}>Transports</button>
          <UnitTable groupedUnits={groupedUnits.transports} toShow={tableBool.transports} />
          <button onClick={() => tableHelper('vehicles')}>Vehicles</button>
          <UnitTable groupedUnits={groupedUnits.vehicles} toShow={tableBool.vehicles} />
          <button onClick={() => tableHelper('monsters')}>Monsters</button>
          <UnitTable groupedUnits={groupedUnits.monsters} toShow={tableBool.monsters} />
          <button onClick={() => tableHelper('mounted')}>Mounted</button>
          <UnitTable groupedUnits={groupedUnits.mounted} toShow={tableBool.mounted} />
          <button onClick={() => tableHelper('aircraft')}>Aircraft</button>
          <UnitTable groupedUnits={groupedUnits.aircraft} toShow={tableBool.aircraft} />
        </div>
        }
      </div>
    </div>
  )
}

export default ArmyBuilder