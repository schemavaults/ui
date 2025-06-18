"use client"

import type { ReactElement, ComponentPropsWithoutRef} from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = (
  {
    className,
    ...props
  }: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
): ReactElement => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = (
  {
    className,
    ...props
  }: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
): ReactElement => {

  const circle = <Circle className="h-2.5 w-2.5 fill-current text-current" />

  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {
        props.children ? (
          props.checked ? (
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              { props.children ? props.children : circle }
            </RadioGroupPrimitive.Indicator>
          ) : (
            props.children
          )
        ) : (
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            { circle }
          </RadioGroupPrimitive.Indicator>
        )
      }

    </RadioGroupPrimitive.Item>
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
