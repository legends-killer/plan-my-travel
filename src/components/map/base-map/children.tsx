import PlaceSearch from '../place-search'
import Navigation from '../navi'
import PointDetail from './test'
import {
  Map,
  MapTypeControl,
  ScaleControl,
  Marker,
  InfoWindow,
  AutoComplete,
} from '@uiw/react-amap'
import React, { useState, useCallback, useEffect } from 'react'

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: any) {
  const { triggerSearch, naviInfo, ...others } = props
  return (
    <>
      <Marker
        {...others}
        visiable={true}
        position={new AMap.LngLat(120.086633, 30.25657)}
        onClick={(evn) => {
          console.log('marker')
        }}
      />
      <PointDetail {...others} />
      <Navigation {...others} naviInfo={naviInfo} />
      <ScaleControl
        {...others}
        visiable={true}
        offset={[30, 10]}
        position="RB"
      />
      <MapTypeControl
        {...others}
        visiable={true}
        offset={[30, 10]}
        position="RT"
      />
      <PlaceSearch {...others} triggerSearch={triggerSearch} />
    </>
  )
}
