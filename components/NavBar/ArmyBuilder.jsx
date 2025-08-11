import React from "react"
import { useContext, useState, useEffect } from "react"
import Select from 'react-select'
import UserContext from "../../contexts/userContext"
import { useQuery } from "@tanstack/react-query"
import modelService from '../../requests/models'
import factionList from '../FactionForm/FactionList'
import UnitTable from "./UnitTable"
import Roster from './Roster'
import Enhancements from "./Enhancements"
import RosterContext from "../../contexts/rosterContext"

const ArmyBuilder = () => {
  const user = useContext(UserContext)
  const [faction, setFaction] = useState(null)
  const [, setFactionImage] = useState(null)
  const [, rosterDispatch] = useContext(RosterContext)
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

  useQuery({
    queryKey: ['models'],
    queryFn: () => modelService.getAllUnits(),
    retry: 1,
    refetchOnWindowFocus: false,
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
    queryFn: () => modelService.getWargearForModels(),
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

  const abilities = useQuery({
    queryKey: ['abilities'],
    queryFn: () => modelService.getAbilities(),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false    
  })

  const sortUnitsAndFetchData = async () => {
    const IDs = units.data.map(unit => unit.datasheet_id)
    const response = await modelService.getPointsForID(IDs)
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
    rosterDispatch({
      type: 'set',
      payload: 0
    })
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

  if (!user[0]) {
    return <div className="flex justify-center text-center flex-wrap mt-[100px] mx-10 text-orange-600 text-xl">Please login to use the army builder</div>
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
    ]

    const lowerKeywords = unit.keywords.map(k => k.toLowerCase())
 
    for (const type of keywordTypes) {
      if (lowerKeywords.includes(type)) {
        const unitWithInstance = { ...unit, instance: Date.now(),
          unitPoints: costStr === 'cost2' ? { description: unit.unitPoints.description2, cost: unit.unitPoints.cost2 } :
            { description: unit.unitPoints.description, cost: unit.unitPoints.cost }}

        setSelectedUnits(prev => ({ ...prev, [type]: [ ...prev[type], unitWithInstance ]}))
        rosterDispatch({
          type: 'add',
          payload: unitWithInstance.unitPoints.cost
        })
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
    <div className="mt-[100px]">
      <h4 className="mx-auto text-white text-xl white">Army Builder</h4>
      <div className="mx-auto w-3/4 lg:w-1/2 p-2 lg:p-8 md:p-4">
        <Select
          styles={customStyles}
          options={factionList}
          onChange={(faction) => handleFactionChange(faction.value)}
          placeholder="Select a faction..."
          isSearchable
          maxMenuHeight={200}
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-center gap-6 p-6 w-full max-w-[1280px] mx-auto ">
        <div className="w-full lg:w-2/3">
          {units.isLoading && <></>}
          {units.isError && <div>Error loading data...</div>}
          {units.data &&
        <div className="">
          <Enhancements 
            enhancements={enhancements.data} 
            faction={faction} 
          />
          <div className="flex flex-col justify-center p-4 rounded w-full mx-auto">
            <button 
              onClick={() => tableHelper('character')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Characters</button>
            <UnitTable 
              groupedUnits={groupedUnits.character} 
              toShow={tableBool.character} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('battleline')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >BattleLine</button>
            <UnitTable 
              groupedUnits={groupedUnits.battleline} 
              toShow={tableBool.battleline} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('transport')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2" 
            >Transports</button>
            <UnitTable
              groupedUnits={groupedUnits.transport} 
              toShow={tableBool.transport} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('vehicle')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Vehicles</button>
            <UnitTable 
              groupedUnits={groupedUnits.vehicle} 
              toShow={tableBool.vehicle} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('monster')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Monsters</button>
            <UnitTable 
              groupedUnits={groupedUnits.monster} 
              toShow={tableBool.monster} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('mounted')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Mounted</button>
            <UnitTable 
              groupedUnits={groupedUnits.mounted} 
              toShow={tableBool.mounted} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('aircraft')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Aircraft</button>
            <UnitTable 
              groupedUnits={groupedUnits.aircraft} 
              toShow={tableBool.aircraft} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
            <button 
              onClick={() => tableHelper('infantry')}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Infantry</button>
            <UnitTable 
              groupedUnits={groupedUnits.infantry} 
              toShow={tableBool.infantry} 
              addUnitToRoster={addUnitToRoster} 
              keywords={keywords.data} 
              wargear={wargear.data}
              abilities={abilities.data}
            />
          </div>
        </div>}
        </div>
        <div className="flex justify-center w-full lg:w-1/3 lg:sticky lg:top-6">
          <Roster 
            selectedUnits={selectedUnits} 
            setSelectedUnits={setSelectedUnits}
            faction={faction}
          />
        </div>
      </div>
    </div>
  )
}

export default ArmyBuilder