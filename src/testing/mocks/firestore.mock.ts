import { DocumentData, Firestore, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

const rawMockQueryDocSnapshot = {
  id: 'mock-doc-id',
  ref: {} as any,
  metadata: {} as any,
  data: jest.fn(() => ({
    field1: 'value1',
    field2: 'value2',
  })),
  get: jest.fn((fieldPath: string) => {
    const data = {
      field1: 'value1',
      field2: 'value2',
    };
    return data[fieldPath as keyof typeof data];
  }),
  isEqual: jest.fn(() => true),
  exists: () => true,
};

export const mockQueryDocSnapshot = rawMockQueryDocSnapshot as unknown as QueryDocumentSnapshot<DocumentData>;

export const mockQuerySnapshot: QuerySnapshot<DocumentData> = {
  docs: [mockQueryDocSnapshot],
  size: 1,
  empty: false,
  metadata: {} as any,
  docChanges: jest.fn(() => []),
  forEach: jest.fn((callback: (doc: QueryDocumentSnapshot<DocumentData>) => void) => {
    callback(mockQueryDocSnapshot);
  }),
  query: {} as any,
};

export const createMockFirestore = (overrides?: Partial<Firestore>): Partial<Firestore> => ({
  ...overrides,
});
