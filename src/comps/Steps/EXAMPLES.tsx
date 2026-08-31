/**
 * @example Using Steps with useStepper hook
 * ```tsx
 * import { Steps, StepsProvider, useStepper, Button, Flex } from '@zuzjs/ui';
 * 
 * function Wizard() {
 *   const steps = [
 *     { label: "Account Info", description: "Set up your account" },
 *     { label: "Profile", description: "Complete your profile" },
 *     { label: "Confirmation", description: "Review and confirm" }
 *   ];
 * 
 *   return (
 *     <StepsProvider steps={steps} defaultCurrent={0}>
 *       <Flex cols gap={20}>
 *         <Steps />
 *         <StepNavigation />
 *         <StepContent />
 *       </Flex>
 *     </StepsProvider>
 *   );
 * }
 * 
 * function StepNavigation() {
 *   const { current, total, prev, next, isFirst, isLast } = useStepper();
 *   
 *   return (
 *     <Flex jcb>
 *       <Button onClick={prev} disabled={isFirst}>Previous</Button>
 *       <Text>{current + 1} of {total}</Text>
 *       <Button onClick={next} disabled={isLast}>Next</Button>
 *     </Flex>
 *   );
 * }
 * 
 * function StepContent() {
 *   const { current, canGoBack, canGoForward } = useStepper();
 *   
 *   return (
 *     <Box>
 *       <Text>Step {current + 1} content here</Text>
 *       {!canGoBack && <Text dim>You're on the first step</Text>}
 *       {!canGoForward && <Text success>Almost done! This is the last step</Text>}
 *     </Box>
 *   );
 * }
 * ```
 * 
 * @example Using Steps without provider (controlled mode)
 * ```tsx
 * import { Steps } from '@zuzjs/ui';
 * import { useState } from 'react';
 * 
 * function ControlledSteps() {
 *   const [current, setCurrent] = useState(0);
 *   const steps = [
 *     { label: "Step 1" },
 *     { label: "Step 2" },
 *     { label: "Step 3" }
 *   ];
 * 
 *   return (
 *     <Steps 
 *       steps={steps}
 *       current={current}
 *       onChange={(index) => setCurrent(index)}
 *       clickable
 *     />
 *   );
 * }
 * ```
 */
export {};
