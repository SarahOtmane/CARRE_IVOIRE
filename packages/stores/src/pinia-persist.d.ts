import type { StateTree } from 'pinia'

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- generic required by Pinia module augmentation
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: boolean | Record<string, unknown>
  }
}
