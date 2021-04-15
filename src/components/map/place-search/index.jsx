import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { APILoader, AutoComplete } from '@uiw/react-amap'
import {Input} from 'antd'
import './style.less'

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const {triggerSearch} = props
  const mapRef = useRef()
  const resultRef = useRef()
  const [data, setData] = useState()
  const [city, setCity] = useState('上海市')
  const [output, setOutput] = useState()
  const [input, setInput] = useState()
  useEffect(() => {
    console.log(mapRef)
    setOutput(resultRef.current)
    setInput(mapRef.current)
  }, [])
  return (
    <div className="placeSearch" style={{}}>
      <input type="text" ref={mapRef} className="ant-input" />
      <div ref={resultRef} >1</div>
      <div>
        {input && output && (
          <AutoComplete
          {...props}
            input={input}
            output={output}
            onSelect={(opts) => {
              triggerSearch(opts)
              setData(opts)
              console.log('@@@@', opts)
            }}
          />
        )}
        <pre style={{ padding: 10, marginTop: 10 }}>
          {data
            ? JSON.stringify(data, null, 2)
            : '{请在输入框输入内容，下拉列表选择...}'}
        </pre>
      </div>
    </div>
  )
}
