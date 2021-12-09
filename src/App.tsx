import React from 'react'
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from 'react-grid-dnd'
import Modal from 'react-modal'

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
      <button
        onClick={handleOnSave}
        style={{
          border: 0,
          borderRadius: 4,
          backgroundColor: 'rgb(29, 78, 216)',
          color: '#ffffff',
          width: 180,
          margin: 24,
          padding: 8,
        }}
      >
        Speichern
      </button>
      <GridContextProvider onChange={onChange}>
        <GridDropZone
          id="items"
          boxesPerRow={6}
          rowHeight={240}
          style={{ height: '100vh', padding: '0 1rem' }}
        >
          {items.map((item, index) => (
            <GridItem key={item}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 8,
                  border: 'solid 1px #c5c5c5',
                  backgroundColor: '#f6f6f6',
                  padding: 8,
                  width: 200,
                }}
              >
                <div
                  style={{
                    height: 0,
                    paddingTop: '100%',
                    backgroundImage: `url(${imagePath}/${item})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
                <button
                  style={{
                    color: '#252525',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    border: 0,
                    backgroundColor: 'transparent',
                    marginTop: 3,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => openModal(item)}
                >
                  ↔️
                </button>
                <div
                  style={{
                    color: '#252525',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    marginBottom: 3,
                    marginRight: 4,
                  }}
                >
                  {index}
                </div>
              </div>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
      <style
        dangerouslySetInnerHTML={{
          __html:
            'html,body,p{padding:0;margin:0;} #root{min-height:100vh;display:flex;flex-direction:column;font-family:monospace;}',
        }}
      />
      <Modal
        isOpen={!!currentImage}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <div
          style={{
            minHeight: '100%',
            backgroundImage: `url(${currentImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </Modal>
    </>
  )
}

export default App
