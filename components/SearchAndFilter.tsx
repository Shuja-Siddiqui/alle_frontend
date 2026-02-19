"use client";

import Image from "next/image";

type SearchAndFilterProps = {
  /** Search input value */
  searchValue: string;
  /** Called when search value changes */
  onSearchChange: (value: string) => void;
  /** Called when filter button is clicked */
  onFilterClick: () => void;
  /** Optional placeholder text for search input */
  searchPlaceholder?: string;
  /** Optional className for custom styling */
  className?: string;
};

export function SearchAndFilter({
  searchValue,
  onSearchChange,
  onFilterClick,
  searchPlaceholder = "Search by name or email",
  className,
}: SearchAndFilterProps) {
  return (
    <div className={`flex items-center justify-between gap-[12px] ${className ?? ""}`}>
      {/* Search Input */}
      <div
        className="flex gap-[12px] h-[52px] items-center px-[24px] rounded-[32px] shrink-0"
        style={{
          width: "350px",
          backgroundImage:
            "linear-gradient(175.94962593890818deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        }}
      >
        {/* Search Icon */}
        <div
          className="relative shrink-0"
          style={{
            width: "28px",
            height: "28px",
          }}
        >
          <Image
            src="/assets/icons/admin/search_icon.svg"
            alt="Search"
            width={28}
            height={28}
            className="block max-w-none size-full"
          />
        </div>
        {/* Search Input */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="flex-1 bg-transparent border-none outline-none placeholder:text-[#7478a2]"
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.5",
            color: searchValue ? "#FFFFFF" : "#7478a2",
            letterSpacing: "-0.154px",
          }}
        />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={onFilterClick}
        className="flex gap-[12px] h-[52px] items-center justify-center px-[24px] rounded-[32px] shrink-0 cursor-pointer"
        style={{
          backgroundImage:
            "linear-gradient(169.12478140874845deg, rgb(11, 15, 55) 12.006%, rgb(27, 31, 78) 94.629%)",
        }}
      >
        {/* Filter Icon */}
        <div
          className="relative shrink-0"
          style={{
            width: "20px",
            height: "20px",
          }}
        >
          <Image
            src="/assets/icons/admin/filter_icon.svg"
            alt="Filter"
            width={20}
            height={20}
            className="block max-w-none size-full"
          />
        </div>
        {/* Filter Text */}
        <p
          style={{
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#FFFFFF",
            letterSpacing: "-0.154px",
          }}
        >
          Filters
        </p>
      </button>
    </div>
  );
}

