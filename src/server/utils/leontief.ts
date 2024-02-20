import { matrix, identity, inv, subtract, multiply, MathCollection } from "mathjs";
import { Table } from "./types";

export function open (
    a: MathCollection = [], // Economy
    b: MathCollection = [] // Demand
) {
    const A = matrix(a);
    const B = matrix(b);
    const I = identity(A.size());

    // B (I - A)⁻¹
    const X = multiply(inv(subtract(I, A)), B);

    return X.valueOf() as Table;
}

export function closed (
    a: MathCollection = [] // Economy
) {
    const A = matrix(a);
    const I = identity(A.size());
    const X = inv(subtract(I,A))

    return X.valueOf() as Table;
}
