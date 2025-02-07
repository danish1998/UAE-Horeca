import React, { useState } from "react";
import FilterTitle from "./FilterTitle";
import CustomCheckboxes from "./CustomCheckboxes";

const DynamicFilter = ({ data, setDynamicParams, dynamicParams }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (id, specName, specType, isChecked, value) => {
    setSelectedFilters(prevFilters => {
      let newFilters = [...prevFilters];

      if (isChecked) {
        if (specType === "range") {
          const [start, end] = value.split('-');
          newFilters.push({
            specification_name: specName,
            specification_type: "range",
            specification_value: {
              start: parseInt(start),
              end: parseInt(end)
            }
          });
        } else if (specType === "fixed") {
          newFilters.push({
            specification_name: specName,
            specification_type: "fixed",
            specification_value: value
          });
        }
      } else {
        newFilters = newFilters.filter(filter => 
          !(filter.specification_name === specName && 
            ((specType === "range" && filter.specification_value.start === parseInt(value.split('-')[0])) ||
             (specType === "fixed" && filter.specification_value === value))
          )
        );
      }

      const queryString = updateQueryParams(newFilters);
      setDynamicParams(queryString, true);
      return newFilters;
    });
  };

  const updateQueryParams = (filters) => {
    return filters.map((filter, index) => {
      if (filter.specification_type === "range") {
        return `applied_filters[${index}][specification_name]=${encodeURIComponent(filter.specification_name)}&` +
               `applied_filters[${index}][specification_type]=${encodeURIComponent(filter.specification_type)}&` +
               `applied_filters[${index}][specification_value][start]=${filter.specification_value.start}&` +
               `applied_filters[${index}][specification_value][end]=${filter.specification_value.end}`;
      } 
      return `applied_filters[${index}][specification_name]=${encodeURIComponent(filter.specification_name)}&` +
             `applied_filters[${index}][specification_type]=${encodeURIComponent(filter.specification_type)}&` +
             `applied_filters[${index}][specification_value]=${encodeURIComponent(filter.specification_value)}`;
    }).join('&');
  };

  const handleClearAll = (title) => {
    setSelectedFilters(prev => {
      const newFilters = prev.filter(f => f.specification_name !== title);
      const queryString = updateQueryParams(newFilters);
      setDynamicParams(queryString, true);
      return newFilters;
    });
  };

  const renderRangeFilter = (ranges, title, type) => (
    <React.Fragment>
      <div className="relative mt-3">
        <div className="flex items-center justify-between">
          <FilterTitle title={title} />
          <span
            className="text-sm underline text-gray-400 font-semibold cursor-pointer"
            onClick={() => handleClearAll(title)}
          >
            Clear All
          </span>
        </div>
        <div className="mt-3">
          {Object.entries(ranges).map(([key, range]) => {
            const min = Math.min(range.min, range.max);
            const max = Math.max(range.min, range.max);
            const rangeValue = `${min}-${max}`;
            const isChecked = selectedFilters.some(f => 
              f.specification_name === title && 
              f.specification_type === "range" &&
              f.specification_value.start === min &&
              f.specification_value.end === max
            );

            return (
              <div key={key} className="mt-2">
                <CustomCheckboxes
                  id={rangeValue}
                  title={`${min} - ${max}`}
                  checked={isChecked}
                  onChange={(checked) =>
                    handleCheckboxChange(`${title}-${key}`, title, type, checked, rangeValue)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-300 my-3"></div>
    </React.Fragment>
  );

  const renderCheckboxFilter = (fixed, title, type) => (
    <React.Fragment>
      <div className="relative mt-3">
        <div className="flex items-center justify-between">
          <FilterTitle title={title} />
          <span
            className="text-sm underline text-gray-400 font-semibold cursor-pointer"
            onClick={() => handleClearAll(title)}
          >
            Clear All
          </span>
        </div>
        <div className="mt-3">
          {fixed && Object.entries(fixed).map(([key, value], index) => {
            const isChecked = selectedFilters.some(f => 
              f.specification_name === title && 
              f.specification_type === "fixed" &&
              f.specification_value === value
            );

            return (
              <React.Fragment key={key}>
                {(seeMore || index < 5) && (
                  <CustomCheckboxes
                    id={`${title}-${key}`}
                    title={value}
                    types={type}
                    quantity={value.quantity}
                    checked={isChecked}
                    onChange={(checked) =>
                      handleCheckboxChange(`${title}-${key}`, title, type, checked, value)
                    }
                  />
                )}
              </React.Fragment>
            );
          })}
          {Object.keys(fixed || {}).length > 5 && (
            <p
              className="underline text-gray-700 text-xs mt-2 cursor-pointer"
              onClick={() => setSeeMore(!seeMore)}
            >
              {!seeMore ? "See More" : "See Less"}
            </p>
          )}
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <div>
      {data?.map((item) => {
        const title = item.specification_name;
        const type = item.specification_type;
        
        if (type === 'range') {
          return renderRangeFilter(item.specification_value, title, type);
        } else if (type === 'fixed') {
          return renderCheckboxFilter(item.specification_value, title, type);
        }
        return null;
      })}
    </div>
  );
};

export default DynamicFilter;