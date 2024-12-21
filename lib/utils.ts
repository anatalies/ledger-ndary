import { clsx, type ClassValue } from "clsx"
import { format, subMonths } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  const formattedAmount = amount.toLocaleString('en-US')
  return `KES ${formattedAmount}`
}

export function getLastFourMonths() {
  const today = new Date()
  const months = []

  for (let index = 0; index < 6; index++) {
    const pastMonth = subMonths(today, index)
    months.push(format(pastMonth, 'MMMM'))
  }

  return months
}