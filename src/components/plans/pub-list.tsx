/* eslint-disable import/no-anonymous-default-export */
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import React, { useState } from 'react'
import { planDetailIF } from './types'

interface IProps {
  list: planDetailIF[]
  updateList: (newList: planDetailIF[]) => void
}

export default function (props: IProps) {}
