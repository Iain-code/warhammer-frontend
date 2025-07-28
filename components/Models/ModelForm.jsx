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
      <div className='modelForm'>
        <Select
          styles={customStyles}
          className='modelForm-select'
          options={attacker}
          onChange={(model) => handleAttackerModel(model)}
          placeholder="Select an attacker..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
          maxMenuHeight={200} 
        />
        <form onSubmit={reset}>
          <button className='reset' type='submit'>Reset</button>
        </form>
        <Select
          styles={customStyles}
          className='modelForm-select'
          options={defender}
          onChange={(model) => handleDefenderModel(model)}
          placeholder="Select a defender..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
          maxMenuHeight={200} 
        />
      </div>
      <div>
        {model && model.attack && model.defence && <ModelWargear /> }
      </div>
    </div>
  )
}

export default ModelForm