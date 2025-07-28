import React from "react"
import { useContext, useState, useEffect } from "react"
import Select from 'react-select'
import UserContext from "../../contexts/userContext"
import './armybuilder.css'
import { useQuery } from "@tanstack/react-query"
import modelService from '../../requests/models'
import factionList from '../FactionForm/FactionList'
import UnitTable from "./UnitTable"
import Roster from './Roster'
import Enhancements from "./Enhancements"

const ArmyBuilder = () => {
  const [user] = useContext(UserContext)
  const [faction, setFaction] = useState(null)
  const [, setFactionImage] = useState(null)
  const [rosterTotal, setRosterTotal] = useState(0)
  const [groupedUnits, setGroupedUnits] = useState({
    character: [],
    battleline: [],
    transport: [],
    vehicles: [],
    monster: [],
    mounted: [],
    aircraft: [],
    infantry: [],
  })
  const [tableBool, setTableBool] = useState({
    character: false,
    battleline: false,
    transport: false,
    vehicle: false,
    monster: false,
    mounted: false,
    aircraft: false,
    infantry: false,
  })

  const [selectedUnits, setSelectedUnits] = useState({
    character: [],
    battleline: [],
    transport: [],
    mounted: [],
    aircraft: [],
    monster: [],
    vehicle: [],
    infantry: [],
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

  const enhancements = useQuery({
    queryKey: ['enhancements'],
    queryFn: () => modelService.getEnhancements(),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false    
  })

  const sortUnitsAndFetchData = async () => {
    const IDs = units.data.map(unit => unit.datasheet_id)
    const response = await modelService.getPointsForID(IDs)
    return response
  }

  const getWargearForModels = async () => {
    const response = await modelService.getWargear()
    return response
  }

  useEffect(() => {
    if (!units.data || !keywords.data || !points.data) return

    const keywordMap = keywords.data.reduce((object, keyword) => {
      if (!object[keyword.datasheet_id]) {
        object[keyword.datasheet_id] = []
      }
      object[keyword.datasheet_id].push(keyword.keyword)
      return object
    }, {})

    const pointsMap = points.data.reduce((object, point) => {
      if (!object[point.datasheet_id]) {
        object[point.datasheet_id] = {
          description: point.description,
          cost: point.cost
        }
      } else {
        object[point.datasheet_id] = {
          description: object[point.datasheet_id].description,
          cost: object[point.datasheet_id].cost,
          description2: point.description,
          cost2: point.cost
        }
      }
      return object
    }, {})

    const initialGroups = {
      character: [],
      battleline: [],
      transport: [],
      vehicle: [],
      monster: [],
      mounted: [],
      aircraft: [],
      infantry: [],
    }

    for (const unit of units.data) {
      const unitKeywords = keywordMap[unit.datasheet_id] || []
      const added = { ...unit, keywords: unitKeywords }
      const unitPoints = pointsMap[unit.datasheet_id] || []
      const pointsAdded = { ...added,  unitPoints}

      if (unitKeywords.includes('Character')) {
        initialGroups.character.push(pointsAdded)
      } else if (unitKeywords.includes('Battleline')) {
        initialGroups.battleline.push(pointsAdded)
      } else if (unitKeywords.includes('Transport')) {
        initialGroups.transport.push(pointsAdded)
      } else if (unitKeywords.includes('Aircraft')) {
        initialGroups.aircraft.push(pointsAdded)
      } else if (unitKeywords.includes('Monster')) {
        initialGroups.monster.push(pointsAdded)
      } else if (unitKeywords.includes('Mounted')) {
        initialGroups.mounted.push(pointsAdded)
      } else if (unitKeywords.includes('Vehicle')) {
        initialGroups.vehicle.push(pointsAdded)
      } else if (unitKeywords.includes('Infantry')) {
        initialGroups.infantry.push(pointsAdded)
      }
    }

    setGroupedUnits(initialGroups)
  }, [units.data, keywords.data, points.data])

  const handleFactionChange = (faction) => {
    setFaction(faction)
    setFactionImage(faction.img)
    setRosterTotal(0)
    setSelectedUnits({
      character: [],
      battleline: [],
      transport: [],
      mounted: [],
      aircraft: [],
      monster: [],
      vehicle: [],
      infantry: [],
    })
  };

  if (!user) {
    return <div className="builderError">Please login to use the army builder</div>
  }

  const tableHelper = (unitType) => {
    setTableBool(object => ({ ...object, [unitType]: !object[unitType] }))
  }

  const addUnitToRoster = (unit, costStr) => {
    if (!unit) {
      return
    }
    const keywordTypes = [
      'character',
      'battleline',
      'transport',
      'aircraft',
      'monster',
      'mounted',
      'vehicle',
      'infantry',
    ];

    const lowerKeywords = unit.keywords.map(k => k.toLowerCase())
 
    for (const type of keywordTypes) {
      if (lowerKeywords.includes(type)) {
        const unitWithInstance = { ...unit, instance: Date.now(),
          unitPoints: costStr === 'cost2' ? { description: unit.unitPoints.description2, cost: unit.unitPoints.cost2 } :
            { description: unit.unitPoints.description, cost: unit.unitPoints.cost }}

        setSelectedUnits(prev => ({ ...prev, [type]: [ ...prev[type], unitWithInstance ]}))
        setRosterTotal(rosterTotal => rosterTotal + unitWithInstance.unitPoints.cost)
        break
      }
    }
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
          <Enhancements enhancements={enhancements.data} faction={faction}/>
          <button onClick={() => tableHelper('character')}>Characters</button>
          <UnitTable groupedUnits={groupedUnits.character} toShow={tableBool.character} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('battleline')}>BattleLine</button>
          <UnitTable groupedUnits={groupedUnits.battleline} toShow={tableBool.battleline} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('transport')}>Transports</button>
          <UnitTable groupedUnits={groupedUnits.transport} toShow={tableBool.transport} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('vehicle')}>Vehicles</button>
          <UnitTable groupedUnits={groupedUnits.vehicle} toShow={tableBool.vehicle} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('monster')}>Monsters</button>
          <UnitTable groupedUnits={groupedUnits.monster} toShow={tableBool.monster} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('mounted')}>Mounted</button>
          <UnitTable groupedUnits={groupedUnits.mounted} toShow={tableBool.mounted} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('aircraft')}>Aircraft</button>
          <UnitTable groupedUnits={groupedUnits.aircraft} toShow={tableBool.aircraft} addUnitToRoster={addUnitToRoster}/>
          <button onClick={() => tableHelper('infantry')}>Infantry</button>
          <UnitTable groupedUnits={groupedUnits.infantry} toShow={tableBool.infantry} addUnitToRoster={addUnitToRoster}/>
        </div>
        }
        <Roster selectedUnits={selectedUnits} rosterTotal={rosterTotal}/>
      </div>
    </div>
  )
}

export default ArmyBuilder