import React from 'react'
import './about.css'

const About = () => {
  return (
    <div className='aboutMain'>
      <p className='firstAbout'>
        My website about warhammer to provide an easy way of finding average dice rolls
        and damage statistics for every model in the 40k universe.
      </p>
      <p className='secondAbout'>
        Big thanks to<a className='aboutLink' color='orangered' href="https://wahapedia.ru/">wahapedia</a>for providing the data used to make this site!!
      </p>
    </div>
  )
};

export default About;
