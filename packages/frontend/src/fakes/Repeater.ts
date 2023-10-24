import { faker } from '@faker-js/faker';

export default class Repeater {
    static random<T>(callable: (...args: any[]) => T, iterations?: number): T[] {
        return Array(iterations ?? faker.number.int({ max: 20 })).fill({}).map(() => callable())
    }
}