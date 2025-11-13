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
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
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

export function DateRangePicker() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });

  const [activePreset, setActivePreset] = useState<ActivePreset>('90d');

  useEffect(() => {
    const today = new Date();

    switch (activePreset) {
      case '90d':
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDate({ from: subDays(today, 90), to: today });
        break;
      case '30d':
        setDate({ from: subDays(today, 30), to: today });
        break;
      case '7d':
        setDate({ from: subDays(today, 7), to: today });
        break;
      default:
        break;
    }
  }, [activePreset]);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setActivePreset('custom');
  };

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row md:flex-wrap md:items-center md:justify-end">
      <ToggleGroup
        type="single"
        value={activePreset}
        onValueChange={(preset) => setActivePreset(preset as ActivePreset)}
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
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
