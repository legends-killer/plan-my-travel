/* eslint-disable import/no-anonymous-default-export */
import ReactDOM from 'react-dom'
import React, { Fragment, useState } from 'react'
import { Map, APILoader } from '@uiw/react-amap'
import BaseMap from './base-map'
import PlaceSearch from './place-search'
import './style.less'

export default function () {
  return (
    <APILoader akay="453c834636bf44fdb28e4f31d095dd9b">
      <div className="map">
        <BaseMap />
        {/* <PlaceSearch /> */}
      </div>
    </APILoader>
  )
}
