import React, { useState, useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion';
import{useSnapshot} from 'valtio';

import config from '../config/config';
import state from '../store';
import {download} from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import { fadeAnimation, slideAnimation} from '../config/motion';
import { AlPicker, ColorPicker, FilePicker, Tab, CustomButton} from '../compnents';

const Customizer = () => {
  const snap = useSnapshot(state);
  
  const[file, setFile] = useState('');

  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const[activeEditorTab, setActiveEditorTab] = useState("");
  const[activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    styleShirt: false,
  })

  //Контент при нажатии
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile} 
        />
      case "aipicker":
        return<AlPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
        
        
      default:
        return null;
    }

  }

  const handleSubmit = async(type) => {
    if(!prompt) return alert("Pleae enter a prompt");

    try{
      setGeneratingImg(true);

      const response = await fetch (backendUrl)
    }catch (error) {
      alert(error)
    }finally{
      setGeneratingImg(false);
      setActiveEditorTab("");

    }


  }
  
  const handleClick = (type, result) =>{
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) =>{
    switch(tabName){
      case"logoShirt" :
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "styliShirt" :
          state.isFullTexture = !activeFilterTab[tabName];
        default :
          state.isFullTexture = true;
          state.isLogoTexture = false;
    }

    //После установки состояния, нужно установить активную вкладку
    
    setActiveFilterTab((prevState) =>{
      return{
        ...prevState,
        [tabName] : !prevState[tabName]
      }
    })
  }


  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleClick(type, result);
        setActiveEditorTab("");
      })
  }


  
  
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex item-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) =>(
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick = {() => setActiveEditorTab(tab.name)}
                  />
                ) )}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />

          </motion.div>

          <motion.div
          className="filtertabs-container"
          {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) =>(
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    isFilterTab
                    isActiveTab={activeFilterTab[tab.name]}
                    handleClick = {() => handleActiveFilterTab(tab.name)}
                  />
                ) )} 

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer