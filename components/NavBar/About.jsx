import React from 'react'

const About = () => {
  return (
    <div className='flex flex-col text-center mx-auto text-xl mt-12 pt-12 text-white w-3/4 gap-5'>
      <p className=''>
        This site gives you fast, readable averages for dice rolls and damage across units and weapons in the 40k universe. 
        No more juggling profiles or doing mental math mid‑game—just pick a unit and weapon from presets and get the numbers.
      </p>
      <div className='flex border-b-2 w-1/2 mx-auto my-4'></div>
      <p>
      I built it after trying other tools that often asked me to enter weapon stats by hand. I wanted a pick‑and‑play experience instead. 
      The army builder started as a friend’s idea and turned into a surprisingly helpful add‑on.
      </p>
      <div className='flex border-b-2 w-1/2 mx-auto my-4'></div>
      <p>
      I’m also using this project to sharpen my software‑development skills and build toward a career in the field. 
      If you have feedback or ideas, I’d love to hear them.
      </p>
      <p className=''>
        Big thanks to<a className='text-pink-400 px-2' color='orangered' href="https://wahapedia.ru/">Wahapedia</a>
        for providing the data used to make this site!!
      </p>
      <div className='flex border-b-2 w-1/2 mx-auto mt-4'></div>
      <div>
      </div>
      <div className=''>
        <p className='mb-5'>If you have lost all of your senses and would like to donate to this project to keep it running please click the button below.</p>
        <a 
          target="_blank" 
          rel="noopener noreferrer" 
          href='https://buy.stripe.com/00wfZh5SM0Jv10NbEV9MY01'
          className="relative inline-flex items-center justify-center p-0.5 me-2 
              overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Donations</span>
        </a>
      </div>
    </div>
  )
};

export default About;
