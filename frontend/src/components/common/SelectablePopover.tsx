import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface SelectablePopoverProps<T> {
  items: T[];
  field: { value: any; name: string };
  form: any;
  placeholder: string;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  buttonClassName?: string;
  disabled?: boolean;
}

export const SelectablePopover = <T extends { id: string | number }>({
  items,
  field,
  form,
  placeholder,
  onSelect,
  renderItem,
  buttonClassName = "",
  disabled = false,
}: SelectablePopoverProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            " justify-between",
            buttonClassName,
            !field.value && "text-muted-foreground"
          )}>
          {field.value ? (
            items.find((item) => item.id === field.value) ? (
              renderItem(items.find((item) => item.id === field.value)!)
            ) : (
              <span>Не найдено</span>
            )
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Command>
          <CommandInput placeholder={`Поиск...`} className="h-9" />
          <CommandList>
            <CommandEmpty>Не найдено.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item.id)}
                  onSelect={() => {
                    form.setValue(field.name, item.id);
                    onSelect(item);
                    setOpen(false);
                  }}>
                  {renderItem(item)}
                  <Check
                    className={cn(
                      "ml-auto",
                      item.id === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
