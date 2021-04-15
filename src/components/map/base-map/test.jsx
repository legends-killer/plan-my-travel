import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react'
import { Map, Marker, APILoader, InfoWindow } from '@uiw/react-amap'

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const { AMap, map } = props
  const [show, setShow] = useState(true)
  const [winPosition, setWinPosition] = useState()
  const [content, setContent] = useState('<div>高德软件</div>')
  return (
    <>
      <input
        type="text"
        value={content}
        onChange={(evn) => setContent(evn.target.value)}
      />
      <Marker
        title="杭州市"
        position={new AMap.LngLat(120.086633, 30.25657)}
        onClick={(evn) => {
          if (!show) {
            setWinPosition(new AMap.LngLat(120.086633, 30.25657))
            setShow(true)
          } else {
            setWinPosition(new AMap.LngLat(120.086633, 30.25657))
          }
        }}
      />
      <Marker
        title="杭州市"
        position={new AMap.LngLat(120.086633, 30.25657)}
        onClick={(evn) => {
          if (!show) {
            setWinPosition(new AMap.LngLat(120.086633, 30.25657))
            setShow(true)
          } else {
            setWinPosition(new AMap.LngLat(120.086633, 30.25657))
          }
        }}
      />
      {winPosition && (
        <InfoWindow
          visiable={show}
          position={winPosition}
          offset={{ x: 0, y: -10 }}
          content={content}
          onClose={(evn) => {
            // console.log('evn2', evn, show);
          }}
        />
      )}
    </>
  )
}
