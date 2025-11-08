import React from "react";
import FactionForm from "../FactionForm/FactionForm";
import ModelForm from "../Models/ModelForm";
import ModelWargear from "../Models/ModelWargear";
import Toggle from "../NavBar/Toggle";
import { useState, useContext } from 'react'
import ModelContext from "../../contexts/modelContext";
import ModelProfile from "../Models/ModelProfiles";
import ExtraRules from "../Fight/ExtraRules";

const Home = () => {
  const [showForm, setShowForm] = useState(false)
  const [model] = useContext(ModelContext)
  const [chosenWargear, setChosenWargear] = useState(null)

  return (
    <div>
      <FactionForm setShowForm={setShowForm}/>
      <Toggle showForm={showForm}>
        <ModelForm />
        {model && model.attack && model.defence && 
          <ModelWargear 
            model={model} 
            setChosenWargear={setChosenWargear} 
          />}
        {chosenWargear &&
        <div>
          <ModelProfile 
            wargear={chosenWargear}
            model={model}
          />
          <ExtraRules 
            wargear={chosenWargear}
          />
        </div>
        }
      </Toggle>
    </div>
  );
};

export default Home;
