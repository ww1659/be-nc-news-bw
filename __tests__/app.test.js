const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const localEndpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe("api", () => {
  test("GET:200 returns an object of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endPoints = response.body.endPoints;
        expect(endPoints).toEqual(localEndpoints);
      });
  });
});

describe("api/topics", () => {
  test("GET:200 returns an array of topic objects with properties of 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET:404 returns status 404 for a non-existent path", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});

describe("api/articles", () => {
  test("GET:200 returns an array of article objects with corresponding properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(13);
        expect(articles[0].comment_count).toBe("2");
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("GET:404 returns status 404 for a non-existent path", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path does not exist");
      });
  });
});

describe("api/articles/:article_id", () => {
  test("GET:200 returns an article object with corresponding properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        // const dateCreated = new Date(article.created_at);
        // expect(article[0]).toMatchObject({
        //   title: "Eight pug gifs that remind me of mitch",
        //   topic: "mitch",
        //   author: "icellusedkars",
        //   body: "some gifs",
        //   created_at: new Date(1604394720000),
        //   article_img_url:
        //     "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        // });
        article.forEach((article) => {
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars");
          expect(article.body).toBe("some gifs");
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article.votes).toBe(0);
          expect(article.article_id).toBe(3);
        });
      });
  });
  test("GET:404 returns status 404 and error message for a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/19")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist!");
      });
  });
  test("GET:400 returns status 400 and error message for an invalid article id", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Article Id");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 returns an array of comments for specific article Id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment.article_id).toEqual(5);
        });
      });
  });
  test("GET:200 returns status 200 and error message for an valid article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.comments.msg).toBe(
          "There are no comments for this article."
        );
      });
  });
  test("GET:404 returns status 404 and error message for a non existent article id", () => {
    return request(app)
      .get("/api/articles/23/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist!");
      });
  });
  test("GET:400 returns status 400 and error message for an invalid article id", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Article Id");
      });
  });
});
