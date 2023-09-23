import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { baseURL, categories as categoriesList } from "../utilities/constants";
import "../css/Headlines.css";
import Filters from "./Filters";
import FollowedArticles from "./FollowedArticles";
import Categories from "./Categories";
import { hasFollowedNews } from "../utilities/helper";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  // write task 3 state here(useState)
  //TODO: Standard Anwer does not contain pass down the state itself, only passing down the stateHandler;
  const [dateRange, setDateRange] = useState([]);
  const [category, setCategory] = useState([]);
  const [country, setCountry] = useState({});

  const [news, setNews] = useState(null);

  const dateOnChangeHandler = (date) => {
    setDateRange(date);
  };

  const categoryOnChangeHandler = (category) => {
    setCategory(category);
  };

  const countryOnChangeHandler = (country) => {
    setCountry(country);
  };

  // write task 4 solution here

  useEffect(() => {
    let URLs = [];
    const NEWS_API_KEY = process.env.REACT_APP_NEWS_KEY;
    let countrySelected = country && country.value ? country.value : "us";
    let thisURL = "";

    if (dateRange && dateRange.length !== 0) {
      console.log(dateRange[0].toISOString());
      console.log(dateRange[1].toISOString());

      thisURL =
        baseURL +
        "/top-headlines/sources?" +
        "country=" +
        countrySelected +
        "&apiKey=" +
        NEWS_API_KEY +
        "&from=" +
        dateRange[0].toISOString() +
        "&to=" +
        dateRange[1].toISOString();
    } else {
      thisURL =
        baseURL +
        "/top-headlines?" +
        "country=" +
        countrySelected +
        "&apiKey=" +
        NEWS_API_KEY +
        "&pageSize=10";
    }
    if (category.length !== 0) {
      category.forEach((element) => {
        console.log(element);
        URLs.push(thisURL + "&category=" + element.value);
      });
    } else {
      URLs.push(thisURL);
    }

    console.log(URLs);

    let categoryNews = [];

    const getResponseAndSetState = (res, url) => {
      // console.log(url);
      const urlParams = new URLSearchParams(url.split("?")[2]);
      // console.log(urlParams);

      let urlCategory = urlParams.get("category");

      if (urlCategory) {
        urlCategory = category.filter(
          (element) => element.value === urlParams.get("category")
        );
        urlCategory = urlCategory[0];
        // console.log(`urlCategory is ${urlCategory}`);
      } else {
        urlCategory = {
          label: "Headlines",
          value: "breaking-news",
          icon: faNewspaper,
        };
      }

      let tmpCategoryNews = {
        urlCategory,
        articles: res.articles,
      };

      categoryNews = [...categoryNews, tmpCategoryNews];
      setNews(categoryNews);
    };

    URLs.forEach(async (url) => {
      const apiResp = await fetch(url).then((result) => result.json());

      if (apiResp.status !== "ok") {
        console.error(apiResp.message);
      }
      if (apiResp.hasOwnProperty("sources")) {
        let sources = "";
        if (apiResp.sources.length >= 20) {
          apiResp.sources = apiResp.sources.slice(0, 18);
        }
        apiResp.sources.forEach((source) => {
          sources += source.id;
        });
        let newURL =
          baseURL +
          "/everything?" +
          "&apiKey=" +
          NEWS_API_KEY +
          "&sources=" +
          sources;

        console.log(`newURL is ${newURL}`);

        const article = fetch(newURL).then((result) => result.json());
        getResponseAndSetState(article, url);
      }
      if (apiResp.hasOwnProperty("articles")) {
        getResponseAndSetState(apiResp, url);
      }
    });
  }, [category, dateRange, country]);

  // Write task 11 Create state solution

  return (
    <Container className="main_container my-5">
      <Row className="col-xxl-10 mx-auto">
        <h1>News Portal</h1>
        {/* write task 3 here */}
        <Filters
          dateRange={dateRange}
          category={category}
          country={country}
          dateOnChangeHandler={dateOnChangeHandler}
          categoryOnChangeHandler={categoryOnChangeHandler}
          countryOnChangeHandler={countryOnChangeHandler}
        />
        {/* write task 6 here */}
        {news &&
          news.map((element) => (
            <Categories key={element.urlCategory.value} news={element} />
          ))}
        {/* write task 10 here */}
        {hasFollowedNews() && <FollowedArticles />}
      </Row>
    </Container>
  );
};

export default Index;
