// import {
//   DependencyList,
//   EffectCallback,
//   useEffect,
//   useRef,
//   useState
// } from 'react'

// export function useEffectProp(useStore: any, prop: string) {
//   const [res, setRes] = useState()
//   const { [prop]: realProp } = useStore()
//   useEffect(() => {
//     setRes(realProp)
//   }, [])
//   return res
// }

// export const useSkipFirstEffect = (
//   effect: EffectCallback,
//   deps?: DependencyList
// ) => {
//   let lock = useRef(true)
//   useEffect(() => {
//     if (lock.current) {
//       lock.current = false
//       return
//     }
//     effect()
//   }, deps)
// }

// export function useDeferredState<T>({
//   value,
//   initValue,
//   withSet
// }: {
//   value: T
//   initValue?: T
//   withSet?: boolean
// }) {
//   const [state, setState] = useState<T | undefined>(initValue)
//   useEffect(() => {
//     setState(value)
//   }, [])
//   if (withSet) return [state, setState]
//   return state
// }

// export const useDefer = (initValue?: boolean) => {
//   const [isDeferred, setIsDeferred] = useState(initValue ?? false)
//   useEffect(() => {
//     setIsDeferred(!isDeferred)
//   }, [])
//   return isDeferred
// }
