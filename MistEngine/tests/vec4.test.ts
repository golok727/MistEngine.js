import { expect, test } from "vitest";
import { vec4 } from "../packages";

test("vec4.add", () => {
	let v1 = vec4(1, 2, 3, 4);
	let v2 = vec4(5, 6, 7, 8);

	// Test addition
	const result = v1.add(v2);
	expect(result.x).toBe(6);
	expect(result.y).toBe(8);
	expect(result.z).toBe(10);
	expect(result.w).toBe(12);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec4(1, 2, 3, 4);
	v2 = vec4(5, 6, 7, 8);

	// Chain additional expectations
	const cloneRes = v1.clone().add(v2);
	expect(cloneRes.x).toBe(6);
	expect(cloneRes.y).toBe(8);
	expect(cloneRes.z).toBe(10);
	expect(cloneRes.w).toBe(12);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec4.sub", () => {
	let v1 = vec4(5, 8, 10, 12);
	let v2 = vec4(2, 3, 4, 5);

	// Test subtraction
	const result = v1.sub(v2);
	expect(result.x).toBe(3);
	expect(result.y).toBe(5);
	expect(result.z).toBe(6);
	expect(result.w).toBe(7);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec4(5, 8, 10, 12);
	v2 = vec4(2, 3, 4, 5);

	// Chain additional expectations
	const cloneRes = v1.clone().sub(v2);
	expect(cloneRes.x).toBe(3);
	expect(cloneRes.y).toBe(5);
	expect(cloneRes.z).toBe(6);
	expect(cloneRes.w).toBe(7);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec4.mul", () => {
	let v1 = vec4(2, 3, 4, 5);
	const scalar = 1.5;

	// Test multiplication
	const result = v1.mul(scalar);
	expect(result.x).toBe(3);
	expect(result.y).toBe(4.5);
	expect(result.z).toBe(6);
	expect(result.w).toBe(7.5);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec4(2, 3, 4, 5);

	// Chain additional expectations
	const cloneRes = v1.clone().mul(scalar);
	expect(cloneRes.x).toBe(3);
	expect(cloneRes.y).toBe(4.5);
	expect(cloneRes.z).toBe(6);
	expect(cloneRes.w).toBe(7.5);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec4.div", () => {
	let v1 = vec4(6, 9, 12, 15);
	const divisor = 2;

	// Test division
	const result = v1.div(vec4(divisor));
	expect(result.x).toBe(3);
	expect(result.y).toBe(4.5);
	expect(result.z).toBe(6);
	expect(result.w).toBe(7.5);

	// Check if it returned the first vector
	expect(result).toBe(v1);

	// Reassign variables for the next set of operations
	v1 = vec4(6, 9, 12, 15);

	// Chain additional expectations
	const cloneRes = v1.clone().div(vec4(divisor));
	expect(cloneRes.x).toBe(3);
	expect(cloneRes.y).toBe(4.5);
	expect(cloneRes.z).toBe(6);
	expect(cloneRes.w).toBe(7.5);

	// Check if the cloned vector is not the same object as v1
	expect(cloneRes).not.toBe(v1);
});

test("vec4.mag", () => {
	const v = vec4(3, 4, 5, 6);

	// Test magnitude
	const magnitude = v.mag();
	expect(magnitude).toBeCloseTo(Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2 + 6 ** 2));
});

test("vec4.normalize", () => {
	let v = vec4(3, 4, 5, 6);

	// Test normalization
	const result = v.normalize();
	const magnitude = Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2 + 6 ** 2);
	expect(result.x).toBeCloseTo(3 / magnitude);
	expect(result.y).toBeCloseTo(4 / magnitude);
	expect(result.z).toBeCloseTo(5 / magnitude);
	expect(result.w).toBeCloseTo(6 / magnitude);

	// Check if it returned the original vector
	expect(result).toBe(v);

	// Reassign variables for the next set of operations
	v = vec4(3, 4, 5, 6);

	// Chain additional expectations
	const cloneRes = v.clone().normalize();
	expect(cloneRes.x).toBeCloseTo(3 / magnitude);
	expect(cloneRes.y).toBeCloseTo(4 / magnitude);
	expect(cloneRes.z).toBeCloseTo(5 / magnitude);
	expect(cloneRes.w).toBeCloseTo(6 / magnitude);

	// Check if the cloned vector is not the same object as v
	expect(cloneRes).not.toBe(v);

	const vec = vec4(0);
	const norm = vec.normalize();
	expect(norm).toBe(vec);
});

test("Chaining Operations", () => {
	let v1 = vec4(1, 2, 3, 4);
	let v2 = vec4(5, 6, 7, 8);

	// Chaining multiple operations
	const result = v1.add(v2).mul(2).sub(vec4(1, 1, 1, 1));

	// Check the final result
	expect(result.x).toBe((1 + 5) * 2 - 1);
	expect(result.y).toBe((2 + 6) * 2 - 1);
	expect(result.z).toBe((3 + 7) * 2 - 1);
	expect(result.w).toBe((4 + 8) * 2 - 1);

	expect(result).toBe(v1);
});

test("vec4.toString", () => {
	expect(vec4(2, 3, 4, 5).toString()).toBe(
		"Vector4 [ x: 2, y: 3, z: 4, w: 5 ]"
	);
});

test("vec4.toArray", () => {
	expect(vec4(2, 3, 4, 5).toArray()).toStrictEqual([2, 3, 4, 5]);
});

test("vec4.Symbol[iterator]", () => {
	const vec = vec4(2, 3, 4, 5);
	expect(vec.toArray()).toStrictEqual([...vec]);
});
