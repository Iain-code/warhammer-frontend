import React from 'react'
import { useContext } from 'react'
import Select from 'react-select';
import AttackerContext from '../../contexts/attackerContext';
import DefenderContext from '../../contexts/defenderContext';
import ModelContext from '../../contexts/modelContext'
import ModelWargear from './ModelWargear'

const ModelForm = () => {
  const [attacker, attackerDispatch] = useContext(AttackerContext)
  const [defender, defenderDispatch] = useContext(DefenderContext)
  const [model, modelDispatch] = useContext(ModelContext)

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

  const reset = () => {
    attackerDispatch({
      type: 'remove',
      payload: null
    })
    defenderDispatch({
      type: 'remove',
      payload: null
    })
    modelDispatch({
      type: 'remove'
    })
  }

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
  }

  return (
    <div>
      <div className='flex flex-col lg:flex-row justify-center my-3 w-5/6 mx-auto lg:gap-10'>
        <Select
          styles={customStyles}
          className='lg:w-1/4 lg:flex-col my-1'
          options={attacker}
          onChange={(model) => handleAttackerModel(model)}
          placeholder="Select an attacker..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
        />
        <Select
          styles={customStyles}
          className='lg:w-1/4 my-1'
          options={defender}
          onChange={(model) => handleDefenderModel(model)}
          placeholder="Select a defender..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
        />
      </div>
      <div className='flex flex-wrap justify-center lg:m-4 w-100%'>
        <button 
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
            overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
              group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
              focus:ring-pink-200 dark:focus:ring-pink-800"
          onClick={() => reset()}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Reset </span>
        </button>
        <span>
          <h1 className='flex justify-center text-center text-xl my-2 text-white'>Select a weapon profile</h1>
        </span>
      </div>
      <div>
        {model && model.attack && model.defence && <ModelWargear /> }
      </div>
    </div>
  )
}

export default ModelForm