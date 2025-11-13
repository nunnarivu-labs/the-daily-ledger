'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays, differenceInDays, endOfDay } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

type ActivePreset = '90d' | '30d' | '7d' | 'custom';

const today = endOfDay(new Date());

function getActivePreset(date: DateRange): ActivePreset {
  if (!date.from || !date.to) return 'custom';
  const interval = differenceInDays(date.to, date.from);

  if (interval === undefined) return 'custom';

  switch (interval) {
    case 90:
      return '90d';
    case 30:
      return '30d';
    case 7:
      return '7d';
    default:
      return 'custom';
  }
}

export function DateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(today, 90),
    to: today,
  });

  const [activePreset, setActivePreset] = useState<ActivePreset>(
    getActivePreset({ from: dateRange.from, to: dateRange.to }),
  );

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (!newDate?.from || !newDate?.to) return;

    const nextDate: DateRange = {
      from: newDate.from,
      to: endOfDay(newDate.to),
    };

    setDateRange(nextDate);
    setActivePreset(getActivePreset(nextDate));
  };

  const handleActivePresetSelect = useCallback(
    (newActivePreset: ActivePreset) => {
      setActivePreset(newActivePreset);

      switch (newActivePreset) {
        case '90d':
          setDateRange({ from: subDays(today, 90), to: today });
          break;
        case '30d':
          setDateRange({ from: subDays(today, 30), to: today });
          break;
        case '7d':
          setDateRange({ from: subDays(today, 7), to: today });
          break;
        default:
          break;
      }
    },
    [],
  );

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row md:flex-wrap md:items-center md:justify-end">
      <ToggleGroup
        type="single"
        value={activePreset}
        onValueChange={(preset) =>
          handleActivePresetSelect(preset as ActivePreset)
        }
        variant="outline"
        className="hidden md:flex"
      >
        <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
        <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
        <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
      </ToggleGroup>
      <Select
        value={activePreset}
        onValueChange={(preset) => setActivePreset(preset as ActivePreset)}
      >
        <SelectTrigger
          className="flex w-full md:hidden"
          size="sm"
          aria-label="Select a value"
        >
          <SelectValue placeholder="Last 3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="90d" className="rounded-lg">
            Last 3 months
          </SelectItem>
          <SelectItem value="30d" className="rounded-lg">
            Last 30 days
          </SelectItem>
          <SelectItem value="7d" className="rounded-lg">
            Last 7 days
          </SelectItem>
          <SelectItem value="custom" className="rounded-lg">
            Custom
          </SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              'w-full md:w-[260px]',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          onBlur={() => {
            console.log('Hello World');
          }}
        >
          <Calendar
            today={today}
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
