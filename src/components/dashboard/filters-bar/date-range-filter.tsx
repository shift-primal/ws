import { CalendarBlankIcon, XIcon } from "@phosphor-icons/react";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "#/components/shadcn/ui/button";
import { Calendar } from "#/components/shadcn/ui/calendar";
import { Field, FieldLabel } from "#/components/shadcn/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/shadcn/ui/popover";

export function DateRangeFilter({
	from,
	to,
	onChange,
}: {
	from: string | undefined;
	to: string | undefined;
	onChange: (range: {
		from: string | undefined;
		to: string | undefined;
	}) => void;
}) {
	const dateRange: DateRange | undefined = from
		? { from: parseISO(from), to: to ? parseISO(to) : undefined }
		: undefined;

	function handleDateRangeChange(range: DateRange | undefined) {
		onChange({
			from: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
			to: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
		});
	}

	return (
		<Field className="w-auto">
			<FieldLabel htmlFor="date-range-filter">Date range</FieldLabel>
			<div className="flex items-center gap-1">
				<Popover>
					<PopoverTrigger
						render={
							<Button
								variant="outline"
								id="date-range-filter"
								className="justify-start px-2.5 font-normal"
							/>
						}
					>
						<CalendarBlankIcon data-icon="inline-start" />
						{dateRange?.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} –{" "}
									{format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							<span>All time</span>
						)}
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="range"
							defaultMonth={dateRange?.from}
							selected={dateRange}
							onSelect={handleDateRangeChange}
							numberOfMonths={2}
						/>
					</PopoverContent>
				</Popover>
				{dateRange?.from && (
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Clear date range"
						onClick={() => handleDateRangeChange(undefined)}
					>
						<XIcon />
					</Button>
				)}
			</div>
		</Field>
	);
}
