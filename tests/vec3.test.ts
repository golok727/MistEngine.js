import {expect, test} from 'vitest'

import {Vector3, vec3} from '../packages'

test('vec3.createHelper', () => {
  expect(vec3(2, 4, 5)).toStrictEqual(new Vector3(2, 4, 5))
  expect(vec3(2)).toStrictEqual(new Vector3(2))
})

test('vec3.scalarInitialize', () => {
  const v = vec3(1)
  expect(v.x).toBe(1)
  expect(v.y).toBe(1)
})

test('vec3.add', () => {
  let v1 = vec3(1, 2, 3)
  let v2 = vec3(4, 5, 6)

  // Test addition
  const result = v1.add(v2)
  expect(result.x).toBe(5)
  expect(result.y).toBe(7)
  expect(result.z).toBe(9)

  // Check if it returned the first vector
  expect(result).toBe(v1)

  // Reassign variables for the next set of operations
  v1 = vec3(1, 2, 3)
  v2 = vec3(4, 5, 6)

  // Chain additional expectations
  const cloneRes = v1.clone().add(v2)
  expect(cloneRes.x).toBe(5)
  expect(cloneRes.y).toBe(7)
  expect(cloneRes.z).toBe(9)

  // Check if the cloned vector is not the same object as v1
  expect(cloneRes).not.toBe(v1)
})

test('vec3.sub', () => {
  let v1 = vec3(5, 8, 10)
  let v2 = vec3(2, 3, 4)

  // Test subtraction
  const result = v1.sub(v2)
  expect(result.x).toBe(3)
  expect(result.y).toBe(5)
  expect(result.z).toBe(6)

  // Check if it returned the first vector
  expect(result).toBe(v1)

  // Reassign variables for the next set of operations
  v1 = vec3(5, 8, 10)
  v2 = vec3(2, 3, 4)

  // Chain additional expectations
  const cloneRes = v1.clone().sub(v2)
  expect(cloneRes.x).toBe(3)
  expect(cloneRes.y).toBe(5)
  expect(cloneRes.z).toBe(6)

  // Check if the cloned vector is not the same object as v1
  expect(cloneRes).not.toBe(v1)
})

test('vec3.mul', () => {
  let v1 = vec3(2, 3, 4)
  const scalar = 1.5

  // Test multiplication
  const result = v1.mul(scalar)
  expect(result.x).toBe(3)
  expect(result.y).toBe(4.5)
  expect(result.z).toBe(6)

  // Check if it returned the first vector
  expect(result).toBe(v1)

  // Reassign variables for the next set of operations
  v1 = vec3(2, 3, 4)

  // Chain additional expectations
  const cloneRes = v1.clone().mul(scalar)
  expect(cloneRes.x).toBe(3)
  expect(cloneRes.y).toBe(4.5)
  expect(cloneRes.z).toBe(6)

  // Check if the cloned vector is not the same object as v1
  expect(cloneRes).not.toBe(v1)
})

test('vec3.mul with different overloads', () => {
  // Test multiplication with a scalar (number)
  const scalarResult = vec3(2, 3, 4).mul(1.5)
  expect(scalarResult.x).toBe(3)
  expect(scalarResult.y).toBe(4.5)
  expect(scalarResult.z).toBe(6)
  expect(scalarResult).toBeInstanceOf(Vector3)

  // Test multiplication with another Vector3
  const vectorResult = vec3(2, 3, 4).mul(vec3(1.5, 2, 2.5))
  expect(vectorResult.x).toBe(3)
  expect(vectorResult.y).toBe(6)
  expect(vectorResult.z).toBe(10)
  expect(vectorResult).toBeInstanceOf(Vector3)

  // Test multiplication with an array [x, y, z]
  const arrayResult = vec3(2, 3, 4).mul([1.5, 2, 2.5])
  expect(arrayResult.x).toBe(3)
  expect(arrayResult.y).toBe(6)
  expect(arrayResult.z).toBe(10)
  expect(arrayResult).toBeInstanceOf(Vector3)
})

test('vec3.div', () => {
  let v1 = vec3(6, 9, 12)
  const divisor = 2

  // Test division
  const result = v1.div(vec3(divisor))
  expect(result.x).toBe(3)
  expect(result.y).toBe(4.5)
  expect(result.z).toBe(6)

  // Check if it returned the first vector
  expect(result).toBe(v1)

  // Reassign variables for the next set of operations
  v1 = vec3(6, 9, 12)

  // Chain additional expectations
  const cloneRes = v1.clone().div(vec3(divisor))
  expect(cloneRes.x).toBe(3)
  expect(cloneRes.y).toBe(4.5)
  expect(cloneRes.z).toBe(6)

  // Check if the cloned vector is not the same object as v1
  expect(cloneRes).not.toBe(v1)
})

test('vec3.div with division by zero', () => {
  try {
    vec3(2).div(vec3(0))
    expect.fail("Expected division by zero error but didn't get one")
  } catch (error) {
    expect(error.message).toBe('Division by zero')
  }
})

test('vec3.mag', () => {
  const v = vec3(3, 4, 5)

  // Test magnitude
  const magnitude = v.mag()
  expect(magnitude).toBeCloseTo(Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2))
})

test('vec3.normalize', () => {
  let v = vec3(3, 4, 5)

  // Test normalization
  const result = v.normalize()
  const magnitude = Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2)
  expect(result.x).toBeCloseTo(3 / magnitude)
  expect(result.y).toBeCloseTo(4 / magnitude)
  expect(result.z).toBeCloseTo(5 / magnitude)

  expect(result).toBe(v)

  const vec = vec3(0)
  const norm = vec.normalize()
  expect(norm).toBe(vec)
})

test('vec3.toString', () => {
  expect(vec3(2, 3, 4).toString()).toBe('Vector3 [ x: 2, y: 3, z: 4 ]')
})

test('vec3.toArray', () => {
  expect(vec3(2, 3, 4).toArray()).toStrictEqual([2, 3, 4])
})

test('vec3.Symbol[iterator]', () => {
  const vec = vec3(2, 3, 4)
  expect(vec.toArray()).toStrictEqual([...vec])
})
