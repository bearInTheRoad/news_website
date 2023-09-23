import React from "react";
import { DateRangePicker } from "rsuite";
import { countries, categories } from "../utilities/constants";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Filters.css";

const Filters = ({
  dateRange,
  category,
  country,
  dateOnChangeHandler,
  categoryOnChangeHandler,
  countryOnChangeHandler,
}) => {
  const { afterToday } = DateRangePicker;

  // console.log(dateRange);

  return (
    <div className="d-flex flex-lg-row flex-column justify-content-between">
      <div className="span_text col-12 col-lg-4 mb-3 ">
        <label className="mb-1">Date</label>
        <DateRangePicker
          className="d-block date_picker"
          placeholder="Select Date Range"
          disabledDate={afterToday()}
          value={dateRange}
          onChange={(evt) => {
            // console.log(evt);
            dateOnChangeHandler(evt);
          }}
        />
      </div>
      <div className="span_text col-12 col-lg-4 px-0 px-lg-3 mb-3">
        <label className="mb-1">Countries</label>
        <Select
          options={countries}
          isClearable
          placeholder="Select Country"
          aria-expanded="false"
          shrink="false"
          value={country}
          onChange={(evt) => {
            console.log(evt);
            countryOnChangeHandler(evt);
          }}
        />
      </div>
      <div className="span_text col-12 col-lg-4 mb-3 ">
        <label className="mb-1">Categories</label>
        <Select
          options={categories}
          isMulti
          name="topic"
          placeholder="Select Categories"
          value={category}
          onChange={(evt) => {
            console.log(evt);
            categoryOnChangeHandler(evt);
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
