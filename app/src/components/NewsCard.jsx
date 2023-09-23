import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {
  faCircleChevronUp,
  faCircleChevronDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseURL } from "../utilities/constants";
import "../css/Headlines.css";
import { hasFollowedNews } from "./../utilities/helper";
import img from "../images/no-image-found.jpg";
import Spinner from "react-bootstrap/Spinner";

const NewsCard = (props) => {
  const DEFAULT_IMAGE = img;

  const [buttonText, setButtonText] = useState("Follow News");
  const [buttonVariant, setButtonVariant] = useState("outline-primary");
  const [isFollowed, setIsFollowed] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // Write task 11 (relatedArticles, setRelatedArticles constants) here

  // Write task 12 (isLoading, setIsLoading constants) here

  useEffect(() => {
    if (hasFollowedNews()) {
      const followedArticles = JSON.parse(
        localStorage.getItem("followed-articles")
      );
      followedArticles.forEach((followedArticle) => {
        if (
          JSON.stringify(followedArticle) === JSON.stringify(props.newsData)
        ) {
          setButtonText("Followed");
          setButtonVariant("primary");
          setIsFollowed(true);
        }
      });
    }
  });

  // write task 8 (date formatting function) here
  function formatPublishDate(utcDate) {
    const date = new Date(utcDate);
    return date.toLocaleString();
  }

  // write task 9 (follow news function) here
  function followNews() {
    if (localStorage.getItem("followed-articles") === null) {
      const followArticle = JSON.stringify([props.newsData]);
      localStorage.setItem("followed-articles", followArticle);
    } else {
      let followedArticles = JSON.parse(
        localStorage.getItem("followed-articles")
      );
      followedArticles.push(props.newsData);
      localStorage.setItem(
        "followed-articles",
        JSON.stringify(followedArticles)
      );
    }
    setButtonText("Followed");
    setButtonVariant("primary");
  }
  // write task 9 (unfollow news function) here
  const unfollowNews = () => {
    if (hasFollowedNews()) {
      let followedArticles = JSON.parse(
        localStorage.getItem("followed-articles")
      );
      followedArticles = followedArticles.filter((followedArticle) => {
        if (
          JSON.stringify(followedArticle) !== JSON.stringify(props.newsData)
        ) {
          return followedArticle;
        }
        return false;
      });

      localStorage.setItem(
        "followed-articles",
        JSON.stringify(followedArticles)
      );
    }
    setButtonText("Follow News");
    setButtonVariant("outline-primary");
    setIsFollowed(false);
  };

  // write task 11 (getFollowedNews function) here
  const getFollowedNews = async (title) => {
    if (hasFollowedNews) {
      let followedArticles = JSON.parse(
        localStorage.getItem("followed-articles")
      );

      const followedArticle = followedArticles.filter((followedArticle) => {
        return followedArticle.title === props.newsData.title;
      });
      const apiKey = `apiKey=${process.env.REACT_APP_NEWS_KEY}`;
      let query = `&q=${followedArticle[0].title}`;
      fetch(`${baseURL}/everything?${apiKey}${query}`)
        .then((res) => {
          return res.json();
        })
        .then((res) => setRelatedArticles(res.articles));
    }
  };

  const [showContent, setShowContent] = useState(false);

  return (
    <React.Fragment>
      <Card className="mb-4">
        <Card.Body className="card_content">
          <div className="row">
            <div className="col-3 col-sm-4 col-lg-2">
              <Card.Img
                alt="News Thumbnail"
                // write task 8 thumbnail solution here
                src={
                  props.newsData.urlToImage
                    ? props.newsData.urlToImage
                    : DEFAULT_IMAGE
                }
              />
            </div>
            <div className="col-8 col-lg-10">
              <div className="d-flex flex-wrap flex-lg-nowrap justify-content-between gap-2 ">
                <Card.Link
                  href={props.newsData.url} // write task 8 link solution here
                  target="_blank"
                >
                  {/* write task 8 title solution here */}
                  {props.newsData.title}
                </Card.Link>

                <Button
                  variant={buttonVariant}
                  className="follow-up rounded-pill"
                  size="sm"
                  // write task 9 on click event here
                  onClick={() => (isFollowed ? unfollowNews() : followNews())}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> {buttonText}
                </Button>
              </div>

              <div>Source: {props.newsData.source.name}</div>

              <small className="text-muted">
                Published at &nbsp;{" "}
                {formatPublishDate(props.newsData.publishedAt)}
              </small>

              <div style={{ display: showContent ? "block" : "none" }}>
                <Card.Text className="text-description mt-3">
                  {/* write task 8 content solution here */}
                  {props.newsData.content}
                </Card.Text>

                <div className="article-list">
                  {/* write task 12 related news spinner here */}
                  {relatedArticles.length === 0 ? (
                    "No related articles!"
                  ) : (
                    <ul>
                      {relatedArticles &&
                        relatedArticles.map((article) => {
                          return (
                            <li className="mt-2" key={article.url}>
                              <a
                                href={article.url}
                                target="_blank"
                                className="text-black"
                                rel="noreferrer"
                              >
                                {article.title}
                              </a>

                              <div className="source-text">
                                Source: {props.newsData.source.name}
                              </div>

                              <small className="text-muted">
                                Published at &nbsp;
                                {formatPublishDate(props.newsData.publishedAt)}
                              </small>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                  {/* write task 11 listing solution here */}
                </div>
              </div>
            </div>
          </div>

          <FontAwesomeIcon
            icon={faCircleChevronDown}
            type="button"
            className="float-end"
            onClick={() => {
              setShowContent(true);
              // write task 11 here
            }}
            style={{
              display: showContent ? "none" : "block",
            }}
          />

          <FontAwesomeIcon
            icon={faCircleChevronUp}
            type="button"
            className="float-end color text-primary "
            onClick={() => setShowContent(false)}
            style={{
              display: showContent ? "block" : "none",
            }}
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default NewsCard;
