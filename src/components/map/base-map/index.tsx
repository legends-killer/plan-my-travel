import ReactDOM from 'react-dom'
import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { Map, Marker } from '@uiw/react-amap'
import { Button, Input } from 'antd'
import Children from './children'
import './style.less'

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: any) {
  const [dragEnable, setDragEnable] = useState(true)
  const [display, setDisplay] = useState(true)
  const [zoom, setZoom] = useState(15)
  const [viewMode, setViewMode] = useState('2D')
  const [show, setShow] = useState(true)
  const [searchResult, setSearchResult] = useState({})
  const [naviInfo, setNaviInfo] = useState({
    from: null,
    to: null,
    method: 'Driving',
  })
  const triggerSearch = (e: any) => {
    setSearchResult(e)
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div>
        <Button onClick={() => setDragEnable(!dragEnable)}>
          {dragEnable ? '禁用' : '启用'}拖拽
        </Button>
        <Button onClick={() => setDisplay(!display)}>
          {display ? '卸载' : '加载'}地图
        </Button>
        <Button onClick={() => setViewMode(viewMode === '3D' ? '2D' : '3D')}>
          {viewMode}地图
        </Button>
        <Button onClick={() => setZoom(zoom + 1)}>放大 +1 ({zoom})</Button>
        <Button onClick={() => setZoom(zoom - 1)}>缩小 -1 ({zoom})</Button>
        <Button onClick={() => setShow(!show)}>展示控件</Button>
      </div>
      <div style={{ width: '100%', height: '80%' }}>
        {display && (
          <Map
            pitch={viewMode === '2D' ? 0 : 70}
            dragEnable={dragEnable}
            viewMode={viewMode as '2D'}
            zoom={zoom}
          >
            {(props) => {
              return (
                <>
                  <Children
                    {...props}
                    triggerSearch={triggerSearch}
                    naviInfo={naviInfo}
                  />
                </>
              )
            }}
          </Map>
        )}
      </div>
    </div>
  )
}
