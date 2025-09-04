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
    <div>
      <div className='flex justify-center m-5'>
        <Select
          styles={customStyles}
          className='modelForm-select'
          options={attacker}
          onChange={(model) => handleAttackerModel(model)}
          placeholder="Select an attacker..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
        />
        <Select
          styles={customStyles}
          className='modelForm-select'
          options={defender}
          onChange={(model) => handleDefenderModel(model)}
          placeholder="Select a defender..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
        />
      </div>
      <div className='flex justify-center m-4'>
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
      </div>
      <div>
        {model && model.attack && model.defence && <ModelWargear /> }
      </div>
    </div>
  )
}

export default ModelForm