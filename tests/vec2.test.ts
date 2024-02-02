import { expect, test } from "vitest";

import { Vector2, vec2 } from "../packages";

test("vec2.createHelper", () => {
	expect(vec2(2, 4)).toStrictEqual(new Vector2(2, 4));
	expect(vec2(2)).toStrictEqual(new Vector2(2));
});

test("vec2.scalarInitialize", () => {
	const v = vec2(1);
	expect(v.x).toBe(1);
	expect(v.y).toBe(1);
});

test("vec2.add", () => {
	let v1 = vec2(1, 2);
	let v2 = vec2(3, 4);

	// Test addition
	const result = v1.add(v2);
	expect(result.x).toBe(4);
	expect(result.y).toBe(6);

	// check if it returned the first vector
	expect(result).toBe(v1);

	v1 = vec2(1, 2);
	v2 = vec2(3, 4);
	const cloneRes = v1.clone().add(v2);
	expect(cloneRes.x).toBe(4);
	expect(cloneRes.y).toBe(6);

	expect(cloneRes).not.toBe(v1);
});

test("vec2.sub", () => {
	let v1 = vec2(5, 8);
	let v2 = vec2(2, 3);

	// Test subtraction
	const result = v1.sub(v2);
	expect(result.x).toBe(3);
	expect(result.y).toBe(5);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec2(5, 8);
	v2 = vec2(2, 3);

	// Chain additional expectations
	const cloneRes = v1.clone().sub(v2);
	expect(cloneRes.x).toBe(3);
	expect(cloneRes.y).toBe(5);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec2.mul", () => {
	let v1 = vec2(2, 3);
	const scalar = 1.5;

	// Test multiplication
	const result = v1.mul(scalar);
	expect(result.x).toBe(3);
	expect(result.y).toBe(4.5);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec2(2, 3);

	// Chain additional expectations
	const cloneRes = v1.clone().mul(scalar);
	expect(cloneRes.x).toBe(3);
	expect(cloneRes.y).toBe(4.5);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec2.mul with different overloads", () => {
	// Test multiplication with a scalar (number)
	const scalarResult = vec2(2, 3).mul(1.5);
	expect(scalarResult.x).toBe(3);
	expect(scalarResult.y).toBe(4.5);
	expect(scalarResult).toBeInstanceOf(Vector2);

	// Test multiplication with another Vector2
	const vectorResult = vec2(2, 3).mul(vec2(1.5, 2));
	expect(vectorResult.x).toBe(3);
	expect(vectorResult.y).toBe(6);
	expect(vectorResult).toBeInstanceOf(Vector2);

	// Test multiplication with an array [x, y]
	const arrayResult = vec2(2, 3).mul([1.5, 2]);
	expect(arrayResult.x).toBe(3);
	expect(arrayResult.y).toBe(6);
	expect(arrayResult).toBeInstanceOf(Vector2);
});

test("vec2.div", () => {
	let v1 = vec2(6, 9);
	const divisor = 2;

	// Test division
	const result = v1.div(vec2(divisor));
	expect(result.x).toBe(3);
	expect(result.y).toBe(4.5);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec2(6, 9);

	// Chain additional expectations
	const cloneRes = v1.clone().div(vec2(divisor));
	expect(cloneRes.x).toBe(3);
	expect(cloneRes.y).toBe(4.5);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec2.div with division by zero", () => {
	try {
		vec2(2, 2).div(vec2(0));
		// If the above line doesn't throw an error, fail the test
		expect.fail("Expected division by zero error but didn't get one");
	} catch (error) {
		// Check if the error message matches the expected message
		expect(error.message).toBe("Division by zero");
	}
});

test("vec2.mag", () => {
	const v = vec2(3, 4);

	// Test magnitude
	const magnitude = v.mag();
	expect(magnitude).toBe(5);
});

test("vec2.normalize", () => {
	let v = vec2(3, 4);

	// Test normalization
	const result = v.normalize();
	expect(result.x).toBeCloseTo(0.6);
	expect(result.y).toBeCloseTo(0.8);

	// Check if it returned the original vector
	expect(result).toBe(v);

	v = vec2(0);
	const norm = v.normalize();
	expect(norm).toBe(v);
});

test("Chaining Operations", () => {
	let v1 = vec2(1, 2);
	let v2 = vec2(3, 4);

	// Chaining multiple operations
	const result = v1.add(v2).mul(2).sub(vec2(1, 1));

	// Check the final result
	expect(result.x).toBe((1 + 3) * 2 - 1);
	expect(result.y).toBe((2 + 4) * 2 - 1);

	expect(result).toBe(v1);
});

test("vec2.toString", () => {
	expect(vec2(2, 3).toString()).toBe("Vector2 [ x: 2, y: 3 ]");
});

test("vec2.toArray", () => {
	expect(vec2(2, 3).toArray()).toStrictEqual([2, 3]);
});

test("vec2.Symbol[iterator]", () => {
	const vec = vec2(2, 3);
	expect(vec.toArray()).toStrictEqual([...vec]);
});
