import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import Modal from 'react-modal'

type AppProps = {}

const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const App: React.FC<AppProps> = () => {
  const [currentImage, setCurrentImage] = React.useState('')
  //@ts-ignore
  const [items, setItems] = React.useState<string[]>(window.data.files)
  //@ts-ignore
  const imagePath = window.data.imagePath

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const orderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    )
    setItems(orderedItems)
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
          position: 'fixed',
          zIndex: 10,
          width: 180,
          margin: 24,
          padding: 8,
        }}
      >
        Speichern
      </button>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              style={{
                width: 240,
                margin: '96px 16px 16px',
                padding: 8,
              }}
            >
              {items.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={{
                        // some basic styles to make the items look a bit nicer
                        userSelect: 'none',
                        marginTop: 16,
                        borderRadius: 4,
                        position: 'relative',

                        // change background colour if dragging
                        background: draggableSnapshot.isDragging
                          ? '#4a4a4a'
                          : '#252525',

                        // styles we need to apply on draggables
                        ...draggableProvided.draggableProps.style,
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
                          color: '#ff00ff',
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
                          color: '#ff00ff',
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
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
