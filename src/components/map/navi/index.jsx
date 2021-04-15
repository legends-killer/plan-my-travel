/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useCallback, useEffect } from 'react'

export default function (props) {
  const { AMap, map, container, naviInfo } = props
  const { from, to, method } = naviInfo

  /* from , to : AMap.LngLat(xx,xx)  method: Driving | Transfer | Walking | Riding */
  const navigation = (from, to, method) => {
    console.log('build navi', map, AMap, from, to, method)
    if (map && AMap && from && to && method) {
      console.log(map, AMap, from, to, method)
      AMap.plugin([`AMap.${method}`], () => {
        //构造路线导航类
        // var driving = new AMap.Driving({
        //   map: map,
        //   panel: 'navi',
        // })
        console.log('navi')
        const navi = new AMap[method]({
          map: map,
          panel: 'navi',
        })
        // 根据起终点经纬度规划驾车导航路线
        navi.search(
          // new AMap.LngLat(116.379028, 39.865042),
          // new AMap.LngLat(116.427281, 39.903719),
          from,
          to,
          // { waypoints: [new AMap.LngLat(116.379028, 39.885042)] },
          (status, result) => {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
              // log.success('绘制驾车路线完成')
            } else {
              // log.error('获取驾车数据失败：' + result)
            }
          }
        )
      })
    }
  }
  useEffect(() => {
    navigation(from, to, method)
  })
  return (
    <>
      {from && to && method && (
        <div
          id="navi"
          style={{
            width: 210,
            position: 'absolute',
            right: 0,
            zIndex: 999,
            textAlign: 'left',
          }}
        ></div>
      )}
    </>
  )
}
