// Chứa các file chứa method gọi đến database để xử lý logic nghiệp
'use strict'

import mongoose from 'mongoose'
import * as _ from 'lodash'

const convertStringToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id)
}

const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields) //Creates an object composed of the picked object properties.
}

/**
 * @param {*} select
 * @example from ['a','b']
 * @returns {a : 1, b : 1}
 */
const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}

const removeFalsyValues = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key]
    }
  })
  return obj
}

const updateNestedObjectParser = (obj: any) => {
  const final: { [key: string]: string | number } = {}

  Object.keys(obj || {}).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response || {}).forEach((a) => {
        final[`${key}.${a}`] = response[a]
      })
    } else {
      final[key] = obj[key]
    }
  })
  return final
}

export {
  convertStringToObjectId,
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeFalsyValues,
  updateNestedObjectParser
}
