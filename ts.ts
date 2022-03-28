// type exp = Zip<[1, 2], [true, false]>; // expected to be [[1, true], [2, false]]

// type Zip<T extends unknown[], U extends unknown[]> = T extends [infer TF, ...infer TR]
//     ? U extends [infer UF, ...infer UR]
//         ? [[TF, UF], ...Zip<TR, UR>]
//         : []
//     : [];
// your answers
// 1.将字符串转化为联合类型
type StringToUnion<S extends string> = S extends `${infer L}${infer R}` ? L | StringToUnion<R> : S;
// 2.联合类型两两合并
type Combination<A extends string, B extends string> = A | B | `${A}${B}` | `${B}${A}`;
// 3 eg
type test = Combination<"A" | "B", "C" | "D">;
//4.联合类型的合并，利用联合类型默认可拆解
type UnionCombination<A extends string, B extends string = A> = A extends B
    ? Combination<A, UnionCombination<Exclude<B, A>>>
    : never;
//5. 字符串合并
type AllCombinations<S extends string> = UnionCombination<StringToUnion<S>>;
type AllCombinations_ABC = AllCombinations<"ABC">;
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'

type Flip<T extends Record<PropertyKey, any>> = {
    [P in keyof T as `${T[P]}`]: P;
};


