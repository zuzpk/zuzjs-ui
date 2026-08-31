// 'use client'

// import { createContext, forwardRef, ReactNode, useContext, useImperativeHandle, useMemo, useState } from "react"
// import { useDelayed } from "@zuzjs/hooks"
// import { useBase } from "."
// import { useTheme } from "./useColorScheme"
// import { BoxProps } from "../types"
// import { Variant } from "../types/enums"
// import Box from "../comps/Box"
// import StepItem from "../comps/Steps/item"
// import { Step, StepsController, StepsProps } from "../comps/Steps/types"

// /**
//  * Context for Steps state management
//  */
// interface StepsContextValue {
//     current: number
//     total: number
//     steps: Step[]
//     prev: () => void
//     next: () => void
//     goTo: (index: number) => void
//     isFirst: boolean
//     isLast: boolean
//     canGoBack: boolean
//     canGoForward: boolean
// }

// const StepsContext = createContext<StepsContextValue | null>(null)

// export { StepsContext }

// /**
//  * Hook to access Steps context for navigation control
//  * @example
//  * ```tsx
//  * function StepNavigation() {
//  *   const { current, total, prev, next, isFirst, isLast } = useStepper()
//  *   return (
//  *     <div>
//  *       <button onClick={prev} disabled={isFirst}>Previous</button>
//  *       <span>{current + 1} of {total}</span>
//  *       <button onClick={next} disabled={isLast}>Next</button>
//  *     </div>
//  *   )
//  * }
//  * ```
//  */
// export function useStepper(): StepsContextValue {
//     const context = useContext(StepsContext)
//     if (!context) {
//         throw new Error('useStepper must be used within a StepsProvider')
//     }
//     return context
// }

// /**
//  * StepsProvider component that wraps Steps and provides navigation context
//  */
// export type StepsProviderProps = {
//     steps: Step[]
//     defaultCurrent?: number
//     children: ReactNode
//     onStepChange?: (index: number, step: Step) => void
// }

// export function StepsProvider({ 
//     steps, 
//     defaultCurrent = 0, 
//     children, 
//     onStepChange 
// }: StepsProviderProps) {
//     const [current, setCurrent] = useState(defaultCurrent)

//     const prev = () => {
//         if (current > 0) {
//             const newIndex = current - 1
//             setCurrent(newIndex)
//             onStepChange?.(newIndex, steps[newIndex])
//         }
//     }

//     const next = () => {
//         if (current < steps.length - 1) {
//             const newIndex = current + 1
//             setCurrent(newIndex)
//             onStepChange?.(newIndex, steps[newIndex])
//         }
//     }

//     const goTo = (index: number) => {
//         if (index >= 0 && index < steps.length) {
//             setCurrent(index)
//             onStepChange?.(index, steps[index])
//         }
//     }

//     const value = useMemo<StepsContextValue>(() => ({
//         current,
//         total: steps.length,
//         steps,
//         prev,
//         next,
//         goTo,
//         isFirst: current === 0,
//         isLast: current === steps.length - 1,
//         canGoBack: current > 0,
//         canGoForward: current < steps.length - 1,
//     }), [current, steps.length, steps])

//     return (
//         <StepsContext.Provider value={value}>
//             {children}
//         </StepsContext.Provider>
//     )
// }

// /**
//  * Controlled Steps component that uses context when available
//  */
// const Steps = forwardRef<StepsController, StepsProps>((props, ref) => {

//     const {
//         steps,
//         current: currentProp,
//         variant = Variant.Medium,
//         direction = 'horizontal',
//         showNumber = true,
//         clickable = false,
//         onChange,
//         ...rest
//     } = props

//     // Try to get context, but don't throw if not available
//     const context = useContext(StepsContext)
    
//     // Use context if available, otherwise use local state
//     const [localCurrent, setLocalCurrent] = useState(currentProp ?? 0)
    
//     // Determine which current value to use
//     const current = context?.current ?? currentProp ?? localCurrent
//     const setCurrent = context ? context.goTo : setLocalCurrent

//     // Hooks must always be called in the same order
//     useDelayed()
//     useTheme()
//     const { className } = useBase(props)

//     // Handler for step click
//     const handleStepClick = (index: number, step: Step) => {
//         if (clickable) {
//             setCurrent(index)
//             onChange?.(index, step)
//         }
//     }

//     // Determine if a step is completed
//     const isCompleted = (index: number, step: Step): boolean => {
//         if (step.completed !== undefined) {
//             return step.completed
//         }
//         return index < current
//     }

//     // Determine if a step is active
//     const isActive = (index: number): boolean => {
//         return index === current
//     }

//     // Expose controller methods via ref
//     useImperativeHandle(ref, () => ({
//         setCurrent: (index: number) => setCurrent(index),
//         getCurrent: () => current,
//         setCompleted: () => {
//             // Advance to next step if context is available
//             if (context) {
//                 context.next()
//             } else {
//                 if (current < steps.length - 1) {
//                     setCurrent(current + 1)
//                 }
//             }
//         }
//     }), [current, steps.length, context, setCurrent])

//     // Build container class names
//     const containerClasses = [
//         '--steps',
//         `--${direction}`,
//         `--${variant}`,
//         className
//     ].filter(Boolean).join(' ')

//     return (
//         <Box className={containerClasses} {...rest}>
//             {steps.map((step, index) => {
//                 const stepWithIndex: Step = {
//                     ...step,
//                     index,
//                     key: step.key ?? `step-${index}`
//                 }

//                 return (
//                     <StepItem
//                         key={stepWithIndex.key}
//                         step={stepWithIndex}
//                         index={index}
//                         active={isActive(index)}
//                         completed={isCompleted(index, step)}
//                         last={index === steps.length - 1}
//                         direction={direction}
//                         variant={variant}
//                         showNumber={showNumber}
//                         clickable={clickable}
//                         onClick={handleStepClick}
//                     />
//                 )
//             })}
//         </Box>
//     )
// })

// Steps.displayName = 'Steps'

// export default Steps

// // Re-export types
// export * from '../comps/Steps/types'
