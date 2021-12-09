import React from 'react'
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from 'react-grid-dnd'
import Modal from 'react-modal'

import './App.scss'

type AppProps = {}

const App: React.FC<AppProps> = () => {
  const [currentImage, setCurrentImage] = React.useState('')
  //@ts-ignore
  const [items, setItems] = React.useState<string[]>(window.data.files)
  //@ts-ignore
  const imagePath = window.data.imagePath

  function onChange(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number
  ) {
    const nextState = swap(items, sourceIndex, targetIndex)
    setItems(nextState)
  }

  const handleOnSave = () => {
    fetch('/save', {
      method: 'POST',
      body: JSON.stringify(items),
    }).then((response) => response.ok && location.reload())
  }

  const openModal = (item: string) => {
    setCurrentImage(`${imagePath}/${item}`)
  }

  const closeModal = () => {
    setCurrentImage('')
  }

  return (
    <>
      <button onClick={handleOnSave} className="save-btn">
        Speichern
      </button>
      <GridContextProvider onChange={onChange}>
        <GridDropZone
          id="items"
          boxesPerRow={6}
          rowHeight={240}
          style={{ height: '100vh' }}
        >
          {items.map((item, index) => (
            <GridItem key={item} style={{ display: 'flex', padding: 8 }}>
              <div className="item">
                <div
                  className="item-image"
                  style={{
                    backgroundImage: `url(${imagePath}/${item})`,
                  }}
                />
                <button
                  className="item-fullscreen-btn"
                  onClick={() => openModal(item)}
                >
                  &#8599;
                </button>
                <div className="item-index">{index}</div>
              </div>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
      <Modal isOpen={!!currentImage} onRequestClose={closeModal}>
        <div
          className="modal-content"
          style={{
            backgroundImage: `url(${currentImage})`,
          }}
        />
      </Modal>
    </>
  )
}

export default App
