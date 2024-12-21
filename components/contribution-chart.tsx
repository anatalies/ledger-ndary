"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { getLastFourMonths } from "@/lib/utils"
import { fetchContributionsForChart } from "@/lib/data"


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface ChartDataType {
    date: string,
    amount: number,
}

export function ContributionsChart() {
    const [activeMonth, setActiveMonth] = useState(format(new Date(), 'MMMM'))
    const [chartData, setChartData] = useState<ChartDataType[]>([])
    const months = getLastFourMonths()

    useEffect(() => {
        const getData = async () => {
            const data = await fetchContributionsForChart(activeMonth)
            setChartData(data)
        }
        getData()
    }, [activeMonth])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Contributions</CardTitle>
            <Select value={activeMonth} onValueChange={setActiveMonth}>
                <SelectTrigger className="w-1/2">
                    <SelectValue placeholder='select month'/>
                </SelectTrigger>
                <SelectContent>
                    {months.map((month) => {
                        return (
                            <SelectItem 
                                key={month}
                                value={month}
                                className="[&_span]:flex"
                            >
                                <div className="flex items-center gap-2 text-xs">
                                    <span
                                        className="flex h-3 w-3 shrink-0 rounded-sm"
                                        style={{
                                            backgroundColor: `var(--color-${month}`
                                        }}
                                    />
                                    {month}
                                </div>
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="#FF00FF"
              fillOpacity={0.4}
              stroke="#B53389"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <CardDescription>Showing total contributions for {activeMonth}</CardDescription>
      </CardFooter>
    </Card>
  )
}
